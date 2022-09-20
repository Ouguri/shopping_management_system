// 三级联动列表 平台属性管理接口请求文件
import request from '@/utils/request.js'

// 获取一级分类数据接口 admin/product/getcategory1 get
export const reqCategory1List = () => request({ url: `/admin/product/getCategory1`, method: 'get' })

// 获取二级分类数据接口 admin/product/getcategory2/{category1Id} get
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })

// 三级分类数据接口 admin/product/getcategory3/{category2Id} get
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

// 渲染页面 /admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}
export const renderList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加属性与属性值 /admin/product/saveAttrInfo post
export const reqAddOrUpdateAttr = (data) => request({ url: `/admin/product/saveAttrInfo`, method: 'post', data: data })
/*
  参数：
  "attrName": "string" 属性名
  "attrValueList": [
    {
      属性名对应的属性值
      "attrId": 0, 属性的 id
      "id": 0,
      "valueName": "string" 属性值
    }
  ],
  "categoryId": 0, category3Id
  "categoryLevel": 3
  "id": 服务器生成
*/

