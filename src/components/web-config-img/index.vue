<template>
  <img
    v-if="!isError && imgPath"
    :src="checkFileUrl(imgPath)"
    :style="wrapStyle"
    @error="onHandleError"
    @click="onHandleClick"
  >
  <img
    v-else
    :src="defImg"
    :style="wrapStyle"
    @click="onHandleClick"
  >
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: '100%'
  },
  radius: {
    type: [String, Number],
    default: 0
  },
  imgAlt: {
    type: String,
    default: ''
  },
  imgStyle: {
    type: Object,
    default: () => {
      return {}
    }
  },
  defImgType: {
    type: String,
    default: () => {
      return {}
    }
  }
})
const emit = defineEmits(['handleClick'])
// 图片地址
const imgPath = computed(() => props.src)

const defImg = computed(() => {
  switch (props.defImgType) {
    case 'loginBgImg': // 登录logo
      return new URL('@/assets/website-config/login-bg.jpg', import.meta.url).href
    case 'titleImg': // 网站标题图标
      return new URL('@/assets/website-config/title-icon.png', import.meta.url).href
    case 'bsTopBarIcon': // 菜单栏顶部图标
      return new URL('@/assets/website-config/menu-top-icon.png', import.meta.url).href
    default:
      return new URL('@/assets/images/def.png', import.meta.url).href
  }
})

// 验证十进制数字
function number (value) {
  return /^[+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value)
}
// 是否携带单位
function addUnit (value = 'auto') {
  value = String(value)
  return number(value) ? `${value}px` : value
}
// 样式整合
const wrapStyle = computed(() => {
  const style = {}
  style.width = addUnit(props.width)
  style.height = addUnit(props.height)
  style.maxWidth = '100%'
  style.maxHeight = '100%'
  // 如果是显示圆形，设置一个很多的半径值即可
  style.borderRadius = addUnit(props.radius)
  // 如果设置圆角，必须要有hidden，否则可能圆角无效
  style.overflow = props.radius > 0 ? 'hidden' : ''
  return { ...style, ...props.imgStyle }
})

function onHandleClick () {
  emit('handleClick')
}

const isError = ref(false)
function onHandleError () {
  isError.value = true
}
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: 100%;
}
</style>
