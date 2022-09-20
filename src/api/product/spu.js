import request from '@/utils/request.js'

// 获取spu列表数据 /admin/product/{page}/{limit} get 参数 page limit category3Id
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id }})

// 获取spu信息 /admin/product/getSpuById/${spuid} get 参数 spuId
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取品牌相关 /admin/product/baseTrademark/getTrademarkList get
export const reqTrademarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })

// 照片墙获取 /admin/product/spuImageList/${spuId}
export const reqImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取平台所以销售属性 /baseSaleAttrList
// 销售属性即三级联动列表的三个属性
export const reqBaseSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })

// 添加 spu 带给服务器的参数

/*
  {
    category3Id: 0,
    tmId: 0,
    spuName: ''
    spuImageList: [
      {
        id: 0,
        imgName: '',
        imgUrl: ''.
        spuId: 0
      }
    ],

    spuSaleAttrList: [
      baseSaleAttrId: 0,
      id: 0,
      saleAttrName: '',
      spuId: 0
      spuSaleAttrValueList: [
        {
          baseSaleAttrId: 0,
          id: 0,
          isChecked: '',
          saleAttrValueName: '',
          spuId: 0
        }
      ]
    ]
  }
*/

// /admin/product/updateSpuInfo
// 修改以及添加 spu，修改需要携带 id
export const reqAddOrUpdateSpu = (spuInfo) => {
  // 如果有id --- 修改
  if (spuInfo.id) return request({ url: `/admin/product/updateSpuInfo`, method: 'post', data: spuInfo })
  if (!spuInfo.id) return request({ url: `/admin/product/saveSpuInfo`, method: 'post', data: spuInfo })
}

// 删除 spu
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

/* 添加 sku */
// 获取图片数据
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取销售属性列表
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

// 获取平台属性的数据
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加 sku /admin/product/saveSkuInfo post
export const reqAddSku = (skuInfo) => request({ url: `/admin/product/saveSkuInfo`, method: 'post', data: skuInfo })

// 查看 sku 详情信息 /admin/product/findBySpuId/(skuId)
export const reqSkuList = (skuId) => request({ url: `/admin/product/findBySpuId/ ${skuId}`, method: 'get' })
