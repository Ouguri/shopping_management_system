<template>
  <el-card shadow="always" class="box-card" :body-style="{ padding: '20px' }">
    <div slot="header" class="header">
      <div class="search-header">
        <span>线上热门搜索</span>

        <!-- 下拉框 -->
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <LineCharts />
        </el-col>
        <el-col :span="12">
          <LineCharts />
        </el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column label="排名" width="80" type="index" />
        <el-table-column label="搜索关键字" width="180" />
        <el-table-column label="用户数" sortable />
        <el-table-column label="周涨幅" sortable />
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        layout="next, pager, prev"
        :total="1000"
        class="pagination"
      />
    </div>
  </el-card>

</template>

<script>
import LineCharts from './lineCharts/index.vue'
export default {
  name: '',
  components: {
    LineCharts
  },
  data() {
    return {
      tableData: []
    }
  }
}
</script>

<style scoped>
.header {
  border-bottom: 2px solid #eee;
  padding: 0 0 19px 0;
}

.search-header {
  display: flex;
  justify-content: space-between;
  margin-top: 13px;
}

.pagination {
  display: flex;
  flex-direction: row-reverse;
  margin-top: 15px;
}
</style>
