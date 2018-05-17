<template>
  <!-- 聊天室  -->
  <div class="chat-container"
    id="msgContainer"
    :class="{'chat-msg-wrap-haswrap': showInput}">
    <div class="chat-msg-wrap" id='chatMsgWrap'>
        <div class="msg-container" id="scrollContainer" ref="scrollContainer">
          <p class="msg-container__item" v-for="(col) in msgList" :key="col.msgId" v-if="msgList.length">
            <span class="msg-container__item__wrap">
              <!-- <img class="msg-container__item__portrait" :src="col.img" alt=""> -->
              <span class="msg-container__item__nickname">{{col.nickname}}</span>
              <span class="msg-container__item__text">{{col.msg}}</span>
            </span>
           </p>
        </div>
    </div>
      <div class="msg-send-container" :class="{'msg-send-container-showinput': showInput}">
         <div id="inputwrap" class="msg-send-container__wrap" :class="{'msg-send-container__show': showInput, 'msg-send-container__hide': !showInput}">
          <input
            class="msg-send-container__wrap__input"
            id="sendmessage"
            type="text"
            @focus="focusEvent"
            @blur="blurEvent"
            v-model.trim="myMessage" @keyup.enter="sendMessage">
          <p class="msg-send-container__wrap__btn" @click="sendMessage">Send</p>
        </div>
        <label class="msg-send-container__icon" for="sendmessage" :class="{'msg-send-container__hide': showInput, 'msg-send-container__show': !showInput}">
          <span class="iconfont icon-pinglun"></span>
        </label>
      </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
// import * as type from '../store/type' // 【hack】 未用到 注释掉
import * as listenerType from '../assets/js/listener-type' // 【hack】
import im from '../assets/js/im' // 【hack】
import utils from '../assets/js/utils'
export default {
  name: 'ChatRoom',
  data () {
    return {
      // msgLen: 10, 【hack】 未用到 注释掉
      // chatRoomId: 'room10', 【hack】 未用到 注释掉
      // pageHeight: null, 【hack】 未用到 注释掉
      msgList: [], // 显示的消息列表
      myMessage: '', // 我发送的消息
      showInput: false, // 是否显示输入框
      windowInnerHeight: 0, // 窗口高度
      isSendMessageComplete: true // 消息是否发送完成
    }
  },
  computed: {
    ...mapGetters({
      // chatRoomState: 'chatRoomState', // 【hack】 未用到 注释掉
      // msgList: 'msgList', // 【hack】 未用到 注释掉
      userInfo: 'userInfo',
      status: 'status',
      questionStatus: 'question_status'
    })
  },
  mounted () {
    // this.$store.dispatch(type.CHAT_LIST_FETCH_ACTION) // 【hack】
    // this.$store.commit(type.CHAT_UPDATE, {msgList: []}) // 【hack】
    this.msgList = [] // 【hack】
    this.fetchChatList() // 【hack】
    this.windowInnerHeight = window.innerHeight
    this.$nextTick(() => {
      const body = document.getElementsByTagName('body')[0]
      const bodyHeight = body.clientHeight
      body.style.height = bodyHeight + 'px'
      // this.setMsgOuterHeight()
      // 横屏切换为竖屏是 隐藏输入框 【hack】 什么鬼 maybe 用不上呢！！！
      window.addEventListener('resize', () => {
        if (this.windowInnerHeight < window.innerHeight) {
          this.showInput = false
        }
        this.windowInnerHeight = window.innerHeight
      })
    })
  },
  beforeDestroy () {
    clearInterval(this.messageTimer)
  },
  methods: {
    // 1. 获取聊天列表 【hack】
    fetchChatList () {
      im.addListener(listenerType.MESSAGE_NORMAL, this.messageHandler)
    },
    // 消息处理器
    messageHandler (message) {
      const obj = {
        img: message.content.user.avatar,
        nickname: message.content.user.name,
        msg: message.content.content,
        msgId: message.messageId
      }
      let msgList = this.msgList || []
      msgList.push(obj)
      const len = msgList.length
      if (len >= 50) {
        msgList.splice(0, 36)
      }
      this.msgList = msgList
      this.$nextTick(() => {
        const scrollContainer = document.getElementById('scrollContainer')
        if (scrollContainer) {
          scrollContainer.scrollTop = 100000
        }
      })
    },
    // 2. 发送消息 【hack】
    sendMessage () {
      if (this.myMessage && this.isSendMessageComplete) {
        this.isSendMessageComplete = false
        document.getElementById('sendmessage').blur()
        this.showInput = false
        const msg = this.myMessage
        const nickname = this.userInfo.userName
        const img = this.userInfo.avatar
        this.myMessage = ''
        im.sendMessage(msg, img, nickname)
        this.messageHandler({
          content: {
            user: {
              avatar: img,
              name: nickname
            },
            content: msg
          },
          messageId: `${Date.now()}${parseInt(Math.random() * 10000)}`
        })
        this.isSendMessageComplete = true
        let fromSource = ''
        if (+this.status === 3 && +this.questionStatus !== 8) { // 答题页面
          fromSource = 'game_page'
        }
        if (+this.status === 2) { // 倒计时页
          fromSource = 'countdown_page'
        }
        utils.statistic('speaking', 3, {}, fromSource)
      }
    },
    // 2. 发送消息 删掉 去store 里面发消息【hack】
    // sendMessage1 () {
    //   if (this.myMessage) {
    //     this.showInput = false
    //     this.$store.dispatch(type.CHAT_SEND_MSG_ACTION, {
    //       msgObj: {
    //         img: this.userInfo.avatar,
    //         msg: this.myMessage,
    //         nickname: this.userInfo.userName
    //       }
    //     })
    //     this.myMessage = ''
    //     let fromSource = ''
    //     if (+this.status === 3 && +this.questionStatus !== 8) { // 答题页面
    //       fromSource = 'game_page'
    //     }
    //     if (+this.status === 2) { // 倒计时页
    //       fromSource = 'countdown_page'
    //     }
    //     utils.statistic('speaking', 3, {}, fromSource)
    //   }
    // },
    // 3. 输入框 获得焦点时 【hack】 增加注释
    focusEvent (e) {
      this.showInput = true
      this.reSetMsgBot()
    },
    // 4. 输入框 失去焦点时 【hack】 增加注释
    blurEvent () {
      this.showInput = false
      this.reSetMsgBot(1)
    },
    // 5. 输入框弹起或收起时 修改消息区域高度 【hack】 增加注释
    reSetMsgBot (isBlur) {
      this.$nextTick(() => {
        const msgContainer = document.getElementById('msgContainer') // 【hack】 msgcontainer -> msgContainer
        const body = document.getElementsByTagName('body')[0]
        const innerHeight = window.innerHeight
        const bodyHeight = body.clientHeight
        const msgBot = bodyHeight - innerHeight
        const bottomPosition = isBlur ? 0 : ((msgBot / 100) + 'rem')
        msgContainer && (msgContainer.style.bottom = bottomPosition)
      })
    }
    // 没用到 注释掉吧 【hack】
    // setMsgOuterHeight () {
    //   setTimeout(() => {
    //     const chatMsgWrap = document.getElementById('msgContainer')
    //     const scrollContainer = document.getElementById('chatMsgWrap')
    //     const _H = chatMsgWrap.offsetHeight
    //     scrollContainer.style.height = _H + 'px'
    //   }, 0)
    // }
  },
  watch: {
    // 【hack】 移入 fetchChatList () 中
    // msgList: function () {
    //   this.$nextTick(() => {
    //     const scrollContainer = document.getElementById('scrollContainer')
    //     scrollContainer.scrollTop = 100000
    //   })
    // }
  }

}
</script>
<style scoped lang="less" type="text/less">
.chat-container {
  width: 100%;
  height: 100%;
  flex:1;
  position: relative;
  overflow: hidden;
  margin-bottom: 35px;
  box-sizing: border-box;
}
.chat-msg-wrap {
  -webkit-mask: url('../assets/images/mask.png') no-repeat top left;
  -webkit-mask-size: 100% 110%;
  mask: url('../assets/images/mask.png') no-repeat top left;
  mask-size: 100% 110%;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: absolute;
}
.chat-msg-wrap-haswrap {
  margin-bottom: 0;
}
.msg-send-container {
  width: 60px;
  position: fixed;
  bottom: 35px;
  right: 30px;
  display: flex;
  justify-content: flex-end;
  &__icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, .2);
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    span {
          font-size: 34px;
          transform: translate(0, 3px);
    }
  }
  &__hide {
    opacity: 0;
  }
  &__show {
    opacity: 1;
  }
  &__wrap {
    width: 100%;
    height: 110px;
    display: flex;
    padding: 14px;
    background: #f6f6f6;
    justify-content: center;
    align-items: center;
    &__input {
      width: 594px;
      height: 84px;
      border: 1px solid #dcdcdc;
      border: 0;
      outline: none;
      box-shadow: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      color: #241262;
      font: 400 28px 'Roboto', Arial, serif;
      padding: 0 23px;
    }
    &__input:focus {
      box-shadow: none;
      -webkit-tap-highlight-color:rgba(0,0,0,0);
      -webkit-user-modify:read-write-plaintext-only;
      outline:0;
    }
    &__btn {
      width: 100%;
      font: 400 28px 'Roboto', Arial, serif;
      color: #FFB227;
      flex: 1;
      text-align: center;
    }
  }
}
.msg-send-container-showinput {
  width: 100%;
  right: 0px;
  bottom: 0px;
}
.msg-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  &__inner {
    width: 100%;
    height: auto;
  }
  &__item {
    max-width: 100%;
    margin: 6px 26px;
    box-sizing: border-box;
    overflow: hidden;
    img {
      display: inline-block;
    }
    span {
      font-size: 26px;
      text-shadow: #666 1px 1px 1px;
      max-width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &__nickname {
      font-family: "Roboto";
      font-weight: 500;
    }
    &__text {
      font-family: 'Roboto';
      font-weight: 300;
    }
    &__wrap {
      background: rgba(255, 255, 255, .2);
      border-radius: 30px;
      padding: 1px 20px 0px 20px;
      box-sizing: border-box;
      display: inline-block;
      font-size: 0;
      position: relative;
      line-height: 60px;
      overflow: hidden;
      color: #fff;
    }
    &__portrait {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 8px;
      transform: translate(0, -50%);
    }
    &__nickname {
      color: #ffb227;
      padding: 0 14px;
    }
    &__text {
      color: #fff;
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.fade-out-top {
  opacity: .15
}
.fade-out-bot {
  opacity: .4
}
.fade-enter-active, .fade-leave-active {
  transition: all .3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translate3d(100px, 0px, 0) scale3d(0, 0, 0);
}
</style>
