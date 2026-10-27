<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="page-attr-manage">
    <el-dialog
      v-model="visible"
      :title="dataForm.attrId ? $t('table.edit'): $t('table.create')"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      top="15vh"
      @close="closeDialog"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        label-position="right"
        label-width="110px"
        style="margin-left:35px;"
        @submit.prevent
      >
        <!-- 规格名称 -->
        <el-form-item
          :label="$t('product.attr.name')"
          class="attr-form-item"
        >
          <el-table
            :data="dataList"
            border
            style="width: 450px;"
            :show-header="false"
          >
            <el-table-column
              prop="propName"
              header-align="center"
              align="center"
            >
              <template #default>
                <el-input
                  v-model="dataForm.nameZh"
                  :placeholder="$t('product.attr.name')"
                  maxlength="10"
                  show-word-limit
                  clearable
                  @blur="dataForm.nameZh = specInputLimit(dataForm.nameZh)"
                />
              </template>
            </el-table-column>
          </el-table>
          <p class="form-item-tips">
            规格名称长度不超过10个字
          </p>
        </el-form-item>
        <!-- 规格值 -->
        <el-form-item
          :label="$t('product.attr.attrValue')"
          class="attr-form-item"
          prop="attrValues"
        >
          <el-button
            type="primary"
            @click="addAttrValue()"
          >
            {{ $t('table.add') }}
          </el-button>
          <p class="form-item-tips">
            规格值不超过20个字
          </p>
        </el-form-item>
        <!-- 当前规格列表 -->
        <el-form-item class="attr-form-item">
          <el-table
            :data="dataForm.attrValues"
            max-height="225px"
            style="width: 450px;"
            :show-header="false"
            :border="false"
          >
            <el-table-column
              prop="valueZh"
              align="left"
              min-width="40%"
            >
              <template #default="scope">
                <el-input
                  v-model.trim="dataForm.attrValues[scope.$index].valueZh"
                  maxlength="20"
                  clearable
                  :placeholder="$t('product.specificationValue')"
                  @blur="checkIntValue(scope.$index, 1)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="change"
              align="left"
              min-width="20%"
            >
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  @click="deleteAttr(scope.$index)"
                >
                  {{ $t('table.delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          plain
          @click="visible = false"
        >
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="dataFormSubmit"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import * as api from '@/api/product/attr.js'

const visible = ref(false)

const emit = defineEmits(['refreshDataList'])

const dataForm = reactive({
  attrId: '',
  attrType: 0, // 属性类型 0:销售属性，1:基本属性
  attrValues: [], // 属性值列表
  categoryIds: [], // 分类id列表
  desc: '', // 属性描述
  attrLangList: [], // 属性多语言列表
  nameZh: '', // 中文属性名称
  nameEn: '', // 英文属性名称
  searchType: 1 // 作为搜索参数 0:不需要，1:需要
})

const value1 = ref(['Cn'])

const dataList = ref([{ propId: 0, propName: '', propNameEn: '', prodPropValues: [{ valueId: 0 }] }])
const dataFormRef = ref(null)
const init = (attrId) => {
  value1.value = ['Cn']
  visible.value = true
  nextTick(() => {
    if (!attrId) {
      dataForm.attrLangList = [{ name: null, desc: null, lang: 1 }, { name: null, desc: null, lang: 2 }]
      dataForm.attrValues = [{
        valueZh: '',
        valueEn: ''
      }]
      return
    }
    api.get(attrId).then(data => {
      loadData(data)
    })
  })
}

/**
 * 输入特殊字符处理
 */
const specInputLimit = (value) => {
  const reg = /[\\;\\:\\；\\：]/g
  if (reg.test(value)) {
    ElMessage.error('请勿输入特殊字符:;')
    return ''
  }
  return value
}

/**
 * 处理回显的数据
 */
const loadData = (data) => {
  dataForm.attrId = data.attrId
  dataForm.attrType = data.attrType
  dataForm.attrValues = data.attrValues
  dataForm.categoryIds = data.categoryIds
  dataForm.desc = data.desc
  dataForm.attrLangList = data.attrLangList
  dataForm.nameZh = ''
  dataForm.nameEn = ''
  dataForm.searchType = data.searchType
  data.attrLangList.forEach(attrLang => {
    if (attrLang.lang === 1) {
      dataForm.nameZh = attrLang.name
    }
    if (attrLang.lang === 2) {
      dataForm.nameEn = attrLang.name
      value1.value.push('En')
    }
  })
  const attrValues = []
  data.attrValues.forEach(attrValue => {
    const newAttrValue = { attrValueId: attrValue.attrValueId, valueZh: null, valueEn: null }
    attrValue.values.forEach(value => {
      if (value.lang === 1) {
        newAttrValue.valueZh = value.value
      } else {
        newAttrValue.valueEn = value.value
      }
    })
    attrValues.push(newAttrValue)
  })
  dataForm.attrValues = attrValues
}

// 关闭dialog时
const closeDialog = () => {
  dataForm.attrId = ''
  dataForm.attrType = 0 // 属性类型 0:销售属性，1:基本属性
  dataForm.attrValues = [] // 属性值列表
  dataForm.categoryIds = [] // 分类id列表
  dataForm.desc = '' // 属性描述
  dataForm.attrLangList = [] // 属性多语言列表
  dataForm.nameZh = '' // 中文属性名称
  dataForm.nameEn = '' // 英文属性名称
  dataForm.searchType = 1 // 作为搜索参数 0:不需要，1:需要
}

let ifBlur = false
/**
 * 添加属性值
 */
const addAttrValue = () => {
  if (dataForm.attrValues.length === 0 || dataForm.attrValues[0].valueZh) {
    dataForm.attrValues.unshift({ attrValueId: null, attrId: null, valueZh: '', valueEn: '' })
  } else {
    if (!ifBlur) {
      ElMessage.error($t('product.attr.specEmpty'))
    }
  }
}

/**
 * 删除属性值
 */
const deleteAttr = (idx) => {
  if (dataForm.attrValues.length <= 1) {
    ElMessage.error('至少设置一个规格值')
    return
  }
  dataForm.attrValues.splice(idx, 1)
}

/**
 * 属性值输入框失焦时判断
 * idx：值发生变化的列索引
 * type: 1:中文 2：英文
 */
const checkIntValue = (idx, type) => {
  const attrValue = dataForm.attrValues[idx]
  const value = type === 1 ? attrValue.valueZh : attrValue.valueEn
  const regVal = /[\\;\\；]/g
  if (regVal.test(attrValue.valueZh)) {
    ElMessage.error('请勿输入特殊字符;')
    attrValue.valueZh = ''
  }
  if (regVal.test(attrValue.valueEn)) {
    ElMessage.error('请勿输入特殊字符;')
    attrValue.valueEn = ''
  }
  ifBlur = dataForm.attrValues.some((el, index) => {
    // 输入值已存在
    if (idx !== index) {
      if (type === 1 && (value && el.valueZh) && value === el.valueZh) {
        ElMessage({
          message: '规格值已存在, 请重新输入',
          type: 'error',
          duration: 1000
        })
        attrValue.valueZh = ''
        return true
      }
      if (type === 2 && (value && el.valueEn) && value === el.valueEn) {
        ElMessage({
          message: '规格值已存在, 请重新输入',
          type: 'error',
          duration: 1000
        })
        attrValue.valueEn = ''
        return true
      }
    }
    return false
  })
  setTimeout(() => {
    ifBlur = false
  }, 300)
}

/**
 * 处理上传数据
 */
const loadAttrAndValueName = () => {
  dataForm.attrLangList.splice(0, dataForm.attrLangList.length)
  if (dataForm.nameZh) {
    dataForm.attrLangList.push({ name: dataForm.nameZh, lang: 1 })
  }
  if (dataForm.nameEn) {
    dataForm.attrLangList.push({ name: dataForm.nameEn, lang: 2 })
  }
  dataForm.attrValues.forEach(attrValue => {
    attrValue.values = []
    if (attrValue.valueZh) {
      attrValue.values.push({ value: attrValue.valueZh, lang: 1 })
    }
    if (attrValue.valueEn) {
      attrValue.values.push({ value: attrValue.valueEn, lang: 2 })
    }
  })
}

/**
 * 表单提交
 */
const dataFormSubmit = Debounce(() => {
  if (ifBlur) {
    return
  }
  if (!dataForm.attrValues.length) {
    ElMessage({
      message: $t('product.attr.leastOnesku'),
      type: 'error',
      duration: 1500
    })
    return
  }
  if (dataForm.nameZh === '') {
    ElMessage({
      message: $t('product.attr.nameTips'),
      type: 'error',
      duration: 1500
    })
    return
  }

  if (dataForm.attrValues.find(el => !el.valueZh)) {
    ElMessage({
      message: '规格值不能为空',
      type: 'error',
      duration: 1500
    })
    return
  }

  if (dataForm.nameZh.indexOf(';') !== -1) {
    dataForm.nameZh = ''
    ElMessage({
      message: $t('product.attr.noEnterSpecial'),
      type: 'error',
      duration: 1500
    })
    return
  }
  if (dataForm.nameEn && dataForm.nameEn.indexOf(';') !== -1) {
    dataForm.nameEn = ''
    ElMessage({
      message: $t('product.attr.noEnterSpecial'),
      type: 'error',
      duration: 1500
    })
    return
  }
  if (dataForm.attrValues.some(item => (item.valueEn && item.valueEn.indexOf(';') !== -1) || (item.valueZh && item.valueZh.indexOf(';') !== -1))) {
    ElMessage({
      message: $t('product.attr.noEnterSpecial'),
      type: 'error',
      duration: 1500
    })
    return
  }
  loadAttrAndValueName()
  const request = dataForm.attrId ? api.update(dataForm) : api.save(dataForm)
  request.then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
        visible.value = false
        emit('refreshDataList')
        closeDialog()
      }
    })
  })
}, 1500)

defineExpose({ init })
</script>

<style lang="scss" scoped>
.page-attr-manage {
  .attr-form-item {
    margin-bottom: 0;

    :deep(.el-form-item__content) {
      align-items: flex-start;
      flex-direction: column;
    }

    .form-item-tips {
      font-size: 12px;
      color: #999999;
      line-height: 20px;
    }
  }

}
</style>
