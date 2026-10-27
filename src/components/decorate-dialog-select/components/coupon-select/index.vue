<template>
  <div class="component-conpon-select">
    <div class="goods-form">
      <el-form
        ref="searchFormRef"
        inline
        :model="searchForm"
        label-width="108px"
        @submit.prevent
      >
        <el-form-item label="优惠券名称：">
          <el-input
            v-model.trim="searchForm.keyword"
            placeholder="请输入优惠券名称"
          />
        </el-form-item>
        <el-form-item
          label="优惠券类型："
          prop="couponType"
        >
          <el-select
            v-model="searchForm.couponType"
            placeholder="请选择优惠券类型"
            clearable
          >
            <el-option
              label="代金券"
              value="1"
            />
            <el-option
              label="折扣券"
              value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="searchbtn"
            @click="handleSearch"
          >
            {{ $t('pcdecorate.commonModal.search') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tables">
      <el-table
        ref="multipTableRef"
        v-loading="tableLoading"
        style="width: 100%"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        row-key="couponId"
        :data="tableList"
        height="320"
        :class="{'tables-checkedbox': !isMulilt}"
        @select="handleCancelSelected"
        @selection-change="handleSelectChange"
      >
        <el-table-column
          type="selection"
          :reserve-selection="false"
        />
        <el-table-column
          prop="couponName"
          min-width="150px"
          label="优惠券名称"
          align="left"
          show-overflow-tooltip
        />
        <el-table-column
          prop="startTime"
          min-width="170px"
          label="开始时间"
          align="left"
          show-overflow-tooltip
        >
          <template #default="{row}">
            {{ row.startTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="endTime"
          min-width="170px"
          label="结束时间"
          align="left"
          show-overflow-tooltip
        >
          <template #default="{row}">
            {{ row.endTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="couponType"
          label="优惠券类型"
          min-width="110px"
          align="left"
          show-overflow-tooltip
        >
          <template #default="scope">
            <div class="tag-text">
              {{ ['', '代金券', '折扣券', '兑换券'][scope.row.couponType] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="putonStatus"
          label="投放状态"
          align="left"
          show-overflow-tooltip
        >
          <template #default="{row}">
            <span v-if="row.putonStatus === 1">投放</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stocks"
          label="库存"
          align="left"
          show-overflow-tooltip
        />
      </el-table>
      <el-pagination
        style="margin-top: 12px; text-align: right;"
        :current-page="perProps.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="perProps.perPage"
        layout="->,total, sizes, prev, pager, next, jumper"
        :total="perProps.total"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>
<script setup>
import * as api from '@/api/coupon/coupon'

const emit = defineEmits([
  'handleGoodsSelect'
])
const props = defineProps({
  activeName: {
    type: String,
    default: () => ''
  },
  currentGoodsType: { // 优惠券类型
    type: String,
    default: () => 'normal'
  },
  goodsType: { // 优惠券类型(对应PC端的限时秒和优惠团购)
    type: [String, Number],
    default: () => ''
  },
  isMulilt: { // 是否支持多选
    type: Boolean,
    default: () => false
  },
  goodsNumber: { // 限制添加的个数
    type: [String, Number],
    default: () => 0
  },
  // eslint-disable-next-line vue/require-default-prop
  dataUrl: { // 活动的url
    type: String
  },
  // eslint-disable-next-line vue/require-default-prop
  prodType: { // 类型(对于移动端的限时秒杀和团购)
    type: Number
  },
  deviceType: { // 弹窗类型 pc端： pc , 移动:mobile
    type: String,
    default: () => 'pc'
  },
  echoDataList: { // 回显数据
    type: Array,
    default: () => []
  },
  customLinkArr: { // 自定义链接回显数据
    type: Object,
    default: () => {}
  }
})

const searchForm = reactive({}) // 查询条件
const tableList = ref([]) // 优惠券列表
let multipleSelection = [] // 表格选中的数据
const tableLoading = ref(false) // 表格的loading
const perProps = reactive({ // 分页
  perPage: 10,
  page: 1,
  total: 0
})

let showEchData = [] // 回显数据
let flag = false

// 这里拿到取消选中的哪项
const multipTableRef = ref(null)
const handleCancelSelected = (rows, row) => {
  const selected = rows.length && rows.indexOf(row) != -1
  if (props.isMulilt) { // 如果当前是多选
    // 如果当前是取消勾选的情况
    if (!selected) {
      showEchData.forEach((item, index) => {
        if (item.couponId == row.couponId) {
          showEchData.splice(index, 1)
        }
      })
      multipleSelection.forEach((item, index) => {
        if (item.couponId == row.couponId) {
          multipleSelection.splice(index, 1)
        }
      })
    }
    emit('handleGoodsSelect', { type: 'couponsItem', value: multipleSelection })
  } else { // 单选
    if (!selected) { // 取消选中
      multipleSelection = []
      setTimeout(() => {
        multipleSelection.push(row)
        multipTableRef.value?.toggleRowSelection(row, true)
      }, 100)
    }
  }
}
const handleSelectChange = (rows) => {
  if (flag) return
  if (props.isMulilt) { // 当前支持多选
    multipleSelection = removeDuplicCateObj([...multipleSelection, ...rows])
    if (props.goodsNumber != 0) { // 如果不为0的情况下，说明用户限制了当前选择的数量
      if (multipleSelection.length > props.goodsNumber) {
        const delRow = multipleSelection.shift()
        tableList.value.forEach(item => {
          if (delRow.couponId == item.couponId) {
            multipTableRef.value?.toggleRowSelection(item, false)
          }
        })
      }
    }
    emit('handleGoodsSelect', { type: 'couponsItem', value: multipleSelection })
  } else { // 否则就是单选
    multipleSelection = rows
    if (multipleSelection.length > 1) {
      const delRow = multipleSelection.shift()
      tableList.value.forEach(item => {
        if (delRow.couponId == item.couponId) {
          multipTableRef.value?.toggleRowSelection(item, false)
        }
      })
    }
    emit('handleGoodsSelect', { type: 'couponsItem', value: multipleSelection[0] })
  }
}
// 移除重复
const removeDuplicCateObj = (arr) => {
  const obj = {}
  arr = arr.reduce((newArr, next) => {
    // eslint-disable-next-line no-unused-expressions
    obj[next.couponId] ? '' : (obj[next.couponId] = true && newArr.push(next))
    return newArr
  }, [])
  return arr
}
// 获取优惠券信息
const getCouponListMessage = (val) => {
  if (val === 'search') {
    perProps.page = 1
  }
  const { page, perPage } = perProps
  tableLoading.value = true
  api.page({
    pageNum: page,
    pageSize: perPage,
    couponType: searchForm.couponType, // 类型
    couponName: searchForm.keyword, // 名称
    putonStatus: 1,
    getWay: 0,
    status: 1
  }).then((data) => {
    tableList.value = data.list
    perProps.total = data.total
    tableLoading.value = false
    setDataShow(val)
  })
}
// 分页每页多少条
const onPageSizeChange = (val) => {
  perProps.perPage = val
  showEchData = multipleSelection
  getCouponListMessage()
}
// 分页当前第几页
const onPageChange = (val) => {
  perProps.page = val
  showEchData = multipleSelection
  getCouponListMessage()
}
// 搜索
const handleSearch = () => {
  getCouponListMessage('search')
}

// 数据回显
const setDataShow = (val) => {
  flag = true
  const arr = []
  let otherArr = []
  let userArr = []
  nextTick(() => {
    if (val === 'search') {
      multipTableRef.value?.clearSelection() // 清除上一次回显内容
    }
    tableList.value.forEach(item => {
      showEchData.forEach(v => {
        if (item.couponId === v.couponId) { // 设置当前页的选中
          arr.push(item)
          multipTableRef.value?.toggleRowSelection(item, true)
        } else if (item.couponId != v.couponId) { // 不是当前页的也要记录下来
          otherArr.push(v)
          otherArr = removeDuplicCateObj(otherArr)
        }
      })
    })
    userArr = [...arr, ...otherArr]
    userArr = removeDuplicCateObj(userArr)
    // 回显的时候，需要emit通知父组件这次是回显，可以直接点击确定
    if (isShowData() || !props.isMulilt) { // 单选通知
      emit('handleGoodsSelect', { type: 'couponsItem', value: userArr[0] })
    } else { // 多选通知
      emit('handleGoodsSelect', { type: 'couponsItem', value: userArr })
    }
    setTimeout(() => {
      flag = false
    }, 200)
  })
}
// 判断当前是否是多选回显还是单选回显
const isShowData = () => {
  return props.customLinkArr && props.customLinkArr.type !== '' && props.customLinkArr.type === '7'
}

watch(() => props.activeName, async (val) => {
  if (val === '7') { // 当前是选择优惠券
    searchForm.keyword = ''
    // 回显数据
    if (isShowData()) { // 判断如果在操作热区
      showEchData = JSON.parse(JSON.stringify([{
        couponName: props.customLinkArr.title,
        couponId: props.customLinkArr.link
      }]))
      multipleSelection = showEchData
    } else {
      showEchData = JSON.parse(JSON.stringify(props.echoDataList))
      showEchData.forEach(item => {
        item.couponName = item.name || item.couponName // 商品名称
        item.couponId = item.id || item.couponId // 商品id
      })
      multipleSelection = showEchData
    }
    // 获取优惠券列表
    getCouponListMessage()
  }
})
</script>

<style lang="scss" scoped>
.component-conpon-select {
  .goods-form {
    .searchbtn {
      width: 68px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #155BD4;
      border-radius: 2px;
      margin: 4px 0 0 10px;
    }
  }
  .tables {
    margin: 0 auto 20px;
  }
}
</style>
<!--eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style lang="scss">
.component-conpon-select {
  min-height: 450px;
  max-height: 450px;
  height: 450px;
  overflow-y: auto;
  .goods-form {
    .el-input__inner {
      height: 32px;
    }
  }
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
