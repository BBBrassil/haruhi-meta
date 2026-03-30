((Home) => {
    const { Dates, Episodes, Format, Page, Site } = Haruhi;

    Home.episodes = {};
    Home.date = null;
    Home.calendar = null;

    const createCalendar = () => {
        const parent = document.getElementById("calendar");
        const input = document.getElementById("date-input");

        const options = {
            type: "inline",
            footer: false,
            input: input,
        };
        const calendar = window.calendarjs.Calendar(parent, options);

        input.placeholder = "yyyy-mm-dd";
        const onInput = (e, interrupt) => {
            const value = e.target.value?.trim();
            if (value === calendar.value) return;
            const nextDate = Dates.parseISODateInLocalTime(value);
            if (nextDate) {
                calendar.value = value;
            }
            else {
                if (interrupt) {
                    input.value = null;
                }
            }
        };
        input.addEventListener("input", (e) => onInput(e, false));
        input.addEventListener("change", (e) => onInput(e, true));

        return calendar;
    };

    const createDateModal = () => {
        const openButton = document.getElementById("date-open");
        const todayButton = document.getElementById("date-today");
        const cancelButton = document.getElementById("date-cancel");
        const saveButton = document.getElementById("date-save");
        const modal = document.getElementById("date-modal");

        Page.makeModal(modal);

        const onOpen = (_) => {
            Home.calendar.value = Dates.iso(Home.date);
            modal.showModal();
        };
        const onToday = (_) => {
            Home.calendar.value = Dates.iso(new Date());
        };
        const onCancel = (_) => {
            modal.close();
        };
        const onSave = (_) => {
            modal.close();

            Home.calendar.update();

            const previousDate = Home.date;
            const nextDate = Dates.parseISODateInLocalTime(Home.calendar.value);

            if (nextDate && previousDate.getTime() !== nextDate.getTime()) {
                Home.date = nextDate;
                Site.date = nextDate;
                Home.onRender();
            }
        };

        openButton.addEventListener("click", onOpen);
        todayButton.addEventListener("click", onToday);
        cancelButton.addEventListener("click", onCancel);
        saveButton.addEventListener("click", onSave);

        return modal;
    };

    Home.onRender = () => {
        const date = Home.date;
        const dateIso = Dates.iso(date);
        const time = document.getElementById("time");
        const clock = document.getElementById("clock");
        const empty = document.getElementById("empty");
        const episode = document.getElementById("episode");
        const thumb = document.getElementById("thumb");
        const caption = document.getElementById("caption");

        time.dateTime = dateIso;
        clock.innerHTML = [...dateIso].map((x) => `<span>${x}</span>`).join("");
        
        const schedule = Episodes.schedule(date.getFullYear());
        const current = schedule[dateIso];

        // Has episode
        if (current) {
            const multiple = Array.isArray(current);
            const { src, alt } = Home.episodes[multiple ? current[0] : current];
            thumb.src = src;
            thumb.alt = alt;
            const titles = (multiple ? current : [current]).map((x) => {
                const { title, type } = Home.episodes[x];
                return Page.createCitation(title, type);
            });
            caption.innerText = Format.episodeCaption(titles.length, date);
            Page.createSeries(titles, { conjunction: "&", padding: " " })
                .forEach(el => caption.appendChild(el));
            empty.classList.remove("show");
            episode.classList.add("show");
        }
        // Empty state
        else {
            episode.classList.remove("show");
            empty.classList.add("show");
            thumb.src = "";
            thumb.alt = "";
            caption.innerText = "";
            Page.removeChildren(caption);
        }
    };

    Home.onLoad = async () => {
        const date = Page.date ?? Site.date ?? new Date();

        Home.date = date;
        Site.date = date;
        Home.episodes = await Episodes.fetch();
        createDateModal();
        Home.calendar = createCalendar(date);

        Home.onRender();

        Page.fadeIn();
    };
})(Haruhi.Site.Home = Haruhi.Site.Home || {});