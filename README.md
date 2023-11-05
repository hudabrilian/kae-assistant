# Kae Assistant Discord Bot

The Kae Assistant Discord bot is a versatile and multifunctional bot usign the [sapphire framework][sapphire] written in Typescript designed to enhance your Discord server with a wide range of features and capabilities.

## How to use it?

### Prerequisite

First, install the npm packages

```sh
yarn install
```

### Development

This example can be run with `tsc-watch` to watch the files and automatically restart your bot.

```sh
yarn run watch:start
```

### Production

You can also run the bot with `yarn run dev`, this will first build your code and then run `node ./dist/index.js`. But this is not the recommended way to run a bot in production.

## License

Dedicated to the public domain via the [Unlicense], courtesy of the Sapphire Community and its contributors.

[sapphire]: https://github.com/sapphiredev/framework
[unlicense]: https://github.com/sapphiredev/examples/blob/main/LICENSE.md
