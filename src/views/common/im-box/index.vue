<template>
  <div class="body page-im-box">
    <div class="chat-box">
      <!-- 消息盒子头部 -->
      <div class="chat-box-top">
        {{ $t('chat.messageBox') }}
        <span class="user-name">{{ userName }}</span>
      </div>

      <div class="chat-box-main">
        <!-- 消息盒子左侧栏 -->

        <div class="chat-box-left">
          <!-- 左侧用户信息栏 -->
          <Conversation
            ref="conversationRef"
            :on-select-channel="onSelectChannel"
            @channel-info-update="channelInfoUpdate"
          />
        </div>

        <!-- 消息盒子右侧信息回复栏 -->
        <div class="chat-box-right">
          <div class="im-box">
            <div class="im-main">
              <div class="chat-main-form">
                <div class="display-infor">
                  <div
                    ref="chatRef"
                    class="message-list"
                    @scroll="handleScroll"
                  >
                    <div
                      v-for="(m, index) in messages"
                      :key="index"
                      class="row"
                    >
                      <div
                        v-if="m.timeStr"
                        class="topTime"
                      >
                        {{ m.timeStr }}
                      </div>
                      <!-- 用户发出的消息 -->
                      <div
                        v-if="!m.send&&!m.content.text.sender&&m.content.text?.msgType!==-1"
                        :id="m.clientMsgNo"
                        class="my"
                      >
                        <!-- 左-头像 -->
                        <div class="left">
                          <img
                            v-if="!getChannelInfo(m,'pic')"
                            src="@/assets/chat/userImg.jpg"
                            class="avatar"
                            alt
                          >
                          <img
                            v-else
                            :src="checkFileUrl(getChannelInfo(m,'pic'))"
                            class="avatar"
                            alt
                            @error="channelInfo.logo=''"
                          >
                        </div>
                        <!-- 消息 -->
                        <div class="right message-content">
                          <div class="username">
                            {{ getChannelInfo(m,'nickName') }}
                          </div>
                          <div
                            v-if="m.content.text.msgType===2"
                            class="bubble"
                          >
                            <el-image
                              :src="checkFileUrl(m.content.text.msg)"
                              class="longimage"
                              :preview-src-list="[checkFileUrl(m.content.text.msg)]"
                            >
                              <template #error>
                                <img
                                  class="longimage"
                                  src="@/assets/images/def.png"
                                  alt
                                >
                              </template>
                            </el-image>
                          </div>
                          <!-- 文字消息 -->
                          <div
                            v-if="m.content.text.msgType===1"
                            class="bubble"
                          >
                            <span>{{ getMessageText(m) }}</span>
                          </div>
                          <!-- 商品链接 -->
                          <div
                            v-if="m.content.text?.msgType===4"
                            class="prod-link"
                          >
                            <div class="link-prod">
                              <div
                                v-if="m.content.text.msg.orderFlag"
                                class="prod-number"
                                @click="toProdDetail(m.content.text.msg,1)"
                              >
                                {{ $t('chat.orderNumber') }}:{{ m.content.text.msg.orderNumber || m.content.text.msg.orderId }}
                              </div>
                              <div
                                class="prod-box"
                                @click="toProdDetail(m.content.text.msg,m.content.text.msg.orderFlag ? 1 : 0)"
                              >
                                <img-show :src="m.content.text.msg.imgs" />
                                <div class="link-detail">
                                  <div class="prod-name">
                                    {{ m.content.text.msg.prodName||m.content.text.msg.spuName }}
                                  </div>
                                  <div class="prod-price">
                                    <span>{{ m.content.text.msg.actualTotal?'￥':'' }}
                                      {{ m.content.text.msg.actualTotal?parsePrice(m.content.text.msg.actualTotal)[0]+'.'+parsePrice(m.content.text.msg.actualTotal)[1]:'' }}
                                      {{ (m.content.text.msg.platformShareReduce || m.content.text.msg.scoreFee)?'+':'' }}
                                      <span v-if="m.content.text.msg.platformShareReduce">
                                        {{ parsePrice(m.content.text.msg.platformShareReduce)[0] }}
                                        {{ $t('order.order.integral') }}
                                      </span>
                                      <span v-if="m.content.text.msg.scoreFee">
                                        {{ m.content.text.msg.scoreFee }}
                                        {{ $t('order.order.integral') }}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 商家发出的消息 -->
                      <div
                        v-if="m.send||m.content.text.sender||m.content.text?.msgType===-1||m.content.text?.type===-1"
                        class="other"
                      >
                        <!-- 右-商家名称-时间-消息 -->
                        <div class="left">
                          <div
                            v-if="m.content.text.sender===1"
                            class="divider-box"
                          >
                            <div class="divider" />
                            <div class="divider-txt">
                              {{ $t('chat.transferToCustomerService') }}{{ getChannelInfo(m,'nickName') }}
                            </div>
                            <div class="divider" />
                          </div>
                          <div class="username">
                            <div class="name">
                              {{ getChannelInfo(m,'nickName') }}
                            </div>
                          </div>
                          <div class="message-box">
                            <div
                              v-if="maxReadSeq>=m.messageSeq"
                              class="unread"
                            >
                              {{ $t('chat.read') }}
                            </div>
                            <div
                              v-else
                              class="unread"
                            >
                              {{ $t('chat.unRead') }}
                            </div>
                            <!-- 文字消息 -->
                            <div
                              v-if="(m.content.text.msgType===-1||m.content.text.msgType===1||m.content.text.type===-5)&&m.content.text.type!==-1"
                              class="bubble"
                            >
                              <span>  {{ m.content.text.msg }} </span>
                            </div>
                            <div class="bubble">
                              <div
                                v-if="m.content.text.type===-1"
                                class="issues-bubble"
                              >
                                <div
                                  v-if="m.content.text.sendTextState"
                                >
                                  {{ m.content.text.content }}
                                </div>

                                <div
                                  v-if="m.content.text.sendIssusState"
                                  style="display: flex; flex-direction: column;align-items: start;"
                                >
                                  <div
                                    v-for="item in m.content.text.issues"
                                    :key="item.id"
                                  >
                                    • {{ item.issues }}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!-- 图片消息 -->
                            <div
                              v-if="m.content.text.msgType===2"
                              class="bubble"
                            >
                              <el-image
                                :src="checkFileUrl(m.content.text.msg)"
                                class="longimage"
                                :preview-src-list="[checkFileUrl(m.content.text.msg)]"
                              >
                                <template #error>
                                  <img
                                    class="longimage"
                                    src="@/assets/images/def.png"
                                    alt
                                  >
                                </template>
                              </el-image>
                            </div>
                          </div>
                        </div>
                        <!-- 头像 -->
                        <div class="right">
                          <img-show
                            :src="channelInfo?.logo"
                            :class-list="['avatar']"
                            @img-error="row.shopLogo=''"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      v-for="(row, index) in msgList"
                      :key="index"
                      class="row"
                    >
                      <div
                        v-if="index>0&&msgList[index].employeeId!==msgList[index-1].employeeId"
                        class="divider-box"
                      />
                      <!-- 用户消息 -->
                      <div
                        v-if="row.timeStr"
                        class="topTime"
                      >
                        {{ row.timeStr }}
                      </div>
                    <!-- 商家发出的消息 -->
                    </div>
                  </div>
                </div>

                <!-- 下方发送信息栏 -->
                <div class="reply">
                  <div class="small-box">
                    <div class="upload" />
                    <div
                      class="customerService"
                      @click="customerService()"
                    >
                      {{ $t('chat.transferToCustomerService') }}
                      <el-tooltip
                        effect="dark"
                        :content="$t('chat.transferTips')"
                        placement="right"
                      >
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </div>
                  </div>
                  <label
                    for="iii"
                    class="imgUp"
                  ><a
                    class="upload"
                    style="cursor: pointer"
                  /></label>
                  <input
                    id="iii"
                    ref="fileRef"
                    accept="image/png, image/jpeg"
                    type="file"
                    class="search-btnn"
                    @change="onUploadConfirm"
                  >
                  <div class="reply-area">
                    <textarea
                      id=""
                      v-model="textMsg"
                      name=""
                      cols="20"
                      rows="4"
                      maxlength="500"
                      @keydown="messageSendlisten($event)"
                    />
                    <div
                      class="send"
                      @click="sendText()"
                    >
                      {{ $t('chat.send') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 转接客服弹窗 -->
    <el-dialog
      v-model="visible"
      :title="$t('chat.selectOnlineCustomerService')"
      :modal="false"
      top="60px"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="prods-select-body">
        <div class="username">
          {{ $t('station.account') }}
        </div>
        <div
          v-for="item in serviceList"
          :key="item.uid"
          class="service-list"
        >
          <el-radio
            v-model="employeeId"
            :label="item.uid"
            @change="getSelectProdRow(item)"
          >
            &nbsp;
          </el-radio>
          <span class="nick-name">{{ item.nickName }}</span>
        </div>
        <div
          v-if="serviceList.length===0"
          class="no-data"
        >
          {{ $t('order.order.noData') }}
        </div>
      </div>
      <template #footer>
        <span>
          <el-button @click="visible = false">{{
            $t("chat.cancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="submitProds()"
          >{{
            $t("chat.confirm")
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ConnectStatus, WKSDK, Message, MessageText, MessageStatus, PullMode } from 'wukongimjssdk'
import * as api from '@/api/im-box/index.js'
import { awsImgUpdate, getBatchPreSignUrl } from '@/api/biz/oss.js'
import { isAuth, getDomain } from '@/utils/index.js'
import ImageCompressor from 'compressorjs'
import Big from 'big.js'
import { ElMessage } from 'element-plus'
import Conversation from './components/Conversation/index.vue'
import { Convert } from './components/Conversation/convert'
import cookie from 'vue-cookies'
import { getToken } from '@/utils/auth'
const route = useRoute()
const router = useRouter()
// 防止订单页面跳转过来数据不对应
watch(() => route.query, () => {
  location.reload()
})
const userStore = useUserStore()
const channelId = computed(() => userStore.channelId)
onMounted(() => {
  window.addEventListener('beforeunload', () => {
    const temp = cookie.get('cloudMChannelIds')
    if (Number(temp) > 0) {
      const updateNum = Number(temp) - channelId.value
      cookie.set('cloudMChannelIds', updateNum)
    }
  })
  window.addEventListener('visibilitychange', () => {
    clearInterval(messageReminding)
    document.title = defaultTitle
  })

  getShopInfo()
  localStorage.setItem('cloudShop', true)
  window.onbeforeunload = () => {
    localStorage.removeItem('cloudShop')
  }
  // 监听storage的变化，用于退出登录时关闭ws
  window.addEventListener('storage', (e) => {
    if (e.key === 'cloudMulChatWs') {
      WKSDK.shared().disconnect()
    }
  })
  getWuKong()
  WKSDK.shared().chatManager.addCMDListener(cmdListener) // 监听cmd消息
})
onUnmounted(() => {
  clearTimeout(messageReminding)
  WKSDK.shared().connectManager.removeConnectStatusListener(connectStatusListener)
  WKSDK.shared().chatManager.removeMessageListener(messageListener)
  WKSDK.shared().chatManager.removeCMDListener(cmdListener)
  WKSDK.shared().chatManager.removeMessageStatusListener(messageStatusListener)
  WKSDK.shared().disconnect()
})
let sensitiveWords = ''
const getSensitiveWords = async (message) => {
  const data = await api.getSensitiveWords(message)
  sensitiveWords = JSON.parse(data)
  textMsg.value = sensitiveWords
}
const formatPrice = (price, type = 0) => {
  if (!price) {
    return 0
  }
  Big.DP = 2
  if (type === 0) {
    return +new Big(price).times(100).valueOf()
  }
  return +new Big(price).div(100).valueOf()
}

/**
 * 价格过滤
 */
const parsePrice = (value) => {
  let val = formatPrice(Number(value), 1)
  if (!val) {
    val = 0
  }
  // 截取小数点后两位，并以小数点为切割点将val转化为数组
  return val.toFixed(2).split('.')
}

let messageReminding = null
const defaultTitle = document.title // 存储默认标题
// 清除消息提醒时器
const clearMeagess = () => {
  clearInterval(messageReminding)
  document.title = defaultTitle
}

// 消息提醒标题闪烁
const messageRemindingFn = () => {
  window.onfocus = () => {
    clearMeagess()
  }
  clearMeagess()
  messageReminding = setInterval(() => {
    const title = document.title
    // 如果没有获取焦点就判断名称是否包含未读消息
    if (/您有新消息/.test(title) === false) {
      // 如果包含就显示为空
      document.title = '【您有新消息】'
    } else {
      // 否则显示未读消息，间隔0.5秒实现闪烁
      document.title = defaultTitle
    }
  }, 500)
}

const shopInfo = ref({})
// 获取当前商家信息
const getShopInfo = () => {
  api.shopUserInfo().then(data => {
    shopInfo.value = data
  })
}

let noAccountable = true
const msgList = ref([])
const serviceList = ref([])
const visible = ref(false) // 客服转接弹窗显隐
/**
 * 转接客服
 */
const customerService = () => {
  if (isDestroy || isDestroyArr.includes(to.value.channelID)) {
    ElMessage.error($t('chat.AccountCancelled'))
    textMsg.value = ''
    return
  }
  if (!to.value.channelID) {
    ElMessage.error($t('chat.PleaseSelectAContactPerson'))
    return
  }
  if (!noAccountable) {
    ElMessage.error($t('chat.notYourResponsibility'))
    return
  }
  api.getListTransfer().then((data) => { // 客服列表
    serviceList.value = data
  })
  const time = setTimeout(() => {
    if (noAccountable) visible.value = true
    visible.value = true
    clearTimeout(time)
  }, 100)
}

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

/**
 * textarea回车事件
 */
const messageSendlisten = (event) => {
  if (event.keyCode === 13) {
    sendText() // 发送文本
    event.preventDefault() // 阻止浏览器默认换行操作
    return false
  }
}

const textMsg = ref('')
/**
 * 发送文本消息
 */
const sendText = async () => {
  if (!to.value.channelID) {
    ElMessage.error($t('chat.PleaseSelectAContactPerson'))
    return
  }
  if (isDestroy || isDestroyArr.includes(to.value.channelID)) {
    ElMessage.error($t('chat.AccountCancelled'))
    textMsg.value = ''
    return
  }
  if (!noAccountable) {
    ElMessage.error($t('chat.notYourResponsibility'))
    textMsg.value = ''
    return
  }
  if (sensitiveWords) {
    try {
      const rep = new RegExp(sensitiveWords, 'g')
      textMsg.value = textMsg.value.replaceAll(rep, '**')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  }
  if (!textMsg.value || (textMsg.value && textMsg.value.match(/^\s+$/))) {
    ElMessage.warning('不能发送空白消息哦')
    return
  }
  await getSensitiveWords(textMsg.value)
  let content = ''
  const msgObj = JSON.stringify({ msg: textMsg.value, msgType: 1, sender: -1 })
  content = new MessageText(msgObj)
  WKSDK.shared().chatManager.send(content, to.value)
  textMsg.value = ''
}

/**
 * 进行相隔时间判断
 *
 * true 删除显示时间
 * false 保留显示时间
 */
const timeBeApart = (uppTime, preTime) => {
  if (!uppTime) {
    return false
  }
  const dateDiff = preTime - uppTime// 时间差的毫秒数
  const dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))// 计算出相差天数
  const leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000))// 计算出小时数
  // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000))// 计算相差分钟数

  return !(dayDiff >= 1 || hours >= 1 || minutes > 4)
}

let ossList = []
const fileRef = ref(null)
/**
 * 获取上传图片数据
 */
const onUploadConfirm = () => {
  if (!to.value.channelID) {
    ElMessage.error($t('chat.PleaseSelectAContactPerson'))
    return
  }
  if (isDestroy || isDestroyArr.includes(to.value.channelID)) {
    ElMessage.error($t('chat.AccountCancelled'))
    textMsg.value = ''
    return
  }
  if (!noAccountable) {
    ElMessage.error($t('chat.notYourResponsibility'))
    return
  }
  const fileNames = fileRef.value.files[0].name
  getBatchPreSignUrl(fileNames).then(data => {
    ossList = data
    nextTick(() => {
      httpRequest(fileRef.value.files[0])
    })
  }).catch(({ data }) => {
    data && ElMessage.warning(data)
  })
}

/**
 * 上传图片
 */
const httpRequest = async (event) => {
  let file = event
  const typeArray = file.type.split('/')
  if (typeArray[0] !== 'image') {
    fileRef.value.value = null
    ElMessage.error($t('biz.imgbox.onlyPictures'))
    return
  }
  const isSize = file.size / 1024 < 512
  if (!isSize) {
    // 0.5m~5m，从0.8开始循环。5m~10m，从0.6开始循环。10m以上就直接0.4。
    // 最低使用0.4
    let quality
    if (file.size / 1024 / 1024 < 5) {
      quality = 0.8
    } else if (file.size / 1024 / 1024 < 10) {
      quality = 0.6
    } else {
      quality = 0.4
    }
    try {
      let resultBlob
      let index = true
      while (index) {
        resultBlob = await ImageCompressorFn(file, quality)
        if (resultBlob.size / 1024 < 512 || quality <= 0.4) {
          index = false
        } else {
          quality = (quality * 10 - 2) / 10
        }
      }
      file = new File([resultBlob], file.name, {
        type: file.type
      })
    } catch (error) {
      return Promise().reject()
    }
  }
  const attachFile = Object.assign({
    fileType: typeArray[1],
    fileName: file.name,
    fileSize: file.size,
    type: 1
  })

  if (ossList.length <= 0) {
    ElMessage.error('数据异常，请刷新后重试')
  }

  attachFile.filePath = '/' + ossList[0].dir + ossList[0].fileName
  awsImgUpdate(ossList[0].preSignUrl, file).then(() => {
    uploadSuccess()
    if (ossList <= 0) {
      event.onSuccess()
    }
  }).catch((error) => {
    if (!error) {
      event.onError()
    }
  })
}

const ImageCompressorFn = (file, quality) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-new
    new ImageCompressor(file, {
      quality, // 压缩大小
      convertSize: 512000,
      success (result) {
        resolve(result)
      },
      error (err) {
        reject(err)
      }
    })
  })
}

/**
 * 上传成功
 */
const uploadSuccess = () => {
  fileRef.value.value = null // 解决上传同一图片不显示bug
  const msgObj = JSON.stringify({ msg: '/' + ossList[0].dir + ossList[0].fileName, msgType: 2, sender: -1 })
  const content = new MessageText(msgObj)
  WKSDK.shared().chatManager.send(content, to.value)
  scrollBottom()
  ossList = []
}

/**
 * 改变日期
 */
const tsToDate = (number, format) => {
  const formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
  const returnArr = []
  const date = new Date(number)
  returnArr.push(date.getFullYear())
  returnArr.push(
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  )
  returnArr.push(
    date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  )

  returnArr.push(
    date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  )
  returnArr.push(
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  )
  returnArr.push(
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  )

  for (const i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i])
  }
  return format
}

const employeeId = ref(0)
// 选中客服
const getSelectProdRow = (row) => {
  employeeId.value = row.uid
}

/**
 * 转接客服确定
 */
const conversationRef = ref(null)
const submitProds = () => {
  if (!noAccountable) {
    ElMessage.error($t('chat.notYourResponsibility'))
    return
  }
  if (employeeId.value) {
    api.transfer(to.value.channelID, employeeId.value).then(async () => {
      await WKSDK.shared().channelManager.fetchChannelInfo(to.value)
      ElMessage.success($t('chat.transferToCustomerService') + $t('order.order.success'))
      visible.value = false
      // eslint-disable-next-line require-atomic-updates
      to.value.channelID = ''
      messages.value = []
      userName.value = ''
      conversationRef.value.resetConversation()
    })
  } else {
    ElMessage.error($t('chat.pleaseSelectAcustomerService'))
  }
  employeeId.value = 0
}

const commonStore = useCommonStore()
/**
 * 链接点击去往商品详情或订单详情
 */
const domain = getDomain()
const tid = cookie.get('cloudTid')
const toProdDetail = (prodInfo, type) => {
  const routeList = commonStore.routeList
  let routeUrl = null
  if (type || prodInfo.orderFlag) {
    routeUrl = router.resolve({
      path: 'order/order-manage/order',
      query: {
        orderNumber: prodInfo.orderId,
        userId: selectedID
      }
    })
    const flag = isAuth(routeList, ['/order', '/order/order-manage', 'order'])
    if (!flag) {
      ElMessage.error('您暂时没有权限访问')
      return
    }
    routeUrl = router.resolve({
      path: '/order/order-manage/order',
      query: { orderNumber: prodInfo.orderId, ...(cookie.get(domain) ? {} : { tid }) }
    })
  } else {
    const flag = isAuth(routeList, ['/product', '/product/manage', 'list'])
    if (!flag) {
      ElMessage.error('您暂时没有权限访问')
      return
    }
    const spuName = prodInfo.spuName
    const spuId = prodInfo.spuId
    routeUrl = router.resolve({
      path: '/product/manage/list',
      query: { spuName, spuId, ...(cookie.get(domain) ? {} : { tid }) }
    })
  }
  const win = window.open(routeUrl.href, '_blank', 'noopener,noreferrer')
  if (win) win.opener = null
}

// 悟空IM
const title = ref('')
let messageStatusListener
let connectStatusListener
let messageListener
const messages = ref([])
const getWuKong = () => {
  api.registerOrLogin().then((data) => {
    // 认证信息
    const config = WKSDK.shared().config
    config.addr = import.meta.env.VITE_APP_WEBSOCKET_URL
    config.uid = data.uid // 用户uid（需要在悟空通讯端注册过）
    config.token = data.token// 用户token （需要在悟空通讯端注册过）
    WKSDK.shared().config = config
    WKSDK.shared().connect()

    // 监听连接状态
    connectStatusListener = (status) => {
      if (status === ConnectStatus.Connected) {
        title.value = '(连接成功)'
      } else {
        title.value = '(断开)'
      }
    }
    WKSDK.shared().connectManager.addConnectStatusListener(connectStatusListener)
    messageStatusListener = (ack) => {
      messages.value.forEach((m) => {
        if (m.clientSeq === ack.clientSeq) {
          m.status = ack.reasonCode === 1 ? MessageStatus.Normal : MessageStatus.Fail
        }
      })
    }
    WKSDK.shared().chatManager.addMessageStatusListener(messageStatusListener)
  })
}
const getMessageText = (m) => {
  if (m instanceof Message) {
    const streams = m.streams
    let text = ''
    if (m.content instanceof MessageText) {
      const messageText = m.content
      text = messageText.text.msg || ''
    }
    if (streams && streams.length > 0) {
      for (const stream of streams) {
        if (stream.content instanceof MessageText) {
          const messageText = stream.content
          text = text + (messageText.text.msg || '')
        }
      }
    }
    return text
  }

  return '未知消息'
}
// 同步自己业务端的频道消息列表
WKSDK.shared().config.provider.syncMessagesCallback = async (channel, opts) => {
  const resultMessages = []
  const limit = 20
  const data = await api.messageSync({
    channel_id: channel.channelID,
    channel_type: channel.channelType,
    start_message_seq: opts.startMessageSeq,
    end_message_seq: opts.endMessageSeq,
    pull_mode: opts.pullMode,
    limit
  })
  const messageList = data && data.messages
  if (messageList) {
    messageList.forEach((msg) => {
      const message = Convert.toMessage(msg)
      message.content.text = JSON.parse(message.content.text)
      message.timeStr = tsToDate(
        message.timestamp * 1000,
        'M月D日 h:m'
      )
      resultMessages.push(message)
    })

    resultMessages.length > 0 && resultMessages.reduce((prev, cur) => {
      // 将时间更换为某某月某某日 要是是当天即去掉月日
      const now = tsToDate(prev.timestamp * 1000, 'M月D日 h:m')
      const next = tsToDate(cur.timestamp * 1000, 'M月D日 h:m')
      if (
        now.slice(0, now.indexOf(' ')) ===
            next.slice(0, next.indexOf(' '))
      ) {
        cur.timeStr = tsToDate(cur.timestamp * 1000, 'h:m')
      }

      // 历史记录进行时间段显示判断
      if (resultMessages.length > 2) {
        const timeFlag = timeBeApart(prev.timestamp * 1000, cur.timestamp * 1000)
        if (timeFlag) {
          delete cur.timeStr
        }
      }
      return cur
    })
  }

  return resultMessages
}
const pulldowning = ref(false) // 下拉中
const pulldownFinished = ref(false) // 下拉完成
const pullLast = async () => {
  pulldowning.value = true
  pulldownFinished.value = false
  const msgs = await WKSDK.shared().chatManager.syncMessages(to.value, {
    limit: 15,
    startMessageSeq: 0,
    endMessageSeq: 0,
    pullMode: PullMode.Up
  })
  lastMessageSeq = msgs[msgs.length - 1]?.messageSeq || msgs[msgs.length - 2]?.messageSeq || 0
  WKSDK.shared().chatManager.removeMessageListener(messageListener)
  // 监听消息
  messageListener = (msg) => {
    if (isJSON(msg.content.text)) {
      msg.content.text = JSON.parse(msg.content.text)
    }
    const type = msg.content.text.type
    if (type === -1 && msg.channel.channelID === to.value.channelID) {
      api.getShopChannelInfo(selectedID)
    }
    const lastMessage = messages.value[messages.value.length - 1]
    if (msg.send && type !== -1 && msg.content.text.msgType !== -1 && updateAuto && (lastMessage || (lastMessage && lastMessage?.send === false))) {
      api.updateAuto(msg.channel.channelID)
      updateAuto = false
    }
    if (!msg.send && msg.content.text.sender !== 1 && msg.content.text.sender !== -1) {
      messageRemindingFn()
    }
    if (msg.channel.channelID === to.value.channelID) {
      msg.messageSeq = ++lastMessageSeq // 新发送的消息没有序列号,此处添加序列号
      api.setUnread({ channel_id: to.value.channelID, maxSeq: lastMessageSeq || 0 })
    }
    if (to.value.channelID === msg.channel.channelID) {
      if (msg.content.text.sender === 1) {
        api.getShopChannelInfo(selectedID).then((data) => {
          noAccountable = data.isWhiteUser === 1
        })
      }
      if (messages.value.length) {
        const prevTime = tsToDate(
          messages.value[messages.value.length - 1].timestamp * 1000,
          'M月D日 h:m'
        )
        const nowTime = tsToDate(new Date().getTime(), 'M月D日 h:m')
        if (prevTime.slice(0, prevTime.indexOf(' ')) === nowTime.slice(0, nowTime.indexOf(' '))) {
          msg.timeStr = tsToDate(new Date().getTime(), 'h:m')
        } else {
          msg.timeStr = tsToDate(new Date().getTime(), 'M月D日 h:m')
        }
        const timeFlag = timeBeApart(messages.value[messages.value.length - 1].timestamp * 1000, new Date().getTime())
        if (timeFlag) {
          delete msg.timeStr
        }
      } else {
        msg.timeStr = tsToDate(new Date().getTime(), 'M月D日 h:m')
      }
      if (!to.value.isEqual(msg.channel)) {
        return
      }
      messages.value.push(msg)
      scrollBottom()
    }
  }
  WKSDK.shared().chatManager.addMessageListener(messageListener)
  pulldowning.value = false

  if (msgs && msgs.length > 0) {
    msgs.forEach((m) => {
      messages.value.push(m)
    })
  }
  scrollBottom()
}
const to = ref({})
const maxReadSeq = ref(0)
let lastMessageSeq = 0
const userName = ref('')
let updateAuto = false
let selectedID = 0
let isDestroy = 0
// eslint-disable-next-line max-params
const onSelectChannel = async (channel, maxSeq, noAccount, nickName, update, userId, destroy) => {
  isDestroy = destroy
  selectedID = userId
  userName.value = nickName
  updateAuto = update
  noAccountable = noAccount === 1
  maxReadSeq.value = maxSeq
  clearMeagess()
  to.value = channel
  messages.value = []
  pullLast(channel) // 拉取最新消息
}
const pullDown = async () => {
  if (messages.value.length === 0) {
    return
  }
  const firstMsg = messages.value[0]
  if (firstMsg.messageSeq === 1) {
    pulldownFinished.value = true
    return
  }
  const limit = 15
  const msgs = await WKSDK.shared().chatManager.syncMessages(to.value, {
    limit,
    startMessageSeq: firstMsg.messageSeq - 1,
    endMessageSeq: 0,
    pullMode: PullMode.Down
  })
  if (msgs.length < limit) {
    pulldownFinished.value = true
  }
  if (msgs && msgs.length > 0) {
    msgs.reverse().forEach((m) => {
      messages.value.unshift(m)
    })
  }
  nextTick(function () {
    const chat = chatRef.value
    const firstMsgEl = document.getElementById(firstMsg.clientMsgNo)
    if (firstMsgEl) {
      chat.scrollTop = firstMsgEl.offsetTop
    }
  })
}
const handleScroll = (e) => {
  const targetScrollTop = e.target.scrollTop
  if (targetScrollTop <= 250) { // 下拉
    if (pulldowning.value || pulldownFinished.value) {
      return
    }
    pulldowning.value = true
    pullDown().then(() => {
      pulldowning.value = false
    }).catch(() => {
      pulldowning.value = false
    })
  }
}
const channelInfo = ref([])
const getChannelInfo = (m, temp) => {
  channelInfo.value = WKSDK.shared().channelManager.getChannelInfo(m.channel)// 获取频道详情(不会触发数据源的远程获取)
  let info = channelInfo.value.data.find((item) => m.fromUID === item.uid)
  if (!info) {
    info = channelInfo.value.data[0] // 客服被删除使用超管的信息
  }
  if (info) {
    return info[temp]
  }
}
const chatRef = ref(null)
const scrollBottom = () => {
  const chat = chatRef.value
  if (chat) {
    nextTick(function () {
      chat.scrollTop = chat.scrollHeight
    })
  }
}
const { proxy } = getCurrentInstance()
const channelInfoUpdate = () => {
  proxy.$forceUpdate()
}

// 监听cmd消息
const isDestroyArr = []
const cmdListener = async (msg) => {
  if (msg.content.contentObj.cmd === 'userDestroy') {
    isDestroyArr.push(msg.content.contentObj.param)
  }
  if (isJSON(msg.content.contentObj.content)) {
    msg.content.contentObj.content = JSON.parse(msg.content.contentObj.content)
    if (msg.content.contentObj.content.type === -2 && msg.channel.channelID === to.value.channelID) {
      maxReadSeq.value = msg.content.contentObj.content.content// 已读的最大序列号
    }
  }
  if (msg.content.contentObj.cmd === 'logOut' && msg.content.contentObj.param === getToken()) {
    WKSDK.shared().disconnect()
  }
}
</script>

<style lang="scss" scoped>
@use "index";
</style>
