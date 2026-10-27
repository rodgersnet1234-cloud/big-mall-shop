<template>
  <div class="page-station-add-or-update">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{ pageTitle }}
      </div>
    </div>
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="100px"
      style="min-width:630px;"
    >
      <el-form-item
        prop="stockMode"
        label="库存模式"
      >
        <el-radio-group
          v-model="dataForm.stockMode"
          :disabled="!!dataForm.stationId"
        >
          <el-radio :label="1">
            共享总部库存
            <el-tooltip
              class="box-item"
              effect="dark"
              content="门店产生销售时，扣减默认仓库的商品库存"
              placement="top"
            >
              <el-icon style="vertical-align: middle">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </el-radio>
          <el-radio :label="2">
            独立销售库存
            <el-tooltip
              class="box-item"
              effect="dark"
              content="门店产生销售时，扣减该门店的商品库存"
              placement="top"
            >
              <el-icon style="vertical-align: middle">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        class="stationName"
        :label="$t('delivery.station.stationNames')"
        prop="stationName"
        style="width:624px;"
      >
        <el-input
          v-model="dataForm.stationName"
          maxlength="20"
          show-word-limit
          @change="onCheckStationNames"
        />
      </el-form-item>
      <el-form-item
        label="门店logo"
        prop="logo"
      >
        <div class="part-form-item">
          <imgs-upload
            v-model:modelValue="dataForm.imgUrl"
            :limit="1"
          />
          <div class="upload-tips">
            建议图片尺寸为 80*80像素
          </div>
        </div>
      </el-form-item>
      <el-form-item
        label="门店图片"
        prop="imgUrl"
      >
        <div class="part-form-item">
          <imgs-upload
            v-model:modelValue="dataForm.imgUrls"
          />
          <div class="upload-tips">
            最多上传9张
          </div>
        </div>
      </el-form-item>
      <el-form-item
        :label="$t('admin.phoNumber')"
        prop="mobile"
      >
        <el-input
          v-model="dataForm.mobilePrefix"
          style="width: 140px"
          :placeholder="$t('admin.areaCode')"
          maxlength="10"
          @change="onCheckPhonePrefix"
        />
        <span>—</span>
        <el-input
          v-model="dataForm.mobile"
          style="width: 320px"
          :placeholder="$t('admin.number')"
          maxlength="11"
          @change="checkMobile"
        />
      </el-form-item>
      <el-form-item
        :label="$t('admin.businTime')"
        prop="shopTime"
      >
        <el-time-picker
          v-model="timeDateModeVO.shopTime[0]"
          :clearable="false"
          format="HH:mm"
          :placeholder="$t('admin.businStartTime')"
          @change="onStartChange"
        />
        <span style="margin: 0 10px;">{{ $t('admin.timeTip') }}</span>
        <el-time-picker
          v-model="timeDateModeVO.shopTime[1]"
          :clearable="false"
          format="HH:mm"
          :placeholder="$t('admin.businEndTime')"
          @change="onEndChange"
        />
      </el-form-item>
      <el-form-item :label="$t('delivery.station.businessStatus')">
        <el-radio-group
          v-model="status"
          :disabled="dataForm.status > 1||dataForm.shopStatus !== 1"
        >
          <el-radio :label="1">
            {{ $t('delivery.station.business') }}
          </el-radio>
          <el-radio :label="0">
            {{ $t('delivery.station.close') }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        class="is-required"
        :label="'门店用途'"
      >
        <el-checkbox
          v-model="dataForm.selfPickup"
          :true-label="1"
          :false-label="0"
          label="到店自提/核销"
        />
        <el-checkbox
          v-model="dataForm.sameCityDelivery"
          :true-label="1"
          :false-label="0"
          label="同城配送"
        />
        <div class="tips">
          门店都将提供虚拟商品核销服务
        </div>
      </el-form-item>

      <template v-if="dataForm.sameCityDelivery===1">
        <el-form-item :label="$t('shop.charges') + '：'">
          <div>
            <el-radio
              v-model="dataForm.sameCityDTO.chargeType"
              :label="1"
            >
              {{
                $t("shop.chaDelFeeByReg")
              }}
            </el-radio>
            <el-radio
              v-model="dataForm.sameCityDTO.chargeType"
              :label="2"
            >
              {{
                $t("shop.delFeeChaDis")
              }}
            </el-radio>
            <div
              v-if="dataForm.sameCityDTO.chargeType === 1"
              class="charges-tips"
            >
              配送区域内商品会不计算距离，按区域收取固定配送费。
            </div>
            <div
              v-else
              class="charges-tips"
            >
              配送费按地图直线距离计算。
            </div>
          </div>
        </el-form-item>
        <el-form-item
          :label="$t('shop.startingFeeY') + '：'"
          prop="startFee"
        >
          <el-col :span="6">
            <el-input-number
              v-model="dataForm.sameCityDTO.startFee"
              :max="100000"
              :placeholder="$t('shop.startingFee')"
              :precision="2"
              :step="0.01"
              :min="0.0"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          v-if="dataForm.sameCityDTO.chargeType === 1"
          :label="$t('shop.deliveryFeeY') + '：'"
          prop="deliveryFee"
        >
          <el-col :span="6">
            <el-input-number
              v-model="dataForm.sameCityDTO.deliveryFee"
              :max="100000"
              :placeholder="$t('shop.deliveryFee')"
              :min="0.00"
              :precision="2"
              :step="0.01"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          v-if="dataForm.sameCityDTO.chargeType === 2"
          :label="$t('shop.costAllocation') + '：'"
          style="color: gray"
          prop="defaultDistance"
        >
          <el-input-number
            v-model="dataForm.sameCityDTO.defaultDistance"
            :max="100000"
            :precision="1"
            :min="0.1"
            :step="0.1"
          />
          <span style="font-size: 15px">{{ $t("shop.withinKm") }}</span>
          <el-input-number
            v-model="dataForm.sameCityDTO.deliveryFee"
            :max="100000"
            :min="0.00"
            :precision="2"
            :step="0.01"
          />
          <span style="font-size: 15px">{{ $t("shop.yuanToChaDelFee") }}</span>
          <el-input-number
            v-model="dataForm.sameCityDTO.overDistance"
            :max="100000"
            :precision="1"
            :step="0.1"
            :min="0.1"
          />
          <span style="font-size: 15px">km，{{ $t("shop.incInDelFees") }}</span>
          <el-input-number
            v-model="dataForm.sameCityDTO.overDistanceFee"
            :max="100000"
            :precision="2"
            :step="0.01"
            :min="0.01"
          />
          <span style="font-size: 15px">{{ $t("admin.dollar") }}。</span>
        </el-form-item>
        <el-form-item
          :label="$t('shop.renewalCharge') + '：'"
          prop="prodName"
          style="color: gray"
        >
          <span style="font-size: 15px">{{ $t("shop.commodityWeight") }}</span>
          <el-input-number
            v-model="dataForm.sameCityDTO.freeWeight"
            :max="100000"
            :precision="2"
            :step="0.01"
            :min="0.01"
            :placeholder="$t('shop.pleaseEnterTheWeight')"
          />
          <span style="font-size: 15px">{{ $t("shop.noExtraCharge") }}</span>
          <el-input-number
            v-model="dataForm.sameCityDTO.overWeight"
            :max="100000"
            :precision="2"
            :step="0.01"
            :min="0.01"
            :placeholder="$t('shop.pleaseEnterTheWeight')"
          />
          <span
            style="font-size: 15px"
          >kg，{{ $t("shop.renewalFeeIncrease") }}</span>
          <el-input-number
            v-model="dataForm.sameCityDTO.overWeightFee"
            :max="100000"
            :precision="2"
            :step="0.01"
            :min="0.01"
          />
          <span style="font-size: 15px">{{ $t("admin.dollar") }}。</span>
        </el-form-item>
      </template>

      <el-form-item
        :label="$t('delivery.station.shopAddr')"
        prop="currentAddr"
      >
        <el-cascader
          ref="cascaderAddrRef"
          v-model="dataForm.currentAddr"
          style="width: 300px"
          :options="addrList"
          :props="addrListTreeProps"
          placeholder="请选择所在地区"
          @change="handleAddrChange"
        />
      </el-form-item>

      <el-form-item
        class="addr"
        :label="$t('delivery.station.shopDetailAddr')"
        prop="addr"
      >
        <el-input
          v-model="dataForm.addr"
          style="width: 742px"
          maxlength="100"
          show-word-limit
          @change="onMapLocation(true)"
        />
      </el-form-item>
      <el-form-item>
        <div class="map">
          <tmap
            ref="tmapRef"
            :lat-lng="latLng"
            :is-update-coordinates="false"
            @set-polygon-path="onSetPolygonPath"
            @change-lat-lng="onChangeLatLng"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          link
          type="primary"
          @click="onResetMapPoint()"
        >
          重置
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="close"
        >
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          {{ $t('table.submit') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import * as api from '@/api/delivery/station'
import { listAreaOfEnable } from '@/api/delivery/transport'
import { ElMessage } from 'element-plus'
import { onMounted } from 'vue'
import Big from 'big.js'

const dataForm = reactive({
  stationId: null,
  stationName: null,
  imgUrl: null,
  imgUrls: '',
  mobilePrefix: null,
  stockMode: 1,
  mobile: null,
  startTime: '',
  endTime: '',
  status: 1,
  provinceId: null,
  shopStatus: 1,
  province: null,
  cityId: null,
  city: null,
  areaId: null,
  area: null,
  addr: null,
  lng: 116.397469,
  lat: 39.908821,
  timeDateModeVO: {},
  selfPickup: 0, // 自提门店用途是否支持自提（0：不支持，1：支持）
  sameCityDelivery: 0, // 自提门店用途是否支持同城配送（0：不支持，1：支持）
  sameCityDTO: {
    chargeType: 1,
    polygonPath: [],
    startFee: 0.00,
    deliveryFee: 0.00,
    defaultDistance: 0.0,
    overDistance: 0.0,
    overDistanceFee: 0.00,
    freeWeight: 0.0,
    overWeight: 0.0,
    overWeightFee: 0.00
  }

})
const timeDateModeVO = reactive({
  shopTime: [new Date(2020, 1, 1, 8, 0, 0), new Date(2020, 1, 1, 20, 0, 0)]
})

const validateShopTime = (rule, value, callback) => {
  if (!timeDateModeVO.shopTime) {
    callback(new Error($t('admin.seleBusTime')))
  } else {
    callback()
  }
}
const validateStationName = (rule, value, callback) => {
  if (!value.trim()) {
    callback(new Error($t('admin.stationNameNoNull')))
  } else {
    callback()
  }
}
const validateAddr = (rule, value, callback) => {
  if (!value.trim()) {
    callback(new Error($t('admin.addrNoNull')))
  } else {
    callback()
  }
}

const dataRule = {
  stationName: [
    { required: true, message: $t('admin.stationNameNoNull'), trigger: 'blur' },
    { validator: validateStationName, trigger: 'blur' }
  ],
  shopTime: [
    { validator: validateShopTime, trigger: 'blur' }
  ],
  currentAddr: [
    { required: true, message: '请选择所在地区', trigger: ['blur', 'change'] }
  ],
  addr: [
    { required: true, message: $t('admin.addrNoNull'), trigger: 'blur' },
    { validator: validateAddr, trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: $t('admin.numberNoNull'), trigger: 'blur' }
  ]
}

const onStartChange = (val) => {
  if (!val) {
    timeDateModeVO.shopTime[0] = new Date(2020, 1, 1, 8, 0, 0)
  }
}
const onEndChange = (val) => {
  if (!val) {
    timeDateModeVO.shopTime[1] = new Date(2020, 1, 1, 20, 0, 0)
  }
}

const route = useRoute()
const pageTitle = ref('')

onMounted(() => {
  const stationId = +route.query.stationId
  pageTitle.value = stationId ? '编辑门店' : '新增门店'
  if (TMap) {
    init(stationId)
  } else {
    onGetTMap(stationId)
  }
})

let time = null
const onGetTMap = (stationId) => {
  time = setTimeout(() => {
    TMap = window.TMap
    if (TMap) {
      time = null
      init(stationId)
    } else {
      onGetTMap(stationId)
    }
  }, 500)
}

onUnmounted(() => {
  if (time) {
    clearTimeout(time)
  }
})

const dataFormRef = ref()
const isSubmit = ref(false)
const show = ref(false)
const status = ref(1)
const visible = ref(false)
const init = (stationId) => {
  dataForm.stationId = stationId || 0
  visible.value = true
  show.value = false
  isSubmit.value = false
  onGetAddrList()
  nextTick(() => {
    status.value = 1
    dataFormRef.value?.resetFields()
    dataForm.provinceId = null
    dataForm.cityId = null
    dataForm.areaId = null
    dataForm.phonePrefix = null
    timeDateModeVO.shopTime = [new Date(2020, 1, 1, 8, 0, 0), new Date(2020, 1, 1, 20, 0, 0)]
    if (dataForm.stationId) {
      onGetDataInfo()
    } else {
      const points = onGetPoint({ shopLng: dataForm.lng, shopLat: dataForm.lat })
      polygonPath.length = 0
      polygonPath.push(...points)
      nextTick(() => {
        isConfigureAreaDefault.value = true
        tmapRef.value?.onInitGemotryEditor(polygonPath)
        tmapRef.value?.onSetZoom(13)
      })
    }
  })
}

const isConfigureAreaDefault = ref(false)
// 获取店铺详情数据
const onGetDataInfo = () => {
  api.getStationInfo(
    dataForm.stationId
  ).then((data) => {
    if (data.sameCityVO) {
      data.sameCityVO.startFee = data.sameCityVO.startFee / 100
      data.sameCityVO.deliveryFee = data.sameCityVO.deliveryFee / 100
      data.sameCityVO.overWeightFee = data.sameCityVO.overWeightFee / 100
      data.sameCityVO.overDistanceFee = data.sameCityVO.overDistanceFee / 100
    }
    onHandleDataForm(data)
    status.value = dataForm.status === 1 ? 1 : 0
    timeDateModeVO.shopTime = JSON.parse(data.timeInfo).shopTime
    if (data.lat && data.lng) {
      latLng.value = {
        lng: data.lng,
        lat: data.lat
      }
    }

    if (!polygonPath || polygonPath.length <= 0) {
      const points = onGetPoint({ shopLng: dataForm.lng, shopLat: dataForm.lat })
      polygonPath.length = 0
      polygonPath.push(...points)
      nextTick(() => {
        isConfigureAreaDefault.value = true
        tmapRef.value?.onInitGemotryEditor(polygonPath)
        tmapRef.value?.onSetZoom(13)
      })
    } else {
      const polygonArray = JSON.parse(JSON.stringify(polygonPath))
      polygonPath.length = 0
      polygonArray.forEach((item) => {
        const TMap = window.TMap
        const point = new TMap.LatLng(item.lat, item.lng)
        polygonPath.push(point)
      })
      tmapRef.value?.onInitGemotryEditor(polygonPath)
      tmapRef.value?.onSetZoom(13)
    }
  })
}

const onCheckStationNames = () => {
  dataForm.stationName = dataForm.stationName.trim()
}

const onCheckPhonePrefix = () => {
  if (dataForm.mobilePrefix) {
    const reg = /^[0-9]*$/
    if (!reg.test(dataForm.mobilePrefix)) {
      onShowErrorMessage($t('admin.onlyInNum'))
      dataForm.mobilePrefix = null
      return false
    }
  }
}

const checkMobile = () => {
  if (dataForm.mobile) {
    const reg = /^[0-9]*$/
    if (!reg.test(dataForm.mobile)) {
      onShowErrorMessage($t('admin.onlyInNum'))
      dataForm.mobile = null
      return false
    }
  }
}

// 表单提交
const isEditAddr = ref(false)
const onSubmit = () => {
  if (isEditAddr.value) {
    ElMessage.info($t('admin.mapPosi'))
    return
  }

  if (!dataForm.selfPickup && !dataForm.sameCityDelivery) {
    ElMessage.error('请选择门店用途')
    return
  }
  dataForm.sameCityDTO.polygonPath = polygonPath
  dataForm.lng = latLng.value.lng
  dataForm.lat = latLng.value.lat
  const timeDateMode = timeDateModeVO
  if (timeDateMode.shopTime) {
    if (timeDateMode.shopTime[0] instanceof Date) {
      timeDateMode.shopTime[0] = timeDateMode.shopTime[0].getTime()
    }
    if (timeDateMode.shopTime[1] instanceof Date) {
      timeDateMode.shopTime[1] = timeDateMode.shopTime[1].getTime()
    }
    dataForm.timeInfo = JSON.stringify(timeDateMode)
  }
  if (!dataForm.areaId) {
    ElMessage.error('请选择所在地区')
    return
  }
  if (dataForm.sameCityDelivery) {
    // 开启同城配送时检测是否框选配送区域
    let flag = false
    for (let i = 0; i < polygonPath.length; i++) {
      if (polygonPath[i].lat.toString().split('.')[1].length > 6) {
        flag = true
        break
      }
    }
    if (!flag) {
      ElMessage.error('请点击地图配置门店配送区域')
      return
    }
  }
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (isSubmit.value) {
        return false
      }
      isSubmit.value = true
      dataForm.status = dataForm.status > 1 ? dataForm.status : status.value
      // 新增or更新
      onGetSaveOrUpdateReq(dataForm)
        .then(() => {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              visible.value = false
              close()
            }
          })
        }).catch(() => {
          isSubmit.value = false
        })
    }
  })
}

// 获取新增or更新请求
const onGetSaveOrUpdateReq = (dataForm) => {
  const dataFormPar = JSON.parse(JSON.stringify(dataForm))
  if (dataFormPar.sameCityDTO) {
    dataFormPar.sameCityDTO.startFee = dataFormPar.sameCityDTO.startFee * 100
    dataFormPar.sameCityDTO.deliveryFee = dataFormPar.sameCityDTO.deliveryFee * 100
    dataFormPar.sameCityDTO.overWeightFee = dataFormPar.sameCityDTO.overWeightFee * 100
    dataFormPar.sameCityDTO.overDistanceFee = dataFormPar.sameCityDTO.overDistanceFee * 100
    dataFormPar.sameCityDTO.lat = dataFormPar.lat
    dataFormPar.sameCityDTO.lng = dataFormPar.lng
  }
  if (dataFormPar.stationId) {
    return api.updateStation(dataFormPar)
  } else {
    return api.saveStation(dataFormPar)
  }
}

const onShowErrorMessage = (msg) => {
  ElMessage({
    message: msg,
    type: 'error',
    duration: 1500
  })
}

// 腾讯地图
const tmapRef = ref(null)
const latLng = ref(null)
/**
 *
 * @param {Boolean} isTrue true 地址转经纬度； false|null 经纬度转地址
 */
const onMapLocation = (isTrue) => {
  let address = ''
  const { provinceId, province, cityId, city, areaId, area, addr } = dataForm
  if (isTrue) {
    // 选择省市区时，定位地图
    if (provinceId) {
      address = province
      tmapRef.value.onSetZoom(6)
      if (cityId) {
        address = address + city
        tmapRef.value.onSetZoom(10)
        if (areaId) {
          address = address + area
          tmapRef.value.onSetZoom(13)
          if (addr) {
            // 详细地址
            address = address + addr
            tmapRef.value.onSetZoom(13)
          }
        }
      }
    }
    if (address) {
      tmapRef.value.onGetLocation(address).then(res => {
        onChangeLatLng(res)
      })
    }
  } else {
    if (!provinceId || !cityId || !areaId) {
      dataForm.detailAddress = null
      ElMessage({
        message: $t('admin.selePCD'),
        type: 'error',
        duration: 1000
      })
      return
    }
    tmapRef.value.onGetAddress(latLng.value).then(res => {
      dataForm.detailAddress = res.formatted_addresses?.recommend || res.address
    })
    tmapRef.value.onSetZoom(13)
  }
}

let TMap = window.TMap
/**
 * 获取区域点坐标
 * @param latLng
 * @returns {[TMap.LatLng,TMap.LatLng,TMap.LatLng,TMap.LatLng]}
 */
const onGetPoint = (latLng) => {
  const lng = new Big(Number.parseFloat(latLng.shopLng))
  const lat = new Big(Number.parseFloat(latLng.shopLat))
  const point1 = new TMap.LatLng(
    Number.parseFloat(lat),
    Number.parseFloat(lng)
  )
  const point2 = new TMap.LatLng(
    Number.parseFloat(lat.plus(0.01)),
    Number.parseFloat(lng.plus(0.01))
  )
  const point3 = new TMap.LatLng(
    Number.parseFloat(lat.plus(0.02)),
    Number.parseFloat(lng.plus(0.02))
  )
  const point4 = new TMap.LatLng(
    Number.parseFloat(lat.plus(0.01001)),
    Number.parseFloat(lng.plus(0.01001))
  )
  return [point1, point2, point3, point4]
}

const polygonPath = []
// 修改经纬度
const onChangeLatLng = (latLngInfo) => {
  const { lng, lat } = latLngInfo
  latLng.value = latLngInfo
  dataForm.lng = lng
  dataForm.lat = lat

  // 更改坐标点后，重新设置地图选区
  const points = onGetPoint({ shopLng: dataForm.lng, shopLat: dataForm.lat })
  polygonPath.length = 0
  polygonPath.push(...points)
  nextTick(() => {
    isConfigureAreaDefault.value = true
    tmapRef.value?.onResetGemotryEditor(polygonPath)
  })
}

const onSetPolygonPath = (data) => {
  polygonPath.length = 0
  polygonPath.push(...data.paths)
  isConfigureAreaDefault.value = false
}

const onHandleDataForm = (data) => {
  dataForm.stationId = data.stationId
  dataForm.stationName = data.stationName
  dataForm.imgUrl = data.imgUrl
  dataForm.mobilePrefix = data.mobilePrefix
  dataForm.mobile = data.mobile
  dataForm.startTime = data.startTime
  dataForm.shopId = data.shopId
  dataForm.endTime = data.endTime
  dataForm.status = data.status
  dataForm.provinceId = data.provinceId
  dataForm.stockMode = data.stockMode
  dataForm.province = data.province
  dataForm.cityId = data.cityId
  dataForm.city = data.city
  dataForm.shopStatus = data.shopStatus
  dataForm.areaId = data.areaId
  dataForm.area = data.area
  dataForm.addr = data.addr
  dataForm.imgUrls = data.imgUrls
  dataForm.lng = data.lng
  dataForm.lat = data.lat
  dataForm.timeDateModeVO = data.timeDateModeVO
  dataForm.selfPickup = data.selfPickup
  dataForm.sameCityDelivery = data.sameCityDelivery
  dataForm.sameCityDTO = data.sameCityVO || {
    chargeType: 1,
    polygonPath: [],
    startFee: 0.00,
    deliveryFee: 0.00,
    defaultDistance: 0.0,
    overDistance: 0.0,
    overDistanceFee: 0.00,
    freeWeight: 0.0,
    overWeight: 0.0,
    overWeightFee: 0.00
  }
  dataForm.currentAddr = [
    data.provinceId,
    data.cityId,
    data.areaId
  ]
  polygonPath.length = 0
  polygonPath.push(...dataForm.sameCityDTO.polygonPath)
}

/**
 * 省市区
 */
const onGetAddrList = () => {
  listAreaOfEnable({}).then(data => {
    addrList.value = treeDataTranslate(data, 'areaId', 'parentId')
  })
}

const addrList = ref([])
const addrListTreeProps = reactive({
  value: 'areaId',
  label: 'areaName'
})
/**
 * 监听地址改变
 */
const cascaderAddrRef = ref(null)
const handleAddrChange = (value) => {
  if (value.length > 0) {
    const labels = cascaderAddrRef.value.getCheckedNodes()[0].pathLabels
    dataForm.province = labels[0]
    dataForm.provinceId = value[0]
    dataForm.city = labels[1]
    dataForm.cityId = value[1]
    dataForm.area = labels[2]
    dataForm.areaId = value[2]
    onMapLocation(true)
  }
}

const router = useRouter()
const close = () => {
  router.push({
    path: '/stock/warehouse-store/station'
  })
}
const onResetMapPoint = () => {
  isConfigureAreaDefault.value = true
  dataForm.sameCityDTO.polygonPath = null
  polygonPath.length = 0
  const points = onGetPoint({ shopLng: dataForm.lng, shopLat: dataForm.lat })
  polygonPath.push(...points)
  tmapRef.value?.onResetGemotryEditor(polygonPath)
  ElMessage({
    message: '操作成功',
    type: 'success',
    duration: 1500
  })
}
defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.page-station-add-or-update {

  .new-page-title{
    width: 100%;
    height: 62px;
    background: #f7f8fa;
    box-sizing: border-box;
    padding: 19px 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-bottom: 20px;
  }
  .new-page-title .line{
    width: 4px;
    height: 19px;
    background: #155bd4;
    opacity: 1;
    border-radius: 2px;
    margin-right: 10px;
  }
  .new-page-title .text{
    font-size: 18px;
    font-weight: 700;
    color: #333;
    opacity: 1;
  }
  .map {
    width: 50%;
    height: 500px;
    z-index: 5;
  }
  .stationName :deep(.el-input__inner) {
    padding-right: 45px !important;
  }
  .addr :deep(.el-input__inner) {
    padding-right: 55px;
  }

  .tips{
    font-size: 12px;
    color: #999;
    margin-left: 20px;
  }
  .charges-tips{
    color: gray;
  }
  // 轮播图
  .upload-tips {
    font-size: 13px;
    color: #999;
  }
}
</style>
