<template>
  <div class="component-status-select-tabs">
    <div
      v-if="type === 1"
      class="status-nav clearfix"
    >
      <ul class="nav-list clearfix">
        <div
          v-for="(item, index) in statusArr"
          :key="index"
          class="log-item"
        >
          <li
            :class="['nav-item', currentId === item.id ? 'selected' : '']"
            @click="selectNav(item)"
          >
            {{ item.label }}
          </li>
        </div>
        <div class="export-btn default-btn text-btn">
          <slot name="export" />
        </div>
      </ul>
    </div>

    <el-radio-group
      v-if="type === 2"
      v-model="radioIndex"
      @change="radioChange"
    >
      <!-- 全部按钮 -->
      <el-radio-button
        v-for="(item, index) in statusArr"
        :key="index"
        :label="index"
      >
        {{ item.label }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script setup>

const props = defineProps({
  statusArr: {
    default: () => { },
    type: Array // 状态数组
  },
  defaultId: {
    default: 0,
    type: Number // 默认选中的
  },
  type: {
    default: 1, // 标签栏样式
    type: Number
  }
})
const emit = defineEmits(['statusChange', 'statusChange'])
const currentId = ref('') // 当前选择的状态key
const radioIndex = ref(0)

onMounted(() => {
  if (!props.statusArr || props.statusArr.length === 0) {
    return
  }
  let id = props.defaultId
  if (!props.defaultId && props.defaultId !== 0) {
    // 状态数组不为空，而没有传入默认选中key时，设置第一个key为当前选择的key
    id = props.statusArr[0].id
  }
  currentId.value = id
})

const selectNav = (item) => {
  if (item.id !== currentId.value) {
    currentId.value = item.id
    // 向父组件发送状态切换回调,回调参数为选择的key
    emit('statusChange', item)
  }
}
const radioChange = (item) => {
  emit('statusChange', props.statusArr[item])
}

</script>

<style lang="scss" scoped>
.component-status-select-tabs {
  .status-nav {
    position: relative;
    display: block;
    width: 100%;
    margin-bottom: 15px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ddd;

    ul,
    li {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      font-size: 13px;
      float: left;
      height: 40px;
      line-height: 40px;
      background: #f8f8f9;
      border: 1px solid #ddd;
      padding: 0 20px;
      margin: 0 -1px -1px 0;
      cursor: pointer;
    }

    .selected {
      background: #fff;
      border-bottom: 1px solid #fff;
    }
  }

  .export-btn {
    float: right;
  }
}
</style>
