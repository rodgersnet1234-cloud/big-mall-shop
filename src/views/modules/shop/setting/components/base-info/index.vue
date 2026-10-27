<template>
  <div class="component-base-info">
    <!-- 基本信息 -->
    <div class="basic-info-mod">
      <!-- 信息 -->
      <div class="business-info-mod">
        <el-form
          ref="shopBasicInfoRef"
          label-width="100px"
          :model="shopBasicInfo"
          :rules="shopBasicInfoRules"
          @submit.prevent
        >
          <div class="ci-wrapper">
            <div class="right-info">
              <el-form-item
                label="店铺logo"
                prop="shopLogo"
              >
                <div class="business-license-box">
                  <div class="license-content">
                    <imgs-upload
                      v-model="shopBasicInfo.shopLogo"
                      :limit="1"
                    />
                  </div>
                  <div class="upload-tips">
                    建议尺寸80*80像素，仅限jpg、gif、png，仅限上传1张
                  </div>
                </div>
              </el-form-item>
              <div class="bg-img">
                <div class="business-license-box">
                  <el-form-item
                    label="店铺背景图"
                    prop="mobileBackgroundPic"
                  >
                    <div>
                      <div class="license-content">
                        <imgs-upload
                          v-model="shopBasicInfo.mobileBackgroundPic"
                          :limit="1"
                        />
                      </div>
                      <div class="img-tips">
                        <p>移动端背景图</p>
                        <p>(建议尺寸750*380)</p>
                      </div>
                    </div>
                  </el-form-item>
                </div>
                <div class="business-license-box">
                  <el-form-item
                    label-width="0"
                    prop="pcBackgroundPic"
                  >
                    <div>
                      <div class="license-content">
                        <imgs-upload
                          v-model="shopBasicInfo.pcBackgroundPic"
                          :limit="1"
                        />
                      </div>
                      <div class="img-tips">
                        <p>PC端背景图</p>
                        <p>(主要展示在店铺外部入口处，建议尺寸590*220)</p>
                      </div>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="left-info">
              <el-form-item
                label="商家名称"
                prop="merchantName"
              >
                <p class="txt">
                  <el-input
                    v-model="shopBasicInfo.merchantName"
                    placeholder="请输入10字以内的商家名称"
                    maxlength="10"
                    style="width: 300px"
                  />
                </p>
              </el-form-item>
              <el-form-item
                label="店铺名称"
                prop="shopName"
              >
                <p class="txt">
                  <el-input
                    v-model="shopBasicInfo.shopName"
                    placeholder="请输入20字以内的店铺名称"
                    maxlength="20"
                    style="width: 300px"
                  />
                </p>
              </el-form-item>
              <el-form-item
                label="联系人"
                prop="contactName"
              >
                <p class="txt">
                  <el-input
                    v-model="shopBasicInfo.contactName"
                    placeholder="请输入常用联系人姓名"
                    maxlength="10"
                    style="width: 300px"
                  />
                </p>
              </el-form-item>
              <el-form-item
                label="联系方式"
                prop="contactPhone"
              >
                <p class="txt">
                  <el-input
                    v-model="shopBasicInfo.contactPhone"
                    placeholder="请输入常用联系人11位手机号码"
                    maxlength="11"
                    style="width: 300px"
                    @input="shopBasicInfo.contactPhone=shopBasicInfo.contactPhone.replace(/[^\d|*]/g,'')"
                  />
                </p>
              </el-form-item>
              <el-form-item
                label="店铺简介"
                prop="intro"
              >
                <el-input
                  v-model="shopBasicInfo.intro"
                  type="textarea"
                  :rows="4"
                  class="store-intro"
                  maxlength="200"
                  placeholder="请输入200字以内店铺简介"
                />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <div class="footer">
        <div class="foot-box">
          <div
            v-permission="['shop:shopDetail:save']"
            class="btn"
            @click="validationShopBasicInfo"
          >
            基本信息保存
          </div>
        </div>
      </div>
    </div>
    <!-- /基本信息 -->
  </div>
</template>

<script setup>
import * as api from '@/api/multishop/shop-process'
import { ElMessage } from 'element-plus'
import { validNoEmptySpace } from '@/utils/validate'

const emit = defineEmits(['successUpdate'])
const userStore = useUserStore()
const shopBasicInfo = ref({})

const validateMobile = (rule, value, callback) => {
  if (isStarMobile(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的联系方式'))
  }
}

// 纯空格校验
const validEmptySpace = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能全为空格'))
  } else {
    callback()
  }
}
const shopBasicInfoRules = reactive({
  merchantName: [
    { required: true, message: '商家名称不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '商家名称长度在2-10个字符之间', trigger: 'blur' },
    { validator: validEmptySpace, trigger: 'blur' }
  ],
  shopName: [
    { required: true, message: '店铺名称不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '店铺名称长度在2-20个字符之间', trigger: 'blur' },
    { validator: validEmptySpace, trigger: 'blur' }
  ],
  contactName: [
    { required: true, message: '联系人不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '联系人长度在2-10个字符之间', trigger: 'blur' },
    { validator: validEmptySpace, trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请填写联系方式', trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ],
  shopLogo: [
    { required: true, message: '请上传店铺logo', trigger: 'change' }
  ],
  mobileBackgroundPic: [
    { required: true, message: '请上传移动端背景图', trigger: 'change' }
  ],
  pcBackgroundPic: [
    { required: true, message: '请上传PC端背景图', trigger: 'change' }
  ],
  intro: [
    // 店铺简介（非必填,校验纯空格）
    { validator: validEmptySpace, trigger: 'blur' }
  ]
})

onMounted(() => {
  queryShopBasicInfo()
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

const shopBasicInfoRef = ref('')
watch(() => shopBasicInfo.value, () => {
  if (shopBasicInfoRef.value) {
    shopBasicInfoRef.value?.validate().then(() => {
      // 校验通过
    }).catch(() => {
      // 校验不通过
    })
  }
}, { deep: true })

/**
 * 更新店铺申请信息
 */
const validationShopBasicInfo = () => {
  // 基本信息
  shopBasicInfoRef.value?.validate((valid) => {
    if (!valid) {
      return
    }
    updateShopBasicInfo()
  })
}

/**
 * 更新基本信息
 */
const updateShopBasicInfo = () => {
  api.saveBasicInfo(shopBasicInfo.value).then(() => {
    ElMessage({
      message: '基本信息更新成功！',
      type: 'success',
      duration: 1500,
      onClose: () => {
        emit('successUpdate')
      }
    })
    userStore.name = shopBasicInfo.value.shopName
    userStore.avatar = checkFileUrl(shopBasicInfo.value.shopLogo)
  })
}

</script>
<style lang="scss" scoped>
@use "index";
</style>
