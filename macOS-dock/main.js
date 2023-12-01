const apps = document.getElementsByClassName("app");
const activateRecord = new Array(apps.length).fill(false);

for (let i = 0; i < apps.length; i++) {
    const app = apps[i];

    app.parentElement.addEventListener("mouseover", () => {
        const index = i;
        app.className = "app main-effect";
        
        if (index === 0) {
            apps[1].className = "app second-effect";
            apps[2].className = "app third-effect";
        } else if (index === apps.length - 1) {
            apps[index-1].className = "app second-effect";
            apps[index-2].className = "app third-effect";
        } else {
            apps[index-1].className = "app second-effect";
            apps[index+1].className = "app second-effect";

            if (index-2 > -1) {
                apps[index-2].className = "app third-effect";
            }
           
            if (index + 2 < apps.length) {
                apps[index+2].className = "app third-effect";
            } 
        }

    })

    app.parentElement.addEventListener("mouseout", () => {
        for (const app of apps) {
            app.className = "app";
        }
    })

    app.addEventListener("click", () => {
        const index = i;

        if (!activateRecord[index]) {
            activateRecord[index] = true;
            app.parentElement.className = "app-container activate";
            app.className = "app main-effect animation-once";
        }
        
    })
}