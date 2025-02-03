# QuorielEdge
Расширенный набор функций для **ForgeScript**, обеспечивающий оптимизацию рабочих процессов и упрощение выполнения различных задач, интеграцию и обработку сценариев.

## Установка
```
npm i https://github.com/quoriel/edge.git
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

## Функции
Перечень всех доступных функций можно найти в директории **src/functions**. Ознакомьтесь с каждой для лучшего понимания возможностей дополнения.
