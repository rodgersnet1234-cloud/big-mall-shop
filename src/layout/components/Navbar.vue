<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="Mall4j navbar">
    <div class="navbar-content">
      <!-- 1.左边部分 -->
      <div class="left-menu">
        <WebConfigImg
          :src="webConfig.bsTopBarIcon"
          :img-style="{width:'59px',height: '18px',marginRight: '10px'}"
          def-img-type="bsTopBarIcon"
        />
        <a
          v-if="(webConfig.bsMenuTitleOpenCn || webConfig.bsMenuTitleCloseCn) || (webConfig.bsMenuTitleOpenEn || webConfig.bsMenuTitleCloseEn)"
          class="site-navbar__brand-lg"
          style="text-transform:none;"
          href="javascript:"
        >{{ sidebar.opened ? webConfig.bsMenuTitleOpenCn : webConfig.bsMenuTitleCloseCn }}</a>
        <a
          v-else
          class="site-navbar__brand-lg"
          style="text-transform:none;"
          href="javascript:"
        >{{ $t('version') + '  ' + $t('side') }}</a>
        <div
          v-if="route.path!=='/multishop/shop-process'"
          class="shrink"
        >
          <svg-icon
            icon-class="icon-zhedie"
            @click="toggleSideBar"
          />
        </div>
      </div>

      <!-- 2.右边部分 -->
      <div class="right-menu">
        <div
          v-if="isShowAnnouncement && isImbox"
          class="news-box"
          style="width:87px;height:100%"
          @click="openUrl"
        >
          <svg-icon
            :class="showHidden ? 'show' : 'hidden'"
            class="message"
            icon-class="message"
          />
          <i
            v-if="message"
            :class="showHidden ? 'show' : 'hidden'"
            class="message-radio"
          />
          客服
        </div>
        <el-dropdown
          class="avatar-container"
          trigger="hover"
        >
          <div class="avatar-wrapper">
            <div class="user-name">
              {{ name || userName }}
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-if="isShowAnnouncement"
                @click="changePassword"
              >
                <span style="display: block">修改密码</span>
              </el-dropdown-item>
              <el-dropdown-item @click="logout">
                <span style="display: block">{{ $t("navbar.logOut") }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password
      v-if="updatePasswordVisible"
      ref="updatePasswordRef"
    />
  </div>
</template>

<script setup>
import UpdatePassword from '@/components/update-password/index.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { WKSDK, ConnectStatus } from 'wukongimjssdk'
import * as api from '@/api/im-box/index.js'
import cookie from 'vue-cookies'
import { Convert } from '@/views/common/im-box/components/Conversation/convert.js'
import { getDomain } from '@/utils/index.js'
import { getToken } from '@/utils/auth'

const updatePasswordVisible = ref(false)
const webConfigStore = useWebConfigStore()
const webConfig = computed(() => webConfigStore.webConfig)

const appStore = useAppStore()
const sidebar = computed(() => appStore.sidebar)

const userStore = useUserStore()
const name = computed(() => userStore.name)
const userName = computed(() => userStore.userName)
const isShowAnnouncement = computed(() => userStore.isPassShop)

const isImbox = computed(() => {
  const roles = userStore.roles
  const isAdmin = userStore.isAdmin
  const index = roles.findIndex(item => item === 'shop:message:view')
  return isAdmin || index > -1
})
let notification = false
onMounted(() => {
  let notifFlag = true
  message.value = localStorage.getItem('cloudVsNotificationMessage') || null
  if (isShowAnnouncement.value && isImbox.value) {
    getWukong()
    WKSDK.shared().connectManager.addConnectStatusListener(connectStatusListener) // 监听连接状态
    WKSDK.shared().chatManager.addCMDListener(cmdListener) // 监听cmd消息
  }
  if (window.Notification) {
    // 浏览器通知--window.Notification
    if (Notification.permission === 'granted') {
      notification = false
      notifFlag = false
    } else if (Notification.permission !== 'denied') {
      notification = false
      Notification.requestPermission()
    }
  } else {
    notification = true
  }
  if (notifFlag) {
    notification = true
  }
})
onUnmounted(() => {
  WKSDK.shared().chatManager.removeMessageListener(messageListener)
  WKSDK.shared().connectManager.removeConnectStatusListener(connectStatusListener)
  WKSDK.shared().chatManager.removeCMDListener(cmdListener)
  WKSDK.shared().disconnect()
})

let messageListener
const getWukong = () => {
  api.registerOrLogin().then((data) => {
    // 认证信息
    const config = WKSDK.shared().config
    config.addr = import.meta.env.VITE_APP_WEBSOCKET_URL
    config.uid = data.uid // 用户uid（需要在悟空通讯端注册过）
    config.token = data.token// 用户token （需要在悟空通讯端注册过）
    WKSDK.shared().config = config
    WKSDK.shared().connect()
    const isJSON = (str) => {
      if (typeof str === 'string') {
        try {
          JSON.parse(str)
          return true
        } catch (e) {
          return false
        }
      }
    }
    // 监听消息
    messageListener = (msg) => {
      if (isJSON(msg.content.text)) {
        msg.content.text = JSON.parse(msg.content.text)
      }
      const ids = +cookie.get('cloudMChannelIds')
      if ((!msg.send || msg.content.text.sender === 1) && (ids === 0 || ids === null)) {
        message.value = 1
        popNotice($t('chat.notification'), $t('chat.haveANewUnreadMessage')) // 启用通知
        newMessage.value = true
        clearInterval(messageReminding.value)
        if (notification) {
          showMessage()
        }
        messageRemindingFn()
      }
    }
    WKSDK.shared().chatManager.addMessageListener(messageListener)
  })
}
let messageCount = 0
const connectStatusListener = async (status) => {
  if (status === ConnectStatus.Connected) {
    const remoteConversations = await WKSDK.shared().conversationManager.sync() // 同步最近会话列表
    if (remoteConversations && remoteConversations.length > 0) {
      messageCount = WKSDK.shared().conversationManager.getAllUnreadCount()
      const ids = +cookie.get('cloudMChannelIds')
      if (messageCount > 0 && (ids === 0 || ids === null)) {
        message.value = 1
        messageRemindingFn()
        if (notification) {
          showMessage()
        }
      }
    }
  }
}
// 同步自己业务端的最近会话列表
WKSDK.shared().config.provider.syncConversationsCallback = async () => {
  const data = await sendDelayedRequest()
  return data
}
const sendDelayedRequest = () => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const data = await api.getConversationSyncPage({
          version: 0,
          pageNum: 1,
          pageSize: 20
        })
        const conversationList = data.list
        const resultConversations = []
        if (conversationList) {
          conversationList.forEach((v) => {
            const conversation = Convert.toConversation(v)
            conversation.lastMessage.content.text = JSON.parse(conversation.lastMessage?.content.text)
            resultConversations.push(conversation)
          })
        }
        resolve(resultConversations)
      } catch (error) {
        reject(error)
      }
    }, 100)
  })
}
const toggleSideBar = () => {
  if (sessionStorage.getItem('cloudIsExpand') === '0' && !sidebar.value.opened) {
    return
  }
  appStore.toggleSideBar()
}

const route = useRoute()
const router = useRouter()
const logout = async () => {
  ElMessageBox.confirm('确认退出登录吗？', $t('table.tips'), {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await userStore.logout()
    localStorage.setItem('cloudMulChatWs', Date.now()) // 通知新窗口关闭ws
    WKSDK.shared().disconnect()
    userStore.removeChannelId()
    await router.push(`/login?redirect=${route.fullPath}`)
  })
}
const cmdListener = (msg) => {
  if (msg.content.contentObj.cmd === 'logOut' && msg.content.contentObj.param === getToken()) {
    WKSDK.shared().disconnect()
  }
}
const updatePasswordRef = ref(null)
const changePassword = () => {
  updatePasswordVisible.value = true
  nextTick(() => {
    updatePasswordRef.value?.init()
  })
}

const newMessage = ref(false)
const notificationDebounce = ref(1)
const messageReminding = ref(null)
const message = ref(0)
const showHidden = ref(true)
const domain = getDomain()
// 图标提醒标题闪烁
const openUrl = () => {
  const path = router.resolve({ path: '/im-box', query: { ...(cookie.get(domain) ? {} : { tid: cookie.get('cloudTid') }) } })
  const win = window.open(path.href, 'view_window', 'noopener,noreferrer')
  localStorage.removeItem('cloudVsNotificationMessage')
  if (win) win.opener = null
  message.value = null
  showHidden.value = true
  clearInterval(messageReminding.value)
}

// 右下角消息通知
const popNotice = (user, content) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(user, {
      body: content
    })
    notification.onclick = function () {
      nextTick(() => {
        setTimeout(() => {
          notificationDebounce.value = 1
          localStorage.removeItem('cloudVsNotificationMessage')
          message.value = null
          const path = router.resolve({ path: '/im-box', query: { ...(cookie.get(domain) ? {} : { tid: cookie.get('cloudTid') }) } })
          const win = window.open(path.href, 'view_window', 'noopener,noreferrer')
          if (win) win.opener = null
          clearInterval(messageReminding.value)
          showHidden.value = true
          // 具体操作
        }, 500)
      })
      // 可直接打开通知notification相关联的tab窗
      window.focus()
      notification.close()
    }
    notification.onshow = function () {
      setTimeout(() => {
        notificationDebounce.value = 1
        notification.close.bind(notification)
      }, 3000)
    }
  }
}

const messageRemindingFn = () => {
  clearInterval(messageReminding.value)
  messageReminding.value = setInterval(() => {
    // 如果没有获取焦点就判断名称是否包含未读消息
    if (newMessage.value) {
      // 如果包含就显示为空
      showHidden.value = false
      newMessage.value = false
    } else {
      // 否则显示未读消息，间隔0.5秒实现闪烁
      showHidden.value = true
      newMessage.value = true
    }
  }, 500)
}

const showMessage = Debounce(function () {
  ElMessage({
    message: '您有新的未读消息',
    offset: 10,
    duration: 1500
  })
}, 1800)

</script>

<style lang="scss" scoped>
.navbar {
  top: 0;
  z-index: 1000;
  position: fixed;
  display: flex;
  align-items: center;
  min-width: 1260px;
  width: 100%;
  height: 50px;
  background: #fff;
  overflow: hidden;
  border-bottom: 1px solid #EBEDF0;
  box-sizing: border-box;

  .navbar-content {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 20px;
    margin: 0 auto;

    // 1.左边部分
    .left-menu {
      display: flex;
      align-items: center;
    }

    // 2.右边部分
    .right-menu {
      display: flex;
      align-items: center;
      margin-left: auto;
      .avatar-container {
        .avatar-wrapper {
          outline: none;
          cursor: pointer;
        }
      }
      .news-box {
        cursor: pointer;
        font-size: 14px;
        position: relative;
        color: #606266;
        .message {
          color: #155bd4;
          margin-right: 8px;
          font-size: 18px;
        }
        .message-radio {
          border-radius: 50%;
          width: 5px;
          height: 5px;
          background-color: red;
          display: inline-block;
          position: absolute;
          top: 0;
          left: 12px;
        }
        .show {
          visibility: inherit;
        }
        .hidden{
          visibility: hidden;
        }
      }
    }
  }

  .site-navbar__brand-lg {
    margin: 0 auto;
    word-break: break-all;
    /* 按字符截断换行 支持IE和chrome，FF不支持*/
    word-wrap: break-word;
    /* 按英文单词整体截断换行  以上三个浏览器均支持 */
    color: #333333;
    font-weight: bold;
    font-size: 16px;
  }

  .shrink {
    cursor: pointer;
    margin-left: 23px;
    font-size: 18px;
  }

}
</style>
