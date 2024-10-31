const showswitchto = (showcontainer: HTMLDivElement, targetgpid: number) => {
    const pagepicker = showcontainer.querySelector(".page-picker");
    const pageshower = showcontainer.querySelector(".page-shower");
    if (!pagepicker || !pageshower) {
        return; // not valid showcontainer
    }
    const maxgpid = pageshower.childElementCount - 1;
    let currentgpid = NaN; // NaN by default
    // pagepicker
    for (const picker of pagepicker.children) {
        const pickergpid = parseInt(picker.getAttribute("gpid") || "0");
        if (picker.className === "page-picker-this") {
            currentgpid = pickergpid;
            if (currentgpid === targetgpid) {
                return; // start and end are same
            }
        }
        picker.className = pickergpid === targetgpid ? "page-picker-this" : "page-picker-hide";
    }
    // pageshower
    let isup = true; // 'up' in most cases
    for (const page of pageshower.children) {
        const pagegpid = parseInt(page.getAttribute("gpid") || "0");
        if (targetgpid !== pagegpid && currentgpid !== pagegpid) {
            page.className = "page-shower-hide";
            continue;
        }
        // set className with min abs dis
        const dis = currentgpid - pagegpid;
        if (dis < 0) {
            if (dis * -2 < maxgpid + 1) {
                // up
                page.className = "page-shower-last";
            } else {
                // down
                page.className = "page-shower-next";
            }
        } else if (dis > 0) {
            if (dis * 2 < maxgpid + 1) {
                // down
                page.className = "page-shower-next";
            } else {
                // up
                page.className = "page-shower-last";
            }
        } else {
            // itself
            page.className = "page-shower-this";
        }
    }
    // transition
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

window.addEventListener("DOMContentLoaded", () => {
    const homeshowcontainer = document.getElementById("home-full-show-container");
    if (homeshowcontainer && homeshowcontainer instanceof HTMLDivElement) {
        loadhomeshow(homeshowcontainer);
    }
});
