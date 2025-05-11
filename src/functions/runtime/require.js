const { NativeFunction, ArgType } = require("@tryforge/forgescript");
const { resolve } = require("path");
const { existsSync } = require("fs");

exports.default = new NativeFunction({
    name: "$require",
    version: "1.0.0",
    description: "Динамически загружает модуль",
    output: ArgType.Unknown,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "path",
            description: "Путь к модулю",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "keys",
            description: "Ключи для доступа к вложенным значениям",
            type: ArgType.String,
            rest: true
        }
    ],
    async execute(ctx, [path, ...keys]) {
        const full = resolve(process.cwd(), path);
        if (!existsSync(full)) return this.success();
        let result = require(full);
        if (typeof result !== "object") return this.success(result);
        for (const key of keys.flat()) {
            if (!(result && key in result)) return this.success();
            result = result[key];
        }
        return this.success(typeof result === "object" ? JSON.stringify(result) : result);
    }
});