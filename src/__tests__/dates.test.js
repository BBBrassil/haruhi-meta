beforeAll(async () => {
    require("./polyfill.js");
    require("./bundle.js");
});

const parseDate = (iso) => {
    const [year, month, day] = iso.split("-");
    return new Date(year, month - 1, day);
}

test.each([
    [1969, 12, 31, "1969-12-31"],
    [1970, 1, 1, "1970-01-01"],
    [1999, 12, 31, "1999-12-31"],
    [2000, 1, 1, "2000-01-01"],
    [2006, 4, 2, "2006-04-02"],
    [2006, 12, 18, "2006-12-18"],
    [2006, 12, 25, "2006-12-25"],
    [2006, 2, 6, "2006-02-06"],
    [2026, 2, 6, "2026-02-06"],
    [2024, 2, 29, "2024-02-29"],
])("iso", (year, month, day, expected) => {
    const date = new Date(year, month - 1, day);

    const actual = Haruhi.Dates.iso(date);

    expect(actual).toBe(expected);
});

test.each([
    [1969, 12, 31, "1969-12"],
    [1970, 1, 1, "1970-01"],
    [1999, 12, 31, "1999-12"],
    [2000, 1, 1, "2000-01"],
    [2006, 4, 2, "2006-04"],
    [2006, 12, 18, "2006-12"],
    [2006, 12, 25, "2006-12"],
    [2006, 2, 6, "2006-02"],
    [2026, 2, 6, "2026-02"],
    [2024, 2, 29, "2024-02"],
])("isoMonth", (year, month, day, expected) => {
    const date = new Date(year, month - 1, day);

    const actual = Haruhi.Dates.isoMonth(date);

    expect(actual).toBe(expected);
});

test.each([
    [1969, 12, 31, "1969-12"],
    [1970, 1, 1, "1970-01"],
    [1999, 12, 31, "1999-12"],
    [2000, 1, 1, "2000-01"],
    [2006, 4, 2, "2006-04"],
    [2006, 12, 18, "2006-12"],
    [2006, 12, 25, "2006-12"],
    [2006, 2, 6, "2006-02"],
    [2026, 2, 6, "2026-02"],
    [2024, 2, 29, "2024-02"],
])("join", (year, month, day) => {
    const date = Haruhi.Dates.join({ year, month, day });

    const actual = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };

    expect(actual.year).toBe(year);
    expect(actual.month).toBe(month);
    expect(actual.day).toBe(day);
});

test.each([
    [1969, 12, 31, "1969-12"],
    [1970, 1, 1, "1970-01"],
    [1999, 12, 31, "1999-12"],
    [2000, 1, 1, "2000-01"],
    [2006, 4, 2, "2006-04"],
    [2006, 12, 18, "2006-12"],
    [2006, 12, 25, "2006-12"],
    [2006, 2, 6, "2006-02"],
    [2026, 2, 6, "2026-02"],
    [2024, 2, 29, "2024-02"],
])("split", (year, month, day) => {
    const date = new Date(year, month - 1, day);

    const actual = Haruhi.Dates.split(date);

    expect(actual.year).toBe(year);
    expect(actual.month).toBe(month);
    expect(actual.day).toBe(day);
});

test.each([
    ["1969-12-31", 1, "1970-01-01"],
    ["1970-01-01", -1, "1969-12-31"],
    ["1999-11-01", 60, "1999-12-31"],
    ["2006-04-02", 0, "2006-04-02"],
    ["2006-04-02", 365, "2007-04-02"],
    ["2006-04-02", -365, "2005-04-02"],
    ["2006-12-25", -7, "2006-12-18"],
    ["2006-02-06", 7305, "2026-02-06"],
    ["2024-01-30", 30, "2024-02-29"],
    ["2024-03-30", -30, "2024-02-29"],
])("addDays", (date, days, expected) => {
    const start = parseDate(date);
    const end = Haruhi.Dates.addDays(start, days);
    const actual = Haruhi.Dates.iso(end);

    expect(actual).toBe(expected);
});

test.each([
    ["1969-12-31", "1970-01-01", 1],
    ["1970-01-01", "1969-12-31", 1],
    ["1999-11-01", "1999-12-31", 60],
    ["2006-04-02", "2006-04-02", 0],
    ["2006-04-02", "2007-04-02", 365],
    ["2006-04-02", "2005-04-02", 365],
    ["2006-12-25", "2006-12-18", 7],
    ["2006-02-06", "2026-02-06", 7305],
    ["2024-01-30", "2024-02-29", 30],
    ["2024-03-30", "2024-02-29", 30],
])("daysBetween", (start, end, expected) => {
    const actual = Haruhi.Dates.daysBetween(parseDate(start), parseDate(end));

    expect(actual).toBe(expected);
});

test.each([
    ["2026-03-29", "2026-03-30"],
    ["2026-03-30", "2026-03-31"],
    ["2026-03-31", "2026-04-01"],
    ["2026-04-01", "2026-04-02"],
    ["2026-04-02", "2026-04-03"],
    ["2026-04-03", "2026-04-06"],
    ["2026-04-04", "2026-04-06"],
])("getBusinessDayAfter", (date, expected) => {
    const start = parseDate(date);
    const end = Haruhi.Dates.getBusinessDayAfter(start);
    const actual = Haruhi.Dates.iso(end);

    expect(actual).toBe(expected);
});

test.each([
    ["2024-02-29", "2024-03-01"],
    ["2026-02-06", "2026-03-01"],
    ["2006-12-18", "2007-01-01"],
    ["2006-04-02", "2006-05-01"],
    ["2006-04-30", "2006-05-01"],

])("getStartOfNextMonth", (date, expected) => {
    const start = parseDate(date);
    const end = Haruhi.Dates.getStartOfNextMonth(start);
    const actual = Haruhi.Dates.iso(end);

    expect(actual).toBe(expected);
});

test.each([
    ["2026-03-26", 0, "2026-03-29"],
    ["2026-03-26", 1, "2026-03-30"],
    ["2026-03-26", 2, "2026-03-31"],
    ["2026-03-26", 3, "2026-04-01"],
    ["2026-03-26", 4, "2026-04-02"],
    ["2026-03-26", 5, "2026-03-27"],
    ["2026-03-26", 6, "2026-03-28"],
])("getWeekdayAfter", (date, weekday, expected) => {
    const start = parseDate(date);
    const end = Haruhi.Dates.getWeekdayAfter(start, weekday);
    const actual = Haruhi.Dates.iso(end);

    expect(actual).toBe(expected);
});

test.each([
    ["2026-04-02", 0, "2026-03-29"],
    ["2026-04-02", 1, "2026-03-30"],
    ["2026-04-02", 2, "2026-03-31"],
    ["2026-04-02", 3, "2026-04-01"],
    ["2026-04-02", 4, "2026-03-26"],
    ["2026-04-02", 5, "2026-03-27"],
    ["2026-04-02", 6, "2026-03-28"],
])("getWeekdayBefore", (date, weekday, expected) => {
    const start = parseDate(date);
    const end = Haruhi.Dates.getWeekdayBefore(start, weekday);
    const actual = Haruhi.Dates.iso(end);

    expect(actual).toBe(expected);
});

test.each([
    [2026, 6, 0, 2, "2026-06-14"],
    [2026, 7, 4, 2, "2026-07-09"],
    [2026, 7, 6, 3, "2026-07-18"],
    [2026, 3, 0, 1, "2026-03-01"],
    [2026, 3, 2, 5, "2026-03-31"],

])("getWeekdayInMonth", (year, month, weekday, n, expected) => {
    const end = Haruhi.Dates.getWeekdayInMonth(year, month - 1, weekday, n);
    const actual = Haruhi.Dates.iso(end);

    expect(actual).toBe(expected);
});

describe("parseISODateInLocalTime", () => {
    test.each([
        ["1969-12-31", 1969, 12, 31],
        ["1970-01-01", 1970, 1, 1],
        ["1999-12-31", 1999, 12, 31],
        ["2000-01-01", 2000, 1, 1],
        ["2006-04-02", 2006, 4, 2],
        ["2006-12-18", 2006, 12, 18],
        ["2006-12-25", 2006, 12, 25],
        ["2006-02-06", 2006, 2, 6],
        ["2026-02-06", 2026, 2, 6],
        ["2024-02-29", 2024, 2, 29],
    ])("valid date", (date, year, month, day) => {
        const actual = Haruhi.Dates.parseISODateInLocalTime(date);

        expect(actual.getFullYear()).toBe(year);
        expect(actual.getMonth()).toBe(month - 1);
        expect(actual.getDate()).toBe(day);
    });

    test.each([
        ["Haruhi"],
        ["April 2nd, 2006"],
        ["12/18/2006"],
        ["2026-2-6"],
        ["19691231"],
    ])("invalid date", (date) => {
        const actual = Haruhi.Dates.parseISODateInLocalTime(date);

        expect(actual).toBeUndefined();
    });

    test("empty date", () => {
        expect(Haruhi.Dates.parseISODateInLocalTime()).toBeUndefined();
        expect(Haruhi.Dates.parseISODateInLocalTime(null)).toBeUndefined();
        expect(Haruhi.Dates.parseISODateInLocalTime("")).toBeUndefined();
    });
});