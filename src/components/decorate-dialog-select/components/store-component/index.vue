<template>
  <div class="component-category-modal-content">
    <div class="category-form">
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="searchFormRef"
        inline
        :model="searchForm"
        label-width="108px"
        @submit.prevent
      >
        <el-form-item :label="$t('pcdecorate.commonModal.storeName')+'：'">
          <el-input
            v-model.trim="searchForm.shopName"
            placeholder="输入店铺名称搜索"
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
        row-key="shopId"
        :data="tableList"
        height="320"
        :class="{'tables-checkedbox': !isMulilt}"
        @select="handleCancelSelected"
        @selection-change="handleSelectChange"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          align="center"
          width="55"
        />
        <el-table-column
          prop="shopName"
          :label="$t('pcdecorate.shopMessage.storeMessage')"
          align="left"
          show-overflow-tooltip
        >
          <template #default="scope">
            <div class="shopName-content">
              <el-image
                :src="checkFileUrl(scope.row.shopLogo)"
                fit="fill"
              >
                <template #error>
                  <div class="image-slot">
                    <img
                      src="@/assets/images/def.png"
                      alt=""
                    >
                  </div>
                </template>
              </el-image>
              <span style="width: calc(100% - 65px);overflow:hidden;text-overflow: ellipsis;white-space: nowrap">{{ scope.row.shopName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          width="200px"
          :label="$t('pcdecorate.shopMessage.shopType')"
          align="center"
        >
          <template #default="scope">
            <div
              v-if="scope.row.type === 2"
              class="noraml-store"
            >
              <span>{{ storeType(scope.row.type) }}</span>
            </div>
            <div
              v-else-if="scope.row.type === 1"
              class="pre-store"
            >
              <span>{{ storeType(scope.row.type) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="shopStatus"
          width="150"
          :label="$t('pcdecorate.shopMessage.shopStatus')"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <span
              v-if="scope.row.shopStatus === -1"
              class="tag-text"
            >{{ $t('pcdecorate.shopMessage.notOpen') }}</span>
            <span
              v-else-if="scope.row.shopStatus === 0"
              class="tag-text"
            >{{ $t('pcdecorate.shopMessage.closed') }}</span>
            <span
              v-else-if="scope.row.shopStatus === 1"
              class="tag-text active"
            >{{ $t('pcdecorate.shopMessage.business') }}</span>
            <span
              v-else-if="scope.row.shopStatus === 2"
              class="tag-text"
            >
              {{ $t('pcdecorate.shopMessage.platformOffline') }}
            </span>
            <span
              v-else-if="scope.row.shopStatus === 3 || scope.row.shopStatus === 5"
              class="tag-text"
            >
              {{ $t('pcdecorate.shopMessage.platformOfflineReview') }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 12px; text-align: right;"
        :current-page="perProps.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="perProps.perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="perProps.total"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>
<script setup>
import request from '@/utils/request'
const emit = defineEmits([
  'handleGoodsSelect'
])
const props = defineProps({
  activeName: {
    type: String,
    default: () => ''
  },
  isMulilt: { // 是否支持多选
    type: Boolean,
    default: () => false
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

const searchForm = ref({})
const tableList = ref([]) // 店铺列表
let multipleSelection = [] // 表格选中的数据
const tableLoading = ref(false) // 表格loading
const perProps = ref({ // 分页
  page: 1,
  perPage: 10,
  total: 0
})
let showEchData = [] // 回显数据
let flag = false // 用来处理table 方法被触发的问题
// 店铺类型
const storeType = computed(() => {
  return (type) => {
    if (type === 1) {
      return $t('pcdecorate.shopMessage.ordinaryShops')
    } else if (type === 2) {
      return $t('pcdecorate.shopMessage.preferShops')
    } else {
      return ''
    }
  }
})

// 这里拿到取消选中的哪项
const multipTableRef = ref(null)
const handleCancelSelected = (rows, row) => {
  const selected = rows.length && rows.indexOf(row) !== -1
  if (props.isMulilt) { // 如果当前是多选
    // 如果当前是取消勾选的情况
    if (!selected) {
      showEchData.forEach((item, index) => {
        if (item.shopId === row.shopId) {
          showEchData.splice(index, 1)
        }
      })
    }
  } else { // 否则就是单选
    if (!selected) {
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
    multipleSelection = removeDuplicCateObj([...showEchData, ...rows])
    emit('handleGoodsSelect', { type: 'storeItem', value: multipleSelection })
  } else { // 否则就是单选
    multipleSelection = rows
    if (multipleSelection.length > 1) {
      const delShow = multipleSelection.shift()
      tableList.value.forEach(item => {
        if (delShow.shopId === item.shopId) {
          multipTableRef.value?.toggleRowSelection(item, false)
        }
      })
    }
    emit('handleGoodsSelect', { type: 'storeItem', value: multipleSelection[0] })
  }
}
// 移除重复
const removeDuplicCateObj = (arr) => {
  const obj = {}
  arr = arr.reduce((newArr, next) => {
    if (!obj[next.shopId]) {
      obj[next.shopId] = true
      newArr.push(next)
    }
    return newArr
  }, [])
  return arr
}
// 搜索
const handleSearch = () => {
  getStoreList('search')
}
// 获取店铺列表
const getStoreList = (val) => {
  if (val === 'search') {
    searchForm.value.page = 1
  }
  const { page, perPage } = searchForm.value
  tableLoading.value = true
  request({
    url: '/mall4cloud_admin/p/shop_detail/search_shops',
    method: 'get',
    params: {
      pageNum: page,
      pageSize: perPage,
      shopName: searchForm.value.shopName
    }
  }).then((data) => {
    tableList.value = data.list
    searchForm.value.total = data.total
    tableLoading.value = false
    setDataShow(val) // 回显表格
  }).catch(() => {
    tableLoading.value = false
  })
}
// 分页每页显示多少条
const onPageSizeChange = (val) => {
  searchForm.value.perPage = val
  showEchData = multipleSelection
  getStoreList()
}
// 分页显示第几页
const onPageChange = (val) => {
  searchForm.value.page = val
  showEchData = multipleSelection
  getStoreList()
}
// 数据回显
const setDataShow = (val) => {
  flag = true
  const arr = []
  let otherArr = []
  let userArr = []
  nextTick(() => {
    if (val === 'search') {
      multipTableRef.value && multipTableRef.value?.clearSelection() // 清除上一次回显内容
    }
    tableList.value.forEach(item => {
      showEchData.forEach(v => {
        if (item.shopId === v.shopId) {
          arr.push(item)
          multipTableRef.value && multipTableRef.value?.toggleRowSelection(item, true)
        } else if (item.shopId !== v.shopId) {
          otherArr.push(v)
          otherArr = removeDuplicCateObj(otherArr)
        }
      })
    })
    userArr = [...arr, ...otherArr]
    userArr = removeDuplicCateObj(userArr)
    // 回显的时候，需要emit通知父组件这次是回显，可以直接点击确定
    if (isShowData() || !props.isMulilt) { // 单选通知
      emit('handleGoodsSelect', { type: 'storeItem', value: userArr[0] })
    } else { // 多选通知
      emit('handleGoodsSelect', { type: 'storeItem', value: userArr })
    }
    setTimeout(() => {
      flag = false
    }, 200)
  })
}
// 判断当前是否是多选回显还是单选回显
const isShowData = () => {
  return props.customLinkArr && props.customLinkArr.type !== '' && props.customLinkArr.type === '3'
}

watch(() => props.activeName, (val) => {
  if (val === '3') {
    searchForm.value.shopName = ''
    // 回显数据
    if (isShowData()) {
      const arr = []
      const obj = {
        shopId: props.customLinkArr.link,
        shopName: props.customLinkArr.title
      }
      arr.push(obj)
      showEchData = arr
      multipleSelection = showEchData
    } else {
      // 回显数据
      showEchData = JSON.parse(JSON.stringify(props.echoDataList))
    }
    // 获取店铺列表
    getStoreList('search')
  }
})
defineExpose({ multipTableRef })
</script>
<style lang="scss" scoped>
.component-category-modal-content {
  min-height: 450px;
    max-height: 450px;
    height: 450px;
    overflow-y: auto;
  :deep(.el-input__inner) {
      height: 32px;
  }
  :deep(.table-header) {
      &:nth-child(1) {
          .cell {
              display: none;
          }
      }
  }
  .tables-checkedbox {
    :deep(.el-checkbox) {
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
    .category-form {
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
        .shopName-content {
            display: flex;
            align-items: center;
            :deep(.el-image) {
                width: 48px;
                height: 48px;
                margin-right: 15px;
            }
        }
    }
    .noraml-store {
        display: flex;
        justify-content: center;
        span {
            min-width: 66px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333333;
            font-size: 12px;
            border: 1px solid rgba(0, 0, 0, 0.15);
            border-radius: 3px;
        }

    }
    .pre-store {
        display: flex;
        justify-content: center;
        span {
            min-width: 66px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #155BD4;
            color: #155BD4 ;
            font-size: 12px;
            border-radius: 3px;
        }
    }
    .tag-text {
        height: 24px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 3px;
        display: inline-block;
        font-size: 12px;
        padding: 0 8px;
        line-height: 24px;
        &.active {
            border: 1px solid #155BD4;
            color: #155BD4 ;
        }
    }
}

</style>
