<template>
	<view>
		<u-overlay :show="IsShow" class="LoadingOverlay" style="background-color: transparent;">
			<view class="wrapper">
				<view class="block">
					<view class="LoadingBox">
						<view class="TheLoading">
							<view class="spinner-6"></view>
						</view>
					</view>

					<view style="font-size: 24rpx;">加载中</view>

				</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	export default {
		name: "m-loading",
		data() {
			return {};
		},
		props: {
			IsShow: {
				type: [Boolean, String],
				default: false
			},
		}
	}
</script>

<style lang="scss" scoped>
	.LoadingOverlay {
		z-index: 999999;

		.wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;

			.block {
				width: 210px !important;
				/* height: 100px !important; */
				border-radius: 12px !important;
				// background: rgba(77, 77, 77, .8) !important;
				background: #4d4d4d !important;
				text-align: center;
				color: #fff;
				padding: 0 0 15px;

				.LoadingBox {
					position: relative;
					width: 210px !important;
					height: 100px !important;

					.TheLoading {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);

						.spinner-6 {
							/* 加载大小 */
							width: 60px;
							aspect-ratio: 1;
							display: grid;
							-webkit-mask: conic-gradient(from 15deg, #0000, #000);
							animation: s6 1s infinite steps(12);
						}
					}
				}
			}
		}

	}


	.spinner-6,
	.spinner-6:before,
	.spinner-6:after {
		background:
			radial-gradient(closest-side at 50% 12.5%,
				#f03355 96%, #0000) 50% 0/20% 80% repeat-y,
			radial-gradient(closest-side at 12.5% 50%,
				#f03355 96%, #0000) 0 50%/80% 20% repeat-x;
	}

	.spinner-6:before,
	.spinner-6:after {
		content: "";
		grid-area: 1/1;
		transform: rotate(30deg);
	}

	.spinner-6:after {
		transform: rotate(60deg);
	}

	@keyframes s6 {
		100% {
			transform: rotate(1turn)
		}
	}
</style>