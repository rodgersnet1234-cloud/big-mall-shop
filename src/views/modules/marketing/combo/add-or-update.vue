<template>
  <div class="combo-manage">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{
          dataForm.comboId
            ? (pageType === 1 ? '编辑套餐' : '查看套餐')
            : '新增套餐'
        }}
      </div>
    </div>
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      class="form-box"
      label-width="auto"
      @submit.prevent
    >
      <!--套餐名称-->
      <el-form-item
        :label="'套餐名称' + ':'"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          :disabled="pageType === 2"
          maxlength="20"
          show-word-limit
          style="width: 542px"
          class="giveaway-input"
          :placeholder="'套餐名称'"
        />
      </el-form-item>
      <!--活动时间-->
      <el-form-item
        :label="'活动时间'+':'"
        :required="true"
      >
        <div class="date-picker">
          <!--开始时间-->
          <el-form-item prop="startTime">
            <el-date-picker
              v-model="dataForm.startTime"
              :disabled="pageType === 2"
              type="date"
              style="width:140px"
              :placeholder="'选择开始日期'"
              value-format="YYYY-MM-DD"
              @change="onChangeTime"
            />
            <el-time-select
              v-model="startTimeValue"
              :class="[startTimeValue ? 'select-time': '']"
              start="00:00"
              step="00:30"
              end="23:30"
              style="width:114px"
              :disabled="pageType === 2"
              placeholder="开始时间"
              @change="onChangeTime"
            />
          </el-form-item>
          <span style="margin: 0 10px">至</span>
          <!--结束时间-->
          <el-form-item prop="endTime">
            <el-date-picker
              v-model="dataForm.endTime"
              :disabled="pageType === 2"
              type="date"
              style="width:140px"
              :placeholder="'选择结束日期'"
              value-format="YYYY-MM-DD"
              @change="onChangeTime"
            />
            <el-time-select
              v-model="endTimeValue"
              :class="[endTimeValue ? 'select-time': '']"
              start="00:00"
              step="00:30"
              end="23:30"
              style="width:114px"
              :disabled="pageType === 2"
              placeholder="结束时间"
              @change="onChangeTime"
            />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item
        :label="'套餐主商品' + ':'"
        :required="true"
      >
        <!--主商品表格-->
        <comboProdTable
          ref="mainProdTableRef"
          :page-type="pageType"
          :type="1"
          :limit="1"
          :mold="1"
          :not-spu-molds="[3]"
          :main-prod-id="matchProdIds"
          @refresh-select-prods="selectMainProd"
          @refresh-delete-handle="onDelete"
        />
      </el-form-item>
      <!--套餐搭配商品-->
      <el-form-item
        :label="'套餐搭配商品' + ':'"
      >
        <!--搭配商品表格-->
        <comboProdTable
          ref="matchingProdTableRef"
          :page-type="pageType"
          :type="2"
          :limit="4"
          :is-active="1"
          :ban-sku-ids="mainSkuIds"
          :main-prod-delivery-mode="mainProdDeliveryMode"
          :is-virtual="0"
          :main-prod-id="mainProdIds"
          @refresh-select-prods="selectMatchingProds"
          @refresh-delete-handle="onDelete"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          @click="back"
        >
          返回
        </el-button>
        <el-button
          v-if="pageType === 1"
          type="primary"
          @click="onSubmit"
        >
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { formatPrice } from '@/utils'
import * as api from '@/api/combo/combo'
import comboProdTable from './components/combo-prod-table.vue'
import { getDateTimeRange, getParseTime } from '@/utils/datetime'
import { ElMessage } from 'element-plus'
import { Debounce } from '@/utils/debounce'

const startTimeValue = ref('')
const endTimeValue = ref('')
// 时间选择变化时检验
const onChangeTime = () => {
  onValidateField('startTime')
  onValidateField('endTime')
}
const onValidateField = (field) => {
  dataFormRef.value?.validateField(field)
}
const validName = (rule, value, callback) => {
  if (!value.trim()) {
    callback(new Error('套餐名称不能为空'))
  } else {
    callback()
  }
}

const validateTime = (rule, value, callback) => {
  if (rule.field === 'startTime' && (!startTimeValue.value || !dataForm.startTime)) {
    callback(new Error('开始时间不能为空'))
  }
  if (rule.field === 'endTime' && (!endTimeValue.value || !dataForm.endTime)) {
    callback(new Error('结束时间不能为空'))
  }

  const startTime = dataForm.startTime + ' ' + startTimeValue.value + ':00'
  const endTime = dataForm.endTime + ' ' + endTimeValue.value + ':00'

  if (rule.field === 'startTime' && Date.parse(startTime) >= Date.parse(endTime)) {
    callback(new Error('开始时间不能大于或等于结束时间'))
  }
  if (rule.field === 'endTime' && Date.parse(startTime) >= Date.parse(endTime)) {
    callback(new Error('结束时间不能小于或等于开始时间'))
  }
  if ((dataForm.comboId === 0 || dataForm.status === 1) && rule.field === 'endTime' && new Date() > Date.parse(endTime)) {
    callback(new Error('活动结束时间不能少于当前时间'))
  }
  callback()
}
const dataRule = reactive({
  name: [
    { required: true, message: '套餐名称不能为空', trigger: 'blur' },
    { validator: validName, trigger: 'blur' }
  ],
  activityDate: [
    { required: true, message: '标题不能为空', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '开始时间不能为空', trigger: 'blur' },
    { validator: validateTime, trigger: 'blur' }
  ],
  endTime: [
    { required: true, message: '结束时间不能为空', trigger: 'blur' },
    { validator: validateTime, trigger: 'blur' }
  ]
})

const dataForm = reactive({
  comboId: 0,
  name: '',
  status: null,
  startTime: '',
  endTime: '',
  matchingProds: []
})
const pageType = ref(1) // 1：新增/编辑 2：查看
const mainSkuIds = ref([]) // 主商品skuId列表
const mainProdIds = ref([])
const matchProdIds = ref([]) // 搭配商品id列表

const route = useRoute()
onMounted(() => {
  mainProdTableRef.value?.onReset()
  matchingProdTableRef.value?.onReset()
  const comboId = route.query.comboId ? route.query.comboId : 0
  const initPageType = route.query.pageType ? route.query.pageType : 1
  init(parseInt(comboId))
  pageType.value = parseInt(initPageType)
  const title = parseInt(comboId) ? (pageType.value === 1 ? '编辑套餐' : '查看套餐') : '新增套餐'
  useCommonStore().replaceSelectMenu(title)
})

const dataFormRef = ref(null)
// 获取数据列表
const init = (comboId) => {
  dataForm.comboId = comboId || 0
  nextTick(() => {
    dataFormRef.value?.resetFields()
    const datetimeRange = getDateTimeRange()
    dataForm.startTime = datetimeRange.startTime
    dataForm.endTime = datetimeRange.endTime
    startTimeValue.value = datetimeRange.currentTime
    endTimeValue.value = datetimeRange.currentTime
    if (dataForm.comboId && dataForm.comboId !== '0') {
      getDataInfo()
    }
  })
}

const mainProdTableRef = ref(null)
const matchingProdTableRef = ref(null)
// 获取套餐信息
const getDataInfo = () => {
  api.getCombo({ comboId: dataForm.comboId }).then(data => {
    data.mainSpu.skuList?.forEach(item => {
      item.matchingPrice = formatPrice(item.matchingPrice, 1)
    })
    data.matchingSpus?.forEach(el => {
      el.skuList?.forEach(item => {
        item.matchingPrice = formatPrice(item.matchingPrice, 1)
      })
    })
    dataForm.comboId = data.comboId
    dataForm.name = data.name
    dataForm.status = data.status
    dataForm.startTime = data.startTime
    dataForm.endTime = data.endTime
    startTimeValue.value = dataForm.startTime ? dataForm.startTime.substring(11, dataForm.startTime.length - 3) : ''
    endTimeValue.value = dataForm.endTime ? dataForm.endTime.substring(11, dataForm.endTime.length - 3) : ''
    dataForm.startTime = getParseTime(dataForm.startTime, '{y}-{m}-{d}')
    dataForm.endTime = getParseTime(dataForm.endTime, '{y}-{m}-{d}')
    if (data.matchingSpus.length) {
      data.matchingSpus.forEach(item => {
        item.deliveryMode = JSON.parse(item.deliveryMode)
        matchProdIds.value.push(item.spuId)
      })
    }
    mainProdDeliveryMode.value = JSON.parse(data.mainSpu.deliveryMode)
    mainProdIds.value.push(data.mainSpuId)
    mainProdTableRef.value.init([data.mainSpu])
    matchingProdTableRef.value.init(data.matchingSpus)
  })
}

const mainProdDeliveryMode = ref({})
// 主商品选择更新回调
const selectMainProd = (prodItems) => {
  if (mainProdIds.value.length) {
    const id = mainProdIds.value.find((value) => {
      return value === prodItems[0].spuId
    })
    if (id === undefined) {
      mainProdIds.value.push(prodItems[0].spuId)
    }
  } else {
    mainProdIds.value.push(prodItems[0].spuId)
  }
  mainProdDeliveryMode.value = prodItems[0].deliveryMode
}

// 主删除商品回调
const onDelete = (id) => {
  const findIndex = mainProdIds.value.findIndex(item => {
    return item === id
  })
  mainProdIds.value.splice(findIndex, 1)
  if (findIndex === 0) {
    mainProdDeliveryMode.value = {}
  }
}

// 搭配商品选择更新回调
const selectMatchingProds = (prodItems) => {
  if (matchProdIds.value.length) {
    prodItems.forEach(item => {
      const flag = matchProdIds.value.some(itemC => {
        return item.spuId === itemC
      })
      if (!flag) {
        matchProdIds.value.push(item.spuId)
      }
    })
  } else {
    prodItems.forEach(item => {
      matchProdIds.value.push(item.spuId)
    })
  }
}
const router = useRouter()
// 表单提交
const isSubmit = ref(false)
const onSubmit = Debounce(() => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  dataFormRef.value?.validate((valid) => {
    const mainProds = mainProdTableRef.value?.verifyDataForm()
    const matchingProds = matchingProdTableRef.value?.verifyDataForm()
    if (!mainProds || !matchingProds) {
      isSubmit.value = false
      return
    }
    if (mainProds[0].leastNum <= 1 && matchingProds.length === 0) {
      ElMessage({
        message: '请选择套餐搭配商品',
        type: 'warning',
        duration: 1500
      })
      isSubmit.value = false
      return
    }
    if (valid) {
      const startTime = dataForm.startTime
      const endTime = dataForm.endTime
      dataForm.startTime = dataForm.startTime && startTimeValue.value ? dataForm.startTime + ' ' + startTimeValue.value + ':00' : ''
      dataForm.endTime = dataForm.endTime && endTimeValue.value ? dataForm.endTime + ' ' + endTimeValue.value + ':00' : ''
      const mainSpu = JSON.parse(JSON.stringify(mainProds[0]))
      const matchingSpus = JSON.parse(JSON.stringify(matchingProds))
      // 搭配单价校验：0 通过； 1：主商品中有sku的搭配价格大于原销售价  2：搭配商品中有sku的搭配价格大于原销售价
      let priceCheckFlag = 0
      mainSpu.skuList.forEach(item => {
        item.matchingPrice = formatPrice(item.matchingPrice, 0)
        if (priceCheckFlag === 0 && item.matchingPrice > item.priceFee) {
          priceCheckFlag = 1
        }
      })
      mainSpu.deliveryMode = JSON.stringify(mainSpu.deliveryMode)

      matchingSpus.forEach(el => {
        el.skuList.forEach(item => {
          item.matchingPrice = formatPrice(item.matchingPrice, 0)
          if (priceCheckFlag === 0 && item.matchingPrice > item.priceFee) {
            priceCheckFlag = 2
          }
        })
        el.deliveryMode = JSON.stringify(el.deliveryMode)
      })
      isSubmit.value = false
      if (priceCheckFlag) {
        ElMessage({
          message: (priceCheckFlag === 1 ? '主' : '搭配') + '商品的搭配单价不能高于商品现价',
          type: 'warning',
          duration: 2000
        })
        isSubmit.value = false
        return
      }
      if (dataForm.comboId) {
        api.putCombo({
          comboId: dataForm.comboId || undefined,
          name: dataForm.name,
          startTime: dataForm.startTime,
          endTime: dataForm.endTime,
          status: dataForm.status,
          mainSpu,
          matchingSpus
        }).then(() => {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              isSubmit.value = false
              router.push('/marketing/combo')
            }
          })
        }).catch(() => {
          isSubmit.value = false
        })
        dataForm.startTime = startTime
        dataForm.endTime = endTime
      } else {
        api.postCombo({
          comboId: dataForm.comboId || undefined,
          name: dataForm.name,
          startTime: dataForm.startTime,
          endTime: dataForm.endTime,
          status: dataForm.status,
          mainSpu,
          matchingSpus
        }).then(() => {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              isSubmit.value = false
              router.push('/marketing/combo')
            }
          })
        }).catch(() => {
          isSubmit.value = false
        })
      }
    } else {
      isSubmit.value = false
    }
  })
})
const back = () => {
  router.push('/marketing/combo')
}

</script>
<style lang="scss" scoped>
.combo-manage {
  padding: 20px;

  .giveaway-input {
    width: 220px;
  }

  .form-box {
    margin-left: 40px;
  }

  .date-picker {
    display: flex;
    :deep(.el-input__suffix-inner){
      display: none;
    }
    .select-time:hover :deep(.el-input__suffix-inner){
      display: inline-flex;
    }
  }

  .new-page-title {
    width: 100%;
    height: 62px;
    background: #f7f8fa;
    box-sizing: border-box;
    padding: 19px 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-bottom: 20px;

    .line{
      width: 4px;
      height: 19px;
      background: #155bd4;
      opacity: 1;
      border-radius: 2px;
      margin-right: 10px;
    }
    .text{
      font-size: 18px;
      font-weight: 700;
      color: #333;
      opacity: 1;
    }
  }
}
</style>
