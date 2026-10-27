<template>
  <div class="page-physical-physical">
    <div class="basicInfo-container">
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="dataRule"
        label-width="auto"
        label-position="right"
        @submit.prevent
      >
        <span class="title">基本信息</span>
        <el-divider />
        <el-form-item
          label="盘点时间"
          prop="createTime"
        >
          <el-date-picker
            v-model="dataForm.createTime"
            type="datetime"
            placeholder="选择日期"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item
          label="库存点类型"
          prop="stockPointType"
        >
          <el-radio-group
            v-model="dataForm.stockPointType"
            @change="onChangeStockPointType"
          >
            <el-radio
              :label="1"
            >
              仓库
            </el-radio>
            <el-radio
              :label="2"
            >
              门店
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="库存点名称"
          prop="warehouseId"
        >
          <el-select
            v-model="dataForm.warehouseId"
            placeholder="请选择库存点"
          >
            <el-option
              v-for="(item, index) in stockPointList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="盘点区域名称"
          prop="stockRegionName"
        >
          <el-input
            v-model="dataForm.stockRegionName"
            style="width: 30%"
            type="text"
            show-word-limit
            maxlength="20"
            placeholder="盘点区域名称"
          />
          <el-tooltip
            class="item"
            effect="dark"
            content="自定义该盘点区域名称，例如冷藏区。"
            placement="top"
          >
            <el-icon><InfoFilled /></el-icon>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="dataForm.remark"
            style="width: 30%"
            type="textarea"
            show-word-limit
            maxlength="200"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="foot-btn">
      <el-button
        type="primary"
        @click="confirmSave(1)"
      >
        实盘录入
      </el-button>
      <el-button
        @click="confirmSave(2)"
      >
        取消
      </el-button>
    </div>
  </div>
</template>

<script setup>
import moment from 'moment'
import { validNoEmptySpace } from '@/utils/validate'
import * as api from '@/api/stock/takeStock'
import { getListStation, getListWarehouse } from '@/api/stock/warehouse-station.js'
import { ElMessage } from 'element-plus'

const dataForm = reactive({
  createTime: moment().add('days').startOf('days').format('LL'), // 盘点开始时间
  stockRegionName: '', // 盘点区域名称
  stockPointType: '', // 库存点类型
  warehouseId: null, // 库存点Id
  remark: '' // 备注
})

onMounted(() => {
  // 初始化数据，默认选择仓库类型
  dataForm.stockPointType = 1
})

let defaultWarehouse = {}
const stockPointList = ref([])
watch(() => dataForm.stockPointType, (newVal) => {
  dataForm.warehouseId = null
  if (newVal === 2) {
    getListStation().then((res) => {
      stockPointList.value = res.map(item => {
        return {
          label: item.stationName,
          value: item.stationId
        }
      })
    })
  } else {
    getListWarehouse().then((res) => {
      stockPointList.value = res.map(item => {
        if (item.type === 0) {
          defaultWarehouse = item
        }
        return {
          label: item.warehouseName,
          value: item.warehouseId
        }
      })
    })
  }
  dataFormRef.value.clearValidate('warehouseId')
})

const validateStockRegionName = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能全为空格'))
  } else {
    callback()
  }
}
const validateRemark = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能全为空格'))
  } else {
    callback()
  }
}
const validateWarehouseId = (rule, value, callback) => {
  if (value && dataForm.stockPointType === 1 && defaultWarehouse.warehouseId === value && !(defaultWarehouse.provinceId && defaultWarehouse.cityId && defaultWarehouse.areaId)) {
    callback(new Error('请先将默认仓库的地址信息填写完整'))
  } else {
    callback()
  }
}
const dataRule = {
  createTime: [
    {
      type: 'string',
      required: true,
      message: '盘点时间不能为空',
      trigger: 'change'
    }
  ],
  stockPointType: [
    {
      required: true,
      message: '请选择库存点类型',
      trigger: 'change'
    }
  ],
  warehouseId: [
    { required: true, message: '请选择库存点', trigger: 'blur' },
    { validator: validateWarehouseId, trigger: 'change' }
  ],
  stockRegionName: [
    { validator: validateStockRegionName, trigger: 'blur' }
  ],
  remark: [
    { validator: validateRemark, trigger: 'blur' }
  ]
}

const dataFormRef = ref(null)
const router = useRouter()
const confirmSave = (status) => {
  if (status === 1) {
    dataFormRef.value.validate((valid) => {
      if (valid) {
        api.takeNew(dataForm).then((data) => {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1500
          })
          router.push({
            path: '/stock/edit-take-stock',
            query: {
              takeStockId: data
            }
          })
        })
      }
    })
  } else if (status === 2) {
    router.push({
      path: '/stock/takeStock',
      query: {}
    })
  }
}

</script>
<style lang="scss" scoped>
.page-physical-physical {
  .basicInfo-container {
    .title {
      color: #333333;
      font-size: 16px;
      font-weight: bold;
    }
  }
  /* 脚部按钮 */
  .foot-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 15px 0;
    display: flex;
    justify-content: center;
    background: #fff;
    // border-top: 1px solid #ddd;
    box-shadow: 0 -2px 3px rgba(139, 139, 139, 0.1);
    z-index: 1999;
  }
}
</style>
<style scoped>
.basicInfo-container {
  padding: 20px;
}
</style>
