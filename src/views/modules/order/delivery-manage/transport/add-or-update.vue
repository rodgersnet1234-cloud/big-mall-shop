<template>
  <el-dialog
    v-model="visible"
    :title="
      !dataForm.transportId
        ? $t('table.add')
        : $t('table.edit')
    "
    :close-on-click-modal="false"
    width="80%"
    top="8vh"
    class="page-transport-add-or-update"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      label-width="80px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        :label="$t('delivery.transport.name')"
        prop="transName"
        :rules="[
          { required: true, message: $t('delivery.transport.templateNameCannotBeEmpty') },
        ]"
      >
        <el-input
          v-model="dataForm.transName"
          maxlength="36"
          show-word-limit
          :placeholder="$t('delivery.transport.name')"
        />
      </el-form-item>
      <!-- <el-form-item
        :label="$t('delivery.transport.type')"
        prop="isFreeFee"
        required="required"
      >
        <el-radio-group
          v-model="dataForm.isFreeFee"
          @change="changeFreeFee"
        >
          <el-radio :label="0">
            {{ $t("delivery.transport.buyerPrice") }}
          </el-radio>
          <el-radio :label="1">
            {{ $t("delivery.transport.shopPrice") }}
          </el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item
        :label="$t('delivery.transport.chargePrice')"
        prop="chargeType"
      >
        <el-radio-group
          v-model="dataForm.chargeType"
          :disabled="dataForm.isFreeFee === 1"
          @change="changeChargeType"
        >
          <el-radio :label="0">
            {{ $t("delivery.transport.byCount") }}
          </el-radio>
          <el-radio :label="1">
            {{ $t("delivery.transport.byWeight") }}
          </el-radio>
          <el-radio :label="2">
            {{ $t("delivery.transport.byVolume") }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-table
        :data="dataForm.transFees"
        border
        style="width: 100%"
        header-cell-class-name="table-header"
      >
        <!-- 显示动态显示省市区 -->
        <el-table-column
          header-align="center"
          align="center"
          width="350"
          :label="$t('delivery.transport.distributableArea')"
        >
          <template #default="scope">
            <span v-if="scope.$index === 0 && dataForm.isFreeFee===1">{{
              $t("delivery.transport.allRegions")
            }}</span>
            <template v-if="dataForm.isFreeFee === 0">
              <span
                v-if="
                  (!scope.row.addrNameList || !scope.row.addrNameList.length)
                "
              >{{ $t("delivery.transport.pleaseSelectADeliveryArea") }}
              </span>
              <span>
                <el-tag
                  v-for="(city, index) in scope.row.addrNameList"
                  :key="index"
                  style="margin:4px;"
                >{{ city }}</el-tag>
              </span>
              <span class="area-button">
                <el-button
                  type="primary"
                  link
                  @click="onAddOrUpdate(`${scope.$index}`)"
                >
                  {{ $t("table.edit") }}
                </el-button>
                <el-button
                  v-if="scope.$index > 0"
                  type="primary"
                  link
                  @click="onDelete(`${scope.$index}`)"
                >
                  {{ $t("table.delete") }}
                </el-button>
              </span>
            </template>
          </template>
        </el-table-column>

        <el-table-column
          header-align="center"
          align="center"
          width="auto"
          :label="tableTitle[0]"
        >
          <template #default="scope">
            <div class="input-con">
              <el-form-item
                :prop="`transFees.${scope.$index}.firstPiece`"
                label-width="0px"
                :rules="[
                  {
                    required: true,
                    message: `${tableTitle[0]}${$t('table.noNull')}`,
                  },
                ]"
              >
                <el-input
                  v-model="scope.row.firstPiece"
                  type="number"
                  :disabled="!scope.row.status && scope.$index === 0"
                  oninput="if(value.length>11)value=value.slice(0,11)"
                  class="counting-int"
                  :min="1"
                  :max="1000000000"
                  @change="checkChargeType(scope.row,'firstPiece',dataForm.chargeType)"
                />
              </el-form-item>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="tableTitle[1]"
          width="auto"
        >
          <template #default="scope">
            <div class="input-con">
              <el-form-item
                :prop="`transFees.${scope.$index}.firstFee`"
                label-width="0px"
                :rules="[
                  {
                    required: true,
                    message: `${tableTitle[1]}${$t('table.noNull')}`,
                  },
                ]"
              >
                <el-input-number
                  v-model="scope.row.firstFee"
                  :disabled="!scope.row.status && scope.$index === 0"
                  :precision="2"
                  :min="0"
                  :max="10000000"
                />
              </el-form-item>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="tableTitle[2]"
          width="auto"
        >
          <template #default="scope">
            <div class="input-con">
              <el-form-item
                :prop="`transFees.${scope.$index}.continuousPiece`"
                label-width="0px"
                :rules="[
                  {
                    required: true,
                    message: `${tableTitle[2]}${$t('table.noNull')}`,
                  },
                ]"
              >
                <el-input
                  v-model="scope.row.continuousPiece"
                  type="number"
                  :disabled="!scope.row.status && scope.$index === 0"
                  oninput="if(value.length>11)value=value.slice(0,11)"
                  class="counting-int"
                  @change="checkChargeType(scope.row,'continuousPiece',dataForm.chargeType)"
                />
              </el-form-item>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="tableTitle[3]"
          width="auto"
        >
          <template #default="scope">
            <div class="input-con">
              <el-form-item
                :prop="`transFees.${scope.$index}.continuousFee`"
                label-width="0px"
                :rules="[
                  {
                    required: true,
                    message: `${tableTitle[3]}${$t('table.noNull')}`,
                  },
                ]"
              >
                <el-input-number
                  v-model="scope.row.continuousFee"
                  :precision="2"
                  :min="0"
                  :max="1000000000"
                  :disabled="!scope.row.status && scope.$index === 0"
                />
              </el-form-item>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="dataForm.isFreeFee === 0"
        style="margin-top: 20px"
      >
        <el-button
          type="primary"
          @click="addTransfee()"
        >
          {{ $t("delivery.transport.addAreaAndShipping") }}
        </el-button>
      </div>
      <el-checkbox
        v-if="!dataForm.isFreeFee"
        v-model="dataForm.hasFreeCondition"
        style="margin-top: 10px; font-size: 50px"
      >
        {{ $t("delivery.transport.freeShippingOnSpecifiedConditions") }}
      </el-checkbox>
      <el-table
        v-if="dataForm.hasFreeCondition && !dataForm.isFreeFee"
        :data="dataForm.transFeeFrees"
        border
        header-cell-class-name="table-header"
        style="width: 100%"
        class="condition-table"
      >
        <!-- 显示动态显示省市区 -->
        <el-table-column
          header-align="center"
          align="center"
          width="350"
          :label="$t('delivery.transport.selArea')"
        >
          <template #default="scope">
            <span
              v-if="
                !scope.row.freeAddrNameList ||
                  !scope.row.freeAddrNameList.length
              "
            >{{ $t("delivery.transport.selCity") }}</span>
            <el-tag
              v-for="(city, index) in scope.row.freeAddrNameList"
              :key="index"
              style="margin:4px;"
            >
              {{ city }}
            </el-tag>
            <span class="area-button">
              <el-button
                type="primary"
                link
                @click="addOrUpdateTransfeeFree(`${scope.$index}`)"
              >
                {{ $t("table.edit") }}
              </el-button>
              <el-button
                v-if="scope.$index > 0"
                type="primary"
                link
                @click="deleteTransfeeFree(`${scope.$index}`)"
              >
                {{ $t("table.delete") }}
              </el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="$t('delivery.transport.setShopPrice')"
        >
          <template #default="scope">
            <el-radio-group
              v-model="scope.row.freeType"
              class="condition-radio-group"
            >
              <el-radio
                :label="0"
              >
                {{ $t("delivery.transport.fullPieces")
                }}{{ $t("delivery.transport.freeShipping") }}
              </el-radio>
              <el-radio :label="1">
                {{
                  $t("delivery.transport.freeShiullAmount")
                }}
              </el-radio>
              <el-radio
                :label="2"
              >
                {{ $t("delivery.transport.fullPieces") }}{{ $t("delivery.transport.further")
                }}{{ $t("delivery.transport.freeShiullAmount") }}
              </el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <div class="condition-input-con">
              <el-form-item
                v-if="scope.row.freeType === 1 || scope.row.freeType === 2"
                :prop="`transFeeFrees.${scope.$index}.amount`"
                label-width="0px"
                :rules="[{ required: true, message: `${$t('table.noNull')}` }]"
              >
                <el-input
                  v-model="scope.row.amount"
                  style="width: 100%"
                  type="number"
                  :precision="2"
                  :min="0"
                  oninput="if(value.length>10)value=value.slice(0,10)"
                  @change="convertPrice(scope.row,'amount')"
                >
                  <template #prepend>
                    {{ $t("delivery.transport.full") }}
                  </template>
                  <template
                    #append
                  >
                    {{ $t("delivery.transport.dollar")
                    }}{{ $t("delivery.transport.freeShipping") }}
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item
                v-if="scope.row.freeType === 0 || scope.row.freeType === 2"
                :prop="`transFeeFrees.${scope.$index}.piece`"
                label-width="0px"
                :rules="[{ required: true, message: `${$t('table.noNull')}` }]"
              >
                <el-input
                  v-model="scope.row.piece"
                  style="width: 100%"
                  type="number"
                  oninput="if(value.length>10)value=value.slice(0,10)"
                  @change="checkChargeType(scope.row,'piece',dataForm.chargeType)"
                >
                  <template #prepend>
                    {{ $t("delivery.transport.full") }}
                  </template>
                  <template #append>
                    {{ $t("delivery.transport.pwvFree") }}
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="dataForm.isFreeFee === 0"
        style="margin-top: 20px"
      >
        <el-button
          v-model="dataForm.hasFreeCondition"
          type="primary"
          :disabled="!dataForm.hasFreeCondition"
          @click="addTransfeeFree()"
        >
          {{ $t("delivery.transport.clickToAddTheSpecifiedShippingConditions") }}
        </el-button>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="visible = false"
        >{{
          $t("table.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >{{
          $t("table.confirm")
        }}</el-button>
      </span>
    </template>
    <!-- 弹窗, 新增 / 修改 -->
    <transcity-select
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getDataList"
    />
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/delivery/transport'
import Big from 'big.js'
import { ElMessage } from 'element-plus'
import { Debounce } from '@/utils/debounce'

const emit = defineEmits([
  'refreshDataList'
])

const dataFormRef = ref()
const addOrUpdateRef = ref()
const hasFreeCondition = ref(0)
const visible = ref(false)
const addOrUpdateVisible = ref(false)
const editVisible = ref(false)
const dataForm = reactive({
  hasFreeCondition: false,
  transName: '',
  createTime: '',
  chargeType: 0,
  transportId: 0,
  isFreeFee: 0,
  transFees: [{ cityList: [], addrNameList: [], status: 1 }],
  transFeeFrees: [{ freeCityList: [], freeAddrNameList: [] }]
})
const transFeesSave = reactive([{ cityList: [], addrNameList: [], status: 1 }])
const areaList = reactive([])
const areaListDB = reactive([])
const transfeesBin = reactive([]) // 可配送区域运费，禁止选中列表
const transfeeFreesBin = reactive([]) // 指定条件包邮，禁止选中列表

const tableTitle = computed(() => {
  const titles = [
    [
      $t('delivery.transport.firstPiece'),
      $t('delivery.transport.transportationCost'),
      $t('delivery.transport.continuationPiece'),
      $t('delivery.transport.continuationCost')
    ],
    [
      $t('delivery.transport.firstWeight'),
      $t('delivery.transport.transportationCost'),
      $t('delivery.transport.continuedWeight'),
      $t('delivery.transport.continuationCost')
    ],
    [
      $t('delivery.transport.firstVolume'),
      $t('delivery.transport.transportationCost'),
      $t('delivery.transport.continuedVolume'),
      $t('delivery.transport.continuationCost')
    ]
  ]
  if (dataForm.chargeType) {
    return titles[dataForm.chargeType]
  }
  return titles[0]
})

watch(visible, val => {
  if (!val) {
    addOrUpdateVisible.value = false
  }
})

watch(dataForm.isFreeFee, () => {
  handleBinAreas()
}, {
  deep: true
})

const init = (id) => {
  visible.value = true
  dataForm.transportId = id || 0
  nextTick(() => {
    dataFormRef.value?.resetFields()
    onHandleDataForm({
      hasFreeCondition: false,
      transName: '',
      createTime: '',
      chargeType: 0,
      transportId: 0,
      isFreeFee: 0,
      transFees: [{ cityList: [], addrNameList: [], status: 1 }],
      transFeeFrees: [{ freeCityList: [], freeAddrNameList: [] }]
    })
    // 重置买家承担运费时的数据
    onHandlerArr(transFeesSave, [{ cityList: [], addrNameList: [], status: 1 }])
    transfeesBin.length = 0
    transfeeFreesBin.length = 0
  })
  getTransport()
}

// 收费方式切换
const changeChargeType = (type) => {
  dataForm.transFees.forEach(item => {
    item.firstPiece && checkChargeType(item, 'firstPiece', type)
    item.continuousPiece && checkChargeType(item, 'continuousPiece', type)
  })
  dataForm.transFeeFrees.forEach(item => {
    item.piece && checkChargeType(item, 'piece', type)
  })
}

// 价格格式化
const convertPrice = (row, attr) => {
  const price = +checkAmount(row[attr])
  row[attr] = price.toFixed(2)
}

// 根据收费方式格式化输入的值
const checkChargeType = (row, attr, chargeType) => {
  // 0：按件数  1：按重量  2：按体积
  if (chargeType === 0) {
    const number = getNumber(row[attr])
    row[attr] = number > 0 ? number : 1
  } else if (chargeType === 1 || chargeType === 2) {
    const price = +checkAmount(row[attr])
    row[attr] = price.toFixed(2)
  }
}

// 保留整数并小于零的数设为0
const getNumber = (num) => {
  num = Math.round(num)
  return num < 0 ? 0 : num
}

const checkAmount = (data) => {
  const reg = /^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/
  let num = data
  if (!reg.test(data)) {
    num = formatPrice(formatPrice(data), 1)
  }
  if (num < 0) {
    num = 1
  }
  return num
}

const getTransport = () => {
  if (dataForm.transportId) {
    api.get(dataForm.transportId).then(data => {
      // 获取运费模板数据
      getAreaListInfo()
      if (data.isFreeFee) {
        data.transFees[0].status = 0
      } else {
        data.transFees[0].status = 1
      }
      onHandleDataForm(data)
      dataForm.transFees.forEach(transFee => {
        transFee.continuousFee = new Big(transFee.continuousFee || 0).div(100)
        transFee.firstFee = new Big(transFee.firstFee || 0).div(100)
      })
      dataForm.transFeeFrees.forEach(element => {
        element.amount = parseFloat(new Big(element.amount || 0).div(100))
      })
      if (!dataForm.transFeeFrees.length) {
        dataForm.transFeeFrees = [{ freeCityList: [], freeAddrNameList: [] }]
      }
      dataForm.hasFreeCondition = !!data.hasFreeCondition
      handleBinAreas()
    })
  } else {
    getAreaListInfo()
    handleBinAreas()
  }
}

const getDataList = (row, cityList, type) => {
  row = row.value
  type = type.value
  if (type === 0) {
    dataForm.transFees[row].cityList = cityList
    dataForm.transFees[row].addrNameList = setAddrInfoByAreaList(cityList)
  }
  if (type === 1) {
    dataForm.transFeeFrees[row].freeCityList = cityList
    dataForm.transFeeFrees[row].freeAddrNameList = setAddrInfoByAreaList(cityList)
  }
  handleBinAreas()
}

// 获取省市区信息
const getAreaListInfo = () => {
  api.listAreaInfo().then(data => {
    onHandlerArr(areaListDB, data)
    onHandlerArr(areaList, JSON.parse(JSON.stringify(data)))
    if (dataForm.transFees.length > 0) {
      getAreaListByType(0)
    }
    if (dataForm.transFeeFrees.length > 0) {
      getAreaListByType(1)
    }
  })
}

const getAreaListByType = (type) => {
  if (type === 0) {
    for (let t = 0; t < dataForm.transFees.length; t++) {
      dataForm.transFees[t].addrNameList = setAddrInfoByAreaList(dataForm.transFees[t].cityList)
    }
  }
  if (type === 1) {
    for (let f = 0; f < dataForm.transFeeFrees.length; f++) {
      dataForm.transFeeFrees[f].freeAddrNameList = setAddrInfoByAreaList(dataForm.transFeeFrees[f].freeCityList)
    }
  }
}

// 将运费模板中的地址存入地址列表中
const setAddrInfoByAreaList = (cityList) => {
  const tempAreaList = JSON.parse(JSON.stringify(areaListDB))
  return getAreaNameList(tempAreaList, cityList)
}

// 添加运费项
const addTransfee = () => {
  editVisible.value = true
  dataForm.transFees.push({ cityList: [], status: 1 })
}

// 删除运费项
const onDelete = (rowIndex) => {
  dataForm.transFees.splice(rowIndex, 1)
  handleBinAreas()
}

// 可配送区域和运费编辑
const onAddOrUpdate = (rowIndex) => {
  addOrUpdateVisible.value = true
  let allSelectCityList = []
  for (let i = 1; i < dataForm.transFees.length; i++) {
    const cityList = dataForm.transFees[i].cityList
    allSelectCityList = allSelectCityList.concat(cityList)
  }
  nextTick(() => {
    addOrUpdateRef.value?.init(rowIndex, dataForm.transFees[rowIndex].cityList || [], allSelectCityList, 0, transfeesBin)
  })
}

// 添加指定包邮条件
const addTransfeeFree = () => {
  dataForm.transFeeFrees.push({ freeCityList: [] })
}

// 删除指定包邮条件
const deleteTransfeeFree = (rowIndex) => {
  dataForm.transFeeFrees.splice(rowIndex, 1)
  handleBinAreas()
}

// 指定包邮条件编辑
const addOrUpdateTransfeeFree = (rowIndex) => {
  addOrUpdateVisible.value = true
  let allSelectCityList = []
  for (let i = 1; i < dataForm.transFeeFrees.length; i++) {
    const freeCityList = dataForm.transFeeFrees[i].freeCityList
    allSelectCityList = allSelectCityList.concat(freeCityList)
  }
  nextTick(() => {
    addOrUpdateRef.value?.init(rowIndex, dataForm.transFeeFrees[rowIndex].freeCityList || [], allSelectCityList, 1, transfeeFreesBin)
  })
}

// 改变模板类型， 0 买家承担运费 1 卖家包邮
// const changeFreeFee = (val) => {
//   dataForm.hasFreeCondition = false
//   if (val) {
//     // 保存买家承担运费时的数据
//     onHandlerArr(transFeesSave, dataForm.transFees)
//     dataForm.chargeType = 0
//     dataForm.transFees = [{ cityList: [], status: 0, firstPiece: 1, firstFee: 0, continuousPiece: 1, continuousFee: 0 }]
//   } else {
//     dataForm.transFees = [...transFeesSave]
//     changeChargeType(dataForm.chargeType)
//   }
// }

// 验证指定区域是否设置包邮条件
const checkTransfeeFrees = () => {
  let isTrue = true
  if (dataForm.transFeeFrees.length === 0) {
    return false
  }
  if (dataForm.transFeeFrees.length > 0) {
    dataForm.transFeeFrees.forEach(element => {
      if (!element.freeType && element.freeType !== 0) {
        isTrue = false
      }
    })
  }
  return isTrue
}

// 设置不可选中
const handleBinAreas = () => {
  transfeesBin.length = 0
  transfeeFreesBin.length = 0
  const transFees = dataForm.transFees
  const transFeeFrees = dataForm.transFeeFrees
  if (transFees.length > 0) {
    transFees.forEach(i => {
      if (i.cityList.length > 0) {
        i.cityList.forEach(j => {
          if (!judgeArrHaving(transfeesBin, j)) {
            transfeesBin.push(j.areaId)
          }
        })
      }
    })
  }
  if (transFeeFrees.length > 0) {
    transFeeFrees.forEach(i => {
      if (i.freeCityList.length > 0) {
        i.freeCityList.forEach(j => {
          if (!judgeArrHaving(transfeeFreesBin, j)) {
            transfeeFreesBin.push(j.areaId)
          }
        })
      }
    })
  }
}

const judgeArrHaving = (arr, data) => {
  let isExist = false
  if (arr.length < 1) {
    return isExist
  }
  if (arr.includes(data.areaId)) {
    isExist = true
  }
  return isExist
}

const emptyCityHint = () => {
  ElMessage({
    message: $t('delivery.transport.pleaseSelectADeliveryArea'),
    type: 'error',
    duration: 1500
  })
}

// 填写信息提示
const formWriteHint = () => {
  ElMessage({
    message: $t('delivery.transport.pleaseWriteInfo'),
    type: 'error',
    duration: 1500
  })
}

// 表单提交
const onSubmit = Debounce(() => {
  dataFormRef.value?.validate((valid) => {
    if (!valid) {
      formWriteHint()
    }
    if (!dataForm.transName.trim()) {
      dataForm.transName = dataForm.transName.trim()
      return
    }
    if (valid) {
      const transFeesLen = dataForm.transFees.length || 0
      if (!transFeesLen) {
        emptyCityHint()
        return
      }
      for (let i = 0; i < transFeesLen; i++) {
        const transfee = dataForm.transFees[i]
        if (transfee.cityList.length === 0 && dataForm.isFreeFee === 0) {
          emptyCityHint()
          return
        }
      }
      if (dataForm.isFreeFee === 0 && dataForm.hasFreeCondition && !checkTransfeeFrees()) {
        ElMessage.error($t('delivery.transport.setRegionalConditions'))
        return
      }
      if (dataForm.hasFreeCondition) {
        hasFreeCondition.value = 1
      } else {
        hasFreeCondition.value = 0
      }
      const postData = JSON.parse(JSON.stringify(dataForm))
      postData.transFees.forEach(transFee => {
        transFee.continuousFee = new Big(transFee.continuousFee).times(100)
        transFee.firstFee = new Big(transFee.firstFee).times(100)
      })
      postData.transFeeFrees.forEach(element => {
        if (element.amount) {
          element.amount = new Big(element.amount).times(100)
        }
      })
      postData.hasFreeCondition = hasFreeCondition.value
      const request = dataForm.transportId ? api.update(postData) : api.save(postData)
      request.then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            dataForm.transFees[0].cityList = []
            visible.value = false
            emit('refreshDataList')
            dataFormRef.value?.resetFields()
          }
        })
      })
    }
  })
})

// 数组赋值
const onHandlerArr = (arr, data) => {
  arr.length = 0
  arr.push(...data)
}

// dataForm赋值
const onHandleDataForm = (data) => {
  dataForm.hasFreeCondition = data.hasFreeCondition
  dataForm.transName = data.transName
  dataForm.createTime = data.createTime
  dataForm.chargeType = data.chargeType
  dataForm.transportId = data.transportId
  dataForm.isFreeFee = data.isFreeFee
  dataForm.transFees = data.transFees
  dataForm.transFeeFrees = data.transFeeFrees
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.page-transport-add-or-update {
  :deep(.el-dialog) {
    margin-bottom: 8vh;
    .condition-table {
      .condition-radio-group {
        text-align: start;
        .el-radio {
          margin-bottom: 5px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      .condition-input-con {
        display: flex;
        flex-direction: column;
        align-items: center;
        &:deep(.el-form-item.el-form-item--medium:first-child) {
          padding-top: 22px;
        }
      }
    }
  }
  .input-con {
    display: flex;
    justify-content: center;
    padding-top: 22px;
    &:deep(.el-input-number--small) {
      width: auto;
    }
  }
  .area-button :deep(.el-button) {
    margin-bottom: 3px;
  }
}

</style>
