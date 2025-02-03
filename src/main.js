const { ForgeExtension } = require("@tryforge/forgescript");

class QuorielEdge extends ForgeExtension {
    name = "QuorielEdge";
    description = require("../package.json").description;
    version = require("../package.json").version;

    init() {
        this.load(__dirname + "/functions");
    }
}

exports.QuorielEdge = QuorielEdge;
