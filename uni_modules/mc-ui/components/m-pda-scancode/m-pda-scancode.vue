<template>
	<view class="pdaScan"></view>
</template>

<script>
	/**  
	 * @description m-pda-scancode 自定义PDA扫码插件  
	 * 此组件用于PDA激光扫码。它允许你设置setContent值（默认为{action:'', extra:''}）和监听名（默认为'scancodedate'）。  
	 * @param {Object} setContent - pda值，默认为{action:'', extra:''}  
	 * @property {String} setContent.action - 自定义的action广播动作值  
	 * @property {String} setContent.extra - 额外的自定义广播标签数据  
	 * @param {String} [listenName='scancodedate'] - 监听名，用于接收扫码结果的事件名
	 * @example  <m-pda-scancode :setContent="{action:'xxxx',extra:'xxxx'}" listen-name="myScanEventName"></m-pda-scancode>  
	 */
	export default {
		name: 'm-pda-scancode',
		props: {
			// pda值定义
			SetContent: {
				type: Object,
				default: () => ({
					action: '',
					extra: ''
				}),
			},
			// 监听器名称
			listenName: {
				type: String,
				default: 'scancodedate'
			}
		},
		data() {
			return {
				activity: null,
				receiver: null,
				intentFilter: null
			}
		},
		created: function(option) {
			this.initScan()
			this.startScan();
		},
		onHide: function() {
			this.stopScan();
		},
		destroyed: function() {
			//页面退出时一定要卸载监听,否则下次进来时会重复，造成扫一次出2个以上的结果/
			this.stopScan();
		},
		methods: {
			initScan() {
				let _this = this;
				this.activity = plus.android.runtimeMainActivity(); //获取activity
				var IntentFilter = plus.android.importClass('android.content.IntentFilter');
				this.intentFilter = new IntentFilter();
				this.intentFilter.addAction(this.SetContent.action) // 换你的广播动作
				this.receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
					onReceive: function(context, intent) {
						plus.android.importClass(intent);
						let content = intent.getStringExtra(_this.SetContent.extra); // 换你的广播标签
						uni.$emit(_this.listenName, content)
					}
				});
			},
			startScan() {
				this.activity.registerReceiver(this.receiver, this.intentFilter);
			},
			stopScan() {
				this.activity.unregisterReceiver(this.receiver);
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>