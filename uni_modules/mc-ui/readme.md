## mc-ui

> 脚本中的许多方法，需要自己根据情况修改，不提供js

### 一、引入

```json
// pages.json

"easycom": {
	// 下载安装的方式需要前面的"@/"，npm安装的方式无需"@/"
	"^m-(.*)": "@/uni_modules/mc-ui/components/m-$1/m-$1.vue",
},
```

### 二、使用（m-(.*)）

#### 1、下拉菜单

```vue
// 主要示例-菜单下拉，这样写有点bug
<view style="position: sticky;box-shadow: 0px -1px 13px -7px #999;">
	<m-dropdown ref="uDropdown" titleSize="14px" menuIconSize="14px" height="40" :style="{'overflow': stickShow ? 'hidden' : ''}" @open="stickShow = false" @close="stickShow = true">
		<m-dropdown-item :title="DropDowmMenu_Date['DateTitle'] || '日期'">
			<m-date-time :InitData="DropDowmMenu_Date" @DateSubmit="DateSubmit"></m-date-time>
		</m-dropdown-item>

		<m-dropdown-item v-model="value2" :title="DropDowmMenu_test['Title'] || '测试'" :options="options2" 			@change="changeValue">
		</m-dropdown-item>
	</m-dropdown>
</view>
```


> 因为项目中布局问题，使用sticky导致我的下拉刷新出毛病，所以换一个定位方法，这样既不会阻挡组件使用，也不会阻碍其他操作。

```vue
<view style="height: 40px;position: relative;width: 100%;">
	<view style="position: absolute;top: 0;left: 0;width: 100%;background-color: #fff;">

		<m-dropdown ref="uDropdown" titleSize="14px" menuIconSize="14px" height="40" :style="{'overflow': 				stickShow ? 'hidden' : ''}" @open="stickShow = false" @close="stickShow = true">
			<m-dropdown-item :title="DropDowmMenu_Date['DateTitle'] || '日期'">
				<m-date-time :InitData="DropDowmMenu_Date" @DateSubmit="DateSubmit"></m-date-time>
			</m-dropdown-item>

			<m-dropdown-item v-model="value2" :title="DropDowmMenu_test['Title'] || '测试'" 			  					:options="options2" @change="changeValue"></m-dropdown-item>
			</m-dropdown>
	</view>

</view>
```

#### 2、pda激光扫码组件（广播）

```vue
// listen-name 监听器名称
// setContent  pda 广播动作、广播标签定义

<m-pda-scancode :setContent="{action:'xxxx',extra:'xxxx'}" listen-name="myScanEventName"></m-pda-scancode>
```

