import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const SignIn = () => import ("../views/SignIn")
const routes = [
  {
    path: "/",
    redirect: '/signIn'
  },
  {
    path: "/signIn",
    name: "SignIn",
    meta: {
      title: "江财附中"
    },
    component: SignIn
  }
]

const router = new VueRouter({
  routes
})

// 当一个导航触发时，全局的 before 钩子按照创建顺序调用。钩子是异步解析执行，此时导航在所有钩子 resolve 完之前一直处于等待中。
router.beforeEach((to, from, next) => {
  // 自动化修改页面标签的 title
  document.title = to.meta.title;
  next()
  // 如果已经登录，并且要去登录页，就不让TA去登录页，重定向到首页【目前有点问题】
  // if (to.path === "/signIn" && localStorage.token) {
  //   next("/notes");
  // } else {
  //   next();
  // }
});

export default router
