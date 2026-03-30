((Site) => {
    const { Dates } = Haruhi;

    Object.defineProperty(Site, "date", {
        get: () => Dates.parseISODateInLocalTime(sessionStorage.getItem("date")),
        set: (value) => sessionStorage.setItem("date", Dates.iso(value))
    });

    Object.defineProperty(Site, "year", {
        get: () => Site.date?.getFullYear() || Number.parseInt(sessionStorage.getItem("year")),
        set: (value) => sessionStorage.setItem("year", value)
    });
})(Haruhi.Site = Haruhi.Site || {});