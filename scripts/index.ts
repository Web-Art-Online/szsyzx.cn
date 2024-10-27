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
                const targetgpid = parseInt(e.target.getAttribute("gpid") || "0");
                // shower
                for (const page of pageshower.children) {
                    const pagegpid = parseInt(page.getAttribute("gpid") || "0");
                    if (pagegpid === targetgpid) {
                        page.className = "page-shower-this";
                    } else if (pagegpid === (targetgpid + 1 > maxgpid ? 0 : targetgpid + 1)) {
                        page.className = "page-shower-next";
                    } else if (pagegpid === (targetgpid - 1 < 0 ? maxgpid : targetgpid - 1)) {
                        page.className = "page-shower-last";
                    } else {
                        page.className = "page-shower-hide";
                    }
                }
                // picker
                for (const picker of pagepicker.children) {
                    if (picker.getAttribute("gpid") === targetgpid.toString()) {
                        picker.className = "page-picker-this";
                    } else {
                        picker.className = "page-picker-hide";
                    }
                }
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
