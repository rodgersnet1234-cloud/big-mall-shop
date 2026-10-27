<template>
  <div
    id="component-text-over-ellipsis"
    class="component-text-over-ellipsis wrap"
    :style="{
      'max-width': maxWidth + 'px'
    }"
  >
    <input
      id="exp-txt"
      type="checkbox"
    >
    <div
      class="res text"
      :style="{ '-webkit-line-clamp': lineClamp }"
    >
      <label
        for="exp-txt"
        class="btn"
      />
      <label
        for="exp-txt"
        class="btn btn-min"
      />
      {{ content }}
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: Number,
    default: 200
  },
  /* 超过的行数隐藏 */
  lineClamp: {
    type: Number,
    default: 2
  },
  // 当前背景色，用于隐藏小箭头，默认：white
  nowBackgroundColor: {
    type: String,
    default: ''
  }
})

onMounted(() => {
  if (props.nowBackgroundColor) {
    const element = document.getElementById('component-text-over-ellipsis')
    element.style.setProperty('--text-after-background-color', props.nowBackgroundColor)
  }
})

</script>

<style scoped lang="scss">
.component-text-over-ellipsis.wrap {
  display: flex;
  overflow: hidden;
  position: relative;
}
.component-text-over-ellipsis {
  --text-after-background-color: white;
  .text {
    white-space: normal !important;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    z-index: 2;
    padding-right: 6px;
    overflow-wrap: break-word;
  }

  #exp-txt {
    display: none;
  }

  .text::before {
    content: '';
    float: right;
    width: 0;
    height: 100%;
    /* 和文本大小一样 */
    margin-bottom: -16px;
  }

  .text::after {
    content: '';
    width: 100%;
    height: 100%;
    /* 颜色必须与背景相同 */
    background-color: var(--text-after-background-color);
    position: absolute;
  }

  .btn {
    width:  10px;
    float: right;
    clear: both;
    cursor: pointer;
    position: relative;
    color: #000;
  }
  .btn-min {
    width: 8px;
  }

  .btn::after {
    content: '';
    position: absolute;
    border: solid 6px #000;
    border-color: #000 transparent transparent transparent;
    right: -6px;
    top: 3px;
  }

  .btn-min:after {
    border: solid 5px var(--text-after-background-color);
    border-color: var(--text-after-background-color) transparent transparent transparent;
    right: -5px;
  }

  #exp-txt:checked+.text {
    -webkit-line-clamp: 999  !important;
  }

  #exp-txt:checked+.text .btn::after {
    content: '';
    border-color: transparent transparent #000 transparent;
    top: -3px;
    z-index: 1;
  }

  #exp-txt:checked+.text .btn-min:after {
    border-color: transparent transparent var(--text-after-background-color) transparent;
    top: -1px;
  }

  #exp-txt:checked+.text::after {
    background: transparent;
  }
}

</style>
