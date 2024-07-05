import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {},
	mutations: {
		/** 修改state 数据_测试
		 * 	payload.Name1 - state层级属性数据 如 user.info.score
		 * 	payload.data  - 赋值内容
		 *  payload.StorageName  - 缓存名称，有缓存时会开启缓存
		 *  payload.StorageData  - 缓存内容，已处理成JSON格式
		 * 	@param {object} payload  这是一个对象，包含属性名，赋值内容，缓存名、缓存内容
		 */
		ChangeAndSetStateData(state, payload) {
			// 解构出要修改的属性名
			const {
				Name1,
				data,
				StorageName,
				StorageData,
			} = payload;

			// 如果属性名存在多级，可以使用动态属性名来修改对应的值
			const levels = Name1.split('.');
			let currentState = state;
			for (let i = 0; i < levels.length - 1; i++) {
				currentState = currentState[levels[i]];
			}
			currentState[levels[levels.length - 1]] = data;

			// 根据StorageName参数来决定是否记录缓存
			if (StorageName) {
				uni.setStorageSync(StorageName, StorageData);
			}
		}
	},
	actions: {},
	getters: {},
	modules: { // 可以添加更多的模块
	}
})

export default store