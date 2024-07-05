<template>
	<view class="content">
		<view class="content_main" style="padding: 0 10px;">

			<view class="content_main_CardBox" v-for="(row, index) in 2" :key="index">
				<text>{{row == 1 ? '设定【label-width】' : '未设定【label-width】，默认 【fit-content】'}}</text>
				<m-field valueFontSize="24rpx" labelFontSize="24rpx" paddings="8rpx" :borderBottom="false"
					:label-width="row == 1 ? '120px' : 'fit-content'" label="测试label:" :value="'数据测试' + (row+1)">
				</m-field>
			</view>

			<view class="content_main_CardBox">
				<text>自定义插槽，依然继承传参的属性，也可自定义修改</text>
				<m-field valueFontSize="24rpx" labelFontSize="24rpx" paddings="8rpx" :borderBottom="false">
					<template #custom-label>
						<view style="background-color: #74d086;color: #fff;">
							<text>测试label:</text>
						</view>
					</template>

					<template v-slot:custom-value>
						<view class="x-f" style="background-color: #51d0d0;color: #fff;">
							<text>自定义内容</text>
						</view>
					</template>
				</m-field>
			</view>

			<view class="content_main_CardBox">
				<text>m-field 带有click事件，注意页面是否会因此导致出现性能问题</text>
				<m-field valueFontSize="24rpx" labelFontSize="24rpx" paddings="8rpx" :borderBottom="false"
					backgroundColor="pink" @click="tapField" label="测试label:" value="请点击">
				</m-field>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			tapField() {
				this.$utils.msg('m-filed被点击')
			}
		}
	}
</script>

<style lang="scss">
	.content {
		background-color: rgba(218, 255, 161, .5);

		.content_main_CardBox {
			margin-top: 20rpx;

			&>text {
				padding: 10rpx 6rpx;
			}
		}
	}

	.CardBox {
		position: relative;
		background-color: #fff;
		border-radius: 12px;
		padding: 10px !important;
		margin-top: 10px;
		// min-height: 200px;

		// 卡片盒子右上角图标
		.RightTop {
			position: absolute;
			right: 0;
			top: 0;
			width: 50px;
			height: 50px;
			line-height: 50px;
			border-radius: 8px;
			background-color: transparent;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;

			.IconBox {
				width: 30px;
				height: 30px;
				line-height: 30px;
				border-radius: 8px;
				background-color: #f1f1f1;
				text-align: center;
			}
		}

	}
</style>