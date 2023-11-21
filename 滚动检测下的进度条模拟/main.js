// 蓝色模拟滚动条
const line = document.getElementById("line")

// 内含原生滚动条的dom节点
const scroller = document.getElementById("scroller")

// content 节点
const contentArea = document.getElementsByClassName("content")[0];

// 紧随蓝色模拟滚动条的圆球
const circle = document.getElementsByClassName("circle")[0];

// 内容区总高度
const totalHeight = contentArea.clientHeight;

// 圆球高度
const circleHeight = circle.clientHeight;
        
// 蓝色模拟滚动条的最大长度
const lineHeight = totalHeight - circleHeight;

// 设置蓝色模拟滚动条初始状态，滚动条长度采用 scale 控制
line.style.height = `${lineHeight}px`;
line.style.transform = `scaleY(0) translateX(100%)`;

// 原生滚动条最多能滚动的距离
const all = scroller.scrollHeight - scroller.clientHeight;

scroller.addEventListener("scroll", (e) => {
        // 原生滚动条已经滚动的距离
        const top = scroller.scrollTop;
       
        // 原生滚动条当前滚动距离的占比
        const auto = top / all;

        const height = totalHeight * auto;

        // 滚到底了
        if (height + circleHeight >= totalHeight) {
            line.style.transform = `scaleY(1) translateX(100%)`;
            circle.style.transform = `translateY(${totalHeight - circleHeight}px) translateX(50%)`;
        } else {
            // 将 height 转化为蓝色模拟滚动条的缩放比例
            const auto = height / lineHeight
            line.style.transform = `scaleY(${auto}) translateX(100%)`;
            circle.style.transform = `translateY(${height}px) translateX(50%)`;
        }
            
})

/**
 * 使用 transform 控制元素长度，渲染速度比height属性值好，延迟小，
 * 否则会出现 height 已经设置为 0px，但是画面里呈现的是 50px 的样子，
 * 加上滚动事件频繁触发，画面抖动更剧烈！
 */