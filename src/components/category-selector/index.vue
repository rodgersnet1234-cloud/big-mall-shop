<template>
  <el-dialog
    v-model="visible"
    :title="$t('components.selector.categorySelector')"
    class="category-selector-component"
    :append-to-body="visible"
    width="1000px"
    @close="onClose"
  >
    <div class="prod-category clearfix">
      <div class="category">
        <!-- 分类 -->
        <div
          v-if="firstCategorys.dataList && firstCategorys.dataList.length"
          class="category-box"
        >
          <el-input
            v-model="firstCategorys.name"
            :placeholder="$t('components.selector.chooseProdCateg')"
            :disabled="true"
          />
          <ul class="category-list">
            <li
              v-for="(item,index) in firstCategorys.dataList"
              v-show="showFirstCat(item.categoryId)"
              :key="item.categoryId"
              class="category-item"
              :class="item.categoryId==firstCategorys.id?'active':''"
              @click="selectFirstCategorys(item.categoryId, index)"
            >
              <div>{{ item.name }}</div>
            </li>
          </ul>
        </div>
        <!-- 分类 -->
        <div
          v-if="secondCategorys.dataList && secondCategorys.dataList.length && firstCategorys.id !== 0"
          class="category-box"
        >
          <el-input
            v-model="secondCategorys.name"
            :placeholder="$t('components.selector.chooseProdCateg')"
            :disabled="true"
          />
          <ul class="category-list">
            <li
              v-for="(item,index) in secondCategorys.dataList"
              :key="item.categoryId"
              class="category-item"
              :class="isCreateCategory?'prohibit-sel':item.categoryId==secondCategorys.id?'active':''"
              @click="selectSecondCategorys(item.categoryId,index)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <!-- 分类 -->
        <div
          v-if="showthreeCategorys && threeCategorys.dataList && threeCategorys.dataList.length && secondCategorys.id !== 0"
          class="category-box"
        >
          <el-input
            v-model="threeCategorys.name"
            :placeholder="$t('components.selector.chooseProdCateg')"
            :disabled="true"
          />
          <ul class="category-list">
            <li
              v-for="(item,index) in threeCategorys.dataList"
              :key="item.categoryId"
              class="category-item"
              :class="[isCreateCategory?'prohibit-sel':item.categoryId==threeCategorys.id?'active':'']"
              @click="selectThreeCategorys(item.categoryId,index)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>

        <!-- 空 -->
        <div
          v-if="!allDataList.length && requestCompletion"
          class="loading"
        >
          <span>暂无分类，请先</span>
          <el-button
            v-if="!showthreeCategorys"
            type="primary"
            link
            class="tb"
            @click="onClose()"
          >
            <router-link
              target="_blank"
              :to="{
                path:'/product/manage/category',
                query:{
                  ...(domainTid ? {} : { tid})
                }
              }"
            >
              创建分类
            </router-link>
          </el-button>
          <el-button
            v-if="showthreeCategorys"
            type="primary"
            link
            class="tb"
            @click="onClose()"
          >
            <router-link
              target="_blank"
              :to="{
                path:'/shop/setting',
                query:{
                  activeName:3,
                  tid:tid
                }
              }"
            >
              签约分类
            </router-link>
          </el-button>
        </div>
        <!-- 加载中 -->
        <div
          v-if="!allDataList.length && !requestCompletion"
          class="loading"
        >
          加载中...
        </div>
      </div>
      <!-- 当前选择 -->
      <div class="current-selected">
        <span class="blod">{{ $t("components.selector.currCho") }}：</span>
        <span class="select-item">{{ firstCategorys.name }}</span>
        <span
          v-if="!isCreateCategory && secondCategorys.id"
          class="select-item"
        >&nbsp;>&nbsp;&nbsp;{{ secondCategorys.name }}</span>
        <span
          v-if="showthreeCategorys && threeCategorys.id"
          class="select-item"
        >&nbsp;>&nbsp;&nbsp;{{ threeCategorys.name }}</span>
      </div>
      <!-- 确认 -->
      <div class="read-rule">
        <div
          class="read-rule-txt"
          :class="buttonHighlight?'todo':'prohibit-sel'"
          @click="optionsConfirm"
        >
          {{ $t("components.selector.haveReadFol") }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
import * as api from '@/api/product/category'
import Cookies from 'vue-cookies'
import { getDomain } from '@/utils/index.js'

const props = defineProps({
  hasThreeCategory: {
    default: true,
    type: Boolean
  }
})

const emit = defineEmits(['getCategorySelected'])
const tid = Cookies.get('cloudTid')
const domainTid = Cookies.get(getDomain())
const Data = reactive({
  visible: false,
  // 是否已经请求完成
  requestCompletion: false,
  allDataList: [],
  // 第一个分类
  firstCategorys: {
    id: 0,
    name: '',
    dataList: []
  },
  // 第二个分类
  secondCategorys: {
    id: 0,
    name: '',
    dataList: []
  },
  // 第三个分类
  threeCategorys: {
    id: 0,
    name: '',
    dataList: []
  },
  parentId: 0,
  isCreateCategory: false, // 是否创建(店铺)分类选择
  showthreeCategorys: false, // 是否显示第三级分类(是否SaaS分类)
  buttonHighlight: false // 按钮高亮
})

const { visible, requestCompletion, allDataList, firstCategorys, secondCategorys, threeCategorys, isCreateCategory, showthreeCategorys, buttonHighlight } = toRefs(Data)

const showFirstCat = (categoryId) => {
  if (Data.categoryType === 'store' || Data.key !== 'platform') {
    return true
  }
  let flag = 0
  const dataList = Data.allDataList.filter(item => item.parentId === categoryId)
  dataList.forEach(i => {
    if (Data.allDataList.filter(item => item.parentId === i.categoryId).length) {
      flag++
    }
  })
  return flag
}
/**
 * 初始化
 */
const init = (type, key, selectedCategories) => {
  Data.key = key
  Data.visible = true
  // 回显分类选择
  if (selectedCategories.length > 0) {
    Data.firstCategorys = selectedCategories[0] || Data.firstCategorys
    Data.secondCategorys = selectedCategories[1] || Data.secondCategorys
    Data.threeCategorys = selectedCategories[2] || Data.threeCategorys
    Data.parentId = selectedCategories[2] ? selectedCategories[2].id : selectedCategories[1] ? selectedCategories[1].id : 0
  }
  if (key === 'platform') {
    getPlatformCatrgory(api.getMySigningCategoryList({ status: 1 }))
  } else {
    geShopCatrgory(props.hasThreeCategory ? api.enableCategories() : api.shopCategoryPage())
  }
  Data.isCreateCategory = !!(type && type === 1)
  settingButtonHighlight()
}

const getPlatformCatrgory = (request) => {
  request.then(data => {
    data = data.filter((item) => item.status === 1)
    Data.allDataList = data
    Data.firstCategorys.dataList = Data.allDataList.filter(item => item.level === 0)

    // 请求完成
    Data.requestCompletion = true
  })
  Data.showthreeCategorys = true // SaaS分类，最高三级
}

const geShopCatrgory = (request) => {
  request.then(data => {
    if (props.hasThreeCategory) {
      // 过滤没有2级分类以及二级分类全部禁用的一级分类
      data = data.filter(item => item.status && (item.level !== 0 || (item.level === 0 && data.some(el => el.status && el.parentId === item.categoryId))))
    }
    Data.allDataList = data
    Data.firstCategorys.dataList = Data.allDataList.filter(item => item.level === 0)
    Data.secondCategorys.dataList = Data.allDataList.filter(item => item.parentId === Data.firstCategorys.id && item.level === 1)
    // 请求完成
    Data.requestCompletion = true
  })
  Data.showthreeCategorys = false // 店铺分类，最高二级
}

// 按钮高亮(初始化)
const settingButtonHighlight = () => {
  if (Data.isCreateCategory && Data.firstCategorys.id) {
    Data.buttonHighlight = true
  } else if (!Data.isCreateCategory && Data.showthreeCategorys && Data.threeCategorys.id) {
    Data.buttonHighlight = true
  } else if (!Data.isCreateCategory && !Data.showthreeCategorys && Data.secondCategorys.id) {
    Data.buttonHighlight = true
  }
}

// 选中第一个分类
const selectFirstCategorys = (categoryId, index) => {
  Data.secondCategorys.dataList = Data.allDataList.filter(item => item.parentId === categoryId)
  Data.firstCategorys.name = index >= 0 ? Data.firstCategorys.dataList[index].name : Data.firstCategorys.name
  Data.parentId = Data.firstCategorys.id = categoryId
  Data.secondCategorys.id = 0
  if (Data.showthreeCategorys) Data.threeCategorys.id = 0
  Data.buttonHighlight = !!Data.isCreateCategory
}

// 选中第二个分类
const selectSecondCategorys = (categoryId, index) => {
  if (Data.isCreateCategory) {
    return
  }
  Data.threeCategorys.dataList = Data.allDataList.filter(item => item.parentId === categoryId)
  Data.secondCategorys.name = index >= 0 ? Data.secondCategorys.dataList[index].name : Data.secondCategorys.name
  Data.parentId = Data.secondCategorys.id = categoryId
  if (Data.showthreeCategorys) Data.threeCategorys.id = 0
  Data.buttonHighlight = !Data.isCreateCategory && !Data.showthreeCategorys
}

// 选中第三个分类
const selectThreeCategorys = (categoryId, index) => {
  if (Data.isCreateCategory) {
    return
  }
  Data.parentId = Data.threeCategorys.id = categoryId
  Data.threeCategorys.name = index >= 0 ? Data.threeCategorys.dataList[index].name : Data.threeCategorys.name
  Data.buttonHighlight = true
}

/**
 * 新增 / 修改
 */
const optionsConfirm = () => {
  // SaaS分类 & 没有第三级分类
  if (Data.showthreeCategorys && !Data.threeCategorys.id) {
    return
  }
  // 店铺分类 & 创建分类 & 没有选中第一级分类
  if (!Data.showthreeCategorys && Data.isCreateCategory && !Data.firstCategorys.id) {
    return
  }
  // 店铺分类 & 非创建分类 & 没有选中第二级分类
  if (!Data.showthreeCategorys && !Data.isCreateCategory && Data.secondCategorys.dataList.length > 0 && !Data.secondCategorys.id) {
    return
  }
  // 店铺分类 & 非创建分类 & 没有第二级分类
  if (!Data.showthreeCategorys && !Data.isCreateCategory && Data.secondCategorys.dataList.length === 0 && !Data.secondCategorys.id) {
    return
  }
  // Data.$store.commit('common/removeMainActiveTab')
  const selectedCategories = []
  if (Data.firstCategorys.id) {
    selectedCategories.push(Data.firstCategorys)
  }
  if (!Data.isCreateCategory && Data.secondCategorys.id) {
    selectedCategories.push(Data.secondCategorys)
  }
  if (Data.showthreeCategorys && !Data.isCreateCategory && Data.threeCategorys.id) {
    selectedCategories.push(Data.threeCategorys)
  }

  emit('getCategorySelected', selectedCategories, Data.parentId)
}

// 关闭
const onClose = () => {
  Data.allDataList = []
  // 第一个分类
  Data.firstCategorys = {
    id: 0,
    name: '',
    dataList: []
  }
  // 第二个分类
  Data.secondCategorys = {
    id: 0,
    name: '',
    dataList: []
  }
  // 第三个分类
  Data.threeCategorys = {
    id: 0,
    name: '',
    dataList: []
  }
  emit('getCategorySelected', null, null)
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.category-selector-component{
  .prod-category {
    .category {
      display: block;
      min-height: 338px;
      .loading {
        display: block;
        width: 100%;
        height: 338px;
        line-height: 338px;
        text-align: center;
        color: #999;
      }
      .category-box {
        box-sizing: border-box;
        width: 33%;
        display: inline-block;
        border: 1px solid #e4e4e4;
        padding: 20px;
        background: #fff;
        box-shadow: 0 5px 8px -4px #e2e2e2;
      }
    }
    .clearfix::after {
      display: block;
      content: "";
      visibility: hidden;
      height: 0;
      clear: both;
    }
    width: 90%;
    margin: 0 auto;
    ul,
    li {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .category-box {
      box-sizing: border-box;
      width: 32%;
      display: inline-block;
      border: 1px solid #e4e4e4;
      padding: 20px;
      background: #fff;
      box-shadow: 0 5px 8px -4px #e2e2e2;
    }

    .category-list {
      margin-top: 10px;
      height: 250px;
      margin-left: 10px;
      overflow-y: auto;
    }
    .category-item {
      display: -webkit-box;
      max-width: 100%;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-word;
      word-wrap: break-word;
      padding: 6px;
      box-sizing: border-box;
      cursor: pointer;

      div{
        -webkit-box-orient: vertical;
        display: -webkit-box;
        max-width: 100%;
        -webkit-line-clamp: 2;
        overflow: hidden;
        word-break: break-word;
        word-wrap: break-word;
        // padding: 6px;
        box-sizing: border-box;
        cursor: pointer;
      }
    }
    .category-item:hover,
    .category-item.active {
      // background: #e9f9ff;
      background: #f5f5f5;
      border-radius: 3px;
    }
    .current-selected {
      display: block;
      width: 100%;
      margin-top: 20px;
      border: 2px solid #fedbab;
      padding: 6px;
      background: #fffaf2;
      line-height: 1.5em;
      word-break: break-word;
      word-wrap: break-word;
      overflow: hidden;
    }
    .read-rule {
      width: 100%;
      margin-top: 20px;
    }
    .read-rule-txt {
      text-align: center;
      color: #fff;
      background: #999999;
      line-height: 3em;
      width: 50%;
      margin: 0 auto;
    }
    .blod {
      display: inline-block;
      font-weight: bold;
    }
    .todo {
      background: #155bd4;
      cursor: pointer;
    }
    .prohibit-sel {
      cursor: not-allowed;
    }
  }
}
</style>
