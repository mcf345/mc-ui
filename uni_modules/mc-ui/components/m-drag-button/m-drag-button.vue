<template>
	<view>
		<view id="m_drag_button" class="drag" :style="'left: ' + left + 'px; top:' + top + 'px;'"
			@touchstart="touchstart" @touchmove.stop.prevent="touchmove" @touchend="touchend"
			@click.stop.prevent="click" :class="{transition: isDock && !isMove,Highlighted : isHighlighted }">
			<slot name="BtnContent">
				<text>{{ text }}</text>
			</slot>

		</view>
	</view>
</template>

<script>
	// 悬浮按钮
	export default {
		name: 'm-drag-button',
		props: {
			isDock: {
				type: Boolean,
				default: false
			},
			existTabBar: {
				type: Boolean,
				default: false
			},
			initialBottom: { // 修改过，距离底部
				type: Number,
				default: 0,
			},
		},
		data() {
			return {
				top: 0,
				left: 0,
				width: 0,
				height: 0,
				offsetWidth: 0,
				offsetHeight: 0,
				windowWidth: 0,
				windowHeight: 0,
				isMove: true,
				edge: 10,
				text: '按钮',
				isHighlighted: false, // 新增高亮状态属性
			}
		},
		mounted() {
			const sys = uni.getSystemInfoSync();

			this.windowWidth = sys.windowWidth;
			this.windowHeight = sys.windowHeight;

			// #ifdef APP-PLUS
			this.existTabBar && (this.windowHeight -= 50);
			// #endif
			if (sys.windowTop) {
				this.windowHeight += sys.windowTop;
			}
			// console.log(sys)

			const query = uni.createSelectorQuery().in(this);
			query.select('#m_drag_button').boundingClientRect(data => {
				this.width = data.width;
				this.height = data.height;
				this.offsetWidth = data.width / 2;
				this.offsetHeight = data.height / 2;
				this.left = this.windowWidth - this.width - this.edge;
				this.top = this.windowHeight - this.height - this.edge - this.initialBottom;
			}).exec();
		},
		methods: {
			click() {
				this.$emit('btnClick');
				this.isHighlighted = true; // 点击时也高亮显示
				setTimeout(() => {
					this.isHighlighted = false; // 五秒后取消高亮显示
				}, 1000);
			},
			touchstart(e) {
				this.$emit('btnTouchstart');
				this.isHighlighted = true; // 开始高亮显示
			},
			touchmove(e) {
				// 单指触摸
				if (e.touches.length !== 1) {
					return false;
				}

				this.isMove = true;

				this.left = e.touches[0].clientX - this.offsetWidth;

				let clientY = e.touches[0].clientY - this.offsetHeight;
				// #ifdef H5
				clientY += this.height;
				// #endif
				let edgeBottom = this.windowHeight - this.height - this.edge;

				// 上下触及边界
				if (clientY < this.edge) {
					this.top = this.edge;
				} else if (clientY > edgeBottom) {
					this.top = edgeBottom;
				} else {
					this.top = clientY
				}

			},
			touchend(e) {
				if (this.isDock) {
					let edgeRigth = this.windowWidth - this.width - this.edge;

					if (this.left < this.windowWidth / 2 - this.offsetWidth) {
						this.left = this.edge;
					} else {
						this.left = edgeRigth;
					}

				}

				this.isMove = false;

				this.isHighlighted = false; // 结束高亮显示
				this.$emit('btnTouchend');
			},
		}
	}
</script>

<style lang="scss">
	.drag {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(84, 84, 84, 0.5);
		box-shadow: 0 0 6upx rgba(84, 84, 84, 0.4);
		color: $uni-text-color-inverse;
		width: 80upx;
		height: 80upx;
		min-width: 30px;
		min-height: 30px;
		border-radius: 50%;
		font-size: $uni-font-size-sm;
		position: fixed;
		z-index: 99;

		&.transition {
			transition: left .3s ease, top .3s ease;
		}
	}

	.Highlighted {
		background-color: rgba(81, 208, 208, .8);
	}
</style>