<script setup>
import zh from 'element-plus/es/locale/lang/zh-cn'
import { getTid } from '@/api/auth/auth'
import { getDomain } from '@/utils/index.js'

import cookie from 'vue-cookies'

const domain = getDomain()
const language = zh
const isLoadUseWebConfigStoreAddData = ref(false)
provide('isLoadUseWebConfigStoreAddData', isLoadUseWebConfigStoreAddData)
onMounted(async () => {
  const domainAddress = import.meta.env.VITE_APP_DOMAIN_ADDRESS
  if (cookie.get(domain) === null && (window.location.href.indexOf(domainAddress) !== 0)) {
    const data = await getTid(domain)
    if (data) {
      cookie.set(domain, data)
    }
  }
  // 获取网站配置
  await useWebConfigStore().getWebConfig()
  isLoadUseWebConfigStoreAddData.value = true

  // 获取通联支付配置信息
  useAllinpayStore().getPaySettlementType()
})
</script>

<template>
  <el-config-provider
    :locale="language"
    namespace="el"
  >
    <router-view />
  </el-config-provider>
</template>

<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style lang="scss">
@use '@/assets/app.scss';
</style>
