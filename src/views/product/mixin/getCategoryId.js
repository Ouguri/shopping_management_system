export const myMixin = {
  methods: {
    // 自定义事件回调，接受联动列表的 id
    getCategoryId({ categoryId, level }) {
      // 区分三级分类 id
      if (level === 1) {
        this.category2Id = this.category3Id = ''
        this.category1Id = categoryId
      }
      if (level === 2) {
        this.category3Id = ''
        this.category2Id = categoryId
      }
      if (level === 3) {
        this.category3Id = categoryId
        // 渲染页面，当确认三级分类后
        this.renderList()
      }
    }
  }
}
