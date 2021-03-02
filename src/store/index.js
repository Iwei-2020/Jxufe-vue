import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isCollapse: false,
    chartTheme: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3", "#e5cf0d", "#97b552", "#95706d", "#dc69aa", "#07a2a4", "#9a7fd1", "#588dd5", "#f5994e", "#c05050", "#59678c", "#c9ab00", "#7eb00a", "#6f5553", "#c14089"],
    user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : '',
    token: localStorage.getItem("token") || '',
    menu: localStorage.getItem("menu") ? JSON.parse(localStorage.getItem("menu")) : []
  },
  mutations: {
    toggleSideBar(state) {
      state.isCollapse = !state.isCollapse
    },
    setChartTheme(state, arr) {
      state.chartTheme = arr
    },
    initUser(state,user) {
      state.user = user
      console.log(user)
      sessionStorage.setItem("user",JSON.stringify(user))
    },
    initToken(state,token) {
      state.token = token
      localStorage.setItem("token",token)
    },
    remove: state => {
      state.user = ''
      state.token = ''
      sessionStorage.setItem("user",null)
      localStorage.setItem("token",null)
    },
    modifyUser: (state, data) => {
      state.user[data.changePro] = data.proValue
    },
    initMenu: (state, data) => {
      state.menu = data
      localStorage.setItem("menu",JSON.stringify(data))
    }
  }
})
