<template>
  <el-dialog
    v-model="visible"
    :append-to-body="true"
    :show-close="false"
    :close-on-click-modal="false"
    class="component-brand-add-or-update"
    :[$options.__scopeId]="''"
    width="80%"
    top="8vh"
  >
    <div>
      <div class="popup">
        <div class="title">
          <div class="text">
            新增签约品牌
          </div>
          <div class="tips">
            已签约<span class="txt-bold">{{ signBrandLength + signBrandList.length + dataForm.customSignBrandList.length }}</span>个品牌，最多可签约<span class="txt-bold">50</span>个品牌
          </div>
          <div
            class="close-btn"
            @click="closePopup"
          >
            <el-icon>
              <Close />
            </el-icon>
          </div>
        </div>
        <div class="content">
          <div class="left-box">
            <div class="search-box">
              <input
                v-model="keyword"
                class="search-input"
                placeholder="请输入品牌名称"
                @keyup.enter="searchBrand"
              >
              <div
                class="search-btn"
                @click="searchBrand"
              >
                <el-icon><Search /></el-icon>
              </div>
            </div>
            <div class="brand-box">
              <div class="brand-list">
                <div
                  v-for="(item, index) in allBrandList"
                  :key="index"
                  class="brand-item"
                  :class="{'active':item.isSelected===true}"
                  @click="addBrand(item, index)"
                >
                  {{ item.name }}
                </div>
              </div>
              <div
                v-if="!allBrandList.length"
                class="empty-result"
              >
                暂无数据
              </div>
            </div>
          </div>
          <div class="right-box">
            <div
              class="table-box"
              :class="{'big-tb': !showCustomization}"
            >
              <!-- height="482" -->
              <el-table
                :data="signBrandList"
                :header-cell-style="{height:'50px',background:'#F5F5F5',color:'#000','font-weight': '400'}"
              >
                <el-table-column
                  prop="name"
                  label="品牌名称"
                />
                <el-table-column
                  prop="firstLetter"
                  label="品牌首字母"
                  align="center"
                />
                <el-table-column
                  prop="parentName"
                  label="上级类目"
                  align="center"
                />
                <el-table-column
                  prop="imgUrl"
                  label="品牌logo"
                >
                  <template #default="scope">
                    <img-show
                      :src="scope.row.imgUrl"
                      :img-style="{width:'57px',height:'57px'}"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="qualifications"
                  label="授权文件"
                  width="230"
                >
                  <template #default="scope">
                    <div class="business-qual">
                      <imgs-upload
                        v-model:model-value="scope.row.qualifications"
                        :limit="2"
                      />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="brandStatus"
                  label="状态"
                  width="80"
                >
                  <template #default="scope">
                    <div
                      v-if="scope.row.brandStatus === 1"
                      class="tag-txt"
                    >
                      正常
                    </div>
                    <div
                      v-if="scope.row.brandStatus === 0"
                      class="tag-txt red-tag-txt"
                    >
                      下架
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="操作"
                  width="80"
                >
                  <template #default="scope">
                    <el-button
                      type="primary"
                      link
                      @click="deleteBrand(scope.row.brandId, scope.$index)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div
              v-if="showCustomization"
              class="custom-box"
            >
              <div class="text">
                自定义品牌
              </div>
              <div
                class="add-btn"
                @click="addCustomBrand"
              >
                添加自定义品牌
              </div>
            </div>
            <!-- 添加自定义品牌 -->
            <div
              v-if="dataForm.customSignBrandList.length && showCustomization"
              class="table-box"
            >
              <!-- native modifier has been removed, please confirm whether the function has been affected  -->
              <el-form
                ref="brandsInfoFormRef"
                :model="dataForm"
                :rules="dataForm.customSignBrandRule"
                @submit.prevent
              >
                <!-- height="265" -->
                <el-table
                  class="add-bank-info-table"
                  :data="dataForm.customSignBrandList"
                  :header-cell-style="{height:'50px',background:'#F5F5F5',color:'#000','font-weight': '400'}"
                >
                  <el-table-column
                    label="品牌名称"
                    prop="name"
                  >
                    <template #default="scope">
                      <el-form-item
                        :prop="'customSignBrandList.' + scope.$index + '.name'"
                        :rules="dataForm.customSignBrandRule.name"
                      >
                        <el-input
                          v-model="scope.row.name"
                          placeholder="品牌名称"
                          maxlength="50"
                          style="width:100%"
                          @blur="verifyBrandName(scope.row.name, scope.$index)"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="firstLetter"
                    label="品牌首字母"
                  >
                    <template #default="scope">
                      <el-form-item
                        :prop="'customSignBrandList.' + scope.$index + '.firstLetter'"
                        :rules="dataForm.customSignBrandRule.firstLetter"
                      >
                        <el-input
                          v-model="scope.row.firstLetter"
                          maxlength="1"
                          placeholder="品牌首字母"
                          style="width:100%"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="上级类目"
                    prop="category"
                    required
                  >
                    <template #default="scope">
                      <el-select
                        v-model="scope.row.categoryId"
                        placeholder="请选择分类"
                      >
                        <el-option
                          v-for="item in parentBrandList"
                          :key="item.categoryId"
                          :label="item.parentName"
                          :value="item.categoryId"
                        />
                      </el-select>
                      <div
                        v-if="scope.row.categoryId === null"
                        class="category-error"
                      >
                        品牌分类不能为空
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="imgUrl"
                    label="品牌logo"
                  >
                    <template #default="scope">
                      <el-form-item
                        :rules="dataForm.customSignBrandRule.logo"
                        :prop="'customSignBrandList.' + scope.$index + '.imgUrl'"
                      >
                        <div class="business-qual">
                          <img-upload
                            v-model="scope.row.imgUrl"
                            @input="imgChange(scope.row.imgUrl)"
                          />
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="qualifications"
                    label="授权文件"
                    width="230"
                  >
                    <template #default="scope">
                      <el-form-item
                        :prop="'customSignBrandList.' + scope.$index + '.qualifications'"
                        :rules="dataForm.customSignBrandRule.qualifications"
                      >
                        <div class="business-qual">
                          <imgs-upload
                            v-model:model-value="scope.row.qualifications"
                            :limit="2"
                          />
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="操作"
                    width="70"
                  >
                    <template #default="scope">
                      <el-button
                        type="primary"
                        link
                        @click="deleteCustomBrandItem(scope.$index)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </div>
          </div>
        </div>
        <div class="btn-box">
          <div
            class="cancel-btn"
            @click="closePopup"
          >
            取消
          </div>
          <div
            class="confirm-btn"
            @click="comfirmSubmit"
          >
            确定
          </div>
        </div>
      </div>
      <div class="shelter-layer" />
    </div>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/multishop/shop-process.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
  // 签约分类列表
  parentBrandList: {
    type: Array,
    default () {
      return []
    }
  },
  brandNameList: {
    type: Array,
    default () {
      return []
    }
  }
})
const emit = defineEmits(['closePopup'])

const visible = ref(false)
// 图片前缀
const keyword = ref('')
const allBrandList = ref([])
const signBrandList = ref([])
const validateFirstLetter = (rule, value, callback) => {
  const regexp = /^[A-Z]{1}$/
  if (!regexp.test(value)) {
    callback(new Error($t('multishop.shopProcess.oneCapitalLetter')))
  } else {
    callback()
  }
}
const dataForm = reactive({
  customSignBrandList: [],
  customSignBrandRule: {
    name: [
      { required: true, message: '品牌名称不能为空', trigger: 'blur' },
      { min: 1, max: 50, message: '品牌名称长度在1-50个字符之间', trigger: 'blur' }
    ],
    category: [
      { required: true, message: '品牌分类不能为空', trigger: ['blur', 'change'] }
    ],
    firstLetter: [
      { required: true, message: '品牌首字母不能为空', trigger: 'blur' },
      { validator: validateFirstLetter, trigger: 'blur' }
    ],
    logo: [
      { required: true, message: '请上传品牌logo', trigger: ['blur', 'change'] }
    ],
    qualifications: [
      { required: true, message: '请上传品牌授权文件', trigger: ['blur', 'change'] }
    ]
  }
})

// 是否显示自定义品牌
const showCustomization = ref(true)
// eslint-disable-next-line vue/no-setup-props-destructure
let brandNameInputList = props.brandNameList
const signBrandLength = ref(0)

watch(props.brandNameList, (val) => {
  brandNameInputList = val
})

// 初始化
const init = (pageType) => {
  visible.value = true
  if (pageType === 'editor') {
    showCustomization.value = false
  }
  getPlatformBrand()
  getSignBrandList()
}

/**
 * 图片的值发生改变，重新校验对应表单字段
 * @param {String} value 改变的值
 */
const brandsInfoFormRef = ref(null)
const imgChange = (value) => {
  if (value) {
    brandsInfoFormRef.value.validate()
  }
}

/**
 * 获取平台全部品牌
 */
const getPlatformBrand = () => {
  api.getApplySigningBrand(keyword.value).then(data => {
    const _signBrandList = signBrandList.value
    if (showCustomization.value) {
      data.forEach(item => {
        brandNameInputList.push(item.name)
      })
      brandNameInputList = [...new Set(brandNameInputList)]
    }
    brandEcho(data, _signBrandList)
  })
}

// 校验品牌名称是否重复
const verifyBrandName = (value, index) => {
  if (brandNameInputList.indexOf(value) >= 0) {
    const data = dataForm.customSignBrandList[index]
    data.name = ''
    dataForm.customSignBrandList[index] = data
    ElMessage({
      message: '品牌名称重复',
      type: 'error',
      duration: 1000
    })
  }
}

/**
 * 左侧回显选中品牌或已签约品牌
 * @param _allBrandList
 * @param {Array} signBrandListPar 选中品牌和已签约品牌
 */
const brandEcho = (_allBrandList, signBrandListPar) => {
  _allBrandList.forEach(item => {
    item.isSelected = false
  })
  if (signBrandListPar.length > 0 && _allBrandList.length > 0) {
    for (let i = 0; i < signBrandListPar.length; i++) {
      for (let j = 0; j < _allBrandList.length; j++) {
        if (signBrandListPar[i].brandId === _allBrandList[j].brandId) {
          _allBrandList[j].isSelected = true
          break
        }
      }
    }
  }
  allBrandList.value = _allBrandList
}

/**
 * 获取签约品牌列表
 */
const getSignBrandList = () => {
  api.getSignBrandList().then(data => {
    signBrandLength.value = data.platformBrandList.length
  })
}

/**
 * 搜索品牌
 */
const searchBrand = () => {
  getPlatformBrand()
}

/**
 * 选中添加品牌
 */
const addBrand = (brandObj, index) => {
  brandObj.brandStatus = brandObj.status
  const length = signBrandLength.value + signBrandList.value.length + dataForm.customSignBrandList.length
  if (length >= 50) {
    ElMessage.warning('您最多只能签约50个品牌')
  } else {
    if (brandObj.isSelected === false) {
      if (brandObj.categories) {
        brandObj.parentName = `${brandObj.categories[0].categories[0].name}>${brandObj.categories[0].categories[1].name}>${brandObj.categories[0].name}`
      }
      signBrandList.value.push(brandObj)
    }
    allBrandList.value[index].isSelected = true
  }
}

/**
 * 添加自定义品牌
 */
const addCustomBrand = () => {
  const length = signBrandLength.value + signBrandList.value.length + dataForm.customSignBrandList.length
  if (length >= 50) {
    ElMessage.warning('您最多只能签约50个品牌')
    return
  }
  dataForm.customSignBrandList.push(
    {
      name: '',
      categoryId: '',
      imgUrl: '',
      qualifications: ''
    }
  )
}

/**
 * 删除自定义品牌项
 */
const deleteCustomBrandItem = (index) => {
  dataForm.customSignBrandList.splice(index, 1)
}

/**
 * 删除选中品牌
 * @param {Number} id 品牌id
 * @param {Number} index 选中品牌列表索引
 */
const deleteBrand = (id, index) => {
  // 去除选中样式
  allBrandList.value.forEach(brandItem => {
    if (brandItem.brandId === id) {
      brandItem.isSelected = false
    }
  })
  signBrandList.value.splice(index, 1)
}

/**
 * 签约品牌
 */
const signBrand = () => {
  const params = {
    platformBrandList: [],
    customizeBrandList: []
  }
  signBrandList.value.forEach(item => {
    const param = {
      brandId: item.brandId,
      name: item.name,
      imgUrl: item.imgUrl,
      qualifications: item.qualifications
    }
    params.platformBrandList.push(param)
  })
  params.customizeBrandList = dataForm.customSignBrandList
  api.addSigningBrand(params).then(() => {
    ElMessage({
      message: '品牌新增成功！',
      type: 'success',
      duration: 1000
    })
    closePopup()
  })
}

/**
 * 确认提交
 */
const comfirmSubmit = () => {
  let pass = true
  if (dataForm.customSignBrandList.length) {
    brandsInfoFormRef.value?.validate((valid) => {
      if (dataForm.customSignBrandList && dataForm.customSignBrandList.find(el => !el.categoryId)) {
        dataForm.customSignBrandList.forEach(item => {
          if (item.categoryId === '') {
            item.categoryId = null
          }
        })
        pass = false
        return
      }
      if (!valid) {
        pass = false
        return
      }
      if (dataForm.customSignBrandList && dataForm.customSignBrandList.find(el => !el.name || !el.name.trim())) {
        ElMessage.error('品牌名称不能为空')
        pass = false
        return
      }
      if (dataForm.customSignBrandList && dataForm.customSignBrandList.find(el => !el.imgUrl)) {
        ElMessage.error('品牌logo不能为空')
        pass = false
        return
      }
      if (dataForm.customSignBrandList && dataForm.customSignBrandList.find(el => !el.firstLetter)) {
        ElMessage.error('品牌首字母不能为空')
        pass = false
        return
      }
      if (dataForm.customSignBrandList && dataForm.customSignBrandList.find(el => !el.qualifications)) {
        ElMessage.error('品牌授权文件不能为空')
        pass = false
      }
    })
  }
  if (signBrandList.value.find(el => !el.qualifications)) {
    ElMessage.error('品牌授权文件不能为空')
    return
  }
  if (pass) {
    signBrand()
  }
}

/**
 * 关闭弹窗
 */
const closePopup = () => {
  emit('closePopup', 'brand')
}

defineExpose({
  init
})

</script>

<style lang="scss" scoped>
@use "index";
</style>
