<template>
  <el-dialog
    v-model="visible"
    :title="$t('shopFeature.template.selectTemplate')"
    :close-on-click-modal="false"
    width="60%"
  >
    <div class="template-list">
      <div
        class="main-container"
        style="margin: 0 !important;background-color: #fff;"
      >
        <!-- <div> -->
        <div class="card-item-card">
          <div
            class="card-item card-item-first"
            @click="selectTemplate(-1)"
          >
            <div>
              <div class="template-item template-item-first">
                <el-icon><Plus /></el-icon>
              </div>
            </div>
            <div class="title title-first">
              {{ $t('shopFeature.template.blank') }}
            </div>
          </div>
        </div>

        <div
          v-for="(item, index) in templateList"
          :key="index"
          class="card-item-card"
        >
          <div
            class="card-item"
            @click="selectTemplate(item.templateId)"
          >
            <div class="template-item">
              <ImgShow :src="item.image" />
            </div>
            <div class="title">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>

      <el-pagination
        v-if="templateList.length"
        :current-page="perProps.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="perProps.pageSize"
        :total="perProps.total"
        layout="->, total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import request from '@/utils/request'
import { Plus } from '@element-plus/icons-vue'

const emit = defineEmits(['selectTemplate'])

const templateList = ref([])
const visible = ref(false)
const perProps = ref({
  pageNum: 1, // 当前页
  pageSize: 20, // 每页显示多少条
  total: 0 // 总数
})

const init = () => {
  perProps.value.pageNum = 1
  getMiniPageList()
}
// 每页数
const sizeChangeHandle = (val) => {
  perProps.value.pageSize = val
  getMiniPageList()
}
// 当前页
const currentChangeHandle = (val) => {
  perProps.value.pageNum = val
  getMiniPageList()
}
// 获取微页面列表
const getMiniPageList = () => {
  const { pageNum, pageSize } = perProps.value
  request({
    url: '/mall4cloud_admin/mp/shop_template/page',
    methods: 'get',
    params: {
      pageNum, // 当前页
      pageSize, // 每页显示多少条
      type: 1 // 1表示pc端，2表示移动端
    }
  }).then((data) => {
    visible.value = true
    templateList.value = data.list
    perProps.value.total = data.total
  })
}
const selectTemplate = (id) => {
  emit('selectTemplate', id)
  visible.value = false
}
defineExpose({ init })
</script>

<style lang="scss" scoped>
.template-list {
  .main-container {
    display: flex;
    flex-wrap: wrap;
    margin: 0 !important;
    .card-item-card {
      margin: 20px 10px 20px 10px;
      cursor: pointer;
    }
    .card-item-card:not(:first-child) {
      margin-left: 10px;
    }
    .template-item-first {
      display: flex;
      border: 1px solid #EBEEF5;
      align-items: center;
      justify-content: center;
    }
    .template-item-first:hover {
      border: 1px solid #155BD4;
    }
    .template-item {
      width: 184px;
      height: 113px;
      border-radius: 4px;
    }
    .card-item-first {
      width: 100%;
      position: relative;
    }
    .card-item {
      width: 100%;
      background: #FFFFFF;
      .title-first {
        text-align: center;
        width: 100%;
      }
      .title {
        color: #000000;
        font-size: 14px;
        margin-top: 16px;
        text-align: center;
        display: -webkit-box;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        max-width: 184px;
      }
    }
  }

}
</style>
