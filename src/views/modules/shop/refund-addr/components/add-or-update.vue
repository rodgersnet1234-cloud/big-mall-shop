<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.shopRefundAddrId? $t('table.edit'): $t('table.create')"
    :modal-append-to-body="blVisible"
    :append-to-body="true"
    class="component-refund-addr"
    style="min-width: 800px;"
    @close="handleClose"
  >
    <el-form
      ref="dataFormRef"
      :rules="dataRule"
      :model="dataForm"
      label-position="right"
      label-width="90px"
      style="margin-left:50px;"
      @submit.prevent
    >
      <!-- 收货人 -->
      <el-form-item
        :label="$t('multishop.shopRefundAddr.consignee')"
        prop="consignee"
      >
        <el-input
          v-model.trim="dataForm.consignee"
          placeholder="收货人姓名"
          style="width: 250px;"
          maxlength="30"
          show-word-limit
        />
      </el-form-item>
      <!-- 手机 -->
      <el-form-item
        :label="$t('multishop.shopRefundAddr.mobile')"
        prop="mobile"
      >
        <el-input
          v-model.trim="dataForm.mobile"
          placeholder="手机号码"
          maxlength="11"
          style="width: 250px;"
          show-word-limit
          @input="dataForm.mobile=dataForm.mobile.replace(/[^\d|*]/g,'')"
        />
      </el-form-item>
      <!-- 邮编 -->
      <el-form-item
        :label="$t('multishop.shopRefundAddr.postCode')"
        prop="postCode"
        class="postCode-label"
      >
        <el-input
          v-model.trim="dataForm.postCode"
          placeholder="邮政编码"
          maxlength="6"
          style="width: 250px;"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        :label="$t('multishop.shopRefundAddr.province')"
        class="addr-lable"
      >
        <el-col
          :span="8"
          style="padding-right:10px"
        >
          <el-form-item prop="province">
            <el-select
              v-model="dataForm.province"
              :placeholder="$t('tip.select')"
              @change="selectProvince"
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
        <el-col
          :span="8"
          style="padding-right:10px"
        >
          <el-form-item prop="city">
            <el-select
              v-model="dataForm.city"
              :placeholder="$t('tip.select')"
              @change="selectCity"
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
        <el-col
          :span="8"
          style="padding-right:10px"
        >
          <el-form-item prop="area">
            <el-select
              v-model="dataForm.area"
              :placeholder="$t('tip.select')"
              @change="selectArea"
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
        :label="$t('multishop.shopRefundAddr.addr')"
        prop="addr"
      >
        <el-input
          v-model.trim="dataForm.addr"
          placeholder="详细地址"
          style="padding-right: 10px"
          maxlength="80"
          show-word-limit
        />
      </el-form-item>
      <!-- 默认地址 -->
      <el-form-item
        v-if="!returnF"
        :label="$t('multishop.shopRefundAddr.isDefault')"
        prop="isDefault"
      >
        <el-checkbox
          v-model="isDefault"
          :disabled="isDisabled"
        >
          默认退货地址
        </el-checkbox>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="visible = false"
        >
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/multishop/shop-refund-addr'
import * as addrApi from '@/api/system/addr-manage'
import { Debounce } from '@/utils/debounce'
import { validNoEmptySpace } from '@/utils/validate'
import { treeDataTranslate } from '@/utils'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const blVisible = ref(false)
const isSubmit = ref(false)
const provinceList = ref([])
const cityList = ref([])
const areaList = ref([])
let returnF = null
const dataForm = reactive({
  shopRefundAddrId: 0,
  shopId: null,
  mobile: null,
  isDefault: null,
  consignee: null,
  provinceId: null,
  province: null,
  cityId: null,
  city: null,
  areaId: null,
  area: null,
  addr: null,
  postCode: null,
  lng: null,
  lat: null
})
const initDataForm = reactive({
  province: null,
  city: null,
  area: null,
  addr: null
})
const isDefault = ref(false)
const isDisabled = ref(false)
const validatePostCode = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('不能全为空格'))
    return
  }
  if (!/^[0-9]{6}$/.test(value) && value !== '' && value !== null) {
    callback(new Error('请输入正确的邮政编码'))
    return
  }
  callback()
}

const validateMobile = (rule, value, callback) => {
  if (isMobile(value) || (dataForm.shopRefundAddrId && isStarMobile(value))) {
    callback()
  } else {
    callback(new Error($t('multishop.shopRefundAddr.mobileFormattingError')))
  }
}
const dataRule = {
  receiverName: [
    { required: true, message: $t('multishop.shopRefundAddr.consigneeNotEmpty'), trigger: 'blur' }
  ],
  postCode: [{
    validator: validatePostCode, trigger: 'blur'
  }],
  addr: [{ required: true, message: $t('multishop.shopRefundAddr.addressCannotBeEmpty'), pattern: '[^ \x22]+', trigger: 'blur' }],
  city: [{ required: true, message: $t('multishop.shopRefundAddr.cityCannotBeEmpty'), trigger: 'blur' }],
  province: [
    { required: true, message: $t('multishop.shopRefundAddr.provinceCannotBeEmpty'), trigger: 'blur' }
  ],
  area: [{ required: true, message: $t('multishop.shopRefundAddr.districtCounEmpty'), trigger: 'blur' }],
  mobile: [
    { required: true, message: $t('multishop.shopRefundAddr.mobilePhoneNoNull'), trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ],
  consignee: [
    { required: true, message: $t('multishop.shopRefundAddr.consigneeNotEmpty'), pattern: '[^ \x22]+', trigger: 'blur' }
  ]
}

const dataFormRef = ref('')
const init = (shopRefundAddrId, _returnF) => {
  dataForm.shopRefundAddrId = shopRefundAddrId || 0
  visible.value = true
  blVisible.value = false
  isDefault.value = false
  isSubmit.value = false
  dataForm.provinceId = null
  dataForm.province = null
  returnF = _returnF
  provinceList.value = []
  cityList.value = []
  areaList.value = []
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.shopRefundAddrId) {
      return
    }
    api.get(shopRefundAddrId).then(data => {
      Object.assign(dataForm, data)
      Object.assign(initDataForm, dataForm)
      isDefault.value = data.isDefault === 1
    })
  })
  listArea()
}
defineExpose({
  init
})
const listArea = () => {
  addrApi.getListAreaOfEnable().then(data => {
    provinceList.value = treeDataTranslate(data, 'areaId', 'parentId')
  })
}
const handleClose = () => {
  blVisible.value = true
}
// 选择省
const selectProvince = (index) => {
  dataForm.cityId = null
  dataForm.city = ''
  dataForm.areaId = null
  dataForm.area = ''
  const province = provinceList.value[index]
  dataForm.provinceId = province.areaId
  dataForm.province = province.areaName
  // 获取城市的select
  cityList.value = province.children
  areaList.value = []
  dataFormRef.value?.validateField('province')
}
// 选择市
const selectCity = (index) => {
  dataForm.areaId = null
  dataForm.area = ''
  const city = cityList.value[index]
  dataForm.cityId = city.areaId
  dataForm.city = city.areaName
  // 获取区的select
  areaList.value = city.children
  dataFormRef.value?.validateField('city')
}
// 选择区
const selectArea = (index) => {
  dataForm.areaId = null
  dataForm.area = ''
  const area = areaList.value[index]
  dataForm.areaId = area.areaId
  dataForm.area = area.areaName
  dataFormRef.value?.validateField('area')
}

// 表单提交
const onSubmit = Debounce(() => {
  dataForm.isDefault = isDefault.value ? 1 : 0
  dataFormRef.value?.validate(valid => {
    if (!valid || isSubmit.value) {
      return
    }
    isSubmit.value = true
    const request = dataForm.shopRefundAddrId ? api.update(dataForm) : api.save(dataForm)
    request.then(() => {
      visible.value = false
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          blVisible.value = true
          emit('refreshDataList')
          dataFormRef.value?.resetFields()
        }
      })
      isSubmit.value = false
    }).catch(() => {
      isSubmit.value = false
    })
  })
}, 1000)
</script>
<style lang="scss" scoped>
.component-refund-addr {
  :deep(.postCode-label .el-form-item__label:before) {
    content: "";
    color: #ff4949;
    margin-right: 8px;
  }
  .addr-lable :deep(.el-form-item__label:before){
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }
  .addr-lable :deep(.el-form-item--small.el-form-item) {
    margin-bottom: 0;
  }
}
</style>
