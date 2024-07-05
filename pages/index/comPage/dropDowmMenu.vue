<template>
	<view class="content">

		<z-paging ref="paging" v-model="MessageList" @query="queryList" :auto-hide-loading-after-first-loaded="false">
			<template #top>
				<view class="SearchBox">
					<u-search :showAction="true" v-model="searchValue" placeholder="搜索消息的标题或内容" searchIcon=" "
						shape="square" actionText="搜索" @search="OnSearch" @custom="OnSearch" :showMore="showSearchMore"
						:actionStyle="{color:'#fff'}" :animation="false">
						<template v-slot:label>
							<m-dropdown-menu :options="options" v-model="ChoiceMenuData" KeyID="searchMenu"
								marginTop="10" zIndex="9999" @selectItem="selectSearchMenuItem">
								<template #default="{element}">
									<view class="x-f MenuText" :style="{color: element ? '#3d9edf' : '#333'}">
										<text>{{ChoiceMenuData['text']}}</text>
										<u-icon :name="element ? 'arrow-up-fill':'arrow-down-fill'"
											:color="element ? '#3d9edf' : '#333'" size="10"
											style="margin-left: 4px;"></u-icon>
									</view>

								</template>
							</m-dropdown-menu>

						</template>
					</u-search>
				</view>

				<view style="height: 40px;position: relative;width: 100%;">
					<view class="x-c" style="position: absolute;top: 0;left: 0;width: 100%;background-color: #fff;">

						<m-dropdown ref="uDropdown" titleSize="14px" menuIconSize="14px" height="40"
							:style="{'overflow': stickShow ? 'hidden' : ''}" @open="stickShow = false"
							@close="stickShow = true">

							<template #menuText="{element}">
								<m-badge :count="element.count" :maxCount="99" :zoom="0.8"
									:position="{top:'-10px',right:'-2px'}">
									<view style="max-width: 100rpx;">{{element.title}}</view>
								</m-badge>
							</template>

							<!-- 项目选择 -->
							<m-dropdown-item :title="DropDowmMenu_test['label'] || '项目'" :count="MsgCount">
								<view style="padding: 20rpx 10rpx 10rpx;background-color: #fff;">
									<m-radio :options="radioOptions" v-model="DropDowmMenu_test['value']"
										style="display: flex;flex-wrap: wrap;" margin="0px 20rpx 20rpx 0px"
										:badgePosition="{top:'0px',right:'0px'}"
										:formtData="{showText:'label',hidKey:'value'}" InitBackgroundColor="#f5f5f5"
										borderRadius="20rpx" contentActiveColor="#51d0d0" contentActiveTextColor="#fff"
										setWidth="30%" itemHeight="40px" @change="handleRadioChange">
									</m-radio>
								</view>
							</m-dropdown-item>

							<!-- 时间选择 -->
							<m-dropdown-item :title="DropDowmMenu_Date['DateTitle'] || '日期'">
								<m-date-time :InitData="DropDowmMenu_Date" @DateSubmit="DateSubmit"></m-date-time>
							</m-dropdown-item>

							<view slot="filter">
								<view class="x-ec"
									style="border-left:1px solid #cdcdcd;color:#818181;height: 100%;padding: 0 10px;">
									筛选<uni-icons fontFamily="CustomFontPlatform" color="#818181"
										:size="20">{{$utils.toUniCode('&#xe811;')}}</uni-icons>

								</view>
							</view>
						</m-dropdown>

					</view>

				</view>
				<!-- </view> -->
				<!-- </u-sticky> -->

			</template>

			<template #loading>
				<view style="padding: 20rpx;">
					<m-skeleton v-for="(item,index) in 5" :key="index" style="margin-bottom: 20rpx;"></m-skeleton>
				</view>
			</template>

			<view class="descBox">
				<text>复杂下拉菜单，可通过slot自定义内容，反之使用统一的cell格式布局，样式建议自定义。</text>
			</view>

			<view style="padding: 20rpx;">
				<view class="CordBox" v-for="(item,index) in MessageList" :key="index">
					<view class="CordBox-top">
						<view class="CordBox-top_left">
							<!-- 序号 -->
							<view class="CordBox-top_left_ordinal animate">12</view>

							<!-- 标题 -->
							<view class="CordBox-top_left_title animate">xxxxxxx</view>
						</view>

						<view class="CordBox-top_right">
							<!-- 时间 -->
							<view class="CordBox-top_right_title animate">2024-06-21</view>
						</view>
					</view>

					<view class="CordBox_second animate">sssssdddddd</view>

					<view class="CordBox_content animate">qweqweqweqwe</view>
				</view>
			</view>


		</z-paging>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				MessageList: [], // 消息列表
				searchValue: '', // 搜索
				showSearchMore: false,

				ChoiceMenuData: {
					text: '全部',
					value: 0
				},
				options: [{
					text: '全部',
					value: 0
				}, {
					text: '未读',
					value: 1
				}, {
					text: '已读',
					value: 2
				}, ],


				stickShow: false,
				DropDowmMenu_Date: { // 时间下拉
					// DateTitle: '全部',
					// SDate: '',
					// EDate: '',
				},


				DropDowmMenu_test: {
					label: '项目A',
					value: 1,
				},
				radioOptions: [{
					label: '项目A',
					value: 1,
					count: 20,
				}, {
					label: '项目B',
					value: 2,
					count: 30,
				}, {
					label: '项目C',
					value: 3,
					count: 10,
				}, ],
				selectedItem: 0, // 弹层选中项
			}
		},
		created() {},
		computed: {
			MsgCount() {
				const totalCount = this.radioOptions.reduce((accumulator, currentItem) => {
					return accumulator + currentItem.count;
				}, 0);
				return totalCount;
			},
		},
		methods: {
			handleRadioChange(option) { // 选中左侧导航菜单
				console.log('Selected option:', option);
				// this.selectedItem = option['Index'];

				Object.assign(this.DropDowmMenu_test, option['data'])
				// this.queryList();
				this.$refs.uDropdown.close();
				this.$refs.paging.reload()
			},
			OnSearch() { // 搜索

			},
			queryList() {
				let that = this;
				setTimeout(() => {
					let Data = [1, 2, 3, 4, 5, 6, 7, 8, 9]

					that.$refs.paging.complete(Data);
				}, 1000)
			},
			openSearchPopup() {
				this.showSearchMore = !this.showSearchMore;
			},
			selectSearchMenuItem(data) {
				// console.log(data)
				Object.assign(this.ChoiceMenuData, data)
			},
			DateSubmit(data) { // 选中时间
				Object.assign(this.DropDowmMenu_Date, data)
				this.$refs.uDropdown.close();
				// this.queryList();
				this.$refs.paging.reload()
			},
			changeValue(data) { // 测试选中cell下拉菜单
				let FilterData = this.radioOptions.filter(item => item.value == data)[0];

				// this.DropDowmMenu_test['label'] = FilterData['label'];

				Object.assign(this.DropDowmMenu_test, FilterData)

			},
		}
	}
</script>

<style lang="scss" scoped>
	$h-padding: 15rpx;
	$v-padding: 20rpx;
	$radius: 10rpx;

	.content {
		background-color: #f6f6f6;

		.descBox {
			padding: 20rpx;
			font-size: 14px;

		}
	}

	.SearchBox {
		background-color: #fff;
		background-color: #51d0d0;
		padding: 6px 10px;

		.MenuText {
			font-size: 14px;
			border-right: 1px solid #999;
			padding-right: 10px;
			margin-right: 4px;
		}
	}


	.CordBox {
		position: relative;
		border-radius: 16rpx;
		padding: 20rpx;
		background-color: #fff;
		margin-bottom: 20rpx;

		&-top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 10rpx;

			&_left {
				display: flex;
				align-items: center;
				font-size: 28rpx;

				// 序号
				&_ordinal {

					width: fit-content;
					min-width: 34rpx;
					border-radius: 8rpx;
				}

				&_title {

					width: fit-content;
					border-radius: 999rpx;
					margin-left: 10rpx;
				}
			}

			&_right {

				&_title {
					font-size: 24rpx;
					color: #999;
					width: fit-content;
					border-radius: 999rpx;
				}
			}
		}

		&_second {

			height: 28rpx;
			border-radius: 999rpx;
			margin-bottom: 10rpx;
		}

		&_content {

			height: 100rpx;
			border-radius: 8rpx;
		}

	}
</style>