<template>
  <div class="component-goods-modal-content">
    <div class="goods-form">
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="searchFormRef"
        inline
        :model="searchForm"
        label-width="108px"
        @submit.prevent
      >
        <el-form-item label="商品名称：">
          <el-input
            v-model.trim="searchForm.keyword"
            placeholder="请输入商品名称"
          />
        </el-form-item>
        <el-form-item :label="$t('pcdecorate.shopMessage.goodsCategory')+'：'">
          <el-cascader
            v-model="selectedCategory"
            expand-trigger="hover"
            :options="categoryList"
            :props="categoryTreeProps"
            :clearable="true"
            @change="handleChange"
          />
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
        row-key="spuId"
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
          prop="prodName"
          min-width="150px"
          :label="$t('pcdecorate.shopMessage.goods')"
          align="left"
          show-overflow-tooltip
        >
          <template #default="scope">
            <div
              class="names"
              style="display: flex;align-items: center"
            >
              <img-show
                :img-style="{width: '48px',height: '48px',marginRight: '15px'}"
                :src="scope.row.mainImgUrl"
              />
              <span
                style="width: calc(100% - 65px);overflow:hidden;text-overflow: ellipsis;white-space: nowrap"
              >{{ scope.row.spuName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          width="150px"
          :label="$t('pcdecorate.shopMessage.goodsPrice')"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <span style="color: #E1251B ">￥{{ formatPrice(scope.row.priceFee,1).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stock"
          width="120px"
          :label="$t('pcdecorate.shopMessage.inventory')"
          align="center"
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
import request from '@/utils/request'
import { treeDataTranslate, formatPrice } from '@/utils'
import { defineExpose } from 'vue'

const emit = defineEmits([
  'handleGoodsSelect'
])
const props = defineProps({
  activeName: {
    type: String,
    default: () => ''
  },
  currentGoodsType: { // 商品类型
    type: String,
    default: () => 'normal'
  },
  goodsType: { // 商品类型(对应PC端的限时秒和优惠团购)
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

const categoryTreeProps = {
  value: 'categoryId',
  label: 'name'
}

// 这里拿到取消选中的哪项
const multipTableRef = ref(null)
const tableList = ref([]) // 商品列表
let multipleSelection = [] // 表格选中的数据
let showEchData = [] // 回显数据
const handleCancelSelected = (rows, row) => {
  const selected = rows.length && rows.indexOf(row) !== -1
  if (props.isMulilt) { // 如果当前是多选
    // 如果当前是取消勾选的情况
    if (!selected) {
      showEchData.forEach((item, index) => {
        if (item.spuId === row.spuId) {
          showEchData.splice(index, 1)
        }
      })
      multipleSelection.forEach((item, index) => {
        if (item.spuId === row.spuId) {
          multipleSelection.splice(index, 1)
        }
      })
    } else {
      multipleSelection = removeDuplicCateObj([...multipleSelection, row])
      if (props.goodsNumber !== 0) { // 如果不为0的情况下，说明用户限制了当前选择的数量
        if (multipleSelection.length > props.goodsNumber) {
          const delRow = multipleSelection.shift()
          tableList.value.forEach(item => {
            if (delRow.spuId === item.spuId) {
              multipTableRef.value?.toggleRowSelection(item, false)
            }
          })
        }
      }
    }
    emit('handleGoodsSelect', { type: 'goodsItem', value: multipleSelection })
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
    emit('handleGoodsSelect', { type: 'goodsItem', value: multipleSelection })
  } else { // 否则就是单选
    multipleSelection = rows
    if (multipleSelection.length > 1) {
      const delRow = multipleSelection.shift()
      tableList.value.forEach(item => {
        if (delRow.spuId === item.spuId) {
          multipTableRef.value?.toggleRowSelection(item, false)
        }
      })
    }
    emit('handleGoodsSelect', { type: 'goodsItem', value: multipleSelection[0] })
  }
}
// 移除重复
const removeDuplicCateObj = (arr) => {
  const obj = {}
  arr = arr.reduce((newArr, next) => {
    if (!obj[next.spuId]) {
      obj[next.spuId] = true
      newArr.push(next)
    }
    return newArr
  }, [])
  return arr
}
// 获取商品信息
const searchForm = ref({}) //  查询条件
const tableLoading = ref(false) // 表格的loading
const perProps = ref({ // 分页
  perPage: 10,
  page: 1,
  total: 0
})
const getGoodsListMessage = (val) => {
  if (val === 'search') {
    perProps.value.page = 1
  }
  const { page, perPage } = perProps.value
  if (props.dataUrl) { // 活动url存在
    tableLoading.value = true
    request({
      url: props.dataUrl,
      method: 'get',
      params: {
        pageNum: page,
        pageSize: perPage,
        categoryId: searchForm.value.categoryId, // 商品分类
        spuType: props.prodType, // 商品类型
        keyword: searchForm.value.keyword, // 商品名称
        spuStatus: 1
      }
    }).then((data) => {
      tableList.value = []
      if (data.list) {
        tableList.value = data.list[0].spus
      }
      perProps.value.total = data.total
      tableLoading.value = false
      setDataShow(val)
    }).catch(() => {
      tableLoading.value = false
    })
  } else { // 普通商品
    tableLoading.value = true
    request({
      url: '/mall4cloud_search/mp/search/renovation_page',
      method: 'get',
      params: {
        spuType: searchForm.value.prodType, // 商品类型
        shopSecondaryCategoryId: searchForm.value.categoryId, // 商品分类
        keyword: searchForm.value.keyword, // 商品名称
        pageNum: page,
        pageSize: perPage,
        spuStatus: 1
      }
    }).then((data) => {
      tableList.value = []
      if (data.list) {
        tableList.value = data.list[0].spus
      }
      perProps.value.total = data.total
      tableLoading.value = false
      setDataShow(val) // 选中数据回显
    }).catch(() => {
      tableLoading.value = false
    })
  }
}
// 分页每页多少条
const onPageSizeChange = (val) => {
  perProps.value.perPage = val
  showEchData = multipleSelection
  getGoodsListMessage()
}
// 分页当前第几页
const onPageChange = (val) => {
  perProps.value.page = val
  showEchData = multipleSelection
  getGoodsListMessage()
}
// 搜索
const handleSearch = () => {
  getGoodsListMessage('search')
}
// 选择商品分类
const handleChange = (val) => {
  if (val) {
    searchForm.value.categoryId = val[val.length - 1]
  } else {
    searchForm.value.categoryId = null
  }
}
// 获取商品分类
const categoryList = ref([]) // 商品分类下拉列表
const getGoodsCategoryList = () => {
  return new Promise((resolve) => {
    request({
      url: '/mall4cloud_product/mp/category/enable_categories',
      method: 'get',
      params: {
        maxGrade: 2,
        status: 1
      }
    }).then((data) => {
      categoryList.value = treeDataTranslate(data, 'categoryId', 'parentId')
      searchForm.value.prodType = props.goodsType
      resolve(true)
    })
  })
}
// 数据回显
let flag = false
const setDataShow = (val) => {
  flag = true
  nextTick(() => {
    if (val === 'search') {
      multipTableRef.value && multipTableRef.value?.clearSelection() // 清除上一次回显内容
    }
    const spuIds = multipleSelection.map(x => x.spuId)
    tableList.value.forEach(item => {
      if (spuIds.indexOf(item.spuId) > -1) {
        multipTableRef.value?.toggleRowSelection(item, true)
      }
    })
    // 回显的时候，需要emit通知父组件这次是回显，可以直接点击确定
    if (isShowData() || !props.isMulilt) { // 单选通知
      emit('handleGoodsSelect', { type: 'goodsItem', value: multipleSelection[0] })
    } else { // 多选通知
      emit('handleGoodsSelect', { type: 'goodsItem', value: multipleSelection })
    }
    setTimeout(() => {
      flag = false
    }, 200)
  })
}
// 判断当前是否是多选回显还是单选回显
const isShowData = () => {
  return props.customLinkArr && props.customLinkArr.type !== '' && props.customLinkArr.type === '1'
}
const compoundName = () => {
  showEchData.forEach(item => {
    item.prodName = item.name || item.prodName // 商品名称
    item.pic = item.imgs || item.pic // 商品图片
    item.brief = item.description || item.brief // 商品描述
    item.oriPrice = item.orignPrice ? item.orignPrice : '' // 商品原价
    if (props.goodsType === 2) {
      item.activityId = item.id // 活动id
    } else {
      item.spuId = item.id || item.spuId // 商品id
    }
  })
}
const selectedCategory = ref([]) // 选中的商品分类
watch(() => props.activeName, async (val) => { // 监听当前激活的是
  if (val === '1') { // 当前是选择商品
    searchForm.value.keyword = ''
    selectedCategory.value = ''
    searchForm.value.categoryId = ''
    // 获取商品分类
    await getGoodsCategoryList()
    // 回显数据
    if (isShowData()) { // 判断如果在操作热区
      const obj = {
        name: props.customLinkArr.title,
        id: props.customLinkArr.link,
        imgs: '',
        brief: ''
      }
      const arr = []
      arr.push(obj)
      showEchData = JSON.parse(JSON.stringify(arr))
      // 做这一步是为了商品组件等下可以将之前选的数据和用户操作的商品进行合并(保证点击确定的时候字段名一样)
      if (!props.prodType) { // 非移动活动商品
        compoundName()
      }
      multipleSelection = showEchData
    } else {
      showEchData = JSON.parse(JSON.stringify(props.echoDataList))
      multipleSelection = showEchData
      if (!props.prodType) { // 非移动活动商品
        compoundName()
      }
    }
    // 获取商品列表
    getGoodsListMessage()
  }
})
defineExpose({ multipTableRef })
</script>
<style lang="scss" scoped>
.component-goods-modal-content {
  min-height: 450px;
  max-height: 450px;
  height: 450px;
  overflow-y: auto;
  .goods-form {
    :deep(.el-input__inner) {
      height: 32px;
    }
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
    width: 93%;
    margin: 0 auto;
    margin-bottom: 20px;
  }
}
</style>
<!--eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style lang="scss">
.component-goods-modal-content {
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
