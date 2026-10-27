<template>
  <div class="component-warehouse-manage-add-or-update">
    <el-dialog
      v-model="visible"
      :title="title"
      :close-on-click-modal="false"
      width="760px"
    >
      <el-alert
        class="warehouse-tip"
        :title="!dataForm.type ? '默认仓库默认全国可供货，即区域仓库外的所有区域均可供货，无需设置供货区域' : '区域仓库供货区域不重叠，且区域内的快递订单都将由该仓库进行供货，请合理分配仓库库存'"
        type="warning"
        show-icon
        :closable="false"
      />
      <el-form
        ref="dataFormRef"
        :rules="dataRule"
        :model="dataForm"
        label-width="130px"
        @submit.prevent
      >
        <!-- 仓库名称 -->
        <el-form-item
          label="仓库名称"
          prop="warehouseName"
        >
          <el-input
            v-model="dataForm.warehouseName"
            maxlength="20"
          />
        </el-form-item>

        <el-form-item
          :label="$t('delivery.station.shopAddr')"
          prop="areaInfo"
        >
          <div class="area-select">
            <el-form-item prop="province">
              <el-select
                v-model="dataForm.provinceId"
                :placeholder="$t('tip.select')"
                @change="onSelectProvince"
              >
                <el-option
                  v-for="province in provinceList"
                  :key="province.areaId"
                  :label="province.areaName"
                  :value="province.areaId"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('address.city')"
              label-width="50px"
              prop="city"
            >
              <el-select
                v-model="dataForm.cityId"
                :placeholder="$t('address.city')"
                @change="onSelectCity"
              >
                <el-option
                  v-for="city in cityList"
                  :key="city.areaId"
                  :label="city.areaName"
                  :value="city.areaId"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('address.area')"
              label-width="50px"
              prop="area"
            >
              <el-select
                v-model="dataForm.areaId"
                :placeholder="$t('address.area')"
                @change="onGetDistrictName"
              >
                <el-option
                  v-for="area in areaAddList"
                  :key="area.areaId"
                  :label="area.areaName"
                  :value="area.areaId"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item
          class="addr"
          :label="$t('delivery.station.shopDetailAddr')"
          prop="address"
        >
          <el-input
            v-model="dataForm.address"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="管理人"
          prop="manage"
        >
          <el-input
            v-model="dataForm.manage"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item
          label="管理人电话"
          prop="phone"
        >
          <el-input
            v-model.trim="dataForm.phone"
            maxlength="11"
            @input="onHandlePhone"
          />
        </el-form-item>
        <!-- 默认仓库不显示供货区域选择 -->
        <el-form-item
          v-if="dataForm.type !== 0"
          label="供货区域"
          prop="cityList"
          required
        >
          <el-button
            @click="selectArea"
          >
            设置区域
          </el-button>

          <el-tag
            v-for="(city, index) in addrNameList"
            :key="index"
            style="margin:4px;"
          >
            {{ city }}
          </el-tag>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="visible = false;"
          >
            {{ $t('table.cancel') }}
          </el-button>
          <el-button
            type="primary"
            @click="onSubmit()"
          >
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </template>
      <!-- 区域选择 -->
      <transcity-select
        v-if="transcitySelectVisible"
        ref="transcitySelectRef"
        @refresh-data-list="getTranscityDataList"
        @close-dialog="transcitySelectVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { isMobile } from '@/utils/validate'
import * as api from '@/api/stock/warehouse-station.js'
import * as addrApi from '@/api/system/addr-manage'
import { listAreaInfo } from '@/api/delivery/transport'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refreshDataList', 'reactAddOrUpdate'])

const validMobile = (rule, value, callback) => {
  if (isMobile(value) || (warehouseId.value !== -1 && isExistPhone.value && isStarMobile(value))) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号'))
  }
}

const visible = ref(false)
const isSubmit = ref(false)
const dataForm = ref({
  warehouseName: '', // 仓库名称
  type: '', // 仓库类型（0默认仓库，1区域仓库）
  address: '', // 仓库地址
  phone: '',
  manage: '',
  cityList: []
})
const validateProvince = (rule, value, callback) => {
  if (!dataForm.value.province) {
    callback(new Error($t('admin.seleProv')))
  } else if (!dataForm.value.city) {
    callback(new Error($t('admin.seleCity')))
  } else if (!dataForm.value.area) {
    callback(new Error($t('admin.seleDC')))
  } else {
    callback()
  }
}
const validateAddr = (rule, value, callback) => {
  if (!value.trim()) {
    callback(new Error($t('admin.addrNoNull')))
  } else {
    callback()
  }
}
const validManage = (rule, value, callback) => {
  if (!value.trim()) {
    callback(new Error('管理人不能为空'))
  } else {
    callback()
  }
}
const validName = (rule, value, callback) => {
  if (!value.trim()) {
    callback(new Error('仓库名称不能为空'))
  } else {
    callback()
  }
}
const dataRule = reactive({
  warehouseName: [
    { required: true, message: '请填写仓库名称', trigger: 'blur' },
    { validator: validName, trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请填写管理人电话', trigger: 'blur' },
    { validator: validMobile, trigger: 'blur' }
  ],
  manage: [
    { required: true, message: '请填写管理人', trigger: 'blur' },
    { validator: validManage, trigger: 'blur' }
  ],
  cityList: [{ required: true, message: '请选择供货区域', trigger: 'change' }],
  areaInfo: [
    { required: true, validator: validateProvince, trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请填写仓库地址', trigger: 'blur' },
    { validator: validateAddr, trigger: 'blur' }
  ]
})
const title = ref('')
const warehouseId = ref(null) // 仓库id
const dataFormRef = ref(null)
const transcitySelectVisible = ref(false) // 区域选择弹窗
/**
 * 初始化
 * @param {number} id 仓库ID，为-1则表示新建仓库
 * @param {number} storeType 0默认仓库 1区域仓库
 */
const init = (id, storeType) => {
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    addrNameList.value = []
    cityList.length = 0
    areaAddList.length = 0
    dataForm.value.warehouseId = null
    dataForm.value.provinceId = null
    dataForm.value.cityId = null
    dataForm.value.areaId = null
    dataForm.value.type = storeType
    transcitySelectVisible.value = false
    warehouseId.value = id
    onListAreaByParentId().then((data) => {
      onHandleArr(provinceList, data)
      if (id === -1) {
        title.value = '新建仓库'
        if (storeType !== 0) {
          // 获取省市区信息与已被使用的省市区id集合
          getAreaListInfo()
        }
      } else {
        title.value = '编辑仓库'
        getWarehouseDetail()
      }
    })
  })
}

// 获取仓库详情
const isExistPhone = ref(false)
const getWarehouseDetail = () => {
  api.getWarehouse({
    warehouseId: warehouseId.value
  }).then(data => {
    dataForm.value = data
    isExistPhone.value = Boolean(data.phone)
    onListAreaByParentId(data.provinceId).then((data) => {
      onHandleArr(cityList, data)
    })
    onListAreaByParentId(data.cityId).then((data) => {
      onHandleArr(areaAddList, data)
    })
    if (dataForm.value.type !== 0) {
      // 非默认仓库获取省市区信息与已被使用的省市区id集合
      getAreaListInfo()
    }
  })
}

const onHandlePhone = () => {
  const rex = isExistPhone.value ? /[^\d|*]/g : /[^\d]/g
  dataForm.value.phone = dataForm.value.phone.replace(rex, '')
}

const areaList = reactive([])
const areaListDB = reactive([])
const addrNameList = ref([])
let banArr = []
// 获取省市区信息
const getAreaListInfo = () => {
  listAreaInfo().then(data => {
    onHandlerArr(areaListDB, data)
    onHandlerArr(areaList, JSON.parse(JSON.stringify(data)))
    // 将地址存入地址列表中
    addrNameList.value = setAddrInfoByAreaList(dataForm.value.cityList || [])
  })
  api.listWarehouseCity({
    warehouseId: warehouseId.value !== -1 ? warehouseId.value : undefined
  }).then((res) => {
    banArr = res
  })
}

// 数组赋值
const onHandlerArr = (arr, data) => {
  arr.length = 0
  arr.push(...data)
}

const transcitySelectRef = ref(null)
const selectArea = () => {
  transcitySelectVisible.value = true
  let allSelectCityList = []
  const cityList = dataForm.value.cityList
  allSelectCityList = allSelectCityList.concat(cityList)
  nextTick(() => {
    transcitySelectRef.value?.init(0, dataForm.value.cityList || [], allSelectCityList, 0, banArr || [])
  })
}

// 地址信息列表
const provinceList = reactive([])
const cityList = reactive([])
const areaAddList = reactive([])

/**
 * 获取选择的区域
 * @param {*} rowIndex 未用到
 * @param {*} cityList 选择的区域列表
 */
const getTranscityDataList = (rowIndex, cityList) => {
  dataForm.value.cityList = cityList
  addrNameList.value = setAddrInfoByAreaList(cityList)
  dataFormRef.value.validateField('cityList', () => null)
}

// 将地址存入地址列表中
const setAddrInfoByAreaList = (cityList) => {
  const tempAreaList = JSON.parse(JSON.stringify(areaListDB))
  return getAreaNameList(tempAreaList, cityList)
}

const onGetDistrictName = () => {
  for (let i = 0; i < areaAddList.length; i++) {
    if (areaAddList[i].areaId === dataForm.value.areaId) {
      // 将市名字保存起来
      dataForm.value.area = areaAddList[i].areaName
    }
  }
  dataFormRef.value.validateField('areaInfo', () => null)
}

// 选择省
const onSelectProvince = (val) => {
  dataForm.value.cityId = null
  dataForm.value.city = ''
  areaAddList.length = 0
  dataForm.value.areaId = null
  dataForm.value.area = ''
  // 获取城市的select
  const { curNode, areas } = onGetCurrentChild(provinceList, val)
  if (areas) {
    onHandleArr(cityList, areas)
  } else {
    onListAreaByParentId(val).then((data) => {
      curNode.areas = data
      onHandleArr(cityList, data)
    })
  }
  onGetProvinceName() // 获取省名称
}

const onGetProvinceName = () => {
  for (let i = 0; i < provinceList.length; i++) {
    if (provinceList[i].areaId === dataForm.value.provinceId) {
      // 将省名字保存起来
      dataForm.value.province = provinceList[i].areaName
    }
  }
}

// 选择市
const onSelectCity = (val) => {
  dataForm.value.areaId = null
  dataForm.value.area = ''
  // 获取区的select
  const { curNode, areas } = onGetCurrentChild(cityList, val)
  if (areas) {
    onHandleArr(areaAddList, areas)
  } else {
    onListAreaByParentId(val).then((data) => {
      curNode.areas = data
      onHandleArr(areaAddList, data)
    })
  }
  onGetCityName() // 获取市名称
  dataFormRef.value.validateField('city', () => null)
}

const onGetCurrentChild = (curList, curId) => {
  for (const item of curList) {
    if (item.areaId === curId) {
      return {
        curNode: item,
        areas: item.areas
      }
    }
  }
}

const onHandleArr = (arr, data) => {
  arr.length = 0
  arr.push(...data)
}
const onListAreaByParentId = (pid) => {
  let paramData
  if (!pid) {
    paramData = { level: 1 }
  } else {
    paramData = { parentId: pid }
  }
  return addrApi.page(paramData)
}

const onGetCityName = () => {
  for (let i = 0; i < cityList.length; i++) {
    if (cityList[i].areaId === dataForm.value.cityId) {
      // 将市名字保存起来
      dataForm.value.city = cityList[i].areaName
    }
  }
}

// 表单提交
const onSubmit = Debounce(function () {
  dataFormRef.value?.validate(valid => {
    if (!valid || isSubmit.value) {
      return
    }
    isSubmit.value = true
    const request = warehouseId.value === -1 ? api.postWarehouse : api.putWarehouse
    request(dataForm.value).then(() => {
      isSubmit.value = false
      ElMessage({
        message: '操作成功',
        duration: 1500,
        type: 'success'
      })
      visible.value = false
      emit('reactAddOrUpdate')
    }).catch(() => {
      isSubmit.value = false
    })
  })
}, 1500)

defineExpose({ init })
</script>
<style lang="scss" scoped>
.component-warehouse-manage-add-or-update {
  .warehouse-tip {
    height: 50px;
    margin-bottom: 20px;
  }
  .area-select {
    display: flex;
  }
}
</style>
