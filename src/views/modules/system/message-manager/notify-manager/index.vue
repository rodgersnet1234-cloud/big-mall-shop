<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="page-notify-manager">
    <el-tabs>
      <el-tab-pane
        :label="$t('multishop.notice.msgList')"
      >
        <notifyList />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('multishop.notice.msgSettings')"
      >
        <notifySetting />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import notifyList from './notify-list/index.vue'
import notifySetting from './notify-setting/index.vue'
</script>
<style lang="scss" scoped>
.page-notify-manager{
  padding: 20px;
  background: #fff;
}
</style>
