const { Logger, NativeFunction, ArgType, Compiler, Interpreter } = require("@tryforge/forgescript");
const { resolve } = require("path");
const { existsSync } = require("fs");

exports.default = new NativeFunction({
    name: "$execution",
    version: "1.0.0",
    description: "Выполняет код, экспортированный как строка из указанного файла",
    output: ArgType.Unknown,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "path",
            description: "Путь к файлу, который экспортирует код в виде строки",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "send",
            description: "Определяет, следует ли отправить результат как новое сообщение",
            type: ArgType.Boolean,
            rest: false
        }
    ],
    async execute(ctx, [path, send]) {
        try {
            const full = resolve(process.cwd(), `${path}.js`);
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
