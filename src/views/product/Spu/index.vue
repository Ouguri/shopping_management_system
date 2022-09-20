<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect :show="scene !== 0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="scene===0">
        <!-- 展示 spu 列表的结构 -->
        <el-button type="primary" icon="el-icons-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" align="center" label="序号" width="80" />
          <el-table-column prop="spuName" label="SPU名称" width="width" />
          <el-table-column prop="description" label="SPU描述" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{row}">
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)" />
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改sku" @click.native="updateSpu(row)" />
              <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前类的所有实例" @click="handler(row)" />
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
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
      </div>
      <SpuForm v-show="scene===1" ref="spu" @changeScene="changeScene" />
      <SkuFrom v-show="scene===2" ref="sku" @changeScene="changeScene" />
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table v-loading="loading" :data="skuList" style="width: 100%" border>
        <el-table-column prop="skuName" label="名称" width="width" />
        <el-table-column prop="price" label="价格" width="width" />
        <el-table-column prop="weight" label="重量" width="width" />
        <el-table-column label="默认图片" width="width">
          <template v-slot="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { myMixin } from '../mixin/getCategoryId.js'
import SpuForm from './spuForm/index.vue'
import SkuFrom from './skuForm/index.vue'
export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuFrom
  },
  // 选择列表自定义事件 getCategoryId 的回调，将子组件 CategorySelect 对应多级列表的 id 传递给该组件
  mixins: [myMixin],
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1, // 当前第几页
      limit: 3, // 每一页展示多少条数据
      records: [], // SPU 列表的数据
      total: 0, // 总页数
      scene: 0, // 0 代表展示 spu 列表 1 添加修改 spu 2 添加sku
      dialogTableVisible: false, // sku 详情的隐藏
      spu: {},
      skuList: [], // 存储 sku 列表数据
      loading: true
    }
  },
  methods: {
    // 页面数据的渲染函数（包含分页器重新渲染）
    async renderList(pages = 1) {
      this.page = pages
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 更换分页展示页数
    handleSizeChange(limit) {
      this.limit = limit
      this.renderList()
    },
    // 添加 spu Button 回调
    addSpu() {
      this.scene = 1
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改 spu Button 回调
    updateSpu(row) {
      this.scene = 1
      // 获取子组件 spuForm 并调用子组件方法
      this.$refs.spu.initSpuData(row)
    },
    // 自定义事件 spuFrom
    changeScene({ scene, flag }) {
      this.scene = scene
      if (flag === 'update') this.renderList(this.page)
      if (flag === 'add') this.renderList()
    },
    // 删除 spu 删除按钮
    async deleteSpu(row) {
      try {
        const result = await this.$API.spu.reqDeleteSpu(row.id)
        if (result.code !== 200) throw new Error('删除失败')
        if (result.code === 200) {
          this.$message({ type: 'success', message: '删除成功' })
          this.renderList(this.records.length > 1 ? this.page : this.page - 1)
        }
      } catch (err) {
        this.$message({ type: 'error', message: `${err}` })
      }
    },
    // 添加 sku 的按钮
    addSku(row) {
      this.scene = 2
      // 调用 skuForm 的方法
      this.$refs.sku.addSkuData(this.category1Id, this.category2Id, row)
    },
    // 查看 sku 按钮的回调
    async handler(row) {
      this.dialogTableVisible = true
      // 保存 spu 信息
      this.spu = row
      const result = await this.$API.spu.reqSkuList(row.id)
      if (result.code === 200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    // 关闭模态框回调
    close(done) {
      // 毫无必要，可以在 handler 一开始写
      this.skuList = []
      this.loading = true
      done()
    }
  }
}
</script>

<style>

</style>
