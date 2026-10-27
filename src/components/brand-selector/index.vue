<template>
  <el-dialog
    v-model="visible"
    title="选择品牌"
    top="50px"
    :close-on-click-modal="false"
    class="brand-select-component"
  >
    <el-form
      :inline="true"
      :model="dataForm"
      class="demo-form-inline"
      @submit.prevent
    >
      <el-form-item label="品牌名称">
        <el-input
          v-model.trim="pageQuery.brandName"
          placeholder="品牌名称"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="getBrandList"
        >
          查询
        </el-button>
      </el-form-item>
    </el-form>

    <div class="prods-select-body">
      <el-table
        ref="brandTable"
        v-loading="brandListLoading"
        :data="pageVO.list"
        border
        style="width: 100%;"
      >
        <el-table-column
          v-if="isSingle"
          width="50"
          header-align="center"
          align="center"
        >
          <template #default="{row}">
            <div>
              <el-radio
                v-model="singleSelectBrandId"
                :label="row.brandId"
                class="radio-box"
                @change="getSelectBrandRow(row)"
              >
                <span />
              </el-radio>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="brandName"
          header-align="center"
          align="center"
          label="品牌名称"
        >
          <template #default="{row}">
            <span
              v-for="(brandLang, index) of row.brandLangList"
              :key="index"
            >{{ brandLang.lang === language ? brandLang.name : '' }}</span>
            {{ row.name }}
          </template>
        </el-table-column>

        <el-table-column
          prop="firstChar"
          align="center"
          label="品牌首字母"
        >
          <template #default="{row}">
            {{ row.firstLetter }}
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          align="center"
          label="状态"
        >
          <template #default="{row}">
            <el-tag>
              {{ row.status===1?'正常':'下线' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          width="140"
          label="品牌图片"
        >
          <template #default="{row}">
            <div class="img-box">
              <ImgShow
                :src="row.imgUrl"
                :class-list="['brand-img']"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页条 -->
      <!-- <pagination v-show="pageVO.total>0" :total="pageVO.total" :page.sync="pageQuery.pageNum" :limit.sync="pageQuery.pageSize" @pagination="getBrandList()" /> -->
    </div>
    <template #footer>
      <span>
        <el-button @click="close">取消</el-button>
        <el-button
          type="primary"
          @click="submitBrand()"
        >提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { listAvailableByCategoryAndBrandName } from '@/api/product/brand'
import { ElMessage } from 'element-plus'

defineProps({
  isSingle: {
    default: false,
    type: Boolean
  }
})

const emit = defineEmits(['refreshSelectBrand'])

const Data = reactive({
  visible: false,
  brandName: null,
  selectedBrand: [],
  dataForm: {
    brand: ''
  },
  pageQuery: {
    // pageSize: 5,
    // pageNum: 1,
    categoryId: null,
    brandName: null
  },
  // 返回参数
  pageVO: {
    list: [], // 返回的列表
    total: 0, // 一共多少条数据
    pages: 0 // 一共多少页
  },
  brandListLoading: false,

  singleSelectBrandId: 0,
  brandListSelections: []
})

const { visible, brandListLoading, pageQuery, singleSelectBrandId, dataForm, pageVO } = toRefs(Data)

const appStore = useAppStore()

const language = computed(() => {
  return appStore.language === 'zh' ? 1 : 2
})

const init = (selectedBrand, categoryId) => {
  Data.visible = true
  Data.brandListLoading = true
  Data.pageQuery.categoryId = categoryId
  Data.pageQuery.brandName = ''
  Data.brandListSelections.push(selectedBrand)
  Data.singleSelectBrandId = selectedBrand ? selectedBrand.brandId : 0
  getBrandList()
}

const getBrandList = () => {
  listAvailableByCategoryAndBrandName({ ...Data.pageQuery, ...Data.brandName }).then(pageVO => {
    Data.pageVO.list = pageVO
    Data.brandListLoading = false
  })
}

// 单选
const getSelectBrandRow = (row) => {
  Data.brandListSelections = [row]
}

// 确定事件
const submitBrand = () => {
  const brands = []
  Data.brandListSelections.forEach(item => {
    const brandIndex = brands.findIndex((brand) => brand.brandId === item.brandId)
    if (brandIndex === -1 && item) {
      brands.push(item)
    }
  })
  // 如果有值（有选中选项）
  if (brands && brands[0]) {
    emit('refreshSelectBrand', brands[0])
    Data.visible = false
  } else {
    ElMessage({
      message: '请选择品牌',
      duration: 800
    })
  }
  Data.brandListSelections = []
}
/**
 * 关闭遮罩
 */
const close = () => {
  Data.visible = false
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.brand-select-component {
  .prods-select-body {
    height: 600px;
    overflow: auto;
  }
}
.radio-box {
  :deep(.el-radio__label) {
    display: none;
  }
}
:deep(.el-form-item) {
  margin-bottom: 20px;
}
:deep(.pagination-container) {
  margin-top: 0;
  text-align: right;
  padding: 15px 0;
}

:deep(.img-box) {
  width: 118px;
  height: 118px;
  display: flex;
  align-items: center;

  .brand-img {
    width: auto;
    max-width: 100%;
    height: auto !important;
  }
}
</style>
