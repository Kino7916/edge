const { NativeFunction, ArgType} = require("@tryforge/forgescript");
const colors = require("../../colors.json");

exports.default = new NativeFunction({
    name: "$listColors",
    version: "1.0.0",
    description: "List of all standard colors and their hex values",
    output: ArgType.Json,
    unwrap: true,
    async execute(ctx) {
        return this.successJSON(colors);
    }
});