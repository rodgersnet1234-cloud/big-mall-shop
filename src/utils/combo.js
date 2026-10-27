/**
 * 处理返回的订单商品数据
 * 备注：activityType-判断是否为组合商品关联的子商品
 * @param array 商品列表
 * @returns {*}
 */
const handleOrderItems = (array) => {
  const activityList = array.filter(i => i.activityType === 6)
  const aResult = array.filter(i => i.activityType !== 6)

  aResult.forEach(item => {
    if (item.spuMold && item.spuMold === 2) {
      item.comboItemList = activityList.filter(i => i.activityId === item.orderItemId)
    } else {
      item.comboItemList = null
    }
  })

  return aResult
}

/**
 * 根据所传数组及 key,计算并返回总和
 * @param list 数组
 * @param priceKey 数据 列：价格
 * @param countKey 数量
 * @returns {number}
 */
const countComboPrice = (list, priceKey, countKey) => {
  let s = 0
  for (let i = 0; i < list.length; i++) {
    if (list[i][priceKey]) {
      s += parseFloat(list[i][priceKey] * list[i][countKey])
    }
  }
  s = s.toFixed(3) * 1000 / 1000
  return s || 0
}

export {
  handleOrderItems,
  countComboPrice
}
