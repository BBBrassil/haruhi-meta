beforeAll(async () => {
    require("./polyfill.js");
    require("./bundle.js");
});

describe("swap", () => {
    describe("given an array with n elements", () => {
        test("two elements are exchanged after a swap", () => {
            const arr = [...Array(10).keys()];

            for (let i = 0; i < arr.length - 1; ++i) {
                for (let j = i + 1; j < arr.length; ++j) {
                    const [...cpy] = arr;

                    Haruhi.Arrays.swap(arr, i, j);
                    
                    expect(arr[i]).toBe(cpy[j]);
                    expect(arr[j]).toBe(cpy[i]);
                }
            }
        });

        test("the array is unchanged after swapping one element with itself", () => {
            const arr = [...Array(10).keys()];

            for (let i = 0; i < arr.length; ++i) {
                const [...cpy] = arr;

                Haruhi.Arrays.swap(arr, i, i);

                expect(arr).toEqual(cpy);
            }
        });

        test("the array contains the same values after a swap", () => {
            const arr = [...Array(10).keys()];
            
            for (let i = 0; i < arr.length - 1; ++i) {
                for (let j = i + 1; j < arr.length; ++j) {
                    const [...cpy] = arr.toSorted();

                    Haruhi.Arrays.swap(arr, i, j);

                    expect(arr.toSorted()).toEqual(cpy);
                }
            }
        });

        test("other elements are unchanged after a swap", () => {
            const arr = [...Array(10).keys()];
            
            for (let i = 0; i < arr.length - 1; ++i) {
                for (let j = 0; j < arr.length; ++j) {
                    const [...cpy] = arr;

                    Haruhi.Arrays.swap(arr, i, j);

                    for (let k = 0; k < arr.length; ++k) {
                        if (k !== i && k !== j) {
                            expect(arr[k]).toBe(cpy[k]);
                        }
                    }
                }
            }
        });

        test("the array is back to normal after two swaps", () => {
            const arr = [...Array(10).keys()];
            const cpy = [...arr];

            for (let i = 0; i < arr.length - 1; ++i) {
                for (let j = i + 1; j < arr.length; ++j) {
                    Haruhi.Arrays.swap(arr, i, j);
                    Haruhi.Arrays.swap(arr, i, j);

                    expect(arr).toEqual(cpy);
                }
            }
        });
    });
});

describe("shuffle", () => {
    describe("given an empty array", () => {
        test("the array remains empty after repeated shuffling", () => {
            const arr = [];

            for (let i = 0; i < 100; ++i) {
                Haruhi.Arrays.shuffle(arr);

                expect(arr).toHaveLength(0);
            }
        })
    });

    describe("given an array with 1 element", () => {
        test.each([
            -1000, -1, 0, 1, 10000
        ])("the array stays the same after repeated shuffling", (x) => {
            const arr = [x];

            for (let i = 0; i < 100; ++i) {
                Haruhi.Arrays.shuffle(arr);

                expect(arr).toHaveLength(1);
                expect(arr[0]).toBe(x);
            }
        });
    });

    describe("given an array with 2 elements", () => {
        test.each([
            [0, 0], [-1, -1000], [-1, 1], [4, 2], [99, 100]
        ])("the array contains the same values after repeated shuffling", (a, b) => {
            const arr = [a, b];

            for (let i = 0; i < 100; ++i) {
                Haruhi.Arrays.shuffle(arr);

                expect(arr).toHaveLength(2);
                expect(arr).toContain(a);
                expect(arr).toContain(b);
                if (arr[0] === a) {
                    expect(arr[1]).toBe(b);
                }
                else {
                    expect(arr[1]).toBe(a);
                }
            }
        });
    });

    describe("given an array with n elements", () => {
        test("the array is in different order after shuffling with a sufficiently large n", () => {
            const n = 1000;
            const arr = [...Array(n).keys()];
            const cpy = arr.toSorted();

            Haruhi.Arrays.shuffle(arr);

            expect(arr).not.toEqual(cpy);
        });

        test("the array contains the same values after repeated shuffling", () => {
            const k = 100;
            const arr = [...Array(10).keys()];
            const cpy = arr.toSorted();

            for (let i = 0; i < k; ++i) {
                Haruhi.Arrays.shuffle(arr);
            }

            expect(arr.sort()).toEqual(cpy);

        });
    })
})

describe("roundRobinNoRepeats", () => {
    describe("given an array with n elements", () => {
        test("where k is the number of samples, the arrangement contains n * k elements", () => {
            const arr = [...Array(10)];
            const n = arr.length;
            const k = 10;

            const rr = Haruhi.Arrays.roundRobinNoRepeats(arr, k);

            expect(rr).toHaveLength(n * k);
        });

        test("the arrangement contains no repeats", () => {
            const arr = [...Array(10).keys()];
            const k = 10;
            
            const rr = Haruhi.Arrays.roundRobinNoRepeats(arr, k);

            const repeats = rr.reduce((a, x) => {
                if (a.prev === x) {
                    ++a.n;
                }
                a.prev = x;
                return a;
            }, { n: 0 }).n;
            
            expect(repeats).toBe(0);
        });

        test("slices of the arrangement are in different order for a sufficiently large n", () => {
            const n = 1000;
            const k = 3;
            const arr = [...Array(1000).keys()];

            const rr = Haruhi.Arrays.roundRobinNoRepeats(arr, k);

            const [a, b, c] = [rr.slice(0, n), rr.slice(n, 2 * n), rr.slice(2 * n)];

            expect(a).not.toEqual(b);
            expect(b).not.toEqual(c);
            expect(a).not.toEqual(c);
        });
    });
});