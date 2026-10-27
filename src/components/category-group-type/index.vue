<template>
  <div class="component-category-group-type">
    <div class="category classify-show">
      <div
        v-if="selectedCategories.length > 0 & single"
        class="category-sel1 classify"
      >
        <!-- 商品详情/分类 -->
        <span
          v-if="selectedCategories[0]"
          style="flex: 1"
        >{{ selectedCategories[0].name }}</span>
        <span v-if="selectedCategories[1]"><i class="right-arrow">&nbsp;>&nbsp;</i>{{ selectedCategories[1].name }}</span>
        <span v-if="selectedCategories[2]"><i class="right-arrow">&nbsp;>&nbsp;</i>{{ selectedCategories[2].name }}</span>
        <el-icon
          v-if="isCreateCategory && showCategorySelectBtn"
          class="del-cate"
          @click="deleteCategoryItemOfSelected"
        >
          <CircleClose />
        </el-icon>
      </div>
      <div
        v-if="showCategorySelectBtn && single"
        class="change-category change-classify"
        @click="selectOrReviseCategory"
      >
        {{ selectedCategories.length?'修改':'选择' }}分类
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
          <el-icon
            class="del-cate"
            @click="deleteCategoryItemOfSelected(index)"
          >
            <CircleClose />
          </el-icon>
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

const emit = defineEmits(['selectOrReviseCategory', 'deleteCategoryItemOfSelected'])
defineProps({
  selectedCategories: {
    type: Array,
    default: () => {
      return []
    }
  },
  showCategorySelectBtn: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: false
  },
  single: {
    type: Boolean,
    default: false
  },
  isCreateCategory: {
    type: Boolean,
    default: false
  }
})

onMounted(() => {
  setTimeout(() => {}, 1000)
})

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
  p {
    margin: 0;
  }
  .component-category-group-type {
    .category {
      display: flex;
      align-items: flex-start;
      font-size: 13px;
      line-height: 36px;
      min-height: 36px;
      .category-sel1 {
        padding: 0 6px;
        border: 1px solid #ddd;
        border-radius: 4px;
        max-width: 700px;
        display: flex;
        align-items: center;
        overflow: hidden;
        word-break: break-word;
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
        font-size: 14px;
        color: #bbb;
        margin-left: 6px;
      }
      .del-cate:hover {
        cursor: pointer;
        display: inline-block;
        color: #666;
      }
      .change-category {
        color: #0071db;
        margin-left: 15px;
        // margin-left: 15px;
        cursor: pointer;
        width: 170px;
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
