((Page) => {
    const { Dates } = Haruhi;

    Page.previousElement = null;

    const showModal = (modal) => {
        modal.setAttribute("open", "");
        modal.frame.classList.add("show");

        modal.trap.activate();
        Page.previousElement ??= document.activeElement;

        modal.body.classList.add("no-scroll");

        window.addEventListener("keydown", modal.onEsc);
    };

    const closeModal = (modal) => {
        window.removeEventListener("keydown", modal.onEsc);

        modal.removeAttribute("open");
        modal.frame.classList.remove("show");

        modal.body.classList.remove("no-scroll");

        modal.trap.deactivate();
        Page.previousElement?.focus();
        Page.previousElement = null;
    };

    const escModal = (e, modal) => {
        if (e.key === "Escape") {
            modal.close();
        }
    };

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (fn) {
            const ms = 16.66; // 60 fps
            setTimeout(fn, ms);
        };
    };

    Page.fadeIn = (el, ms = 250) => {
        el ??= Kyon.getRoot();
        Kyon.show(el);
        let opacity = 0;
        const delta = 16.66 / ms; // 60 fps
        function fade() {
            opacity += delta;
            if (opacity >= 1) {
                el.style.opacity = 1;
                return true;
            }
            el.style.opacity = opacity;
            window.requestAnimationFrame(fade);
        }
        fade();
    };

    Page.fadeOut = (el, ms = 250) => {
        el ??= Kyon.getRoot();
        let opacity = 1;
        const delta = 16.66 / ms; // 60 fps
        function fade() {
            opacity -= delta;
            if (opacity <= 0) {
                el.style.opacity = 0;
                Kyon.hide(el);
                return true;
            }
            el.style.opacity = opacity;
            window.requestAnimationFrame(fade);
        }
        fade();
    };

    Page.createCitation = (title, type) => {
        const el = document.createElement("cite");
        el.dataset.type = type;
        el.innerText = type === "tv-episode" ? `"${title}"` : title;
        return el;
    };

    Page.createSeries = (elements, { punctuation, conjunction, padding, oxford }) => {
        if (elements.length > 1) {
            padding ??= "";
            oxford = oxford !== false;
            const results = [elements[0]];
            for (let i = 1; i < elements.length - 1; ++i) {
                if (punctuation) {
                    const sep = document.createElement("span");
                    sep.innerText = punctuation + padding;
                    results.push(sep);
                }
                results.push(elements[i]);
            }
            const sepText = oxford && !!conjunction && !!punctuation && elements.length > 2
                ? punctuation + " " + conjunction + padding
                : (conjunction && padding + conjunction || punctuation || "") + padding
            if (sepText) {
                const sep = document.createElement("span");
                sep.innerText = sepText;
                results.push(sep);
            }
            results.push(elements[elements.length - 1]);
            return results;
        }
        if (elements.length === 1) {
            return [elements[0]];
        }
        return [];
    };

    Page.removeChildren = (parent) => {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    };

    Page.makeModal = (el) => {
        el.body = document.querySelector("body");
        el.frame = document.getElementById("modal-frame");
        el.trap = window.focusTrap.createFocusTrap(el);
        el.onEsc = (e) => escModal(e, el);
        el.showModal = () => showModal(el);
        el.close = () => closeModal(el);
        return el;
    };

    Object.defineProperty(Page, "date", {
        get: () => Dates.parseISODateInLocalTime(new URLSearchParams(window.location.search).get("date"))
    });

    Object.defineProperty(Page, "year", {
        get: () => {
            const param = new URLSearchParams(window.location.search).get("year");
            if (!/^[1-9]\d*$/.test(param)) return;
            return Number.parseInt(param);
        }
    });

})(Haruhi.Page = Haruhi.Page || {});