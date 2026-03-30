((Timeline) => {
    const { Dates, Episodes, Format, Page, Site } = Haruhi;

    Timeline.year = null;
    Timeline.episodes = {};
    Timeline.timeline = null;

    const createSubtitle = () => {
        const subtitle = document.getElementById("subtitle");

        const label = subtitle.appendChild(document.createElement("strong"));
        label.innerText = Format.timelineCaption();

        const year = label.appendChild(document.createElement("time"));
        year.dateTime = Timeline.year;
        year.innerText = Timeline.year;

        return subtitle;
    };

    const calcBefore = (days) => {
        return `${days}em`;
    };

    const calcAfter = (days) => {
        return `${2 + days}em`;
    };

    const calcGap = () => {
        return "5em";
    };

    const createTimeline = () => {
        const timeline = document.getElementById("timeline");
        Page.removeChildren(timeline);

        const olOuter = timeline.appendChild(document.createElement("ol"));

        const year = Timeline.year;
        const schedule = Episodes.monthlySchedule(year);

        const firstMonth = schedule.findIndex(x => Object.keys(x).length > 0);
        const lastMonth = schedule.findLastIndex(x => Object.keys(x).length > 0);
        for (let m = firstMonth; m <= lastMonth; ++m) {
            const group = schedule[m];
            const items = Object.keys(schedule[m]).map(iso => {
                const date = Dates.parseISODateInLocalTime(iso);
                const current = group[iso];
                const multiple = Array.isArray(current);
                const episodes = (multiple ? current : [current]).map(x => Timeline.episodes[x]);
                return { date, episodes, before: 0, after: 0 };
            });

            const liOuter = olOuter.appendChild(document.createElement("li"));

            const month = liOuter.appendChild(document.createElement("h2"))
                .appendChild(document.createElement("time"));
            month.dateTime = Dates.isoMonth(new Date(year, m, 1));
            month.innerText = Format.month(m, year);

            const endless = m + 1 === 8;
            let n = 1;

            if (items.length > 0) {
                const ol = liOuter.appendChild(document.createElement("ol"));
                items.forEach((x, i) => {
                    const li = ol.appendChild(document.createElement("li"));

                    li.classList.add("time-point");

                    const left = li.appendChild(document.createElement("div"));

                    const topLeft = left.appendChild(document.createElement("div"));
                    const time = left.appendChild(document.createElement("time"));
                    time.dateTime = Dates.iso(x.date);
                    time.innerText = Format.dayOfWeekShort(x.date);

                    const center = li.appendChild(document.createElement("div"));
                    const topCenter = center.appendChild(document.createElement("div"));
                    const img = center.appendChild(document.createElement("div"))
                        .appendChild(document.createElement("img"));
                    img.src = "/images/time_point.svg";
                    img.alt = "";

                    const right = li.appendChild(document.createElement("div"));
                    const topRight = right.appendChild(document.createElement("div"));
                    const event = right.appendChild(document.createElement("div"));
                    const titles = x.episodes.map(e => {
                        const { title, type } = e;
                        return Page.createCitation(title, type);
                    });
                    Page.createSeries(titles, { padding: " ", punctuation: "," })
                        .forEach(el => event.appendChild(el));
                    if (endless) {
                        if (x.episodes[0].title.endsWith(n)) {
                            ++n;
                            const asterisk = event.appendChild(document.createElement("span"));
                            asterisk.innerText = "*";
                        }
                    }

                    const before = calcBefore(i > 0
                        ? Dates.daysBetween(x.date, items[i - 1].date)
                        : x.date.getDate(),
                    );
                    topLeft.style.minHeight = before;
                    topCenter.style.minHeight = before;
                    topRight.style.minHeight = before;

                    const after = calcAfter(i === items.length - 1
                        ? Dates.daysBetween(Dates.getStartOfNextMonth(x.date), x.date)
                        : 0
                    );
                    time.style.minHeight = after;
                    img.parentElement.style.minHeight = after;
                    event.style.minHeight = after;
                });
            }
            else {
                const div = liOuter.appendChild(document.createElement("div"));
                div.classList.add("time-point");

                const left = div.appendChild(document.createElement("div"));
                const middle = div.appendChild(document.createElement("div"));
                const right = div.appendChild(document.createElement("div"));

                const caption = right.appendChild(document.createElement("span"));
                caption.innerText = Format.timelineMonthEmpty();
                caption.classList.add("caption");

                const gap = calcGap();
                left.style.minHeight = gap;
                middle.style.minHeight = gap;
                right.style.minHeight = gap;
            }
            if (endless) {
                const legend = liOuter.appendChild(document.createElement("div"));
                legend.innerText = Format.timelineMonthLegend();
                legend.classList.add("legend");
            }
        }

        return timeline;
    };

    Timeline.onLoad = async () => {
        const year = Page.year || Site.year || new Date().getFullYear();

        Timeline.year = year;
        Site.year = year;
        Timeline.episodes = await Episodes.fetch();
        Timeline.timeline = createTimeline();
        createSubtitle();

        Page.fadeIn();
    };

    return Timeline;
})(Haruhi.Site.Timeline = Haruhi.Site.Timeline || {});