<template>
	<view class="m-field custom-search" :style="{ 
        borderBottom: borderBottom ? '1px solid #ccc' : 'none',
        padding: paddings,
        backgroundColor: backgroundColor,
        'border-color': borderColor,
        borderWidth: borderWidth }" @tap="handleTap">
		<view class="search-label"
			:style="{ width: labelWidth, textAlign: labelAlign, fontSize: labelFontSizeWithUnit, color: labelColor, fontWeight: labelWeight }">
			<slot name="custom-label">{{ label }}</slot>
		</view>
		<view class="search-value"
			:style="{ fontSize: valueFontSizeWithUnit, color: valueColor, fontWeight: valueWeight, whiteSpace: overflow === 'wrap' ? 'normal' : 'nowrap' }">
			<slot name="custom-value">{{ value }}</slot>
		</view>

		<view class="Mine_Filed_Icon">
			<slot name="custom-Icon">
				<uni-icons v-if="Icon" :type="Icon" color="#797979" size="20"></uni-icons>
			</slot>
		</view>
	</view>
</template>

<script>
	/**
	 * m-field 自定义Cell组件
	 * @description 此组件用于通用cell展示	
	 * @property {String}			label				左侧显示数据
	 * @property {String | Number}		value				右侧显示数据	
	 * @property {String}				labelWidth			左侧数据占用宽度（默认：fit-content）
	 * @property {Boolean}				borderBottom		是否展示组件下方横线
	 * @property {String}				backgroundColor		组件背景色定义 （默认：透明）
	 * @property {String}				borderColor			(无效) 组件外边框颜色定义 （默认：#ccc）
	 * @property {String}				borderWidth			(无效) 组件外边框宽度 （默认：1px）
	 * @property {String}				labelAlign			文本对齐方式 (默认：left)
	 * @property {String}				labelFontSize		左侧文本字体大小
	 * @example  <m-field valueFontSize="24rpx" labelFontSize="24rpx" borderWidth="80rpx" paddings="8rpx" :borderBottom="false" label="设备" value="EquipmentName"></m-field>
	 */
	export default {
		name: "m-field",
		props: {
			label: {
				type: String,
				default: ''
			},
			value: {
				type: [Number, String],
				default: null
			},
			// 左侧label宽度
			labelWidth: {
				type: String,
				// default: '80px'
				default: 'fit-content'
			},
			borderBottom: {
				type: Boolean,
				default: true
			},
			backgroundColor: {
				type: String,
				default: "transparent" // 默认背景色为透明
			},
			borderColor: {
				type: String,
				default: "#ccc" // 默认边框颜色为灰色
			},
			borderWidth: {
				type: String,
				default: "1px" // 默认边框宽度为1像素
			},
			labelAlign: {
				type: String,
				default: 'left'
			},
			labelFontSize: {
				type: [Number, String],
				default: '14'
			},
			valueFontSize: {
				type: [Number, String],
				default: '14'
			},
			valueColor: {
				type: String,
				default: '#333' // 默认颜色为黑色
			},
			valueWeight: {
				type: String,
				default: '400' // 默认颜色为黑色
			},
			paddings: {
				type: String,
				default: 10
			},
			labelColor: {
				type: String,
				default: '#999' // 默认颜色为黑色
			},
			labelWeight: {
				type: String,
				default: '400' // 默认颜色为黑色
			},
			// 溢出省略或换行
			overflow: {
				type: String,
				default: 'ellipsis' // 默认为省略   换行 - wrap
			},
			// 右侧图标
			Icon: {
				type: String,
				default: '' // 
			}
		},
		computed: {
			labelFontSizeWithUnit() {
				return typeof this.labelFontSize === 'number' ? this.labelFontSize + 'px' : this.labelFontSize;
			},
			valueFontSizeWithUnit() {
				return typeof this.valueFontSize === 'number' ? this.valueFontSize + 'px' : this.valueFontSize;
			}
		},
		methods: {
			handleTap() {
				this.$emit('click');
			},
		}
	}
</script>

<style lang="scss">
	.custom-search {
		@include flex(start, center)
	}

	.search-label {
		margin-right: 10px;
	}

	.search-value {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>