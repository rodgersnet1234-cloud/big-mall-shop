<template>
  <div class="component-contract-info">
    <!-- 签约信息 -->
    <div class="contract-info table-box">
      <!-- 签约类目 -->
      <div class="s-category-item s-item">
        <div class="apply-sign">
          <div class="table-data-title">
            <div class="text">
              <span class="stress">*</span>签约类目
            </div>
            <div class="tips">
              已签约
              <span class="txt-bold">{{ signCategoryList.length }}</span>
              个类目，最多可签约
              <span class="txt-bold">200</span>
              个类目
            </div>
          </div>
          <el-button
            type="primary"
            @click="cateAddOrUpdateHandle(0)"
          >
            新增签约类目
          </el-button>
        </div>
        <div class="si-content">
          <el-table
            :data="signCategoryList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
          >
            <el-table-column
              prop="name"
              label="类目"
              width="200"
              align="center"
            />
            <el-table-column
              prop="parentName"
              label="上级类目"
              width="200"
              align="center"
            />
            <el-table-column
              prop="platformRate"
              label="类目扣率"
              width="150"
              align="center"
            >
              <template #default="{ row }">
                <span v-if="row.customizeRate === null">{{ row.platformRate }} %</span>
                <span v-else>{{ row.customizeRate }} %</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="qualifications"
              label="经营资质"
              align="center"
            >
              <template #default="{row}">
                <div
                  v-if="row.imgs&&row.imgs.length"
                  class="img-box"
                >
                  <el-image
                    v-for="(img,index) in row.imgs"
                    :key="index"
                    class="rotating-img"
                    :src="checkFileUrl(img)"
                    :preview-teleported="true"
                    :preview-src-list="checkFileUrl(row.imgs)"
                    :initial-index="index"
                  >
                    <template #error>
                      <img
                        class="img-slot"
                        src="@/assets/images/def.png"
                        alt
                      >
                    </template>
                  </el-image>
                </div>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="categoryStatus"
              label="状态"
              width="80"
              align="center"
            >
              <template #default="scope">
                <div
                  v-if="scope.row.categoryStatus === 1"
                  class="tag-txt"
                >
                  正常
                </div>
                <div
                  v-if="scope.row.categoryStatus === 0"
                  class="tag-txt red-tag-txt"
                >
                  下架
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
              align="center"
            >
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  @click="categoryDelete(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 签约品牌 -->
      <div class="s-brand-item s-item">
        <div class="apply-sign">
          <div class="table-data-title">
            <div class="text">
              签约品牌
            </div>
            <div class="tips">
              已签约
              <span class="txt-bold">{{ signedBrands.length }}</span>
              个品牌，最多可签约
              <span class="txt-bold">50</span>
              个品牌
            </div>
          </div>
          <el-button
            type="primary"
            @click="cateAddOrUpdateHandle(1)"
          >
            新增签约品牌
          </el-button>
        </div>
        <div class="si-content">
          <el-table
            :data="signedBrands"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
          >
            <el-table-column
              prop="name"
              label="品牌名称"
              width="200"
              align="center"
            />
            <el-table-column
              prop="firstLetter"
              label="检索首字母"
              width="180"
              align="center"
            />
            <el-table-column
              prop="parentName"
              label="上级类目"
              width="180"
              align="center"
            />
            <el-table-column
              prop="platformRate"
              label="品牌logo"
              width="150"
              align="center"
            >
              <template #default="scope">
                <div class="img-box">
                  <el-image
                    v-if="scope.row.imgUrl"
                    class="rotating-img"
                    :preview-teleported="true"
                    :src="checkFileUrl(scope.row.imgUrl)"
                    :preview-src-list="[checkFileUrl(scope.row.imgUrl)]"
                  >
                    <template #error>
                      <img
                        class="img-slot"
                        src="@/assets/images/def.png"
                        alt
                      >
                    </template>
                  </el-image>
                  <span v-else>--</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="imgs"
              label="授权文件"
              align="center"
            >
              <template #default="{row}">
                <div
                  v-if="row.imgs.length"
                  class="img-box"
                >
                  <el-image
                    v-for="(img,index) in row.imgs"
                    :key="index"
                    class="rotating-img"
                    :src="checkFileUrl(img)"
                    :preview-teleported="true"
                    :preview-src-list="checkFileUrl(row.imgs)"
                    :initial-index="index"
                  >
                    <template #error>
                      <img
                        class="img-slot"
                        src="@/assets/images/def.png"
                        alt
                      >
                    </template>
                  </el-image>
                </div>
                <div v-if="!row.imgs.length">
                  --
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="brandStatus"
              label="状态"
              width="80"
              align="center"
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
              label="操作"
              width="100"
              align="center"
            >
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  @click="brandDelete(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 签约有效期 -->
      <div
        v-if="paySettlementType!==1"
        class="s-brand-item s-item"
      >
        <div class="table-data-title">
          <div class="text">
            <span class="stress">*</span>签约有效期
          </div>
          <div class="tips">
            商家店铺有效期
          </div>
        </div>
        <div class="si-content">
          <div class="contract-time-box">
            <el-date-picker
              v-model="shopBasicInfo.contractStartTime"
              style="width:170px;"
              type="date"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="开始日期"
              disabled
            />
            <span style="margin: 0 10px">-</span>
            <div class="end-time">
              <el-date-picker
                v-model="shopBasicInfo.contractEndTime"
                style="width:170px;"
                type="date"
                value-format="YYYY-MM-DD HH:mm:ss"
                :placeholder="shopBasicInfo.contractStartTime&& !shopBasicInfo.contractEndTime ? '' : '结束日期'"
                disabled
              />
              <span
                v-if="shopBasicInfo.contractStartTime&& !shopBasicInfo.contractEndTime"
                class="text disable"
              >
                无固定期限
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- 商家类型 -->
      <div class="s-brand-item s-item">
        <div class="table-data-title">
          <div class="text">
            <span class="stress">*</span>店铺类型
          </div>
        </div>
        <div class="si-content">
          <div>
            <el-radio
              v-model="shopBasicInfo.type"
              disabled
              label="1"
            >
              自营商家
            </el-radio>
            <el-radio
              v-model="shopBasicInfo.type"
              disabled
              label="2"
            >
              第三方商家
            </el-radio>
          </div>
        </div>
      </div>
    </div>
    <!-- /签约信息 -->
    <category-add-or-update
      v-if="cateAddOrUpdateVisible"
      ref="cateAddOrUpdateRef"
      :apply-for-sign="true"
      :sign-category-list="signCategoryList"
      @close-popup="closePopup"
    />
    <brand-add-or-update
      v-if="brandAddOrUpdateVisible"
      ref="brandAddOrUpdateRef"
      @close-popup="closePopup"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/multishop/shop-process.js'
import categoryAddOrUpdate from '@/views/common/shop-process/components/category-add-or-update/index.vue'
import BrandAddOrUpdate from '../brand-add-or-update/index.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { checkFileUrl } from '@/utils/index.js'

const shopBasicInfo = ref({})
// 店铺分类签约信息
const signCategoryList = ref([])
// 平台品牌签约信息
const signedBrands = ref([]) // 平台品牌+自定义品牌
// 自增签约品牌信息
const cateAddOrUpdateVisible = ref(false)
const brandAddOrUpdateVisible = ref(false)

const allinpayStore = useAllinpayStore()
const paySettlementType = allinpayStore.paySettlementType // 是否开启通联支付 1：开启 0：关闭
onMounted(() => {
  // 查询基本信息
  queryShopBasicInfo()
  // 查询分类签约信息
  getSignCategoryList()
  // 查询品牌签约信息
  getSignBrandList()
})

/**
 * 查询基本信息
 */
const queryShopBasicInfo = () => {
  api.getBasicInfo().then(data => {
    if (data.type) {
      data.type = data.type.toString()
    }
    Object.assign(shopBasicInfo.value, data)
  })
}
/**
 * 签约类目列表
 */
const getSignCategoryList = () => {
  api.getSignCategoryList().then((data) => {
    if (data) {
      signCategoryList.value = data
      signCategoryList.value.forEach(item => {
        item.imgs = item.qualifications ? item.qualifications.split(',') : []
      })
    }
  })
}

/**
 * 获取签约品牌列表
 */
const getSignBrandList = () => {
  api.getSignBrandList().then(data => {
    data.platformBrandList.forEach((item) => {
      let parentName = ''
      if (item.categories) {
        parentName = `${item.categories[0].categories[0].name}>${item.categories[0].categories[1].name}>${item.categories[0].name}`
      }
      item.parentName = parentName
    })
    signedBrands.value = data.platformBrandList
    signedBrands.value.forEach(el => {
      el.imgs = el.qualifications ? el.qualifications.split(',') : []
    })
  })
}

/**
 * 编辑签约信息弹窗
 * @param {Number} type 签约类型 0:类别 1:品牌
 */
const cateAddOrUpdateRef = ref(null)
const brandAddOrUpdateRef = ref(null)
const cateAddOrUpdateHandle = (type) => {
  if (type === 0) {
    cateAddOrUpdateVisible.value = true
    nextTick(() => {
      cateAddOrUpdateRef.value.init()
    })
  } else if (type === 1) {
    brandAddOrUpdateVisible.value = true
    nextTick(() => {
      brandAddOrUpdateRef.value.init('editor')
    })
  }
}

/**
 * 关闭弹窗
 */
const closePopup = (val) => {
  if (val === 'category') {
    cateAddOrUpdateVisible.value = false
    getSignCategoryList()
  } else if (val === 'brand') {
    brandAddOrUpdateVisible.value = false
    getSignBrandList()
  }
}

const categoryDelete = (row) => {
  const obj = {
    categoryShopId: row.categoryShopId
  }
  ElMessageBox.confirm('确定进行删除操作?', $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    api.deleteSigningCategory(obj).then(() => {
      ElMessage({
        message: '删除成功',
        type: 'success',
        duration: 1500,
        onClose: () => getSignCategoryList()
      })
    })
  })
}
const brandDelete = (row) => {
  const obj = {
    brandShopId: row.brandShopId
  }
  ElMessageBox.confirm('确定进行删除操作?', $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    api.deleteSigningBrand(obj).then(() => {
      ElMessage({
        message: '删除成功',
        type: 'success',
        duration: 1500,
        onClose: () => getSignBrandList()
      })
    }).catch(() => {
    })
  })
}
</script>

<style lang="scss" scoped>
@use "index";
</style>
