# 使用rollup打包Screeps代码

**摘录自：[Screeps 使用 rollup 打包你的代码](https://www.jianshu.com/p/13e2cbcb60ab)**

rollup是一个构建工具，通过进行一些设定，可以将多个源代码文件打包成一个文件（成果文件）。

优点：

1. 不需要再担心代码丢失，源代码并不存放在游戏目录；
2. 支持多文件夹，module文件可以放置在单独文件夹内；
3. 引入npm生态，npm作为nodejs的第三方库管理器，可以安装大量第三方包。

## 项目配置

首先，新建一个文件夹```myScreepBot```，用来存放项目代码。在该文件夹中打开终端，输入```npm init -y```进行项目初始化，再输入```npm install -D @types/screeps @types/lodash@3.10.1```安装Screeps代码自动补全。

之后，在该文件夹下新建一个```src```目录，在这个目录中存放Screeps游戏代码。在```src```目录下新建```main.js```，作为Screeps的游戏入口函数。
``` javascript
// 游戏入口函数
export const loop = function () {
  console.log('hello world')
}
```
这里的入口写法与官方教程中的写法不同，这是由于现在使用的```import / export```语法是游戏默认的```module.exports```语法的升级版本。之后需要通过rollup将这个语法编译成游戏可以理解的版本。

## rollup安装

在终端执行如下命令即可安装rollup：
```
npm install -D rollup
```

然后在```myScreepBot```目录下的```package.json```中的```scripts```里添加一个```build```字段：
``` javascript
"scripts": {
      "build": "rollup -cw",
      "test": "echo \"Error: no test specified\" && exit 1"
},
```

## 代码构建

现在rollup已经安装完成了，还需要告诉它要做什么工作。在```myScreepBot```目录下新建```rollup.config.js```并填入如下内容：
``` javascript
// 告诉 rollup 要打包什么
export default {
    // 源代码的入口是哪个文件
    input: 'src/main.js',
    // 构建产物配置
    output: {
        // 输出到哪个文件
        file: 'dist/main.js',
        format: 'cjs',
        sourcemap: true
    }
};
```

rollup 会默认在根目录下寻找这个名字并作为自己的配置文件。

之后，在终端中执行```npm run build```即可开始构建。并且，如果控制台没有关闭，每次代码保存时，rollup都会自动运行构建，在```dist```文件夹生成最新的代码。

现在的项目已经支持创建文件夹了，在```src```目录下创建```modules```文件夹。

在```src/modules```文件夹下创建```utils.js```文件，并输入如下内容：
``` javascript
/**
 * 打印 hello world
 */
export const sayHello = function () {
    console.log('hello world')
}
```
修改```src```文件夹下的```main.js```文件，输入如下内容：
``` javascript
// 引入外部依赖
import { sayHello } from './modules/utils'

export const loop = function () {
    sayHello()
}
```

*在函数的头部注释使用多行注释，并且支持markdown语法，则当鼠标悬停在函数的调用代码上时，写在函数上的注释会被显示出来。也可以使用 jsdoc 风格的注释让 vscode 更智能的提示函数。*

rollup **通过分析依赖代码，将复杂嵌套、相互调用的项目打包成单独一个文件，并且还会剔除掉没有使用的代码。**

现在成果代码还在本地电脑上，接下来需要把代码传递给 screeps 服务器。

## 上传代码到Screeps

rollup支持使用插件进行扩展，通过使用插件，有两种办法上传代码到游戏服务器：

- 直接上传到服务器：将打包好的代码直接上传到 screeps 服务器，只要启用了 HTTP 访问接口的游戏服务器都可以用。使用插件```rollup-plugin-screeps```。
- 复制到游戏客户端目录：将打包好的代码自动复制到 screeps 的代码存放目录中，借助 screeps 客户端将代码进行上传，只有游戏客户端启动时这种方式才有效果。一般用来访问本地的小型测试服务器，使用插件```rollup-plugin-copy```。

首先，在终端输入如下命令，安装需要的插件：
``` 
npm install rollup-plugin-clear rollup-plugin-screeps rollup-plugin-copy -D
```
在根目录```myScreepBot```下新建```.secret.json```文件，并填入如下内容：
``` javascript
{
    "main": {
        "token": "你的 screeps token 填在这里",
        "protocol": "https",
        "hostname": "screeps.com",
        "port": 443,
        "path": "/",
        "branch": "default"
    },
    "local": {
        "copyPath": "你要上传到的游戏路径，例如 C:\\Users\\DELL\\AppData\\Local\\Screeps\\scripts\\screeps.com\\default"
    }
}
```
文件中的```main.token```字段可以通过[token获取网址](https://screeps.com/a/#!/account/auth-tokens)获取，```local.copyPath```字段可以通过游戏客户端控制台左下角的```Open local folder```按钮找到。如果不想用某种方式可以直接不填。

**单独创建这个文件是因为其中包含了隐私信息，当把代码上传到github时需要把这个文件加入```.gitignore```。**

之后需要修改```myScreepBot```目录下的```rollup.config.js```文件，修改后的文件内容如下所示，其中还使用了```rollup-plugin-clear```插件在每次编译前先清空目标代码文件夹。
``` javascript
import clear from 'rollup-plugin-clear'
import screeps from 'rollup-plugin-screeps'
import copy from 'rollup-plugin-copy'

let config
// 根据指定的目标获取对应的配置项
if (!process.env.DEST) console.log("未指定目标, 代码将被编译但不会上传")
else if (!(config = require("./.secret.json")[process.env.DEST])) {
    throw new Error("无效目标，请检查 secret.json 中是否包含对应配置")
}

// 根据指定的配置决定是上传还是复制到文件夹
const pluginDeploy = config && config.copyPath ?
    // 复制到指定路径
    copy({
        targets: [
            {
                src: 'dist/main.js',
                dest: config.copyPath
            },
            {
                src: 'dist/main.js.map',
                dest: config.copyPath,
                rename: name => name + '.map.js',
                transform: contents => `module.exports = ${contents.toString()};`
            }
        ],
        hook: 'writeBundle',
        verbose: true
    }) :
    // 更新 .map 到 .map.js 并上传
    screeps({ config, dryRun: !config })

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/main.js',
        format: 'cjs',
        sourcemap: true
    },
    plugins: [
        // 清除上次编译成果
        clear({ targets: ["dist"] }),
        // 执行上传或者复制
        pluginDeploy
    ]
};
```
之后，打开```myScreepBot```目录下的```package.json```文件，新增构建命令：
``` javascript
"scripts": {
  "push": "rollup -cw --environment DEST:main",
  "local": "rollup -cw --environment DEST:local",
  ...
},
```

之后，通过执行```npm run push```可以将生成的代码直接提交到游戏服务器（如果有其他rollup在运行，需要先通过Ctrl+C停止）。**执行该命令后，线上代码将会被直接覆盖，需要在执行前妥善保存。**插件是静默提交的，当看到控制台开始重新 waiting for changes 时，代码已经提交完成了。**如果代码无法上传成功，并在终端报错，说明网络不够稳定。**

打开Steam客户端后，在根文件夹```myScreepBot```执行```npm run local```也可以将代码提交到服务器（注意复制到的目标文件夹是否为当前代码分支对应的文件夹）。

## 使用SourceMap校正异常信息

最后所有的代码都被打包到了一个文件里，如果有代码报错的话，它提示的报错位置会和源代码的位置不一致。这虽然不会影响代码的正常运行，但是在查找 bug 时会更加麻烦。

在```dist```文件夹下的编译产物除了```main.js```还有一个```main.js.map```。它的全称叫做```SourceMap```，是一张对照表，能够描述代码编译前后的对应关系，通过借助一些小工具的帮助，就可以让报错信息直接显示对应的源代码的位置！

这里使用的小工具名字叫做```source-map```，是一个npm的第三方包，执行如下命令完成该工具的安装：
```
npm install source-map@0.6.1
```
然后新建文件```src/modules/errorMapper.js```，并填入如下内容：
``` javascript
/**
 * 校正异常的堆栈信息
 * 
 * 由于 rollup 会打包所有代码到一个文件，所以异常的调用栈定位和源码的位置是不同的
 * 本模块就是用来将异常的调用栈映射至源代码位置
 * 
 * @see https://github.com/screepers/screeps-typescript-starter/blob/master/src/utils/ErrorMapper.ts
 */

import { SourceMapConsumer } from 'source-map'

// 缓存 SourceMap
let consumer = null

// 第一次报错时创建 sourceMap
const getConsumer = function () {
    if (consumer == null) consumer = new SourceMapConsumer(require("main.js.map"))
    return consumer
}

// 缓存映射关系以提高性能
const cache = {}

/**
 * 使用源映射生成堆栈跟踪，并生成原始标志位
 * 警告 - global 重置之后的首次调用会产生很高的 cpu 消耗 (> 30 CPU)
 * 之后的每次调用会产生较低的 cpu 消耗 (~ 0.1 CPU / 次)
 *
 * @param {Error | string} error 错误或原始追踪栈
 * @returns {string} 映射之后的源代码追踪栈
 */
const sourceMappedStackTrace = function (error) {
    const stack = error instanceof Error ? error.stack : error
    // 有缓存直接用
    if (cache.hasOwnProperty(stack)) return cache[stack]

    const re = /^\s+at\s+(.+?\s+)?\(?([0-z._\-\\\/]+):(\d+):(\d+)\)?$/gm
    let match
    let outStack = error.toString()
    console.log("ErrorMapper -> sourceMappedStackTrace -> outStack", outStack)

    while ((match = re.exec(stack))) {
        // 解析完成
        if (match[2] !== "main") break
        
        // 获取追踪定位
        const pos = getConsumer().originalPositionFor({
            column: parseInt(match[4], 10),
            line: parseInt(match[3], 10)
        })

        // 无法定位
        if (!pos.line) break
        
        // 解析追踪栈
        if (pos.name) outStack += `\n    at ${pos.name} (${pos.source}:${pos.line}:${pos.column})`
        else {
            // 源文件没找到对应文件名，采用原始追踪名
            if (match[1]) outStack += `\n    at ${match[1]} (${pos.source}:${pos.line}:${pos.column})`
            // 源文件没找到对应文件名并且原始追踪栈里也没有，直接省略
            else outStack += `\n    at ${pos.source}:${pos.line}:${pos.column}`
        }
    }

    cache[stack] = outStack
    return outStack
}

/**
 * 错误追踪包装器
 * 用于把报错信息通过 source-map 解析成源代码的错误位置
 * 和原本 wrapLoop 的区别是，wrapLoop 会返回一个新函数，而这个会直接执行
 * 
 * @param next 玩家代码
 */
export const errorMapper = function (next) {
    return () => {
        try {
            // 执行玩家代码
            next()
        }
        catch (e) {
            if (e instanceof Error) {
                // 渲染报错调用栈，沙盒模式用不了这个
                const errorMessage = Game.rooms.sim ?
                    `沙盒模式无法使用 source-map - 显示原始追踪栈<br>${_.escape(e.stack)}` :
                    `${_.escape(sourceMappedStackTrace(e))}`
                
                console.log(`<text style="color:#ef9a9a">${errorMessage}</text>`)
            }
            // 处理不了，直接抛出
            else throw e
        }
    }
}
```

这段代码的主要作用是读取同目录下的```main.js.map```文件，并用其校正异常追踪栈。

之后在```main.js```中引用该文件：
``` javascript
import { errorMapper } from './modules/errorMapper'
import { sayHello } from './modules/utils'

export const loop = errorMapper(() => {
    sayHello()
})
```

上面的代码使用```src/modules/errorMapper.js```中定义的错误捕获器包裹整个入口函数，这样其中的代码报错都会被捕获然后进行校正。

### 代码报错问题解决

编译后的代码使用了下面这行代码来引入```source-map```：
```
var sourceMap = require('source-map');
```

但是，模块```source-map```的代码并没有上传到Screeps，便会出现找不到模块的问题，因此需要把```source-map```也打包进最终代码。

首先，安装所需的 rollup 插件：
```
npm install -D @rollup/plugin-node-resolve @rollup/plugin-commonjs
```

然后在```myScreepBot```目录下的```rollup.config.js```文件中引入并调用这两个模块：
``` javascript
// 在代码头部引入包
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

// ...

// 在 plugins 中调用插件
export default {
    // ...
    plugins: [
        // 清除上次编译成果
        clear({ targets: ["dist"] }),
        // 打包依赖
        resolve(),
        // 模块化依赖
        commonjs(),
        // 执行上传或者复制
        pluginDeploy
    ]
};
```

现在，测试报错能够成功指向正确的位置。









