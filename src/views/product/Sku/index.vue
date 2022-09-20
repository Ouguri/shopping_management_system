<template>
  <div>
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" align="center" label="序号" width="80" />
      <el-table-column prop="skuName" label="名称" width="width" />
      <el-table-column prop="weight" label="描述" width="width" />
      <el-table-column label="默认图片" width="110">
        <template v-slot="{row}">
          <img :src="row.skuDefaultImg" alt="" style="width: 80px;height: 80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80" />
      <el-table-column prop="price" label="价格" width="80" />
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{row}">
          <el-button v-if="row.isSale===0" type="success" icon="el-icon-sort-down" size="mini" title="下架" @click="cancel(row)" />
          <el-button v-else type="success" icon="el-icon-sort-up" size="mini" title="上架" @click="sale(row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改sku" @click="edit(row)" />
          <el-button type="info" icon="el-icon-info" size="mini" title="查看详情" @click="getSkuInfo(row)" />
          <el-popconfirm
            title="这是一段内容确定删除吗？"
            @onConfirm="deleteSpu(row)"
          >
            <HintButton slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu" />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- @current-change="renderList" -->
    <!-- @size-change="handleSizeChange" -->
    <el-pagination
      style="textAlign:center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="renderList"
      @size-change="handleSizeChange"
    />

    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }} 元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" type="success" style="margin-right:5px">{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1,
      limit: 10, // 当前页面展示多少条数据
      records: [], // 存储sku 列表数据
      total: 0, // 总共页数
      skuInfo: {}, // 存储 sku 信息
      show: false
    }
  },
  mounted() {
    // 获取 sku 列表
    this.renderList()
  },
  methods: {
    // 超时函数
    timeout(s) {
      return new Promise(function(_, reject) {
        setTimeout(function() {
          reject(new Error(`Request took too long! Timeout after ${s} second`))
        }, s * 1000)
      })
    },
    async renderList(pages = 1) {
      this.page = pages
      const { page, limit } = this
      const result = await Promise.race([
        this.$API.sku.reqSkuList(page, limit),
        this.timeout(5)
      ])
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit
      this.renderList()
    },
    // sku 上架
    async sale(row) {
      try {
        const result = await this.$API.sku.reqSale(row.id)
        if (result.code === 200) {
          row.isSale = 0
          this.$message({ type: 'success', message: '上架成功' })
        }
      } catch (err) {
        this.$message({ type: 'error', message: `${err.message}，系统数据无法操作！` })
      }
    },
    // 下架
    async cancel(row) {
      const result = await this.$API.sku.reqCancel(row.id)
      if (result.code === 200) {
        row.isSale = 1
        this.$message({ type: 'success', message: '下架成功' })
      }
    },
    edit() {
      this.$message({ type: 'info', message: '正在开发中' })
    },
    // 获取 sku 详情
    async getSkuInfo(sku) {
      // 展示抽屉
      this.show = true
      const result = await this.$API.sku.reqSkuById(sku.id)
      if (result.code === 200) {
        this.skuInfo = result.data
      }
    }
  }
}
</script>

<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

  >>>.el-carousel__button {
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
  }

  .el-row .el-col-5 {
    font-size: 18px;
    text-align: right;
    font-weight: 600;
  }
  .el-col {
    margin: 10px 10px;
  }
</style>
