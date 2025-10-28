import { ForgeExtension, FunctionManager, type ForgeClient } from "@tryforge/forgescript";
import { name, description, version } from '../package.json'
import { resolve } from "path";

export class QuorielExtension extends ForgeExtension {
    public readonly name = name
    public readonly description = description
    public readonly version = version

    public init(client: ForgeClient) {
        FunctionManager.load(this.name, './functions')
    }
}