# Screeps 使用 VSCode 进行开发并添加自动补全

## 使用Sublime或VSCode进行开发

1. 打开游戏，获取写代码的存放位置，点击```script```标签下方的```Open local folder```即可打开存放游戏的文件夹。

2. **不要在游戏没有启动时修改其中的代码！**在游戏启动之后，游戏客户端会自动检查本地代码和服务端代码是否相同，如果不同的话会将本地的代码覆盖！(覆盖前会有个提示，但是可能会忽略提示直接确定)。

## 添加自动补全

由于编辑器并没有内置对 screeps 的代码补全，所以我们需要手动进行添加。

| 概念	| 介绍 |
| :---: | :---: |
| nodejs | js的“本地”版本，有了nodejs之后，就可以脱离浏览器在本地执行js代码了。 |
| npm | nodejs 的第三方包管理器，世界上有很多人在开发属于 nodejs 的插件，可以用npm来下载使用它们，安装 nodejs 时会自带npm。 |
| @typs | @types是 TypeScript 的声明文件。编辑器可以使用这个文件来提供自动补全支持，可以通过 npm 来下载@types文件。 |

1. 先通过[nodejs 官方下载](https://nodejs.org/zh-cn/)来下载并安装nodejs。安装完成后可以给npm换国内源。
```
npm config set registry https://registry.npm.taobao.org
```
2. 打开游戏代码存放目录，执行如下命令，安装声明文件。
```
npm install @types/screeps @types/lodash@3.10.1
```

## 总结

通过安装```screeps```和```lodash```的```types```文件可以实现代码的自动补全。

但是由于还是直接修改游戏目录，所以代码依旧有被清空的风险，可以通过使用 rollup 打包代码来彻底解决这个问题。