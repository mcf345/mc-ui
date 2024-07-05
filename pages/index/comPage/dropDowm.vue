<template>
	<view class="content">
		<view class="SearchBox">
			<u-search :showAction="true" v-model="searchValue" placeholder="搜索消息的标题或内容" searchIcon=" " shape="square"
				actionText="搜索" @search="OnSearch" @custom="OnSearch" :showMore="showSearchMore"
				:actionStyle="{color:'#fff'}" :animation="false">
				<template v-slot:label>
					<m-dropdown-menu :options="options" v-model="ChoiceMenuData" marginTop="10" zIndex="9999"
						@selectItem="selectSearchMenuItem">
						<template #default="{element}">
							<view class="x-f MenuText" :style="{color: element ? '#3d9edf' : '#333'}">
								<text>{{ChoiceMenuData['text']}}</text>
								<u-icon :name="element ? 'arrow-up-fill':'arrow-down-fill'"
									:color="element ? '#3d9edf' : '#333'" size="10" style="margin-left: 4px;"></u-icon>
							</view>

						</template>
					</m-dropdown-menu>

				</template>
			</u-search>
		</view>

		<view class="descBox">
			<text>适用于顶部容器，做下拉操作，下拉框会占满容器下方</text>
		</view>


		<view class="content_main">

			<view class="content_main_CardBox">
				<view class="content_main_CardBox_TopBox x-bc">
					<view class="content_main_CardBox_TopBox_TitleName">
						<text>标题下拉菜单</text>
					</view>

					<view class="menu">
						<m-dropdown-menu :options="options" v-model="ChoiceMenuData" marginTop="10" zIndex="9999"
							@selectItem="selectSearchMenuItem">
							<template #default="{element}">
								<view class="x-f MenuText" :style="{color: element ? '#3d9edf' : '#333'}">
									<text>{{ChoiceMenuData['text']}}</text>
									<u-icon :name="element ? 'arrow-up-fill':'arrow-down-fill'"
										:color="element ? '#3d9edf' : '#333'" size="10"
										style="margin-left: 4px;"></u-icon>
								</view>

							</template>
						</m-dropdown-menu>
					</view>
				</view>

				<view class="descBox">
					<text>不建议在容器中使用该组件，建议使用气泡</text>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchValue: '',
				showSearchMore: false,


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
				ChoiceMenuData: {
					text: '全部',
					value: 0
				},
			};
		},
		methods: {
			OnSearch() {

			},

			selectSearchMenuItem(data) {
				Object.assign(this.ChoiceMenuData, data)
			},
		}
	}
</script>

<style lang="scss">
	.content {
		background-color: #f6f6f6;

		.descBox {
			padding: 20rpx;
			font-size: 14px;

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

		.content_main {
			padding: 10rpx;
		}
	}
</style>