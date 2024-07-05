<template>
	<scroll-view class="scroll-view-with-transition" scroll-y :style="[getScrollStyle]" :scroll-top="scrollTop"
		:scroll-with-animation="true" @scroll="handleScroll">
		<movable-area :style="[getAreaStyle]">
			<movable-view v-for="(item, index) in list" :animation="animation" :direction="direction" :key="item.key"
				style="margin-bottom: 20px;" :damping="damping" :x="item.x" :y="item.y"
				:disabled="longpress ? disabled : false" @longpress="handleLongpress(item,index)"
				@touchstart="handleDragStart(item,index)" @change="handleMoving" @touchend="handleDragEnd"
				:style="[getViewStyle]" class="base-drag-wrapper" :class="{ active: activeIndex === index }">
				<!-- #ifdef MP-WEIXIN -->
				<view class="drag-item">{{ item[itemKey] }}</view>
				<!-- #endif -->

				<!-- #ifndef MP-WEIXIN -->
				<slot name="item" :element="item" :index="index"></slot>
				<!-- #endif -->
			</movable-view>
		</movable-area>
	</scroll-view>
</template>

<script>
	export default {
		name: 'm-basic-drag',
		props: {
			column: {
				type: Number,
				default: 3
			},
			value: {
				type: Array,
				default: () => []
			},
			width: {
				type: String,
				default: '100%'
			},
			height: {
				type: String,
				default: 'auto'
			},
			itemKey: {
				type: String,
				required: true
			},
			itemHeight: {
				type: String,
				default: '100px'
			},
			direction: {
				type: String,
				default: 'all',
				validator: value => {
					return ['all', 'vertical', 'horizontal', 'none'].includes(value);
				}
			},
			animation: {
				type: Boolean,
				default: true
			},
			damping: {
				type: Number,
				default: 20
			},
			longpress: {
				type: Boolean,
				default: true
			},
			PageFun: {
				type: String,
				default: '',
			}
		},
		data() {
			return {
				list: [],
				disabled: true,
				activeIndex: -1,
				moveToIndex: -1,
				oldIndex: -1,
				tempDragInfo: {
					x: '',
					y: ''
				},
				cloneList: [],
				scrollTop: 0,
				indexRange: [],
			};
		},
		computed: {
			getScrollStyle() {
				const width = this.getRealWidth(this.width);
				return {
					width: width + 'px',
					height: this.height
				};
			},
			getAreaStyle() {
				const width = this.getRealWidth(this.width);
				return {
					width: width + 'px',
					height: Math.ceil(this.list.length / this.column) * this.getItemHeight + 2 + 'px'
				};
			},
			getViewStyle() {
				const {
					itemHeight,
					getItemWidth
				} = this;
				return {
					width: getItemWidth + 'px',
					height: itemHeight
				};
			},
			getItemHeight() {
				return parseFloat(this.itemHeight);
			},
			getItemWidth() {
				if (this.column === 0) return;
				const width = this.getRealWidth(this.width);
				return (parseFloat(width) / this.column).toFixed(2);
			}
		},
		methods: {
			//获取实际的宽度
			getRealWidth(width) {
				if (width.includes('%')) {
					const windowWidth = uni.getSystemInfoSync().windowWidth;
					width = windowWidth * (parseFloat(width) / 100);
				}
				return width;
			},

			initList(list = []) {
				const newList = this.deepCopy(list);
				this.list = newList.map((item, index) => {
					const [x, y] = this.getPosition(index);
					return {
						...item,
						x,
						y,
						key: Math.random() + index
					};
				});
				this.cloneList = this.deepCopy(this.list);
			},

			//长按
			handleLongpress(data, index) {
				uni.hideToast();


				//安卓和ios需要单独处理
				if (uni.getSystemInfoSync().platform == "ios") {
					let UIImpactFeedbackGenerator = plus.ios.importClass('UIImpactFeedbackGenerator');
					let impact = new UIImpactFeedbackGenerator();
					impact.prepare();
					impact.init(1);
					impact.impactOccurred();
				}
				if (uni.getSystemInfoSync().platform == "android") {
					// uni.vibrateShort({
					// 	success: function() {
					// console.log('success');
					plus.device.vibrate(90);
					// 	}
					// });
				}


				this.disabled = false;


				if (!this.$utils.isEmpty(this.PageFun) && this.PageFun == 'Dispatch') { // 派工工艺路线
					// 如果选中的是已报工的，禁止拖拽
					if (data.WCQty > 0) {
						this.disabled = true;
						return this.$utils.msg(data.ProcedureName + '已报工，禁止排序！')
					}

					// 记录当前选中项可拖拽的范围
					function findSurroundingWCQtyIndices(arr, selectedIndex) {
						let startIndex = null; // 上一个WCQty大于0的索引  
						let endIndex = null; // 下一个WCQty大于0的索引  

						// 遍历数组，找到上一个WCQty大于0的索引  
						for (let i = selectedIndex - 1; i >= 0; i--) {
							if (arr[i].WCQty > 0) {
								startIndex = i + 1;
								break;
							}
						}
						// 如果没有找到上一个WCQty大于0的索引，则设置为0  
						if (startIndex === null) {
							startIndex = 0;
						}

						// 遍历数组，找到下一个WCQty大于0的索引  
						for (let i = selectedIndex + 1; i < arr.length; i++) {
							if (arr[i].WCQty > 0) {
								endIndex = i - 1;
								break;
							}
						}
						// 如果没有找到下一个WCQty大于0的索引，则设置为数组末尾的索引  
						if (endIndex === null) {
							endIndex = arr.length - 1;
						} else if (endIndex == 0) {
							endIndex = 0
						}

						// 返回结果对象  
						return [startIndex, endIndex];
					}

					let indexRange = findSurroundingWCQtyIndices(this.value, index);
					// console.log(indexRange)

					this.indexRange = indexRange;

				}
			},

			//拖拽开始
			handleDragStart(data, index) {

				this.activeIndex = index;
				this.oldIndex = index;
			},

			//拖拽中
			handleMoving(e) {
				if (e.detail.source !== 'touch' || this.disabled) return;
				const {
					x,
					y
				} = e.detail;
				Object.assign(this.tempDragInfo, {
					x,
					y
				});
				const currentX = Math.floor((x + this.getItemWidth / 2) / this.getItemWidth);
				const currentY = Math.floor((y + this.getItemHeight / 2) / this.getItemHeight);

				this.moveToIndex = Math.min(currentY * this.column + currentX, this.list.length - 1);
				// console.log(currentY)
				// 计算自动滚动
				this.autoScroll(y);

				if (this.oldIndex !== this.moveToIndex && this.oldIndex !== -1 && this.moveToIndex !== -1) {
					const newList = this.deepCopy(this.cloneList);
					newList.splice(this.moveToIndex, 0, ...newList.splice(this.activeIndex, 1));

					this.list.forEach((item, index) => {
						if (index !== this.activeIndex) {
							const itemIndex = newList.findIndex(val => val[this.itemKey] === item[this.itemKey]);
							[item.x, item.y] = this.getPosition(itemIndex);
						}
					});
					this.oldIndex = this.moveToIndex;
					this.scrollIntoView();
				}
			},
			// 自动滚动
			autoScroll(y) {
				const areaHeight = parseFloat(this.getAreaStyle.height);
				const scrollThreshold = 50; // 边缘触发滚动的阈值
				const scrollSpeedFactor = 2; // 滚动速度因子

				if (y < scrollThreshold) {
					// 向上滚动
					this.scrollTop = Math.max(0, this.scrollTop - scrollSpeedFactor * (scrollThreshold - y));
				} else if (areaHeight - y < scrollThreshold) {
					// 向下滚动
					this.scrollTop = Math.min(areaHeight, this.scrollTop + scrollSpeedFactor * (scrollThreshold - (
						areaHeight - y)));
				}
			},

			//获取当前的位置
			getPosition(index) {
				const x = (index % this.column) * this.getItemWidth;
				const y = Math.floor(index / this.column) * this.getItemHeight;
				return [x, y];
			},

			//拖拽结束
			handleDragEnd(e) {
				if (this.disabled) return;

				if (this.moveToIndex !== -1 && this.activeIndex !== -1 && this.moveToIndex !== this.activeIndex) {
					this.cloneList.splice(this.moveToIndex, 0, ...this.cloneList.splice(this.activeIndex, 1));
				} else {
					this.$set(this.list[this.activeIndex], 'x', this.tempDragInfo.x);
					this.$set(this.list[this.activeIndex], 'y', this.tempDragInfo.y);
				}

				this.initList(this.cloneList);
				let endList = this.list.map(item => this.omit(item, ['x', 'y', 'key']));




				if (!this.$utils.isEmpty(this.PageFun) && this.PageFun == 'Dispatch') { // 派工工艺路线

					if (this.moveToIndex != this.activeIndex && this.moveToIndex != -1) {

						if (this.moveToIndex >= this.indexRange[0] && this.moveToIndex <= this.indexRange[1]) {
							// 如果在区间范围内

						} else {
							this.list = JSON.parse(JSON.stringify(this.value));
							endList = this.list.map(item => this.omit(item, ['x', 'y', 'key']));

							// let msg = ''
							// if (this.moveToIndex < this.indexRange[0]) {
							// 	// 前
							// 	msg = '前'
							// } else if (this.moveToIndex > this.indexRange[1]) {
							// 	// 后
							// 	msg = '后'
							// }
							let msg = (this.moveToIndex < this.indexRange[0]) ? '前' : (this.moveToIndex > this.indexRange[
								1]) ? '后' : '';
							this.$utils.msg('禁止将工序拖动到已报工数据' + msg)
						}
					}
				}

				this.$emit('input', endList);
				this.$emit('end', endList);

				this.activeIndex = -1;
				this.oldIndex = -1;
				this.moveToIndex = -1;
				this.disabled = true;
			},

			scrollIntoView() {
				if (this.height === 'auto') return;
				const {
					height,
					moveToIndex,
					getItemHeight,
					scrollTop
				} = this;

				if ((moveToIndex + 1) * this.getItemHeight >= scrollTop + parseFloat(height)) {
					this.scrollTop = Math.min(parseFloat(this.getAreaStyle.height), scrollTop + Math.ceil(moveToIndex /
						2) * this.getItemHeight);
				} else if ((moveToIndex - 1) * this.getItemHeight <= scrollTop) {
					this.scrollTop = Math.max(0, scrollTop - Math.ceil(moveToIndex / 2) * this.getItemHeight);
				}
			},

			setScrollTop(index) {
				this.scrollTop = index * this.getItemHeight;
			},

			handleScroll(e) {
				this.scrollTop = e.detail.scrollTop;
			},

			deepCopy(source) {
				return JSON.parse(JSON.stringify(source));
			},

			/**
			 * 排除掉obj里面的key值
			 * @param {object} obj
			 * @param {Array|string} args
			 * @returns {object}
			 */
			omit(obj, args) {
				if (!args) return obj;
				const newObj = {};
				const isString = typeof args === 'string';
				const keys = Object.keys(obj).filter(item => {
					if (isString) {
						return item !== args;
					}
					return !args.includes(item);
				});

				keys.forEach(key => {
					if (obj[key] !== undefined) newObj[key] = obj[key];
				});
				return newObj;
			}
		},
		watch: {
			value: {
				handler() {
					this.initList(this.value);
				},
				immediate: true,
				deep: true
			}
		}
	};
</script>

<style lang="scss" scoped>
	.base-drag-wrapper {
		opacity: 1;
		z-index: 1;
		margin-bottom: 0 !important;

		&.active {
			opacity: 0.8;
			transform: scale(1.3);
			z-index: 99;
		}
	}

	.scroll-view-with-transition {
		transition: scroll-top 0.3s ease;
		// background-color: green;
		/* 添加滚动位置变化的过渡效果 */
	}

	// uni-movable-area {
	// 	height: 350px !important;
	// }
</style>