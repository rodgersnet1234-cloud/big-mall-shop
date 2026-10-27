<template>
  <el-dialog
    v-model="visible"
    :title="stockMode === 2 ? '切换成共享总部库存' : '切换成独立销售库存'"
    :close-on-click-modal="false"
    width="760px"
    class="component-stock-mode"
  >
    <div class="main">
      <el-alert
        type="warning"
        :closable="false"
      >
        <template #default>
          <div class="alert">
            <div class="warning-icon">
              <el-icon><WarningFilled /></el-icon>
            </div>
            <div
              v-if="stockMode===2"
              class="tips-box"
            >
              <p class="tip">
                1.切换后，门店商品可售库存将会同步为默认仓库（总部）商品库存，商品销售后对默认仓库（总部）的库存进行扣减；
              </p>
              <p class="tip">
                2.切换后将不能单独对该门店的商品库存进行修改；
              </p>
              <p class="tip">
                3.切换库存模式对正在进行秒杀的商品不生效；
              </p>
              <p class="tip">
                4.请合理选择门店原先库存的处理方式，退回总部或将原先门店库存清零。
              </p>
            </div>
            <div
              v-else
              class="tips-box"
            >
              <p class="tip">
                1.切换后，门店商品可售库存将会由门店实际库存决定，商品销售后对门店库存进行扣减；
              </p>
              <p class="tip">
                2.切换后可单独对该门店的商品库存进行修改；
              </p>
              <p class="tip">
                3.切换库存模式对正在进行秒杀的商品不生效；
              </p>
            </div>
          </div>
        </template>
      </el-alert>
      <div
        v-if="stockMode===2"
        class="select-box"
      >
        <div class="title">
          原先库存
        </div>
        <el-radio-group v-model="type">
          <el-radio :label="1">
            门店库存同步回默认仓库（总部）
          </el-radio>
          <el-radio :label="2">
            门店库存清零
          </el-radio>
        </el-radio-group>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="visible = false"
        >{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >{{ $t('table.submit') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { switchStationMode } from '@/api/stock/warehouse-station.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits([
  'refreshDataList'
])

const visible = ref(false)
const stationId = ref('')
const stockMode = ref(1) // 库存模式 1共享总部库存 2独立销售库存
const type = ref(1) // 更新共享库存模式（1同步到默认仓库 2库存清零）
const isSubmit = ref(false)
const init = (id, mode) => {
  visible.value = true
  stationId.value = id
  stockMode.value = mode
  isSubmit.value = false
}

// 表单提交
const onSubmit = () => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  switchStationMode({
    stationId: stationId.value,
    type: stockMode.value === 2 ? type.value : null
  }).then(() => {
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        visible.value = false
        isSubmit.value = false
        emit('refreshDataList')
      }
    })
  })
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.component-stock-mode {
  .main {
    .alert {
      display: flex;
      justify-content: center;
      padding: 10px 0;
      .warning-icon {
        font-size: 16px;
        color: #e6a23c;
        margin-right: 10px;
        padding-top: 2px;
      }
      .tip {
        font-size: 14px;
        margin: 4px 0;
        &:first-child {
          margin-top: 0;
        }
        &:last-child{
          margin-bottom: 0;
        }
      }
    }
    .select-box {
      display: flex;
      align-items: center;
      margin: 20px 0 0 50px;
      .title {
        margin-right: 10px;
      }
    }
  }
}
</style>
