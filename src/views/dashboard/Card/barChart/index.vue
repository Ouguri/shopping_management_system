<template>
  <!-- 容器 -->
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: '',
  mounted() {
    // 初始化 echarts 实例
    const lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis: {
        show: false, // 隐藏 x 轴
        type: 'category'
      },
      yAxis: {
        show: false // 隐藏 y 轴
      },
      series: [
        {
          type: 'bar',
          data: [10, 7, 35, 48, 9, 29, 10, 44, 33, 41, 22]
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {

      }
    })
  }
}
</script>

<style scoped>
  .charts {
    width: 100%;
    height: 100%;
  }
</style>
