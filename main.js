
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

// 引入全局uView
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

//引入全局的cl
import ClUni from "cl-uni";

Vue.use(ClUni, {
	// 进入业务单页时，页面栈只有一个，自定义导航左侧返回按钮跳转的路径
	homePage: "/"
});

// 引入请求封装
require('./utils/request/index')(app)

App.mpType = 'app'

//导入页面跳转函数
import { goBack } from '@/utils/common.js' //公共方法
Object.assign(Vue.prototype, {
	'$goBack':goBack,
})


const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif