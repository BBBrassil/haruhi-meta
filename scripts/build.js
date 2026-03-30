"use strict";

import fs from "fs";
import path from "path";
import glob from "fast-glob";

(() => {
    const defaultConfig = {
        dist: "dist",
        copy: "public",
        bundle: [],
    };

    const prepare = (config) => {
        const dir = config.dist;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        };
    }

    const bundle = (config) => {
        for (const code of config.bundle) {
            try {
                const globs = code.input;
                const dst = path.join(config.dist, code.output);

                const files = glob.sync(globs)
                    .sort((a, b) => (a.split("/").length - b.split("/").length) || a.localeCompare(b));
                const text =
                    (config.strict ? `"use strict";\n\n` : "") +
                    files.map(file => fs.readFileSync(file)).join("\n\n");

                fs.writeFileSync(dst, text, { encoding: "utf8" });
            }
            catch (err) {
                console.error("Bundle Error: ", err.message);
            }
        }
    };

    const copy = (config) => {
        const src = path.join(config.copy);
        const dst = path.join(config.dist);

        if (!fs.existsSync(src)) return;

        fs.cpSync(src, dst, { recursive: true });
    }

    const config = { ...defaultConfig };
    Object.assign(config, JSON.parse(fs.readFileSync("config.json")));

    prepare(config);
    bundle(config);
    copy(config);
})();