<!-- 父组件无需使用new TMap时，直接引入即可，父组件使用了new TMap则需要判断TMap是否加载完成 -->
<template>
  <div
    class="tmap-component"
    tabindex="0"
    @focus="onMapEnable"
    @blur="onMapDisable"
    @keydown="onStopPropagation"
  >
    <div id="container" />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
const props = defineProps({
  latLng: {
    type: Object,
    default: () => null
  },
  address: {
    type: String,
    default: ''
  },
  // 图形列表
  graphs: {
    type: Array,
    default: () => []
  },
  // 坐标点是否跟随中心点移动
  isUpdateCoordinates: {
    type: Boolean,
    default: true
  },
  isShowControl: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['changeLatLng', 'setPolygonPath'])

// 监听坐标变化，更新标记
watch(() => props.latLng, (val) => {
  if (val) {
    cocateTimer && clearTimeout(cocateTimer)
    cocateTimer = null
    if (TMap) {
      onUpdateMarker(new TMap.LatLng(val.lat, val.lng))
    }
  }
})

let map = null
let cocateTimer = null
const init = () => {
  if (props.latLng) { // 是否存在坐标，存在则以坐标为中心点，不存在则以定位为中心点
    const mapCenter = new TMap.LatLng(props.latLng.lat, props.latLng.lng)// 设置中心点坐标
    map = new TMap.Map('container', {
      center: mapCenter,
      zoom: 10,
      showControl: !props.isShowControl // 是否显示地图上的控件
    })
    cocateTimer = setTimeout(() => {
      onUpdateMarker(mapCenter)
    }, 1500)
  } else {
    nextTick(() => {
      map = new TMap.Map('container', {
        zoom: 13,
        showControl: !props.isShowControl // 是否显示地图上的控件
      })
    })
    cocateTimer = setTimeout(() => {
      onLocate()
    }, 1500)
  }

  nextTick(() => {
    // 处理标记
    onHandleMarker()
    if (props.isUpdateCoordinates) {
      // // 移动后获取中心点坐标添加标记
      map.on('dragend', (evt) => {
        emits('changeLatLng', evt.target.getCenter())
      })
    }

    // 左键按下地图事件
    map.on('mousedown', () => {
      infoWindow.close() // 关闭信息窗关闭
    })
  })
}
let TMap = window.TMap

let defMapCenter = null // 默认中心点坐标
onMounted(() => {
  if (TMap) {
    defMapCenter = new TMap.LatLng(39.908821, 116.397469) // 默认天安门的经纬度
    ipLocation = new TMap.service.IPLocation()
    geocoder = new TMap.service.Geocoder()
    init()
  } else {
    document.getElementById('qqMap').src = `https://map.qq.com/api/gljs?v=1.exp&libraries=service,tools&key=${import.meta.env.VITE_APP_MAP_KEY}`
    onGetTMap()
  }
})
let time = null
const onGetTMap = () => {
  time = setTimeout(() => {
    TMap = window.TMap
    if (TMap) {
      time = null
      defMapCenter = new TMap.LatLng(23.136783, 113.327955)
      ipLocation = new TMap.service.IPLocation()
      geocoder = new TMap.service.Geocoder()
      init()
    } else {
      onGetTMap()
    }
  }, 500)
}

let markerLayer = null // 标记图层
let infoWindow = null // 窗体信息
const onHandleMarker = () => {
  markerLayer = new TMap.MultiMarker({
    id: 'marker-layer',
    map,
    styles: {
      marker: new TMap.MarkerStyle({
        width: 24,
        height: 32
      })
    }
  })

  // 初始化infoWindow
  infoWindow = new TMap.InfoWindow({
    map,
    position: defMapCenter,
    offset: { x: 0, y: -32 } // 设置信息窗相对position偏移像素
  })
  infoWindow.close()// 初始关闭信息窗关闭
  markerLayer.on('click', (evt) => {
    infoWindow.open()
    infoWindow.setPosition(evt.geometry.position)
    infoWindow.setContent(`<div class="info_card">${props.address || '店铺所在位置'}</div>`)
  })
}

let editor = null
let overlayId = 0
// 初始化几何图形和编辑器（无需编辑则无需调用）
const onInitGemotryEditor = (simplePath) => {
  editor = new TMap.tools.GeometryEditor({
    map, // 绑定的编辑器
    // 可编辑图层
    overlayList: [
      {
        overlay: new TMap.MultiPolygon({
          map,
          styles: {
            highlight: new TMap.PolygonStyle({
              color: 'rgba(255, 255, 255, 0.6)'
            })
          },
          geometries: [
            {
              id: 'polygonGeometries',
              paths: simplePath
            }
          ]
        }),
        id: 'polygon' + overlayId,
        selectedStyleId: 'highlight'
      }
    ],
    actionMode: TMap.tools.constants.EDITOR_ACTION.INTERACT, // 编辑器的工作模式
    activeOverlayId: 'polygon' + overlayId, // 激活图层
    selectable: true, // 开启点选功能
    snappable: true // 开启吸附
  })
  // 选中图形
  editor.select(['polygonGeometries'])
  // 添加修改事件监听
  editor.on('adjust_complete', (evtResult) => {
    emits('setPolygonPath', evtResult)
  })
  onMapDisable() // 地图聚焦后再允许修改
}

// 重置几何图形和编辑器
const onResetGemotryEditor = (simplePath) => {
  const id = overlayId
  overlayId++
  editor.addOverlay({
    overlay: new TMap.MultiPolygon({
      map,
      styles: {
        highlight: new TMap.PolygonStyle({
          color: 'rgba(255, 255, 255, 0.6)'
        })
      },
      geometries: [
        {
          id: 'polygonGeometries',
          paths: simplePath
        }
      ]
    }),
    id: 'polygon' + overlayId,
    selectedStyleId: 'highlight'
  })
  if (isDisable) {
    // 如果被禁用，则需要先选择当前图形
    onMapEnable()
  }
  // 删除当前图形与编辑图层，重新添加
  editor.delete()
  editor.removeOverlay('polygon' + id)
  editor.setActiveOverlay('polygon' + overlayId)
  editor.select(['polygonGeometries'])
  onMapDisable()
}

// 更新点标记
const onUpdateMarker = (latLng) => {
  markerLayer.updateGeometries([
    {
      id: 'marker-layer', // 点标注数据数组
      styleId: 'marker',
      styles: {
        marker: new TMap.MarkerStyle({
          width: 24,
          height: 32
        })
      },
      position: latLng
    }
  ])
  map.setCenter(latLng)
}

// 设置地图层级 3-20
const onSetZoom = (zoom) => {
  map.setZoom(zoom)
}

let ipLocation = null // 新建一个IP定位类
function onLocate () {
  ipLocation
    .locate({})
    .then((res) => {
      const { result } = res
      onUpdateMarker(result.location)
      emits('changeLatLng', result.location)
    })
    .catch(() => {
      onUpdateMarker(defMapCenter)
      emits('changeLatLng', defMapCenter)
    })
}

let geocoder = null // 新建一个正逆地址解析类
// 坐标转地址
const onGetAddress = (location) => {
  location = new TMap.LatLng(location.lat, location.lng)
  map.setCenter(location)
  return new Promise((resolve, reject) => {
    geocoder.getAddress({ location }) // 将给定的坐标位置转换为地址
      .then((res) => {
        // 显示搜索到的地址
        resolve(res.result)
      }).catch(err => {
        reject(err)
      })
  })
}
// 地址转坐标
const onGetLocation = (address) => {
  return new Promise((resolve, reject) => {
    geocoder.getLocation({ address }) // 将给定的坐标位置转换为地址
      .then((res) => {
        // 显示坐标数值
        map.setCenter(res.result.location)
        resolve(res.result.location)
      }).catch(err => {
        reject(err)
      })
  })
}

let isDisable = false // 是否禁用选点
/**
 *  禁用地图编辑选点
 */
const onMapDisable = () => {
  if (editor) {
    editor.disable()
    isDisable = true
  }
}
/**
 *  开启地图编辑选点
 */
const onMapEnable = () => {
  if (editor) {
    editor.enable()
    isDisable = false
    editor.select(['polygonGeometries'])
  }
}

/**
 * 阻止冒泡事件（禁止点击back键和del键来删除选区）
 * @param e
 */
const onStopPropagation = (e) => {
  if (e.keyCode === 46 || e.keyCode === 8) {
    e.stopPropagation()
  }
}

onUnmounted(() => {
  if (time) {
    clearTimeout(time)
  }
  // 销毁地图
  if (map) map.destroy()
})
defineExpose({
  onSetZoom,
  onGetAddress,
  onGetLocation,
  onInitGemotryEditor,
  onResetGemotryEditor,
  onMapDisable,
  onMapEnable
})

</script>

<style lang="scss" scoped>
.tmap-component {
  width: 100%;
  height: 100%;
  user-select: none;
  #container {
    width: 100%;
    height: 100%;
  }
}
</style>
<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style>
.info_card{
  font-size: 12px;
}
</style>
