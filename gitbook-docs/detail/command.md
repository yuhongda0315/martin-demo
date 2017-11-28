#### 命令

gitbook-cli 是 GitBook 的命令行工具，gitbook-cli 和 gitbook 是两个软件, gitbook-cli 

会将下载的 gitbook 的不同版本放到 `用户/.gitbook` 目录下

##### 查看所有命令

```
gitbook help

=> 

Usage: gitbook [options] [command]


  Commands:

    ls                        List versions installed locally
    current                   Display currently activated version
    ls-remote                 List remote versions available for install
    fetch [version]           Download and install a <version>
    alias [folder] [version]  Set an alias named <version> pointing to <folder>
    uninstall [version]       Uninstall a version
    update [tag]              Update to the latest version of GitBook
    help                      List commands for GitBook
    *                         run a command with a specific gitbook version

  Options:

    -h, --help               output usage information
    -v, --gitbook [version]  specify GitBook version to use
    -d, --debug              enable verbose error
    -V, --version            Display running versions of gitbook and gitbook-cli

```

##### 初始化

```
gitbook init
```

1、创建 book 目录

2、进入 book 目录执行 gitbook init 后会自动生成 `SUMMARY.md` 和 `README.md`

##### 编译

```
gitbook build
```

将 book 目录中所有 `Markdown` 编译成 HTML 页面

##### 编译并启动服务

```
gitbook serve
```

将 book 目录中所有 `Markdown` 编译成 HTML 页面并启动一个端口为 `4000` 的本地服务

支持实时预览 `http://localhost:4000`

修改端口:

```
gitbook serve --port 端口
```

##### 安装插件

```
gitbook install 
```

在 `book.json` 中配置插件后执行此命令进行安装

##### 列出本地所有版本

```
gitbook ls
```

##### 列出远程所有版本

```
gitbook ls-remote
```

##### 安装远程版本

```
gitbook fetch
```

`fetch` 包含下载和安装

##### 更新到最新版本

```
gitbook update
```