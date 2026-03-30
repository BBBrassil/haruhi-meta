(async () => {
    const fs = require("fs");
    const path = require("path");
    const glob = require("fast-glob");

    const dirname = process.cwd();
    const config = JSON.parse(fs.readFileSync(path.join(dirname, "config.json")));

    for (const code of config.bundle) {
        const globs = code.input;

        if (!globs) return;

        const files = glob.sync(globs)
            .sort((a, b) => (a.split("/").length - b.split("/").length) || a.localeCompare(b));

        for (const file of files) {
            require(path.join(dirname, file));
        }
    }
})();