# 群通知消息

## 更新内容
| 修改日期 | 会话类型 | 更新类型 | object name | Action | 描述 | 备注|
| --- | --- | ---- | --- | --- | --- | --- |
| 2017-11-14 |  消息 | 新增 | RCE:GrpNtfy | ACTION_MUTE_OPEN(21, "OpenMute") | 群组全员禁言 | 含json案例 |
| 2017-11-14  |  消息 | 新增 | RCE:GrpNtfy | ACTION_MUTE_CLOSE(22, "CloseMute") | 群组全员解除禁言 | 含json案例 |
| 2017-11-14 |  消息 | 新增 | RCE:GrpNtfy | ACTION_MUTE_ADD(23, "Add") | 群成员禁言 | 含json案例 |
| 2017-11-14  |  消息 | 新增 | RCE:GrpNtfy | ACTION_MUTE_REMOVE(24, "Remove") | 群成员解除禁言 | 含json案例 |
| 2017-11-14  |  消息 | 修改 | RCE:GrpNtfy | ACTION_UPDATE_GROUP_MANAGER(10, "UpdGroupManager") | 更新群主 | 含json案例 | |

* 群组命令消息（不存储）：更新群头像时，但是更新的信息不需要在群组中显示
* 群成员变化消息（RCE:GrpMemChanged）：退出群组、踢出群组、邀请进入群组、加入群组时
* 群信息更新消息：更新群名称、创建群组、解散群组、更新群公告
* 群成员变化静默消息（RCE:SilentGrpMemChanged）：退出群组、踢出群组、邀请进入群组、加入群组时
* 群信息更新静默消息：更新群名称、创建群组、解散群组、更新群公告
* 更新群主（RCE:GrpNtfy）：更新群主
* 群禁言消息（RCE:GrpNtfy）：群组禁言、群组解除禁言、群成员禁言、群成员解除禁言

## 会话

| 会话类型 | operatorUser | targetGroup | action | targetUser |
| --- | ---- | --- | --- | --- |
|  Group | 操作者id+name | 群组id+name | 动作 | 被操作者id+name |

## 消息

| object name | 是否存储 | 是否计未读数 | 是否是状态消息 | pushContent | pushData
| --- | ---- | --- | --- | --- | ---- |
| RCE:GrpMemChanged | 是 | 否 | 否 | 否 | 无 | 无 |
| RCE:GrpNtfy | 是 | 否 | 否 | 否 | 无 | 无 |
| RCE:GrpCmd | 否 | 否 | 否 | 否 | 无 | 无 |
| RCE:SilentGrpMemChanged | 否 | 否 | 否 | 否 | 无 | 无 |
| RCE:SilentGrpNtfy | 否 | 否 | 否 | 否 | 无 | 无 |

## Json

| 消息 |action(int 类型) | 功能 | targetUsers |
| ---- | --- | --- | --- |
| RCE:GrpMemChanged/RCE:SilentGrpMemChanged | ACTION_INVITE(1, "Invite") | 邀请成员加入群组| 被邀请者 |
| | ACTION_JOIN(2, "Join") | 加入群组| 加入者 |
| | ACTION_KICK(3, "Kick") | 剔除成员| 被提出者 |
| | ACTION_QUIT(4, "Quit") | 成员退出群组| 退出者 |

| 消息 | action(int 类型) | 功能 |
| ---- | --- | --- |
| RCE:GrpCmd | ACTION_UPDATE_PORTRAIT(1, "UpdPortrait") | 更新群组头像 |

| 消息 | action(int 类型) | 功能 | |
| ---- | --- | --- |
| RCE:GrpNtfy/RCE:SilentGrpNtfy | ACTION_CREATE(1, "Create") | 创建群组 | 群组名称 |
| | ACTION_DISMISS(2, "Dismiss") | 解散群组 | null |
| | ACTION_NOTICE(3, "Notice") | 群组公告 | 公告内容 |
| | ACTION_RENAME(4, "Rename") | 更改群组名称 | 群名称 |
| | ACTION_UPDATE_GROUP_MANAGER(10, "UpdGroupManager") | 更新群主 | 新群主 |
| | ACTION_MUTE_OPEN(20, "OpenMute") | 全员禁言操作开启| null |
| | ACTION_MUTE_CLOSE(21, "CloseMute") |全员禁言操作关闭 | null |
| | ACTION_MUTE_ADD(22, "Add") | 群组禁言黑名单添加操作 | 禁言黑名单 |
| | ACTION_MUTE_REMOVE(23, "Remove") | 群组禁言黑名单删除操作 | 禁言白名单 |

## Json 范例
* 退出群组

```json
{
  "targetUsers": [
    {
      "name": "魏钦校",
      "id": "aWJD7vhFCzpFFWyshuUtvY"
    }
  ],
  "action": 4,
  "targetGroup": {
    "name": "wo",
    "id": "UUUPZVNF6AHun3EfSbnUuA"
  },
  "operatorUser": {
    "name": "魏钦校",
    "id": "aWJD7vhFCzpFFWyshuUtvY"
  }
}
```

* 踢出群组

```json
{
  "targetUsers": [
    {
      "name": "蒋应吉",
      "id": "RnCi2gfXTkNHNCVfVCmZ63"
    },
    {
      "name": "齐新兵",
      "id": "frUEEANqDVFrWAfo56g3UX"
    }
  ],
  "action": 3,
  "targetGroup": {
    "name": "55555",
    "id": "VTxPLaFfUT7HfviWh8NYMN"
  },
  "operatorUser": {
    "name": "魏钦校",
    "id": "aWJD7vhFCzpFFWyshuUtvY"
  }
}
```

* 群成员禁言

```json
{
    "targetUsers": [
        {
            "name": "ds-101",
            "id": "B7yoWrDFmbmDGEryrvUZBA"
        },
        {
            "name": "ds-100",
            "id": "WmDW8daioYRohVpKYv5eUL"
        }
    ],
    "muteAction": 23,
    "targetGroup": {
        "name": "rongyunType0",
        "id": "wyydHEQXNL7iohgfBu3pqH"
    },
    "operatorUser": {
        "name": "ds-100",
        "id": "WmDW8daioYRohVpKYv5eUL"
    }
}
```

* 群成员解除禁言

```json
{
    "targetUsers": [
        {
            "name": "ds-101",
            "id": "B7yoWrDFmbmDGEryrvUZBA"
        },
        {
            "name": "ds-100",
            "id": "WmDW8daioYRohVpKYv5eUL"
        }
    ],
    "muteAction": 24,
    "targetGroup": {
        "name": "rongyunType0",
        "id": "wyydHEQXNL7iohgfBu3pqH"
    },
    "operatorUser": {
        "name": "ds-100",
        "id": "WmDW8daioYRohVpKYv5eUL"
    }
}
```

* 群组全员禁言

```json
{
    "targetUsers": [],
    "muteAction": 21,
    "targetGroup": {
        "name": "rongyunType0",
        "id": "wyydHEQXNL7iohgfBu3pqH"
    },
    "operatorUser": {
        "name": "ds-100",
        "id": "WmDW8daioYRohVpKYv5eUL"
    }
}
```

* 群组全员解除禁言

```json
{
    "targetUsers": [],
    "muteAction": 22,
    "targetGroup": {
        "name": "rongyunType0",
        "id": "wyydHEQXNL7iohgfBu3pqH"
    },
    "operatorUser": {
        "name": "ds-100",
        "id": "WmDW8daioYRohVpKYv5eUL"
    }
}
```

* 更新群主

```json
{
    "action": 10,
    "newManager": {
        "name": "ds-101",
        "id": "B7yoWrDFmbmDGEryrvUZBA"
    },
    "targetGroup": {
        "name": "rongyunType0",
        "id": "wyydHEQXNL7iohgfBu3pqH"
    },
    "operatorUser": {
        "name": "ds-100",
        "id": "WmDW8daioYRohVpKYv5eUL"
    }
}
```



## 各平台实现类
| server | iOS | Android | Web |
| --- | ---- | --- | --- |
| GroupMemChangedNotifyMessage | |GroupMemberChangedNotifyMessage | |
| GroupNotifyMessage | |GroupNotifyMessage | |
| GroupCmdMessage | |GroupCommandMessage | |
