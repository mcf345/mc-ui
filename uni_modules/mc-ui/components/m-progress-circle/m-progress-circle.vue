<template>
	<view class="progress-bar" @click.stop="handleClick">
		<view style="position: relative;">
			<!-- 环形图 -->
			<canvas class="canvas" :canvas-id="'progressCanvas'+String(canvasId)" :style="canvasStyle"></canvas>

			<!-- 环形图内内容插槽 -->
			<view class="content-slot" :style="contentSlotStyle">
				<!-- :style="'width: ' + (radius * 2 - 5) + 'px; height: ' + (radius * 2 - 5) + 'px;'"> -->
				<slot name="content"></slot>
			</view>

			<!-- 徽图标 -->
			<view class="custom-slot" v-if="custom">
				<slot name="custom"></slot>
				<view class="default-icon" v-if="!$slots.custom" :style="defaultIconStyle">
					<text>{{ custom }}</text>
				</view>
			</view>
		</view>
		<!-- 底部内容 -->
		<view v-if="!$slots.Text" class="progress-text" :style="progressTextStyle">
			<text :style="bottomTextStyle">{{ Text }}</text>
		</view>
		<!-- 底部内容插槽 -->
		<view v-else class="slot-text">
			<slot name="Text"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "m-progress-circle",
		props: {
			canvasId: {
				type: String,
				default: '0'
			},
			progressColor: {
				type: String,
				default: '#FF0000'
			},
			trackColor: {
				type: String,
				default: '#CCCCCC'
			},
			progress: {
				type: Number,
				default: 0
			},
			Text: {
				type: String,
				default: ''
			},
			BottomTextColor: {
				type: String,
				default: '#333'
			},
			radius: {
				type: Number,
				default: 50 // Default radius is 50
			},
			lineWidth: {
				type: Number,
				default: 10 // Default line width is 10
			},
			innerTextSize: {
				type: Number,
				default: 16 // Default text size is 16
			},
			innerTextColor: {
				type: String,
				default: '#333' // Default text color is white
			},
			BottomTextSize: {
				type: Number,
				default: 16 // Default text color is white
			},
			custom: { // 右上角图标参数
				type: String,
				default: ''
			},
			bgColor: {
				type: String,
				default: '#FF0000'
			},
			textColor: {
				type: String,
				default: '#FFFFFF'
			},
		},
		computed: {
			canvasStyle() {
				return `width: ${this.radius * 2}px; height: ${this.radius * 2}px;`;
			},
			contentSlotStyle() {
				return `min-width: ${this.radius * 2 - 5}px; height: ${this.radius * 2 - 5}px;`;
			},
			defaultIconStyle() {
				return {
					background: this.bgColor,
					color: this.textColor
				};
			},
			progressTextStyle() {
				return `line-height: ${this.radius}px; width: ${this.radius * 4}px;`;
			},
			bottomTextStyle() {
				return `color: ${this.BottomTextColor}; font-size: ${this.BottomTextSize}px;`;
			}
		},
		mounted() {
			this.drawProgress()
		},
		methods: {
			drawProgress() {
				let progressColor = this.progressColor;
				let actualProgress = +this.progress; // 设置默认的进度值
				if (actualProgress > 100) {
					actualProgress = 100; // 如果进度大于100%，则设置为100%
					progressColor = '#FF0000'; // 设置进度条颜色为红色
				}

				const ctx = uni.createCanvasContext('progressCanvas' + String(this.canvasId), this)
				const width = this.radius * 2
				const height = this.radius * 2
				const startAngle = -Math.PI / 2
				const endAngle = (actualProgress / 100) * 2 * Math.PI - Math.PI / 2
				ctx.setLineWidth(this.lineWidth)
				ctx.setStrokeStyle(this.trackColor)
				ctx.setLineCap('round')
				ctx.beginPath()
				ctx.arc(this.radius, this.radius, this.radius - this.lineWidth / 2, 0, 2 * Math.PI, false)
				ctx.stroke()
				ctx.setLineWidth(this.lineWidth)
				ctx.setStrokeStyle(progressColor)
				ctx.setLineCap('round')
				ctx.beginPath()
				ctx.arc(this.radius, this.radius, this.radius - this.lineWidth / 2, startAngle, endAngle, false)
				ctx.stroke()
				ctx.setFontSize(this.innerTextSize)
				ctx.setFillStyle(this.innerTextColor) // Use custom inner text color
				ctx.setTextAlign('center')
				ctx.setTextBaseline('middle')
				if (!this.$slots.default) {
					ctx.fillText(this.progress + '%', this.radius, this.radius)
				}
				ctx.draw()
			},
			handleClick() {
				this.$emit('click', this.progress);
			}
		}
	}
</script>

<style>
	.content-slot {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.progress-bar {
		display: inline-block;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.progress-text,
	.slot-text {
		text-align: center;
		font-size: 16px;
		color: #666;
	}

	.progress-text {
		text-align: center;
		font-size: 16px;
		color: #666;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.custom-slot {
		position: absolute;
		top: -6px;
		right: -8px;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 20px;
		width: 20px;
		border-radius: 50%;
	}

	.default-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		font-size: 12px;
		padding: 4px;
		zoom: .8;
	}
</style>