<template>
  <div>
    <!-- label-width="80px" label="SPU名称"之类的长度统一成80px -->
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <!-- :value="tm.id" 需要收集 id 到 spu.tmId 给服务器 -->
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="tm in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="SPU描述" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- file-list="" 照片墙展示的规定数组 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <!-- 数据传递： :value="unSelect.id" 到 v-model="attrId" 到 data 里面的 attrId -->
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}项属性可选择`">
          <el-option v-for="unSelect in unSelectSaleAttr" :key="unSelect.id" :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}`" />
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示当前 spu 的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" align="center" label="序号" width="80" />
          <el-table-column prop="saleAttrName" label="属性名" width="width" />
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template v-slot="{row}">
              <el-tag v-for="(tag, index) in row.spuSaleAttrValueList" :key="tag.id" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm(row)"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ 添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <!-- 保存或添加 spu 的 button -->
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储spu信息属性
      spu: {
        category3Id: 0,
        description: '',
        spuName: '',
        tmId: '', // 品牌 id
        // 照片墙
        spuImageList: [
          {
            id: 0,
            imgName: '',
            imgUrl: '',
            spuId: 0
          }
        ],
        // 平台属性
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: '',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: '',
          //       saleAttrValueName: '',
          //       spuId: 0
          //     }
          //   ]
          // }
        ]
      },
      tradeMarkList: [], // 存储品牌信息
      spuImageList: [], // 照片墙图片信息
      saleAttrList: [], // 项目的全部销售属性
      inputVisible: false,
      inputValue: '',
      attrIdAndAttrName: '' // 收集未选择的销售属性的 id 与 name
    }
  },
  computed: {
    // 计算还未选择的销售属性
    unSelectSaleAttr() {
      // 共 颜色 尺寸 版本 三个属性 -- saleAttrList
      // 当前选择了的销售属性 -- spu.spuSaleAttrList
      return this.saleAttrList
        .filter(item => this.spu.spuSaleAttrList
          .every(item1 => item.name !== item1.saleAttrName))
    }
  },
  methods: {
    // 删除/移除图片后的回调 | file：删除的图片 {}，fileList：图片墙所有图片 []
    handleRemove(file, fileList) {
      console.log(file, fileList)
      // 收集照片墙图片数据
      this.spuImageList = fileList
      console.log(this.spuImageList)
    },
    // 图片墙的预览 🔍 按钮  file：图片 url
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true // el-dialog 展示
    },
    // 新增图片成功的回调 response：服务器返回信息，file：新增的图片 {}，fileList：图片墙所有图片 []
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList
    },
    // 初始化 spuForm 数据
    async initSpuData(spu) {
      const result = await Promise.all([
        this.$API.spu.reqSpu(spu.id), // 获取 spu 信息数据
        this.$API.spu.reqTrademarkList(), // 获取品牌信息
        this.$API.spu.reqImageList(spu.id), // 获取图片信息
        this.$API.spu.reqBaseSaleAttrList() // 获取品牌信息
      ])
      const [spuResult, tradeMarkResult, imageResult, saleAttrListResult] = result
      if (spuResult.code === 200) this.spu = spuResult.data
      if (tradeMarkResult.code === 200) this.tradeMarkList = tradeMarkResult.data
      if (imageResult.code === 200) {
        const listArr = imageResult.data
        // 需要匹配 elementUI 的照片墙显示数据格式
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = listArr
      }
      if (saleAttrListResult.code === 200) this.saleAttrList = saleAttrListResult.data
    },
    // 添加 spu 初始化数据
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id
      const result = await Promise.all([
        this.$API.spu.reqTrademarkList(), // 获取品牌信息
        this.$API.spu.reqBaseSaleAttrList() // 获取品牌信息
      ])
      const [tradeMarkResult, saleAttrListResult] = result
      if (tradeMarkResult.code === 200) this.tradeMarkList = tradeMarkResult.data
      if (saleAttrListResult.code === 200) this.saleAttrList = saleAttrListResult.data
    },
    // ----------- tag标签 -----------
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    // 添加按钮回调 +添加 button
    showInput(row) {
      /* 以下新增属性，在 spuSaleAttrList 中 */
      // 设立展示 input 的变量并展示 input
      this.$set(row, 'inputVisible', true)
      // 设立准备收集新增的销售属性的变量
      this.$set(row, 'inputValue', '')
    },
    // 添加新的销售属性并失去焦点后
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row
      const ifSame = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === inputValue)
      if (inputValue.trim() === '') return this.$message('属性值不能为空！')
      if (ifSame) return this.$message('属性值不能重复！')
      row.inputVisible = false
      row.spuSaleAttrValueList.push({ baseSaleAttrId, saleAttrValueName: inputValue })
    },
    // 添加新的销售属性 button 回调
    addSaleAttr() {
      // 整理 attrIdAndAttrName 并存至 spu, 以下名字为服务器指定名
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrIdAndAttrName = ''
    },
    // 保存按钮
    async addOrUpdateSpu() {
      try {
        // 整理参数
        this.spu.spuImageList = this.spuImageList.map(item => {
          return {
            imageName: item.name,
            imageUrl: item?.response?.data ?? item.url // 添加用服务器返回数据
          }
        })
        const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
        if (result.code !== 200) throw new Error('请求错误！')
        if (result.code === 200) {
          this.$message({ type: 'success', message: '保存成功' })
          this.$emit('changeScene', { scene: 0, flag: this.spu.id ? 'update' : 'add' })
        }
        Object.assign(this._data, this.$options.data())
      } catch (err) {
        console.log(err)
      }
    },
    // 取消按钮
    cancel() {
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 清理数据的方法，合并对象
      // this._data：本页面响应式数据, options：配置对象，this.$options.data()：配置对象的 data 函数
      Object.assign(this._data, this.$options.data())
    }
  }
}

</script>

<style>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
