<template>
  <div class="select-goods-component">
    <template
      v-for="(item, index) in goodsList"
      :key="index"
    >
      <div class="goods-items">
        <el-image
          :src="checkFileUrl(item.imgs)"
          fit="cover"
        >
          <template #error>
            <img
              src="@/assets/images/def.png"
              alt=""
            >
          </template>
        </el-image>
        <div
          class="close-x"
          @click="handleRemove(index)"
        >
          x
        </div>
      </div>
    </template>
    <div
      v-show="addLength > goodsList.length || addLength === -1"
      class="add-btn"
      style="margin: 0 10px 10px 0;"
      @click="handleClick"
    >
      +
    </div>
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
const props = defineProps({
  addLength: { // 添加限制个数,当为-1的时候，表示可以无限添加
    type: Number,
    default: () => -1
  },
  goodsList: { // 商品列表
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['handleAddClick', 'handleRemove'])

// 添加商品
const handleClick = () => {
  if (props.addLength === -1) {
    emit('handleAddClick')
  } else {
    if (props.goodsList.length >= props.addLength) {
      return ElMessage.warning('当前添加的商品个数已达到最大个数')
    }
    emit('handleAddClick', props.goodsList.length)
  }
}
// 移除某个商品
const handleRemove = (index) => {
  emit('handleRemove', index)
}

</script>
<style lang="scss" scoped>
.select-goods-component {
    width: 100%;
    height: 100%;
    min-height: 76px;
    border: 1px dashed #EAEAF2;
    display: flex;
    align-items: center;
    padding: 10px 10px 0 10px;
    flex-wrap: wrap;
    :deep(.el-image__error) {
        font-size: 12px;
    }
    .goods-items {
        width: 50px;
        height: 50px;
        border-radius: 2px;
        margin: 0 10px 10px 0;
        position: relative;
        :deep(.el-image) {
            width: 100%;
            height: 100%;
        }
        .close-x {
            position: absolute;
            top: -6px;
            right: -6px;
            cursor: pointer;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            color: #fff;
            background: #155bd4;
            display: flex;
            align-items: center;
            font-size: 12px;
            justify-content: center;
        }
    }
    .add-btn {
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.39);
        border: 1px solid #DCDFE6;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 10px 10px 0;
        cursor: pointer;
    }
}
</style>
