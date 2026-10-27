<template>
  <div ref="chart" />
</template>

<script setup>
import * as echarts from 'echarts/core'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  ToolboxComponent,
  LegendComponent,
  GraphicComponent,
  VisualMapComponent,
  GeoComponent
} from 'echarts/components'
import { LineChart, BarChart, MapChart, PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  TooltipComponent,
  TitleComponent,
  BarChart,
  ToolboxComponent,
  LegendComponent,
  GraphicComponent,
  VisualMapComponent,
  GeoComponent,
  MapChart,
  PieChart
])

const props = defineProps({
  options: {
    type: Object,
    default: () => {
    }
  }
})
const chart = ref(null)
let myChart = null
const onCreateChart = () => {
  if (chart.value && myChart) {
    myChart.dispose()
  }
  myChart = echarts.init(chart.value)
  // 样式处理
  const chartOptions = Object.assign({}, props.options)
  if (chartOptions.series && chartOptions.series.length) {
    chartOptions.series.forEach(item => {
      if (item.areaStyle && item.areaStyle.colorOption && item.areaStyle.colorType === 'LinearGradient') {
        item.areaStyle.color = new echarts.graphic.LinearGradient([...item.areaStyle.colorOption.direction], item.areaStyle.colorOption.color)
      }
    })
  }
  myChart.setOption(chartOptions)
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

onMounted(() => {
  onCreateChart()
})

onUpdated(() => {
  onCreateChart()
})
</script>
