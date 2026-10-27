<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div
    class="Mall4j container"
    :style="isDecorate? '':'margin-top: 40px;'"
  >
    <el-card
      v-if="route.meta && route.name !== 'Dashboard' && !isDecorate"
      class="main-head"
    >
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          v-for="(item,index) in selectMenu"
          :key="index"
          class="breadcrumb-item"
        >
          <span>{{ item }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <section
      class="app-main"
      :style="{
        ...(route.name === 'Dashboard' ? style : {}),
        ...(isDecorate ? {'margin-left':'0','width':'100%'} : {})
      }"
    >
      <router-view v-slot="{ Component }">
        <keep-alive :include="cachRouteNameList">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </section>
  </div>
</template>

<script setup>
import { useIncludeRouterName } from '@/stores/modules/include-router-name.js'
const route = useRoute()
const style = reactive({
  margin: 0,
  width: '100%'
})
const selectMenu = computed(() => useCommonStore().selectMenu)
const router = useRouter()
const isDecorate = computed(() => {
  return (/^\/(multishop-decorate\/decorate-create-edit|multishop-feature\/feature-create-edit)/.test(router.currentRoute.value.path))
})

const includeRouterName = useIncludeRouterName()
// 需开启缓存的页面 组件name
const cachRouteNameList = computed(() => includeRouterName.routerNameList)
</script>

<style lang="scss" scoped>
.container {
  box-sizing: border-box;
  flex: 1;
  width: 100%;

  .main-head {
    background: #FFFFFF;
    width: 100%;
    height: 40px;
    top: 50px;
    position: fixed;
    z-index: 10;
    display: flex;
    align-items: center;
    border-radius: 0;
    box-shadow: none;
    border-top: none;

    .breadcrumb-item:last-child span {
      color: #155BD4 !important;
    }
  }

  .app-main {
    width: calc(100% - 20px);
    position: relative;
    background: #FFFFFF;
    overflow: hidden;
    margin-left: 20px;
  }
  // 全局表格分页栏统一右对齐
  :deep(.pagination) {
    display: flex;
    justify-content: right;
  }
}
</style>
