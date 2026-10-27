<template>
  <div class="goods-list-container">
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.goodsList.listStyle`) }}
      </div>
      <div class="bottom-content">
        <div class="goods-list-style">
          <div
            :class="{'style-items': true, 'active': goodsForm.listType === 3 }"
            @click="handleClick(3)"
          >
            <img
              v-show="goodsForm.listType !== 3"
              src="@/assets/pc-micro-page/goods_list_three.png"
              alt="图片加载失败"
            >
            <img
              v-show="goodsForm.listType === 3"
              src="@/assets/pc-micro-page/goods_list_three_active.png"
              alt="图片加载失败"
            >
            <el-icon
              v-show="goodsForm.listType === 3"
              class="el-icon-check"
            >
              <Check />
            </el-icon>
          </div>
          <div
            :class="{'style-items': true, 'active': goodsForm.listType === 4 }"
            @click="handleClick(4)"
          >
            <img
              v-show="goodsForm.listType !== 4"
              src="@/assets/pc-micro-page/goods_list_four.png"
              alt="图片加载失败"
            >
            <img
              v-show="goodsForm.listType === 4"
              src="@/assets/pc-micro-page/goods_list_four_active.png"
              alt="图片加载失败"
            >
            <el-icon
              v-show="goodsForm.listType === 4"
              class="el-icon-check"
            >
              <Check />
            </el-icon>
          </div>
          <div
            :class="{'style-items': true, 'active': goodsForm.listType === 5 }"
            @click="handleClick(5)"
          >
            <img
              v-show="goodsForm.listType !== 5"
              src="@/assets/pc-micro-page/goods_list_five.png"
              alt="图片加载失败"
            >
            <img
              v-show="goodsForm.listType === 5"
              src="@/assets/pc-micro-page/goods_list_five_active.png"
              alt="图片加载失败"
            >
            <el-icon
              v-show="goodsForm.listType === 5"
              class="el-icon-check"
            >
              <Check />
            </el-icon>
          </div>
        </div>
        <el-radio-group
          v-model="goodsForm.listType"
          style="display: flex;margin-top: 15px;justify-content: space-around"
        >
          <el-radio
            :label="3"
          >
            {{ $t(`pcdecorate.goodsList.three`) }}
          </el-radio>
          <el-radio
            :label="4"
          >
            {{ $t(`pcdecorate.goodsList.four`) }}
          </el-radio>
          <el-radio
            :label="5"
          >
            {{ $t(`pcdecorate.goodsList.five`) }}
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="config-items">
      <div class="title special-title">
        {{ $t(`pcdecorate.goodsList.showContent`) }}
      </div>
      <div class="bottom-content">
        <el-checkbox-group
          v-model="goodsForm.showContent"
          style="display: flex;"
        >
          <el-checkbox
            label="0"
            style="width: 33.3%;text-align: center"
          >
            {{ $t(`pcdecorate.goodsList.goodsName`) }}
          </el-checkbox>
          <el-checkbox
            label="1"
            style="width: 33.3%;text-align: center"
          >
            {{ $t(`pcdecorate.goodsList.goodsPrice`) }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="config-items">
      <div class="title special-title">
        {{ $t(`pcdecorate.goodsList.goods`) }}
      </div>
      <select-goods-component
        :goods-list="goodsForm.goodsList"
        @handle-add-click="handleAddClick"
        @handle-remove="handleRemove"
      />
    </div>
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :current-select-type="[1]"
      :is-mulilt="true"
      :echo-data-list="echoDataList"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>
<script setup>
import selectGoodsComponent from '../../../../../common-component/select-goods-component/index.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue' // 选择商品

const props = defineProps({
  currentRef: { // 当前组件的Ref
    type: String,
    default: () => ''
  },
  currentItem: { // 点击当前组件回显信息配置
    type: Object,
    default: () => {}
  },
  editItem: { // 当前组件的配置信息
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['handleUpdateMessage'])
const goodsForm = ref({
  listType: 3,
  showContent: ['0', '1'], // 显示内容
  goodsList: [] // 商品列表
})
watch(() => goodsForm.value, (newVal) => { // 监听配置信息的改变
  const obj = {
    type: 'goods_list',
    ref: props.currentRef,
    config: newVal
  }
  emit('handleUpdateMessage', obj)
}, { deep: true })
watch(() => props.currentItem, (newVal) => { // 监听组件回显
  if (newVal.currentConfigType === 'goods_list') {
    if (JSON.stringify(newVal.config) !== '{}') {
      goodsForm.value = { ...newVal.config }
    } else {
      goodsForm.value = {
        listType: 3,
        showContent: ['0', '1'], // 显示内容
        goodsList: [] // 商品列表
      }
    }
  }
})

// 点击列表样式
const handleClick = (val) => {
  goodsForm.value.listType = val
}
// 添加商品
const dialogVisible = ref(false) // 商品弹窗显示隐藏
const echoDataList = ref([]) // 回显商品数据
const handleAddClick = () => {
  dialogVisible.value = true
  echoDataList.value = []
  goodsForm.value.goodsList.forEach(item => {
    echoDataList.value.push(item)
  })
}
// 移除某个商品
const handleRemove = (index) => {
  goodsForm.value.goodsList.splice(index, 1)
}
// 商品弹窗关闭
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 商品弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '1') { // 表示当前选择的是商品
    goodsForm.value.goodsList = []
    value.goodsItem.forEach(item => {
      goodsForm.value.goodsList.push({
        name: item.spuName || item.name, // 商品名称
        id: item.spuId || item.id, // 商品id
        prodType: item.spuType || item.prodType, // 商品类型
        status: item.spuStatus || item.status, // 商品状态
        price: item.priceFee || item.price, // 商品价格
        imgs: item.mainImgUrl || item.imgs, // 商品图片
        description: item.sellingPoint || item.description, // 商品描述
        orignPrice: item.marketPriceFee || item.orignPrice // 商品原价
      })
    })
  }
  dialogVisible.value = false
}
// 验证信息
const handleValidate = () => {
  let status = true
  let message = ''
  if (JSON.stringify(props.editItem) === '{}') {
    status = false
    message = $t('pcdecorate.goodsList.warning1')
  } else if (props.editItem.goodsList.length === 0) {
    status = false
    message = $t('pcdecorate.goodsList.warning2')
  } else {
    status = true
  }
  return {
    status,
    message
  }
}
defineExpose({ handleValidate })

</script>
<style lang="scss" scoped>
.goods-list-container {
    .config-items {
        .title {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
            font-family: Microsoft YaHei,sans-serif;
            margin-left: 0 !important;
            &.special-title {
                margin-top: 20px;
            }
        }
        .title::before {
          width: 0 !important;
        }
        .bottom-content {
            .goods-list-style {
                display: flex;
                justify-content: space-between;
                .style-items {
                    width: 108px;
                    height: 70px;
                    border: 1px solid #EAEAF2;
                    border-radius: 2px;
                    padding: 6px;
                    cursor: pointer;
                    &.active {
                        border-color: #155BD4;
                        position: relative;
                        &::before {
                            content: '';
                            position: absolute;
                            width: 0;
                            height: 0;
                            border-top: 20px solid transparent;
                            border-right: 20px solid #155BD4;
                            bottom: 0;
                            right: 0;
                        }
                        .el-icon-check {
                            position: absolute;
                            color: #fff;
                            right: 0;
                            bottom: -1px;
                            font-size: 12px;
                            transform: scale(0.8);
                        }
                    }
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
}
</style>
