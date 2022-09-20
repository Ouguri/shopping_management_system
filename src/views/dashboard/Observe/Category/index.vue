<template>
  <div>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div slot="header" class="header">
        <div class="category-header">
          <span>销售额类别占比</span>
          <el-radio-group v-model="value">
            <el-radio-button label="全部渠道" />
            <el-radio-button label="线上" />
            <el-radio-button label="门店" />
          </el-radio-group>
        </div>
      </div>
      <!-- card body -->
      <div>
        <div ref="charts" class="charts" />
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: '',
  data() {
    return {
      value: '全部渠道'
    }
  },
  mounted() {
    const mychart = echarts.init(this.$refs.charts)
    mychart.setOption({
      title: {
        text: null,
        subtext: null,
        left: 'center',
        top: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outsize'
          },
          // 文字的放大效果动画
          // emphasis: {
          //   label: {
          //     show: true,
          //     fontSize: '40',
          //     fontWeight: 'bold'
          //   }
          // },
          labelLine: {
            show: true
          },
          data: [
            { value: 1048, name: '视频' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    })
    mychart.on('mouseover', (params) => {
      const { name, value } = params.data
      mychart.setOption({
        text: name,
        subtext: value
      })
    })
  }
}
</script>

<style scoped>
.header {
  border-bottom: 2px solid #eee;
  padding: 0 0 10px 0;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.charts {
  width: 100%;
  height: 300px;
}
</style>
