window.addEventListener("DOMContentLoaded", () => {
    const homeshowcontainer = document.getElementById("home-full-show-container");
    const pagepicker = homeshowcontainer?.getElementsByClassName("page-picker")[0];
    const pageshower = homeshowcontainer?.getElementsByClassName("page-shower")[0];
    const maxgpid = pageshower?.childElementCount as number - 1 || 0;
    if (pagepicker && pageshower) {
        for (const page of pageshower.children) {
            const pageNumber = parseInt(page.getAttribute("gpid")?.toString() || "0");
            const picker = document.createElement("div");
            picker.classList.add(page.classList.contains("page-shower-this") ? "page-picker-this" : "page-picker-hide");
            picker.setAttribute("gpid", pageNumber.toString());
            pagepicker.appendChild(picker);
        }
        pagepicker.addEventListener("click", (event: Event) => {
            if (event.target instanceof HTMLDivElement && event.target.parentElement === pagepicker) {
                const targetgpid = parseInt(event.target.getAttribute("gpid") || "0");
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
                    picker.className = "";
                    if (picker.getAttribute("gpid") === targetgpid.toString()) {
                        picker.classList.add("page-picker-this");
                    } else {
                        picker.classList.add("page-picker-hide");
                    }
                }
            }
        });
    }
});
