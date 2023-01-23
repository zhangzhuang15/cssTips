const wrap = document.querySelector('.wrap')
wrap.addEventListener('mousemove', e => {
    wrap.style.setProperty('--x', e.offsetX / e.target.offsetWidth)
    wrap.style.setProperty('--y', e.offsetY / e.target.offsetHeight)
})



// 当前元素 == e.target
// |-----------------------------------------------------|  border       -
// |                     ^                               |               ^ 
// |                     |                               |               |
// |                     | ( e.offsetY)                  |               |
// |                     |                               |               |
// |                     |                               |               |
// |<------------------- +                               |               |
// |  (e.offsetX)       (鼠标)                            |        e.target.offsetHeight
// |                                                     |               |
// |                                                     |               |
// |                                                     |               |
// |                                                     |               |
// |                                                     |               |
// |                                                     |               |
// |-----------------------------------------------------|               v
