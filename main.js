import App from './App';


import Vue from 'vue';
import './uni.promisify.adaptor';
Vue.config.productionTip = false;

import uView from '@/uni_modules/uview-ui';
Vue.use(uView);

import * as utils from '@/common/comFun/utils.js';
Vue.prototype.$utils = utils;

// 调用 store vuex 状态管理	
import store from '@/store/index.js';

App.mpType = 'app'
const app = new Vue({
	...App,
	store,
	uView,
})
app.$mount()