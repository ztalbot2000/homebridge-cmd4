import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("eslint:recommended"),

    languageOptions: {
        globals: {
            ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, "off"])),
            ...Object.fromEntries(Object.entries(globals.commonjs).map(([key]) => [key, "off"])),
            ...globals.node,
            ...globals.mocha,
            assert: "writeable",
            expect: "writeable",
            sinon: "writeable",
            ACC_EOL: "readonly",
            DEVICE_EOL: "readonly",
            FORMAT_EOL: "readonly",
            UNITS_EOL: "readonly",
            PERMS_EOL: "readonly",
            DEVICE_DATA: "readonly",
            ACC_DATA: "readonly",
            CHAR_DATA: "readonly",
            CMD4_CHAR_TYPE_ENUMS: "readonly",
            CMD4_ACC_TYPE_ENUM: "readonly",
            CMD4_DEVICE_TYPE_ENUM: "readonly",
            cleanStatesDir: "readonly",
            accEnumIndexToC: "readonly",
            devEnumIndexToC: "readonly",
            fs: "writeable",
            HomebridgeAPI: "writeable",
            Logger: "writeable",
            platformAccessory_1: "writeable",
        },

        ecmaVersion: 12,
        sourceType: "commonjs",
    },

    rules: {
        "no-fallthrough": ["error", {
            commentPattern: "break[\\s\\w]*omitted",
        }],

        "no-whitespace-before-property": ["error"],
        "arrow-spacing": ["error"],
    },
}, {
    files: ["homebridge-ui/public/app.js"],
    languageOptions: {
        sourceType: "script",
        globals: {
            ...globals.browser,
            homebridge: "readonly",
            cmd4AccessoryTypes: "readonly",
        },
    },
}]);