<template>
  <div class="page-same-city">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{ $t("shop.sameCityDelFun") }}
      </div>
    </div>

    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="120px"
    >
      <el-form-item :label="$t('shop.enableStatus') + '：'">
        <div>
          <el-switch
            v-model="dataForm.status"
            active-value="1"
            inactive-value="0"
          />
          <span class="status-tips">{{ $t("shop.deliSerProByYou") }}</span>
        </div>
      </el-form-item>
      <el-form-item :label="$t('shop.charges') + '：'">
        <div>
          <el-radio
            v-model="dataForm.chargeType"
            :label="1"
          >
            {{
              $t("shop.chaDelFeeByReg")
            }}
          </el-radio>
          <el-radio
            v-model="dataForm.chargeType"
            :label="2"
          >
            {{
              $t("shop.delFeeChaDis")
            }}
          </el-radio>
          <div
            v-if="dataForm.chargeType === 1"
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
            v-model="dataForm.startFee"
            :max="100000"
            :placeholder="$t('shop.startingFee')"
            :precision="2"
            :step="0.01"
            :min="0.0"
          />
        </el-col>
      </el-form-item>
      <el-form-item
        v-if="dataForm.chargeType === 1"
        :label="$t('shop.deliveryFeeY') + '：'"
        prop="deliveryFee"
      >
        <el-col :span="6">
          <el-input-number
            v-model="dataForm.deliveryFee"
            :max="100000"
            :placeholder="$t('shop.deliveryFee')"
            :min="0.00"
            :precision="2"
            :step="0.01"
          />
        </el-col>
      </el-form-item>
      <el-form-item
        v-if="dataForm.chargeType === 2"
        :label="$t('shop.costAllocation') + '：'"
        style="color: gray"
        prop="defaultDistance"
      >
        <el-input-number
          v-model="dataForm.defaultDistance"
          :max="100000"
          :precision="1"
          :min="0.1"
          :step="0.1"
        />
        <span style="font-size: 15px">{{ $t("shop.withinKm") }}</span>
        <el-input-number
          v-model="dataForm.deliveryFee"
          :max="100000"
          :min="0.00"
          :precision="2"
          :step="0.01"
        />
        <span style="font-size: 15px">{{ $t("shop.yuanToChaDelFee") }}</span>
        <el-input-number
          v-model="dataForm.overDistance"
          :max="100000"
          :precision="1"
          :step="0.1"
          :min="0.1"
        />
        <span style="font-size: 15px">km，{{ $t("shop.incInDelFees") }}</span>
        <el-input-number
          v-model="dataForm.overDistanceFee"
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
          v-model="dataForm.freeWeight"
          :max="100000"
          :precision="2"
          :step="0.01"
          :min="0.01"
          :placeholder="$t('shop.pleaseEnterTheWeight')"
        />
        <span style="font-size: 15px">{{ $t("shop.noExtraCharge") }}</span>
        <el-input-number
          v-model="dataForm.overWeight"
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
          v-model="dataForm.overWeightFee"
          :max="100000"
          :precision="2"
          :step="0.01"
          :min="0.01"
        />
        <span style="font-size: 15px">{{ $t("admin.dollar") }}。</span>
      </el-form-item>
      <el-form-item
        label="所在地区："
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
        label="详细地址："
        prop="detailAddress"
      >
        <el-input
          v-model="dataForm.detailAddress"
          placeholder="请输入50字以内的详细地址"
          maxlength="50"
          style="width: 300px"
          @change="onMapLocation"
        />
      </el-form-item>
      <el-form-item
        prop="brief"
        :label="$t('product.deliveryArea') + '：'"
      >
        <div class="map">
          <tmap
            ref="tmapRef"
            :lat-lng="latLng"
            :is-update-coordinates="false"
            :is-show-control="true"
            @set-polygon-path="onSetPolygonPath"
            @change-lat-lng="onChangeLatLng"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <span
          class="reset-map-btn"
          @click="onResetMapPoint()"
        >{{ $t("shop.resetMap") }}</span>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          {{ $t("order.order.save") }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { listAreaOfEnable } from '@/api/delivery/transport'
import * as api from '@/api/delivery/samecity'
import * as shopApi from '@/api/multishop/shop-process'
import Big from 'big.js'
import { ElMessage } from 'element-plus'

const polygonPath = reactive([])
const shopInfo = reactive({
  tel: '',
  city: '',
  area: '',
  shopAddress: ''
})
const dataForm = reactive({
  chargeType: 1,
  samecityId: 0,
  shopId: 0,
  status: 0,
  polygonPath: [],
  startFee: 0.00,
  deliveryFee: 0.00,
  defaultDistance: 0.0,
  overDistance: 0.0,
  overDistanceFee: 0.00,
  freeWeight: 0.0,
  overWeight: 0.0,
  overWeightFee: 0.00,
  shopLat: 39.908821,
  shopLng: 116.397469
})
const addrList = ref([])
const addrListTreeProps = reactive({
  value: 'areaId',
  label: 'areaName'
})
// 纯空格校验
const validEmptySpace = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能全为空格'))
  } else {
    callback()
  }
}
// 配置区域是否为初始状态
const dataRule = reactive({
  startFee: [
    { required: true, message: $t('shop.stargFeeCannoEmp'), trigger: 'blur' }
  ],
  deliveryFee: [
    { required: true, message: $t('shop.delFeeCannoEmp'), trigger: 'blur' }
  ],
  currentAddr: [
    { required: true, message: '请选择所在地区', trigger: ['blur', 'change'] }
  ],
  detailAddress: [
    { required: true, message: '详细地址不能为空', trigger: 'blur' },
    { validator: validEmptySpace, trigger: 'blur' }
  ]
})

onMounted(() => {
  if (TMap) {
    onGetDataInfo()
  } else {
    onGetTMap()
  }
})

let time = null
const onGetTMap = () => {
  time = setTimeout(() => {
    TMap = window.TMap
    if (TMap) {
      time = null
      onGetDataInfo()
    } else {
      onGetTMap()
    }
  }, 500)
}

const latLng = ref({
  lat: 39.908821,
  lng: 116.397469
})

// 获取店铺详情数据
const isConfigureAreaDefault = ref(false)
const tmapRef = ref(null)
let TMap = window.TMap
const onGetDataInfo = async () => {
  onGetAddrList()
  await onGetSameCityDetail()
  shopApi.getBasicInfo({})
    .then((data) => {
      shopInfo.tel = data.contactPhone
      if (!dataForm.samecityId || !polygonPath || polygonPath.length <= 0) {
        const points = onGetPoint({ shopLng: dataForm.shopLng, shopLat: dataForm.shopLat })
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
          const point = new TMap.LatLng(item.lat, item.lng)
          polygonPath.push(point)
        })
        tmapRef.value?.onInitGemotryEditor(polygonPath)
        tmapRef.value?.onSetZoom(13)
      }
    })
}

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

/**
 * 省市区
 */
const onGetAddrList = () => {
  listAreaOfEnable({}).then(data => {
    addrList.value = treeDataTranslate(data, 'areaId', 'parentId')
  })
}

// 腾讯地图
const onMapLocation = () => {
  let address = ''
  const { provinceId, province, cityId, city, areaId, area, detailAddress } = dataForm
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
        if (detailAddress) {
          // 详细地址
          address = address + detailAddress
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
}

// 修改经纬度
const onChangeLatLng = (latLngInfo) => {
  const { lng, lat } = latLngInfo
  latLng.value = {
    lat,
    lng
  }
  dataForm.shopLng = lng
  dataForm.shopLat = lat
  // 更改坐标点后，重新设置地图选区
  const points = onGetPoint({ shopLng: dataForm.shopLng, shopLat: dataForm.shopLat })
  polygonPath.length = 0
  polygonPath.push(...points)
  nextTick(() => {
    isConfigureAreaDefault.value = true
    tmapRef.value?.onResetGemotryEditor(polygonPath)
  })
}

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
    onMapLocation()
  }
}

// 获取店铺同城配送的配置
const onGetSameCityDetail = () => {
  return new Promise((resolve) => {
    api.getSameCityInfo()
      .then((data) => {
        if (data) {
          data.status = data.status.toString()
          onHandleDataForm(data)
          dataForm.overDistanceFee = formatPrice(data.overDistanceFee, 1)
          dataForm.overWeightFee = formatPrice(data.overWeightFee, 1)
          dataForm.deliveryFee = formatPrice(data.deliveryFee, 1)
          dataForm.startFee = formatPrice(data.startFee, 1)
          latLng.value = {
            lat: dataForm.shopLat,
            lng: dataForm.shopLng
          }
          polygonPath.length = 0
          polygonPath.push(...dataForm.polygonPath)
        }
        resolve()
      })
  })
}

// dataForm赋值
const onHandleDataForm = (data) => {
  dataForm.chargeType = data.chargeType
  dataForm.samecityId = data.samecityId
  dataForm.shopId = data.shopId
  dataForm.status = data.status
  dataForm.polygonPath = data.polygonPath || []
  dataForm.startFee = data.startFee
  dataForm.deliveryFee = data.deliveryFee
  dataForm.defaultDistance = data.defaultDistance
  dataForm.overDistance = data.overDistance
  dataForm.overDistanceFee = data.overDistanceFee
  dataForm.freeWeight = data.freeWeight
  dataForm.overWeight = data.overWeight
  dataForm.overWeightFee = data.overWeightFee
  dataForm.shopLng = data.shopLng
  dataForm.shopLat = data.shopLat
  dataForm.province = data.province
  dataForm.provinceId = data.provinceId
  dataForm.area = data.area
  dataForm.areaId = data.areaId
  dataForm.city = data.city
  dataForm.cityId = data.cityId
  dataForm.currentAddr = [
    data.provinceId,
    data.cityId,
    data.areaId
  ]
  dataForm.shopLng = data.shopLng
  dataForm.shopLat = data.shopLat
  dataForm.detailAddress = data.detailAddress
}

// 重置配送区域
const dataFormRef = ref()
const onResetMapPoint = () => {
  isConfigureAreaDefault.value = true
  dataForm.polygonPath = null
  polygonPath.length = 0
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      api.update(dataForm).then(() => {
        const points = onGetPoint({ shopLng: dataForm.shopLng, shopLat: dataForm.shopLat })
        polygonPath.push(...points)
        tmapRef.value?.onResetGemotryEditor(polygonPath)
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500
        })
      })
    }
  })
}

// 表单提交
const isDataTrue = ref(false)
const onSubmit = () => {
  onCheckData()
  if (!isDataTrue.value) {
    return
  }
  dataForm.polygonPath = polygonPath
  if (isConfigureAreaDefault.value && dataForm.status === 0) dataForm.polygonPath = []
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      dataForm.lat = latLng.value.lat
      dataForm.lng = latLng.value.lng
      const submitData = JSON.parse(JSON.stringify(dataForm))
      // 对金额进行处理（转换为分）
      submitData.startFee = formatPrice(submitData.startFee)
      submitData.deliveryFee = formatPrice(submitData.deliveryFee)
      submitData.overWeightFee = formatPrice(submitData.overWeightFee)
      submitData.overDistanceFee = formatPrice(submitData.overDistanceFee)
      if (dataForm.samecityId) {
        api.update(
          submitData
        ).then(() => {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1500
          })
        })
      } else {
        api.saveOrUpdate(
          submitData
        ).then(() => {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1500
          })
        })
      }
    }
  })
}

const onSetPolygonPath = (data) => {
  polygonPath.length = 0
  polygonPath.push(...data.paths)
  isConfigureAreaDefault.value = false
}

// 检查表单数据
const onCheckData = () => {
  if (dataForm.overWeightFee == null) {
    onShowErrorMsg($t('shop.costCannotBeEmpty'))
    isDataTrue.value = false
    return
  }
  if (dataForm.chargeType === 2 && dataForm.overDistanceFee == null) {
    onShowErrorMsg($t('shop.excDisFeeCanBeEm'))
    isDataTrue.value = false
    return
  }
  if (dataForm.chargeType === 2 && (dataForm.defaultDistance == null || dataForm.overDistance == null)) {
    onShowErrorMsg($t('shop.distanceCannotBeEmpty'))
    isDataTrue.value = false
    return
  }
  if (!dataForm.freeWeight == null || !dataForm.overWeight == null) {
    onShowErrorMsg($t('shop.weightCannotBeEmpty'))
    isDataTrue.value = false
    return
  }
  if (polygonPath != null && polygonPath.length > 12) {
    onShowErrorMsg($t('shop.polygonPathOverNum'))
    isDataTrue.value = false
    return
  }
  if ((dataForm.status === 1 || dataForm.status === '1') && isConfigureAreaDefault.value) {
    onShowErrorMsg('请设置可配送区域')
    isDataTrue.value = false
    return
  }
  isDataTrue.value = true
}

const onShowErrorMsg = (message) => {
  ElMessage({
    message,
    type: 'error',
    duration: 1500
  })
}

onUnmounted(() => {
  if (time) {
    clearTimeout(time)
  }
})
</script>

<style lang="scss" scoped>
.page-same-city {
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
  .status-tips{
    color: #999;
    margin-left: 20px;
  }
  .charges-tips{
    color: gray;
  }
  .reset-map-btn{
    color: #155bd4;
    cursor: pointer;
  }
  .map {
    width: 50%;
    height: 500px;
    user-select: none;
  }
}
</style>
