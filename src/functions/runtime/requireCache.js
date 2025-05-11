const { NativeFunction, ArgType } = require("@tryforge/forgescript");
const { resolve } = require("path");
const { existsSync } = require("fs");

exports.default = new NativeFunction({
    name: "$requireCache",
    version: "1.0.0",
    description: "Удаляет или обновляет кэш модуля",
    output: ArgType.Boolean,
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
            name: "type",
            description: "Тип действия: delete для удаления, update для перезагрузки",
            type: ArgType.Enum,
            enum: {
                delete: "delete",
                update: "update"
            },
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [path, type]) {
        const full = resolve(process.cwd(), path);
        if (!existsSync(full)) return this.stop(false);
        delete require.cache[full];
        if (type === "update") require(full);
        return this.success(true);
    }
});