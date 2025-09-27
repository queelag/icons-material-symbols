"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        coverage: {
            include: ['src/index.ts'],
            reporter: ['lcov']
        },
        include: ['tests/index.test.ts']
    }
});
