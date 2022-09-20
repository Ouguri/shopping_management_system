<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格：展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="attrName" label="属性名称" width="150" />
          <el-table-column label="属性值列表">
            <!-- row 就是数组中的每一个元素 -->
            <template v-slot="{row}">
              <el-tag v-for="attrValue in row.attrValueList" :key="attrValue.id" type="sucess" style="margin: 1px 10px">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="editAttr(row)" />
              <el-popconfirm :title="`确定要删除吗？`" @onConfirm="deleteAttr(row)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性/修改属性 -->
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0" border :data="attrInfo.attrValueList">
          <el-table-column align="center" label="序号" type="index" prop="prop" width="80" />
          <el-table-column label="属性值名称" prop="prop" width="width">
            <!-- row 是 attrInfo.attrValueList 数组里面的每一个元素 -->
            <template v-slot="{row, $index}">
              <el-input v-if="row.spanOrInputShow" :ref="$index" v-model.trim="row.valueName" placeholder="请输入属性值" size="mini" @blur="lookingPatten(row)" @keyup.native.enter="lookingPatten(row)" />
              <span v-else style="display:block" @click="editingPatten(row, $index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" prop="prop" width="width">
            <template v-slot="{row, $index}">
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length<1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { myMixin } from '../mixin/getCategoryId.js'
export default {
  name: 'Attr',
  // 选择列表自定义事件 getCategoryId 的回调，将子组件 CategorySelect 对应多级列表的 id 传递给该组件
  mixins: [myMixin],
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [], // 平台属性数组
      isShowTable: true, // 控制表格显示隐藏切换
      // 收集新增属性/修改属性数据
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [ // 相应属性值
          /*           {
            attrId: 0, // 相应属性名的 id
            valueName: ''
          } */
        ],
        categoryId: 0, // 三级分类 id data对象内容创建无序，所以 this.category3Id 不可取
        categoryLevel: 3 // 服务器需要区分几级 id
      }
    }
  },
  methods: {
    // 获取平台属性数据
    async renderList() {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.renderList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    // 添加属性值回调
    addAttrValue() {
      // attrId: this.attrInfo.id 规则如此，attrId 和 当前属性 id 一致
      // 数组将可以被vue检测到，成为响应式数组数据，响应式数组的普通变更和替换可被 vue 检测
      this.attrInfo.attrValueList.push({ attrId: this.attrInfo.id, valueName: '', spanOrInputShow: true })
      this.$nextTick(() => this.$refs[this.attrInfo.attrValueList.length - 1].focus())
    },
    // button(添加属性) 的回调
    addAttr() {
      this.isShowTable = false
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id, // 在此收集三级分类的id
        categoryLevel: 3
      }
    },
    // 修改属性值，修改数组应该先将原数组深拷贝一份，以便取消回档
    editAttr(data) {
      this.isShowTable = false
      this.attrInfo = cloneDeep(data)
      // this.$set(对象，'属性名', 属性值) 给对象添加响应式数据
      this.attrInfo.attrValueList.forEach(item => { this.$set(item, 'spanOrInputShow', false) })
    },
    // 添加修改数据属性的 查看模式 切换
    lookingPatten(data) {
      if (data.valueName.trim() === '') return this.$message('请输入合法的字符！')
      const isSame = this.attrInfo.attrValueList.some(same => {
        if (data !== same) return same.valueName === data.valueName
      })
      if (isSame) return
      data.spanOrInputShow = false
    },
    // 编辑模式 切换
    editingPatten(data, index) {
      data.spanOrInputShow = true
      // 获取切换的 input，自动聚焦 $nextTick 在节点渲染完毕执行一次
      this.$nextTick(() => this.$refs[index].focus())
    },
    // 气泡确认框 确定按钮
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮
    async addOrUpdateAttr() {
      try {
        // 整合提交参数
        this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
          if (item.valueName !== '') return delete item.spanOrInputShow // 过滤出 valueName 不为空的标签，并去除其 spanOrInputShow
          if (item.valueName === '') throw new Error('属性值不能为空！')
        })
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.isShowTable = true
        this.$message({ type: 'success', message: '保存成功' })
        this.renderList() // 重新渲染页面
      } catch (err) {
        this.$message({ type: 'error', message: `${err.message}` })
      }
    },
    async deleteAttr(data) {
      try {
        const deleteData = cloneDeep(data)
        deleteData.attrName = ''
        deleteData.attrValueList = []
        await this.$API.attr.reqAddOrUpdateAttr(deleteData)
        this.$message({ type: 'success', message: '删除成功' })
        this.renderList() // 重新渲染页面
      } catch (err) {
        this.$message({ type: 'error', message: '删除失败' })
      }
    }
  }
}
</script>

<style>

</style>
