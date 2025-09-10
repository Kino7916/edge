const { ForgeExtension } = require("@tryforge/forgescript");
const { description, version } = require("../package.json");

class QuorielEdge extends ForgeExtension {
    name = "QuorielEdge";
    description = description;
    version = version;

    init() {
        this.load(__dirname + "/functions");
    }
}

module.exports = { QuorielEdge };