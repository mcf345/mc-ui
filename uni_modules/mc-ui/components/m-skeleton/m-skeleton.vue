<template>
	<view class="m-skeleton">
		<view class="m-skeleton-top">
			<view class="m-skeleton-top_left">
				<!-- 序号 -->
				<view class="m-skeleton-top_left_ordinal animate"></view>

				<!-- 标题 -->
				<view class="m-skeleton-top_left_title animate"></view>
			</view>

			<view class="m-skeleton-top_right">
				<!-- 时间 -->
				<view class="m-skeleton-top_right_title animate"></view>
			</view>
		</view>

		<view class="m-skeleton_second animate"></view>

		<view class="m-skeleton_content animate"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	// 骨架屏背景色
	$main-skeleton-bac: #e0e0e0;
	$skeleton-bottom: 10rpx;
	$skeleton-height: 28rpx;

	// 定义一个 mixin 用于生成中间深两边浅的渐变效果  
	@mixin gradient-center-deep($startColor, $endColor, $middleColor) {
		background: linear-gradient(to right,
				$startColor,
				$startColor 25%,
				$middleColor 25%,
				$middleColor 75%,
				$endColor 75%,
				$endColor );
	}

	.m-skeleton {
		position: relative;
		border-radius: 16rpx;
		padding: 20rpx;
		background-color: #fff;

		&-top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: $skeleton-bottom;

			&_left {
				display: flex;
				align-items: center;

				// 序号
				&_ordinal {
					background-color: $main-skeleton-bac;
					width: fit-content;
					min-width: 34rpx;
					height: $skeleton-height;
					border-radius: 8rpx;
				}

				&_title {
					background-color: $main-skeleton-bac;
					width: 100rpx;
					height: $skeleton-height;
					border-radius: 999rpx;
					margin-left: 10rpx;
				}
			}

			&_right {

				&_title {
					background-color: $main-skeleton-bac;
					width: 100rpx;
					height: $skeleton-height;
					border-radius: 999rpx;
				}
			}
		}

		&_second {
			background-color: $main-skeleton-bac;
			height: $skeleton-height;
			border-radius: 999rpx;
			margin-bottom: $skeleton-bottom;
		}

		&_content {
			background-color: $main-skeleton-bac;
			height: 100rpx;
			border-radius: 8rpx;
		}

	}

	@keyframes skeleton {
		0% {
			background-position: 100% 50%
		}

		100% {
			background-position: 0 50%
		}
	}

	.animate {
		overflow: hidden;
		position: relative;

		// animation: skeleton 1.8s ease infinite
		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: -30%;
			/* 初始位置在盒子左边外部30%的位置 */
			width: 30%;
			/* 伪元素的宽度设置为盒子的30% */
			height: 100%;

			@include gradient-center-deep(rgba(232, 232, 232, .3), rgba(232, 232, 232, .6), rgba(232, 232, 232, .3));
			animation: shimmer .7s linear infinite;
		}

		@keyframes shimmer {
			0% {
				left: -30%;
				/* 开始时伪元素在盒子左边外部30%的位置 */
			}

			100% {
				left: 100%;
				/* 结束时伪元素移动到盒子的右边外部 */
			}
		}
	}
</style>