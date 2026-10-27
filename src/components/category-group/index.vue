<template>
  <div class="category-group-component">
    <div :class="['category','classify-show',!showCategorySelectBtn && single?'disable':null]">
      <div
        v-if="selectedCategories.length > 0 & single"
        :class="['category-sel1','classify']"
      >
        <span class="hint">{{ isPlatform?'SaaS分类：':'店铺分类：' }}</span>

        <!-- 商品详情/分类 -->
        <span v-if="selectedCategories[0]">{{ selectedCategories[0].name }}</span>
        <span v-if="selectedCategories[1]"><i class="right-arrow">&nbsp;>&nbsp;</i>{{ selectedCategories[1].name }}</span>
        <span v-if="selectedCategories[2]"><i class="right-arrow">&nbsp;>&nbsp;</i>{{ selectedCategories[2].name }}</span>
        <span
          v-if="isCreateCategory && showCategorySelectBtn"
          class="del-cate"
          @click="deleteCategoryItemOfSelected"
        >×</span>
      </div>
      <div
        v-if="showCategorySelectBtn && single"
        class="change-category change-classify"
        @click="selectOrReviseCategory"
      >
        {{ selectedCategories.length?'修改':'选择' }}
      </div>
      <!-- 品牌/属性 -->
      <div
        v-if="selectedCategories.length > 0 & multiple"
        class="category-sel2"
      >
        <p
          v-for="(item,index) in selectedCategories"
          :key="index"
        >
          <span v-if="item.firstCategoryName">{{ item.firstCategoryName }}</span>
          <span v-if="item.secondCategoryName"><i class="right-arrow">&nbsp;>&nbsp;</i>{{ item.secondCategoryName }}</span>
          <span v-if="item.threeCategoryName"><i class="right-arrow">&nbsp;>&nbsp;</i>{{ item.threeCategoryName }}</span>
          <span
            class="del-cate"
            @click="deleteCategoryItemOfSelected(index)"
          >×</span>
        </p>
      </div>
      <div
        v-if="multiple"
        class="change-category"
        @click="selectOrReviseCategory"
      >
        选择分类
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedCategories: {
    type: Array,
    default () {
      return []
    }
  },
  showCategorySelectBtn: {
    type: Boolean,
    default () {
      return true
    }
  },
  multiple: {
    type: Boolean,
    default () {
      return false
    }
  },
  single: {
    type: Boolean,
    default () {
      return false
    }
  },
  isCreateCategory: {
    type: Boolean,
    default () {
      return false
    }
  },
  isPlatform: {
    type: Boolean,
    default () {
      return true
    }
  }
})

const emit = defineEmits(['selectOrReviseCategory', 'deleteCategoryItemOfSelected'])

// 选择/修改分类
const selectOrReviseCategory = () => {
  emit('selectOrReviseCategory')
}

// 删除
const deleteCategoryItemOfSelected = (index) => {
  emit('deleteCategoryItemOfSelected', index)
}
</script>

<style lang="scss" scoped>
  .category-group-component {
     .disable{
        background-color: #f7f8fa;
        color: #c0c4cc;
      }
    .category {
      width: 510px;
      border: 1px solid #E8E9EC;
      padding: 0 10px;
      height: 32px;
      border-radius: 3px;
      display: flex;
      align-items: flex-start;
      font-size: 14px;
      line-height: 36px;
      min-height: 36px;

      .hint{
        color: #c0c4cc;
      }
      .category-sel1 {

        border-radius: 4px;
        width: 440px;
        display: flex;
        align-items: center;
        overflow: hidden;
        white-space: nowrap;
        word-break: break-word;
        text-overflow: ellipsis;
        word-wrap: break-word;
      }

      .category-sel2 {
        display: inline-block;
        max-width: 450px;
        p {
          display: inline-block;
          line-height: 1em;
          padding: 4px;
          border: 1px solid #ccc;
          margin-right: 5px;
        }
      }
      .del-cate {
        display: inline-block;
        text-align: center;
        font-size: 13px;
        width: 13px;
        height: 13px;
        line-height: 12px;
        border: 1px solid #bbb;
        border-radius: 50%;
        color: #bbb;
        margin-left: 6px;
      }
      .del-cate:hover {
        cursor: pointer;
        display: inline-block;
        border-color: #666;
        color: #666;
      }
      .change-category {
        color: #0071db;
        margin-left: 15px;
        // margin-left: 15px;
        cursor: pointer;
        // width: 50px;
      }
      .change-category:hover {
        color: #0258a8;
      }
    }
    i.right-arrow {
      padding: 0 8px;
    }
  }
</style>
