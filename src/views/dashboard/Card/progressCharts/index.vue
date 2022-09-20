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
        // 最小值与最大值
        min: 0,
        max: 100
      },
      yAxis: {
        show: false, // 隐藏 y 轴
        type: 'category'
      },
      series: [
        {
          type: 'bar',
          data: [78],
          barWidth: 14,
          color: 'yellowgreen',
          // 背景颜色
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          // 文本设置
          label: {
            show: true,
            formatter: '|',
            position: 'right',
            color: 'green'
          }
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
