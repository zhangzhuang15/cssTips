let shinchouMenuLinks = document.querySelectorAll(".shinchou-menu li a");
shinchouMenuLinks.forEach(link => {
  let letters = link.textContent.split("");
  link.textContent = "";
  letters.forEach((letter, i) => {
    let span = document.createElement("span");
    span.textContent = letter;
    if (i < 2) {
      span.className = "highlight";
    }
    span.style.transitionDelay = `${i / 10}s`;  // 加入过渡延迟时间，形成文字染色的流动感
    link.append(span);
  });
});




window.location.href = 
    "mailto: 2592004894@qq.com?subject=这是邮件的主题&body=这是邮件的内容, 2592004777@qq.com?subject=这是邮件的主题&body=这是邮件的内容"

