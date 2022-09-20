import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, anyRoutes, asyncRoutes, constantRoutes } from '@/router' // 重置路由的方法
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    // 用户头像
    avatar: '',
    // 服务器返回的菜单信息[根据不同角色返回的标记信息]
    routes: [],
    // 角色信息
    button: [],
    // 按钮权限的信息
    roles: [],
    // 对比之后[项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的路由]
    resultAsyncRoutes: [],
    // 用户最终展示的全部路由
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储 token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    // 存储剩下菜单信息
    state.routes = userInfo.routes
    // 存储按钮权限信息
    state.button = userInfo.buttons
    // 存储用户角色(职能)信息
    state.roles = userInfo.roles
  },
  // 最终计算出来的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    // 保存当前用户的异步路由，而用户需要展示完整路由：常量、异步、任意路由
    state.resultAsyncRoutes = asyncRoutes
    state.resultAllRoutes = [anyRoutes, ...constantRoutes, ...asyncRoutes]
    // 给路由器添加新的路由
    resetRouter()
    router.addRoutes(state.resultAllRoutes)
  }
}

// 对比服务器返回的 data.routes 和 已有的 asyncRoutes，展示需要显示的异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当前登录用户需要展示的异步路由
  return asyncRoutes.filter(item => {
    if (routes.indexOf(item.name) !== -1) {
      if (item.children && item.children.length) {
        // 递归过滤多级路由
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

const actions = {
  // user login 处理登陆业务
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 用户名 name，头像 avatar，显示菜单的标志数组 routes，用户角色信息 roles，按钮权限信息，哪些按钮该用户可用 buttons
        const { data } = response
        // 存数据至 SET_USERINFO
        commit('SET_USERINFO', data)
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

