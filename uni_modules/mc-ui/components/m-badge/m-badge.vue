<template>
	<view class="m-badge">
		<slot></slot>
		<view class="m-badge-dot" v-if="dot"></view>
		<view class="m-badge-count" :style="[position,{zoom:zoom}]" v-else-if="count">{{finalCount}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			count: {
				type: Number,
				default: 0
			},
			maxCount: {
				type: Number,
				default: 99
			},
			dot: {
				type: Boolean,
				default: false
			},
			position: {
				type: Object,
				default: {
					top: '0',
					right: '0',
				}
			},
			zoom: {
				type: Number,
				default: 1
			}
		},
		computed: {
			finalCount() {
				return this.count > this.maxCount ? `${this.maxCount}+` : this.count;
			}
		}
	}
</script>

<style scoped>
	.m-badge {
		position: relative;
		display: inline-block;
		line-height: 1;
		vertical-align: middle;
	}

	.m-badge-count {
		position: absolute;
		transform: translateX(50%);
		top: -6px;
		right: -6px;
		height: 15px;
		border-radius: 8px;
		min-width: 15px;
		background: #dd524d;
		color: #fff;
		line-height: 15px;
		text-align: center;
		padding: 0 5px;
		font-size: 10px;
		white-space: nowrap;
		z-index: 10;
		box-shadow: 0 0 0 1px #fff;
		box-sizing: border-box;
	}

	.m-badge-dot {
		position: absolute;
		transform: translateX(-50%);
		top: -4px;
		right: -6px;
		height: 8px;
		width: 8px;
		border-radius: 100%;
		background: #dd524d;
		z-index: 10;
		box-shadow: 0 0 0 1rpx #fff;
	}
</style>