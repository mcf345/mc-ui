<template>
	<view class="dropdown-menu-wrapper" @click.stop="toggleDropdown(false)" :style="{'z-index' : zIndex}">
		<view class="defaultmenu">
			<slot name="default" :element="isDropdownVisible"></slot>
		</view>

		<view class="dropdown-container" v-show="isDropdownVisible" @click.stop="toggleDropdown(false)">
			<view class="dropdown-content" :style="{'margin-top': formatMarginTop}">
				<view class="dropdown-content-main">
					<slot name="Card">
						<view class="x-bc MenuCell" v-for="(item,index) in options"
							:style="{color: item.value == value.value ? '#3d9edf' : '#333'}" :key="index"
							@click.stop="selectItem(item)">
							<text>{{item.text}}</text>

							<u-icon name="checkbox-mark" v-if="item.value == value.value" color="#3fba19"
								size="24"></u-icon>

						</view>
					</slot>
				</view>


			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "m-dropdown-menu",
		props: {
			value: { // 选中的数据
				type: Object,
				default: {}
			},
			options: {
				type: Array,
				default: []
			},
			// KeyID: {
			// 	type: String,
			// 	default: 'Menu',
			// 	required: true
			// },
			zIndex: {
				type: [String, Number],
				default: 999
			},
			marginTop: {
				type: [String, Number]
			}
		},
		data() {
			return {
				isDropdownVisible: false, // 控制下拉框的显示与隐藏  
			};
		},
		computed: {
			formatMarginTop() { // 格式化marginTop参数

				if (!this.$utils.isEmpty(this.marginTop)) {
					if (this.marginTop.includes('px')) {
						return this.marginTop;
					} else {
						return this.marginTop + 'px';
					}
				} else {
					return '0px';
				}
			},
		},
		mounted() {
			let that = this;

		},
		methods: {
			toggleDropdown(stopPropagation) {
				if (!stopPropagation) {
					this.isDropdownVisible = !this.isDropdownVisible;
				}
			},
			selectItem(data) { // 选中项
				this.$emit('selectItem', data);
				this.toggleDropdown(false);
			},
		},
	};
</script>

<style scoped lang="scss">
	.defaultmenu {
		z-index: 999;
	}

	.dropdown-menu-wrapper {
		position: relative;
		/* width: 100%; */
		width: fit-content;
		/* 可以根据需要调整 */
	}

	.dropdown-container {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100vw;
	}

	.dropdown-content {
		background-color: rgba(0, 0, 0, 0.5);
		position: fixed;
		left: 0;
		width: 100vw;
		z-index: 99;
		height: 100%;
		overflow: auto;
		border: 1px solid #333;

		.dropdown-content-main {
			position: absolute;
			left: 0;
			top: -1px;
			width: 100%;
			background-color: #fff;
			max-height: 60vh;
			overflow: auto;
		}
	}

	.MenuCell {
		border-bottom: 1px solid #efefef;
		padding: 16rpx 20rpx;
		font-size: 14px;

		&:last-child {
			border-bottom: none;
		}
	}
</style>