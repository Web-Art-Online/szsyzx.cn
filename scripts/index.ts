window.addEventListener("DOMContentLoaded", () => {
    const homeshowcontainer = document.getElementById("home-full-show-container");
    const pagepicker = homeshowcontainer?.getElementsByClassName("page-picker")[0];
    const pageshower = homeshowcontainer?.getElementsByClassName("page-shower")[0];
    if (pagepicker && pageshower) {
        for (const page of pageshower.children) {
            const pageNumber = parseInt(page.getAttribute("gpid")?.toString() || "0");
            const picker = document.createElement("div");
            picker.classList.add(page.classList.contains("page-shower-this") ? "page-picker-this" : "page-picker-hide");
            picker.setAttribute("gpid", pageNumber.toString());
            pagepicker.appendChild(picker);
        }
    }
});
