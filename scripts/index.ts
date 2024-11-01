function upordown(curr: number, target: number, max: number): boolean {
    const dis = curr - target;
    if (dis < 0) {
        return (dis * -2 < max);
    } else {
        return (dis * 2 > max);
    }
};

const showswitchto = (showcontainer: HTMLDivElement, targetgpid: number) => {
    const pagepicker = showcontainer.querySelector(".page-picker");
    const pageshower = showcontainer.querySelector(".page-shower");
    if (!pagepicker || !pageshower) {
        return; // not valid showcontainer
    }
    const maxgpid = pageshower.childElementCount - 1;
    // pagepicker
    for (const picker of pagepicker.children) {
        picker.className = parseInt(picker.getAttribute("gpid") || "0") === targetgpid ? "page-picker-this" : "page-picker-hide";
    }
    // pageshower
    for (const page of pageshower.children) {
        const pagegpid = parseInt(page.getAttribute("gpid") || "0");
        if (pagegpid === targetgpid) {
            page.className = "page-shower-this";
        } else if (pagegpid === (targetgpid < maxgpid ? targetgpid + 1 : 0)) {
            page.className = "page-shower-next";
        } else if (pagegpid === (targetgpid === 0 ? maxgpid : targetgpid - 1)) {
            page.className = "page-shower-last";
        } else {
            page.className = "page-shower-hide";
        }
    }
}

const loadhomeshow = (homeshowcontainer: HTMLDivElement) => {
    const pagepicker = homeshowcontainer.querySelector(".page-picker");
    const pageshower = homeshowcontainer.querySelector(".page-shower");
    if (pagepicker && pageshower) {
        const maxgpid = pageshower.childElementCount - 1;
        for (const page of pageshower.children) {
            const picker = document.createElement("div");
            picker.classList.add(page.classList.contains("page-shower-this") ? "page-picker-this" : "page-picker-hide");
            picker.setAttribute("gpid", page.getAttribute("gpid") || "");
            pagepicker.appendChild(picker);
        }
        pagepicker.addEventListener("click", (e) => {
            if (e.target instanceof HTMLDivElement && e.target.parentElement === pagepicker) {
                showswitchto(homeshowcontainer, parseInt(e.target.getAttribute("gpid") || "0"));
            }
        });
    }
};

function setshowimgwh() {
    let style = document.querySelector("head>style#showimgwh");
    if (!style) {
        style = document.createElement("style");
        style.id = "showimgwh";
        document.querySelector("head")?.append(style);
    }
    if (style instanceof HTMLStyleElement) {
        if (window.innerHeight > window.innerWidth) {
            style.innerHTML = `#home-full-show-container>.page-shower>*>img{height:${window.innerHeight}px;}`;
        } else {
            style.innerHTML = "";
        }
    }
}

window.addEventListener("DOMContentLoaded", () => {
    // homeshow
    const homeshowcontainer = document.getElementById("home-full-show-container");
    if (homeshowcontainer && homeshowcontainer instanceof HTMLDivElement) {
        loadhomeshow(homeshowcontainer);
    }
    // extra style
    window.addEventListener("resize", setshowimgwh);
    setshowimgwh();
});
