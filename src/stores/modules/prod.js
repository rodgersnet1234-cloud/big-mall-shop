import { defineStore } from 'pinia'

export const useProdStore = defineStore('prod', {
  state: () => {
    return {
      id: 0,
      skuTags: [],
      prodCategory: {},
      platProdCategory: {},
      storeProdCategory: {},
      defalutSku: {
        priceFee: 0.01, // 销售价
        marketPriceFee: 0.01, // 市场价
        stock: 0, // 库存
        attrs: '', // 销售属性组合字符串
        skuName: '', // sku名称
        prodName: '', // 商品名称
        partyCode: '', // 商品编码
        spuPartyCode: '', // 供应商商品编码
        weight: 0, // 商品重量
        volume: 0, // 商品体积
        status: 1, // 0 禁用 1 启用
        stockWarning: null, // 库存预警
        isSell: null // 是否可卖 0不可售，1可售
      }
    }
  },
  actions: {
    updateSkuTags (skuTags) {
      this.skuTags = skuTags
    },
    updateSkuTag ({ skuTag, index }) {
      index = parseInt(index)
      if (skuTag && typeof index === 'number') {
        this.skuTags.splice(index, 1, skuTag)
      }
    },
    addSkuTag (skuTag) {
      this.skuTags.push(skuTag)
    },
    addProdCategory (prodCategory) {
      this.prodCategory = prodCategory
    },
    addPlatProdCategory (platProdCategory) {
      this.platProdCategory = platProdCategory
    },
    updatePlatProdCategory ({ platProdCategory, selectUpdate }) {
      if (selectUpdate) {
        // 选择更新
        if (platProdCategory.firstCat) {
          this.platProdCategory.firstCat = platProdCategory.firstCat
        }
        if (platProdCategory.secondCat) {
          this.platProdCategory.secondCat = platProdCategory.secondCat
        }
        if (platProdCategory.threeCat) {
          this.platProdCategory.threeCat = platProdCategory.threeCat
        }
        if (platProdCategory.composeType) {
          this.platProdCategory.composeType = platProdCategory.composeType
        }
      } else {
        // 全部更新
        this.platProdCategory = platProdCategory
      }
    },
    addStoreProdCategory (storeProdCategory) {
      this.storeProdCategory = storeProdCategory
    },
    updateStoreProdCategory ({ storeProdCategory, selectUpdate }) {
      if (selectUpdate) {
        // 选择更新
        if (storeProdCategory.firstCat) {
          this.storeProdCategory.firstCat = storeProdCategory.firstCat
        }
        if (storeProdCategory.composeType) {
          this.storeProdCategory.composeType = storeProdCategory.composeType
        }
      } else {
        this.storeProdCategory = storeProdCategory
      }
    },
    removeSkuTag (tagIndex) {
      this.skuTags.splice(tagIndex, 1)
      // if (!tagIndex) {
      //   this.skuTags = []
      // }
    },
    removeSkuTagItem ({ tagIndex, tagItemIndex }) {
      this.skuTags[tagIndex].tagItems.splice(tagItemIndex, 1)
    },
    addSkuTagItem ({ tagIndex, tagItem }) {
      this.skuTags[tagIndex].tagItems.push(tagItem)
      // this.skuTags[tagIndex].tagItems.splice(tagItemIndex, 0, tagItem)
    },
    updateSkuTagItem ({ skuTagItem, tagIndex, tagItemIndex }) {
      if (skuTagItem) {
        this.skuTags[tagIndex].tagItems.splice(tagItemIndex, 1, skuTagItem)
      }
    }
  }
})
