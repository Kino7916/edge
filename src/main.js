const { ForgeExtension } = require("@tryforge/forgescript");
const pkg = require("../package.json");

class QuorielEdge extends ForgeExtension {
    name = "QuorielEdge";
    description = pkg.description;
    version = pkg.version;

    init() {
        this.load(__dirname + "/functions");
    }
}

exports.QuorielEdge = QuorielEdge;
