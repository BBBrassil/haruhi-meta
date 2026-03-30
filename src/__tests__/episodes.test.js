beforeAll(async () => {
    require("./polyfill.js");
    require("./bundle.js");
});
const smallRangeOfYears = [...Array(42).keys().map(x => 1999 + x)];
const largeRangeOfYears = [...Array(420).keys().map(x => 1799 + x)];

const cleanSchedule = (s) => {
    return Object.keys(s)
        .sort()
        .map(k => {
            const current = s[k];
            const v = Array.isArray(current)
                ? JSON.stringify(current)
                : current;
            return { date: k, actual: v };
        })
};

describe("given 2009 schedule", () => {
    const s0 = [
        { date: "2009-05-06", expected: "melancholy1" },
        { date: "2009-05-12", expected: "melancholy2" },
        { date: "2009-05-15", expected: "melancholy3" },
        { date: "2009-05-19", expected: "melancholy4" },
        { date: "2009-05-20", expected: "melancholy5" },
        { date: "2009-05-21", expected: "melancholy6" },
        { date: "2009-06-14", expected: "boredom" },
        { date: "2009-07-07", expected: "bambooLeafRhapsody" },
        { date: "2009-07-09", expected: "mysteriqueSign" },
        { date: "2009-07-18", expected: "remoteIslandSyndrome1" },
        { date: "2009-07-19", expected: "remoteIslandSyndrome2" },
        { date: "2009-08-01", expected: "endlessEight1" },
        { date: "2009-08-02", expected: "endlessEight5" },
        { date: "2009-08-03", expected: "endlessEight6" },
        { date: "2009-08-04", expected: "endlessEight3" },
        { date: "2009-08-05", expected: "endlessEight7" },
        { date: "2009-08-06", expected: "endlessEight2" },
        { date: "2009-08-07", expected: "endlessEight4" },
        { date: "2009-08-08", expected: "endlessEight7" },
        { date: "2009-08-09", expected: "endlessEight6" },
        { date: "2009-08-10", expected: "endlessEight4" },
        { date: "2009-08-11", expected: "endlessEight3" },
        { date: "2009-08-12", expected: "endlessEight2" },
        { date: "2009-08-13", expected: "endlessEight5" },
        { date: "2009-08-14", expected: "endlessEight4" },
        { date: "2009-08-15", expected: "endlessEight6" },
        { date: "2009-08-16", expected: "endlessEight5" },
        { date: "2009-08-17", expected: "endlessEight3" },
        { date: "2009-08-18", expected: "endlessEight2" },
        { date: "2009-08-19", expected: "endlessEight7" },
        { date: "2009-08-20", expected: "endlessEight6" },
        { date: "2009-08-21", expected: "endlessEight4" },
        { date: "2009-08-22", expected: "endlessEight2" },
        { date: "2009-08-23", expected: "endlessEight5" },
        { date: "2009-08-24", expected: "endlessEight3" },
        { date: "2009-08-25", expected: "endlessEight7" },
        { date: "2009-08-26", expected: "endlessEight3" },
        { date: "2009-08-27", expected: "endlessEight6" },
        { date: "2009-08-28", expected: "endlessEight4" },
        { date: "2009-08-29", expected: "endlessEight5" },
        { date: "2009-08-30", expected: "endlessEight7" },
        { date: "2009-08-31", expected: "endlessEight8" },
        { date: "2009-10-22", expected: "sigh1" },
        { date: "2009-10-23", expected: "sigh2" },
        { date: "2009-10-24", expected: "sigh3" },
        { date: "2009-10-25", expected: "sigh4" },
        { date: "2009-10-26", expected: "sigh5" },
        { date: "2009-10-31", expected: "[\"episode00\",\"liveAlive\"]" },
        { date: "2009-11-04", expected: "dayOfSagittarius" },
        { date: "2009-11-27", expected: "somedayInTheRain" },
        { date: "2009-12-18", expected: "disappearance" },
    ];

    test("exact year matches", () => {
        const s = cleanSchedule(Haruhi.Episodes.schedule(2009));

        expect(s).toHaveLength(s0.length);

        s0.forEach((x, i) => {
            const { date: expectedDate, expected } = x;
            const { date: actualDate, actual } = s[i];

            expect(actualDate).toBe(expectedDate);

            if (!expected.startsWith("endlessEight")) {
                expect(actual).toBe(expected);
            }
        });
    });

    test.each([
        1953, 1959, 1970, 1981, 1987, 1998, 2015, 2026, 2037, 2043
    ])("similar year matches", (year) => {
        const s = cleanSchedule(Haruhi.Episodes.schedule(year));

        expect(s).toHaveLength(s0.length);

        s0.forEach((x, i) => {
            const { date, expected } = x;
            const [_, month, day] = date.split("-");
            const expectedDate = `${year}-${month}-${day}`;
            const { date: actualDate, actual } = s[i];

            expect(actualDate).toBe(expectedDate);

            if (!expected.startsWith("endlessEight")) {
                expect(actual).toBe(expected);
            }
        });
    });

    test.each(largeRangeOfYears)("other year's episodes are in order", (year) => {
        const s = cleanSchedule(Haruhi.Episodes.schedule(year));

        expect(s).toHaveLength(s0.length);

        s0.forEach((x, i) => {
            const { expected } = x;
            const { actual } = s[i];

            if (!expected.startsWith("endlessEight")) {
                expect(actual).toBe(expected);
            }
        });
    });
});

describe("given a year's schedule", () => {
    test.each(largeRangeOfYears)("exact day matches", (year) => {
        const s = Haruhi.Episodes.schedule(year);

        const july7 = `${year}-07-07`;
        const dec18 = `${year}-12-18`;

        expect(s[july7]).toBe("bambooLeafRhapsody");
        expect(s[dec18]).toBe("disappearance");
    });

    test.each(largeRangeOfYears)("months match", (year) => {
        const months = cleanSchedule(Haruhi.Episodes.schedule(year))
            .map(x => {
                const [year, month, day] = x.date.split("-");
                const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day));
                return date.getDay();
            });

        expect(months[0]).not.toBe(0); // melancholy1:           not Sunday
        expect(months[0]).not.toBe(6); // melancholy1:           not Saturday
        expect(months[1]).toBe(2);     // melancholy2:           Tuesday
        expect(months[2]).toBe(5);     // melancholy3:           Friday
        expect(months[3]).toBe(2);     // melancholy4:           Tuesday
        expect(months[4]).toBe(3);     // melancholy5:           Wednesday
        expect(months[5]).toBe(4);     // melancholy6:           Thursday
        expect(months[6]).toBe(0);     // boredom:               Sunday
        expect(months[8]).toBe(4);     // mysteriqueSign:        Thursday
        expect(months[9]).toBe(6);     // remoteIslandSyndrome1: Saturday
        expect(months[10]).toBe(0);    // remoteIslandSyndrome2: Sunday
        expect(months[42]).toBe(4);    // sigh1:                 Thursday
        expect(months[43]).toBe(5);    // sigh2:                 Friday 
        expect(months[44]).toBe(6);    // sigh3:                 Saturday 
        expect(months[45]).toBe(0);    // sigh4:                 Sunday
        expect(months[46]).toBe(1);    // sigh5:                 Monday
        expect(months[47]).toBe(6);    // liveAlive/episode00:   Saturday
        expect(months[49]).toBe(5);    // somedayInTheRain:      Friday
    });

    test.each(largeRangeOfYears)("months match", (year) => {
        const months = cleanSchedule(Haruhi.Episodes.schedule(year))
            .map(x => {
                const [year, month, day] = x.date.split("-");
                return Number.parseInt(month);
            });

        expect(months[0]).toBe(5);  // melancholy1-6
        expect(months[1]).toBe(5);
        expect(months[2]).toBe(5);
        expect(months[3]).toBe(5);
        expect(months[4]).toBe(5);
        expect(months[5]).toBe(5);
        expect(months[6]).toBe(6);  // boredom
        expect(months[7]).toBe(7);  // bambooLeafRhapsody
        expect(months[8]).toBe(7);  // mysteriqueSign
        expect(months[9]).toBe(7);  // remoteIslandSyndrome1-2
        expect(months[10]).toBe(7);
        expect(months[11]).toBe(8);  // endlessEight1-8
        expect(months[41]).toBe(8);
        expect(months[48]).toBe(11); // dayOfSagittarius
        expect(months[49]).toBe(11); // somedayInTheRain
        expect(months[50]).toBe(12); // disappearance
    });

    test.each(smallRangeOfYears)("Endless Eight is in order", (year) => {
        const s = cleanSchedule(Haruhi.Episodes.schedule(year))
            .filter(x => x.actual.startsWith("endlessEight"));

        expect(s).toHaveLength(31);

        expect(s[0].actual).toBe("endlessEight1");
        for (let i = 1; i < 30 - 1; ++i) {
            const { actual } = s[i];
            expect(actual).not.toBe("endlessEight1");
            expect(actual).not.toBe("endlessEight8");
        }
        expect(s[30].actual).toBe("endlessEight8");
    });

    test.each(largeRangeOfYears)("monthly schedule matches", (year) => {
        const expected = Object.entries(Haruhi.Episodes.schedule(year))
            .sort((a, b) => a[0].localeCompare(b[0]));
        const actual = Haruhi.Episodes.monthlySchedule(year)
            .filter(x => Object.keys(x).length > 0)
            .flat()
            .map(x => Object.entries(x))
            .flat();

        expect(actual.length).toBe(expected.length);

        for (let i = 0; i < expected.length; ++i) {
            const e = expected[i];
            const a = actual[i];

            expect(a).toEqual(e);
        }
    });

    test.each(largeRangeOfYears)("monthly schedule is grouped by month", (year) => {
        const actual = Haruhi.Episodes.monthlySchedule(year)
            .map(x => Object.keys(x));

        actual.filter(group => group.length > 1).forEach(group => {
            const [first, ...rest] = group;
            const [year, month] = first.split("-");

            const expected = new RegExp(`^${year}-${month}-\\d+$`);
            for (const actual of rest) {
                expect(actual).toMatch(expected);
            }
        })
    });
});