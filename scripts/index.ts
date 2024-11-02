function upordown(curr: number, target: number, max: number): boolean {
    const dis = curr - target;
    if (dis < 0) {
        return (dis * -2 < max);
    } else {
        return (dis * 2 > max);
    }
};

function showsetthis(showcontainer: HTMLDivElement, target: number) {
    const pagepicker = showcontainer.querySelector(".page-picker");
    const pageshower = showcontainer.querySelector(".page-shower");
    if (!pagepicker || !pageshower) {
        return; // not valid showcontainer
    }
    const max = pageshower.childElementCount - 1;
    // pagepicker
    for (const picker of pagepicker.children) {
        picker.className = parseInt(picker.getAttribute("gpid") || "0") === target ? "page-picker-this" : "page-picker-hide";
    }
    // pageshower
    for (const page of pageshower.children) {
        const pagegpid = parseInt(page.getAttribute("gpid") || "0");
        if (pagegpid === target) {
            page.className = "page-shower-this";
        } else if (pagegpid === (target < max ? target + 1 : 0)) {
            page.className = "page-shower-next";
        } else if (pagegpid === (target === 0 ? max : target - 1)) {
            page.className = "page-shower-last";
        } else {
            page.className = "page-shower-hide";
        }
    }
}

async function waitForTransition(elem: HTMLElement) {
    await new Promise<void>((resolve) => {
        const fn = () => {
            elem.removeEventListener("transitionend", fn);
            resolve();
        };
        elem.addEventListener("transitionend", fn);
    });
};

async function showswitchto(showcontainer: HTMLDivElement, target: number) {
    const ashower = showcontainer.querySelector(".page-shower-this");
    if (!ashower || !ashower.parentElement) { return; }
    let curr = parseInt(ashower.getAttribute("gpid") || "NaN");
    const max = ashower.parentElement.childElementCount - 1;
    while (curr !== target) {
        showsetthis(showcontainer, upordown(curr, target, max + 1) ? (++curr > max ? (curr = 0) : curr) : (--curr < 0 ? (curr = max) : curr));
        await waitForTransition(ashower.parentElement);
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
        let isswitching = false;
        pagepicker.addEventListener("click", async (e) => {
            if (e.target instanceof HTMLDivElement && e.target.parentElement === pagepicker && !isswitching) {
                isswitching = true;
                await showswitchto(homeshowcontainer, parseInt(e.target.getAttribute("gpid") || "0"));
                isswitching = false;
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
    if (homeshowcontainer instanceof HTMLDivElement) {
        loadhomeshow(homeshowcontainer);
    }
    // extra style
    window.addEventListener("resize", setshowimgwh);
    setshowimgwh();
});
