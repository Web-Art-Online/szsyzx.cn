function upordown(curr: number, target: number, max: number): boolean {
    const dis = curr - target;
    return dis < 0 ? (dis * -2 < max) : (dis * 2 > max);
}

function updateClassName(elem: Element, target: number, curr: number, next: number, last: number) {
    const gpid = parseInt(elem.getAttribute("gpid") || "NaN");
    if (gpid === target) {
        elem.className = "page-shower-this";
    } else if (gpid === next) {
        elem.className = "page-shower-next";
    } else if (gpid === last) {
        elem.className = "page-shower-last";
    } else {
        elem.className = "page-shower-hide";
    }
}

function showsetthis(showcontainer: HTMLDivElement, target: number) {
    const pagepicker = showcontainer.querySelector(".page-picker");
    const pageshower = showcontainer.querySelector(".page-shower");
    if (!pagepicker || !pageshower) return;
    const max = pageshower.childElementCount - 1;
    const next = target < max ? target + 1 : 0;
    const last = target === 0 ? max : target - 1;
    for (const picker of pagepicker.children) {
        picker.className = picker.getAttribute("gpid") === target.toString() ? "page-picker-this" : "page-picker-hide";
    }
    for (const page of pageshower.children) {
        updateClassName(page, target, target, next, last);
    };
}

async function waitForTransition(elem: HTMLElement) {
    await new Promise<void>((resolve) => {
        const fn = () => {
            elem.removeEventListener("transitionend", fn);
            resolve();
        };
        elem.addEventListener("transitionend", fn);
    });
}

async function showswitchto(showcontainer: HTMLDivElement, target: number) {
    const ashower = showcontainer.querySelector(".page-shower-this");
    if (!ashower || !ashower.parentElement) return;
    let curr = parseInt(ashower.getAttribute("gpid") || "NaN");
    const max = ashower.parentElement.childElementCount - 1;
    if (target < 0) target = max;
    if (target > max) target = 0;
    while (curr !== target) {
        showsetthis(showcontainer, upordown(curr, target, max + 1) ? (++curr > max ? (curr = 0) : curr) : (--curr < 0 ? (curr = max) : curr));
        await waitForTransition(ashower.parentElement);
    }
}

function listenTouchY(elem: HTMLElement, cb: (diffY: number) => void) {
    let startY: number;
    elem.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });
    elem.addEventListener('touchmove', (e) => {
        cb(startY - e.touches[0].clientY);
        startY = e.touches[0].clientY;
        e.preventDefault();
    });
}

function loadhomeshow(homeshowcontainer: HTMLDivElement) {
    const pagepicker = homeshowcontainer.querySelector(".page-picker");
    const pageshower = homeshowcontainer.querySelector(".page-shower");
    if (!pagepicker || !pageshower) return;

    for (const page of pageshower.children) {
        const picker = document.createElement("div");
        picker.className = page.classList.contains("page-shower-this") ? "page-picker-this" : "page-picker-hide";
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
    const onscrolllike = async (deltaY: number) => {
        if (isswitching) return;
        const curr = parseInt(pagepicker.querySelector(".page-picker-this")?.getAttribute("gpid") || "NaN");
        isswitching = true;
        if (deltaY > 5) {
            await showswitchto(homeshowcontainer, curr + 1);
        } else if (deltaY < -5 {
            await showswitchto(homeshowcontainer, curr - 1);
        }
        isswitching = false;
    };
    homeshowcontainer.addEventListener("wheel", (e) => onscrolllike(e.deltaY));
    listenTouchY(homeshowcontainer, onscrolllike);
}

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
