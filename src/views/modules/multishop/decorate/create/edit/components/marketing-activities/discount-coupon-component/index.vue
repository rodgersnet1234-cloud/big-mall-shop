<template>
  <div class="limited-skill-container">
    <floor-title-component :config="titleConfig" />
    <div class="limited-skill-pages">
      <goods-list-component
        :config="goodsConfig"
        :current-type="true"
        :type="'discount'"
      />
    </div>
  </div>
</template>
<script setup>
import floorTitleComponent from '../../../../common-component/floor-title-component/index.vue'
import goodsListComponent from '../../../../common-component/goods-list-component/index.vue'
const props = defineProps({
  itemComponent: { // 当前组件的信息
    type: Object,
    default: () => {}
  }
})

const titleConfig = ref({ // 标题配置信息
  mainContent: {
    title: $t('pcdecorate.disCountForm.mainTitle'),
    fontSize: '16px',
    color: 'rgba(51, 51, 51, 1)'
  },
  background: 'rgba(244, 244, 244, 1)',
  marginTop: '30px',
  marginBottom: '20px',
  showMore: 0,
  moreLink: '',
  moreTextColor: 'rgba(153, 153, 153, 1)',
  showSubTitle: 0,
  subContent: {
    title: $t('pcdecorate.disCountForm.subTitle'),
    fontSize: '12px',
    color: 'rgba(153, 153, 153, 1)'
  }
})
const goodsConfig = ref({ // 商品配置信息
  showMany: 4,
  showName: 0,
  showPrice: 0,
  listTypeList: new Array(4),
  dataList: []
})
watch(() => props.itemComponent, (newVal) => {
  if (JSON.stringify(newVal.rightConfigMessage) !== '{}') {
    // 标题
    titleConfig.value = {
      mainContent: {
        title: $t('pcdecorate.disCountForm.mainTitle'),
        fontSize: newVal.rightConfigMessage.mainFontSize + 'px',
        color: newVal.rightConfigMessage.mainTextColor
      },
      background: newVal.rightConfigMessage.bgColor,
      marginTop: newVal.rightConfigMessage.marginTop + 'px',
      marginBottom: newVal.rightConfigMessage.marginBottom + 'px',
      showMore: 0, // 是否展示查看更多
      moreLink: '', // 查看更多的链接
      moreTextColor: '#999', // 查看更多的文字颜色
      showSubTitle: newVal.rightConfigMessage.showSubTitle, // 是否展示副标题
      subContent: {
        title: newVal.rightConfigMessage.subTitle, // 副标题的内容
        fontSize: newVal.rightConfigMessage.subFontSize + 'px', // 副标题的大小
        color: newVal.rightConfigMessage.subTextColor // 副标题的文字颜色
      }
    }
    // 商品列表
    goodsConfig.value = {
      showMany: 4,
      showName: newVal.rightConfigMessage.showContent.find(item => Number(item) === 0) ? 0 : 1,
      showPrice: newVal.rightConfigMessage.showContent.find(item => Number(item) === 1) ? 0 : 1,
      listTypeList: new Array(4),
      dataList: newVal.rightConfigMessage.goodsList
    }
  } else {
    titleConfig.value = {
      mainContent: {
        title: '优惠团购',
        fontSize: '24px',
        color: 'rgba(51, 51, 51, 1)'
      },
      subContent: {
        title: '好物推荐，一起拼团',
        fontSize: '12px',
        color: 'rgba(153, 153, 153, 1)'
      },
      showSubTitle: 0, // 是否展示副标题
      background: 'rgba(244, 244, 244, 1)', // 背景颜色
      marginTop: '30px', // 上边距
      marginBottom: '20px', // 下边距
      showMore: 0, // 是否展示更多
      path: {
        link: '', // 更多的链接
        name: '',
        type: ''
      },
      moreTextColor: 'rgba(153, 153, 153, 1)' // 查看更多的文字颜色
    }
    // 商品列表
    goodsConfig.value = {
      showMany: 4, // 一行展示多少个商品
      showName: 0, // 是否展示商品名称
      showPrice: 0, // 是否展示商品价格
      listTypeList: new Array(4),
      dataList: []
    }
  }
}, {
  immediate: true,
  deep: true
})

</script>
<style lang="scss" scoped>
.limited-skill-container {
    width: 100%;
    overflow: hidden;
    .limited-skill-pages {
        margin: 0 auto;
    }
}
</style>
