<template>
  <div class="sku-container-component">
    <div class="spec-name">
      <div>
        <div
          v-if="sku[optionValue] && sku[optionValue] !== 0"
          class="value"
        >
          规格值
        </div>
      </div>
      <div class="spec-name-box">
        <div
          v-for="(item, index) in sku.leaf"
          :key="index"
          class="spec-name-int"
        >
          <div class="spec-name-int-tag">
            <div class="text">
              {{ item[optionText] }}
            </div>
            <el-icon
              class="close"
              @click="handleRemoveSkuLeaf(index)"
            >
              <Close />
            </el-icon>
          </div>
          <div
            v-if="hasSkuImage"
            class="img-box"
          >
            <div
              class="spec-imgbox"
            >
              <img-upload
                v-if="hasSkuImage"
                v-model="item.imgUrl"
                class="spec-img"
                @update:model-value="handleUploadSuccess(item, $event)"
              />
              <div
                v-if="hasSkuImage && item.imgUrl"
                class="preview-btn"
                @click="onPicturePreview(item.imgUrl)"
              >
                预览
              </div>
            </div>
            <div
              v-if="hasSkuImage && item.imgUrl"
              class="del-pic"
              @click="delSpecPic(item, index)"
            >
              删除
            </div>
          </div>
        </div>
        <!-- 新增 -->
        <div
          v-if="sku[optionValue] && sku[optionValue] !== 0"
          class="sku-item"
        >
          <el-popover
            v-model="visiable"
            placement="bottom"
            :disabled="selectNum > 100"
            trigger="click"
            width="320"
          >
            <el-select
              v-model="leafValue"
              class="popover-select"
              multiple
              filterable
              :disabled="multipleLimit === 0"
              allow-create
              :multiple-limit="multipleLimit"
              default-first-option
              :popper-append-to-body="false"
              placeholder="规格值"
              :teleported="false"
              style="width:100%"
              @change="createSkuLeaf"
              @visible-change="status => !status && handleSelectSku()"
            >
              <el-option
                v-for="item in skuOptions"
                :key="item[optionValue]"
                :label="item[optionText]"
                :value="item[optionValue]"
              />
            </el-select>
            <!-- 新增 -->
            <template #reference>
              <el-icon
                class="button-add  el-icon-plus"
                @click="addSku(sku[optionValue])"
              >
                <Plus />
              </el-icon>
            </template>
          </el-popover>
        </div>
      </div>
    </div>

    <!-- 图片预览 -->
    <picture-preview
      v-if="picturePreviewVisible"
      ref="picturePreviewRef"
    />
  </div>
</template>
<script setup>

import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()

const ease = inject('ease')

const props = defineProps({
  sku: {
    type: Object,
    default () {
      return {}
    }
  },
  hasSkuImage: {
    type: Boolean,
    default: false
  },
  onSkuLeafChange: {
    type: Function,
    default: () => { }
  },
  multipleLimit: {
    type: Number,
    default: 100
  }
})

const emit = defineEmits(['update:sku'])

const Data = reactive({
  visiable: false,
  leafValue: [],
  skuOptions: [],
  id: 0,
  picturePreviewVisible: false // 预览图片弹窗
})

const { visiable, leafValue, picturePreviewVisible, skuOptions } = toRefs(Data)

const optionValue = computed(() => ease.optionValue)
const optionText = computed(() => ease.optionText)

// 添加后的sku数量
const selectNum = computed(() => {
  if (ease.setSalesAttrs.value.length === 1) { // 只有一个规格名时
    return ease.setSalesAttrs.value[0].leaf.length + 1
  } else if (ease.setSalesAttrs.value.length > 1) { // 有多个规格名时
    // 过滤掉当前的规格名
    const attrsLsit = ease.setSalesAttrs.value.filter((el) => el.id !== props.sku.id)
    // 规格值数量
    let num = 0
    attrsLsit.forEach((el) => {
      if (num === 0) {
        num = el.leaf?.length
      } else {
        num = num * el.leaf?.length
      }
    })
    return (props.sku.leaf.length + 1) * num
  } else {
    return 0
  }
})

// 当前sku数量
const skuNum = computed(() => {
  if (ease.setSalesAttrs.value.length === 1) { // 只有一个规格名时
    return ease.setSalesAttrs.value[0].leaf.length
  } else if (ease.setSalesAttrs.value.length > 1) { // 有多个规格名时
    // 过滤掉当前的规格名
    const attrsLsit = ease.setSalesAttrs.value.filter((el) => el.id !== props.sku.id)
    // 规格值数量
    let num = 0
    attrsLsit.forEach((el) => {
      if (num === 0) {
        num = el.leaf?.length
      } else {
        num = num * el.leaf?.length
      }
    })
    return (props.sku.leaf.length ? props.sku.leaf.length : 1) * num
  } else {
    return 0
  }
})

const setSku = computed({
  get () {
    return props.sku
  },
  set (val) {
    emit('update:sku', val)
  }
})

watch(() => props.sku, (sku) => {
  fetchLeafById(sku[optionValue.value])
})

onBeforeMount(() => {
  props.sku[optionValue] && fetchLeafById(props.sku[optionValue.value])
})

const handleHideVisiable = () => {
  Data.visiable = false
}

const handleResetLeafValue = () => {
  Data.leafValue = []
}

const addSku = (id) => {
  if (selectNum.value > 100) {
    ElMessage.error(
      `${'当前已添加' +
      skuNum.value +
      '组商品规格'}（${'最多可添加' +
      100 +
      '组'}），该规格名下不可添加`
    )
    return
  }
  fetchLeafById(id)
}

const fetchLeafById = (id) => {
  if (!id) return
  ease.onFetchSku(id).then(skuOptions => {
    Data.id = id
    Data.skuOptions = skuOptions
    const skuList = []
    // 筛选未选择的属性
    Data.skuOptions.forEach(skuItem => {
      if (props.sku.leaf.some(item => item.id === skuItem.id)) {
        skuItem.id = new Date().getTime()
      }
      if (!props.sku.leaf.some(item => item.text === skuItem.text)) {
        skuList.push(skuItem)
      }
    })
    Data.skuOptions = skuList
  })
}

const handleRemoveSkuLeaf = (index) => {
  setSku.value.leaf.splice(index, 1)
  props.onSkuLeafChange(setSku.value.leaf)
}

const filterSkuOptions = (data) => {
  const oldSellData = []
  const addSelData = []
  const skuOptionsPra = Data.skuOptions
  data.forEach(item => {
    if (skuOptionsPra.find(skuItem => skuItem.id === item)) {
      oldSellData.push(item)
    } else {
      addSelData.push(item)
    }
  })
  return {
    oldSellData, addSelData
  }
}

const createSkuLeaf = (selVal) => {
  // 判断空格
  const idx = selVal.length - 1
  const curVal = selVal[idx] ? String(selVal[idx]) : ''
  const reg = /[\\;\\；]/g
  // 特殊符号
  if (reg.test(curVal)) {
    Data.leafValue.splice(idx, 1)
    ElMessage({
      message: '不允许包含特殊字符;',
      type: 'error',
      duration: 1500
    })
    return
  }
  if (!curVal.trim()) {
    Data.leafValue.splice(idx, 1)
    return
  }
  // 过滤需要新增的规格值
  // data = data.filter(item => typeof (item) === 'string')
  const { addSelData, oldSellData } = filterSkuOptions(selVal)
  if (!addSelData.length) return
  ease.onCreateSku({
    data: addSelData,
    id: props.sku[optionValue.value]
  }).then((processedNewOptions) => {
    if (processedNewOptions[0].text.length > 20) {
      ElMessage({
        message: '规格名长度不可超过20个字符',
        duration: 1500
      })
      processedNewOptions = []
    }
    Data.skuOptions.push(...processedNewOptions)
    nextTick(() => {
      const values = processedNewOptions.map(item => item.id).concat(oldSellData)
      Data.leafValue = values
    })
  })
}

const skuOptionsNum = (numPra) => {
  if (ease.setSalesAttrs.value.length === 1) { // 只有一个规格名时
    return ease.setSalesAttrs.value[0].leaf.length + numPra
  } else if (ease.setSalesAttrs.value.length > 1) { // 有多个规格名时
    // 过滤掉当前的规格名
    const attrsLsit = ease.setSalesAttrs.value.filter((el) => el.id !== props.sku.id)
    // 规格值数量
    let num = 0
    attrsLsit.forEach((el) => {
      if (num === 0) {
        num = el.leaf?.length
      } else {
        num = num * el.leaf?.length
      }
    })
    return (props.sku.leaf.length + numPra) * num
  } else {
    return 0
  }
}

const handleSelectSku = () => {
  const skuLeaf = []
  if (skuOptionsNum(Data.leafValue.length) > 100) {
    ElMessage.error(
      `${'当前已添加' +
      skuNum.value +
      '组商品规格'}（${'最多可添加' +
      100 +
      '组'}），该规格名下不可添加`
    )
    return
  }
  Data.leafValue.forEach(el => {
    const arr = Data.skuOptions.filter(item => {
      return item[optionValue.value] === el
    })

    if (arr && arr.length > 0) {
      skuLeaf.push(arr[0])
    }
  })

  // let skuLeaf = skuOptions.filter(item => leafValue.indexOf(item[optionValue]) >= 0)
  skuLeaf.forEach(item => {
    item.is_show = props.hasSkuImage
    item.imgUrl = ''
  })

  const skuLeafIds = props.sku.leaf.map(item => item[optionValue.value])

  skuLeaf.forEach(item => {
    if (skuLeafIds.indexOf(item[optionValue.value]) < 0) {
      setSku.value.leaf.push(item)
    }
  })

  // 过滤同名规格值
  for (let i = 0; i < props.sku.leaf.length; i++) {
    for (let j = i + 1; j < props.sku.leaf.length; j++) {
      if (props.sku.leaf[i][optionText.value] === props.sku.leaf[j][optionText.value]) {
        setSku.value.leaf.splice(i, 1)
        j--
      }
    }
  }

  handleResetLeafValue()
  handleHideVisiable()
  props.onSkuLeafChange(props.sku.leaf)
}

// 添加规格值图片
const handleUploadSuccess = (item, urls) => {
  setSku.value.leaf.forEach(el => {
    if (el.id === item.id) {
      el.imgUrl = urls
      el.is_show = true
      proxy.$forceUpdate()
    }
  })
  ease.onHandleSkuValueImg(props.sku)
}

const picturePreviewRef = ref(null)
// 图片预览
const onPicturePreview = (imgUrl) => {
  Data.picturePreviewVisible = true
  nextTick(() => {
    picturePreviewRef.value.init(imgUrl)
  })
}

// 删除图片
const delSpecPic = (item, index) => {
  setSku.value.leaf[index].imgUrl = ''
  proxy.$forceUpdate()
  ease.onHandleSkuValueImg(props.sku)
}
</script>

<style lang="scss" scoped>
.sku-container-component {

  .button-add {
    border-radius: 50%;
    padding: 3px;
    background-color: #fff;
    color: #155bd4;
    font-weight: bold;
    border: 1px solid #155bd4;
    font-size: 19px;

  }

  .spec-name {
    display: flex;
    margin: 15px 5px;
    margin-bottom: 0;

    .value {
      padding: 5px 15px 0 0;
      white-space: nowrap;
    }

    .spec-name-box {
      display: flex;
      flex-wrap: wrap;
    }

    // 属性名称
    .spec-name-int {
      width: 150px;
      padding: 10px 10px 10px 10px;
      border: 1px solid #DCDCDC;
      display: inline-block;
      margin-bottom: 15px;
      margin-right: 10px;
      vertical-align: top;

      .spec-name-int-tag {
        line-height: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .text {
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .close {
          font-size: 14px;
          color: #999;
          cursor: pointer;
        }
      }

      // 属性图片
      .img-box {
        display: flex;
        align-items: flex-end;
        margin-top: 10px;

        .spec-imgbox {
          display: block;
          width: 80px;
          height: 80px;
          position: relative;

          .preview-btn {
            display: none;
            width: 100%;
            position: absolute;
            bottom: -1px;
            left: 1px;
            font-size: 12px;
            line-height: 1.5em;
            color: #fff;
            text-align: center;
            border-radius: 0 0 6px 6px;
            background: rgba(0, 0, 0, 0.3);
            cursor: pointer;
          }

          :deep(.spec-img) {

            // margin-left: 25px;
            // sku上传图片组件大小修改
            .plugin-images {
              .el-upload {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 80px;
                height: 80px;

                .pic-uploader-icon {
                  width: 80px;
                  height: 80px;
                  line-height: 80px;
                  font-size: 18px;
                }

                .pic {
                  width: auto;
                  max-width: 80px;
                  height: auto;
                  max-height: 80px;
                }
              }
            }
          }
        }

        .spec-imgbox:hover .preview-btn {
          display: block;
        }

        .del-pic {
          font-size: 12px;
          color: #155bd4;
          margin-left: 5px;
          line-height: 1.5em;
          cursor: pointer;
        }
      }

    }

    .sku-item {
      margin-top: 10px;
      align-content: center;
      display: inline-block;

      .popover-select {
        width: 100%;
      }
    }
  }
}
</style>
