<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail :title="`总销售额`" count="￥12306">
            <!-- 作用于插槽 -->
            <template slot="charts">
              <span style="font-size:14px">周同比&nbsp;&nbsp;56.67% ✌&nbsp;&nbsp;</span>
              <span style="font-size:14px">日同比&nbsp;&nbsp;19.96% ✌</span>
            </template>
            <template slot="footer">
              <span>日销售额 ￥12346</span>
            </template>
          </Detail>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <Detail :title="`访问量`" count="￥88460">
            <template slot="charts">
              <LineCharts />
            </template>
            <template slot="footer">
              <span>日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <Detail :title="`支付笔数`" count="￥88460">
            <template slot="charts">
              <Bar />
            </template>
            <template slot="footer">
              <span>转化率 64%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <Detail :title="`运营活动效果`" count="78%">
            <template slot="charts">
              <Progress-charts />
            </template>
            <template slot="footer">
              <span style="font-size:14px">周同比&nbsp;&nbsp;56.67% ✌&nbsp;&nbsp;</span>
              <span style="font-size:14px">日同比&nbsp;&nbsp;19.96% ✌</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail/index.vue'
import LineCharts from './lineChart/index.vue'
import Bar from './barChart/index.vue'
import ProgressCharts from './progressCharts/index.vue'
export default {
  name: '',
  components: {
    Detail,
    LineCharts,
    Bar,
    ProgressCharts
  }
}
</script>

<style>

</style>
