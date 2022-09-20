<template>
  <div>
    <div class="header">
      <span class="search-title">搜索用户数</span>
      <svg t="1663339787592" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2591" width="26" height="26"><path d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z" p-id="2592" fill="#cdcdcd" /></svg>
    </div>
    <div class="main">
      <span class="min-data">12321</span>
      <span class="min-content">17.1</span>
      <span>⬆</span>
      <span>⬇</span>
    </div>
    <div class="footer">
      <div ref="charts" class="charts" />
    </div>
  </div>
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
            color: 'skyblue'
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
                offset: 0, color: 'skyblue' // 0% 处的颜色
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
.header {
  display: flex;
  align-items: center;
}

.search-title {
  margin-right: 17px;
}

.main {
  margin-top: 10px 0;
}

.min-data {
  margin-right: 30px;
}

.footer {
  margin: 15px 0;
}

.charts {
  width: 100%;
  height: 50px;
  position: relative;
  right: 18px;
}
</style>
