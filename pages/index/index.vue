<template>
	<view class="content">
		<view class="nav_title-wrap">
			<view class="nav_title">
				基 / 础 / 组 / 件
			</view>
		</view>
		<view class="nav-list">
			<view class="nav-list-item mc-cool-bg-color-7" v-for="(item,index) in MenuList" :key="index"
				@click="navigateTo(item)">
				<view class="nav-link">
					<view class="title">
						{{item.text}}
					</view>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				MenuList: [{
						text: '单体下拉',
						path: '/pages/index/comPage/dropDowm'
					},
					{
						text: '复杂下拉',
						path: '/pages/index/comPage/dropDowmMenu'
					},
					{
						text: '标签栏',
						path: '/pages/index/comPage/tabs'
					},
					{
						text: '内嵌时间',
						path: '/pages/index/comPage/inlineDateTime'
					},
					{
						text: 'Field布局',
						path: '/pages/index/comPage/Field'
					},
					{
						text: '消息轮播',
						path: '/pages/index/comPage/carouselRoll'
					},
				]
			}
		},
		onLoad() {

		},
		methods: {
			navigateTo(data) {
				uni.navigateTo({
					url: data.path
				})
			},
		}
	}
</script>

<style lang="scss">
	.content {
		background-color: #e8e8e8;

		.nav_title-wrap {
			position: relative;
			display: flex;
			height: 96rpx;
			font-size: 32rpx;
			align-items: center;
			justify-content: center;
			font-weight: 700;

			.nav_title {
				-webkit-background-clip: text;
				color: transparent;
				background-image: repeating-linear-gradient(45deg, #ff3181, #ff8331);
			}
		}

		.mc-cool-bg-color-7 {
			background-image: repeating-linear-gradient(45deg, #00c3ff, #58fff5);
			color: #fff;
		}

		.nav-list {
			display: flex;
			flex-wrap: wrap;
			padding: 0px 8rpx 0px;
			justify-content: space-between;

			&-item {
				padding: 24rpx 24rpx 16rpx 24rpx;
				border-radius: 8rpx;
				width: 45%;
				min-height: 80rpx;
				margin: 0 14rpx 32rpx;
				background-size: cover;
				background-position: 50%;
				position: relative;
				z-index: 99;
				display: flex;
				align-items: center;
				justify-content: center;

				.nav-link {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24rpx;
					line-height: 1.2;
					text-transform: capitalize;
					padding: 0px 8rpx 0px 0;
					position: relative;

					.title {
						color: #fff;
						text-align: left;
						flex: 1;
					}
				}
			}
		}
	}
</style>