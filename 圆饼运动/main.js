if(navigator.userAgent.includes("Chrome")) {
    CSS.registerProperty({
        name: '--color1',
        syntax: '<color>',
        initialValue: 'transparent',
        inherits: true
    });
    
    CSS.registerProperty({
        name: '--color2',
        syntax: '<color>',
        initialValue: 'transparent',
        inherits: true
    });
    
    CSS.registerProperty({
        name: '--pos',
        syntax: '<length-percentage>',
        initialValue: '0',
        inherits: true
    })
}

else if(navigator.userAgent.match(/.*Safari.*/) !== null) {
    document.body.innerHTML = "";
    document.write("暂不支持safari浏览器，请使用google浏览器打开");
}

else {

}

