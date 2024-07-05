// 常用 Strat
const CommonFun = {
	/** 
	 * 树型
	 * @param list      要遍历的数组
	 * @param rootVal   要比较的子ID
	 * @param PID       父级ID 属性名
	 * @param ID        子级ID 属性名
	 */
	tranList: function(list, rootVal, PID, ID) {
		var childItem = [];
		for (var i = 0; i < list.length; i++) {
			var childObj = {}
			if (list[i][PID] == rootVal) {
				childObj = list[i];
				childObj.children = CommonFun.tranList(list, list[i][ID], PID, ID);
				childItem.push(childObj);
			}
		}
		return childItem;
	},
	cellToIndex: function(cell) { // 将 A1 转换成 [0,0]
		const column = cell.charCodeAt(0) - 65; // 将列字母转换为列索引，A对应0，B对应1，以此类推
		const row = parseInt(cell.slice(1)) - 1; // 将行数字转换为行索引，减去1是因为数组索引从0开始
		return [row, column];
	},
	indexToCell: function(index) { // 将 [0,0] 转换成 A1
		const column = String.fromCharCode(65 + index[1]); // 将列索引转换为列字母，0对应A，1对应B，以此类推
		const row = index[0] + 1; // 将行索引转换为行数字，加上1是因为单元格标识从1开始
		return column + row;
	},
	/**
	 * 求百分比
	 * @param  num 		当前数
	 * @param  total 	总数
	 */
	getPercent: function(num, total) {
		num = parseFloat(num);
		total = parseFloat(total);
		if (isNaN(num) || isNaN(total)) {
			return "-";
		}
		return total <= 0 ? "0%" : Math.round((num / total) * 10000) / 100.0 + "%";
	},
	Cookie: { // 存取删 Cookie
		set: function(name, value, days) {
			var expires = "";
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = "; expires=" + date.toUTCString();
			}
			document.cookie = name + "=" + (value || "") + expires + "; path=/";
		},
		get: function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) === ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
			}
			return null;
		},
		deleteCookie: function(name) {
			document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		},
	},
	getType: function(value) { // 获取数据类型
		const match = Object.prototype.toString.call(value).match(/ (\w+)]/)
		return match[1].toLocaleLowerCase()
	},
	deepClone: function(obj) { // 深拷贝
		if (typeof obj != 'object' || typeof obj == null) {
			return obj
		}

		let result;

		if (obj instanceof Array) {
			result = []
		} else {
			result = {}
		}

		// for in 循环拿到的是键(数组是下标) for of拿到的是值
		for (let key in obj) {
			// hasOwnProperty() 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性
			// 不拷贝原型上的属性
			if (obj.hasOwnProperty(key)) {
				result[key] = CommonFun.deepClone(obj[key])
			}
		}
		return result
	},
	isURL: function(s) { // 判断是否为url地址
		return /^http[s]?:\/\/.*/.test(s)
	},
	debounce: function(handle, delay) { // 防抖
		var timer = null;
		return function() {
			var _self = this,
				_args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function() {
				handle.apply(_self, _args)
			}, delay)
		}
	},
	throttle: function(handler, wait) { // 节流
		var lastTime = 0;
		return function(e) {
			var nowTime = new Date().getTime();
			if (nowTime - lastTime > wait) {
				handler.apply(this, arguments);
				lastTime = nowTime;
			}
		}
	},
	Deduplication: function(arr, attribute) { // 去重
		/* 单条件去重
		 * arr   		遍历的数组
		 * attribute	属性
		 */
		const obj = {}
		arr = arr.reduce((total, next) => {
			obj[next[attribute]] ? '' : obj[next[attribute]] = true && total.push(next)
			return total
		}, [])
		return arr
	},
}

export default CommonFun