<template>
  <div v-if="dialogVisible">
    <el-dialog
      v-model="dialogVisible"
      title="主动退款"
      width="500"
      align-center
      destroy-on-close
      @closed="closed"
    >
      <el-form
        ref="dataFormRef"
        style="max-width: 600px"
        :model="dataForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
      >
        <el-form-item
          label="当前可退(￥)"
        >
          <span>{{ formatPrice(canRefundAmount, 1).toFixed(2) }}</span>
        </el-form-item>
        <el-form-item
          label="退款金额(￥)"
          prop="refundAmount"
          required
        >
          <div class="refund-input">
            <el-input
              v-model="dataForm.refundAmount"
              placeholder="请输入退款金额"
              :disabled="!activeRefundStatus"
              @change="onchange"
            />
            <el-button
              type="primary"
              link
              style="margin-left: 10px"
              @click="onAllRefund"
            >
              全部退款
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="dialogVisible = false"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            @click="onSubmitForm"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { formatPrice } from '@/utils/index.js'
import { ElMessage } from 'element-plus'
import { doActiveRefund } from '@/api/order/order-refund.js'

const dialogVisible = ref(false)

const props = defineProps({
  orderId: {
    type: Number || String,
    default: null
  },
  activeRefundStatus: {
    type: Boolean,
    default: null
  },
  canRefundAmount: {
    type: Number,
    default: null
  }
})

const validateRefundAmount = (rule, value, callback) => {
  const str = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
  if (!str.test(value) || value > 999999) {
    callback(new Error('请输入正确的金额'))
  } else {
    callback()
  }
}

const rules = reactive({
  refundAmount: [
    { required: true, message: '请输入退款金额' },
    { validator: validateRefundAmount, trigger: 'blur' }
  ]
})

const dataForm = reactive({
  refundAmount: null
})

const init = () => {
  dialogVisible.value = true
}

const onchange = (e) => {
  const val = Number(e)
  const canNum = formatPrice(props.canRefundAmount, 1).toFixed(2)
  if (val > canNum) {
    dataForm.refundAmount = canNum
  }
  if (!dataForm.refundAmount || dataForm.refundAmount < 0) {
    dataForm.refundAmount = 0
  }
}

const onAllRefund = () => {
  if (props.canRefundAmount) {
    dataForm.refundAmount = formatPrice(props.canRefundAmount, 1).toFixed(2)
  }
}

const dataFormRef = ref(null)
const onSubmitForm = () => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      doActiveRefund({
        orderId: props.orderId,
        refundAmount: dataForm.refundAmount * 100
      }).then(() => {
        ElMessage({
          message: '退款成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            dialogVisible.value = false
            // 退款成功后刷新页面
            location.reload()
          }
        })
      })
    } else {
      return false
    }
  })
}

const closed = () => {
  dialogVisible.value = false
}

defineExpose({
  init
})

</script>

<style scoped lang="scss">

.refund-input {
  display: flex;
  align-items: center;
}

</style>
