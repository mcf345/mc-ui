<template>
	<view class="sort-container">
		<view class="sort-options">
			<view v-for="sort in sortOptions" :key="sort.id" class="sort-option x-f">
				<text>{{ sort.name }}</text>
				<view>
					<text class="order" @tap="handleOrderClick(sort, item)" v-for="(item,index) in sortFields"
						:key="index"
						:class="{ 'selected': defaultSort === sort.id && selectSort.value === item.value }">
						{{item.text}}
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "m-sort",
		props: {
			sortOptions: {
				type: Array,
				default: () => []
			},
			sortFields: {
				type: Array,
				default: () => []
			},
			defaultSort: {
				type: String,
				default: ""
			},
			selectSort: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {

			};
		},
		created() {

		},
		methods: {
			handleOrderClick(sort, item) {

				this.$emit("change", {
					sort: sort,
					item: item
				});
			}
		}
	};
</script>

<style lang="scss">
	.sort-container {
		.sort-options {
			.sort-option {
				display: flex;
				align-items: center;
				justify-content: space-between;
				// @include flex(between, center);
				padding: 10upx 10upx;
				border-bottom: 1px solid #f3f3f3;

				.order {
					// margin-left: 40upx;
					padding: 0 20px;
					cursor: pointer;
					color: #5d5d5d;

					&:first-child {
						border-right: 1px solid #f3f3f3;
					}

					&.selected {
						font-weight: bold;
						color: #2aaa7d;
					}
				}
			}
		}
	}
</style>