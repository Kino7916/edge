const { NativeFunction, ArgType } = require("@tryforge/forgescript");
const { resolve } = require("path");
const { existsSync } = require("fs");

exports.default = new NativeFunction({
    name: "$require",
    version: "1.0.0",
    description: "Dynamically loads the module",
    output: ArgType.Unknown,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "path",
            description: "Module path",
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [path]) {
        const full = resolve(process.cwd(), path);
        if (!existsSync(full)) return this.success();
        try {
            const result = require(full);
            return this.success(typeof result === "object" ? JSON.stringify(result) : result);
        } catch {
            return this.success();
        }
    }
});