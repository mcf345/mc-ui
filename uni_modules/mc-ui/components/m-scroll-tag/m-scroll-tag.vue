<template>

	<!-- 二级条件选择 -->
	<scroll-view scroll-x="true" class="tow_scroll" :scroll-with-animation="true" :scroll-left="scrollLeft">
		<view class="scroll_tags"
			:style="[itemStyle,{color:current==index?'#ffffff':'#202020',background:current==index?bgColor:'#F5F5F5'}]"
			v-for="(item,index) in tagsList" :key="index" @click="setTags(item,index)">
			{{item.name}}

		</view>
	</scroll-view>

</template>

<script>
	export default {
		props: {

			tagsList: {
				type: Array,
				default () {
					return []
				}
			},
			// 选中背景颜色
			bgColor: {
				type: String,
				default: '#FA436A',
			},
			itemStyle: {
				type: Object,
				default: () => {
					return {}
				}
			}

		},
		data() {
			return {
				// 滑动位置
				scrollLeft: 0,
				//  选择序列
				current: 0
			}
		},
		methods: {

			setTags(item, index) {

				this.current = index;

				let scrollLeft = index * 38;
				if (index <= 2) {
					scrollLeft = 0;
				}
				this.scrollLeft = scrollLeft;

				this.$emit("tabChange", {
					data: item,
					Index: index
				});
			}

		}
	}
</script>


<style lang="scss" scoped>
	// 隐藏滚动条scrollbar
	.tow_scroll ::-webkit-scrollbar {

		display: none;
		background-color: transparent;

	}

	.tow_scroll {
		padding: 0px 5px;
		white-space: nowrap;

		.scroll_tags {
			display: inline-block;
			background-color: #FFF8F5;
			color: #202020;
			text-align: center;
			padding: 6px 15px;
			font-size: 12px;
			border-radius: 15px;
			margin: 0 5px;
		}
	}
</style>