<!-- 轮播滚动组件 -->

<template>
	<view class="flex row bg-white">
		<view v-if="textShow" class="family700 size16 line20 bg-clip-text col-transparent"
			:style="{backgroundImage: gradients ? 'linear-gradient(to bottom right, ' + textColor + ', '+ colorRgba(textColor,0.2) +')' : '',color:gradients ? '' : textColor}">
			<slot name="customLeft">{{ text }}</slot>
		</view>
		<swiper v-if="list.length" circular autoplay vertical :current="0" :interval="interval" duration="1000"
			:display-multiple-items="1" class="swiper marginLR15" :style="{color: titleColor}">
			<swiper-item v-for="(item,index) in list" :key="index" @click="$emit('active', item)" class="flex jbetween">
				<view class="ellipsis" :style="titleItemStyle">{{item[title]}}</view>
				<view v-if="timeShow" class="white-space size12 color9 paddingL5">
					{{ item[time] }}
				</view>
			</swiper-item>
		</swiper>
		<view v-else class="empty-slot">
			<slot name="empty">
				<!-- 默认的空状态内容 -->
				<view>{{emptyText}}</view>
			</slot>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 轮播滚动
	 * @example <m-carousel-roll :list="list"></m-carousel-roll>
	 * 
	 * @property {String}			text				标题文字（默认 通知公告 ）
	 * @property {Boolean}			textShow			是否展示标题文字（默认 true ）
	 * @property {String}			textColor			标题文字颜色（默认 #f15723 ）
	 * @property {Boolean}			gradients			字体是否开启渐变色（默认 true ）
	 * @property {Array}			list				滚动数据
	 * @property {String}			title				滚动数据标题字段（默认 title）
	 * @property {String}			titleColor			滚动数据标题颜色（默认 #000000）
	 * @property {String}			time				滚动数据时间字段（默认 time）
	 * @property {Boolean}			timeShow			是否展示时间（默认 true ）
	 * @property {Number}			interval			轮播自动切换时间间隔（默认 5000 ）
	 * 
	 * @event {Function} active			点击数据时触发
	 */
	export default {
		// 小程序样式穿透
		options: {
			styleIsolation: 'shared'
		},
		name: "m-carousel-roll",
		props: {
			// 标题文字
			text: {
				type: String,
				default: ''
			},
			// 是否展示标题文字
			textShow: {
				type: Boolean,
				default: true
			},
			// 标题文字颜色
			textColor: {
				type: String,
				default: '#f15723'
			},
			// 字体是否开启渐变色
			gradients: {
				type: Boolean,
				default: true
			},
			// 滚动数据
			list: {
				type: Array,
				default: []
			},
			// 滚动数据标题字段
			title: {
				type: String,
				default: 'title'
			},
			// 滚动数据标题颜色
			titleColor: {
				type: String,
				default: '#000000'
			},
			// 滚动数据标题样式
			titleItemStyle: {
				type: Object,
				default: () => ({}),
			},
			// 滚动数据时间字段
			time: {
				type: String,
				default: 'time'
			},
			// 是否展示时间
			timeShow: {
				type: Boolean,
				default: true
			},
			// 轮播自动切换时间间隔
			interval: {
				type: Number,
				default: 5000
			},
			// 空状态显示字符串
			emptyText: {
				type: String,
				default: '暂无数据'
			},
		},
		data() {
			return {}
		},
		methods: {
			// 颜色转换
			colorRgba(sHex, alpha = 1) {
				// 十六进制颜色值的正则表达式
				var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
				/* 16进制颜色转为RGB格式 */
				let sColor = sHex.toLowerCase()
				if (sColor && reg.test(sColor)) {
					if (sColor.length === 4) {
						var sColorNew = '#'
						for (let i = 1; i < 4; i += 1) {
							sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
						}
						sColor = sColorNew
					}
					//  处理六位的颜色值
					var sColorChange = []
					for (let i = 1; i < 7; i += 2) {
						sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
					}
					if (alpha == 1) {
						return sColorChange.join(',')
					} else {
						return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
					}
				} else {
					return sColor
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	page {
		background: #f9f9f9;
		font-family: '微软雅黑', sans-serif;
		font-size: 28rpx;
		min-height: 100%;
		overflow-x: hidden;
		-webkit-overflow-scrolling: touch;
	}

	.bg-white {
		background-color: #FFFFFF !important;
	}

	.row {
		flex-direction: row;
	}

	.flex {
		display: flex;
	}

	.family700 {
		font-weight: 700;
	}

	.line20 {
		line-height: 40rpx;
	}

	.col-transparent {
		color: transparent;
	}

	.marginLR15 {
		margin: 0 30rpx;
	}

	.jbetween {
		justify-content: space-between;
	}

	.ellipsis,
	.white-space {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	/* 不换行显示省略号 */
	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* 不换行 */
	.white-space {
		white-space: nowrap;
	}

	.size12 {
		font-size: 24rpx;
	}

	.size16 {
		font-size: 32rpx;
	}

	.color9 {
		color: #999999;
	}

	.paddingL5 {
		padding-left: 10rpx;
	}

	.swiper {
		width: 100%;
		height: 98rpx;
		// padding: 16rpx 0;
	}

	.bg-clip-text {
		// padding: 30rpx 0 30rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		-webkit-background-clip: text;
		background-clip: text;
		min-width: 70rpx;
		width: 70rpx;
	}

	/deep/ .uni-swiper-slide-frame {
		line-height: 49rpx;
	}

	// 空状态
	.empty-slot {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 98rpx;
		/* 设置合适的高度 */
		color: #999;
		/* 设置合适的颜色 */
		font-size: 28rpx;
		/* 设置合适的字体大小 */
	}
</style>