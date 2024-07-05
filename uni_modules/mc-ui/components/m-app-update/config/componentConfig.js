/**** 此文件说明请看注释 *****/
// 可以用自己项目的请求方法
// 请求配置说明：https://ext.dcloud.net.cn/plugin?id=822
// 请求方法
import $http from '@/common/http/request.js';
// Vuex
import Store from '@/store/index.js';


/**** 结束 *****/
const platform = uni.getSystemInfoSync().platform;
export default {
	// 发起ajax请求获取服务端版本号
	getServerNo: (version, isPrompt = false, callback) => {
		let httpData = {
			version: version.versionCode,
			// 版本名称
			versionName: version.versionName,
			// setupPage参数说明（判断用户是不是从设置页面点击的更新，如果是设置页面点击的更新，有不要用静默更新了，不然用户点击没反应很奇怪的）
			setupPage: isPrompt
		};
		if (platform == "android") {
			httpData.type = 1101;
		} else {
			httpData.type = 1102;
		}
		/* 接口入参说明
		 * version: 应用当前版本号（已自动获取）
		 * versionName: 应用当前版本名称（已自动获取）
		 * type：平台（1101是安卓，1102是IOS）
		 */

		/** 比较版本号 
		 * 返回值： 0 高于服务器版本； 1 与服务器版本一致； 2 低于服务器版本；
		 * @param {String} OldV 从服务器获取的版本号 
		 * @param {String} NewV 从本机获取的版本号 
		 */
		const versionFn = function(NewV, OldV) {
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

		$http.request('getAppFileList', {
			name: 'H6Cloud'
		}, function(res) {
			// console.log(res)
			if (res.status == 200) {
				let data = res.data.ds[0]
				let Local_Ver = plus.runtime.version
				// 比较版本号 返回值： 0 高于服务器版本； 1 与服务器版本一致； 2 低于服务器版本；
				let contrast = versionFn(data.F_Ver, Local_Ver)

				// console.log(contrast)

				if (contrast == 2) { // 开启更新
					let res = {
						updateType: 'solicit',
						// versionInfo: '本次版本更新：\r\n 1、修复授权提醒功能。\r\n 2、完善检验功能显示Bug。',
						versionInfo: '本次版本更新：\r\n' + data.FRemarks,
						versionCode: data.F_Ver,
						versionName: data.F_Ver,
						downloadUrl: data.D_Url,
					}
					callback && callback(res);
				} else if (contrast == 1 && Store.state.UpdateSwitch) { // 版本一致提示最新
					uni.showToast({
						title: '当前已是最新版本',
						icon: "none",
						duration: 1000
					})
				} else {
					if (Store.state.UpdateSwitch) {

						uni.showToast({
							title: '暂无更新程序',
							icon: "none",
							duration: 1000
						})
					}
				}


				Store.commit('ChangeAndSetStateData', {
					Name1: 'UpdateSwitch',
					data: false
				})
			}
		})

		/****************以下是示例*******************/
		// 可以用自己项目的请求方法（接口自己找后台要，插件不提供）
		/* res的数据说明
		 * | 参数名称        | 一定返回     | 类型        | 描述
		 * | -------------|--------- | --------- | ------------- |
		 * | versionCode     | y        | int       | 版本号        |
		 * | versionName     | y        | String    | 版本名称      |
		 * | versionInfo     | y        | String    | 版本信息      |
		 * | updateType      | y        | String    | forcibly = 强制更新, solicit = 弹窗确认更新, silent = 静默更新 |
		 * | downloadUrl     | y        | String    | 版本下载链接（IOS安装包更新请放跳转store应用商店链接,安卓apk和wgt文件放文件下载链接）  |
		 */
		// $http.get("api/common/v1/app_version", httpData, {
		// 	isPrompt: isPrompt
		// }).then(res => {
		// 	if (res && res.downloadUrl) {
		// 		// 兼容之前的版本（updateType是新版才有的参数）
		// 		if (res.updateType) {
		// 			callback && callback(res);
		// 		} else {
		// 			if (res.forceUpdate) {
		// 				res.updateType = "forcibly";
		// 			} else {
		// 				res.updateType = "solicit";
		// 			}
		// 			callback && callback(res);
		// 		}
		// 	} else if (isPrompt) {
		// 		uni.showToast({
		// 			title: "暂无新版本",
		// 			icon: "none"
		// 		});
		// 	}
		// });
		/****************以上是示例*******************/
	},
	// 弹窗主颜色（不填默认粉色）
	// appUpdateColor: "f00",
	appUpdateColor: "50d0cf",
	// 弹窗图标（不填显示默认图标，链接配置示例如： '/static/demo/ic_attention.png'）
	appUpdateIcon: ''
}