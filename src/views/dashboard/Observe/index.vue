<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12" :offset="0">
        <SearchData />
      </el-col>

      <el-col :span="12" :offset="0">
        <Category />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SearchData from './SearchData/index.vue'
import Category from './Category/index.vue'
export default {
  name: '',
  components: {
    SearchData,
    Category
  }
}
</script>

<style>

</style>
