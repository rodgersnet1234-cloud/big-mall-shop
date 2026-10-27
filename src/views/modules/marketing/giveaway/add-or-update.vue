<template>
  <div class="app-container giveaway-manage">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{
          dataForm.giveawayId
            ? (pageType === 1 ? '编辑赠品' : '查看赠品')
            : '新增赠品'
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
        label="活动名称:"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          :disabled="pageType === 2"
          style="width: 542px"
          maxlength="20"
          show-word-limit
          class="giveaway-input"
          placeholder="活动名称"
        />
      </el-form-item>
      <!--活动时间-->
      <el-form-item
        label="活动时间:"
        :required="true"
      >
        <div class="date-picker">
          <!--开始时间-->
          <el-form-item prop="startTime">
            <el-date-picker
              v-model="dataForm.startTime"
              :disabled="pageType === 2"
              type="date"
              placeholder="选择开始日期"
              value-format="YYYY-MM-DD"
              style="width:140px"
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
              placeholder="选择结束日期"
              value-format="YYYY-MM-DD"
              style="width:140px"
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
      <!--套餐主商品-->
      <el-form-item
        label="主商品:"
        :required="true"
      >
        <div
          v-if="dataForm.spuId != null"
          class="prodItem-table"
        >
          <el-table
            :data="[dataForm]"
            header-cell-class-name="table-header"
            row-class-name="table-row"
            style="width: 820px"
          >
            <el-table-column
              label="商品信息"
              prop="reason"
              fixed="left"
              align="center"
              width="320px"
            >
              <template #default="scope">
                <div class="prod-info-container">
                  <div class="prod-image">
                    <prod-pic
                      :width="'80'"
                      :height="'80'"
                      :pic="scope.row.mainImgUrl"
                    />
                  </div>
                  <div class="prod-name">
                    <div class="prod-name-txt">
                      {{ scope.row.spuName }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="商品现价"
              align="center"
              prop="price"
              width="200px"
            >
              <template #default="scope">
                <span>{{ formatPrice(scope.row.price, 1).toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="giveawayNum"
              label="购买数量"
              align="center"
              width="160px"
            >
              <template #header>
                购买数量
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="购买数量达到了对应值才赠送赠品"
                  placement="top"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
              <template #default="scope">
                <div class="custom-rate">
                  <input
                    v-model="scope.row.buyNum"
                    :disabled="pageType === 2"
                    type="number"
                    :precision="0"
                    :min="1"
                    :max="99999999"
                    :step="1"
                    style="width: 80%;"
                    class="tag-input-width"
                    @keyup="
                      scope.row.buyNum = String(scope.row.buyNum).match(/[^0-9]/) ? 1 : scope.row.buyNum
                    "
                    @blur="checkInputBuyNum(scope.row.buyNum, 1, 99999999)"
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="dataForm.status"
              align="center"
              label="操作"
              fixed="right"
              width="140px"
            >
              <div
                v-if="dataForm.status"
              >
                <el-button
                  type="primary"
                  link
                  @click="onDeleteMainProd"
                >
                  删除
                </el-button>
              </div>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="dataForm.spuId == null">
          <el-button
            @click="onAddProd"
          >
            选择商品
          </el-button>
        </div>
        <div
          v-if="!verifyProdFlag"
          class="error-tips"
        >
          主商品不能为空
        </div>
      </el-form-item>
      <!--赠送商品-->
      <el-form-item
        label="赠送商品:"
        :required="true"
      >
        <!--赠送商品表格-->
        <giveawayProdTable
          ref="giveAwayProdTableRef"
          :page-type="pageType"
          :main-prod-delivery-mode="dataForm.deliveryMode"
          :type="2"
          :limit="15"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="back()">
          返回
        </el-button>
        <el-button
          v-if="pageType === 1"
          type="primary"
          @click="onSubmit()"
        >
          确定
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 主商品选择弹窗-->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelectRef"
      :is-single="true"
      @refresh-select-prods="selectMainProd"
    />
  </div>
</template>

<script setup>
import giveawayProdTable from './components/giveaway-prod-table.vue'
import ProdsSelect from './components/giveaway-prods-select.vue'
import ProdPic from '@/components/prod-pic/index.vue'
import * as api from '@/api/giveaway/giveaway'
import { getDateTimeRange, getParseTime } from '@/utils/datetime'
import { formatPrice } from '@/utils'
import { ElMessage } from 'element-plus'
import { Debounce } from '@/utils/debounce'

const dataFormRef = ref(null)
const dataForm = reactive({
  giveawayId: 0,
  name: '',
  startTime: '',
  endTime: '',
  spuId: null,
  mainImgUrl: null,
  spuName: null,
  status: 1,
  deliveryMode: {},
  giveawaySpus: [],
  buyNum: 0,
  giveawaySpuName: '',
  price: null,
  shopId: null
})

const verifyProdFlag = ref(true) // 主商品校验标志
const prodsSelectVisible = ref(false)
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
    callback(new Error('活动名称不可为空'))
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
  if (rule.field === 'endTime' && Date.parse(startTime) >= Date.parse(endTime)) {
    callback(new Error('结束时间不能小于或等于开始时间'))
  }
  if (rule.field === 'endTime' && new Date() > Date.parse(endTime)) {
    callback(new Error('活动结束时间不能少于当前时间'))
  }
  callback()
}

const dataRule = reactive({
  name: [
    { required: true, message: '活动名称不可为空', trigger: 'blur' },
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

const route = useRoute()
const commonStore = useCommonStore()
const pageType = ref(1) // 1：新增/编辑 2：查看
onMounted(() => {
  const giveawayId = Number(route.query.giveawayId) ? Number(route.query.giveawayId) : 0
  pageType.value = Number(route.query.pageType) || 1
  init(giveawayId)
  const title = giveawayId ? (pageType.value === 1 ? '编辑赠品' : '查看赠品') : '新增赠品'
  commonStore.replaceSelectMenu(title)
})

// 获取数据列表
const init = (giveawayId) => {
  dataForm.giveawayId = Number(giveawayId) || 0
  nextTick(() => {
    dataFormRef.value?.resetFields()
    const datetimeRange = getDateTimeRange()
    dataForm.startTime = datetimeRange.startTime
    dataForm.endTime = datetimeRange.endTime
    startTimeValue.value = datetimeRange.currentTime
    endTimeValue.value = datetimeRange.currentTime
    if (dataForm.giveawayId && dataForm.giveawayId !== '0') {
      getDataInfo()
    }
  })
}
const giveAwayProdTableRef = ref(null)
// 获取套餐信息
const getDataInfo = () => {
  api.get(dataForm.giveawayId).then((data) => {
    dataForm.giveawayId = data.giveawayId
    dataForm.name = data.name
    dataForm.startTime = data.startTime
    dataForm.endTime = data.endTime
    dataForm.spuId = data.spuId
    dataForm.mainImgUrl = data.mainImgUrl
    dataForm.spuName = data.spuName
    dataForm.status = data.status
    dataForm.deliveryMode = JSON.parse(data.deliveryMode)
    dataForm.giveawaySpus = data.giveawaySpus
    dataForm.giveawaySpus.forEach((item) => {
      item.deliveryMode = JSON.parse(item.deliveryMode)
    })
    dataForm.buyNum = data.buyNum
    dataForm.giveawaySpuName = data.giveawaySpuName
    dataForm.price = data.price
    dataForm.shopId = data.shopId
    startTimeValue.value = dataForm.startTime ? dataForm.startTime.substring(11, dataForm.startTime.length - 3) : ''
    endTimeValue.value = dataForm.endTime ? dataForm.endTime.substring(11, dataForm.endTime.length - 3) : ''
    dataForm.startTime = getParseTime(dataForm.startTime, '{y}-{m}-{d}')
    dataForm.endTime = getParseTime(dataForm.endTime, '{y}-{m}-{d}')
    giveAwayProdTableRef.value.init(dataForm.giveawaySpus)
  })
}
// 主商品选择更新回调
const selectMainProd = (prodItems) => {
  const prodObj = prodItems
  if (prodObj) {
    dataForm.spuId = prodObj.spuId
    dataForm.mainImgUrl = prodObj.mainImgUrl
    dataForm.spuName = prodObj.name
    dataForm.price = prodObj.priceFee
    dataForm.deliveryMode = JSON.parse(prodObj.deliveryMode)
    dataForm.buyNum = 1
    verifyProdFlag.value = true
  }
}
const isSubmit = ref(false)
// 表单提交
const onSubmit = Debounce(() => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  dataFormRef.value?.validate((valid) => {
    const giveawaySpus = giveAwayProdTableRef.value?.verifyDataForm()
    if (!dataForm.spuId) {
      verifyProdFlag.value = false
      isSubmit.value = false
      return
    }
    if (!giveawaySpus) {
      isSubmit.value = false
      return
    }
    if (valid) {
      const startTime = dataForm.startTime
      const endTime = dataForm.endTime
      dataForm.startTime = dataForm.startTime && startTimeValue.value ? dataForm.startTime + ' ' + startTimeValue.value + ':00' : ''
      dataForm.endTime = dataForm.endTime && endTimeValue.value ? dataForm.endTime + ' ' + endTimeValue.value + ':00' : ''
      const obj = {
        giveawayId: dataForm.giveawayId || undefined,
        name: dataForm.name,
        startTime: dataForm.startTime,
        endTime: dataForm.endTime,
        spuId: dataForm.spuId,
        status: dataForm.status,
        buyNum: dataForm.buyNum,
        giveawaySpus
      }
      api[dataForm.giveawayId && dataForm.giveawayId !== '0' ? 'update' : 'save'](obj).then(() => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            isSubmit.value = false
            back()
          }
        })
      }).catch(() => {
        isSubmit.value = false
      })
      dataForm.startTime = startTime
      dataForm.endTime = endTime
    } else {
      isSubmit.value = false
    }
  })
})
// 打开选择主商品
const prodsSelectRef = ref(null)
const onAddProd = () => {
  prodsSelectVisible.value = true
  nextTick(() => {
    prodsSelectRef.value.init()
  })
}
// 输入值校验
const checkInputBuyNum = (val, min, max) => {
  if (val > max) {
    dataForm.buyNum = max
  }
  if (val < min || !val) {
    dataForm.buyNum = min
  }
}
const onDeleteMainProd = () => {
  dataForm.spuId = null
  dataForm.buyNum = 1
}

const router = useRouter()
const back = () => {
  router.push('/marketing/giveaway')
}

</script>
<style lang="scss" scoped>
@use 'add-or-update.scss';
</style>
