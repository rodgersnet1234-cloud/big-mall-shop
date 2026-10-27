<template>
  <el-dialog
    v-model="visible"
    :title="$t('order.order.modifyUseAddress')"
    :modal="false"
    top="200px"
    :close-on-click-modal="false"
    class="component-order-addr-update"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-alert
        :title="$t('order.order.consultWithUsers')"
        type="warning"
        show-icon
      />
      <br>
      <el-form-item
        :label="$t('constant.consignee')"
        prop="consignee"
      >
        <el-input
          v-model="dataForm.consignee"
          :placeholder="$t('shop.consigneeName')"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        :label="$t('constant.mobilePhone')"
        prop="mobile"
      >
        <el-input
          v-model="dataForm.mobile"
          :placeholder="$t('constant.mobilePhone')"
          maxlength="11"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        :label="$t('multishop.shopRefundAddr.province')"
        prop="province"
      >
        <el-col :span="7">
          <el-form-item prop="province">
            <el-select
              v-model="dataForm.province"
              :disabled="order && order.deliveryType === 4"
              :placeholder="$t('tip.select')"
              @change="onSelectProvince"
            >
              <el-option
                v-for="(province, index) in provinceList"
                :key="province.areaId"
                :label="province.areaName"
                :value="index"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="city">
            <el-select
              v-model="dataForm.city"
              :disabled="order && order.deliveryType === 4"
              :placeholder="$t('tip.select')"
              @change="onSelectCity"
            >
              <el-option
                v-for="(city, index) in cityList"
                :key="city.areaId"
                :label="city.areaName"
                :value="index"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="area">
            <el-select
              v-model="dataForm.area"
              :disabled="order && order.deliveryType === 4"
              :placeholder="$t('tip.select')"
              @change="onSelectArea"
            >
              <el-option
                v-for="(area, index) in areaList"
                :key="area.areaId"
                :label="area.areaName"
                :value="index"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 地址 -->
      <el-form-item
        :label="$t('address.detailed')"
        prop="addr"
      >
        <el-input
          v-model="dataForm.addr"
          :disabled="order && order.deliveryType===4"
          :placeholder="$t('address.detailed')"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button
          type="primary"
          @click="visible = false"
        >{{ $t("table.cancel") }}</el-button>
        <el-button
          type="primary"
          @click="getChangeAmount()"
        >{{ $t("table.confirm") }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as addrApi from '@/api/system/addr-manage'
import * as api from '@/api/order/order'
import { ElMessage, ElMessageBox } from 'element-plus'

const emit = defineEmits([
  'refreshUserAddrOrder'
])

const dataFormRef = ref()
const oldOrder = ref('')
const order = ref(null)
const orderStatus = ref(0)
const visible = ref(false)
const areaList = reactive([])
const cityList = reactive([])
const dataForm = reactive({
  orderAddrId: 0,
  orderId: 0,
  addrId: 0,
  addr: '',
  consignee: '',
  mobile: '',
  area: '',
  lat: '',
  lng: '',
  city: '',
  province: '',
  areaId: null,
  cityId: null,
  provinceId: null
})
const provinceList = reactive([])

const validateMobile = reactive((rule, value, callback) => {
  if (!isStarMobile(value)) {
    callback(new Error($t('order.order.mobilePhoneError')))
  } else {
    callback()
  }
})

const validateConsignee = reactive((rule, value, callback) => {
  if (value.match(/^\s+$/) || !value) {
    callback(new Error($t('shop.coneeNameCanEmpty')))
  } else {
    callback()
  }
})

const validateArea = reactive((rule, value, callback) => {
  if (value.match(/^\s+$/) || !value) {
    callback(new Error($t('shop.addressCannotBeEmpty')))
  } else {
    callback()
  }
})
const dataRule = reactive({
  consignee: [
    { required: true, validator: validateConsignee, trigger: 'blur' }
  ],
  addr: [{ required: true, validator: validateArea, trigger: 'blur' }],
  city: [{ required: true, message: $t('shop.cityCannotBeEmpty'), trigger: 'blur' }],
  province: [
    { required: true, message: $t('shop.provinceCannotBeEmpty'), trigger: 'blur' }
  ],
  area: [{ required: true, message: $t('shop.districtCounEmpty'), trigger: 'blur' }],
  mobile: [
    { required: true, message: $t('order.order.mobilePhoneNoNull'), trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ]
})

// 获取数据列表
const dataListLoading = ref(false)
const freightAmount = ref(0)
const init = (orderVal) => {
  const orderInfo = Object.assign({}, orderVal)
  order.value = orderInfo
  dataForm.orderAddrId = orderInfo.orderAddrId || 0
  visible.value = true
  dataListLoading.value = true
  freightAmount.value = orderInfo.freightAmount
  orderStatus.value = orderInfo.status
  oldOrder.value = JSON.parse(JSON.stringify(orderInfo))
  nextTick(() => {
    onGetOrderAddrById(orderInfo.orderAddrId)
  })
  onListArea()
  dataListLoading.value = false
}

const onGetOrderAddrById = (orderAddrId) => {
  api.getOrderAddr(
    orderAddrId
  ).then((data) => {
    Object.assign(dataForm, data)
  })
}

const onListArea = () => {
  addrApi.getListAreaOfEnable().then(data => {
    handleArr(provinceList, treeDataTranslate(data, 'areaId', 'parentId'))
  })
}

// 选择省
const onSelectProvince = (index) => {
  dataForm.cityId = null
  dataForm.city = ''
  dataForm.areaId = null
  dataForm.area = ''
  const province = provinceList[index]
  dataForm.provinceId = province.areaId
  dataForm.province = province.areaName
  // 获取城市的select
  handleArr(cityList, province.children)
}

// 选择市
const onSelectCity = (index) => {
  dataForm.areaId = null
  dataForm.area = ''
  const city = cityList[index]
  dataForm.cityId = city.areaId
  dataForm.city = city.areaName
  // 获取区的select
  handleArr(areaList, city.children)
}

// 选择区
const onSelectArea = (index) => {
  dataForm.areaId = null
  dataForm.area = ''
  const area = areaList[index]
  dataForm.areaId = area.areaId
  dataForm.area = area.areaName
}

const getChangeAmount = () => {
  oldOrder.value.orderId = order.value.orderId
  oldOrder.value.orderNumber = order.value.orderNumber
  dataFormRef.value?.validate(valid => {
    if (valid) {
      if (order.value.deliveryType === 4) {
        // 同城配送不能修改地址，不用弹出地址变更提示
        onSubmit()
      } else {
        const params = {
          orderId: oldOrder.value.orderId,
          areaId: dataForm.areaId,
          lat: dataForm.lat ? dataForm.lat : '',
          lng: dataForm.lng ? dataForm.lng : ''
        }
        api.getChangeAmount(params).then((data) => {
          const amount = formatPrice(data, 1).toFixed(2)
          const msg = `由于地址变更，运费应${amount > 0 ? '多' : '少'}收${amount < 0 ? amount * -1 : amount}元，此操作不会变更订单金额，是否确认直接修改订单地址？`
          ElMessageBox.confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            onSubmit()
          })
        })
      }
    }
  })
}

// 确定事件
const onSubmit = () => {
  dataFormRef.value?.validate(valid => {
    if (valid) {
      dataForm.orderId = order.value.orderId
      api.updateOrderAddr(dataForm).then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            emit('refreshUserAddrOrder')
          }
        })
      })
    }
  })
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
</style>
