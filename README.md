# QuorielEdge
An extended set of functions for ForgeScript, designed to optimize workflows, simplify the execution of various tasks, and support script integration and processing.

## Installation
```
npm i github:quoriel/edge
```

## Connection
```js
const { ForgeClient } = require("@tryforge/forgescript");
const { QuorielEdge } = require("@quoriel/edge");

const client = new ForgeClient({
    extensions: [
        new QuorielEdge()
    ]
});

client.login("...");
```