<template>
  <!-- 发布商品：分类选择组件 -->
  <div class="category-selection-component">
    <div class="category-select-box">
      <!-- 第一级 -->
      <div class="category-select-item">
        <div class="int-box">
          <input
            disabled
            class="se-int"
            placeholder="选择第一级分类"
          >
        </div>
        <ul class="category-list">
          <li
            v-for="(item, index) in firstCat.dataList"
            v-show="showFirstCat(item.categoryId)"
            :key="item.categoryId"
            class="category-item"
            :class="item.categoryId == firstCat.id ? 'active' : ''"
            @click="selectFirstCat(item.categoryId, index)"
          >
            <div class="category-txt">
              {{ item.name }}
            </div>
            <el-icon
              v-if="categoryType === 'platform'"
              class="el-icon-arrow-right"
            >
              <ArrowRight />
            </el-icon>
          </li>
          <div
            v-if="!initCategoryIng && categoryType === 'platform' && !firstCatFlag"
            class="category-empty-tips"
          >
            暂无已签约分类，请前往
            <span
              class="default-btn text-btn btn"
              @click="toShopInfo"
            >店铺信息</span>'申请签约分类',
          </div>
          <div
            v-if="!initCategoryIng && categoryType === 'store' && !allDataList.length"
            class="category-empty-tips"
          >
            暂无店铺分类，请前往
            <span
              class="default-btn text-btn btn"
              @click="toCategory"
            >分类管理</span>
            创建
          </div>
        </ul>
      </div>
      <!-- 第二级 v-if="firstCat.id !== 0 && secondCat.dataList.length" -->
      <div
        v-if="(firstCat.dataList.length&&firstCatFlag)||(firstCat.dataList.length&&categoryType === 'store')"
        class="category-select-item"
      >
        <div class="int-box">
          <input
            disabled
            class="se-int"
            placeholder="选择第二级分类"
          >
        </div>
        <ul class="category-list">
          <li
            v-for="(item, index) in secondCat.dataList"
            v-show="categoryType === 'platform'?showSecondCat(item.categoryId):true"
            :key="item.categoryId"
            class="category-item"
            :class="item.categoryId == secondCat.id ? 'active' : ''"
            @click="selectSecondCat(item.categoryId, index)"
          >
            <div class="category-txt">
              {{ item.name }}
            </div>
            <el-icon
              v-if="categoryType === 'platform'"
              class="el-icon-arrow-right"
            >
              <ArrowRight />
            </el-icon>
          </li>
          <li
            v-if="!secondCat.dataList.length"
            class="cate-empty"
          >
            请先选择第一级类目
          </li>
        </ul>
      </div>
      <!-- 第三级 v-if="secondCat.id !== 0 && threeCat.dataList.length && categoryType === 'platform'" -->
      <div
        v-if="categoryType === 'platform' && firstCat.dataList.length&&firstCatFlag"
        class="category-select-item"
      >
        <div class="int-box">
          <input
            disabled
            class="se-int"
            placeholder="选择第三级分类"
          >
        </div>
        <ul class="category-list">
          <li
            v-for="(item, index) in threeCat.dataList"
            :key="item.categoryId"
            class="category-item"
            :class="item.categoryId == threeCat.id ? 'active' : ''"
            @click="selectThreeCat(item.categoryId, index)"
          >
            {{ item.name }}
          </li>
          <li
            v-if="!threeCat.dataList.length"
            class="cate-empty"
          >
            请先选择第二级类目
          </li>
        </ul>
      </div>
    </div>

    <!-- 已选 -->
    <div class="selected-results">
      <div
        v-if="categoryType === 'platform'"
        class="sel-con"
      >
        已选SaaS分类：
        <span class="cur-cate">{{ firstCat.name }}</span>
        <span
          v-if="secondCat.id"
          class="cur-cate"
        >&nbsp;>&nbsp;&nbsp;{{ secondCat.name }}</span>
        <span
          v-if="threeCat.id"
          class="cur-cate"
        >&nbsp;>&nbsp;&nbsp;{{ threeCat.name }}</span>
      </div>
      <div
        v-if="categoryType === 'store'"
        class="sel-con"
      >
        已选店铺分类：
        <span class="cur-cate">{{ firstCat.name }}</span>
        <span
          v-if="secondCat.id"
          class="cur-cate"
        >&nbsp;>&nbsp;&nbsp;{{ secondCat.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as api from '@/api/product/category'
import Cookies from 'vue-cookies'
import { getDomain } from '@/utils/index.js'
const prodData = inject('prodData')

const props = defineProps({
  // 分类类型：platforSaaS分类 store店铺分类
  categoryType: {
    default: 'platform',
    type: String
  },

  dataForm: {
    required: true,
    type: Object
  }
})

const emit = defineEmits(['update:dataForm', 'reSelection', 'close'])

const setDataForm = computed({
  get: () => props.dataForm,
  set: (val) => emit('update:dataForm', val)
})

const Data = reactive({
  firstCatFlag: false, // 是否有显示的一级分类
  isSingle: true,
  // 第一个分类
  firstCat: {
    id: 0,
    name: '',
    dataList: []
  },
  // 第二个分类
  secondCat: {
    id: 0,
    name: '',
    dataList: []
  },
  // 第三个分类
  threeCat: {
    id: 0,
    name: '',
    dataList: []
  },
  allDataList: [],
  composeType: 0, // 是否是组合商品
  initCategoryIng: true,
  isUnsignedCategories: false,
  lang: window.localStorage.getItem('cloudLang'),
  categoryId: null
})

const { firstCatFlag, firstCat, secondCat, threeCat, allDataList, initCategoryIng } = toRefs(Data)

const route = useRoute()

onBeforeMount(() => {
  Data.initCategoryIng = true
  clearAllCategories()
})

const showSecondCat = (categoryId) => {
  const dataList = Data.allDataList.filter(item => item.parentId === categoryId)
  return dataList.length
}

const showFirstCat = (categoryId) => {
  if (props.categoryType === 'store') {
    return true
  }
  let flag = 0
  const dataList = Data.allDataList.filter(item => item.parentId === categoryId) || []
  dataList.forEach(i => {
    if (Data.allDataList.filter(item => item.parentId === i.categoryId).length) {
      flag++
    }
  })
  if (flag) {
    Data.firstCatFlag = true
  }
  return flag
}

/**
 * 获取分类数据
 * 父组件调用
 */
const getDataList = (categoryId) => {
  Data.categoryId = categoryId
  Data.isUnsignedCategories = true

  if (props.categoryType === 'platform') { // SaaS分类
    api.getMySigningCategoryList().then((data) => {
      Data.allDataList = data

      Data.firstCat.dataList = data.filter(item => item.level === 0 && item.status)

      Data.isUnsignedCategories = false
      if (Data.threeCat.id && !data.find(el => el.categoryId === Data.threeCat.id)) {
        clearAllCategories()
      }

      // 存在传入的categoryId且最新分类列表中包含categoryId
      if (Data.categoryId && Data.allDataList.find(el => el.categoryId === Data.categoryId)) {
        categoryBackDisplay(data)
      } else {
        // 有传入categoryId但是最新分类列表中无对应categoryId（例：已选categoryId被删除），则必须重选
        resetCategory(true)
        api.getMySigningCategoryList({ status: 0 }).then((data1) => {
          if (data1) {
            categoryBackDisplay(data1)
          } else {
            categoryBackDisplay(data)
          }
        })
      }
      Data.initCategoryIng = false
    })
  } else { // 店铺分类
    api.enableCategories().then((data) => {
      // 过滤没有2级分类以及二级分类全部禁用的一级分类
      data = data.filter(item => item.status && (item.level !== 0 || (item.level === 0 && data.some(el => el.status && el.parentId === item.categoryId))))

      Data.allDataList = data

      Data.firstCat.dataList = data.filter(item => item.level === 0 && item.status)
      if (Data.categoryId) {
        const categoryIdList = Data.firstCat.dataList.map((item) => item.categoryId)
        if (categoryIdList.indexOf(Data.categoryId) < 0) {
          prodData.noshopCategoryId()
        }
      }

      Data.isUnsignedCategories = false
      if (Data.threeCat.id && !data.find(el => el.categoryId === Data.threeCat.id)) {
        clearAllCategories()
      }

      // 存在传入的categoryId且最新分类列表中包含categoryId
      if (Data.categoryId && Data.allDataList.find(el => el.categoryId === Data.categoryId)) {
        categoryBackDisplay(data)
      } else {
        // 有传入categoryId但是最新分类列表中无对应categoryId（例：已选categoryId被删除），则必须重选
        resetCategory(true)
        categoryBackDisplay(data)
      }
      Data.initCategoryIng = false
    })
  }
}

/**
 * 分类数据回显
 */
const categoryBackDisplay = (data) => {
  data.forEach((el) => {
    if (props.categoryType === 'platform') {
      // 根据第三级分类id回填第二级分类id（parentId）
      if (el.categoryId === Data.categoryId) {
        Data.secondCat.id = el.parentId
        Data.threeCat.name = el.name
      }
      // 根据第二级分类id回填第一级分类id（parentId）
      if (el.categoryId === Data.secondCat.id) {
        Data.firstCat.id = el.parentId
        Data.secondCat.name = el.name
      }
      // 第一级分类名称
      if (el.categoryId === Data.firstCat.id) {
        Data.firstCat.name = el.name
        selectFirstCat(Data.firstCat.id, null)
        selectSecondCat(Data.secondCat.id, null)
        selectThreeCat(Data.categoryId, null)
      }
    }
    if (props.categoryType === 'store') {
      // 根据第二级分类id回填第一级分类id（parentId）
      if (el.categoryId === Data.categoryId) {
        Data.firstCat.id = el.parentId
        Data.secondCat.name = el.name
        Data.secondCat.id = el.categoryId
        // 获取一级分类数据
        data.forEach(item => {
          if (Data.firstCat.id === item.categoryId) {
            Data.firstCat.name = item.name

            selectFirstCat(Data.firstCat.id, null)
            selectSecondCat(Data.secondCat.id, null)
          }
        })
      }
    }
  })
}

// 重选
const resetCategory = (isRequired) => {
  Data.threeCat = { id: 0, name: '', dataList: [] }
  // 如果点击时已存在categoryId，表示正在重选分类
  if (props.categoryType === 'platform' && (Data.categoryId || isRequired)) {
    emit('reSelection', props.categoryType)
  }
}

const selectFirstCat = (categoryId, index) => {
  Data.firstCat.id = categoryId
  if (index !== null && index !== undefined) {
    Data.firstCat.name = props.categoryType === 'store' && Data.lang === 'en' ? Data.firstCat.dataList[index].name : Data.firstCat.dataList[index].name
    Data.secondCat.id = 0
    Data.threeCat.id = 0
  }
  Data.secondCat.dataList = Data.allDataList.filter(item => item.parentId === categoryId)
  if (props.categoryType === 'platform') {
    Data.threeCat.id = 0
    Data.threeCat.dataList = []
    setDataForm.value.categoryId = 0
  }
  emit('close', props.categoryType)
}

const selectSecondCat = (categoryId, index) => {
  Data.secondCat.id = categoryId
  if (index !== null && index !== undefined) {
    resetCategory()
    Data.secondCat.name = Data.secondCat.dataList[index].name
    Data.threeCat.id = 0
  }
  Data.threeCat.dataList = Data.allDataList.filter(item => item.parentId === categoryId)
  if (props.categoryType === 'platform') {
    emit('close', props.categoryType)
  } else {
    setDataForm.value.shopCategoryId = categoryId
  }
}

const selectThreeCat = (categoryId, index) => {
  Data.threeCat.id = categoryId
  if (index !== null && index !== undefined) {
    Data.threeCat.name = Data.threeCat.dataList[index].name
  }
  if (props.categoryType === 'platform') {
    setDataForm.value.categoryId = categoryId
    prodData.selectedCategoriesChange([Data.firstCat, Data.secondCat, Data.threeCat])
    if (!route.query.spuId) {
      prodData.getAttrsByCategoryId(categoryId)
    }
  }
}
const domain = getDomain()
const toShopInfo = () => {
  Data.isSingle = false
  emit('close', Data.isSingle)
  const path = router.resolve({
    path: '/shop/setting',
    query: {
      activeName: 3,
      ...(Cookies.get(domain) ? {} : { tid: Cookies.get('cloudTid') })
    }
  })
  window.open(path.href, '_blank', 'noopener,noreferrer')
}

const router = useRouter()
const toCategory = () => {
  Data.isSingle = false
  emit('close', Data.isSingle)
  const path = router.resolve({
    path: '/product/manage/category',
    query: { ...(Cookies.get(domain) ? {} : { tid: Cookies.get('cloudTid') }) }
  })
  window.open(path.href, '_blank', 'noopener,noreferrer')
}

// 清空已选分类
const clearAllCategories = () => {
  Data.firstCat = {
    id: 0,
    name: '',
    dataList: []
  }
  Data.secondCat = {
    id: 0,
    name: '',
    dataList: []
  }
  Data.threeCat = {
    id: 0,
    name: '',
    dataList: []
  }
}

defineExpose({
  getDataList
})
</script>

<style lang="scss" scoped>
.category-selection-component {
  margin-bottom: 15px;
  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .category-select-box {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    .category-select-item:not(:last-child) {
      margin-right: 10px;
    }
    .category-select-item {
      width: 240px;
      height: auto;
      box-sizing: border-box;
      border: 1px solid #DCDCDC;
      .int-box {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        .se-int {
          width: 100%;
          height: 30px;
          line-height: 30px;
          &::placeholder {
            font-size: 12px;
            color: #999;
            padding: 6px;
            box-sizing: border-box;
          }
        }
      }
      .category-list {
        // margin: 10px;
        height: 240px;
        overflow-y: auto;
        .category-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #333;
          padding: 8px;
          box-sizing: border-box;
          line-break: anywhere;
          cursor: pointer;
          & :deep(.el-icon-arrow-right) {
            color: #999;
          }
        }
        .category-empty-tips {
          font-size: 12px;
          color: #333;
          padding: 0 10px;
          margin-top: 45px;

          .btn{
            color: #155bd4;
            cursor:pointer
          }
        }
        .category-item:hover {
          background: rgba(245,248,255, .6);
          border-radius: 2px;
        }
        .category-item.active {
          background: #e8effa;
          border-radius: 2px;
        }
      }

      // 空
      .cate-empty {
        margin-top: 50px;
        color: #bbb;
        text-align: center;
        font-size: 12px;
        padding: 0 10px;
        box-sizing: border-box;
        line-height: 1.5em;
      }
    }
  }

  // 已选中
  .selected-results {
    margin-top: 10px;
    .sel-con {
      display: block;
      background: #f9f9f9;
      font-size: 12px;
      padding: 10px;
      margin-bottom: 20px;
      .cur-cate {
        color: #155BD4;
      }
    }
  }
}
</style>
