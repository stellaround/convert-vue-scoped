<div align="center">
  <img alt="auto-cli logo" width="120" height="120" src="./logo.png">
  <h1>convert-vue-scoped</h1>
  <span>English | <a href="./README.zh-CN.md">中文</a></span>
</div>

# Introduction
To address the issue that `vue-scoped` does not support mini-programs in Taro, `convert-vue-scoped` transforms styles with scoped in Vue into dynamically added classes to achieve support for mini-programs.(Tested h5 and WeChat Mini Programs)

## Quick Start

Install dependencies

```sh
pnpm i @stellaround/convert-vue-scoped -D
```

Configuration in Taro config file
```ts
  mini: {
    webpackChain(chain) {
        chain.module
            .rule('vueFiles')
            .test(/\.vue$/)
            .include.add(path.resolve(__dirname, '../src/views')) // the range of vue files to be modified
            .end()
            .use('@stellaround/convert-vue-scoped')
            .loader('@stellaround/convert-vue-scoped');
        //...
    }
    //...
}
```

## License

[Apache](./LICENSE)

Copyright (c) 2024-present [spectature](https://github.com/Spectature)