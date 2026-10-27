<template>
  <div class="component-prod-pic">
    <div v-if="height && width">
      <img
        v-if="pic"
        :src="checkFileUrl(pic)"
        :height="height"
        :width="width"
      >
      <img
        v-else
        src="~@/assets/images/def.png"
        :height="height"
        :width="width"
      >
    </div>
    <div v-else-if="width">
      <img
        v-if="pic"
        :src="checkFileUrl(pic)"
        :width="width"
      >
      <img
        v-else
        src="~@/assets/images/def.png"
        :width="width"
      >
    </div>
    <div v-else-if="height">
      <img
        v-if="pic"
        :src="checkFileUrl(pic)"
        :height="height"
      >
      <img
        v-else
        src="~@/assets/images/def.png"
        :height="height"
      >
    </div>
    <div v-else>
      <img
        v-if="pic"
        :src="checkFileUrl(pic)"
      >
      <img
        v-else
        src="~@/assets/images/def.png"
      >
    </div>
  </div>
</template>

<script setup>
defineProps({
  pic: {
    default: null,
    type: String
  },
  height: {
    default: null,
    type: String
  },
  width: {
    default: null,
    type: String
  }
})
</script>
