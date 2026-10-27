<template>
  <el-dialog
    v-model="visible"
    class="component-outlet-config-add-or-update"
    :title="dataForm.outletConfigId? $t('table.edit'): $t('table.create')"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-position="left"
      label-width="120px"
      style="width: 450px; margin-left:10px;"
      @keyup.enter="onSubmit()"
    >
      <!-- 快递公司类型 -->
      <el-form-item
        :label="$t('outletConfig.deliveryCompanyType')"
        prop="deliveryCompanyType"
      >
        <el-select
          v-model="dataForm.deliveryCompanyType"
          placeholder="请选择快递公司"
          :disabled="dataForm.outletConfigId"
        >
          <el-option
            v-for="item in deliveryCompanyType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 发货地址 -->
      <el-form-item
        v-if="dataForm.outletConfigId"
        :label="$t('order.order.deliveryAddress')"
        prop="printAddr"
      >
        <div class="part-form-delivery">
          <el-input
            v-if="dataForm.outletConfigId"
            v-model="dataForm.printAddr"
            disabled
            style="width: 330px"
          />
        </div>
      </el-form-item>
      <el-form-item
        v-if="!dataForm.outletConfigId"
        :label="$t('order.order.deliveryAddress')"
        prop="shopAddrId"
      >
        <div class="part-form-delivery">
          <el-select
            v-model="dataForm.shopAddrId"
            :placeholder="$t('tip.select')"
            style="max-width: 450px;width: 100%"
          >
            <el-option
              v-for="item in addrList"
              :key="item.shopRefundAddrId"
              :label="item.province + item.city + item.area + item.addr"
              :value="item.shopRefundAddrId"
            />
          </el-select>
          <div
            class="lb"
          >
            <el-button
              type="primary"
              link
              @click="onManageAddr"
            >
              {{ '管理发货地址' }}
            </el-button>
            <span
              class="vertical"
            />
            <el-button
              type="primary"
              link
              @click="getAddrList"
            >
              {{ '刷新' }}
            </el-button>
          </div>
        </div>
      </el-form-item>
      <!-- 发货人 -->
      <el-form-item
        :label="$t('outletConfig.shipper')"
        prop="shipper"
      >
        <el-input
          v-model.trim="dataForm.shipper"
          maxlength="10"
          show-word-limit
        />
      </el-form-item>
      <!-- 发货人电话 -->
      <el-form-item
        :label="$t('outletConfig.mobile')"
        prop="mobile"
      >
        <el-input
          v-model.trim="dataForm.mobile"
          maxlength="11"
          show-word-limit
          @input="dataForm.mobile=dataForm.mobile.replace(/[^\d|*]/g,'')"
        />
      </el-form-item>
      <!-- 电子面单客户账户或月结账号 -->
      <el-form-item
        :label="deliveryCompanyType[dataForm.deliveryCompanyType - 1].partnerId"
        prop="partnerId"
      >
        <el-input
          v-model.trim="dataForm.partnerId"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <!-- 电子面单密码 -->
      <el-form-item
        v-if="dataForm.deliveryCompanyType !== 1 && dataForm.deliveryCompanyType !== 2"
        :label="deliveryCompanyType[dataForm.deliveryCompanyType - 1].partnerKey"
        prop="partnerKey"
      >
        <el-input
          v-model.trim="dataForm.partnerKey"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <!-- 收件网点名称 -->
      <el-form-item
        v-if="dataForm.deliveryCompanyType === 5 || dataForm.deliveryCompanyType === 6"
        :label="deliveryCompanyType[dataForm.deliveryCompanyType - 1].net"
        prop="net"
      >
        <el-input
          v-model.trim="dataForm.net"
          maxlength="50"
          show-word-limit
        />
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
import * as api from '@/api/outlet-config/outlet-config'
import { ElMessage } from 'element-plus'
import * as shopRefundAddrApi from '@/api/multishop/shop-refund-addr'
import { isMobile } from '@/utils/validate.js'
import Cookies from 'vue-cookies'
import { getDomain } from '@/utils/index.js'
const emit = defineEmits(['refreshDataList'])
const visible = ref(false)

const dataFormRef = ref(null)
const dataForm = ref({
  outletConfigId: null,
  deliveryCompanyType: 1,
  shopAddrId: null,
  shipper: '',
  mobile: '',
  partnerId: '',
  partnerKey: '',
  net: '',
  paperSize: 1,
  isDefault: 0,
  printAddr: ''
})
const deliveryCompanyType = [{
  value: 1,
  label: '顺丰速运',
  partnerId: '月结账号',
  partnerKey: '',
  net: ''
}, {
  value: 2,
  label: '京东快递',
  partnerId: '商家编码',
  partnerKey: '',
  net: ''
}, {
  value: 3,
  label: '圆通速递',
  partnerId: '商家代码',
  partnerKey: '商家密钥',
  net: ''
}, {
  value: 4,
  label: '韵达快递',
  partnerId: '韵达白马账号',
  partnerKey: '联调密码',
  net: ''
}, {
  value: 5,
  label: '中通快递',
  partnerId: '合作方代码',
  partnerKey: '合作方密钥',
  net: '网点编码'
}, {
  value: 6,
  label: '申通快递',
  partnerId: '客户名称',
  partnerKey: '客户密码',
  net: '网点'
}, {
  value: 7,
  label: '百世快递',
  partnerId: '操作编码',
  partnerKey: '密钥',
  net: ''
}, {
  value: 8,
  label: 'EMS',
  partnerId: '协议客户号',
  partnerKey: '电商客户标识',
  net: ''
}]

const validateMobile = (rule, value, callback) => {
  if (isMobile(value) || (dataForm.value.outletConfigId && isStarMobile(value))) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号'))
  }
}
const addrList = reactive([])
const dataRule = reactive({
  deliveryCompanyType: [
    { required: true, message: '快递公司不能为空', trigger: 'blur' }
  ],
  shopAddrId: [
    { required: true, message: '发货地址不能为空', trigger: 'change' }
  ],
  shipper: [
    { required: true, message: '发货人不能为空', trigger: 'blur' }
  ],
  partnerId: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  partnerKey: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  net: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: $t('live.mobilePhoneNoNull'), trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ]
})
const init = (outletConfigId) => {
  dataForm.value.outletConfigId = outletConfigId || 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    getAddrList()
    if (!dataForm.value.outletConfigId) {
      return
    }
    api.get(outletConfigId).then(data => {
      dataForm.value = data
    })
  })
}

// 表单提交
const onSubmit = Debounce(function () {
  dataFormRef.value.validate(valid => {
    if (!valid) {
      return
    }
    const request = dataForm.value.outletConfigId ? api.update(dataForm.value) : api.save(dataForm.value)
    request.then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          emit('refreshDataList')
          dataFormRef.value?.resetFields()
        }
      })
    })
  })
}, 1500)
// 加载地址库
const getAddrList = () => {
  shopRefundAddrApi.list().then((data) => {
    handleArr(addrList, data)
  })
}

// 跳转管理地址库
const domain = getDomain()
const onManageAddr = () => {
  window.open('/shop/refund-addr' + (Cookies.get(domain) ? '' : '?tid=' + Cookies.get('cloudTid')), '_blank', 'noopener,noreferrer')
}

defineExpose({
  init
})
</script>
<style lang="scss" scoped>
.component-outlet-config-add-or-update {
  .part-form-delivery {
    display:flex;

    :deep(.el-select) {
      width: 330px !important;
    }
    .lb {
      display: flex;
      align-items: center;

      margin-left: 20px;

      .vertical {
        display: inline-block;
        width: 1px;
        height: 10px;
        background: #000;
        margin: 0 6px;
      }
    }
  }
}
</style>
