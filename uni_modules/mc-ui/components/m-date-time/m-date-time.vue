<template>
	<view class="m-date-time" :style="{backgroundColor:backgroundColor}">
		<view style="margin-bottom: 20rpx;">
			<view class="TitleName" :style="{color:titleNameColor}">
				<text>常用时间选择</text>
			</view>

			<m-radio :options="radioTimeOptions" v-model="UsualFormData.Timeout" margin="0 10rpx 10rpx 0" setWidth="30%"
				fontSize="14px" style="display: flex;flex-wrap: wrap;" borderRadius="9999px"
				contentActiveColor="#e1f7f8" contentActiveTextColor="#51d0d0" shape="square"
				@change="TimeRadioChange"></m-radio>
		</view>

		<view class="setDateBox">
			<view class="TitleName" :style="{color:titleNameColor}">
				<text>自定义日期</text>
			</view>

			<!-- 自定义展开式日期选择 -->
			<view class="x-bc DateBtnBox">
				<button class="DateBtn" :class="{'DateBtn_active':SetFormData.setBtnActive == 0}" size="mini"
					@click="clickDateBtn(0)">{{SetFormData.StartTime || '开始日期'}}</button>
				<text class="line">-</text>
				<button class="DateBtn" :class="{'DateBtn_active':SetFormData.setBtnActive == 1}" size="mini"
					@click="clickDateBtn(1)">{{SetFormData.EndTime || '结束日期'}}</button>
			</view>

			<picker-view v-if="visible" :style="{backgroundColor:PickerViewBac}" :indicator-style="indicatorStyle"
				:value="value" @change="bindChange" class="picker-view">
				<picker-view-column>
					<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in days" :key="index">{{item}}日</view>
				</picker-view-column>
			</picker-view>

			<view class="pickerBottom" v-if="visible">
				<button type="primary" @click="FilterSubmitBtn" size="mini">确定</button>
			</view>

		</view>

	</view>
</template>

<script>
	export default {
		name: "m-date-time",
		props: {
			InitData: {
				type: Object,
				default: {
					DateTitle: '',
					SDate: '',
					EDate: '',
				}
			},
			// 背景色
			backgroundColor: {
				type: String,
				default: '#fff'
			},
			// title标题色
			titleNameColor: {
				type: String,
				default: '#333'
			},
			PickerViewBac: {
				type: String,
				default: '#fff'
			}
		},
		data() {
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			for (let i = 1990; i <= date.getFullYear(); i++) {
				years.push(String(i))
			}
			for (let i = 1; i <= 12; i++) {
				months.push(String(i).padStart(2, '0'));
			}
			for (let i = 1; i <= 31; i++) {
				days.push(String(i).padStart(2, '0'));
			}
			return {
				radioTimeOptions: [{
						content: '全部',
						id: 0,
					},
					{
						content: '今日',
						id: 1,
					},
					{
						content: '昨日',
						id: 2,
					},
					{
						content: '近7日',
						id: 3,
					},
					{
						content: '近30日',
						id: 4,
					},
				],
				UsualFormData: { // 常用时间选项
					StartTime: null,
					EndTime: null,

					Timeout: null, // 选中项id
				},

				SetFormData: { // 自定义时间选项
					StartTime: null,
					EndTime: null,

					setBtnActive: null, // 点击的自定义日期按钮
				},
				visible: false,
				title: 'picker-view',
				years,
				year,
				months,
				month,
				days,
				day,
				value: [9999, month - 1, day - 1],
				indicatorStyle: `height: 50px;`
			};
		},
		created() {
			let that = this;

			if (!that.$utils.isEmpty(that.InitData)) {
				if (that.InitData.DateTitle.includes('\n')) {
					// 自定义时间范围

					that.SetFormData.StartTime = that.InitData.SDate;
					that.SetFormData.EndTime = that.InitData.EDate;

				} else {
					// 时间按钮
					that.UsualFormData['Timeout'] = that.radioTimeOptions.filter(item => item.content == that.InitData
						.DateTitle)[0]['id'];

				}
			}
			console.log(that.InitData)

			// this.visible = false;
			// this.SetFormData.setBtnActive = null;

		},
		watch: {
			InitData: {
				handler(nVal) {
					let that = this;
					if (!that.$utils.isEmpty(nVal)) {
						if (nVal.DateTitle.includes('\n')) {
							// 自定义时间范围

							that.SetFormData.StartTime = nVal.SDate;
							that.SetFormData.EndTime = nVal.EDate;

							that.SetFormData.setBtnActive = null;
							that.UsualFormData.Timeout = null;
						} else {
							// 时间按钮
							that.UsualFormData['Timeout'] = that.radioTimeOptions.filter(item => item.content == nVal[
								'DateTitle'])[0]['id'];

							that.SetFormData.StartTime = null;
							that.SetFormData.EndTime = null;

						}
					}
				},
				deep: true,
				// immediate: true,
			}
		},
		beforeDestroy() {
			// 关闭时间窗，关闭选中框
			this.visible = false;
			this.SetFormData.setBtnActive = null;
		},
		methods: {
			bindChange: function(e) {
				const val = e.detail.value
				this.year = this.years[val[0]]
				this.month = this.months[val[1]]
				this.day = this.days[val[2]]

				if (this.SetFormData.setBtnActive == 0) {
					this.SetFormData.StartTime = this.year + '-' + this.month + '-' + this.day;
				} else if (this.SetFormData.setBtnActive == 1) {
					this.SetFormData.EndTime = this.year + '-' + this.month + '-' + this.day;
				}

			},
			TimeRadioChange(data) { // 切换常用时间选项
				let that = this;
				that.SetFormData.setBtnActive = null;
				that.SetFormData.StartTime = null;
				that.SetFormData.EndTime = null;
				that.visible = false;

				that.UsualFormData.Timeout = data.data.id;

				let UsualDate = {
					StartTime: '',
					EndTime: '',
				}

				let SDateNum = null;
				let EDateNum = null;

				switch (data.data.id) {
					case 0: // 全部
						break;
					case 1: // 今日
						SDateNum = 0;
						EDateNum = 0;
						break;
					case 2: // 昨日
						SDateNum = -1;
						EDateNum = -1;
						break;
					case 3: // 近7日
						SDateNum = -7;
						EDateNum = 0;
						break;
					case 4: // 近30日
						SDateNum = -30;
						EDateNum = 0;
						break;
					default:
						break;
				}

				if (data.data.id != 0) {
					UsualDate['StartTime'] = that.$utils.getDateAfterNDays(SDateNum);
					UsualDate['EndTime'] = that.$utils.getDateAfterNDays(EDateNum);
				}

				that.UsualFormData.StartTime = UsualDate['StartTime'];
				that.UsualFormData.EndTime = UsualDate['EndTime'];

				that.FilterSubmitBtn();
			},
			clickDateBtn(index) { // 点击自定义日期按钮
				let that = this;
				that.UsualFormData.Timeout = null;
				that.SetFormData.setBtnActive = index;
				that.visible = true;


				let dates = [],
					year = [],
					month = [],
					day = [];

				if (that.$utils.isEmpty(that.SetFormData.StartTime)) {
					// 还未点击过，使用默认数据赋值
					dates = that.$utils.getDateAfterNDays(-10).split('-');
					year = that.years.indexOf(dates[0]);
					month = that.months.indexOf(dates[1]);
					day = that.days.indexOf(dates[2]);

					that.value = [year, month, day];

					that.SetFormData.StartTime = that.$utils.getDateAfterNDays(-10);
					that.SetFormData.EndTime = that.$utils.getDateAfterNDays(0);
				} else {
					if (index == 0) { // 开始时间
						dates = that.SetFormData.StartTime.split('-');
					} else { // 结束时间
						dates = that.SetFormData.EndTime.split('-');
					}
					year = that.years.indexOf(dates[0]);
					month = that.months.indexOf(dates[1]);
					day = that.days.indexOf(dates[2]);

					that.value = [year, month, day];
				}
			},
			FilterSubmitBtn() { // 确定筛选按钮
				let Dates = {
					SDate: '',
					EDate: '',
					DateTitle: '',
				}
				if (this.visible) { // 自定义时间
					Dates['SDate'] = this.SetFormData.StartTime;
					Dates['EDate'] = this.SetFormData.EndTime;
					Dates['DateTitle'] = Dates['SDate'] + '\n' + Dates['EDate'];

					// 判断开始时间是否超过结束时间
					if (!this.$utils.isValidDateRange(Dates.SDate, Dates.EDate)) {
						this.$utils.msg('开始日期不能大于结束日期')
						return
					}

					// 关闭时间窗，关闭选中框
					this.visible = false;
					this.SetFormData.setBtnActive = null;
				} else {
					Dates['SDate'] = this.UsualFormData.StartTime;
					Dates['EDate'] = this.UsualFormData.EndTime;

					Dates['DateTitle'] = this.radioTimeOptions.filter(item => item.id == this.UsualFormData.Timeout)[0][
						'content'
					]
				}

				this.$emit('DateSubmit', Dates)
			},
		}
	}
</script>

<style lang="scss">
	uni-button {
		margin-left: initial !important;
		margin-right: initial !important;
	}

	.m-date-time {
		padding: 10px;

		.TitleName {
			margin-bottom: 10rpx;
			// font-size: 28rpx;
			font-size: 14px;
			font-weight: 600;
		}

		// 自定义时间范围
		.setDateBox {

			.DateBtnBox {

				.line {
					margin: 0 4rpx;
				}

				.DateBtn {
					flex: 1;

					&_active {
						border: 1px solid #51d0d0;
					}
				}
			}
		}
	}

	.picker-view {
		// width: 750rpx;
		height: 400rpx;
		margin-top: 10px;
	}

	.uni-picker-view-indicator {
		height: 60rpx !important;
	}

	.item {
		// line-height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.pickerBottom {
		width: 100%;
		padding: 6px 15px;
		border-top: 1px solid #efefef;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;

		uni-button {
			font-size: 14px;
			padding: 2px 0;
			width: 100%;
		}
	}
</style>