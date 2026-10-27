<template>
  <div class="mod-order-order">
    <div class="main-content">
      <div
        v-for="form in formList"
        :key="form.id"
        class="card-item"
      >
        <el-card
          shadow="never"
          class="card-item-card"
        >
          <template #header>
            <div class="clearfix title">
              <el-tooltip
                v-if="form.formName.length > 12"
                effect="light"
                placement="top"
              >
                <template #content>
                  <span>
                    {{ form.formName.substring(0,25) }}
                    <br v-if="form.formName.length>25">
                    {{ form.formName.substring(25,50) }}
                    <br v-if="form.formName.length>50">
                    {{ form.formName.substring(50,75) }}
                    <br v-if="form.formName.length>75">
                    {{ form.formName.substring(75,1000) }}
                  </span>
                </template>
                <div class="hid">
                  {{ form.formName }}
                </div>
              </el-tooltip>
              <span v-else>{{ form.formName }}</span>
            </div>
          </template>
          <div class="title-text">
            <el-tooltip
              effect="light"
              placement="top"
            >
              <template #content>
                <div>
                  {{ form.content.substring(0,25) }}
                  <br v-if="form.content.length>25">
                  {{ form.content.substring(25,50) }}
                  <br v-if="form.content.length>50">
                  {{ form.content.substring(50,75) }}
                  <br v-if="form.content.length>75">
                  {{ form.content.substring(75,1000) }}
                </div>
              </template>
              <span>{{ form.content }}</span>
            </el-tooltip>
          </div>
          <div class="content-container">
            <div class="content">
              <span>时间周期：</span>
              <span class="content-item">自然 + {{ form.timeType === 1 ? '天' : form.timeType === 2 ? '周' : '月' }}</span>
            </div>
            <div class="content">
              <span>时间范围：</span>
              <span
                class="content-item"
              >近{{ form.timeRange }}{{ form.timeType === 1 ? '天' : form.timeType === 2 ? '周' : '月' }}</span>
            </div>
            <div class="content">
              <span>指标数量：</span>
              <span class="content-item">{{ form.formItemList.length }}个</span>
            </div>
            <div class="content-last">
              <span class="content-title">报表指标：</span>
              <span class="content-last-item">
                <el-tooltip
                  effect="light"
                  placement="top"
                >
                  <template #content><div>
                    {{ form.formItems.substring(0,25) }}
                    <br v-if="form.formItems.length>25">
                    {{ form.formItems.substring(25,50) }}
                    <br v-if="form.formItems.length>50">
                    {{ form.formItems.substring(50,75) }}
                    <br v-if="form.formItems.length>75">
                    {{ form.formItems.substring(75,1000) }}
                  </div></template>
                  <span>{{ form.formItems }}</span>
                </el-tooltip>
              </span>
            </div>
          </div>
          <div style="text-align:center;">
            <el-button
              v-permission="['shop:form:add']"
              class="primary"
              @click="addHandle(form.formId)"
            >
              加入我的报表
            </el-button>
          </div>
        </el-card>
      </div>
      <div
        v-if="formList.length === 0"
        class="noData"
      >
        暂无数据
      </div>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getDataList"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from '../components/form-add-or-update/index.vue'
import * as api from '@/api/form/form.js'

const route = useRoute()
onMounted(() => {
  // 携带参数查询
  const query = route.query
  if (Object.keys(query).length > 0) {
    getDataList(query)
  } else {
    getDataList()
  }
})

const formList = ref([])
/**
 * 获取数据列表
 */
const getDataList = () => {
  api.listRecommendForm().then(data => {
    formList.value = data
    formList.value.forEach(form => {
      let items = ''
      form.formItemList.forEach(item => {
        items = items + item.value + '、'
      })
      items = items.substring(0, items.length - 1)
      form.formItems = items
    })
  })
}

const addVisible = ref(false)
const addOrUpdateRef = ref(null)
// 新增 / 修改
const addHandle = (id) => {
  addVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id, true)
  })
}

</script>
<style lang="scss" scoped>
.mod-order-order {
  border-top:1px solid #fff ;
  padding-left: 20px;
  background-color: #fff;
  .main-content {
    display: flex;
    flex-wrap: wrap;
    .card-item {
      width: 298px;
      background: #FFFFFF;
      margin-right: 20px;
      margin-bottom: 15px;
      .card-item-card {
        border-radius: 0;
      }
      &:hover {
        .card-item-card {
          border: 1px solid #155BD4;
        }
      }
      &:deep(.el-card__body) {
        padding: 15px;
      }
    }
    .card-item:last-child {
      margin-bottom: 25px;
    }
    .title-text {
      width: 100%;
      height: 65px;
      color: #989898;
      font-size: 14px;
      line-height: 22px;
      word-break: break-word;
      word-wrap:break-word;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
    .content-container {
      border: 1px solid #eee;
      border-left: none;
      border-right: none;
      padding: 15px 0;
      margin: 15px 0;
    }
  }
}
.title {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.title .hid {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em;
}
.title-text {
  width: 100%;
  height: 65px;
  color: #989898;
  font-size: 14px;
  line-height: 22px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.content {
  color: #989898;
  font-size: 14px;
  line-height: 30px;
}
.content-title {
  float: left;
  width: 72px;
}
.content-item {
  color: #303030;
}
.content-last {
  height: 65px;
  color: #989898;
  font-size: 14px;
  line-height: 30px;
}
.content-last-item {
  float: left;
  line-height: 20px;
  width: 184px;
  color: #303030;
  padding-top: 5px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.noData {
  color: #8f9092;
  text-align: center;
  margin: 13% auto;
}
</style>
