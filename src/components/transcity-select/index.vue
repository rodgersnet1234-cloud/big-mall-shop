<template>
  <div
    class="component-transcity-select"
    @click="markClick($event)"
  >
    <el-dialog
      v-model="visible"
      :modal="false"
      width="800px"
      :title="$t('delivery.transport.chooseDeliveryArea')"
      :close-on-click-modal="false"
      destroy-on-close
      @close="closeDialog"
    >
      <main class="content-box">
        <el-scrollbar
          v-loading="loading"
          style="height:100%;"
          element-loading-text="Loading..."
        >
          <!-- 区域 -->
          <div
            v-for="region in menuList"
            :key="region.areaId"
            class="addr-region"
          >
            <div class="region-name">
              <el-checkbox
                v-model="region.checked"
                :disabled="region.disabled"
                :indeterminate="region.indeterminate"
                @change="checked=>regionChange(checked, region)"
              >
                {{ region.areaName }}
              </el-checkbox>
            </div>
            <div class="province-box">
              <!-- 省 -->
              <div
                v-for="provinceItem in region.children"
                :key="provinceItem.areaId"
                class="province-item"
              >
                <el-checkbox
                  v-model="provinceItem.checked"
                  :disabled="provinceItem.disabled"
                  :indeterminate="provinceItem.indeterminate"
                  @change="checked=>provinceChange(checked, provinceItem , region)"
                />
                <span
                  style="cursor: pointer;"
                  @click.stop="handleProvinceClick(provinceItem)"
                >
                  <span class="check-label">{{ provinceItem.areaName }}</span>
                  <span
                    v-show="provinceItem.show"
                    class="area-count"
                  >({{ provinceItem.areaCount }})</span>
                  <el-icon><ArrowDown /></el-icon>
                </span>
                <!-- 市 -->
                <div
                  v-if="provinceItem.show"
                  class="city-box bor-style"
                >
                  <div
                    v-for="(cityItem,cityIndex) in provinceItem.children"
                    :key="cityItem.areaId"
                    class="city-item"
                  >
                    <span ref="cityRef">
                      <el-checkbox
                        v-model="cityItem.checked"
                        :disabled="cityItem.disabled"
                        :indeterminate="cityItem.indeterminate"
                        @change="checked=>cityChange(checked, cityItem , provinceItem,region)"
                      />
                      <el-popover
                        :visible="cityItem.show && cityItem.children.length > 0"
                        placement="right"
                        trigger="click"
                        width="auto"
                      >
                        <template #reference>
                          <span
                            style="cursor: pointer;"
                            @click.stop="handleCityClick(provinceItem.children,cityItem,cityIndex,$event)"
                          >
                            <span
                              class="check-label"
                              :data-inx="cityIndex"
                            >{{ cityItem.areaName }}</span>
                            <span
                              v-show="provinceItem.show"
                              :data-inx="cityIndex"
                              class="area-count"
                            >({{ cityItem.areaCount }})</span>
                            <el-icon :data-inx="cityIndex"><ArrowDown /></el-icon>
                          </span>
                        </template>
                        <!-- 区 -->
                        <div
                          ref="areaBoxRef"
                          :style="areaStyle"
                          class="area-box bor-style"
                        >
                          <div
                            v-for="areaItem in cityItem.children"
                            :key="areaItem.areaId"
                          >
                            <el-checkbox
                              v-model="areaItem.checked"
                              :disabled="areaItem.disabled"
                              @change="checked=>areaChange(cityItem ,provinceItem,region)"
                            >
                              {{ areaItem.areaName }}
                            </el-checkbox>
                          </div>
                        </div>
                      </el-popover>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </main>
      <template #footer>
        <span
          v-show="!loading"
          class="dialog-footer"
        >
          <el-checkbox
            v-model="checkedAllState"
            :indeterminate="checkedAllIndeterminate"
            :disabled="checkedAllDisabled"
            @change="checkedAll"
          >{{ $t("table.checkAll") }}</el-checkbox>
          <span>
            <span class="area-num">已选择{{ checkedAreaNum }}个区域</span>
            <el-button
              type="primary"
              @click="onSubmit()"
            >{{ $t("table.submit") }}</el-button>
          </span>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/delivery/transport'

const emit = defineEmits([
  'refreshDataList', 'closeDialog'
])

const type = ref(0)
const rowIndex = ref(0)
const visible = ref(false)
const loading = ref(false)
// 全选状态
const checkedAllState = ref(false)
// 全选按钮是否禁用
const checkedAllDisabled = ref(false)
// 全选按钮不确定状态
const checkedAllIndeterminate = ref(false)
// 全选数量
const checkedAreaNum = ref(0)
const menuList = reactive([])
// 区盒定位样式
const areaStyle = reactive({
  top: '20px',
  left: '20px'
})
// 角标样式
const areaMarkStyle = reactive({
  top: '20px',
  left: '20px'
})

// 初始化
const init = (paramRowIndex, cityList, allSelectCityList, paramType, banArr) => {
  visible.value = true
  loading.value = true
  rowIndex.value = paramRowIndex
  type.value = paramType
  checkedAreaNum.value = cityList.length || 0
  if (menuList.length === 0) {
    api.listArea({}).then(data => {
      onHandleArr(menuList, treeDataTranslate(data, 'areaId', 'parentId'))
      removeChildren(menuList)
    }).then(() => {
      loading.value = false
      disabledNodes(cityList, allSelectCityList, banArr)
    })
  } else {
    loading.value = false
    disabledNodes(cityList, allSelectCityList, banArr)
  }
}

// 去除没有4级的地址
const removeChildren = (tree, level = 4) => {
  level--
  for (let i = 0; i < tree.length; i++) {
    if (!tree[i].children?.length) {
      tree.splice(i, 1)
      i--
      continue
    }
    if (level > 1) {
      tree[i].children = removeChildren(tree[i].children, level)
      if (!tree[i]?.children?.length) {
        tree.splice(i, 1)
        i--
      }
    }
  }
  return tree
}

const markClick = (e) => {
  // 点击当前弹窗外的部分关闭展开的列表
  if (e.target.className === 'el-overlay-dialog') {
    handleCheckChange(menuList, { show: false })
  }
}

// 全选
const checkedAll = (checked) => {
  checkedAllIndeterminate.value = false
  handleCheckChange(menuList, { checked, indeterminate: false })
  getAreaCheckedList()
}

// 区域复选框
const regionChange = (checked, region) => {
  region.indeterminate = false
  handleCheckChange(region.children, { checked, indeterminate: false })
  getAreaCheckedList()
  checkedAllJudge() // 放最后
}

// 省复选框
const provinceChange = (checked, province, region) => {
  province.indeterminate = false
  handleCheckChange(province.children, { checked, indeterminate: false })
  judgeChildren(region)
  getAreaCheckedList()
  checkedAllJudge() // 放最后
}

// 市复选框
const cityChange = (checked, city, province, region) => {
  city.indeterminate = false
  handleCheckChange(city.children, { checked })
  judgeChildren(province)
  judgeChildren(region)
  getAreaCheckedList()
  checkedAllJudge() // 放最后
}

// 区复选框
const areaChange = (city, province, region) => {
  judgeChildren(city)
  judgeChildren(province)
  judgeChildren(region)
  getAreaCheckedList()
  checkedAllJudge() // 放最后
}

// 检测是否全选
const checkedAllJudge = () => {
  let checkedNum = 0
  let disabledNum = 0
  const len = menuList.length
  let hasIndeterminate = false
  menuList.forEach(region => {
    region.checked && checkedNum++
    region.disabled && disabledNum++
    region.indeterminate && (hasIndeterminate = true)
  })
  // 是否为全选状态
  checkedAllState.value = checkedNum === len
  // 是否为禁用状态
  checkedAllDisabled.value = disabledNum === len
  // 是否为不确定的状态
  checkedAllIndeterminate.value = !(checkedNum === len || checkedNum === 0) || hasIndeterminate
}

// 检测其孩子列表是否全选
const judgeChildren = (parent) => {
  // 选中的个数
  let tCount = 0
  let hasIndeterminate = false
  const len = parent.children.length
  parent.children.forEach(item => {
    item.checked && tCount++
    item.indeterminate && (hasIndeterminate = true)
  })
  // 是否选择状态
  parent.checked = tCount === len
  // 是否为不确定的状态
  parent.indeterminate = !(tCount === len || tCount === 0) || hasIndeterminate
}

const handleCheckChange = (list, status) => {
  const { checked, show, indeterminate } = status
  list.forEach(item => {
    show !== undefined && (item.show = show)
    indeterminate !== undefined && (item.indeterminate = indeterminate)
    if (checked !== undefined && !item.disabled) {
      item.checked = checked
    }
    if (item.children && item.children.length > 0) {
      handleCheckChange(item.children, { checked, show, indeterminate })
    }
  })
}

// 获取被选中的区列表
const getAreaCheckedList = () => {
  const resultList = []
  menuList.forEach(region => {
    region.children.forEach(province => {
      province.children.forEach(city => {
        city.children.forEach(area => {
          if (area.checked) {
            resultList.push(area)
          }
        })
      })
    })
  })
  checkedAreaNum.value = resultList.length
  return resultList
}

// 处理省点击
const handleProvinceClick = (province) => {
  const flag = province.show
  handleCheckChange(menuList, { show: false })
  province.show = !flag
}

const handleCityClick = (cityList, curCity, cityIndex, e) => {
  handleAreaBoxShow(e, cityIndex)
  const flag = curCity.show
  cityList.forEach(item => {
    item.show = false
  })
  curCity.show = !flag
}

// 处理区地址盒子显示
const cityRef = ref()
const areaBoxRef = ref()
/**
 * 处理区级盒子显示
 * @param {*} e 当前激活节点信息
 * @param {*} index 市列表索引
 */
const handleAreaBoxShow = (e, index) => {
  // 当前点击的节点
  const nodeName = e.target.nodeName.toLowerCase()
  // 市单体所占宽度
  const offsetLeft = cityRef.value[index]?.offsetWidth
  let offsetVal = 0 // 用于计算点击箭头时区块显示的位置
  // 显示区列表的左偏移值
  if (nodeName === 'span') {
    areaStyle.left = e.clientX - e.offsetX + offsetLeft + 14 + 'px'
    areaMarkStyle.left = e.clientX - e.offsetX + offsetLeft + 9 + 'px'
  } else {
    areaStyle.left = e.clientX - e.offsetX + 28 + 'px'
    areaMarkStyle.left = e.clientX - e.offsetX + 23 + 'px'
    offsetVal = -8
  }
  nextTick(() => {
    // 加setTimeout防止有时获取到的高度为0
    setTimeout(() => {
      // 显示区列表盒子的高度
      const areaBoxH = areaBoxRef.value[index]?.offsetHeight
      // 14为角标的高度
      areaStyle.top = e.clientY - e.offsetY - areaBoxH / 2 + 18 + offsetVal + 'px'
      // 角标
      areaMarkStyle.top = e.clientY - e.offsetY + 12 + offsetVal + 'px'
    })
  })
}

const disabledNodes = (cityList, allSelectCityList, banArr) => {
  let newBanArr = []
  newBanArr = newBanArr.concat(banArr)
  if (newBanArr.length > 0) {
    for (let i = 0; i < newBanArr.length; i++) {
      if (cityList.length > 0) {
        cityList.forEach(item => {
          if (newBanArr[i] === item.areaId) {
            newBanArr.splice(i, 1)
          }
        })
      }
    }
  }
  for (let i = 0; i < menuList.length; i++) {
    let disabledNumOne = 0
    // 状态
    menuList[i].disabled = false
    menuList[i].checked = false
    menuList[i].indeterminate = false

    // 获取所有的省
    const childrenOne = menuList[i].children
    for (let j = 0; j < childrenOne.length; j++) {
      // 省下区的个数
      let provinceAreaCount = 0
      // debugger
      let disabledNumTwo = 0
      // 状态
      menuList[i].children[j].disabled = false
      menuList[i].children[j].show = false
      menuList[i].children[j].checked = false
      menuList[i].children[j].indeterminate = false
      // 获取当前省下的所有的市
      const childrenTwo = menuList[i].children[j].children
      for (let k = 0; k < childrenTwo.length; k++) {
        // 市下区的个数
        let cityAreaCount = 0
        // 状态
        menuList[i].children[j].children[k].disabled = false
        menuList[i].children[j].children[k].show = false
        menuList[i].children[j].children[k].checked = false
        menuList[i].children[j].children[k].indeterminate = false
        let disableChildCity = 0
        // 获取当前市下的所有的区
        const childArea = menuList[i].children[j].children[k].children
        for (let l = 0; l < childArea.length; l++) {
          provinceAreaCount++
          cityAreaCount++
          // 状态
          menuList[i].children[j].children[k].children[l].disabled = false
          const result = cityList.find(cityI => childArea[l].areaId === cityI.areaId)
          menuList[i].children[j].children[k].children[l].checked = !!result
          const banCity = newBanArr.findIndex((item) => item === childArea[l].areaId) > -1
          if (banCity) {
            menuList[i].children[j].children[k].children[l].disabled = true
            disableChildCity++
          }
        }
        if (disableChildCity === menuList[i].children[j].children[k].children.length) {
          menuList[i].children[j].children[k].disabled = true
          disabledNumTwo++
        }
        // 检测孩子是否全选
        judgeChildren(menuList[i].children[j].children[k])
        // 区个数
        menuList[i].children[j].children[k].areaCount = cityAreaCount
      }

      if (disabledNumTwo === menuList[i].children[j].children.length) {
        menuList[i].children[j].disabled = true
        disabledNumOne++
      }
      // 检测孩子是否全选
      judgeChildren(menuList[i].children[j])
      // 区个数
      menuList[i].children[j].areaCount = provinceAreaCount
    }
    if (disabledNumOne === menuList[i].children.length) {
      menuList[i].disabled = true
    }
    // 检测孩子是否全选
    judgeChildren(menuList[i])
  }
  // 检测是否全选
  checkedAllJudge()
}

// 表单提交
const onSubmit = () => {
  const checdNodes = getAreaCheckedList()
  emit('refreshDataList', rowIndex, checdNodes, type)
  visible.value = false
  handleCheckChange(menuList, { checked: false, show: false })
  // 重置全选按钮状态
  checkedAllState.value = false
  checkedAllIndeterminate.value = false
}

// 数组赋值
const onHandleArr = (arr, data) => {
  arr.length = 0
  arr.push(...data)
}

const closeDialog = () => {
  emit('closeDialog')
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.component-transcity-select {
  .city-item :deep(.el-popover .el-popper){
    max-height: 400px !important;
  }
  :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner){
    background-color:#fff;
  }
  :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner::before){
    background-color:#155bd4;
  }
  .content-box{
    height: 500px;

    .check-label{
      padding-left: 8px;
      padding-right: 6px;
      cursor: pointer;
    }

    .addr-region{
      display: flex;
      line-height: 32px;
      margin-bottom: 20px;

      .region-name{
        width: 100px;
      }
      .province-box{
        flex: 1;
        display: flex;
        flex-wrap: wrap;

        .province-item{
          width: 33%;
          position: relative;

          .area-count{
            color: #155bd4;
            padding-right: 6px;
          }

          .bor-style{
            border: 1px solid #eee;
            background-color: #fff;
            border-radius: 2px;
            box-shadow: 0 0 3px #ccc;
          }

          .city-box{
            min-width: 70%;
            max-height: calc(32px * 10 + 6px);
            overflow-y: auto;
            overflow-x: hidden;
            padding:3px 12px;
            position: absolute;
            left: -13px;
            z-index: 9;

            .city-item{
              position: relative;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

              .area-box{
                max-height: calc(32px * 8 + 8px);
                overflow-y: auto;
                overflow-x: hidden;
                padding: 3px 20px;
                line-height: 32px;
                position: fixed;
                background-color: #fff;
                z-index: 999;
              }
            }
          }
        }
      }
    }
  }
  .dialog-footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .area-num{
      margin-right: 12px;
    }
  }
}
</style>
