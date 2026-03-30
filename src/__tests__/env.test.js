beforeAll(async () => {
    require("./polyfill.js");
    require("./bundle.js");
});

describe("given jsdom environment", () => {
    test("window exists", () => {
        expect(window).toBeDefined();
    });
});

describe("given CalendarJS polyfill", () => {
    test("window has calendarjs poperty", () => {
        expect(window).toHaveProperty("calendarjs");
    });

    test("simple CalendarJS helper functions", () => {
        const date = new Date(2006, 3, 9);

        const expected = "2006-04-09";
        const actual = window.calendarjs.Helpers.toString(date, true);

        expect(actual).toBe(expected);
    });
});

describe("given bundle requirement", () => {
    test.each(["Haruhi", "Kyon"])("window has property", (key) => {
        expect(window).toHaveProperty(key);
    });

    test.each([
        "Arrays", "Dates", "Format", "Episodes", "Page", "Site"
    ])("Haruhi has property", (key) => {
        expect(window.Haruhi).toHaveProperty(key);
    });
});