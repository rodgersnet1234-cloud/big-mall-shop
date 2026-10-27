<template>
  <!-- 数据分析板块标题栏组件 -->
  <div class="data-analysis component-title-bar">
    <div class="module-title">
      <div class="tit-lf">
        {{ title }}
      </div>
      <div
        v-if="status"
        class="tit-rg"
      >
        <div class="statistics-time">
          <span>统计时间：</span>
          <el-select
            v-model="value"
            class="select-mod"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="date-display">
          2021-04-05 至 2021-04-25
        </div>
        <div class="refresh">
          刷新
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  status: {
    type: Number,
    default: 1
  }
})

const options = reactive([
  {
    label: 0,
    value: '近7天'
  },
  {
    label: 0,
    value: '近30天'
  }
])

const value = ref('')

</script>

<style lang="scss" scoped>
// 数据分析板块标题栏
.data-analysis.component-title-bar {
  // 板块标题栏
  .module-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f7f8fa;
    padding: 16px 10px;
    .tit-lf {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 17px;
      font-weight: bold;
      padding-left: 6px;
      color: #333;
    }
    .tit-lf::before {
      display: block;
      content: '';
      width: 3px;
      height: 16px;
      background: #155bd4;
      margin-right: 5px;
      border-radius: 8px;
    }
    .tit-rg {
      display: flex;
      align-items: center;
      font-size: 14px;
      .statistics-time {
        margin-right: 10px;
        .select-mod {
          width: 120px;
        }
      }
      .date-display {
        font-size: 12px;
        color: #666;
      }
      .refresh {
        font-size: 12px;
        color: #155bd4;
        padding-left: 10px;
      }
    }
  }
}
</style>
