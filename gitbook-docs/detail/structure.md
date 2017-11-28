#### 目录结构

`SUMMARY.md` 和 `README.md` 是 GitBook 项目中必须存在的两个文件，具体如下:

```
book/
├── README.md
├── SUMMARY.md
├── chapter-1/
├   ├── README.md
├   └── something.md
├── structure.md
└── ....
```

##### SUMMARY.md

`SUMMARY.md` 是左侧导航栏的目录结构, 用来生成目录树, 例如:

```
# Summary

* [简介](README.md)

* [目录结构](structure.md)

```

##### README.md

`README.md` 是项目的入口，默认打开页面，可对当前文档项目做简要说明、注意事项等等

##### 其他

`structure.md` 是自定义文档说明, 使用中可按业务逻辑、模型，不同模块划分不同目录，例如 `chapter-1`	，最终在 `SUMMARY.md` 暴露即可