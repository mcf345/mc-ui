<template>
	<view class="content">
		<!-- 消息滚动 -->
		<view class="content_main">


			<view class="content_main_CardBox">
				<m-carousel-roll :list="RollList" :textShow="false" emptyText="暂无播报" time="createDate"
					style="border-radius: 12px;margin-top: 24rpx;padding-left: 18rpx;background-color: rgba(218, 255, 161, .5) !important;"
					:title-item-style="{'font-size':'32rpx'}">
				</m-carousel-roll>
			</view>

			<view class="content_main_CardBox">
				<view>使用插槽 【customLeft】，定义左侧内容</view>
				<m-carousel-roll :list="RollList" emptyText="暂无播报" time="createDate"
					style="border-radius: 12px;margin-top: 24rpx;padding-left: 18rpx;background-color: rgba(218, 255, 161, .5) !important;"
					:title-item-style="{'font-size':'32rpx'}">
					<template v-slot:customLeft>
						<view class="my-custom-text-style x-f"
							style="background-color: #fff3f5;border-radius: 10px;justify-content: center;padding: 4px;">
							<u-icon name="volume-fill" color="#ff8e62" size="34rpx"></u-icon>
						</view>
					</template>
				</m-carousel-roll>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				RollList: [{
					title: '消息1',
					createDate: '2024-01-01 12:00',
				}, {
					title: '消息2',
					createDate: '2024-07-05 12:00',
				}, ],
			};
		},
		onLoad() {}
	}
</script>

<style lang="scss">
	.content {
		padding: 10rpx;

		.content_main_CardBox {
			margin-top: 20rpx;

			&>text {
				padding: 10rpx 6rpx;
			}
		}
	}
</style>