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
        style="margin: 0 !important;"
      >
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
              <img-show :src="item.image" />
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
import request from '@/utils/request.js'

const emit = defineEmits(['selectTemplate'])

const perProps = reactive({
  pageNum: 1, // 当前页
  pageSize: 10, // 每页显示多少条
  total: 0 // 总数
})

const init = () => {
  getMiniPageList()
}
// 每页数
const sizeChangeHandle = (val) => {
  perProps.pageSize = val
  getMiniPageList()
}

// 当前页
const currentChangeHandle = (val) => {
  perProps.pageNum = val
  getMiniPageList()
}

const templateList = ref([])
const visible = ref(false)
// 获取微页面列表
const getMiniPageList = () => {
  const { pageNum, pageSize } = perProps
  request({
    url: '/mall4cloud_admin/mp/shop_template/page',
    methods: 'get',
    params: {
      pageNum, // 当前页
      pageSize, // 每页显示多少条
      type: 2 // 1表示pc端，2表示移动端
    }
  }).then((data) => {
    templateList.value = data.list
    perProps.total = data.total
    visible.value = true
  })
}
const selectTemplate = (id) => {
  emit('selectTemplate', id)
  visible.value = false
}

defineExpose({
  init
})

</script>

<style lang="scss" scoped>
@use "index";
</style>
