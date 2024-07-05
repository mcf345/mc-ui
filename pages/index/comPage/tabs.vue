<template>
	<view class="content">
		<view class="textPadding">未开启 showFilter</view>
		<m-tabs :list="TabData" v-model="TabActive" @click="ClickTab" :format="{TabText:'TabName',BackKey:'TabID'}">
		</m-tabs>

		<view class="textPadding">开启 默认showFilter</view>
		<m-tabs :list="TabData" v-model="TabActive" @click="ClickTab" showFilter @TapFilter="TapFilter"
			:format="{TabText:'TabName',BackKey:'TabID'}">
		</m-tabs>


		<view class="textPadding">
			<view>开启 默认showFilter，自定义filter内容。</view>
			<view>建议使用组件自带事件，避免事件过多，出现性能问题。</view>
		</view>
		<m-tabs :list="TabData" v-model="TabActive" showFilter @click="ClickTab"
			:format="{TabText:'TabName',BackKey:'TabID'}">
			<template #filterBox>
				<view @click="mineFilter">自定义</view>
			</template>
		</m-tabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				TabData: [],
				TabActive: 0,
				FormSet: {}
			};
		},
		onLoad() {
			let that = this;


			for (let i = 0; i < 10; i++) {
				let obj = {
					TabName: '单据列表' + i,
					TabID: i,
				}
				that.TabData.push(obj)
			}
		},
		methods: {
			ClickTab(ItemID) { // 点击Tab栏
				let that = this;

				let FilterData = that.TabData.filter(item => {
					return item.TabID == ItemID
				})
				console.log(FilterData)


				if (FilterData.length) {
					Object.assign(this.FormSet, FilterData[0]);
				}

			},
			TapFilter() {
				this.$utils.msg('点击了筛选')
			},
			mineFilter() {
				this.$utils.msg('点击了自定义筛选')
			},
		}
	}
</script>

<style lang="scss">
	.textPadding {
		padding: 10rpx 15rpx;
		margin-top: 20rpx;
	}
</style>