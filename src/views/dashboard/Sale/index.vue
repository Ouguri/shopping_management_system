<template>
  <div>
    <el-card class="box-card" style="margin: 6px 0">
      <div slot="header" class="clearfix">
        <!-- 头部左侧内容 -->
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane label="销售额" name="salePrice" />
          <el-tab-pane label="访问量" name="askPrice" />
        </el-tabs>
        <!-- 右侧内容 -->
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setLongDay('week')">本周</span>
          <span @click="setLongDay('month')">本月</span>
          <span @click="setLongDay('year')">今年</span>
          <el-date-picker
            v-model="date"
            class="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            value-format="yyyy-MM-dd"
          />
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="18" :offset="0">
            <div ref="charts" class="charts" />
          </el-col>
          <el-col :span="6" :offset="0" class="rightContainer">
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li>
                <span class="rIndex">1</span>
                <span class="middle">肯德基</span>
                <span>123456</span>
              </li>
              <li>
                <span class="rIndex">2</span>
                <span class="middle">肯德基</span>
                <span>123456</span>
              </li>
              <li>
                <span class="rIndex">3</span>
                <span class="middle">肯德基</span>
                <span>123456</span>
              </li>
              <li>
                <span class="rIndex">4</span>
                <span class="middle">肯德基</span>
                <span>123456</span>
              </li>
              <li>
                <span class="rIndex">5</span>
                <span class="middle">肯德基</span>
                <span>123456</span>
              </li>
              <li>
                <span class="rIndex">6</span>
                <span class="middle">肯德基</span>
                <span>123456</span>
              </li>
              <li>
                <span class="rIndex">7</span>
                <span class="middle">肯德基</span>
                <span>123456</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
  name: '',
  data() {
    return {
      activeName: 'salePrice',
      myCharts: null,
      date: []
    }
  },
  computed: {
    // 标题
    title() {
      return this.activeName === 'salePrice' ? '销售额' : '访问量'
    },
    ...mapState({
      listState: state => state.home.list
    })
  },
  watch: {
    title() {
      console.log('修改配置数据')
      // 监听点击变化，重新渲染图标配置数据
      this.myCharts.setOption({
        title: {
          // 替换原本的标题
          text: `${this.title}趋势`
        },
        xAxis: {
          data: this.title === '销售额' ? this.listState.orderFullYearAxis : this.listState.userFullYearAxis
        },
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '40%',
            data: this.title === '销售额' ? this.listState.orderFullYear : this.listState.userFullYear
          }
        ]
      })
    },
    listState() {}
  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts)
    this.myCharts.setOption({
      title: {
        text: `销售额趋势`
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.listState.orderFullYearAxis,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '40%',
          data: this.listState.orderFullYear
        }
      ]
    })
  },
  methods: {
    // 获取本日
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    setLongDay(time) {
      const start = dayjs().startOf(time).format('YYYY-MM-DD')
      const end = dayjs().endOf(time).format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>

<style scoped>
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%
}

.right {
  position: absolute;
  right: 0;
}

.right span {
  margin: 0 18px;
  cursor: pointer;
  color: rgb(124, 124, 124);
  position: relative;
  transition: .3s;
}
.right span:hover {
  color: black;
}
.right span::before{
  content: '';
  width: 0;
  border-bottom: 2px solid black;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: translateY(4px);
  transition: .3s;
}
.right span:hover::before {
  width: 100%;
}

.date {
  width: 250px;
  margin: 0 20px;
}

.charts {
  width: 100%;
  height: 300px;
}

ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}

ul li {
  height: 8%;
  display: flex;
  justify-content: space-around;
  margin-top: 13px;
}

.rIndex {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}

.middle {
  margin-right: 7rem
}
</style>
