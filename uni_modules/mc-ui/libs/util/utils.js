/* 一些可能会用到的常用的方法 */
// 规则检验
import test from './test.js'

/** 千分位转化
 * @param {String | Number} price 需要转化的数组
 * @param {String | Number} 保留的小数位数，默认2
 * @return {String} 返回千分位字符串
 */
export function formatPrice(price = 0, decimalPlaces = 2) {
	// 将价格转换为字符串（如果它还不是）  
	price = String(price);

	// 分离整数部分和小数部分  
	const parts = price.split('.');
	const integerPart = parts[0];
	const decimalPart = parts[1] ? parts[1].slice(0, decimalPlaces) : '';

	// 格式化整数部分，添加千分位逗号  
	const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	// 拼接整数部分和小数部分（如果需要的话）  
	const formattedPrice = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;

	return formattedPrice;
}

/**  
 * 显示一个不带图标的消息提示框。  
 *  
 * @param {string} content - 要显示的消息内容。  
 * @param {number} [time=3000] - 消息显示的持续时间，单位为毫秒，默认为 3000 毫秒。  
 */
export function msg(content, time = 3000) {
	// 参数验证  
	if (typeof content !== 'string' || typeof time !== 'number' || time <= 0) {
		console.error('Invalid parameters for msg function.');
		return;
	}

	try {
		// 显示消息提示框  
		uni.showToast({
			icon: 'none',
			title: content,
			duration: time
		});
	} catch (error) {
		// 错误处理  
		console.error('An error occurred while showing the toast:', error);
	}
}


/**showLoading 显示加载动画
 * 需要搭配 uni.hideLoading(); 使用
 * @param {string} [content="加载数据中..."] ${1} 加载动画的文字
 * @param {boolean} [mask=true] ${2} 是否显示透明蒙层，防止触摸穿透，默认：false
 */
export function showLoading(content = "加载数据中...", mask = true) {
	uni.showLoading({
		title: content,
		mask: mask
	});
}

/**hideLoading 关闭加载动画
 * @param {number} [timer=0] ${1} 关机加载动画时长
 */
export function hideLoading(timer = 0) {
	if (timer > 0) {
		var t = setTimeout(function() {
			uni.hideLoading();
			clearTimeout(t);
		}, timer);
	} else {
		uni.hideLoading();
	}
}


let lastCallCom = 0;
/** 节流函数
 * @param {Object} fn  自定义方法
 * @param {Object} delay 节流时长
 */
export function throttle(fn, delay = 3000) {
	return function(...args) {
		const now = new Date().getTime();
		if (now - lastCallCom < delay) {
			return;
		}
		lastCallCom = now;
		fn.apply(this, args);
	};
}



/**  
 * 创建一个节流后的复制函数  
 * @param {string} textToCopy 复制到剪切板的内容  
 * @param {number} delay 节流时间间隔，默认为3000毫秒  
 * @returns {Function} 返回一个可以调用的函数，用于执行节流后的复制操作  
 */
export function TextCopyFun(textToCopy, delay = 3000) {
	if (isEmpty(textToCopy)) {
		return
	}


	// 创建节流后的复制函数  
	const throttledCopyText = throttle(function() {
		// 设置系统剪贴板的内容  
		uni.setClipboardData({
			data: textToCopy,
			success: () => {
				uni.showToast({
					title: '已复制',
					icon: 'success',
					duration: 2000
				});
			},
			fail: (err) => {
				uni.showToast({
					title: '复制失败',
					icon: 'none',
					duration: 2000
				});
			}
		});
	}, delay);

	// 返回节流后的函数  
	throttledCopyText();
}


export function isDataType(data, type) {
	return Object.prototype.toString.call(data) === '[object ' + type + ']';
}

/**  
 * ltrim - 去除字符串左侧的指定字符  
 *  
 * @param str 要处理的字符串  
 * @param char 要从左侧去除的字符  
 * @returns 返回去除指定字符后的新字符串  
 *  
 * 注意事项：  
 * - 如果 char 不在 str 中，将返回整个 str  
 * - 如果 char 在 str 的开始位置出现，将返回从第一个非 char 字符开始到结尾的子字符串  
 * - 此函数不会处理 str 中多个连续的 char，只会处理第一个出现的 char  
 */
export function ltrim(str, char) {
	let pos = str.indexOf(char);
	let sonstr = str.substr(pos + 1);
	return sonstr;
}

/**  
 * rtrim - 从字符串右侧（末尾）去除指定的字符。  
 *  
 * @param str 要处理的字符串。  
 * @param char 要从右侧去除的字符。  
 * @returns 返回去除指定字符后的新字符串。如果字符不在字符串中，则返回原字符串。  
 */
export function rtrim(str, char) {
	let pos = str.lastIndexOf(char);

	// 如果char不在str中，或者char不是str的最后一个字符，则返回原字符串  
	if (pos === -1 || str.charAt(pos) !== char) {
		return str;
	}

	// 如果char是str的最后一个字符或多个连续字符的最后一个，则返回去除它们的子字符串  
	return str.substr(0, pos);
}

/**
 * 保留当前页面，跳转到应用内的某个页面，使用uni.navigateBack可以返回到原页面。
 */
export function navigateTo(url, params) {
	uni.navigateTo({
		url: parseUrl(url, params)
	})
}

/**
 * 关闭当前页面，跳转到应用内的某个页面。
 */
export function redirectTo(url, params) {
	uni.redirectTo({
		url: parseUrl(url, params)
	});
}

/**
 * 关闭所有页面，打开到应用内的某个页面。
 */
export function reLaunch(url, params) {
	uni.reLaunch({
		url: parseUrl(url, params)
	});
}

/**
 * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
 */
export function switchTab(url, params) {
	uni.switchTab({
		url: parseUrl(url, params)
	});
}

/**
 * 关闭当前页面，返回上一页面或多级页面
 */
export function navigateBack(delta) {
	uni.navigateBack({
		delta: delta
	});
}

/**
 * 预加载页面，是一种性能优化技术。被预载的页面，在打开时速度更快。
 */
export function preloadPage(url, params) {
	uni.preloadPage({
		url: parseUrl(url, params)
	});
}

export function prePage() {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

/**
 * rpx转px
 * @param int|float num
 */
export function rpx2px(num) {
	// const info = uni.getSystemInfoSync()
	// let scale = 750 / info.windowWidth;
	// return (Number.isNaN(parseFloat(num)) ? 0 : parseFloat(num)) / scale;
	return uni.upx2px(num);
}

/**
 * @param int|float num
 */
export function px2rpx(num) {
	return num / (uni.upx2px(num) / num);
}

/**
 * 获取窗口的宽高
 */
export function getSystemInfo() {
	const info = uni.getSystemInfoSync();
	return {
		w: info.windowWidth,
		h: info.windowHeight
	};
}


/** 处理底部距离
 */
export function disposeSafeBottomFun() {
	if (uni.getStorageSync('safeAreaBottom') > 0) {
		// 需要添加安全高度
		return 'padding-bottom:' + (Number(uni.getStorageSync('safeAreaBottom')) + 10) + 'rpx;'
	}

}


/**
 * 阿里巴巴图标 UniCode转换
 */
export function toUniCode(str) {
	if (/^\\u/.test(str)) {
		return JSON.parse('"' + str.replace(/\\u/g, '\\u') + '"');
	} else if (/^&#x/.test(str)) {
		var match = str.match(/^&#x([0-9a-fA-F]+);$/);
		if (match) {
			var codePoint = parseInt(match[1], 16);
			return String.fromCodePoint(codePoint);
		}
		return str;
	} else {
		return str;
	}
}

/**
 * 获取指定范围日期时间
 * @param {Number} n 指定天数 （例： n=1 一天后 ； n=-1 一天前）
 * @return {String} 返回年月日格式数据
 */
export function getDateAfterNDays(n) {
	// 获取当前日期  
	const now = new Date();

	// 创建一个新的Date对象，表示n天后的日期  
	// 时间戳是以毫秒为单位的，所以我们需要将天数转换为毫秒（1天 = 24小时 * 60分钟 * 60秒 * 1000毫秒）  
	const futureDate = new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

	// 返回格式化后的日期字符串（可选）  
	// 这里使用了简单的格式化，你可以根据需要调整  
	const formattedDate = futureDate.toISOString().split('T')[0];

	return formattedDate;
}

/**
 * 功能：路由解析并且拼接
 * 使用：parseUrl('home', {id:1,type: 'add'})
 * 得到：'/pages/home?id=1&type=add'
 */
function parseUrl(url, params) {
	let arr = [];
	let string = '';
	for (let i in params) {
		arr.push(i + "=" + params[i]);
	}

	string = "/pages/" + url;
	if (arr.length > 0) {
		string += "?" + arr.join("&");
	}

	return string;
}


/**
 * @description 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
 * @param {string|number} value 需要添加单位的值
 * @param {string} unit 添加的单位名 比如px
 */
export function addUnit(value = 'auto', unit = uni?.$u?.config?.unit ?? 'px') {
	value = String(value)
	// 用uView内置验证规则中的number判断是否为数值
	return test.number(value) ? `${value}${unit}` : value
}

/**
 * @description 深度克隆
 * @param {object} obj 需要深度克隆的对象
 * @param cache 缓存
 * @returns {*} 克隆后的对象或者原值（不是对象）
 */
export function deepClone(obj, cache = new WeakMap()) {
	if (obj === null || typeof obj !== 'object') return obj;
	if (cache.has(obj)) return cache.get(obj);
	let clone;
	if (obj instanceof Date) {
		clone = new Date(obj.getTime());
	} else if (obj instanceof RegExp) {
		clone = new RegExp(obj);
	} else if (obj instanceof Map) {
		clone = new Map(Array.from(obj, ([key, value]) => [key, deepClone(value, cache)]));
	} else if (obj instanceof Set) {
		clone = new Set(Array.from(obj, value => deepClone(value, cache)));
	} else if (Array.isArray(obj)) {
		clone = obj.map(value => deepClone(value, cache));
	} else if (Object.prototype.toString.call(obj) === '[object Object]') {
		clone = Object.create(Object.getPrototypeOf(obj));
		cache.set(obj, clone);
		for (const [key, value] of Object.entries(obj)) {
			clone[key] = deepClone(value, cache);
		}
	} else {
		clone = Object.assign({}, obj);
	}
	cache.set(obj, clone);
	return clone;
}

/**
 * @description JS对象深度合并
 * @param {object} target 需要拷贝的对象
 * @param {object} source 拷贝的来源对象
 * @returns {object|boolean} 深度合并后的对象或者false（入参有不是对象）
 */
export function deepMerge(target = {}, source = {}) {
	target = deepClone(target)
	if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) return target;
	const merged = Array.isArray(target) ? target.slice() : Object.assign({}, target);
	for (const prop in source) {
		if (!source.hasOwnProperty(prop)) continue;
		const sourceValue = source[prop];
		const targetValue = merged[prop];
		if (sourceValue instanceof Date) {
			merged[prop] = new Date(sourceValue);
		} else if (sourceValue instanceof RegExp) {
			merged[prop] = new RegExp(sourceValue);
		} else if (sourceValue instanceof Map) {
			merged[prop] = new Map(sourceValue);
		} else if (sourceValue instanceof Set) {
			merged[prop] = new Set(sourceValue);
		} else if (typeof sourceValue === 'object' && sourceValue !== null) {
			merged[prop] = deepMerge(targetValue, sourceValue);
		} else {
			merged[prop] = sourceValue;
		}
	}
	return merged;
}

/**
* @description 获取父组件的参数，因为支付宝小程序不支持provide/inject的写法
   this.$parent在非H5中，可以准确获取到父组件，但是在H5中，需要多次this.$parent.$parent.xxx
   这里默认值等于undefined有它的含义，因为最顶层元素(组件)的$parent就是undefined，意味着不传name
   值(默认为undefined)，就是查找最顶层的$parent
*  @param {string|undefined} name 父组件的参数名
*/
export function $parent(name = undefined) {
	let parent = this.$parent
	// 通过while历遍，这里主要是为了H5需要多层解析的问题
	while (parent) {
		// 父组件
		if (parent.$options && parent.$options.name !== name) {
			// 如果组件的name不相等，继续上一级寻找
			parent = parent.$parent
		} else {
			return parent
		}
	}
	return false
}


/**
 * @description 判断开始时间是否大于结束时间
 * @param {String} startDateStr 开始时间
 * @param {String} endDateStr 	结束时间
 * @returns {Boolean} 	返回是否大于
 */
export function isValidDateRange(startDateStr, endDateStr) {
	// 使用 Date.parse() 尝试解析日期字符串  
	// 注意：Date.parse() 对于非标准格式的日期字符串可能不会正确工作  
	// 但对于 "YYYY-MM-DD" 格式，它通常可以正常工作  
	const startDate = new Date(startDateStr);
	const endDate = new Date(endDateStr);

	// 检查两个日期是否都是有效的  
	if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
		return false; // 至少有一个日期是无效的  
	}

	// 检查开始时间是否不大于结束时间  
	return startDate.getTime() <= endDate.getTime();
}


/** 比较版本号 
 * 返回值： 0 高于服务器版本； 1 与服务器版本一致； 2 低于服务器版本；
 * @param {String} OldV 从服务器获取的版本号 
 * @param {String} NewV 从本机获取的版本号 
 */
export function versionFn(NewV, OldV) {
	var curV = NewV,
		reqV = OldV,
		curArr = curV.split('.'),
		reqArr = reqV.split('.'),
		maxL = Math.max(curArr.length, reqArr.length),
		index = 0,
		diff = 0;

	if (reqArr.length != maxL) {
		reqArr.push("0");
	}

	while (index < maxL) {
		diff = parseInt(curArr[index]) > parseInt(reqArr[index]) ? 1 : (parseInt(curArr[index]) ==
			parseInt(
				reqArr[index]) ? 0 : -1);
		if (diff != 0) {
			break;
		}
		index++;
	}

	if (diff > 0) {
		return 2
	} else if (diff == 0) {
		return 1
	} else {
		return 0
	}
}

/**
 * 判断传入的值受否为空
 * @param  {string}  value  传入的值
 * @return {object} 返回布尔值 true | false
 */
export function isEmpty(value) {
	if (typeof value === 'undefined' || value === null) {
		return true;
	}

	if (typeof value === 'string' && value.trim() === '') {
		return true;
	}

	if (Array.isArray(value) && value.length === 0) {
		return true;
	}

	if (typeof value === 'object' && Object.keys(value).length === 0) {
		return true;
	}

	return false;
}


/**
 * @param {String} date 传入时间
 * @param {Object} fmt  需要的格式（如：'Y-MM-dd hh:mm:ss'）
 * @return {String} 返回对应格式数据
 */
export function dateFormat(date, fmt) {
	date = new Date(date)

	var a = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
	var o = {
		'Y': date.getFullYear(),
		'M+': date.getMonth() + 1, // 月份
		'd+': date.getDate(), // 日
		'h+': date.getHours(), // 小时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		'S': date.getMilliseconds(), // 毫秒
		'w': date.getDay(), // 周
		'W': a[date.getDay()], // 大写周
		'T': 'T'
	}
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	for (var k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[
				k]).length)))
		}
	}
	return fmt
}