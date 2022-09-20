// 将四个模块请求的接口函数统一暴露
import * as trademark from './product/tradeMark.js'
import * as attr from './product/attr.js'
import * as spu from './product/spu.js'
import * as sku from './product/sku.js'

// 引入权限相关的接口文件
import * as user from './acl/user' // 用户登录
import role from './acl/role.js' // 用户管理
import permission from './acl/permission.js' // 菜单

// 对外暴露
export default {
  trademark,
  attr,
  sku,
  spu,
  user,
  role,
  permission
}
