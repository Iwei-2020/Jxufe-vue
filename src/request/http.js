import axios from 'axios'
import router from '../router'
import { Message } from 'element-ui';
import store from '../store/index';

axios.defaults.timeout = 5000
axios.defaults.headers = {}

// 构建请求对象
// const http = axios.create({
//   timeout: 1000 * 5,
//   headers: {},
// })

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        if (res.data.code === 0) {
          Message.error(res.data.description)
          reject();
        } else {
          resolve(res.data);
        }
      })
      .catch(err =>{
        reject(err.data)
      })
  });
}

// 简单的封装GET方法
export function get(url, params){
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url,
      params: params
    }).then(res => {
      if (res.data.code === 0) {
        Message.warning(res.data.msg)
        reject()
      } else {
        resolve(res.data);
      }
    }).catch(err => {
      reject(err.data)
    })
  });}

// 请求拦截器
axios.interceptors.request.use(config => {
      // 每次发送请求之前判断vuex中是否存在token
      // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
      // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
      const token = store.state.token;
      token && (config.headers.Authorization = token);
      return config;
    },
    error => {
      return Promise.error(error);
    })

// 响应拦截器
axios.interceptors.response.use(
    res => {
      // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
      // 否则的话抛出错误
      if (res.status === 200) {
        return Promise.resolve(res);
      } else {
        return Promise.reject(res);
      }
    },
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {
      if (error.response.status) {
        switch (error.response.status) {
            // 401: 未登录
            // 未登录则跳转登录页面，并携带当前页面的路径
            // 在登录成功后返回当前页面，这一步需要在登录页操作。
          case 401:
            router.replace({
              path: '/signIn',
              query: {
                redirect: router.currentRoute.fullPath
              }
            });
            break;
            // 403 token过期
            // 登录过期对用户进行提示
            // 清除本地token和清空vuex中token对象
            // 跳转登录页面
          case 403:
            this.$showMsg('warning','登录过期,请重新登录')
            // 清除token
            localStorage.removeItem('token');
            store.commit('initToken', null);
            // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
            setTimeout(() => {
              router.replace({
                path: '/signIn',
                query: {
                  redirect: router.currentRoute.fullPath
                }
              });
            }, 1000);
            break;

            // 404请求不存在
          case 404:
            this.$showMsg('error','网络请求不存在')
            break;
            // 其他错误，直接抛出错误提示
          default:
            this.$showMsg('error',error.response.data.message)
        }
        return Promise.reject(error.response);
      }
    }
);

