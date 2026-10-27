<template>
  <div class="component-select-lazy">
    <el-select
      v-model="selDvyId"
      v-loadmore="loadmore"
      :style="selStyle"
      filterable
      :remote="isRemote"
      class="def-width"
      :remote-method="remoteMethod"
      :placeholder="placeTips"
      :disabled="disabled"
      clearable
      :teleported="false"
      @change="change"
      @visible-change="onVisibleChange"
      @input="onInput"
    >
      <el-option
        v-for="item in devList"
        :key="item.deliveryCompanyId"
        :label="item.name"
        :value="item.deliveryCompanyId"
      />
    </el-select>
  </div>
</template>

<script setup>
import * as deliveryCompanyApi from '@/api/delivery/delivery-company'

const emit = defineEmits([
  'update:modelValue'
])

const vLoadmore = {
  mounted: (el, binding) => {
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    SELECTWRAP_DOM?.addEventListener('scroll', debounce(function () {
      const condition =
        this.scrollHeight - this.scrollTop <=
        this.clientHeight
      if (condition) {
        binding.value()
      }
    }), 300)
  }
}

function debounce (fn, delay = 100) {
  let timer = null
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  selStyle: {
    type: Object,
    default: () => {}
  },
  placeTips: {
    type: String,
    default: '请选择'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const selDvyId = ref('') // 当前选择的值
const size = ref(20)
const current = ref(1)
const dvyName = ref('')
const pages = ref(0)
const devList = reactive([])
const isSearch = ref(false)

onMounted(() => {
  getDeliveryList()
})

const change = () => {
  dvyName.value = ''
  emit('update:modelValue', selDvyId.value)
}

const onVisibleChange = (visible) => {
  if (visible && (devList.length === 0 || isRemote.value)) {
    isRemote.value = false
    current.value = 1
    dvyName.value = ''
    getDeliveryList()
  }
}

// 选择框选项栏收起时会自动调用一次，所以判断是否为空，不为空才请求
const remoteMethod = (name) => {
  if (name) {
    isSearch.value = true
    current.value = 1
    dvyName.value = name
    getDeliveryList()
  } else {
    // 为空不需要请求，在onInput中有处理
    isSearch.value = false
    dvyName.value = ''
  }
}

// 获取物流列表
const getDeliveryList = () => {
  deliveryCompanyApi.page({
    pageSize: size.value,
    pageNum: current.value,
    name: dvyName.value
  }).then((data) => {
    pages.value = data.pages
    if (current.value === 1) {
      devList.length = 0
      devList.push(...data.list)
      if (selDvyId.value && !isSearch.value) {
        checkCurSel(devList, selDvyId.value)
      }
    } else {
      const fList = data.list.filter(r => r.deliveryCompanyId !== selDvyId.value)
      devList.push(...fList)
    }
    selDvyId.value = props.modelValue
  })
}

// 获取当前id的物流
const getDeliveryById = (deliveryCompanyId) => {
  deliveryCompanyApi.page({
    deliveryCompanyId,
    pageNum: 1,
    pageSize: size.value
  }).then((data) => {
    devList.unshift(...data.list)
  })
}
// 分页加载
const loadmore = () => {
  if (current.value < pages.value) {
    current.value++
    getDeliveryList()
  }
}
// 筛查出当前所选的对象
const checkCurSel = (curList, curId) => {
  for (const item of curList) {
    if (item.deliveryCompanyId === curId) {
      return
    }
  }
  getDeliveryById(curId)
}

const isRemote = ref(false)
// 选择框的input输入事件
const onInput = (val) => {
  // 搜索框输入的值存在，则设置远程搜索为开
  if (val.target.value) {
    isRemote.value = true
  } else {
    // 搜索框未输入值，则设置远程搜索为关，并且重新获取选项
    isRemote.value = false
    dvyName.value = ''
    isSearch.value = false
    getDeliveryList()
  }
}
</script>

<style lang="scss" scoped>
.component-select-lazy {
  .def-width {
    width: 200px;
  }
}
</style>
