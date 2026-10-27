<template>
  <div
    v-loading="loadingend"
    class="conversations"
  >
    <ul
      v-if="conversationWraps.length"
      v-infinite-scroll="scrollUserList"
      class="shop-list"
      infinite-scroll-immediate="false"
    >
      <li
        v-for="conversationWrap in conversationWraps"
        :key="conversationWrap"
        ref="conversationsRef"
        class="item-content"
        :class="getConversationItemCss(conversationWrap)"
        @click="() => {
          onSelectChannelClick(conversationWrap.channel,conversationWrap.userId,conversationWrap.unread,conversationWrap.nickName,conversationWrap.isDestroy)
        }"
      >
        <div class="left">
          <div
            class="avatar"
            style="width: 48px;height: 48px;"
          >
            <img
              :src="conversationWrap.pic?checkFileUrl(conversationWrap.pic):imAvatarPng"
              alt=""
            >
          </div>
        </div>
        <div class="right">
          <div class="right-item1">
            <div class="title">
              {{ conversationWrap.nickName }}
            </div>
            <div class="time">
              {{ conversationWrap.timestampString }}
            </div>
          </div>
          <div class="right-item2">
            <div
              v-if="conversationWrap.lastMessage?.content.text"
              class="last-msg"
            >
              {{ getMessageText(conversationWrap.lastMessage) }}
            </div>
            <div
              v-if="conversationWrap.unread > 0"
              className="reddot"
            >
              {{ conversationWrap.unread }}
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div
      v-if="!loadingend&&conversationWraps.length===0"
      class="empty-contacts"
    >
      <img
        src="@/assets/empty/empty_contacts.png"
        :alt="$t('chat.noContacts')"
        class="empty-img"
      >
      <span class="empty-txt">{{ $t('chat.noContacts') }}</span>
    </div>
  </div>
</template>
<script setup>
import { WKSDK, ConnectStatus, ConversationAction, Channel, ChannelTypeGroup } from 'wukongimjssdk'
import { ConversationWrap } from './ConversationWrap'
import { Convert } from './convert'
import imAvatarPng from '@/assets/chat/userImg.jpg'
import { checkFileUrl } from '@/utils/index.js'
import cookie from 'vue-cookies'
import * as api from '@/api/im-box/index.js'
const emit = defineEmits(['channelInfoUpdate'])
const onSelectChannel = defineProps({
  onSelectChannel: {
    type: Function,
    default: () => null
  },
  currentShopId: {
    type: Number,
    default: null
  },
  chatType: {
    type: Number,
    default: null
  }
})
const loadingend = ref(true)
// 获取某个频道的最近会话
const clearConversationUnread = (channel) => {
  const conversation = WKSDK.shared().conversationManager.findConversation(channel)
  if (conversation) {
    conversation.unread = 0
    WKSDK.shared().conversationManager.notifyConversationListeners(conversation, ConversationAction.update)
  }
}

// 排序最近会话列表
const sortConversations = (conversations) => {
  let newConversations = conversations
  if (!newConversations) {
    newConversations = conversationWraps.value
  }
  if (!newConversations || newConversations.length <= 0) {
    return []
  }
  const sortAfter = newConversations.sort((a, b) => {
    let aScore = a.timestamp
    let bScore = b.timestamp
    if (a.extra?.top === 1) {
      aScore += 1000000000000
    }
    if (b.extra?.top === 1) {
      bScore += 1000000000000
    }
    return bScore - aScore
  })
  return sortAfter
}
const route = useRoute()
const queryUSerId = computed(() => route.query.userId) // 获取当前用户id
// 监听连接状态

const userStore = useUserStore()
const remoteConversations = ref([])
const connectStatusListener = async (status) => {
  let userId = []
  if (status === ConnectStatus.Connected) {
    remoteConversations.value = await WKSDK.shared().conversationManager.sync() // 同步最近会话列表
    loadingend.value = false

    if (remoteConversations.value && remoteConversations.value.length > 0) {
      conversationWraps.value = sortConversations(remoteConversations.value.map(conversation => new ConversationWrap(conversation)))
      userId = conversationWraps.value.map((item) => item.conversation.userId)
      if (userId.includes(queryUSerId.value) || !queryUSerId.value) {
        const conversationToSelect = queryUSerId.value ? conversationWraps.value.filter((item) => item.conversation.userId === queryUSerId.value)[0].conversation : conversationWraps.value[0].conversation
        onSelectChannelClick(conversationToSelect.channel, conversationToSelect.userId, conversationToSelect.unread, conversationToSelect.nickName, conversationToSelect.isDestroy)
      }
      const ids = conversationWraps.value.map((item) => {
        return item.conversation.channel.channelID
      })
      userStore.saveChannelId(ids.length)
      const channelIdsLength = cookie.get('cloudMChannelIds')
      if (channelIdsLength) {
        const sumChannelIds = +channelIdsLength + ids.length
        cookie.set('cloudMChannelIds', sumChannelIds)
      } else {
        cookie.set('cloudMChannelIds', ids.length)
      }
    }
    if (queryUSerId.value && !userId.includes(queryUSerId.value)) {
      api.getShopChannelInfo(queryUSerId.value).then(async (data) => {
        if (data) {
          WKSDK.shared().conversationManager.createEmptyConversation(new Channel(data.imChannel.channelId, ChannelTypeGroup))
          onSelectChannelClick(new Channel(data.imChannel.channelId, ChannelTypeGroup), data.imChannel.userId, 0, data.nickName)
        } else {
          api.createChannel(queryUSerId.value).then((data) => {
            WKSDK.shared().conversationManager.createEmptyConversation(new Channel(data.channelId, ChannelTypeGroup))
            onSelectChannelClick(new Channel(data.channelId, ChannelTypeGroup), queryUSerId.value, 0, data.nickName)
          })
        }
      })
    }
  }
}
// 监听最近会话列表的变化
const conversationListener = async (conversation, action) => { // 监听最近会话列表的变化
  if (conversation.channel?.channelID === selectedID) {
    conversation.unread = 0
  }
  if (action === ConversationAction.add) {
    const data = await api.getListChannelSubcribers(conversation.channel.channelID)
    // eslint-disable-next-line require-atomic-updates
    conversation.nickName = data.subscribers[data.subscribers.length - 1].nickName
    // eslint-disable-next-line require-atomic-updates
    conversation.userId = data.subscribers[data.subscribers.length - 1].userId
    // eslint-disable-next-line require-atomic-updates
    conversation.pic = data.subscribers[data.subscribers.length - 1].pic
    // 将新对话转换为 ConversationWrap 对象
    const newConversationWrap = new ConversationWrap(conversation)
    // 检查是否存在具有相同 userId 的对话
    const conversationExists = conversationWraps.value.some(conversationWrap => conversationWrap.conversation.userId === newConversationWrap.conversation.userId)
    if (!conversationExists) {
      conversationWraps.value = [new ConversationWrap(conversation), ...(conversationWraps.value || [])]
    } else {
      conversationWraps.value[0].conversation = new ConversationWrap(conversationWraps.value[0].conversation)
    }
  } else if (action === ConversationAction.update) {
    const index = conversationWraps.value?.findIndex(item => item.channel.channelID === conversation.channel.channelID && item.channel.channelType === conversation.channel.channelType)
    if (index !== undefined && index >= 0) {
      conversationWraps.value[index] = new ConversationWrap(conversation)
      conversationWraps.value = sortConversations()
    }
  }
}
// 判断是否为JSON格式
const isJSON = (str) => {
  if (typeof str == 'string') {
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      return false
    }
  }
}
const isDateBeforeToday = (dateTimeString) => {
  if (!dateTimeString) {
    return true
  }
  // 将日期时间字符串转换为日期对象
  const givenDate = new Date(dateTimeString)
  // 获取当前日期的年、月、日
  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth()
  const todayDay = today.getDate()
  givenDate.setHours(0, 0, 0, 0)
  return (
    givenDate.getFullYear() < todayYear ||
    (givenDate.getMonth() < todayMonth && givenDate.getFullYear() === todayYear) ||
    (givenDate.getDate() < todayDay &&
      givenDate.getMonth() === todayMonth &&
      givenDate.getFullYear() === todayYear)
  )
}
const selectedChannel = ref() // 选中的频道
let selectedID
let channelData = {}
let result = false
const onSelectChannelClick = async (channel, userId, unread, nickName, destroy) => {
  await fetchChannelInfoIfNeed(channel)
  channelData = channel
  selectedID = channel.channelID
  api.getShopChannelInfo(userId).then(async (data) => {
    if (data.imChannel.sendAutoReply === 1) {
      result = isDateBeforeToday(data.imChannel.personReplyTime)
    }
    clearConversationUnread(channel)
    unread > 0 && await api.setUnread({ channel_id: channel.channelID, maxSeq: data.imChannel.userReadSeq })
    selectedChannel.value = channel
    if (onSelectChannel) {
      onSelectChannel.onSelectChannel(channel, data.imChannel.userReadSeq, data.isWhiteUser, nickName, result, userId, destroy)
    }
  })
}
const fetchChannelInfoIfNeed = async (channel) => {
  const channelInfo = WKSDK.shared().channelManager.getChannelInfo(channel)// 获取频道详情(不会触发数据源的远程获取)
  if (!channelInfo) {
    await WKSDK.shared().channelManager.fetchChannelInfo(channel)
  }
}
const getConversationItemCss = (conversationWrap) => {
  if (!selectedChannel.value) {
    return 'conversation-item'
  }
  if (selectedChannel.value.isEqual(conversationWrap.channel)) {
    return 'conversation-item selected'
  }
  return 'conversation-item'
}
const conversationWraps = ref([]) // 本地最近会话列表
const conversationsRef = ref(null)

// 同步自己业务端的最近会话列表
let pages = 0
WKSDK.shared().config.provider.syncConversationsCallback = async () => {
  const data = await api.getConversationSyncPage(page).then((data) => {
    const resultConversations = []
    pages = data.pages
    const conversationList = data.list
    if (conversationList) {
      conversationList.forEach((v) => {
        const conversation = Convert.toConversation(v)
        conversation.lastMessage.content.text = JSON.parse(conversation.lastMessage?.content.text)
        resultConversations.push(conversation)
      })
    }
    return resultConversations
  })
  return data
}
const getMessageText = (message) => {
  if (isJSON(message.content.text)) {
    message.content.text = JSON.parse(message.content.text)
  }
  if (message.content.text?.type === -1) {
    if (message.content.text.sendTextState) {
      return message.content.text.content
    } else if (message.content.text.sendIssusState) {
      return message.content.text.issues[0].issues
    }
  }
  if (message.content.text?.msgType === 1 || message.content.text?.msgType === -1 || message.content.text?.type === -5) {
    return message.content?.text.msg
  } else if (message.content.text?.msg.orderType || message.content.text?.msg.orderType === 0) {
    return '[订单链接]'
  } else if (message.content.text?.msgType === 4) {
    return '[商品链接]'
  } else if (!message.content.text?.msgType) {
    return message.content.text?.content || ''
  } else {
    return '[图片]'
  }
}
WKSDK.shared().config.provider.channelInfoCallback = async (channel) => {
  const data = await api.getListChannelSubcribers(channel.channelID)
  const channelInfo = {
    logo: data.subscribers[0]?.pic,
    title: data.shopName,
    shopId: data.shopId,
    data: data.subscribers,
    channel
  }
  return channelInfo
}
const channelInfoListener = () => {
  conversationWraps.value = [...conversationWraps.value || []] // 强制刷新
}
/**
 * 滚动加载用户列表
 */
const page = {
  version: 0,
  pageNum: 1,
  pageSize: 20
}
const scrollUserList = async () => {
  page.pageNum++
  if (page.pageNum <= pages) {
    const remoteConversations = await WKSDK.shared().conversationManager.sync()
    conversationWraps.value = sortConversations(conversationWraps.value.concat(remoteConversations).map(conversation => new ConversationWrap(conversation)))
    // 最近会话列表去重处理
    const existingConversationsSet = new Set(conversationWraps.value.map(conversation => conversation.userId))
    const uniqueRemoteConversations = remoteConversations.filter(conversation => !existingConversationsSet.has(conversation.userId))
    conversationWraps.value = [...conversationWraps.value, ...uniqueRemoteConversations]
  }
}
onMounted(async () => {
  WKSDK.shared().connectManager.addConnectStatusListener(connectStatusListener) // 监听连接状态
  WKSDK.shared().conversationManager.addConversationListener(conversationListener) // 监听最近会话列表的变化
  WKSDK.shared().channelManager.addListener(channelInfoListener) // 监听频道信息变化
  WKSDK.shared().chatManager.addCMDListener(cmdListener) // 监听cmd消息
})

onUnmounted(() => {
  WKSDK.shared().conversationManager.removeConversationListener(conversationListener)
  WKSDK.shared().connectManager.removeConnectStatusListener(connectStatusListener)
  WKSDK.shared().chatManager.removeCMDListener(cmdListener)

  WKSDK.shared().channelManager.removeListener(channelInfoListener)
})
const resetConversation = async () => {
  const remoteConversations = await WKSDK.shared().conversationManager.sync()
  conversationWraps.value = sortConversations(remoteConversations.map(conversation => new ConversationWrap(conversation)))
  if (conversationWraps.value.length) {
    onSelectChannelClick(conversationWraps.value[0].conversation.channel, conversationWraps.value[0].conversation.userId, conversationWraps.value[0].conversation.unread, conversationWraps.value[0].conversation.nickName, conversationWraps.value[0].conversation.isDestroy)
  }
}
// 监听cmd消息
const cmdListener = async (msg) => {
  if (msg.content.contentObj.cmd === 'unreadClear') {
    const param = JSON.parse(msg.content.param)
    if (param.sender === 1) { // sneder===1代表是商家/平台的指令
      clearConversationUnread(msg.channel)
      conversationWraps.value = [...conversationWraps.value || []] // 强制更新
    }
  }
  if (msg.content.contentObj.cmd === 'memberUpdate') {
    await WKSDK.shared().channelManager.fetchChannelInfo(channelData)
    const remoteConversations = await WKSDK.shared().conversationManager.sync()
    // eslint-disable-next-line require-atomic-updates
    conversationWraps.value = sortConversations(remoteConversations.map(conversation => new ConversationWrap(conversation)))
    emit('channelInfoUpdate')
  }
}
defineExpose({ resetConversation })

</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
