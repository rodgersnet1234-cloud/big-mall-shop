<template>
  <el-dialog
    v-model="visible"
    class="component-category-add-or-update"
    :title="dataForm.categoryId ? $t('table.edit') : $t('table.create')"
    :close-on-click-modal="false"
    top="15vh"
    width="750px"
    @close="closeDialog"
  >
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="dataForm"
      label-position="right"
      label-width="100px"
      class="category-form"
      style="width: 500px; margin-left:20px;"
      @submit.prevent
    >
      <!-- 中文分类名称 -->
      <el-form-item
        label="分类名称"
        prop="nameZh"
      >
        <el-col :span="14">
          <el-input
            v-model.trim="dataForm.nameZh"
            :placeholder="$t('product.category.enterCateName')"
            maxlength="30"
            show-word-limit
          />
        </el-col>
      </el-form-item>
      <!-- 上级分类 -->
      <el-form-item
        v-if="(dataForm.level || (!dataForm.level && !dataForm.categoryId)) && !dataForm.icon"
        class="higher-category"
        :label="$t('product.category.categoryParent')"
        prop="parentId"
      >
        <category-group-type
          :selected-categories="selectedCategories"
          :show-category-select-btn="showCategorySelectBtn"
          :single="true"
          :is-create-category="true"
          @select-or-revise-category="selectOrReviseCategory"
          @delete-category-item-of-selected="deleteCategoryItemOfSelected"
        />
      </el-form-item>
      <!-- 分类图片 -->
      <el-form-item
        :label="$t('product.category.imgUrl')"
        prop="imgUrl"
      >
        <div>
          <img-upload
            v-model="dataForm.imgUrl"
            @update:model-value="onPropChage('imgUrl')"
          />
          <span>
            {{ $t('product.category.recommImgSize') }}{{ (dataForm.level || (!dataForm.level && !dataForm.categoryId))&& !dataForm.icon ? '75*75' : '255*100' }}
          </span>
        </div>
      </el-form-item>
      <!-- 排序 -->
      <el-form-item
        :label="$t('product.category.seq')"
        prop="seq"
      >
        <el-input-number
          v-model="dataForm.seq"
          :min="0"
          :max="1000000"
          controls-position="right"
          style="width: 120px"
          :precision="0"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </template>
    <category-selector
      v-if="categorySelectorVisible"
      ref="categorySelectorRef"
      :has-three-category="false"
      @get-category-selected="getCategorySelected"
    />
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/product/category'
import ImgUpload from '@/components/img-upload/index.vue'
import { Debounce } from '@/utils/debounce'
import { ElMessage } from 'element-plus'
import categorySelector from '@/components/category-selector/index.vue'
import categoryGroupType from '@/components/category-group-type/index.vue'

const emit = defineEmits(['show', 'refreshDataList'])
const visible = ref(false)
const dataForm = reactive({
  categoryId: 0,
  shopId: null,
  parentId: 0,
  nameZh: null,
  nameEn: null,
  desc: null,
  path: null,
  status: '1',
  icon: '',
  imgUrl: '',
  level: null,
  seq: 1
})
const showCategorySelectBtn = ref(true)
const categorySelectorVisible = ref(false)
const selectedCategories = ref([])
const rules = {
  nameZh: [
    { required: true, message: $t('product.category.categoryNoNull'), trigger: 'blur' }
  ],
  parentId: [
    { required: false, message: '选择上级分类', trigger: 'blur' }
  ],
  imgUrl: [
    { required: true, message: $t('product.category.imageNoNull'), trigger: 'blur' }
  ],
  icon: [
    { required: false, message: '图标不能为空', trigger: 'blur' }
  ]
}
const dataFormRef = ref(null)
const init = (categoryId, level) => {
  dataForm.level = level
  visible.value = true
  dataForm.categoryId = categoryId || 0
  nextTick(() => {
    dataFormRef.value.resetFields()
    if (!dataForm.categoryId) {
      return
    }
    if (categoryId) {
      dataForm.level = level
      api.get(categoryId).then(data => {
        dataForm.categoryId = data.categoryId
        dataForm.imgUrl = data.imgUrl
        dataForm.nameZh = data.nameZh
        dataForm.seq = data.seq
        dataForm.parentId = data.parentId || 0
        if (data.categories && data.categories.length > 0) {
          selectedCategories.value.push({ name: data.categories[0].name })
        }
        showCategorySelectBtn.value = false
        data.categoryLangList.forEach(item => {
          if (item.lang === 1) {
            dataForm.nameZh = item.name
          } else if (item.lang === 2) {
            dataForm.nameEn = item.name
          }
        })
      })
    }
  })
}
const close = (flg) => {
  emit('show', flg)
}

const categorySelectorRef = ref(null)
/**
 * 选择分类弹窗
 */
const selectOrReviseCategory = () => {
  // 防止改变原数组导致返回数据出错
  const newSelectedCategories = JSON.parse(JSON.stringify(selectedCategories.value))
  categorySelectorVisible.value = true
  nextTick(() => {
    categorySelectorRef.value.init(1, 'shop', newSelectedCategories) // 1-代表从创建分类进入
  })
}

/**
 * 获取子组件返回数据
 */
const getCategorySelected = (selectedCategoryList, parentId) => {
  categorySelectorVisible.value = false
  if (selectedCategoryList === null && parentId === null) {
    return
  }
  selectedCategories.value = selectedCategoryList
  dataForm.parentId = parentId
}

// 删除选中的某一项分类
const deleteCategoryItemOfSelected = () => {
  selectedCategories.value.splice(0, selectedCategories.value.length)
  dataForm.parentId = 0
}

const loadLang = () => {
  dataForm.categoryLangList = []
  dataForm.categoryLangList.push({ lang: 1, name: dataForm.nameZh })
  dataForm.categoryLangList.push({ lang: 2, name: dataForm.nameEn })
}
// 表单提交
const onSubmit = Debounce(function () {
  dataFormRef.value.validate(valid => {
    if (!valid) {
      return
    }
    loadLang()
    // 层级 0第一级
    dataForm.level = !selectedCategories.value.length ? 0 : selectedCategories.value.length
    const request = dataForm.categoryId ? api.update(dataForm) : api.save(dataForm)
    request.then(() => {
      emit('refreshDataList')

      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          dataFormRef.value?.resetFields()
          close(false)
        }
      })
    }).catch(() => {

    })
  })
}, 1500)

// 关闭dialog时
const closeDialog = () => {
  selectedCategories.value = []
  showCategorySelectBtn.value = true
}
/**
 * 触发表单校验
 * @param prop 校验项
 */
const onPropChage = (prop) => {
  dataFormRef.value?.validateField(prop)
}
defineExpose({ init })
</script>

<style lang="scss" scoped>
.component-category-add-or-update {
  .category-form {
    :deep(.el-dialog__wrapper) {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :deep(.el-form-item__label) {
      text-align: right;
    }

  }
}
</style>
