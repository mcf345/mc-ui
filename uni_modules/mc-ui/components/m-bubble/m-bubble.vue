<template>
	<view class="selectBox" @click.stop="selectValueFun()">
		<!-- 遮罩层 -->
		<view v-if="isSelectShow && showOverlay" class="overlay" :style="{'opacity': opacity}">
		</view>

		<!-- 默认插槽 -->
		<slot></slot>

		<!-- 纵向气泡 -->
		<view class="selectItemBox" v-if="type == 'list' && isSelectShow"
			:style="{ 'left': position == 'center' ? '25%' : position == 'left' ? '0' : 'unset', 'right': position == 'right' ? '0' : 'unset' }">
			<view class="selectItem" :style="{'align-items': topOpsotionFun().align}">
				<u-icon class="icon-jiantou" size="30rpx" name="arrow-down-fill" :color="bgcRgba"
					:style="{ color: bgcRgba,'margin':topOpsotionFun().margin }"></u-icon>

				<view class="selectItemMin" :class="{ 'opcityShadow':  opacity == 0 || !showOverlay }"
					:style="{ background: bgcRgba }">
					<view class="selectItem-title" v-for="(item, index) in selectData" :key="index"
						:class="{ 'pressed': isPressed === index }" @touchstart="onTouchStart(index)"
						@touchend="onTouchEnd(index)" @click.stop="selectFun(item, index)" :style="{ color: color }">

						<!-- 图标插槽 -->
						<slot name="itemIcon" :element="item" :index="index">
							<u-icon class="image" :name="item.icon" size="20"
								:color=" isPressed === index ? '#bfbfbf' : color"></u-icon>
						</slot>
						<view>{{ item.name }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 横向气泡 -->
		<view class="bubbleItemBox" v-if="type == 'bubble' && isSelectShow"
			:class="position == 'top' ? 'top' : position == 'bottom' ? 'bottom' : position == 'left' ? 'left' : 'right'">
			<u-icon class="icon" name="play-right-fill"
				:class="position == 'top' ? 'iconTop' : position == 'bottom' ? 'iconBottom' : position == 'left' ? 'iconLeft' : 'iconRight'"
				:color="bgcRgba"></u-icon>
			<view class="bubbleItem-title" :style="{ width: bubbleWidth + 'rpx', background: bgcRgba, color: color }"
				@click.stop="bubble(bubbleValue)">
				{{ bubbleValue }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "m-bubble",
		props: {
			selectData: { // type为 list时 必传 
				type: Array,
				default: []
			},
			position: { // 显示位置 // type为 bubble时 可用值 top bottom left right
				type: String, // type为 list时 可用值 left center right
				default: 'center'
			},
			type: { // 显示类型
				type: String,
				default: 'list'
			},
			bubbleValue: { // 气泡显示内容 type为 bubble时 必传
				type: String,
				default: ''
			},
			bubbleWidth: { // 气泡宽度
				type: Number,
				default: 220
			},
			bgcRgba: { // 气泡背景颜色
				type: String,
				default: 'rgba(0, 0, 0, 0.8)'
			},
			color: { // 文本颜色
				type: String,
				default: '#fff'
			},
			topOpsotion: { // 顶部箭头显示位置
				type: String,
				default: 'center'
			},
			showOverlay: { // 是否展示遮罩层
				type: Boolean,
				default: true
			},
			opacity: { // 遮罩透明度
				type: String,
				default: '0.3'
			},
		},
		data() {
			return {
				isSelectShow: false,
				isPressed: null, // 用来追踪哪个项被按下  
			};
		},
		methods: {
			onTouchStart(index) {
				this.isPressed = index; // 标记当前项为按下状态  
			},
			onTouchEnd(index) {
				if (this.isPressed === index) {
					// 如果抬起的项和按下的项是同一个，则重置为未按下状态  
					this.isPressed = null;
				}
			},
			topOpsotionFun() {
				let BackStyle = {
					align: 'center',
					margin: '0 0 0 0'
				};
				if (this.topOpsotion == 'left') {
					BackStyle = {
						align: 'flex-start',
						margin: '0 0 0 4px'
					};
				} else if (this.topOpsotion == 'right') {
					BackStyle = {
						align: 'flex-end',
						margin: '0 4px 0 0'
					};
				}
				return BackStyle
			},
			// 气泡选择器点击事件
			selectValueFun() {
				if (this.isSelectShow) {
					this.isSelectShow = false
				} else {
					this.isSelectShow = true
				}
			},
			// 气泡选择器列表点击事件
			selectFun(item, index) {
				this.$emit('selectFun', item)
				this.isSelectShow = false
			},
			// 气泡点击事件
			bubble(bubbleValue) {
				this.$emit('bubble', bubbleValue)
			},
		}
	}
</script>

<style scoped lang="scss">
	/* 气泡选择器 */
	.selectBox {
		width: 100%;
		height: 100%;
		position: relative;

		.overlay {
			z-index: 999;
			width: 100%;
			height: 100%;
			background-color: #000;
			position: fixed;
			top: 0;
			left: 0;
		}
	}

	.selectItemBox {
		position: absolute;
		left: 25%;
		top: 60%;
		z-index: 9999;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.selectItem {
		display: flex;
		justify-content: center;
		// align-items: center;
		flex-direction: column;
	}

	.selectItem .icon-jiantou {
		// margin-right: 4px;
		font-size: 28rpx;
		font-weight: 400;
		/* color: rgba(0, 0, 0, 0.8); */
		transform: rotate(180deg);
	}

	.selectItemMin {
		margin-top: -12rpx;
		padding: 10rpx;
		border-radius: 15rpx;
		max-height: 400rpx;
		/* background: rgba(0, 0, 0, 0.8); */
		overflow-x: hidden;
		overflow-y: scroll;
	}

	.opcityShadow {
		box-shadow: 0 10px 14px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
	}

	.selectItem-title {
		display: flex;
		align-items: center;
		min-width: 100px;
		// width: fit-content;
		/* height: 50rpx; */
		font-size: 14px;
		/* color: #fff; */
		font-weight: 400;
		padding: 10px 4px;
		// border-bottom: 1rpx solid #d7d7d7;
		transition: color 0.3s ease;

		.image {
			margin-right: 10rpx;
		}
	}

	// 手指按下时，修改样式
	.pressed {
		color: #bfbfbf !important;
	}

	.bubbleItemBox {
		position: absolute;
		z-index: 5;
	}

	.bubbleItemBox .icon {
		width: 30rpx;
		height: 30rpx;
		/* color: rgba(0, 0, 0, 0.8); */
		font-size: 50rpx;
		font-weight: 400;
		position: absolute;
		z-index: 5;
	}

	.top {
		left: -100rpx;
		bottom: 130%;
	}

	.iconTop {
		left: 130rpx;
		bottom: -9rpx;
		transform: rotate(90deg);
	}

	.left {
		right: 130%;
		top: 0;
	}

	.iconLeft {
		right: -9rpx;
	}

	.right {
		left: 135%;
		top: 0;
	}

	.iconRight {
		left: -9rpx;
		top: 20rpx;
		transform: rotate(180deg);
	}

	.bottom {
		left: -100rpx;
		top: 130%;
	}

	.iconBottom {
		left: 100rpx;
		top: -9rpx;
		transform: rotate(-90deg);
	}

	.bubbleItem-title {
		/* background: rgba(0, 0, 0, 0.8); */
		padding: 15rpx;
		border-radius: 10rpx;
		width: 220rpx;
		font-size: 28rpx;
		/* color: #fff; */
		line-height: 45rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}
</style>