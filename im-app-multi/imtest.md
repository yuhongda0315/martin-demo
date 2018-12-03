# 融云 消息审核测试

## 工具
1. 地址  [http://info.rongcloud.net/im-app-multi/multi.html](http://info.rongcloud.net/im-app-multi/multi.html)


## 获取配置方法

1. 注册融云开发者、创建应用 [https://developer.rongcloud.cn](https://developer.rongcloud.cn)、进入 “API 调用”

2. 创建 token，1 个 token 是 1 个用户

3. 创建群、并将收发用户加入群（不加入无法收发群消息）

4. 聊天室 ID，直接在页面输入自定义 ID 即可，无需后台创建

## 客服相关

支持客户时直接联系客户申请相关信息

## 自定义消息使用说明

输入框内输入 JSON 可发送自定消息

其中 `objectName`、`content` 是固定属性，`content` 内部按需扩展

程序内部自动过滤 value 是 function、undefined 的属性

```json
{
  // 消息名称
  "objectName": "App:Command",
  // 消息属性
  "content":{
    "cmd": "kick member",
    "...": "..."
  }
}
```

涉及消息显示，用背景颜色区分 `自定义消息`、`文本消息`，如下所示:

文本消息:

<img src="http://fsprodrcx.cn.ronghub.com/UjvhdlI54EWi6OF2UjvhdlI_SG1SO7MNP16SBTNchA/base64.png" width=130 height=50 style="border: 3px solid #FF6700;">

自定义消息:

<img src="http://fsprodrcx.cn.ronghub.com/-FTsLPhW7R8Ih-ws-FTsLPhQx2j4VJH7lTGfX5kziQ/base64.png" width=200 height=100 style="border: 3px solid #FF6700;">

JSON 编写工具：https://www.json.cn/