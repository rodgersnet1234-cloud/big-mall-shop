<template>
  <div class="page-seckill app-container mod-seckill">
    <!-- 新的秒杀页 -->
    <div class="top-container">
      <div class="title">
        整点秒杀
      </div>
      <div class="content-box">
        <div class="content">
          <div class="message">
            操作提示:
          </div>
          <div class="description">
            <p>1、点击参与即可编辑参与整点秒杀的商品</p>
            <p>2、秒杀活动结束时间默认持续两小时</p>
            <p>3、各个场次活动商品不可重叠</p>
            <p>
              4、抢购商品金额不可设置为0元
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div
        v-if="tabsValue !== '1'"
        class="operation-bar"
      >
        <el-date-picker
          v-model="searchForm.specTime"
          type="date"
          width="140"
          placeholder="请选择日期"
        />
        <el-button
          type="primary"
          @click="onSearch(true)"
        >
          搜索
        </el-button>
      </div>

      <div class="table-con">
        <div class="tabs">
          <el-tabs
            v-model="tabsValue"
            @tab-change="tabsClick"
          >
            <el-tab-pane
              v-for="item in tabsType"
              :key="item.value"
              :label="item.label"
              :name="item.value"
            />
          </el-tabs>
        </div>

        <el-table
          v-loading="pageLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%;"
        >
          <el-table-column
            align="center"
            prop="startTime"
            label="开始时间"
          />
          <el-table-column
            align="center"
            prop="selectedLot"
            label="场次"
          >
            <template #default="{row}">
              {{ timeTable[row.selectedLot].label }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="endTime"
            label="结束时间"
          />
          <el-table-column
            align="center"
            prop="prodNum"
            label="参与商品数"
          />
          <el-table-column
            align="center"
            label="操作"
          >
            <template #default="{row}">
              <div>
                <el-link
                  v-if="row.canJoin === 0"
                  v-permission="['marketing:seckill:detail']"
                  type="primary"
                  :underline="false"
                  @click="seckillDetail(row)"
                >
                  详情
                </el-link>
                <el-link
                  v-if="row.canJoin === 1 && tabsValue !== '2'"
                  v-permission="['marketing:seckill:join']"
                  type="primary"
                  :underline="false"
                  @click="joinSeckill(row)"
                >
                  参与
                </el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页条 -->
      <pagination
        v-show="pageData.total>0 && (tabsValue === '2' || tabsValue === '0')"
        v-model:page="searchForm.pageNum"
        v-model:limit="searchForm.pageSize"
        :total="pageData.total"
        @pagination="getPageData()"
      />
    </div>
    <!--  秒杀设置 -->
  </div>
</template>

<script setup>
import * as api from '@/api/seckill/seckill'

// 返回参数
// 返回参数
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  specTime: null,
  type: null
})
// loading
const pageLoading = ref(true)

const tabsType = ref([{
  value: '0',
  label: '即将开场'
}, {
  value: '1',
  label: '进行中'
}, {
  value: '2',
  label: '已结束'
}])

const tabsValue = ref('0')
const timeTable = ref([{
  value: 0,
  label: '00:00',
  active: false
}, {
  value: 1,
  label: '01:00',
  active: false
}, {
  value: 2,
  label: '02:00',
  active: false
}, {
  value: 3,
  label: '03:00',
  active: false
}, {
  value: 4,
  label: '04:00',
  active: false
}, {
  value: 5,
  label: '05:00',
  active: false
}, {
  value: 6,
  label: '06:00',
  active: false
}, {
  value: 7,
  label: '07:00',
  active: false
}, {
  value: 8,
  label: '08:00',
  active: true
}, {
  value: 9,
  label: '09:00',
  active: true
}, {
  value: 10,
  label: '10:00',
  active: true
}, {
  value: 11,
  label: '11:00',
  active: true
}, {
  value: 12,
  label: '12:00',
  active: true
}, {
  value: 13,
  label: '13:00',
  active: true
}, {
  value: 14,
  label: '14:00',
  active: true
}, {
  value: 15,
  label: '15:00',
  active: true
}, {
  value: 16,
  label: '16:00',
  active: true
}, {
  value: 17,
  label: '17:00',
  active: true
}, {
  value: 18,
  label: '18:00',
  active: false
}, {
  value: 19,
  label: '19:00',
  active: false
}, {
  value: 20,
  label: '20:00',
  active: false
}, {
  value: 21,
  label: '21:00',
  active: false
}, {
  value: 22,
  label: '22:00',
  active: false
}, {
  value: 23,
  label: '23:00',
  active: false
}])

const isSubmit = ref(false)
const route = useRoute()

onMounted(() => {
  searchForm.pageNum = Number(route.query.pageNum) || 1
  searchForm.pageSize = Number(route.query.pageSize) || 10
  tabsValue.value = route.query.tabsValue || '0'
  isSubmit.value = false
  getPageData()
})

const getPageData = (newData = false) => {
  if (newData) {
    searchForm.specTime = new Date(searchForm.specTime).getTime()
  }
  isSubmit.value = false
  pageLoading.value = true
  searchForm.type = tabsValue.value
  if (tabsValue.value !== '2') {
    api.listSeckill({ ...searchForm }).then(data => {
      pageData.value.dataList = data.list
      pageData.value.pages = data.pages
      pageData.value.total = data.total
      pageLoading.value = false
      setRouterQuery()
    }).finally(() => {
      pageLoading.value = false
    })
  } else {
    api.listEndSeckill({ ...searchForm }).then(data => {
      pageData.value.dataList = data.list
      pageData.value.pages = data.pages
      pageData.value.total = data.total
      pageLoading.value = false
      setRouterQuery()
    }).finally(() => {
      pageLoading.value = false
    })
  }
}
const router = useRouter()
const setRouterQuery = () => {
  router.push({
    query: {
      pageNum: searchForm.pageNum,
      pageSize: searchForm.pageSize,
      tabsValue: tabsValue.value
    }
  })
}
// 点击导航栏切换
const tabsClick = () => {
  searchForm.pageNum = 1
  getPageData()
}
const onSearch = (newData = false) => {
  searchForm.pageNum = 1
  getPageData(newData)
}

// 详情按钮
const seckillDetail = (row) => {
  router.push({
    path: '/marketing/seckill/components/seckill-detail',
    query: {
      startTime: new Date(row.startTime).getTime(),
      canJoin: row.canJoin,
      endTime: new Date(row.endTime).getTime()
    }
  })
}
// 参与按钮
const joinSeckill = (row) => {
  router.push({
    path: '/marketing/seckill/components/seckill-detail',
    query: {
      startTime: new Date(row.startTime).getTime(),
      canJoin: row.canJoin,
      endTime: new Date(row.endTime).getTime()
    }
  })
}

</script>
<style lang="scss" scoped>
.mod-seckill {
  .top-container {
    .title {
      margin-bottom: 15px;
    }
  }
  .content-box {
    margin-bottom: 16px;
    background-color: #cde3f8;
    border: 1px solid #7cbdfa;
    .content {
      padding: 15px;
      .message {
        display: block;
        margin-bottom: 4px;
        color: rgba(0, 0, 0, 0.85);
        font-size: 16px;
      }
      .description {
        font-size: 14px;
        line-height: 7px;
      }
    }
  }
}
</style>
