import { Conversation, Setting, WKSDK, Message, StreamItem, Channel, MessageStatus, MessageExtra } from 'wukongimjssdk'

import BigNumber from 'bignumber.js'
import { Buffer } from 'buffer'
export class Convert {
  static toMessage (msgMap) {
    const message = new Message()
    if (msgMap.message_idstr) {
      message.messageID = msgMap.message_idstr
    } else {
      message.messageID = new BigNumber(msgMap.messageId).toString()
    }
    if (msgMap.header) {
      message.header.reddot = msgMap.header.redDot === 1
    }
    if (msgMap.setting) {
      message.setting = Setting.fromUint8(msgMap.setting)
    }
    if (msgMap.revoke) {
      message.remoteExtra.revoke = msgMap.revoke === 1
    }
    if (msgMap.message_extra) {
      const messageExtra = msgMap.message_extra
      message.remoteExtra = this.toMessageExtra(messageExtra)
    }

    message.clientSeq = msgMap.client_seq
    message.channel = new Channel(msgMap.channelId, msgMap.channelType)
    message.messageSeq = msgMap.messageSeq
    message.clientMsgNo = msgMap.clientMsgNo
    message.streamNo = msgMap.stream_no
    message.streamFlag = msgMap.stream_flag
    message.fromUID = msgMap.fromUid
    message.timestamp = msgMap.timestamp
    message.status = MessageStatus.Normal
    message.pic = msgMap.pic
    message.nickName = msgMap.nickName
    const decodedBuffer = Buffer.from(msgMap.payload, 'base64')
    const contentObj = JSON.parse(decodedBuffer.toString('utf8'))
    let contentType = 0
    if (contentObj) {
      contentType = contentObj.type
    }
    const messageContent = WKSDK.shared().getMessageContent(contentType)
    if (contentObj) {
      messageContent.decode(this.stringToUint8Array(JSON.stringify(contentObj)))
    }
    message.content = messageContent

    message.isDeleted = msgMap.is_deleted === 1

    const streamMaps = msgMap.streams
    if (streamMaps && streamMaps.length > 0) {
      const streams = []
      for (const streamMap of streamMaps) {
        const streamItem = new StreamItem()
        streamItem.clientMsgNo = streamMap.clientMsgNo
        streamItem.streamSeq = streamMap.stream_seq
        if (streamMap.blob && streamMap.blob.length > 0) {
          const blob = Buffer.from(streamMap.blob, 'base64')
          const blobObj = JSON.parse(blob.toString('utf8'))
          const blobContent = WKSDK.shared().getMessageContent(contentType)
          if (blobObj) {
            blobContent.decode(this.stringToUint8Array(JSON.stringify(blobObj)))
          }
          streamItem.clientMsgNo = streamMap.clientMsgNo
          streamItem.streamSeq = streamMap.stream_seq
          streamItem.content = blobContent
        }
        streams.push(streamItem)
      }
      message.streams = streams
    }

    return message
  }

  static toConversation (conversationMap) {
    const conversation = new Conversation()
    conversation.channel = new Channel(conversationMap.channelId, conversationMap.channelType)
    conversation.unread = conversationMap.unread || 0
    conversation.timestamp = conversationMap.timestamp || 0
    conversation.nickName = conversationMap.nickName
    conversation.pic = conversationMap.pic
    conversation.userId = conversationMap.userId
    conversation.isDestroy = conversationMap.isDestroy
    conversation.lastMsgSeq = conversationMap.lastMsgSeq
    const recents = conversationMap.recents
    if (recents && recents.length > 0) {
      const messageModel = this.toMessage(recents[0])
      conversation.lastMessage = messageModel
    }
    conversation.extra = {}

    return conversation
  }

  static toMessageExtra (msgExtraMap) {
    const messageExtra = new MessageExtra()
    if (msgExtraMap.message_id_str) {
      messageExtra.messageID = msgExtraMap.message_id_str
    } else {
      messageExtra.messageID = new BigNumber(msgExtraMap.messageId).toString()
    }
    messageExtra.messageSeq = msgExtraMap.messageSeq
    messageExtra.readed = msgExtraMap.readed === 1
    if (msgExtraMap.readed_at && msgExtraMap.readed_at > 0) {
      messageExtra.readedAt = new Date(msgExtraMap.readed_at)
    }
    messageExtra.revoke = msgExtraMap.revoke === 1
    if (msgExtraMap.revoker) {
      messageExtra.revoker = msgExtraMap.revoker
    }
    messageExtra.readedCount = msgExtraMap.readed_count || 0
    messageExtra.unreadCount = msgExtraMap.unread_count || 0
    messageExtra.extraVersion = msgExtraMap.extra_version || 0
    messageExtra.editedAt = msgExtraMap.edited_at || 0

    const contentEditObj = msgExtraMap.content_edit
    if (contentEditObj) {
      const contentEditContentType = contentEditObj.type
      const contentEditContent = WKSDK.shared().getMessageContent(contentEditContentType)
      const contentEditPayloadData = this.stringToUint8Array(JSON.stringify(contentEditObj))
      contentEditContent.decode(contentEditPayloadData)
      messageExtra.contentEditData = contentEditPayloadData
      messageExtra.contentEdit = contentEditContent

      messageExtra.isEdit = true
    }

    return messageExtra
  }

  static stringToUint8Array (str) {
    const newStr = unescape(encodeURIComponent(str))
    const arr = []
    for (let i = 0, j = newStr.length; i < j; ++i) {
      arr.push(newStr.charCodeAt(i))
    }
    const tmpUint8Array = new Uint8Array(arr)
    return tmpUint8Array
  }
}
