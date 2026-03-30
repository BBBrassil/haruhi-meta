((Arrays) => {
    Arrays.swap = (arr, i, j) => {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    };

    Arrays.shuffle = (arr, rng) => {
        rng ??= Math.random;
        let i = arr.length;
        let j;
        while (--i > 0) {
            j = Math.floor(rng() * (i + 1));
            Arrays.swap(arr, i, j);
        }
    };

    Arrays.roundRobinNoRepeats = (arr, k, rng) => {
        rng ??= Math.random;
        const n = arr.length;
        const result = [];
        for (let i = 0; i < k; ++i) {
            Arrays.shuffle(arr, rng);
            result.push(...arr);
        }
        for (let i = n; i < result.length; i += n) {
            if (result[i] === result[i - 1]) {
                Arrays.swap(result, i, i + n - 1);
            }
        }
        return result;
    };
})(Haruhi.Arrays = Haruhi.Arrays || {});