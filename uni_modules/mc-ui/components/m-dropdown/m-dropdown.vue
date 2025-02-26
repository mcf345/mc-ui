<template>
	<view class="m-dropdown">
		<view class="m-dropdown__menu" :style="{height: $utils.addUnit(height)}"
			:class="{'u-border-bottom': borderBottom}">
			<view class="m-dropdown__menu__item" v-for="(item, index) in menuList" :key="index"
				@tap.stop="menuClick(index)">
				<view class="x-f" style="flex-direction: row;">
					<view class="m-dropdown__menu__item__text"
						:style="{color: item.disabled ? '#c0c4cc' : (index === current || highlightIndex == index) ? activeColor : inactiveColor,fontSize: $utils.addUnit(titleSize)}">
						<slot name="menuText" :element="item">{{item.title}}</slot>
					</view>

					<view class="m-dropdown__menu__item__arrow"
						:class="{'m-dropdown__menu__item__arrow--rotate': index === current}">
						<u-icon :custom-style="{display: 'flex'}" :name="menuIcon" :size="$utils.addUnit(menuIconSize)"
							:color="index === current || highlightIndex == index ? activeColor : '#c0c4cc'"></u-icon>
					</view>
				</view>
			</view>

			<slot name="filter"></slot>
		</view>
		<view class="m-dropdown__content"
			:style="[contentStyle, {transition: `opacity ${duration / 1000}s linear`,top: $utils.addUnit(height),height: contentHeight + 'px'}]"
			@tap="maskClick" @touchmove.stop.prevent>
			<view @tap.stop.prevent class="m-dropdown__content__popup" :style="[popupStyle]">
				<slot></slot>
			</view>
			<view class="m-dropdown__content__mask"></view>
		</view>
	</view>
</template>

<script>
	/**
	 * dropdown 下拉菜单
	 * @description 该组件一般用于向下展开菜单，同时可切换多个选项卡的场景
	 * @property {String} active-color 标题和选项卡选中的颜色（默认#2979ff）
	 * @property {String} inactive-color 标题和选项卡未选中的颜色（默认#606266）
	 * @property {Boolean} close-on-click-mask 点击遮罩是否关闭菜单（默认true）
	 * @property {Boolean} close-on-click-self 点击当前激活项标题是否关闭菜单（默认true）
	 * @property {String | Number} duration 选项卡展开和收起的过渡时间，单位ms（默认300）
	 * @property {String | Number} height 标题菜单的高度，单位任意（默认80）
	 * @property {String | Number} border-radius 菜单展开内容下方的圆角值，单位任意（默认0）
	 * @property {Boolean} border-bottom 标题菜单是否显示下边框（默认false）
	 * @property {String | Number} title-size 标题的字体大小，单位任意，数值默认为rpx单位（默认28）
	 * @event {Function} open 下拉菜单被打开时触发
	 * @event {Function} close 下拉菜单被关闭时触发
	 * @example <m-dropdown></m-dropdown>
	 */
	export default {
		name: 'm-dropdown',
		props: {
			// 菜单标题和选项的激活态颜色
			activeColor: {
				type: String,
				default: '#2979ff'
			},
			// 菜单标题和选项的未激活态颜色
			inactiveColor: {
				type: String,
				default: '#606266'
			},
			// 点击遮罩是否关闭菜单
			closeOnClickMask: {
				type: Boolean,
				default: true
			},
			// 点击当前激活项标题是否关闭菜单
			closeOnClickSelf: {
				type: Boolean,
				default: true
			},
			// 过渡时间
			duration: {
				type: [Number, String],
				default: 300
			},
			// 标题菜单的高度，单位任意，数值默认为rpx单位
			height: {
				type: [Number, String],
				default: 80
			},
			// 是否显示下边框
			borderBottom: {
				type: Boolean,
				default: false
			},
			// 标题的字体大小
			titleSize: {
				type: [Number, String],
				default: 28
			},
			// 下拉出来的内容部分的圆角值
			borderRadius: {
				type: [Number, String],
				default: 0
			},
			// 菜单右侧的icon图标
			menuIcon: {
				type: String,
				default: 'arrow-down'
			},
			// 菜单右侧图标的大小
			menuIconSize: {
				type: [Number, String],
				default: 26
			}
		},
		data() {
			return {
				showDropdown: true, // 是否打开下来菜单,
				menuList: [], // 显示的菜单
				active: false, // 下拉菜单的状态
				// 当前是第几个菜单处于激活状态，小程序中此处不能写成false或者""，否则后续将current赋值为0，
				// 无能的TX没有使用===而是使用==判断，导致程序认为前后二者没有变化，从而不会触发视图更新
				current: 99999,
				// 外层内容的样式，初始时处于底层，且透明
				contentStyle: {
					zIndex: -1,
					opacity: 0
				},
				// 让某个菜单保持高亮的状态
				highlightIndex: 99999,
				contentHeight: 0
			}
		},
		computed: {
			// 下拉出来部分的样式
			popupStyle() {
				let style = {};
				// 进行Y轴位移，展开状态时，恢复原位。收齐状态时，往上位移100%，进行隐藏
				style.transform = `translateY(${this.active ? 0 : '-100%'})`
				style['transition-duration'] = this.duration / 1000 + 's';
				style.borderRadius =
					`0 0 ${this.$utils.addUnit(this.borderRadius)} ${this.$utils.addUnit(this.borderRadius)}`;
				return style;
			}
		},
		created() {
			// 引用所有子组件(m-dropdown-item)的this，不能在data中声明变量，否则在微信小程序会造成循环引用而报错
			this.children = [];
		},
		watch: {
			menuList(nVal) {
				console.log(nVal)
			},
		},
		mounted() {
			this.getContentHeight();
		},
		methods: {
			init() {
				// 当某个子组件内容变化时，触发父组件的init，父组件再让每一个子组件重新初始化一遍
				// 以保证数据的正确性
				this.menuList = [];
				this.children.map(child => {
					child.init();
				})
			},
			// 点击菜单
			menuClick(index) {
				// 判断是否被禁用
				if (this.menuList[index].disabled) return;
				// 如果点击时的索引和当前激活项索引相同，意味着点击了激活项，需要收起下拉菜单
				if (index === this.current && this.closeOnClickSelf) {
					this.close();
					// 等动画结束后，再移除下拉菜单中的内容，否则直接移除，也就没有下拉菜单收起的效果了
					setTimeout(() => {
						this.children[index].active = false;
					}, this.duration)
					return;
				}
				this.open(index);
			},
			// 打开下拉菜单
			open(index) {
				// 嵌套popup使用时可能获取不到正确的高度，重新计算
				if (this.contentHeight < 1) this.getContentHeight()
				// 重置高亮索引，否则会造成多个菜单同时高亮
				// this.highlightIndex = 9999;
				// 展开时，设置下拉内容的样式
				this.contentStyle = {
					zIndex: 11,
				}
				// 标记展开状态以及当前展开项的索引
				this.active = true;
				this.current = index;
				// 历遍所有的子元素，将索引匹配的项标记为激活状态，因为子元素是通过v-if控制切换的
				// 之所以不是因display: none，是因为nvue没有display这个属性
				this.children.map((val, idx) => {
					val.active = index == idx ? true : false;
				})
				this.$emit('open', this.current);
			},
			// 设置下拉菜单处于收起状态
			close() {
				this.$emit('close', this.current);
				// 设置为收起状态，同时current归位，设置为空字符串
				this.active = false;
				this.current = 99999;
				// 下拉内容的样式进行调整，不透明度设置为0
				this.contentStyle = {
					zIndex: -1,
					opacity: 0
				}
			},
			// 点击遮罩
			maskClick() {
				// 如果不允许点击遮罩，直接返回
				if (!this.closeOnClickMask) return;
				this.close();
			},
			// 外部手动设置某个菜单高亮
			highlight(index = undefined) {
				this.highlightIndex = index !== undefined ? index : 99999;
			},
			// 获取下拉菜单内容的高度
			getContentHeight() {
				let that = this;
				// 这里的原理为，因为dropdown组件是相对定位的，它的下拉出来的内容，必须给定一个高度
				// 才能让遮罩占满菜单一下，直到屏幕底部的高度
				uni.getSystemInfo({
					success: function(e) {
						let windowHeight = e.windowHeight;
						that.uGetRect('.m-dropdown__menu').then(res => {
							that.contentHeight = windowHeight - res.bottom;
						})
					}
				})


			},
			// 查询节点信息
			// 目前此方法在支付宝小程序中无法获取组件跟接点的尺寸，为支付宝的bug(2020-07-21)
			// 解决办法为在组件根部再套一个没有任何作用的view元素
			uGetRect(selector, all) {
				return new Promise((resolve) => {
					uni.createSelectorQuery()
						.in(this)[all ? 'selectAll' : 'select'](selector)
						.boundingClientRect((rect) => {
							if (all && Array.isArray(rect) && rect.length) {
								resolve(rect)
							}
							if (!all && rect) {
								resolve(rect)
							}
						})
						.exec()
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.x-f {
		display: flex;
		align-items: center;
	}

	.m-dropdown {
		flex: 1;
		width: 100%;
		position: relative;

		&__menu {
			// @include flex;
			display: flex;
			position: relative;
			z-index: 11;
			height: 40px;

			&__item {
				flex: 1;
				// @include flex;
				display: flex;
				justify-content: center;
				align-items: center;

				&__text {
					font-size: 14px;
					color: #606266;
				}

				&__arrow {
					margin-left: 6rpx;
					transition: transform .3s;
					display: flex;
					align-items: center;
					// @include flex;
					width: fit-content;

					&--rotate {
						transform: rotate(180deg);
					}
				}
			}
		}

		&__content {
			position: absolute;
			z-index: 120;
			width: 100%;
			left: 0px;
			bottom: 0;
			overflow: hidden;


			&__mask {
				position: absolute;
				z-index: 90;
				background: rgba(0, 0, 0, .3);
				width: 100%;
				left: 0;
				top: 0;
				bottom: 0;
			}

			&__popup {
				position: relative;
				z-index: 100;
				transition: all 0.3s;
				transform: translate3D(0, -100%, 0);
				overflow: hidden;
			}
		}

	}
</style>