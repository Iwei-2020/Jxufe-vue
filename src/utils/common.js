import {Message} from "element-ui";
import Vue from 'vue'

export default {
  install (Vue,options) {
    Vue.prototype.$showMsg = (type,msg) => Message({
      type: type,
      message: msg,
      showClose: true
    })
  }
}
