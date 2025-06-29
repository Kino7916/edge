const { NativeFunction, ArgType } = require("@tryforge/forgescript");
const { resolve } = require("path");
const { existsSync } = require("fs");

const ActionType = {
    delete: "delete",
    update: "update"
}

exports.default = new NativeFunction({
    name: "$requireCache",
    version: "1.0.0",
    description: "Deletes a module from the cache or reloads it (including dependencies)",
    output: ArgType.Boolean,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "path",
            description: "Module path",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "type",
            description: "Type of action",
            type: ArgType.Enum,
            enum: ActionType,
            required: true,
            rest: false
        },
        {
            name: "recursive",
            description: "Whether to clear cache recursively",
            type: ArgType.Boolean,
            rest: false
        }
    ],
    async execute(ctx, [path, type, recursive]) {
        const full = resolve(process.cwd(), path);
        if (!existsSync(full)) {
            return this.success(false);
        }
        if (recursive) {
            clearModuleCacheRecursively(full);
        } else {
            delete require.cache[full];
        }
        if (type === "update") {
            try {
                require(full);
            } catch (e) {
                return this.success(false);
            }
        }
        return this.success(true);
    }
});

function clearModuleCacheRecursively(path) {
    const mod = require.cache[path];
    if (!mod) return;
    mod.children.forEach(child => {
        clearModuleCacheRecursively(child.id);
    });
    delete require.cache[path];
}