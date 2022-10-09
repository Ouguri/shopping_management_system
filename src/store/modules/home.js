// import mockRequest from '@/utils/mockRequest.js'
import datas from '../../../mock/data.json'

const state = {
  list: {}
}
const mutations = {
  GETDATA(state, list) {
    state.list = list
  }
}
const actions = {
  // 发请求获取首页模拟数据
  async getData({ commit }) {
    // const result = await mockRequest.get('/line')
    const result = datas
    // if (result.code === 20000) commit('GETDATA', result.data)
    commit('GETDATA', result)
  }
}
const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}
