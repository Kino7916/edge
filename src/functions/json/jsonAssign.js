const { NativeFunction, ArgType } = require("@tryforge/forgescript");

exports.default = new NativeFunction({
    name: "$jsonAssign",
    version: "1.0.0",
    description: "Combines multiple JSON objects into a single JSON object",
    output: ArgType.Json,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "json",
            description: "JSON objects for merging",
            type: ArgType.Json,
            required: true,
            rest: true
        }
    ],
    async execute(ctx, [json]) {
        return this.successJSON(Object.assign(...json));
    }
});