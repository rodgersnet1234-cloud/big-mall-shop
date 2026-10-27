/**
 *
 * 检测输入框为el-input的或是input
 * @param {*} node 节点信息
 * @returns 返回input的节点
 */
const onHandleNode = (node) => {
  if (/input/i.test(node.nodeName)) {
    return node
  }
  return node.querySelector('input')
}

/**
 * 处理指令修饰符所标识的规则
 * @param {*} rules 指令修饰符
 * @returns 替换规则
 */
const onHandleRule = (rules) => {
  // 只允许输入数字
  if (rules.num) {
    return /[^\d]/g
  }
  // 消除字符串两端空格，配合lazy使用达到输入完成后再消除空格
  if (rules.tirm) {
    return /(^\s*)|(\s*$)/g
  }
  return /\s/g
}

// 处理输入的内容
export const onHandleInput = {
  // value；禁止输入的规则
  updated (el, { modifiers }) {
    try {
      const inpNode = onHandleNode(el)
      const newval = inpNode.value.replace(onHandleRule(modifiers), '')
      if (inpNode.value !== newval) {
        inpNode.value = newval
        inpNode.dispatchEvent(new Event(modifiers.lazy ? 'change' : 'input'))
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  },
  // 当输入框抬起回车时，使当前元素失焦
  mounted: function (el, binding) {
    // 监听键盘抬起事件
    el.addEventListener('keyup', function (e) {
      // 判断是否是回车键
      if (e.key === 'Enter') {
        // 调用方法
        if (typeof binding.value === 'function') {
          binding.value.call(this, e)
        }
        // 使当前元素失焦
        e.target.blur()
      }
    })
  },
  beforeDestroy: function (el, binding, vnode) {
    // 可选：如果元素可能被销毁，确保移除事件监听器
    vnode.context.$once('hook:beforeDestroy', function () {
      el.removeEventListener('keyup', el._keydownHandler)
    })
  }
}
