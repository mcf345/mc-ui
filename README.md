# mc-ui

#### 介绍
**`mc-ui`** 用于uni-app 移动端项目，目前仅APP中使用过，封装了一些使用的组件，仅存参考意义。

组件由个人书写，有疑问不一定能看得到

#### 软件架构
HBuild X


#### 安装教程

1. 在 `uni-module` 中搜索 mc-ui，并导入

2. 在  `pages.json` 中引用

   ```json
   "easycom": {
   	"^m-(.*)": "@/uni_modules/mc-ui/components/m-$1/m-$1.vue"
   },
   ```



#### 使用说明

1. 在项目中直接使用即可。

   ```vue
   // 示例
   <tem<template>
   	<view class="content">
   		<m-field valueFontSize="26rpx" labelFontSize="26rpx" paddings="4px 0" :borderBottom="false" 			label="不良品数量:" :value="element.FNgQty" valueColor="#d54844">
           </m-field>
   	</view>
   </template>
   ```

   
