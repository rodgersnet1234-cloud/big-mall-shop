<template>
  <div>
    <nav
      class="site-navbar site-navbar--default"
    >
      <div
        class="site-navbar__header"
        :style="{ 'margin': '0 20px'}"
      >
        <div
          class="site-navbar__brand"
          style="width: auto;"
        >
          <WebConfigImg
            :src="configuration.bsTopBarIcon"
            :img-style="{width:'59px',height: '18px',marginRight: '10px'}"
            def-img-type="bsTopBarIcon"
          />
          <a
            class="site-navbar__brand-lg"
            style="text-transform:none;"
            href="javascript:"
          >{{
            $t('language') === 'English' ?
              configuration.bsMenuTitleOpenEn : configuration.bsMenuTitleOpenCn
          }}</a>
        </div>
      </div>
      <div
        class="site-navbar__content clearfix"
        @click="closeRight;visible = false"
      >
        <el-menu
          :ellipsis="false"
          class="site-navbar__menu site-navbar__menu--right"
          mode="horizontal"
          style="margin-right: 20px"
        >
          <el-menu-item
            class="site-navbar__avatar"
            index="4"
          >
            <div
              class="decorate-menu is-active"
              @click.stop="setMenu(4);handleSave();visible=false"
            >
              {{ $t('pcdecorate.decorateNavbar.saveBtn') }}
            </div>
          </el-menu-item>
        </el-menu>
        <el-menu
          v-show="isTemplate === '0'"
          :ellipsis="false"
          class="site-navbar__menu site-navbar__menu--right"
          mode="horizontal"
          style="margin-right: 20px"
        >
          <el-menu-item
            class="site-navbar__avatar"
            index="3"
          >
            <div
              class="decorate-menu is-active"
              @click.stop="setMenu(3); viewDialog = true;visible=false"
            >
              {{ $t('pcdecorate.decorateNavbar.setTemplate') }}
            </div>
          </el-menu-item>
        </el-menu>
        <el-menu
          :ellipsis="false"
          class="site-navbar__menu site-navbar__menu--right"
          mode="horizontal"
          style="margin-right: 20px"
        >
          <el-menu-item
            class="site-navbar__avatar"
            index="2"
          >
            <div
              class="decorate-menu is-active"
              @click.stop="setMenu(2);view();visible=false"
            >
              {{ $t('pcdecorate.decorateNavbar.preview') }}
            </div>
          </el-menu-item>
        </el-menu>
        <el-menu
          :ellipsis="false"
          class="site-navbar__menu site-navbar__menu--right"
          mode="horizontal"
          style="margin-right: 20px"
        >
          <el-menu-item
            class="site-navbar__avatar"
            index="1"
          >
            <div
              class="decorate-menu is-active"
              @click.stop="setMenu(1);handleClickComponent();visible=false"
            >
              {{ $t('pcdecorate.commonModal.component') }}
            </div>
          </el-menu-item>
        </el-menu>
        <div class="top-tip">
          提示：长按微页面中已添加的组件可移动位置
        </div>
      </div>
    </nav>

    <!-- 模板设置 -->
    <el-dialog
      v-model="viewDialog"
      :title="$t('pcdecorate.decorateNavbar.templateInfo')"
      width="30%"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="dataRule"
        label-width="100px"
        style="margin: 30px 30px 0 10px"
        @submit.prevent
      >
        <el-form-item
          :label="$t('pcdecorate.decorateNavbar.templateName') + ':'"
          prop="name"
          :label-width="labelWidth"
        >
          <el-input
            v-model="dataForm.name"
            maxlength="20"
            @keyup.enter="onSubmit()"
          />
        </el-form-item>
        <el-form-item
          :label="$t('pcdecorate.decorateNavbar.templateRemark') + ':'"
          prop="remark"
          :label-width="labelWidth"
        >
          <el-input
            v-model="dataForm.remark"
            type="textarea"
            rows="5"
            :placeholder="$t('pcdecorate.decorateNavbar.templateTip')"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          :label="$t('pcdecorate.decorateNavbar.templateImg') + ':'"
          prop="imgUrl"
          :label-width="labelWidth"
        >
          <div class="img-upload">
            <img-upload v-model="dataForm.imgUrl" />
            <el-button
              v-if="dataForm.imgUrl"
              type="primary"
              link
              class="default-btn text-btn"
              @click="delTagItemPic()"
            >
              {{ $t('pcdecorate.decorateNavbar.delBtn') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="primary-btn default-btn"
            @click="viewDialog = false"
          >{{ $t("table.cancel") }}</el-button>
          <el-button
            class="primary-btn default-btn"
            type="primary"
            @click="onSubmit()"
          >{{ $t("table.confirm") }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import ImgUpload from '@/components/img-upload/index.vue'

const props = defineProps({
  isTemplate: {
    type: String,
    default: '0'
  },
  dataFormL: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits([
  'view',
  'handleSaveTemplate',
  'handleClickComponent',
  'handleSave',
  'closeRight'
])

const configuration = ref({
  bsLoginLogoImg: null,
  bsLoginBgImg: null,
  bsCopyrightCn: null,
  bsCopyrightEn: null,
  bsTitleContentCn: null,
  bsTitleContentEn: null,
  bsTitleImg: null,
  bsMenuTitleOpenCn: null,
  bsMenuTitleOpenEn: null,
  bsMenuTitleCloseCn: null,
  bsMenuTitleCloseEn: null
})
const visible = ref(false)

const validateName = (rule, value, callback) => {
  if (!value.trim()) {
    callback(new Error($t('pcdecorate.decorateNavbar.templateNameNotNull')))
  } else {
    callback()
  }
}
const dataRule = reactive({
  name: [
    { required: true, message: $t('pcdecorate.decorateNavbar.templateNameNotNull'), trigger: 'blur' },
    { validator: validateName, trigger: 'blur' }
  ]
})

const labelWidth = reactive(localStorage.getItem('cloudLang') === 'en' ? '140px' : '100px')

const dataForm = ref(props.dataFormL)
watch(() => props.dataFormL, (val) => {
  dataForm.value = val
})

onMounted(() => {
  updateWebConfigData()
})

const delTagItemPic = () => {
  dataForm.value.imgUrl = ''
}
// 预览
const view = () => {
  emit('view')
}
// 模板保存
const dataFormRef = ref(null)
const viewDialog = ref(false)
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (!valid) {
      return
    }
    emit('handleSaveTemplate', dataForm.value)
    viewDialog.value = false
  })
}
// 菜单选择
const menuActive = ref(1)
const setMenu = (index) => {
  if (index !== menuActive.value) {
    menuActive.value = index
  } else {
    menuActive.value = -1
  }
}
// 组件管理
const handleClickComponent = () => {
  emit('handleClickComponent')
}
// 保存
const handleSave = () => {
  if (props.isTemplate === '0') {
    emit('handleSave', 2)
  } else {
    viewDialog.value = true
  }
}
// 关闭组件设置
const closeRight = () => {
  emit('closeRight')
}
// 更新网站配置信息
const fontCloseSize = reactive({
  fontSize: '18px'
})
const fontOpenSize = reactive({
  fontSize: '16px'
})

const webConfigStore = useWebConfigStore()
const updateWebConfigData = () => {
  const data = webConfigStore.webConfig
  configuration.value = data
  if (data.bsMenuTitleOpenEn.length >= 17) {
    fontOpenSize.fontSize = '16px'
  } else if (data.bsMenuTitleOpenCn.length >= 10) {
    fontOpenSize.fontSize = '16px'
  }

  if (data.bsMenuTitleCloseEn.length >= 6) {
    fontCloseSize.fontSize = '18px'
  } else if (data.bsMenuTitleCloseCn.length >= 4) {
    fontCloseSize.fontSize = '18px'
  }
}

</script>

<style lang="scss" scoped>
.site-navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
  height: 50px;
  background-color: #fff;
}
.site-navbar__brand {
  font-size: 16px;
  white-space: normal;
  display: flex;
  align-items: center;
  height: 50px;
  font-weight: bold;
  padding: 5px 0;
}
.site-navbar__brand-lg {
  margin: 0 auto;
  word-break: break-all; /* 按字符截断换行 支持IE和chrome，FF不支持*/
  word-wrap: break-word; /* 按英文单词整体截断换行  以上三个浏览器均支持 */
  color: #333333;
}
.site-navbar__brand-lg:hover {
  color: #333;
}

.site-navbar :deep(.el-menu.el-menu--horizontal) {
  border-bottom: none;
}
.site-navbar :deep(.el-menu--horizontal > .el-menu-item) {
  height: 50px;
  line-height: 47px;
  padding: 0 !important;
  &:not(.is-disabled):focus,
  &:not(.is-disabled):hover {
    background-color: #fff !important;
  }
}
.site-navbar__header {
  margin-right: 20px;
  float: left;
}
.site-navbar__menu {
  float: right;
}
div :deep(.site-navbar__menu--right:not(:first-child)) {
  padding-right: 25px;
}
div :deep(.site-navbar__menu--right:not(:first-child)::after) {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  content: '';
  display: block;
  width: 1px;
  height: 30px;
  background: #DCDFE6;
}
.site-navbar {
  overflow: hidden;
  border-bottom: 1px solid #EBEDF0;
}
.site-navbar__content {
  width: 100%;
}
.site-navbar__content .top-tip {
  float: right;
  height: 50px;
  line-height: 47px;
  color: #858585;
  margin-right: 20px;
}

.decorate-menu {
  font-size: 14px;
  color: #666666;
  padding: 0 18px;
}
.is-active:hover {
  color: #155BD4;
}
.is-active:hover :deep(.el-icon-menu) {
  color: #155BD4;
}
:deep(.el-icon-menu) {
  transform: rotate(45deg);
}
.img-upload {
  display: flex;
  align-items: center;
}

.text-btn {
  margin-left: 5px;
}
:deep(.el-form-item) {
  margin-bottom: 22px;
}
</style>
