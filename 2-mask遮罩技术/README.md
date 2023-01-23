在使用PS的时候，会利用mask遮罩图层对图片进行部分隐藏处理。  

在css技术中，也有这样的东西，就是 `mask属性` 或 `-webkit-mask属性`。

具体来讲：
* 一个元素设置了 mask属性，那么遮挡的是这个元素的 background；  
* mask遮罩层颜色是transparent的区域，该区域下的background部分会被隐藏；
* 具体请看 demoX.html