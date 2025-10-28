import { ForgeExtension, type ForgeClient } from "@tryforge/forgescript";
import { name, description, version } from '../package.json'

export class QuorielExtension extends ForgeExtension {
    public readonly name = name
    public readonly description = description
    public readonly version = version

    public init(client: ForgeClient) {

    }
}