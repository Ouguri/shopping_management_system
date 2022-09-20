// 品牌管理
import request from '@/utils/request.js'
// 获取品牌列表接口
// /admin/product/baseTrademark/{page} 页数/{limit} 数据展示条数
export const reqTradMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 处理添加品牌 /admin/product/baseTrademark/save
// 修改品牌的操作 /admin/product/baseTrademark/update put请求
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  // 带给服务器携带id --- 修改
  if (tradeMark.id) {
    return request({ url: `/admin/product/baseTrademark/update`, method: 'put', data: tradeMark })
  } else {
    return request({ url: `/admin/product/baseTrademark/save`, method: 'post', data: tradeMark })
  }
}

// 删除品牌
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
