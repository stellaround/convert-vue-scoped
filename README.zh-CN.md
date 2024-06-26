<div align="center">
  <img alt="convert-vue-scoped logo" width="120" height="120" src="./logo.png">
  <h1>convert-vue-scoped</h1>
  <span><a href="./README.md">English</a> | 中文</span>
</div>

# 简介
针对Taro中vue-scoped不支持小程序的问题，将vue中含有scoped的style转换为动态添加class来实现小程序的支持。(已测试h5和微信小程序)

## 快速开始

安装依赖

```sh
pnpm i @stellaround/convert-vue-scoped -D
```

Taro config文件配置

```ts
  mini: {
    webpackChain(chain) {
        chain.module
            .rule('vueFiles')
            .test(/\.vue$/)
            .include.add(path.resolve(__dirname, '../src/views')) // 要修改的vue文件范围
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