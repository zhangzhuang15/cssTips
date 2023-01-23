const userAgent = navigator.userAgent;

if (userAgent.includes("Chrome")) {
    CSS.registerProperty({
        name: "--color",
        syntax: "<color>",
        initialValue: "transparent",
        inherits: true
      });
      
    CSS.registerProperty({
        name: "--pos",
        syntax: "<integer>",
        initialValue: "0",
        inherits: true
      });      
}
else if (userAgent.includes("Safari")) {
    document.body.innerHTML = "请使用google浏览器打开，部分CSS函数Safari浏览器不支持";
    document.body.style.color = "white";
}
else {}