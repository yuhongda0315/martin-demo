### 引入方式 WebSDK

> 在线引用

```html
<script src="http[s]://cdn.ronghub.com/RongIMLib-2.3.2[.min].js"></script>
```

> 本地引用

将以下资源下载至本地:

`Web SDK` : [RongIMLib-2.3.2.js](https://cdn.ronghub.com/RongIMLib-2.3.2.js)、 [RongIMLib-2.3.2.min.js](https://cdn.ronghub.com/RongIMLib-2.3.2.min.js)
`SDK 内部依赖` : [protobuf-2.3.1.min.js](https://cdn.ronghub.com/protobuf-2.3.1.min.js)

```js
<script src="your-path/protobuf-2.3.1[.min].js"></script>
<script src="your-path/RongIMLib-2.3.2[.min].js"></script>
```


### 引入方式 Emoji

128 => 129

```js
// 表情信息可参考 http://unicode.org/emoji/charts/full-emoji-list.html
var config = {
  size: 24, // 大小, 默认 24, 建议18 - 58
  url: "//cdn.ronghub.com/emojis-hd.png", // Emoji 图片
  lang: "zh", // Emoji 对应名称语言, 默认 zh
  // 扩展表情
  extension: {
    dataSource: {
      u1F914: {
        en: "thinking face", // 英文名称
        zh: "思考", // 中文名称
        tag: "🤔", // 原生 Emoji
        position: "0 0" // 所在背景图位置坐标
      }
    },
    // 新增 Emoji 图 url
    url: "//cdn.ronghub.com/thinking-face.png"
  }
};
RongIMLib.RongIMEmoji.init(config);
```

### 引入方式 Voice


>在线引入

```html
<!--[if !IE]><!--> 
<script src="http[s]://cdn.ronghub.com/Libamr-2.2.5.min.js"></script> 
<!--<![endif]-->
<script src="http[s]://cdn.ronghub.com/RongIMVoice-2.2.6[.min].js"></script> 
```