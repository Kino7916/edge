const { NativeFunction, ArgType } = require("@tryforge/forgescript");
const { resolve } = require("path");
const { existsSync } = require('fs');

exports.default = new NativeFunction({
    name: "$require",
    version: "1.0.0",
    description: "Динамически загружает, обновляет или удаляет JavaScript-модуль",
    output: ArgType.Unknown,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "path",
            description: "Путь к JavaScript-модулю",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "type",
            description: "Тип действия: delete для удаления, update для перезагрузки или оставьте пустым для получения данных",
            type: ArgType.Enum,
            enum: {
                delete: "delete",
                update: "update"
            },
            rest: false
        }
    ],
    async execute(ctx, [path, type]) {
        const full = resolve(process.cwd(), path);
        if (!existsSync(full)) return this.stop();
        if (type) {
            delete require.cache[full];
            if (type === "update") require(full);
            return this.success();
        }
        const result = require(full);
        return this.success(typeof result === 'object' ? JSON.stringify(result) : result);
    }
});