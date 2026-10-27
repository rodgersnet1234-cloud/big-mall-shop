<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="page-platform-notice-add-or-update">
    <el-dialog
      v-model="visible"
      :title="$t('table.view')"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      top="15vh"
    >
      <div class="title">
        {{ dataForm.title }}
      </div>
      <div
        v-rich="dataForm.content"
        class="content"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="visible = false"
          >
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/multishop/notice'

const visible = ref(false)
const dataForm = reactive({
  title: null,
  publishTime: null,
  content: null
})

const init = (id) => {
  visible.value = true
  api.get(id).then(data => {
    dataForm.title = data.title
    dataForm.publishTime = data.publishTime
    dataForm.content = data.content
  })
}
defineExpose({ init })
</script>
<style lang="scss" scoped>
.page-platform-notice-add-or-update{
  .title {
    text-align: center;
  }
  .content {
    width: 100%;
    overflow: auto
  }
}

</style>
