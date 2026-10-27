<template>
  <div class="component-add-or-update">
    <el-dialog
      v-model="visible"
      :title="dataForm.imgId? $t('table.edit'): $t('table.create')"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      top="12vh"
      width="750px"
      @close="closeDialog"
    >
      <el-form
        ref="dataFormRef"
        :rules="rules"
        :model="dataForm"
        label-position="right"
        label-width="90px"
        style="min-width: 600px; width: 600px; margin-left:35px;"
        @submit.prevent
      >
        <!-- 图片 -->
        <el-form-item
          label="轮播图片"
          prop="imgUrl"
        >
          <img-upload
            v-model="dataForm.imgUrl"
            @update:model-value="onPropChage('imgUrl')"
          />
          <div class="img-remark">
            <span v-if="dataForm.imgType === 0">建议图片尺寸为710*780</span>
            <span v-if="dataForm.imgType === 1">建议图片尺寸为 1920*450</span>
          </div>
        </el-form-item>
        <!-- 平台 -->
        <el-form-item
          label="展示用户端"
          prop="imgType"
        >
          <el-radio
            v-model="dataForm.imgType"
            :label="0"
          >
            移动端
          </el-radio>
          <el-radio
            v-model="dataForm.imgType"
            :label="1"
          >
            PC端
          </el-radio>
        </el-form-item>
        <!-- 状态 -->
        <el-form-item
          label="轮播图状态"
          prop="status"
        >
          <el-radio
            v-model="dataForm.status"
            :label="0"
          >
            禁用
          </el-radio>
          <el-radio
            v-model="dataForm.status"
            :label="1"
          >
            正常
          </el-radio>
        </el-form-item>
        <!-- 排序 -->
        <el-form-item
          label="轮播图排序"
          prop="seq"
        >
          <el-input-number
            v-model="dataForm.seq"
            :min="0"
            :max="10000000"
            style="width: 120px"
            controls-position="right"
            :precision="0"
          />
        </el-form-item>
        <!-- 类型 -->
        <el-form-item
          class="type-box"
          label="轮播图类型"
          prop=""
        >
          <el-radio
            v-model="relatedSpu"
            :label="0"
          >
            无
          </el-radio>
          <el-radio
            v-model="relatedSpu"
            :label="1"
          >
            商品
          </el-radio>
          <div v-if="relatedSpu === 1 && dataForm.spu && dataForm.spu.spuId">
            <el-card
              :body-style="{ padding: '0px' }"
              style="height: 160px;width: 120px"
            >
              <img-show
                :src="dataForm.spu.mainImgUrl"
                :img-style="{height: '104px', width: '100%'}"
              />
              <div class="card-prod-bottom">
                <span class="card-prod-name">{{ dataForm.spu.spuName }}</span>
                <el-button
                  type="primary"
                  link
                  class="card-prod-name-button"
                  @click="deleteCurrentProd"
                >
                  删除
                </el-button>
              </div>
            </el-card>
          </div>
          <div
            v-if="relatedSpu === 1 && !dataForm.spuId"
            class="select-pro"
          >
            <el-button @click="selectProds">
              选择商品
            </el-button>
          </div>
          <prods-select
            v-if="prodSelectVisible"
            ref="prodSelectRef"
            :is-single="true"
            @refresh-select-prods="getSelectedProd"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="visible = false"
          >
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
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/multishop/index-img'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = reactive({
  imgId: 0,
  imgUrl: null,
  seq: 0,
  imgType: 0,
  status: 1,
  spuId: null,
  spu: {} // 商品列表
})
const relatedSpu = ref(0)
const prodSelectVisible = ref(false)
const rules = {
  imgUrl: [
    { required: true, message: '请选择轮播图图片', trigger: 'blur' }
  ]
}

const dataFormRef = ref('')
const init = (imgId) => {
  visible.value = true
  dataForm.imgId = imgId || 0
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.imgId) {
      return
    }
    api.get(imgId).then(data => {
      Object.assign(dataForm, data)
      relatedSpu.value = data.spuId ? 1 : 0
    })
  })
}

defineExpose({
  init
})

const prodSelectRef = ref('')
const selectProds = () => {
  prodSelectVisible.value = true
  nextTick(() => {
    prodSelectRef.value?.init()
  })
}

const getSelectedProd = (prods) => {
  dataForm.spu = prods
  dataForm.spuId = prods.spuId
}

const deleteCurrentProd = () => {
  dataForm.spu = {}
  dataForm.spuId = ''
}

const closeDialog = () => {
  dataForm.imgId = 0
  dataForm.imgUrl = null
  dataForm.seq = 0
  dataForm.imgType = 0
  dataForm.status = 1
  dataForm.spuId = null
  dataForm.spu = {}
}

/**
 * 表单提交
 */
const onSubmit = Debounce(() => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    if (!dataForm.imgUrl) {
      ElMessage({
        message: '请选择轮播图片',
        type: 'warning',
        duration: 1500
      })
      return
    }
    if (relatedSpu.value === 1 && !dataForm.spuId) {
      ElMessage({
        message: '请选择商品',
        type: 'warning',
        duration: 1500
      })
      return
    }
    if (relatedSpu.value === 0) {
      dataForm.spuId = ''
    }
    const _dataForm = JSON.parse(JSON.stringify(dataForm))
    _dataForm.spu = undefined
    const request = dataForm.imgId ? api.update(_dataForm) : api.save(_dataForm)
    request.then(() => {
      visible.value = false
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          emit('refreshDataList')
          dataFormRef.value?.resetFields()
        }
      })
    })
  })
}, 1000)
/**
 * 触发表单校验
 * @param prop 校验项
 */
const onPropChage = (prop) => {
  dataFormRef.value?.validateField(prop)
}
</script>

<style lang="scss" scoped>
.component-add-or-update {
  .type-box{
    :deep(.el-form-item__content){
      display: block;

    }
  }
  .select-pro {
    margin-top: 10px;
    width: 100%;
  }
  .card-prod-bottom {
    position: relative;
    text-align: left;
    top: -15px;
    .card-prod-name {
      margin: auto;
      padding: 0 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 118px;
      display: inline-block;
    }
    .card-prod-name-button {
      position: absolute;
      top: 30px;
      right: 0;
    }
  }
  .img-remark {
    width: 500px;
  }
}
</style>
