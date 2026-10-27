export class ConversationWrap {
  conversation
  constructor (conversation) {
    this.conversation = conversation
  }

  avatarHashTag
  // channel: Channel;
  // private _channelInfo;
  // unread: number;
  // timestamp: number;
  // lastMessage: Message;
  // isMentionMe: boolean;
  // constructor();
  // get channelInfo(): ChannelInfo;
  // isEqual(c: Conversation): boolean;

  get channel () {
    return this.conversation.channel
  }

  get channelInfo () {
    return this.conversation.channelInfo
  }

  get nickName () {
    return this.conversation.nickName
  }

  get pic () {
    return this.conversation.pic
  }

  get isDestroy () {
    return this.conversation.isDestroy
  }

  get lastMsgSeq () {
    return this.conversation.lastMsgSeq
  }

  get shopId () {
    return this.conversation.shopId
  }

  get userId () {
    return this.conversation.userId
  }

  get unread () {
    return this.conversation.unread
  }

  get timestamp () {
    return this.conversation.timestamp
  }

  set timestamp (timestamp) {
    this.conversation.timestamp = timestamp
  }

  get timestampString () {
    return getTimeStringAutoShort2(this.timestamp * 1000, true)
  }

  get lastMessage () {
    return this.conversation.lastMessage
  }

  set lastMessage (lastMessage) {
    this.conversation.lastMessage = lastMessage
  }

  get isMentionMe () {
    return this.conversation.isMentionMe
  }

  get remoteExtra () {
    return this.conversation.remoteExtra
  }

  set isMentionMe (isMentionMe) {
    this.conversation.isMentionMe = isMentionMe
  }

  get reminders () {
    return this.conversation.reminders
  }

  get simpleReminders () {
    return this.conversation.simpleReminders
  }

  reloadIsMentionMe () {
    return this.conversation.reloadIsMentionMe()
  }

  get extra () {
    if (!this.conversation.extra) {
      this.conversation.extra = {}
    }
    return this.conversation.extra
  }

  isEqual (c) {
    return this.conversation.isEqual(c.conversation)
  }
}

function getTimeStringAutoShort2 (timestamp, mustIncludeTime) {
  // 当前时间
  const currentDate = new Date()
  // 目标判断时间
  const srcDate = new Date(timestamp)

  const currentYear = currentDate.getFullYear()
  const currentMonth = (currentDate.getMonth() + 1)
  const currentDateD = currentDate.getDate()

  const srcYear = srcDate.getFullYear()
  const srcMonth = (srcDate.getMonth() + 1)
  const srcDateD = srcDate.getDate()

  let ret = ''

  // 要额外显示的时间分钟
  const timeExtraStr = (mustIncludeTime ? ' ' + _formatDate(srcDate, 'hh:mm') : '')

  // 当年
  if (currentYear === srcYear) {
    const currentTimestamp = currentDate.getTime()
    const srcTimestamp = timestamp
    // 相差时间（单位：毫秒）
    const deltaTime = (currentTimestamp - srcTimestamp)

    // 当天（月份和日期一致才是）
    if (currentMonth === srcMonth && currentDateD === srcDateD) {
      // 时间相差60秒以内
      if (deltaTime < 60 * 1000) {
        ret = '刚刚'
      } else { // 否则当天其它时间段的，直接显示“时:分”的形式
        ret = _formatDate(srcDate, 'hh:mm')
      }
    } else { // 当年 && 当天之外的时间（即昨天及以前的时间）
      // 昨天（以“现在”的时候为基准-1天）
      const yesterdayDate = new Date()
      yesterdayDate.setDate(yesterdayDate.getDate() - 1)

      // 前天（以“现在”的时候为基准-2天）
      const beforeYesterdayDate = new Date()
      beforeYesterdayDate.setDate(beforeYesterdayDate.getDate() - 2)

      // 用目标日期的“月”和“天”跟上方计算出来的“昨天”进行比较，是最为准确的（如果用时间戳差值
      // 的形式，是不准确的，比如：现在时刻是2019年02月22日1:00、而srcDate是2019年02月21日23:00，
      // 这两者间只相差2小时，直接用“deltaTime/(3600 * 1000)” > 24小时来判断是否昨天，就完全是扯蛋的逻辑了）
      if (srcMonth === (yesterdayDate.getMonth() + 1) && srcDateD === yesterdayDate.getDate()) {
        ret = '昨天' + timeExtraStr // -1d
      } else if (srcMonth === (beforeYesterdayDate.getMonth() + 1) && srcDateD === beforeYesterdayDate.getDate()) {
        ret = '前天' + timeExtraStr// -2d // “前天”判断逻辑同上
      } else {
        // 跟当前时间相差的小时数
        const deltaHour = (deltaTime / (3600 * 1000))

        // 如果小于或等 7*24小时就显示星期几
        if (deltaHour <= 7 * 24) {
          const weekday = new Array(7)
          weekday[0] = '星期日'
          weekday[1] = '星期一'
          weekday[2] = '星期二'
          weekday[3] = '星期三'
          weekday[4] = '星期四'
          weekday[5] = '星期五'
          weekday[6] = '星期六'

          // 取出当前是星期几
          const weedayDesc = weekday[srcDate.getDay()]
          ret = weedayDesc + timeExtraStr
        } else {
          ret = _formatDate(srcDate, 'yyyy/M/d') + timeExtraStr
        } // 否则直接显示完整日期时间
      }
    }
  } else {
    ret = _formatDate(srcDate, 'yyyy/M/d') + timeExtraStr // 往年
  }

  return ret
};

// eslint-disable-next-line no-var
var _formatDate = function (date, fmt) {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}
