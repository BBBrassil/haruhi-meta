"use strict";

import fs from "fs";
import path from "path";

(() => {
    const defaultConfig = {
        dist: "dist"
    };

    const config = { ...defaultConfig };
    Object.assign(config, JSON.parse(fs.readFileSync("package.json")));

    const dir = config.dist;

    if (!fs.existsSync(dir)) return;

    fs.promises.readdir(dir)
        .then((files) => {
            Promise.allSettled(files.map(async file => {
                return fs.promises.rm(path.join(dir, file), { recursive: true })
            }))
            .then((results) => {
                const errors = results
                    .filter(x => x.status !== "fulfilled")
                    .map(x => x.reason);
                if (errors.length > 0) {
                    throw Error(errors.join("\n"));
                }
            });
        });
})();