import utils from './libs/util/utils.js';

const $m = {
	utils
}

// $m挂载到uni对象上
uni.$m = $m;

// const install = (Vue) => {
// 	// 时间格式化，同时两个名称，date和timeFormat
// 	Vue.filter('timeFormat', (timestamp, format) => uni.$m.dateFormat(timestamp, format))

// 	// #ifndef APP-NVUE
// 	// 只有vue，挂载到Vue.prototype才有意义，因为nvue中全局Vue.prototype和Vue.mixin是无效的
// 	Vue.prototype.$m = $m;
// 	// #endif
// }

// export default {
// 	install
// }