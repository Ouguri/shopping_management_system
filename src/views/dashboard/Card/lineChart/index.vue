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
          type: 'line',
          data: [10, 7, 35, 48, 9, 29, 10, 44],
          // 拐点样式设置
          itemStyle: {
            opacity: 0
          },
          lineStyle: {
            color: 'purple'
          },
          // 填充颜色设置
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'purple' // 0% 处的颜色
              }, {
                offset: 1, color: '#fff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
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
