<template>
	<view class="m-step box">
		<!-- 步骤条 -->
		<view class="set-1">
			<view class="set-2" :key="index" v-for="(item,index) in options">
				<!-- 时间 -->
				<text class="set2-test">{{item.Date}}</text>
				<!-- Card -->
				<view class="set-view">
					<slot name="CardBox" :element="item" :index="index"></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: {
			options: Array, //数据
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.box {}

	.set-2:last-child::after {
		display: none;
	}

	.set2-test {
		font-size: 24rpx;
		color: #333;
	}

	.set-1 {
		margin: 30upx;
	}

	.set-2 {
		// height: 340rpx;
		border-radius: 10upx;
		// width: 600upx;
		margin-left: 40upx;
		margin-top: 32upx;
		position: relative;

		.set-view {
			width: 100%;
			// height: 266rpx;
			background-color: #ffffff;
			box-shadow: 0px 4px 16px 0px rgba(69, 91, 99, 0.08);
			border-radius: 12rpx;
			margin-top: 24rpx;


		}
	}


	.set-2::after {
		content: '';
		/* 必须存在如果没有图标就留空 */
		top: 15%;
		/* 定位 距离*/
		border-style: dashed;
		border-left: 1px;
		/* 横线颜色 */
		border-color: #51d0d0;
		left: -42upx;
		/* 定位 距离*/
		height: 90%;
		/* 高度 */
		position: absolute;
		/* 定位 */
	}

	.set-2::before {
		content: "";
		/* 必须存在如果没有图标就留空 */
		background: url(@/static/image/Icon/Running.png) no-repeat;
		background-size: 36rpx 36rpx;
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		/* 定位 */
		left: -58upx;
		/* 移动到左边 */
		font-weight: bold;
		/* 图标样式在复制的图标文件中复制相对应的图标样式必须存在 */
		font-family: "iconfont" !important;
		/* 图标样式在复制的图标文件中复制相对应的图标样式必须存在 */
		font-size: 54upx;
		/* 图标大小 */
		font-style: normal;
		/* 图标样式在复制的图标文件中复制相对应的图标样式必须存在 */
		-webkit-font-smoothing: antialiased;
		/* 图标样式在复制的图标文件中复制相对应的图标样式必须存在 */
		-moz-osx-font-smoothing: grayscale;
		/* 图标样式在复制的图标文件中复制相对应的图标样式必须存在 */
	}
</style>