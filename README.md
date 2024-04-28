<div align="center">
  <img alt="auto-cli logo" width="120" height="120" src="./logo.png">
  <h1>auto-cli</h1>
  <span>English | <a href="./README.zh-CN.md">中文</a></span>
</div>

# Introduction
To address the issue that `vue-scoped` does not support mini-programs in Taro, `convert-vue-scoped` transforms styles with scoped in Vue into dynamically added classes to achieve support for mini-programs.

## Quick Start

Install dependencies

```sh
pnpm i @stellaround/auto-cli -D
```

Configuration in Taro config file
```ts
  mini: {
    webpackChain(chain) {
        chain.module
            .rule('vueFiles')
            .test(/\.vue$/) // 匹配.vue文件
            .use('convert-vue-scoped')
            .loader('convert-vue-scoped');
        //...
    }
    //...
}
```

## License

[Apache](./LICENSE)

Copyright (c) 2024-present [spectature](https://github.com/Spectature)