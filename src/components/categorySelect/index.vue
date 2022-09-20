<template>
  <div>
    <!--
      inline: 代表行内表单，即一行上放置多个表单元素
     -->
    <!-- :model="listFrom" 将表单数据收集到 listFrom 这个对象上 -->
    <el-form :inline="true" class="demo-form-inline" :model="listFrom">
      <el-form-item label="一级分类">
        <el-select v-model="listFrom.category1Id" placeholder="请选择" :disabled="show" @change="openList2">
          <!-- v-model 收集到的是 value -->
          <el-option v-for="c1 in list1" :key="c1.id" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="listFrom.category2Id" placeholder="请选择" :disabled="show" @change="openList3">
          <el-option v-for="c2 in list2" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="listFrom.category3Id" placeholder="请选择" :disabled="show" @change="handler3">
          <el-option v-for="c3 in list3" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: {
    show: Boolean
  },
  data() {
    return {
      list1: [], // 一级分类数据
      list2: [],
      list3: [],
      listFrom: {
        // 收集一二三级分类的 id
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  // 当组件挂载完毕，获取一级分类数据
  mounted() {
    // 获取一级分类数据
    this.getCategory1List()
  },
  methods: {
    async getCategory1List() {
      const result = await this.$API.attr.reqCategory1List()
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    // 一级分类的select选择事件回调，选择了一级后开启选择二级数权限
    async openList2() {
      // 清除数据
      this.list2 = this.list3 = []
      this.listFrom.category2Id = this.listFrom.category3Id = ''
      const { category1Id } = this.listFrom
      // 传 id 给父组件，自定义事件
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      // 通过一级分类的 id 获取二级分类的数据
      const result = await this.$API.attr.reqCategory2List(category1Id)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },
    async openList3() {
      // 清除数据列表和 id 重新获取新的列表和 id
      this.list3 = []
      this.listFrom.category3Id = ''
      const { category2Id } = this.listFrom
      // 传 id 给父组件，自定义事件
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      // 通过一级分类的 id 获取二级分类的数据
      const result = await this.$API.attr.reqCategory3List(category2Id)
      if (result.code === 200) {
        this.list3 = result.data
      }
    },
    handler3() {
      const { category3Id } = this.listFrom
      // 传 id 给父组件，自定义事件
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style>

</style>
