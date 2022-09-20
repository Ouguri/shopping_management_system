<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px" @click="showDialog">添加</el-button>
    <!--
      表格组件
      data: 表格组件将来需要展示的数据----数据类型
      border: 是给表格添加边框
      column属性
      label：设置标题
      width：对应列的宽度
      align: 对齐方式
      pager-count: 按钮数量，如 9 连续页码 7
      type="index" 展示序号
      prop: 对应列的字段名，内容
    -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column
        type="index"
        prop="prop"
        label="序号"
        width="80"
        align="center"
      />
      <el-table-column prop="tmName" label="品牌名称" width="width" />
      <el-table-column prop="logoUrl" label="品牌logo" width="width">
        <template v-slot="{ row }">
          <img :src="row.logoUrl" alt="" style="width:50%; height: 50%">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{ row }">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTrareMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
      :page-count 连续页面个数
      layout 分页器样式位置
      @size-change="handleSizeChange"
      @current-change="handleSizeChange"
     -->
    <el-pagination
      style="margin-top:20px; textAlign:center"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :page-count="5"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      :current-page="page"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    />

    <!--
      对话框
      :visible.sync: 控制对话框显示与隐藏
      :model="tmForm" 收集表单数据到该对象，将来表单验证需要该属性
      rules: Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
        并将 Form-Item 的 prop 属性设置为需校验的字段名即可。校验规则参见 async-validator
    -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" style="width:80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl">
          <!--
            这是上传图片插件，不是表单，不能vmodel
            action: 设置图片上传地址
            :on-success: 检测图片上传成功时会执行一次
            :before-upload: 图片上传之前执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrareMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    const validatePass = (_, value, callback) => {
      // 自定义校验规则
      if (value.length < 2 || value.length > 10) callback(new Error('品牌名称需要在2-10位以内！'))
      callback()
    }
    return {
      page: 1, // 分页器第几页
      limit: 3, // 展示数据条数
      total: 0,
      list: [],
      dialogFormVisible: false, // 对话框显示与隐藏
      tmForm: { // 收集品牌信息，属性名要与后台一致
        tmName: '',
        logoUrl: ''
      },
      // 表单验证规则
      rules: {
        // 品牌名称验证规则
        tmName: [
          // required 必须校验的字段 trigger 用户行为设置(blur失交，change状态内容改变)
          { required: true, message: '请输入品牌活动名称', trigger: 'blur' },
          { validator: validatePass, trigger: 'change' }
        ],
        // 品牌 logo 验证规则
        logoUrl: [
          { required: true, message: '请选择品牌图片' }
        ]
      }
    }
  },
  // 组件挂载完毕发请求
  mounted() {
    this.getPageList()
  },
  methods: {
    // 获取品牌列表数据  @current-change="getPageList"会把点击的页数传过来
    async getPageList(pager = 1) {
      this.page = pager
      const { page, limit } = this
      // 获取品牌列表接口
      const result = await this.$API.trademark.reqTradMarkList(page, limit)
      if (result.code === 200) {
        // 展示数据的总条数与列表展示的数据
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    handleSizeChange(limit) {
      // 整理参数
      this.limit = limit
      this.getPageList()
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res 上传成功服务器返回前端数据
      this.tmForm.logoUrl = res.data // 收集品牌图片数据
    },
    // 上传图片相关的回调 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    showDialog() {
      this.dialogFormVisible = true
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    // 添加/修改品牌 确定按钮
    addOrUpdateTrareMark() {
      // 当全部验证通过才可以继续进行逻辑
      this.$refs.ruleForm.validate(async(sucess) => {
        if (!sucess) return false
        const result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
        if (result.code === 200) {
        // 弹出信息: 添加成功或者修改成功
          this.$message(this.tmForm.id ? '修改品牌成功' : '添加品牌成功')
          // 再次获取列表渲染页面
          this.getPageList()
        }
        this.dialogFormVisible = false
      })
    },
    // 删除品牌
    async deleteTradeMark(row) {
      try {
        await this.$confirm(`确定删除${row.tmName}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const result = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if (result.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
        }
      } catch (_) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
