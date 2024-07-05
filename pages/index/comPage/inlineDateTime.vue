<template>
	<view>
		<m-dropdown ref="uDropdown" titleSize="14px" menuIconSize="14px" height="40"
			:style="{'overflow': stickShow ? 'hidden' : ''}" @open="stickShow = false" @close="stickShow = true">

			<!-- <template #menuText="{element}">
				<m-badge :count="element.count" :maxCount="99" :zoom="0.8" :position="{top:'-10px',right:'-2px'}">
					<view style="max-width: 100rpx;">{{element.title}}</view>
				</m-badge>
			</template> -->

			<!-- 时间选择 -->
			<m-dropdown-item :title="DropDowmMenu_Date['DateTitle'] || '日期'">
				<m-date-time :InitData="DropDowmMenu_Date" @DateSubmit="DateSubmit"></m-date-time>
			</m-dropdown-item>
		</m-dropdown>


		<view style="margin-top: 100rpx;">
			<m-date-time :InitData="DropDowmMenu_Date" backgroundColor="#5e5e5e" titleNameColor="#fff"
				@DateSubmit="DateSubmit"></m-date-time>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				stickShow: false,
				DropDowmMenu_Date: {},

			};
		},
		methods: {
			DateSubmit(data) { // 选中时间
				Object.assign(this.DropDowmMenu_Date, data)

				this.DropDowmMenu_Date = this.$utils.deepClone(data)

				Object.assign(this.DropDowmMenu_Date, this.$utils.deepClone(data))

				this.$refs.uDropdown.close();
			},
		}
	}
</script>

<style lang="scss">

</style>