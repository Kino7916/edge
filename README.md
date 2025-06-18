# QuorielEdge
Расширенный набор функций для **ForgeScript**, обеспечивающий оптимизацию рабочих процессов и упрощение выполнения различных задач, интеграцию и обработку сценариев.

## Установка
```
npm i github:quoriel/edge
```

## Подключение
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
