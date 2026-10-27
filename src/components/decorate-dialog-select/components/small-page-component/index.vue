<template>
  <div class="component-small-modal-content">
    <div class="tables">
      <el-table
        ref="multipTableRef"
        v-loading="pageLoading"
        style="width: 100%"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        :data="tableList"
        height="380"
        :class="{'tables-checkedbox': !isMulilt}"
        @select="handleCancelSelected"
        @selection-change="selectChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="name"
          :label="$t('pcdecorate.commonModal.pageTitle')"
          align="left"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createTime"
          width="300px"
          :label="$t('pcdecorate.commonModal.createTime')"
          align="center"
          show-overflow-tooltip
        />
      </el-table>
      <el-pagination
        style="margin-top: 15px; text-align: right;"
        :current-page="perProps.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="perProps.pageSize"
        :total="perProps.total"
        layout="->,total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
    </div>
  </div>
</template>
<script setup>
import request from '@/utils/request'

const emit = defineEmits(['handleGoodsSelect'])
const props = defineProps({
  activeName: {
    type: String,
    default: () => ''
  },
  isMulilt: { // 是否多选
    type: Boolean,
    default: () => false
  },
  deviceType: { // 弹窗类型 pc端： pc , 移动:mobile
    type: String,
    default: () => 'pc'
  },
  customLinkArr: { // 自定义链接回显数据
    type: Object,
    default: () => {}
  }
})

// 这里拿到取消选中的哪项
const multipTableRef = ref(null)
let multipleSelection = [] // 表格选中的数据
const handleCancelSelected = (rows, row) => {
  const selected = rows.length && rows.indexOf(row) !== -1
  // 如果当前是取消勾选的情况
  if (!selected) {
    multipleSelection = []
    setTimeout(() => {
      multipleSelection.push(row)
      multipTableRef.value?.toggleRowSelection(row, true)
    }, 100)
  }
}
// 选中
let flag = false // 处理table回显触发selection-change
const tableList = ref([]) // 列表数据
const selectChange = (rows) => {
  if (flag) return
  multipleSelection = rows
  if (multipleSelection.length > 1) {
    const delShow = multipleSelection.shift()
    tableList.value.forEach(item => {
      if (delShow.renovationId === item.renovationId) {
        multipTableRef.value?.toggleRowSelection(item, false)
      }
    })
  }
  emit('handleGoodsSelect', { type: 'smallPageItem', value: multipleSelection[0] })
}
// 移除重复
const removeDuplicCateObj = (arr) => {
  const obj = {}
  arr = arr.reduce((newArr, next) => {
    if (!obj[next.renovationId]) {
      obj[next.renovationId] = true
      newArr.push(next)
    }
    return newArr
  }, [])
  return arr
}
// 获取微页面
const perProps = ref({ // 分页
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const pageLoading = ref(false) // 页面loading
const getSmallPage = (val) => {
  const { pageNum, pageSize } = perProps.value
  pageLoading.value = true
  let url = ''
  let type = 0
  if (props.deviceType === 'pc') {
    url = '/mall4cloud_admin/mp/shop_renovation/page'
    type = 1
  } else if (props.deviceType === 'mobile') {
    url = '/mall4cloud_admin/mp/shop_renovation/page_h5'
    type = 2
  }
  request({
    url,
    methods: 'get',
    params: {
      pageNum, // 当前页
      pageSize, // 每页显示多少条
      renovationType: type // 1表示pc端，2表示移动端
    }
  }).then((data) => {
    pageLoading.value = false
    tableList.value = data.list
    perProps.value.total = data.total
    setDataShow(val)
  }).catch(() => {
    pageLoading.value = false
  })
}
let showEchData = [] // 回显数据
const sizeChangeHandle = (val) => {
  perProps.value.pageSize = val
  showEchData = multipleSelection
  getSmallPage()
}
const currentChangeHandle = (val) => {
  perProps.value.pageNum = val
  showEchData = multipleSelection
  getSmallPage()
}
// 数据回显
const setDataShow = (val) => {
  flag = true
  const arr = []
  let otherArr = []
  let userArr = []
  nextTick(() => {
    if (val === 'search') {
      multipTableRef.value && multipTableRef.value?.clearSelection()
    }
    tableList.value.forEach(item => {
      showEchData.forEach(v => {
        if (item.renovationId === v.renovationId) {
          arr.push(item)
          multipTableRef.value && multipTableRef.value?.toggleRowSelection(item, true)
        } else if (item.renovationId !== v.renovationId) {
          otherArr.push(v)
          otherArr = removeDuplicCateObj(otherArr)
        }
      })
    })
    userArr = [...arr, ...otherArr]
    userArr = removeDuplicCateObj(userArr)
    // 回显的时候，需要emit通知父组件这次是回显，可以直接点击确定
    if (isShowData() || !props.isMulilt) { // 单选回显
      emit('handleGoodsSelect', { type: 'smallPageItem', value: userArr[0] })
    }
    setTimeout(() => {
      flag = false
    }, 200)
  })
}
// 判断当前是否是多选回显还是单选回显
const isShowData = () => {
  return props.customLinkArr && props.customLinkArr.type !== '' && props.customLinkArr.type === '5'
}

watch(() => props.activeName, (val) => { // 激活tabbar
  if (val === '5') {
    // 回显数据
    if (isShowData()) {
      const arr = []
      const obj = {
        name: props.customLinkArr.title,
        renovationId: Array.isArray(props.customLinkArr.link) ? props.customLinkArr.link[0] : props.customLinkArr.link
      }
      arr.push(obj)
      showEchData = arr
      multipleSelection = showEchData
    } else {
      showEchData = []
      multipleSelection = []
    }
    // 获取微页面
    getSmallPage()
  }
})
</script>
<style lang="scss" scoped>
.component-small-modal-content {
  min-height: 450px;
  max-height: 450px;
  height: 450px;
  overflow-y: auto;
  .tables {
    width: 93%;
    margin: 0 auto;
    margin-bottom: 20px;
  }
}

</style>
<!--eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style lang="scss">
.component-small-modal-content {
  .table-header {
    &:nth-child(1) {
      .cell {
        display: none;
      }
    }
  }
}
.tables-checkedbox {
  .el-checkbox {
    .el-checkbox__inner {
      position: relative;
      &:after {
        border: 0;
        position: absolute;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #fff;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .el-checkbox__inner {
      border-radius: 50%;
    }
    &.is-checked {
      .el-checkbox__inner {
        position: relative;
        &:after {
          border: 0;
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #fff;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
}
</style>
