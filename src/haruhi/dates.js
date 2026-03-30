((Dates) => {
    Dates.iso = (date) => {
        return window.calendarjs.Helpers.toString(date, true);
    };

    Dates.isoMonth = (date) => {
        const iso = Dates.iso(date);
        const index = iso.lastIndexOf("-");
        return iso.slice(0, index);
    };

    Dates.join = ({ year, month, day }) => {
        return new Date(year, month - 1, day);
    };

    Dates.split = (value) => {
        return {
            year: value.getFullYear(),
            month: value.getMonth() + 1,
            day: value.getDate()
        }
    };

    Dates.addDays = (date, days) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
    };

    Dates.daysBetween = (first, second) => {
        const start = new Date(first.getTime()).setHours(0, 0, 0);
        const end = new Date(second.getTime()).setHours(0, 0, 0);
        return Math.round(Math.abs((end - start) / (24 * 60 * 60 * 1000)));
    };

    Dates.getBusinessDayAfter = (date) => {
        const day = date.getDay();
        return Dates.addDays(date, day === 5 ? 3 : day == 6 ? 2 : 1);
    };

    Dates.getStartOfNextMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    };

    Dates.getWeekdayAfter = (date, weekday) => {
        const day = date.getDay();
        return Dates.addDays(
            date,
            weekday - day > 0 ? weekday - day : 7 + weekday - day
        );
    };

    Dates.getWeekdayBefore = (date, weekday) => {
        const day = date.getDay();
        return Dates.addDays(date, weekday - day < 0 ? weekday - day : weekday - day - 7);
    };

    Dates.getWeekdayInMonth = (year, month, weekday, n) => {
        const d = new Date(year, month, 1);
        d.setDate(1 + ((weekday - d.getDay() + 7) % 7) + (n - 1) * 7);
        return d;
    };

    Dates.parseISODateInLocalTime = (s) => {
        if (!s) return;
        const res = /^(\d+)-([0][1-9]|1[0-2])-([0][1-9]|[1-2]\d|3[01])$/.exec(s);
        if (!res) return;
        const [_, year, month, day] = res;
        return new Date(year, month - 1, day);
    };
})(Haruhi.Dates = Haruhi.Dates || {});