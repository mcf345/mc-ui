<template>
	<view class="m-radio radio-group" :class="{'x-f': flexRow}">
		<view v-for="(item, index) in options" :key="index" class="radio-item"
			:style="{'margin':margin,'width':setWidth}" @tap="selectItem(index)">
			<m-badge :count="item.count ? item.count : null" :position="badgePosition" style="width: 100%;">
				<view class="radio-icon"
					:class="{ 'radio-icon-selected': value === (!$utils.isEmpty(formtData) ? item[formtData['hidKey']] : index), 'radio-icon-circle': shape === 'circle', 'radio-icon-square': shape === 'square' }"
					:style="{ backgroundColor: value === (!$utils.isEmpty(formtData) ? item[formtData['hidKey']] : index) ? item.contentActiveColor ? item.contentActiveColor : contentActiveColor : InitBackgroundColor,border: value === (!$utils.isEmpty(formtData) ? item[formtData['hidKey']] : index) ?'1px solid '+ item.color : 'none',borderRadius: borderRadius,height:itemHeight}">
					<u-icon v-if="item.TextIcon" :name="item.TextIcon"
						:color="value === (!$utils.isEmpty(formtData) ? item[formtData['hidKey']] : index) ? item.color ? item.color : contentActiveTextColor : contentInitTextColor"
						size="18"></u-icon>
					<text
						:style="{ color: value === (!$utils.isEmpty(formtData) ? item[formtData['hidKey']] : index) ? item.color ? item.color : contentActiveTextColor : contentInitTextColor,fontSize:fontSize  }">{{ !$utils.isEmpty(formtData) ? item[formtData['showText']] : item['content'] }}</text>
				</view>
			</m-badge>
		</view>
	</view>
</template>

<script>
	export default {
		name: "m-radio",
		props: {
			options: {
				type: Array,
				default: () => []
			},
			shape: {
				type: String,
				default: '' // 默认形状为方形
			},
			InitBackgroundColor: { // 默认未选中背景色
				type: String,
				default: '#f1f1f1'
			},
			contentInitTextColor: { // 默认未选中文字颜色
				type: String,
				default: '#333'
			},
			contentActiveColor: { // 默认选中背景色
				type: String,
				default: '#a8a8a8'
			},
			contentActiveTextColor: { // 默认选中文字颜色
				type: String,
				default: '#333'
			},
			TextIcon: {
				type: String,
				default: '' // 默认未选中颜色
			},
			value: { // 选中项
				type: [Number, String],
				default: -1
			},
			margin: {
				type: String,
				default: '0 10px 0 0'
			},
			borderRadius: {
				type: String,
				default: '0'
			},
			flexRow: {
				type: Boolean,
				default: true,
			},
			fontSize: {
				type: String,
				default: '24rpx'
			},
			itemHeight: {
				type: String,
				default: '30px'
			},
			setWidth: {
				type: String,
				default: ''
			},
			formtData: {
				type: Object,
				default: () => {
					return {
						// showText: 'content',
						// hidKey: 'value'
					}
				}
			},
			badgePosition: { // 徽标方位
				type: Object,
				default: () => {
					let AData = {
						top: '-4px',
						right: '-4px',
					}
					return AData
				}
			}
		},
		data() {
			return {};
		},
		created() {
			console.log(this.badgePosition)
		},
		methods: {
			selectItem(index) {
				// 触发选中事件
				this.$emit('change', {
					data: this.options[index],
					Index: index
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.radio-group {
		width: 100%;
	}

	.radio-item {}

	.radio-icon {
		// width: 30px;
		flex: 1;
		width: 100%;
		// height: 30px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.radio-icon-circle {}

	.radio-icon-square {
		min-width: 80px;
		// max-width: 30%;
		/* 可自定义形状 */
	}

	.radio-icon-selected {
		color: #fff;
		/* 可自定义选框内容颜色 */
	}
</style>