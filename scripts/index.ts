/*
* MIT License
* (c) 2024 Web-Art-Online
*/

class PageShowPlayer {

    showcontainer: HTMLDivElement;
    pagepicker: HTMLDivElement;
    pageshower: HTMLDivElement;

    curr: number = 0;
    max: number = 0;
    isswitching: boolean = false;

    constructor(showcontainer: HTMLDivElement) {
        this.showcontainer = showcontainer;
        const pp = this.showcontainer.querySelector("div.page-picker");
        if (!(pp instanceof HTMLDivElement)) {
            this.pagepicker = document.createElement("div");
            this.pagepicker.className = "page-picker";
            this,showcontainer.append(this.pagepicker);
        } else {
            this.pagepicker = pp;
            this.pagepicker.innerHTML = "";
        }
        const ps = this.showcontainer.querySelector("div.page-shower");
        if (!(ps instanceof HTMLDivElement)) {
            throw new Error("No div.page-shower found here");
        } else {
            this.pageshower = ps;
        }
        for (const page of this.pageshower.children) {
            const gpid = parseInt(page.getAttribute("gpid") || "NaN");
            if (gpid > this.max) this.max = gpid;
            const pk = document.createElement("div");
            pk.setAttribute("gpid", gpid.toString());
            this.pagepicker.append(pk);
        }
        this.updatePageClassName();
        this.showcontainer.addEventListener("wheel", (e) => this.scrollLikeHandler(e.deltaY));
        touchSwipeListener(this.showcontainer, (y) => this.scrollLikeHandler(y));
        this.pagepicker.addEventListener("click", (e) => this.pickerClickHandler(e));
    }

    async updatePageClassName() {
        for (const page of this.pageshower.children) {
            const gpid = parseInt(page.getAttribute("gpid") || "NaN");
            if (gpid === this.curr) {
                page.className = "page-shower-this";
            } else if (gpid === (this.curr === this.max ? 0 : this.curr + 1)) {
                page.className = "page-shower-next";
            } else if (gpid === (this.curr === 0 ? this.max : this.curr - 1)) {
                page.className = "page-shower-last";
            } else {
                page.className = "page-shower-hide";
            }
        }
        for (const picker of this.pagepicker.children) {
            picker.className = parseInt(picker.getAttribute("gpid") || "NaN") === this.curr ? "page-picker-this" : "page-picker-hide";
        }
        await waitTransitionEnd(this.showcontainer);
    }

    async nextPage() {
        this.curr = this.curr === this.max ? 0 : this.curr + 1;
        await this.updatePageClassName();
    }

    async lastPage() {
        this.curr = this.curr === 0 ? this.max : this.curr - 1;
        await this.updatePageClassName();
    }

    async switchTo(target: number) {
        if (target > this.max) {
            target = 0;
        } else if (Number.isNaN(target)) {
            return;
        }
        while (target !== this.curr) {
            if (this.upordown(target)) {
                await this.nextPage();
            } else {
                await this.lastPage();
            }
        }
    }

    upordown(target: number) {
        const dis = this.curr - target;
        if (dis < 0) {
            return (dis * -2) < (this.max + 1);
        } else {
            return (dis * 2) > (this.max + 1);
        }
    }

    async scrollLikeHandler(deltaY: number) {
        if (this.isswitching) return;
        this.isswitching = true;
        if (deltaY > 5) {
            await this.nextPage();
        } else if (deltaY < -5) {
            await this.lastPage();
        }
        this.isswitching = false;
    }

    async pickerClickHandler(e: MouseEvent) {
        if (e.target instanceof HTMLDivElement && e.target.parentElement === this.pagepicker && !this.isswitching) {
            this.isswitching = true;
            await this.switchTo(parseInt(e.target.getAttribute("gpid") || "NaN"));
            this.isswitching = false;
        }
    }

}

async function waitTransitionEnd(elem: HTMLElement) {
    return await new Promise<void>((resolve) => {
        const fn = () => {
            elem.removeEventListener("transitionend", fn);
            resolve();
        };
        elem.addEventListener("transitionend", fn);
    });
}

function touchSwipeListener(elem: HTMLElement, cb: (deltaY: number) => void) {
    let startY = 0;
    elem.addEventListener("touchstart", (e) => {
        startY = e.touches[0].clientY;
    });
    elem.addEventListener("touchmove", (e) => {
        cb(startY - e.touches[0].clientY);
        startY = e.touches[0].clientY;
        e.preventDefault();
    });
}

function extraStyles() {
    const style = document.createElement("style");
    document.head.append(style);
    const fn = () => {
        style.innerHTML = `
            #home-full-show-container > .page-shower > * > * {
                height: ${window.innerHeight}px;
            }
        `.replace(/\s+/g, " ");
    };
    window.addEventListener("resize", fn);
    fn();
}

window.addEventListener("DOMContentLoaded", () => {
    // extra styles
    extraStyles();
    // home show
    const homeshowcontainer = document.querySelector("div#home-full-show-container");
    if (homeshowcontainer instanceof HTMLDivElement) {
        const psp = new PageShowPlayer(homeshowcontainer);
        /*(async () => {
            while (true) {
                await new Promise((resolve) => window.setTimeout(resolve, 6e3));
                if (psp.isswitching) continue;
                psp.isswitching = true;
                psp.nextPage();
                psp.isswitching = false;
            }
        })();*/
    }
});
