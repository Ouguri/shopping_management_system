<template>
  <div>
    <el-form>
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>

      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称" />
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" type="number" placeholder="价格(元)" />
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" placeholder="规格描述" rows="4" />
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item v-for="attr in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="attrValue in attr.attrValueList" :key="attrValue.id" :value="`${attr.id}:${attrValue.id}`" :label="attrValue.valueName" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelection">
          <el-table-column type="selection" prop="prop" width="80" />
          <el-table-column prop="prop" label="图片" width="width">
            <template v-slot="{row}">
              <img :src="row.imgUrl" style="width: 100px;height: 100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{row}">
              <el-button v-if="row.isDefault === 0" type="primary" size="mini" @click="beDefault(row)">设为默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
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
      spuImageList: [], // 存储图片信息
      spuSaleAttrList: [], // 存储销售属性
      attrInfoList: [], // 存储平台属性
      // 收集 sku 数据
      skuInfo: {
        category3Id: 0, // 父组件给
        price: 0,
        skuAttrLValueList: [
          {
            /* attrId: 0, // 平台属性的 id
            valueId: 0 // 平台属性的值的 id */
          }
        ],
        skuDefaultImg: '', // 默认图片
        skuDesc: '', // 描述
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   isDefault: '',
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        skuName: '',
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrName: '',
          //   saleAttrValueId: 0,
          //   saleAttrValueName: '',
          //   skuId: 0,
          //   spuId: 0
          // }
        ],
        weight: ''
      },
      spu: {},
      // 收集勾选图片
      imageList: []
    }
  },
  methods: {
    // 获取 skuForm 数据
    async addSkuData(category1Id, category2Id, nowSpu) {
      // 父组件传递的基本信息
      this.skuInfo.category3Id = nowSpu.category3Id
      this.skuInfo.spuId = nowSpu.id
      this.skuInfo.tmId = nowSpu.tmId
      this.spu = nowSpu
      // 请求其他数据
      const [spuImageList, spuSaleAttrList, attrInfoList] = await Promise.all([
        this.$API.spu.reqSpuImageList(nowSpu.id), // 获取图片
        this.$API.spu.reqSpuSaleAttrList(nowSpu.id), // 获取销售属性
        this.$API.spu.reqAttrInfoList(category1Id, category2Id, nowSpu.category3Id) // 获取平台属性
      ])
      if (spuImageList.code === 200) {
        const list = spuImageList.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      if (spuSaleAttrList.code === 200) this.spuSaleAttrList = spuSaleAttrList.data
      if (attrInfoList.code === 200) this.attrInfoList = attrInfoList.data
    },
    cancel() {
      this.$emit('changeScene', { scene: 0, flag: '' })
      Object.assign(this._data, this.$options.data())
    },
    // 勾选图片的回调 params 勾选图片的数据，为[]
    handleSelection(params) {
      // 需要默认值标识 isDefault
      this.imageList = params
    },
    // 设置默认图片
    beDefault(row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      // 设置默认图片地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 保存按钮
    async save() {
      // 整理平台属性
      const { attrInfoList, spuSaleAttrList, skuInfo, imageList } = this
      skuInfo.skuAttrLValueList = attrInfoList.reduce((prev, splitId) => {
        if (splitId.attrIdAndValueId) {
          const [attrId, valueId] = splitId.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      // 整理图片数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImageList: item.id
        }
      })
      // 发送请求
      const result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '添加成功' })
        this.$emit('changeScene', { scene: 0, flag: '' })
      }
    }
  }
}
</script>

<style>

</style>
