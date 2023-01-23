## 什么是1px问题
设计稿中的button按钮边框宽度为1px，在小程序中使用1rpx或者在网页使用1px的border时，实际渲染出来的边框效果异常，可能边框更粗，可能边框更细，可能边框有一部分消失了。这就是1px问题。

## 原因
* 设计稿中的px是物理像素，开发中使用的是css像素，二者不是等价的；
* 浏览器最低识别1px，如果设置border: 0.5px的话，会按照1px处理；

## 物理像素和css像素
1. 物理像素和css像素之间存在比例，常用dppx单位来统计，表示1px的css像素点对应多少个物理像素点；
> 在浏览器中，使用`window.devicePixelRatio`可以获取到这个比例


2. 在微信小程序中，1rpx=0.5px(css)=1px(设计稿)
> 当指定border： 1rpx 时，实际上是0.5px(css)，这时就会被浏览器或模拟器当作1px处理，进而显得比较粗；


## 解决方法
1. css伪元素 + transform缩放
2. viewport + rem


## 概念
|   名称    |     含义    |
|  :--:    |      :--    |
|  dp      |  `device pixel`, 物理像素 |
|  dip     |  `device-independent pixels`, 设备独立像素、逻辑像素 |
|  css像素  | 不考虑缩放情况下，1个css像素等于1个设备独立像素 |
|  dpr     |  `device pixel ratio`, 物理像素和设备独立像素比 |
| resolution | `屏幕分辨率`，常说的分辨率指的是物理像素 |
| dpi      | `dot per inch`, 屏幕对角线上每英寸像素数量 |