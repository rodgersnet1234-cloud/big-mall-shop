<template>
  <div class="spu-catagory-attrs-component">
    <div class="part-section">
      <div
        v-for="(attrs, attrIdx) in attrsList"
        :key="attrIdx"
        class="part-sec-item"
      >
        <div class="flx">
          <div class="sec-tit">
            <span
              v-if="attrs.searchType == 1"
              class="stars-icon"
            >*</span>
            <span class="name">{{ attrs.name }}</span>
          </div>
          <el-select
            v-if="attrs.attrValues && attrs.attrValues.length > 0"
            v-model="attrs.attrValue"
            :disabled="disabled"
            :clearable="attrs.searchType !== 1"
            placeholder="请选择"
            style="min-width: 150px; width: 60%"
            @change="getValueOfBasicAttrs(attrs, 0)"
          >
            <el-option
              v-for="item in attrs.attrValues"
              :key="item.attrValueId"
              :label="item.value"
              :value="item.attrValueId"
            />
          </el-select>
          <el-input
            v-else
            v-model="attrs.attrValue"
            :disabled="disabled"
            :clearable="attrs.searchType !== 1"
            :placeholder="'请输入' + attrs.name"
            maxlength="20"
            style="min-width: 150px; width: 60%"
            @change="getValueOfBasicAttrs(attrs, 1)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const props = defineProps({
  attrsList: {
    type: Array,
    default () {
      return []
    }
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['getValueOfBasicAttrs'])

const getValueOfBasicAttrs = (attrs, st) => {
  // 检查必填输入框是否为空
  if (st === 1 && attrs.searchType === 1 && !attrs.attrValue) {
    ElMessage({
      message: '当前属性为必填属性，请填写属性值！',
      duration: 1500
    })
    return
  }
  emit('getValueOfBasicAttrs', props.attrsList, attrs, st)
}

</script>

<style lang="scss" scoped>
.spu-catagory-attrs-component {
  .part-section {
    background: #f9f9f9;
    padding: 20px;
    padding-bottom: 0;
    text-align: left;
    width: 680px;
    max-width: 100%;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .part-sec-item {
      display: inline-block;
      width: 48%;
      margin-bottom: 20px;
      margin-right: 10px;
      .flx {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .sec-tit {
          position: relative;
          margin-right: 15px;
          text-align: right;
          line-height: 1.5em;
          width: 100px;
          // 三角形样式
          .stars-icon {
            color: #ff4949;
            margin-right: 2px;
          }
        }
      }

    }
    .part-sec-item:nth-child(2n) {
      margin-right: 0;
    }
  }
}
</style>
