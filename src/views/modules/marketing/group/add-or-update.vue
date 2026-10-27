<template>
  <div class="group-manage">
    <el-dialog
      v-model="visible"
      :title="title"
      :before-close="onReset"
      :close-on-click-modal="false"
      width="800px"
    >
      <el-form
        ref="dataFormRef"
        :rules="dataRule"
        :model="dataForm"
        label-width="130px"
        @submit.prevent
      >
        <!-- 活动名称 -->
        <el-form-item
          :label="$t('group.activityName')"
          prop="activityName"
        >
          <el-input
            v-model="dataForm.activityName"
            style="width:534px"
            maxlength="26"
            show-word-limit
            :disabled="dataForm.status > 0 && dataForm.status !== 5"
          />
        </el-form-item>
        <!-- 活动开始时间（活动状态：未开始、经行中、已结束） -->
        <el-form-item
          :label="$t('group.startTime')"
          prop="startTime"
        >
          <el-date-picker
            v-model="dataForm.startTime"
            :disabled="dataForm.status ? dataForm.status > 0 : false"
            value-format="YYYY-MM-DD"
            type="date"
            class="date-picker"
            style="width:130px"
            :placeholder="'活动开始'"
          />
          <el-time-select
            v-model="startTimeValue"
            :class="[startTimeValue ? 'select-time': '']"
            start="00:00"
            step="00:30"
            end="23:30"
            style="width:120px"
            placeholder="开始时间"
            :disabled="dataForm.status ? dataForm.status > 0 : false"
            @blur="onChangeTime"
          />
          <span style="margin: 0 10px">至</span>
          <el-date-picker
            v-model="dataForm.endTime"
            :disabled="dataForm.status ? dataForm.status === 4 : false"
            value-format="YYYY-MM-DD"
            type="date"
            class="date-picker"
            style="width:130px"
            :placeholder="'活动结束'"
          />
          <el-time-select
            v-model="endTimeValue"
            :class="[endTimeValue ? 'select-time': '']"
            start="00:00"
            step="00:30"
            end="23:30"
            style="width:120px"
            :disabled="dataForm.status ? dataForm.status === 4 : false"
            placeholder="结束时间"
            @blur="onChangeTime"
          />
        </el-form-item>
        <!-- 成团人数 -->
        <el-form-item
          :label="$t('group.groupNumber')"
          prop="groupNumber"
        >
          <el-input
            v-model="dataForm.groupNumber"
            type="number"
            :min="2"
            :max="1000000000"
            :disabled="dataForm.status > 0"
            class="groupActivity-input"
            style="width:534px"
            @change="groupNumCheck"
          >
            <template #append>
              {{ $t("group.people") }}
            </template>
          </el-input>
        </el-form-item>
        <!-- 商品是否限购（1:限购、0:不限购） -->
        <el-form-item
          :label="$t('group.hasMaxNum')"
          prop="hasMaxNum"
        >
          <el-radio-group
            v-model="dataForm.hasMaxNum"
            :disabled="
              dataForm.status
                ? dataForm.status > 0 && dataForm.status !== 5
                : false
            "
          >
            <el-radio :label="0">
              {{ $t("group.close") }}
            </el-radio>
            <el-radio :label="1">
              {{ $t("group.open") }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 限购数量 -->
        <el-form-item
          v-if="dataForm.hasMaxNum"
          :label="$t('group.maxNum')"
          prop="maxNum"
        >
          <el-input
            v-model="dataForm.maxNum"
            type="number"
            :disabled="dataForm.status ? dataForm.status > 0 : false"
            :min="1"
            :max="100000000"
            class="groupActivity-input"
            @change="maxNumCheck"
          >
            <template #append>
              {{ $t("group.memberPeople") }}
            </template>
          </el-input>
        </el-form-item>
        <!-- 是否模拟成团（1:模拟参团、0:不模拟） -->
        <el-form-item
          :label="$t('group.hasRobot')"
          prop="hasRobot"
        >
          <div>
            <el-radio-group
              v-model="dataForm.hasRobot"
              :disabled="
                dataForm.status ? dataForm.status === 4 : false
              "
            >
              <el-radio :label="0">
                {{ $t("group.close") }}
              </el-radio>
              <el-radio :label="1">
                {{ $t("group.open") }}
              </el-radio>
            </el-radio-group>
            <el-tooltip
              :content="$t('group.tip5')"
              placement="top"
              class="tips"
            >
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </el-form-item>
        <!-- 是否开启凑团模式（1:凑团、0:不凑团） -->
        <el-form-item
          :label="$t('group.hasGroupTip')"
          prop="hasGroupTip"
        >
          <el-radio-group
            v-model="dataForm.hasGroupTip"
            :disabled="dataForm.status ? dataForm.status === 4 : false"
          >
            <el-radio :label="0">
              {{ $t("group.close") }}
            </el-radio>
            <el-radio :label="1">
              {{ $t("group.open") }}
            </el-radio>
          </el-radio-group>
          <el-tooltip
            :content="$t('group.tip8')"
            placement="top"
            class="tips"
          >
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </el-form-item>
        <!-- 活动是否预热 -->
        <el-form-item
          :label="$t('group.isPreheat')"
          prop="isPreheat"
        >
          <el-radio-group
            v-model="dataForm.isPreheat"
            :disabled="isPreheatDisable"
          >
            <el-radio :label="0">
              {{ $t("group.close") }}
            </el-radio>
            <el-radio :label="1">
              {{ $t("group.open") }}
            </el-radio>
          </el-radio-group>
          <el-tooltip
            :content="$t('group.tip9')"
            placement="top"
            class="tips"
          >
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </el-form-item>
        <!-- 商品选择框 -->
        <el-form-item
          :label="$t('group.selectProd')"
          prop="spuId"
        >
          <el-button
            v-if="!dataForm.spuId"
            class="tips-button"
            @click="selectProds"
          >
            {{ $t('group.selectProd') }}
            <el-tooltip
              :content="$t('group.tip10')"
              placement="top"
              class="tips"
              style="position:absolute;margin-left:3px"
            >
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-button>
          <!-- 商品 -->
          <div
            v-if="dataForm.spuId"
            style="display:flex;margin-bottom:20px"
          >
            <el-card
              v-for="item in spus"
              :key="item.spuId"
              :body-style="{ padding: '0px' }"
              style="height: 160px;width: 120px"
            >
              <ImgShow
                :src="item.mainImgUrl"
                :img-style="{width:'100%',height:'104px'}"
              />
              <div class="card-prod-bottom card-prod-d">
                <span class="card-prod-name">{{ item.spuName }}</span>
                <el-button
                  v-if="!dataForm.groupActivityId"
                  type="primary"
                  link
                  class="card-prod-name-buttons"
                  @click="deleteCurrentProd()"
                >
                  删除
                </el-button>
              </div>
            </el-card>
          </div>
        </el-form-item>
        <!-- 商品sku列表 -->
        <div v-if="skus && skus.length > 0">
          <el-table
            :data="skus"
            border
            header-cell-class-name="table-header"
            row-class-name="table-row"
          >
            <el-table-column :label="skus.length>1?'sku名称':'商品名称'">
              <template #default="scope">
                <span>{{ skus.length>1?scope.row.skuName:spus[0].spuName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="活动价格">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.actPrice"
                  :disabled="dataForm.status > 0 || scope.row.status !== 1"
                  :min="0.01"
                  :step="1"
                  class="groupActivity-input act-price-input"
                  @blur="checkInput(scope.$index)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <prods-select
          v-if="prodSelectVisible"
          ref="prodSelectRef"
          :is-single="true"
          @refresh-select-prods="getSelectedProd"
        />
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="visible = false"
          >
            {{ $t('table.cancel') }}
          </el-button>
          <el-button
            v-if="dataForm.status !== 4"
            type="primary"
            @click="onSubmit()"
          >
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import Big from 'big.js'
import * as api from '@/api/group/group'
import { ElMessage } from 'element-plus'
import * as spuApi from '@/api/product/list'
import ProdsSelect from '@/components/prods-select/index.vue'
import { getDateTimeRange, getParseTime } from '@/utils/datetime'
import { QuestionFilled } from '@element-plus/icons-vue'
const emit = defineEmits(['refreshDataList', 'reactAddOrUpdate'])

// 预热是否禁用: 已开始的团购活动、开始时间小于当前时间的团购活动 将禁用
const isPreheatDisable = computed(() => {
  const startTime = dataForm.startTime + ' ' + startTimeValue.value + ':00'
  return dataForm.status === 4 ? true : new Date(startTime).getTime() < new Date().getTime()
})

const visible = ref(false)
const isSubmit = ref(false)
const prodSelectVisible = ref(false)
const skus = ref([])
const spus = ref([])
const dataForm = reactive({
  groupActivityId: 0,
  shopId: null,
  activityName: null,
  startTime: null,
  endTime: null,
  groupNumber: 2,
  hasMaxNum: 0,
  maxNum: null,
  hasRobot: 0,
  isPreheat: 0,
  hasGroupTip: 0,
  spuId: null,
  status: null
})

const validEndTime = ref(null)
const validateTime = (rule, value, callback) => {
  if (!startTimeValue.value || !dataForm.startTime) {
    callback(new Error('开始时间不能为空'))
  }
  if (!endTimeValue.value || !dataForm.endTime) {
    callback(new Error('结束时间不能为空'))
  }
  const startTime = dataForm.startTime + ' ' + startTimeValue.value + ':00'
  const endTime = dataForm.endTime + ' ' + endTimeValue.value + ':00'
  if (dataForm.status !== 5 && new Date() > Date.parse(endTime)) {
    callback(new Error($t('group.endTimeIsTooSmall')))
  }
  if (Date.parse(startTime) >= Date.parse(endTime)) {
    callback(new Error($t('group.endTimeIsTooSmall')))
  } else if (dataForm.status === 1 && dataForm.groupActivityId && Date.parse(validEndTime.value) > Date.parse(endTime)) {
    callback(new Error($t('group.extendedEndTime')))
  } else {
    callback()
  }
}
const validateGroupNumber = (rule, value, callback) => {
  if (dataForm.groupNumber < 2) {
    callback(new Error($t('group.tip1')))
  } else {
    callback()
  }
}

// 时间选择变化时检验
const onChangeTime = () => {
  onValidateField('startTime')
  onValidateField('endTime')
}
const onValidateField = (field) => {
  dataFormRef.value?.validateField(field)
}

const dataRule = reactive({
  activityName: [
    { required: true, message: $t('group.pleaseEnterEventName'), trigger: 'blur' }
  ],
  maxNum: [
    { required: true, message: $t('group.pleaseEnterEventNum'), trigger: 'blur' }
  ],
  groupNumber: [
    { required: true, message: $t('group.pleaseEnteNumGrp'), trigger: 'blur' },
    { validator: validateGroupNumber, trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: $t('group.startTimeCannotBeEmpty'), trigger: 'blur' },
    { validator: validateTime, trigger: 'blur' }
  ],
  endTime: [
    { required: true, message: $t('group.endTimeCannotBeEmpty'), trigger: 'blur' },
    { validator: validateTime, trigger: 'blur' }
  ]
})
const title = ref('')
const startTimeValue = ref('')
const endTimeValue = ref('')

const dataFormRef = ref(null)
const init = (groupActivityId) => {
  dataForm.groupActivityId = groupActivityId || 0
  title.value = ''
  dataForm.status = null
  visible.value = true
  isSubmit.value = false
  skus.value = []
  spus.value = []
  if (!dataForm.groupActivityId) {
    title.value = $t('table.create')
  }

  nextTick(() => {
    dataFormRef.value?.resetFields()
    const datetimeRange = getDateTimeRange()
    dataForm.startTime = datetimeRange.startTime
    dataForm.endTime = datetimeRange.endTime
    startTimeValue.value = datetimeRange.currentTime
    endTimeValue.value = datetimeRange.currentTime
    if (!dataForm.groupActivityId) {
      return
    }
    api.get(groupActivityId).then(data => {
      spus.value = [{
        spuId: data.spuId,
        spuName: data.spuName,
        mainImgUrl: data.mainImgUrl
      }]
      data.groupSkuList.forEach(sku => {
        skus.value.push({
          skuId: sku.skuId,
          skuName: sku.skuName,
          actPrice: Number(new Big(sku.actPrice).div(100).valueOf()),
          price: Number(new Big(sku.price).div(100).valueOf()),
          sellNum: sku.sellNum,
          status: sku.status
        })
      })
      dataForm.groupActivityId = data.groupActivityId
      dataForm.shopId = data.shopId
      dataForm.activityName = data.activityName
      dataForm.startTime = data.startTime
      dataForm.endTime = data.endTime
      dataForm.groupNumber = data.groupNumber
      dataForm.hasMaxNum = data.hasMaxNum
      dataForm.maxNum = data.maxNum
      dataForm.hasRobot = data.hasRobot
      dataForm.isPreheat = data.isPreheat
      dataForm.hasGroupTip = data.hasGroupTip
      dataForm.spuId = data.spuId
      dataForm.status = data.status
      startTimeValue.value = dataForm.startTime ? dataForm.startTime.substring(11, dataForm.startTime.length - 3) : ''
      endTimeValue.value = dataForm.endTime ? dataForm.endTime.substring(11, dataForm.endTime.length - 3) : ''
      dataForm.startTime = getParseTime(dataForm.startTime, '{y}-{m}-{d}')
      dataForm.endTime = getParseTime(dataForm.endTime, '{y}-{m}-{d}')
      if (dataForm.status === 4) {
        title.value = '详情'
      } else {
        title.value = $t('table.edit')
      }
    })
  })
}
/**
 * 选择商品
 */
const prodSelectRef = ref(null)
const selectProds = () => {
  prodSelectVisible.value = true
  nextTick(() => {
    prodSelectRef.value?.init(undefined, undefined, 0)
  })
}

/**
 * 选择商品组件返回
 */
const getSelectedProd = (prods) => {
  if (!prods || prods.length === 0) {
    return
  }
  spus.value.push(prods)
  dataForm.spuId = prods.spuId
  spuApi.get(dataForm.spuId).then(data => {
    if (data.skus && data.skus.length > 0) {
      if (data.skus.length > 1) {
        data.skus = data.skus?.filter(item => item.spuSkuAttrValues?.length > 0)
      }
      const skuList = []
      data.skus.forEach(sku => {
        const newSku = {
          skuId: sku.skuId,
          skuName: sku.skuName,
          actPrice: Number(new Big(sku.priceFee).div(100).valueOf()),
          price: Number(new Big(sku.priceFee).div(100).valueOf()),
          sellNum: 0,
          status: sku.status
        }
        skuList.push(newSku)
      })
      skus.value = skuList
    }
  })
}

/**
 * 删除商品
 */
const deleteCurrentProd = () => {
  spus.value = []
  skus.value = []
  dataForm.spuId = null
}
const groupNumCheck = () => {
  let maxNum = Math.round(dataForm.groupNumber)
  if (!maxNum) {
    maxNum = 2
  } else if (maxNum < 2) {
    maxNum = 2
  } else if (maxNum > 500) {
    maxNum = 500
  }
  dataForm.groupNumber = maxNum
}

/**
 * input输入框只允许输入正数和小数(保留小数点后两位)
 */
const checkInput = (index) => {
  if (skus.value[index].actPrice) {
    let tmpVal = parseFloat(skus.value[index].actPrice.toString().replace(/[^\d^\\.]/g, ''))
    const reg = /^(0|([1-9]\d*))(\.\d{1,2})?$/ // 最多允许后输入两位小数
    if (!reg.test(tmpVal)) {
      tmpVal = tmpVal + ''
      tmpVal = tmpVal.substring(0, tmpVal.indexOf('.') + 3)
      const n = (tmpVal.split('.')).length - 1
      if (n > 1) {
        tmpVal = tmpVal.substring(0, tmpVal.indexOf('.'))
      }
    }
    const obj = skus.value[index]
    obj.actPrice = tmpVal
    skus.value[index] = obj
  }
}

const maxNumCheck = () => {
  let maxNum = Math.round(dataForm.maxNum)
  if (!maxNum) {
    maxNum = 1
  } else if (maxNum < 1) {
    maxNum = 1
  } else if (maxNum > 1000000000) {
    maxNum = 1000000000
  }
  dataForm.maxNum = maxNum
}

const loadSku = () => {
  const groupSkuList = []
  let flag = true
  for (let i = 0; i < skus.value.length; i++) {
    const sku = skus.value[i]
    if (!sku.actPrice) {
      ElMessage.error('活动价格不能为空')
      flag = false
      break
    }
    const groupSku = {
      skuId: sku.skuId,
      actPrice: new Big(sku.actPrice).times(100)
    }
    groupSkuList.push(groupSku)
  }
  dataForm.groupSkuList = groupSkuList
  return flag
}

// 表单提交
const onSubmit = Debounce(function () {
  if (dataForm.status === 4) {
    visible.value = false
    dataFormRef.value?.resetFields()
    return
  }
  dataFormRef.value?.validate(valid => {
    if (!valid || isSubmit.value) {
      return
    }
    const startTime = dataForm.startTime
    const endTime = dataForm.endTime
    dataForm.startTime = dataForm.startTime && startTimeValue.value ? dataForm.startTime + ' ' + startTimeValue.value + ':00' : ''
    dataForm.endTime = dataForm.endTime && endTimeValue.value ? dataForm.endTime + ' ' + endTimeValue.value + ':00' : ''
    if (dataForm.activityName.trim().length === 0) {
      ElMessage.error('团购名称不能为空')
      return
    }
    if (!dataForm.spuId) {
      ElMessage.error('请选择商品')
      return
    }
    if (!loadSku()) {
      return
    }
    isSubmit.value = true
    const request = dataForm.groupActivityId ? api.update(dataForm) : api.save(dataForm)
    request.then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          emit('refreshDataList')
          dataFormRef.value?.resetFields()
        }
      })
      isSubmit.value = false
    }).catch(() => {
      isSubmit.value = false
    })
    dataForm.startTime = startTime
    dataForm.endTime = endTime
  })
}, 1500)

// 关闭前重置
const onReset = (done) => {
  emit('reactAddOrUpdate')
  done()
}

defineExpose({ init })
</script>
<style lang="scss" scoped>

.card-prod-bottom .card-prod-name {
    padding: 0 5px;
    line-height: 1em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
}
.card-prod-d .card-prod-name-buttons {
  display: block;
  width: 100%;
  text-align: right;
  padding-right: 5px
}
.tips-button {
  padding-right: 10px;
}
.act-price-input{
  font-family: Microsoft YaHei,sans-serif;
}
.group-manage {
  :deep(.el-input__suffix-inner){
    display: none;
  }
  .select-time:hover :deep(.el-input__suffix-inner){
    display: inline-flex;
  }
}
</style>
