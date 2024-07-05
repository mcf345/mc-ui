<template>

	<view v-if="show">
		<view class="uni-modal" :style="modalStyle">
			<view class="uni-modal-titleBox" @tap="close">
				<view class="uni-modal-titleBox_title">
					<view>{{ title }}</view>
				</view>
			</view>
			<view :style="contentStyle">
				<slot></slot>
				<view style="display:flex; flex-direction:row; justify-content:space-between; margin-top: 30rpx;">
					<button class="button" :style="{ background: btnBg }" size="mini" type="primary"
						@tap="apply">确定</button>
					<button class="button" size="mini" style="border: 1px solid #f3f3f3" @tap="close">取消</button>
				</view>
			</view>
		</view>
		<view class="uni-mask" @click="close"></view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: '权限申请'
			},
			contentStyle: {
				type: String,
				default: 'padding:40rpx 25rpx 20rpx;'
			},
			modalStyle: {
				type: String,
				default: 'border-radius: 20rpx;'
			},
			btnBg: {
				type: String,
				default: '#3688FF'
			},
		},
		data() {
			return {
				show: false,
			}
		},
		created(o) {},
		methods: {
			close(o) {
				this.show = false
			},
			check(type) {
				return new Promise((resolve, reject) => {

					console.log('检查权限')
					if (plus.os.name === 'Android') {
						const name = 'android.permission.' + type;
						plus.android.checkPermission(name, granted => {
							console.log('返回结果', granted)
							if (granted.checkResult >= 0) {
								resolve()
							} else {
								reject(granted.checkResult)
							}
						}, reject)
					}
				})
			},
			requestPermission(type) {
				return new Promise((resolve, reject) => {
					this.type = type
					// #ifndef APP-PLUS
					resolve()
					// #endif
					// #ifdef APP-PLUS
					if (plus.os.name === 'Android') {
						// 权限检查，如果未授权，则弹出描述对话框
						this.check(type).then(resolve).catch(res => {
							this.open()
							reject('wait')
						})
					}
					// #endif
				})

			},
			open(o) {
				this.show = true
			},
			//权限检测
			apply() {
				return new Promise((resolve, reject) => {

					const type = this.type
					// #ifdef APP-PLUS
					//判断安卓与ios设备
					if (plus.os.name === 'Android') {

						console.log('申请权限', 'android.permission.' + type)
						plus.android.requestPermissions(['android.permission.' + type],
							resultObj => {
								console.log('申请结果', resultObj)
								this.close()
								if (resultObj.granted.length > 0) {
									resolve()
								} else if (resultObj.deniedAlways.length > 0) {
									//当前查询权限已被永久禁用，此时需要引导用户跳转手机系统设置去开启
									uni.showModal({
										title: '温馨提示',
										content: '您拒绝了该权限，如需要开启，请手动设置',
										cancelText: "取消",
										confirmText: "去设置",
										showCancel: true,
										success: (res) => {
											if (res.confirm) {
												this.goSetting();
											}
										}
									})
								}

							}, console.error)
					} else {
						//IOS不需要添加自定义弹框来描述权限目的，因为在配置文件的隐私信息访问的许可描述里可添加
						//正常可以直接调用uni的API调起权限询问弹框使用各种权限，下面的判断使用场景主要是在IOS禁用某权限后，这个可以判断有无权限，进而引导用户跳转设置开启，仅列出了位置、相册、通讯录、相机、录音等权限，其他IOS权限可具体参考 https://ext.dcloud.net.cn/plugin?id=15787
						let result = 0;
						if (type === 'ACCESS_FINE_LOCATION') {
							//IOS检测位置权限
							let cLLocationManager = plus.ios.importClass("CLLocationManager"),
								authStatus = cLLocationManager.authorizationStatus(),
								enable = cLLocationManager.locationServicesEnabled();
							if (enable && authStatus != 2) {
								result = 1;
							} else {
								result = 0;
							}
							plus.ios.deleteObject(cLLocationManager);
						} else if (type == 'WRITE_EXTERNAL_STORAGE') {
							//IOS检测相册权限
							let PHPhotoLibrary = plus.ios.importClass("PHPhotoLibrary"),
								authStatus = PHPhotoLibrary.authorizationStatus();
							if (authStatus === 3) {
								result = 1;
							} else {
								result = 0;
							}
							plus.ios.deleteObject(PHPhotoLibrary);
						} else if (type == 'CAMERA') {
							//IOS检测相机/摄像头权限
							let avCaptureDevice = plus.ios.importClass("AVCaptureDevice"),
								authStatus = avCaptureDevice.authorizationStatusForMediaType("vide");
							if (authStatus === 3) {
								result = 1;
							} else {
								result = 0;
							}
							plus.ios.deleteObject(avCaptureDevice);
						} else if (type == 'CALL_PHONE') {
							//IOS检测通讯录权限
							let contactStore = plus.ios.importClass("CNContactStore"),
								authStatus = contactStore.authorizationStatusForEntityType(0);
							if (authStatus === 3) {
								result = 1;
							} else {
								result = 0;
							}
							plus.ios.deleteObject(contactStore);
						} else if (type == 'RECORD_AUDIO') {
							//IOS检测麦克风权限
							let aVAudioSession = plus.ios.importClass("AVAudioSession"),
								aVAudio = aVAudioSession.sharedInstance(),
								authStatus = aVAudio.recordPermission();
							if ([1684369017, 1970168948].includes(authStatus)) {
								result = 0;
							} else {
								result = 1;
							}
							plus.ios.deleteObject(aVAudioSession);
						}
						if (result) {
							//当前查询权限已授权，此时可以通知页面执行接下来的操作
							that.$emit('changeAuth')
						} else {
							//当前查询的权限已禁用,引导用户跳转手机系统设置去开启
							uni.showModal({
								title: '温馨提示',
								content: '还没有该权限，立即去设置开启？',
								cancelText: "取消",
								confirmText: "去设置",
								showCancel: true,
								confirmColor: '#000',
								cancelColor: '#666',
								success: (res) => {
									if (res.confirm) {
										this.goSetting();
									}
								}
							})
						}
					}
					// #endif
				})
			},
			//跳转手机系统设置
			goSetting() {
				if (plus.os.name == "iOS") {
					var UIApplication = plus.ios.import("UIApplication");
					var application2 = UIApplication.sharedApplication();
					var NSURL2 = plus.ios.import("NSURL");
					var setting2 = NSURL2.URLWithString("app-settings:");
					application2.openURL(setting2);
					plus.ios.deleteObject(setting2);
					plus.ios.deleteObject(NSURL2);
					plus.ios.deleteObject(application2);
				} else {
					var Intent = plus.android.importClass("android.content.Intent");
					var Settings = plus.android.importClass("android.provider.Settings");
					var Uri = plus.android.importClass("android.net.Uri");
					var mainActivity = plus.android.runtimeMainActivity();
					var intent = new Intent();
					intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
					var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
					intent.setData(uri);
					mainActivity.startActivity(intent);
				}
			}
		}
	}
</script>



<style scoped lang="scss">
	.button {
		height: 40px;
		font-size: 15px;
		line-height: 40px;
		padding: 0;
		border-radius: 15px;
		width: 46%
	}

	.uni-mask {
		background: rgba(0, 0, 0, 0.6);
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 999999;
	}

	/* 弹出层形式的广告 */
	.uni-modal {
		width: 530upx;
		position: fixed;
		left: 50%;
		top: 50%;
		background: #FFF;
		border-radius: 10upx;
		z-index: 9999999;
		transform: translate(-50%, -50%);
		overflow: hidden;

		overflow-y: auto;

		&-titleBox {
			justify-content: flex-end;

			&_title {
				justify-content: flex-end;
				padding: 20upx 20upx 0;
			}
		}

		.btn-block {
			width: 440upx;
			margin: 0 40upx 40upx;
		}
	}
</style>