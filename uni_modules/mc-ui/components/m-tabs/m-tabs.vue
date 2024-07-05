<template>
	<view class="tabBlock" v-if="list.length > 0">
		<scroll-view scroll-x="true" scroll-with-animation :scroll-left="tabsScrollLeft" @scroll="scroll"
			:style="{paddingRight: showFilter ? '60rpx':'0rpx'}">
			<view class="tab" id="tab_list">
				<view v-for="(item, index) in list" :key="index"
					:class="['tab__item', {'tab__item--active': currentIndex === index}]"
					:style="{color: (currentIndex === index ? `${itemColor}`: '')}" id="tab_item"
					@click="select(item, index)">
					<view class="tab__item-title">
						<slot name="title" :title="item[format['TabText']]"></slot>
					</view>
					<view v-if="!showTitleSlot" class="tab__item-title">
						{{item[format['TabText']]}}
					</view>
				</view>
			</view>
			<view class="tab__line"
				:style="{background: lineColor, width: lineStyle.width, transform: lineStyle.transform,transitionDuration: lineStyle.transitionDuration}">
			</view>
		</scroll-view>

		<slot></slot>

		<view class="showFilter" v-if="showFilter" @tap.stop="headClickFilter">
			<slot name="filterBox">
				<uni-icons type="list" color="#999" size="30"></uni-icons>
			</slot>
		</view>

	</view>
</template>

<script>
	export default {
		name: 'm-tabs',
		props: {
			format: {
				type: Object,
				default: () => {
					return {
						TabText: 'title', // Tab显示字段
						BackKey: 'index', // 点击切换Tab后，返回的指定数据，默认返回索引
					}
				}
			},
			value: [Number, String],
			// 传值
			list: {
				type: Array,
				default: () => {
					return []
				}
			},
			// tab主色调
			itemColor: String,
			// 下划线主色调
			lineColor: String,
			// 是否展示下划线动画
			lineAnimated: {
				type: Boolean,
				default: true
			},
			// 是否展示右侧筛选按钮
			showFilter: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				currentIndex: 0,
				lineStyle: {},
				scrollLeft: 0,
				tabsScrollLeft: 0,
				duration: 0.3
			}
		},
		computed: {
			showTitleSlot() {
				return this.$scopedSlots[this.format['TabText']]
			}
		},
		watch: {
			list() {
				this.setTabList()
			},
			value() {
				this.currentIndex = this.value
				this.setTabList()
			}
		},
		mounted() {
			this.currentIndex = this.value
			this.setTabList()
			if (!this.lineAnimated) {
				this.duration = 0
			}
			console.log(this.$scopedSlots)
		},
		methods: {
			select(item, index) {
				let BackData = index;
				if (this.format['BackKey'] == 'index') {
					BackData = index;
				} else {
					BackData = item[this.format['BackKey']];
				}
				this.$emit('input', index);

				this.$emit('click', BackData);
			},
			setTabList() {
				this.$nextTick(() => {
					if (this.list.length > 0) {
						this.setLine()
						this.scrollIntoView()
					}
				})
			},
			setLine() {
				let lineWidth = 0,
					lineLeft = 0
				this.getElementData(`#tab_item`, (data) => {
					let el = data[this.currentIndex]
					lineWidth = el.width / 2
					// lineLeft = el.width * (this.currentIndex + 0.5)  // 此种只能针对每个item长度一致的
					lineLeft = el.width / 2 + (-data[0].left) + el.left
					this.lineStyle = {
						width: `${lineWidth}px`,
						transform: `translateX(${lineLeft}px) translateX(-50%)`,
						transitionDuration: `${this.duration}s`
					};
				})
			},
			scrollIntoView() { // item滚动
				let lineLeft = 0;
				this.getElementData('#tab_list', (data) => {
					let list = data[0]
					this.getElementData(`#tab_item`, (data) => {
						let el = data[this.currentIndex]
						// lineLeft = el.width * (this.currentIndex + 0.5) - list.width / 2 - this.scrollLeft
						lineLeft = el.width / 2 + (-list.left) + el.left - list.width / 2 - this.scrollLeft
						this.tabsScrollLeft = this.scrollLeft + lineLeft
					})
				})
			},
			getElementData(el, callback) {
				uni.createSelectorQuery().in(this).selectAll(el).boundingClientRect().exec((data) => {
					callback(data[0]);
				});
			},
			scroll(e) {
				this.scrollLeft = e.detail.scrollLeft;
			},
			headClickFilter() { // 点击filter标签
				if (this.$slots.filterBox) return;

				console.log(this.$slots.filterBox)

				this.$emit('TapFilter')
			},
		}
	}
</script>

<style lang="scss">
	.tabBlock {
		position: relative;
		background: #fff;

		.tab {
			position: relative;
			display: flex;
			font-size: 28rpx;
			// padding-bottom: 8px;
			white-space: nowrap;

			&__item {
				flex: 1;
				// width: 30%;
				text-align: center;
				line-height: 45px;
				color: $uni-text-color;

				&--active {
					color: $uni-color-primary;
				}

				&-title {
					margin: 0 20px;
				}
			}
		}

		.tab__line {
			display: block;
			height: 3px;
			position: absolute;
			bottom: 1px;
			left: 0;
			z-index: 1;
			border-radius: 3rpx;
			position: relative;
			background: $uni-color-primary;
		}


		.showFilter {
			min-width: 60rpx;
			width: fit-content;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			right: 0;
			top: 0;
			z-index: 999;
			background-color: #fff;

			&::before {
				content: '';
				/* 必须设置content属性，哪怕为空 */
				display: inline-block;
				/* 使得伪元素成为行内块级元素 */
				width: 1px;
				/* 竖线的宽度 */
				height: 80%;
				/* 竖线的高度，根据需要调整 */
				background-color: #e6e6e6;
				/* 竖线的颜色 */
				vertical-align: middle;
				/* 根据需要调整竖线的垂直对齐方式 */
				margin-right: 10px;
				/* 竖线与文本之间的间距 */
			}
		}
	}
</style>