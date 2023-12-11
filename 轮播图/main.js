const cards = document.getElementsByClassName('card')

const lb = document.getElementById('left')
const rb = document.getElementById('right')

const queue = []

// 指定默认展示的第一个图片
const defaultIndex = 1
for (let index = defaultIndex; index < cards.length; index++) {
    queue[index-defaultIndex] = cards[index]
}
const lastOne = queue.length

for (let index = 0; index < defaultIndex; index++) {
    queue[lastOne + index] = cards[index]
}

let timestamp

/**
 * 下文实现中，采用了 MessageChannel 和 setTimeout 两种
 * 思路，在任务比较简单的情况下，二者等效，但是根据灵活度、性能
 * 优先级，MessageChannel 更好；在修改元素的transform时，
 * 需要先让元素切换到某个transform，在屏幕中渲染，然后再切
 * 换transform的值，因此，要使用宏任务，就用到了刚刚提到的
 * MessageChannel 和 setTimeout；
 * 
 * 以下实现，要注意按钮的防护，一个按钮点击，预期结果完全展示之后，
 * 另一个按钮才能去响应，否则会扰乱变量 cur next timestamp
 * 的状态;
 * 
 * 本实现是在观看B站渡一教育视频之后做的，本实现方式优点在于：
 * - 不需要额外的DOM节点
 * - 不需要根据轮播图中的图片个数，更改translateX参数；
 */

const message = new MessageChannel()
const nMilliseconds = 300;

message.port1.onmessage = (e) => {
    const { type }= e.data

    const now = new Date().getTime()
    console.log("time distance: ", now - timestamp)

    if (now - timestamp < nMilliseconds) {
        message.port1.postMessage({type})
        return
    }

    if (type === "left") {
        cur.style.transform = "translateX(-200%)"
        cur.style.transition = `transform ${nMilliseconds}ms ease-in-out`
        next.style.transform = "translateX(-100%)"
        next.style.transition = `transform ${nMilliseconds}ms ease-in-out`
        next.style.visibility = "visible"
        queue.push(cur)
        cur = next
    } else {
        cur.style.transform = "translateX(0)"
        cur.style.transition = `transform ${nMilliseconds}ms ease-in-out`
        next.style.transform = "translateX(-100%)"
        next.style.transition = `transform ${nMilliseconds}ms ease-in-out`
        next.style.visibility = "visible"
        queue.unshift(cur)
        cur = next
    }
}

message.port2.onmessage = (e) => {
    const { type } = e.data;
    message.port2.postMessage({ type })
}

let cur, next;

const doLeftQueue = () => {
    next = queue.shift()

    next.style.visibility = "hidden"
    next.style.transform = "translateX(0)"
    next.style.transition = "transform 0s"

    timestamp = new Date().getTime()
    message.port2.postMessage({ type: 'left'})

    // setTimeout(() => {
    //     console.log("time distance: ", new Date().getTime() - timestamp)
    //     cur.style.transform = "translateX(-200%)"
    //     cur.style.transition = `transform ${nMilliseconds}ms ease-in-out`
    //     next.style.transform = "translateX(-100%)"
    //     next.style.transition = `transform ${nMilliseconds}ms ease-in-out`
    //     next.style.visibility = "visible"
    //     queue.push(cur)
    //     cur = next
    // }, 0)
}

const doRightQueue = () => {
    next = queue.pop()
    next.style.visibility = "hidden"
    next.style.transform = "translateX(-200%)"
    next.style.transition = "transform 0s"

    timestamp = new Date().getTime()
    message.port2.postMessage({ type: 'right' })

    // setTimeout(() => {
    //     cur.style.transform = "translateX(0)"
    //     cur.style.transition = "transform 300ms ease-in-out"
    //     next.style.transform = "translateX(-100%)"
    //     next.style.transition = "transform 300ms ease-in-out"
    //     next.style.visibility = "visible"
    //     queue.unshift(cur)
    //     cur = next
    // }, 0)
}



cur = queue.shift()
cur.style.transform = "translateX(-100%)"
cur.style.visibility = "visible";

rb.addEventListener("click", () => {
    doRightQueue()
})

lb.addEventListener("click", () => {
    doLeftQueue()
})