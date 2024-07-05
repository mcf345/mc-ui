var APP = function() {
	return {
		/**
		 * 获取协议类型 http:// 或 https://
		 */
		IPAgreement: function(data) {
			if (data) {
				return window.localStorage.setItem('IPAgreement', data);
			} else {
				return window.localStorage.getItem('IPAgreement');
			}
		},
		serverIP: function(ip) {
			if (ip) {
				localStorage.setItem('serverIP', ip);
				return ip;
			} else {
				return localStorage.getItem('serverIP')
				// return '39.105.222.87:20000'
			}
		},

		/**
		 * 数字转换为EXCEL字母列 0 = A ; 26 = AA
		 * @param  {int} n Column number
		 * @return {string} Column letter(s) name
		 */
		createCellPos: function(n) {
			var ordA = 'A'.charCodeAt(0);
			var ordZ = 'Z'.charCodeAt(0);
			var len = ordZ - ordA + 1;
			var s = "";
			while (n >= 0) {
				s = String.fromCharCode(n % len + ordA) + s;
				n = Math.floor(n / len) - 1;
			}
			return s;
		},
		excelColumnToIndex: function(column) {
			let index = 0;
			for (let i = 0; i < column.length; i++) {
				index = index * 26 + column.charCodeAt(i) - 64;
			}
			return index - 1;
		},
		/** 将传入的excel字符 AA1 之类的 转换成 [0,26]
		 * @param {string} address 选中项位置
		 */
		excelAddressToArrayIndex: function(address) {
			const column = address.match(/[A-Z]+/)[0];
			const row = parseInt(address.match(/\d+/)[0], 10) - 1;

			const columnIndex = APP.excelColumnToIndex(column);

			return [row, columnIndex];
		},
		ajax: function(cmd, parm, successCallback, errorCallback, IP) {

			if (api.connectionType == 'none') {
				vm.showLoading = false;
				vm.refreshLoading = false;
				vm.ifConfirm = false;
				vm.scanDisabled = false;

				if (typeof(layer) != 'undefined') {
					layer.open({
						content: '当前网络不可用,请连接网络!',
						skin: 'msg',
						time: 2
					});
				}
				return false;
			}
			if (IP) {
				APP.serverIP(IP);
			}
			var url = APP.IPAgreement() + APP.serverIP() + '/Frame/SqlData?cmdname=' + cmd;
			// + '&platform=' + api.systemType + '【' + api.deviceId + '】';


			if (APP.getUserInfo()) {
				if (!parm.hasOwnProperty("P_UserID")) {
					parm.P_UserID = APP.getUserInfo().UserID;
					parm.P_UserName = APP.getUserInfo().UserName;
				}
			}
			// console.log(url)
			api.ajax({
				headers: {
					'Version': api.appVersion,
					'PackageName': 'com.hyzy.app'
				},
				url: url,
				data: {
					values: parm
				},
				method: 'post',
				dataType: 'json'
			}, function(ret, err) {
				// console.log(JSON.stringify(err));
				if (ret) {
					if (ret.status == 200) {
						if (successCallback) successCallback(ret.data);
					} else {
						if (vm) {
							vm.showLoading = false;
							vm.refreshLoading = false;
							vm.ifConfirm = false;
							vm.scanDisabled = false;
							// alert(cmd + '\n' + APP.serverIP() + '\n' + '错误代码1:' + '\n' + JSON.stringify(
							// 	ret));
						}
					}
				} else {
					if (errorCallback) {
						errorCallback(err);
					} else {
						if (vm) {
							vm.showLoading = false;
							vm.refreshLoading = false;
							vm.ifConfirm = false;
							vm.scanDisabled = false;
							// alert(cmd + '\n' + APP.serverIP() + '\n' + '错误代码2:' + '\n' + JSON.stringify(
							// 	err));
						}

						pingIP(APP.serverIP1);
						pingIP(APP.serverIP2);
					}


				}
			});
		},
		ajax2: function(url, parm, successCallback, errorCallback) {
			if (api.connectionType == 'none') {
				if (typeof(layer) != 'undefined') {
					layer.open({
						content: '当前网络不可用,请连接网络!',
						skin: 'msg',
						time: 2
					});
				}
				return false;
			}
			var url = APP.IPAgreement() + APP.serverIP() + url;
			// console.log(url);

			if (APP.getUserInfo()) {
				if (!parm.hasOwnProperty("P_UserID")) {
					parm.P_UserID = APP.getUserInfo().UserID;
					parm.P_UserName = APP.getUserInfo().UserName;
				}
			}
			// console.log(JSON.stringify(parm));
			api.ajax({
				headers: {
					'Version': api.appVersion,
					'PackageName': 'com.hyzy.app'
				},
				url: url,
				data: {
					values: parm
				},
				method: 'post',
				dataType: 'json'
			}, function(ret, err) {
				if (ret) {
					// console.log(JSON.stringify(api.appVersion));
					// console.log(JSON.stringify(ret))
					if (ret.status == 200) {
						if (successCallback) successCallback(ret.data);
					} else {
						if (vm) {
							// alert(url + '\n' + APP.serverIP() + '\n' + '错误代码1:' + '\n' + JSON.stringify(
							// 	ret));
						}
					}
				} else {
					if (errorCallback) {
						errorCallback(err);
					} else {
						if (vm) {
							// alert(url + '\n' + APP.serverIP() + '\n' + '错误代码2:' + '\n' + JSON.stringify(
							// 	err));
						}

						pingIP(APP.serverIP1);
						pingIP(APP.serverIP2);
					}
				}
			});
		},
		jqueryAjax: function(cmd, parm, successCallback, errorCallback, suffix) {
			// if (api.connectionType == 'none') {
			// 	if (typeof(layer) != 'undefined') {
			// 		layer.open({
			// 			content: '当前网络不可用,请连接网络!',
			// 			skin: 'msg',
			// 			time: 2
			// 		});
			// 	}
			// 	return false;
			// }
			// var url = 'http://' + APP.serverIP() + '/Frame/SqlData?cmdname=' + cmd;

			var url = APP.IPAgreement() + APP.serverIP()
			if (suffix) {

				url += '/Frame/ST1_QMS/Handler.aspx?cmd=' + cmd;
			} else {
				url += '/Frame/SqlData?cmdname=' + cmd;
			}

			if (APP.getUserInfo()) {
				// if (!parm.hasOwnProperty("P_UserID")) {
				// 	parm.P_UserID = APP.getUserInfo().UserID;
				// 	parm.P_UserName = APP.getUserInfo().UserName;
				// }
				if (!parm.hasOwnProperty("P_UserID")) {
					parm.UserID = APP.getUserInfo().UserID;
					parm.UserName = APP.getUserInfo().UserName;
				}

			}
			// console.log(url)
			// console.log(JSON.stringify(parm))

			$.ajax({
				url: url,
				async: true,
				data: parm,
				type: "post",
				dataType: 'json',
				success: function(ret, err) {

					// alert(JSON.stringify(ret));
					if (ret) {
						if (ret.status == 200) {
							if (successCallback) successCallback(ret);
						} else {
							console.log(JSON.stringify(ret))
							console.log(url)
							if (vm) {
								// alert(url + '\n' + APP.serverIP() + '\n' + '错误代码1:' + '\n' + JSON
								// 	.stringify(ret));
							}
						}
					} else {
						console.log(JSON.stringify(err))
						if (errorCallback) {
							errorCallback(err);
						} else {
							if (vm) {
								// alert(url + '\n' + APP.serverIP() + '\n' + '错误代码2:' + '\n' + JSON
								// 	.stringify(err));
							}

							// pingIP(APP.serverIP1);
							// pingIP(APP.serverIP2);
						}
					}
				},
				error: function(err) {
					console.log(url)

					console.log(JSON.stringify(err))
					if (errorCallback) {
						errorCallback(err);
					}
				}
			});
		},
		/**
		 * 获取时间数组中最新的数据，(简单数组)
		 * @param  {Array} data 简单时间数组。 [2023-11-11]
		 * @return {string} 	返回最新的时间
		 */
		GetNewTime: function(data) {
			// 筛选非空时间字符串，并转换为 Date 对象
			const validTimeArray = data.filter(time => time !== '').map(time => new Date(time));
			if (validTimeArray.length == 0) {
				return ''
			}
			// 按时间顺序对数组进行排序
			validTimeArray.sort((a, b) => b.getTime() - a.getTime());
			// 获取最新的时间
			const latestTime = validTimeArray[0];
			let newDate = '';
			// console.log(APP.isEmpty(String(latestTime)))
			if (!APP.isEmpty(String(latestTime))) {
				newDate = APP.dateFormat(latestTime, 'Y-MM-dd hh:mm:ss')
			}
			return newDate
		},
		/**
		 * 处理时间格式
		 * @param  {string}  date  如：Mon Dec 11 2023 00:00:00 GMT+0800 (中国标准时间)
		 * @param  {string}  fmt  	需要的时间格式 Y-MM-dd hh:mm:ss
		 * @return {string} 返回最新的时间 
		 */
		dateFormat: function(date, fmt) {
			date = new Date(date)

			let a = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
			let o = {
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
			for (let k in o) {
				if (new RegExp('(' + k + ')').test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' +
						o[k]).length)))
				}
			}
			return fmt
		},
		/**
		 * 深拷贝
		 * @param  {object}  obj  传入要拷贝的对象
		 * @return {object} 
		 */
		deepClone: function(obj) {
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
					result[key] = APP.deepClone(obj[key])
				}
			}
			return result
		},
		/**
		 * 判断传入的值受否为空
		 * @param  {string}  value  传入的值
		 * @return {object} 返回布尔值 true | false
		 */
		isEmpty: function(value) {
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
		},
		/**
		 * 响应式赋值-对象
		 * @param {object} obj 要给属性赋值的对象
		 * @param {string} property 要设置值的属性名称
		 * @param {string} value 要赋予属性的值
		 */
		setReactiveValue: function(obj, property, value) {
			Object.defineProperty(obj, property, {
				get() {
					return value;
				},
				set(newValue) {
					value = newValue;
					// 做一些响应式处理或其他逻辑
				},
				enumerable: true,
				configurable: true
			});
		},
		/**
		 * 获取对象数组中某个属性的最大值
		 * @param {Array} arr 要给属性赋值的对象
		 * @param {string} property 要设置值的属性名称
		 * @return {string | number} 返回最大的值
		 */
		getMaxPropertyValue: function(arr, property) {
			if (arr.length === 0) {
				return undefined;
			}

			return arr.reduce((max, obj) => {
				return obj[property] > max ? obj[property] : max;
			}, arr[0][property]);
		},
		/**
		 * 获取对象数组中某个属性数组的最大长度
		 * @param {Array} arr 要给属性赋值的对象
		 * @param {string} property 要设置值的属性名称
		 * @return {string | number} 返回最大的值
		 */
		findMaxFieldLength: function(arr, field) {
			let maxLength = 0;
			arr.forEach(item => {
				if (item[field] && item[field].length > maxLength) {
					maxLength = item[field].length;
				}
			});
			return maxLength;
		},
		shoppingMallAjax(cmd, parm, callback, IP) {
			if (IP) {
				APP.ShopIP(IP);
			}
			var url = APP.IPAgreement() + APP.ShopIP() + '/Handler/ShoppingHandler.ashx?action=' + cmd;
			// console.log(url);
			if (APP.getUserInfo()) {
				if (!parm.hasOwnProperty("h_userId")) {
					parm.h_userId = APP.getUserInfo().UserId;
				}
			}
			api.ajax({
				url: url,
				method: 'post',
				dataType: 'text',
				data: {
					values: parm
				}
			}, function(ret, err) {
				if (ret) {
					callback(ret)
				} else {
					//alert(JSON.stringify(err))
					vm.showLoading = false;
					vm.refreshLoading = false;
					vm.ifConfirm = false;
					vm.$toast('程序好像出错了,请稍后再试');
				}


			});
		},
		/**
		 * 获取登录用户信息
		 * @param {object} data 一般都是对象的方式存入
		 * @return {object} 如果没有传data，直接获取数据
		 */
		getUserInfo: function(data) {
			if (data) {
				window.localStorage.setItem('userInfo', JSON.stringify(data))
			} else {
				if (window.localStorage.getItem('userInfo')) {
					return JSON.parse(window.localStorage.getItem('userInfo'))
				} else {
					return null;
				}
			}
		},
		uploadFile: function(folder, fileSrc, callback) {
			var url = APP.IPAgreement() + APP.serverIP() + '/Frame/uploadFile?dirName=' + folder;
			api.ajax({
				headers: {
					'Version': api.appVersion,
					'PackageName': 'com.lls.app'
				},
				url: url,
				method: 'post',
				data: {
					files: {
						file: fileSrc
					}
				}
			}, function(ret, err) {
				if (ret) {
					if (ret.status && ret.status == 200) {
						if (callback) callback(ret.data);
					} else {
						if (vm) {
							vm.showLoading = false;
							vm.refreshLoading = false;
							vm.$toast('上传失败,请稍后再试');
						}

					}
				} else {
					if (vm) {
						vm.showLoading = false;
						vm.refreshLoading = false;
						vm.$toast('程序好像出错了,请稍后再试\n' + 'errcode:' + err.code);
					}
				}
			});
		},

		exitApp: function() {
			setTimeout(function() {
				api.addEventListener({
					name: 'keyback'
				}, function(ret, err) {
					api.toast({
						msg: '再按一次返回键退出' + api.appName,
						duration: 2000,
						location: 'bottom'
					});
					api.addEventListener({
						name: 'keyback'
					}, function(ret, err) {
						api.closeWidget({
							id: api.appId,
							retData: {
								name: 'closeWidget'
							},
							silent: true
						});
					});
					setTimeout(function() {
						APP.exitApp();
					}, 2000)
				});
			}, 400);

		},

		getFormatDate: function(date) {
			if (!date) date = new Date();
			var seperator1 = "-";
			var seperator2 = ":";
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var second = date.getSeconds();
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			if (hour >= 0 && hour <= 9) {
				hour = "0" + hour;
			}
			if (minute >= 0 && minute <= 9) {
				minute = "0" + minute;
			}
			if (second >= 0 && second <= 9) {
				second = "0" + second;
			}
			var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
				" " + hour + seperator2 + minute +
				seperator2 + second;
			return currentdate;
		},

		getFormatDateTime: function(date) {
			if (!date) date = new Date();
			var seperator1 = "-";
			var seperator2 = ":";
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var second = date.getSeconds();
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			if (hour >= 0 && hour <= 9) {
				hour = "0" + hour;
			}
			if (minute >= 0 && minute <= 9) {
				minute = "0" + minute;
			}
			if (second >= 0 && second <= 9) {
				second = "0" + second;
			}
			var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
				" " + hour + seperator2 + minute;
			return currentdate;
		},
		pingIP(ip) {
			api.ajax({
				url: APP.IPAgreement() + ip + '/Frame/SqlData?cmdname=ConnectionTest',
				data: {
					values: {}
				},
				timeout: 20,
				method: 'post',
				dataType: 'json'
			}, function(ret, err) {
				if (ret) {
					window.localStorage.setItem('serverIP', ip);
				} else {

				}
			});
		},
		getFormatDate2(fmt, date) {
			if (!fmt) fmt = 'yyyy-MM-dd hh:mm:ss';
			if (!date) date = new Date();
			var o = {
				"M+": date.getMonth() + 1, //月份
				"d+": date.getDate(), //日
				"h+": date.getHours(), //小时
				"m+": date.getMinutes(), //分
				"s+": date.getSeconds(), //秒
				"q+": Math.floor((date.getMonth() + 3) / 3), //季度
				"S": date.getMilliseconds() //毫秒
			};
			if (/(y+)/.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			}

			for (var k in o) {
				if (new RegExp("(" + k + ")").test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" +
						o[
							k]).length)));
				}
			}
			return fmt;
		}

	}
}()
if (Vue) {
	Vue.component('van-nav-bar-main', {
		props: ['title', 'left-text', 'right-text', 'left-arrow'],
		data: function() {
			return {
				safeHeight: 0
			}
		},
		props: {
			title: {
				type: String,
				default: ''
			},
			leftText: {
				type: String,
				default: ''
			},
			rightText: {
				type: String,
				default: ''
			},
			leftArrow: {
				type: Boolean,
				default: false
			}
		},
		template: '<div>\
                    <van-nav-bar :style="{\'padding-top\':safeHeight + \'px\'}" :title="title" :left-text="leftText" :right-text="rightText" :left-arrow="leftArrow" @click-left="clickLeft" @click-right="clickRight">\
                    <slot slot="title" name="title" style="color:#000"></slot>\
                    <slot slot="left" name="left"></slot>\
                    <slot slot="right" name="right"></slot>\
                    </van-nav-bar>\
                    </div>',
		created: function() {
			this.getSafeHeight(0);
		},
		methods: {
			getSafeHeight: function(index) {
				var that = this;
				if (typeof(api) !== 'undefined') {
					that.safeHeight = api.safeArea.top;
				} else {
					if (index >= 10) {
						this.safeHeight = 0;
						return;
					}
					index++;
					setTimeout(function() {
						that.getSafeHeight(index);
					}, 100)
				}

			},
			clickLeft: function() {
				this.$emit('click-left');
			},
			clickRight: function() {
				this.$emit('click-right');
			}
		}
	})
}

// Vue.component('serve-img1', {
//     props: ['src'],
//     template: '<img :src="returnServeImg(src)" />',
//     methods: {
//         returnServeImg(src) {
//             if (src && src != 'null') {
//                 return 'http://' + APP.serverIP + src;
//             } else {
//                 return '../../image/header.png';
//             }

//         }
//     }
// })
// Vue.component('serve-img2', {
//     props: ['src'],
//     template: '<img :src="returnServeImg(src)" />',
//     methods: {
//         returnServeImg(src) {
//             if (src) {
//                 return 'http://' + APP.serverIP + src;
//             } else {
//                 return '../../image/no.png';
//             }

//         }
//     }
// })