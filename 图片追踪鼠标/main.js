let menuItems = document.querySelectorAll(".menu-hover-image .menu-item");
let cursor = document.querySelector(".menu-hover-image .cursor");
const cursor_to_left = 20;
const cursor_to_top = 20;
let getXY = (e) => [
  e.offsetX,
  e.offsetY
];

menuItems.forEach(menuItem => {
  // use mouseenter and mouseleave to toggle cursor since they won't bubble!
  menuItem.addEventListener("mouseenter", e => {
    let [x, y] = getXY(e);
    cursor.animate(
      [
        {
          opacity: 0,
          transform: `translate(${x-cursor_to_left}px, ${y-cursor_to_top}px) scale(0)`
        },
        {
          opacity: 1,
          transform: `translate(${x-cursor_to_left}px, ${y-cursor_to_top}px) scale(1)`
        }
      ],
      { duration: 300, fill: "forwards" }
    );
    menuItem.addEventListener("mouseleave", e => {
      let [x, y] = getXY(e);
      cursor.animate(
        [
          {
            opacity: 1,
            transform: `translate(${x-cursor_to_left}px, ${y-cursor_to_top}px) scale(1)`
          },
          {
            opacity: 0,
            transform: `translate(${x-cursor_to_left}px, ${y-cursor_to_top}px) scale(0)`
          }
        ],
        { duration: 300, fill: "forwards" }
      );
    });
  });
  // move the cursor when mouse moves.
  menuItem.addEventListener("mousemove", e => {
    let [x, y] = getXY(e);
    cursor.animate(
      [
        {
          transform: `translate(${x-cursor_to_left}px, ${y-cursor_to_top}px)`
        },
         {
          transform: `translate(${x-cursor_to_left}px, ${y-cursor_to_top}px)`
        }
      ],
      { duration: 500, delay: 50, fill: "forwards" }
    );
  });
});

