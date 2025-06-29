const { Logger, NativeFunction, ArgType, Compiler, Interpreter } = require("@tryforge/forgescript");
const { resolve } = require("path");
const { existsSync } = require("fs");

exports.default = new NativeFunction({
    name: "$execution",
    version: "1.0.0",
    description: "Executes code exported as a string from the specified file",
    output: ArgType.Unknown,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "path",
            description: "File path",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "send",
            description: "Sends the result as a new message",
            type: ArgType.Boolean,
            rest: false
        }
    ],
    async execute(ctx, [path, send]) {
        try {
            const full = resolve(process.cwd(), path);
            if (!existsSync(full)) return this.stop();
            send ??= true;
            let code = require(full);
            if (typeof code === "object") {
                code = code.code;
            }
            const result = await Interpreter.run({
                ...ctx.runtime,
                data: Compiler.compile(code),
                doNotSend: !send,
            });
            return result === null ? this.stop() : this.success(send ? undefined : result);
        } catch (error) {
            Logger.error(error);
            return this.error(error);
        }
    }
});
