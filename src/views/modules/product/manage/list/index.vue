<template>
  <div class="page-product-list">
    <!-- 1.条件筛选 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="searchForm"
        label-width="100"
        @submit.prevent
      >
        <div class="input-row">
          <!-- 商品名称 -->
          <el-form-item label="商品名称：">
            <el-input
              v-model="searchForm.spuName"
              placeholder="商品名称"
              maxlength="100"
              clearable
            />
          </el-form-item>
          <!-- 商品ID -->
          <!-- <el-form-item label="商品ID">
            <el-input v-model="searchForm.prodId" type="number" placeholder="商品ID" />
          </el-form-item> -->
          <!-- 商品编码 -->
          <el-form-item label="商品编码：">
            <el-input
              v-model="searchForm.prodCode"
              placeholder="商品编码"
              clearable
              maxlength="36"
            />
          </el-form-item>
          <!-- 商品类别 -->
          <el-form-item label="商品类别：">
            <el-select
              v-model="searchForm.spuMold"
              width="300px"
              placeholder="商品类别"
              clearable
            >
              <el-option
                label="实物商品"
                :value="0"
              />
              <el-option
                label="虚拟商品"
                :value="1"
              />
              <el-option
                label="组合商品"
                :value="2"
              />
              <el-option
                label="电子卡券"
                :value="3"
              />
            </el-select>
          </el-form-item>
          <!-- 商品类型 -->
          <el-form-item label="商品类型：">
            <el-select
              v-model="searchForm.spuType"
              placeholder="商品类型"
              clearable
            >
              <el-option
                label="普通商品"
                :value="0"
              />
              <el-option
                label="拼团商品"
                :value="1"
              />
              <el-option
                label="秒杀商品"
                :value="2"
              />
              <el-option
                label="组合选品"
                :value="5"
              />
            </el-select>
          </el-form-item>
          <!-- 商品状态 -->
          <el-form-item label="状态：">
            <el-select
              v-model="searchForm.spuStatus"
              placeholder="状态"
              clearable
            >
              <el-option
                label="下架"
                :value="0"
              />
              <el-option
                label="上架"
                :value="1"
              />
              <el-option
                label="违规下架"
                :value="2"
              />
              <el-option
                label="违规下架待审核"
                :value="3"
              />
              <el-option
                label="待审核"
                :value="4"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="商品来源：">
            <el-select
              v-model="searchForm.spuOrigin"
              placeholder="商品来源"
              clearable
            >
              <el-option
                label="直接发布"
                :value="0"
              />
              <el-option
                label="供应商库"
                :value="1"
              />
            </el-select>
          </el-form-item>
          <!-- 发货方式 -->
          <el-form-item label="发货方式：">
            <el-select
              v-model="searchForm.supplierDeliveryType"
              placeholder="发货方式"
              clearable
            >
              <el-option
                label="供应商发货"
                :value="1"
              />
              <el-option
                label="商家发货"
                :value="2"
              />
            </el-select>
          </el-form-item>
          <!-- 商品分类 -->
          <el-form-item label="店铺分类：">
            <el-cascader
              v-model="selectedMenu"
              clearable
              expand-trigger="hover"
              :options="categoryList"
              :props="categoryListTreeProps"
              change-on-select
              @change="handleSelectCategoryChange"
            />
          </el-form-item>
          <el-form-item label="SaaS分类：">
            <el-cascader
              v-model="selectedPlatformCategories"
              clearable
              expand-trigger="hover"
              :options="platformCategories"
              :props="platformCategoriesTreeProps"
              change-on-select
              @change="handlePlatformCategoryChange"
            />
          </el-form-item>
          <!-- 累计销量 -->
          <el-form-item label="累计销量：">
            <div class="cumulative-sales range-box">
              <div class="unit-wrapper first-iterm">
                <el-input-number
                  v-model="searchForm.saleBeginInp"
                  :min="0"
                  :max="999999999"
                  :controls="false"
                  :step="1"
                  step-strictly
                  @change="onRangeChange('sale')"
                />
              </div>
              <span class="interval-line">-</span>
              <div class="unit-wrapper">
                <el-input-number
                  v-model="searchForm.saleEndInp"
                  :min="0"
                  :max="999999999"
                  :controls="false"
                  :step="1"
                  step-strictly
                  @change="onRangeChange('sale')"
                />
              </div>
            </div>
          </el-form-item>
          <!-- 当前价格 -->
          <el-form-item label="当前价格：">
            <div class="current-pirce range-box">
              <div class="unit-wrapper first-iterm">
                <el-input-number
                  v-model="searchForm.currentPriceBeginInp"
                  :min="0"
                  :max="999999999.99"
                  :controls="false"
                  :step="0.01"
                  step-strictly
                  @change="onRangeChange('price')"
                />
              </div>
              <span class="interval-line">-</span>
              <div class="unit-wrapper">
                <el-input-number
                  v-model="searchForm.currentPriceEndInp"
                  :min="0"
                  :max="999999999.99"
                  :controls="false"
                  :step="0.01"
                  step-strictly
                  @change="onRangeChange('price')"
                />
              </div>
            </div>
          </el-form-item>

          <!-- 查询按钮 -->
          <div class="btn-row">
            <el-button
              type="primary"
              @click="conditionSearch(true)"
            >
              {{ $t("table.search") }}
            </el-button>
            <el-button
              @click="clearSearchInfo()"
            >
              {{ $t("shop.resetMap") }}
            </el-button>
          </div>
        </div>
      </el-form>
    </div>

    <div class="main-content">
      <!-- 2.发布/展示/处理商品操作 -->
      <div class="operation-bar">
        <el-radio-group
          v-model="prodStatusRadio"
          @change="switchProdList()"
        >
          <!-- 全部按钮 -->
          <el-radio-button :label="0">
            全部
          </el-radio-button>
          <!-- 在售中按钮 -->
          <el-radio-button :label="1">
            在售中
          </el-radio-button>
          <!-- 已售罄按钮 -->
          <el-radio-button :label="2">
            已售罄
          </el-radio-button>
          <!-- 已下架按钮 -->
          <el-radio-button :label="3">
            已下架
          </el-radio-button>
        </el-radio-group>
        <el-button
          v-permission="['product:spu:save']"
          type="primary"
          @click="toReleaseProdPage(-1)"
        >
          发布新商品
        </el-button>
      </div>

      <div class="operation-bar">
        <el-checkbox
          v-model="isSelectedAll"
          :indeterminate="isIndeterminate"
          :disabled="!pageData.list?.length"
          class="all-check-btn"
          @change="onSelectAll"
        >
          当页全选
        </el-checkbox>
        <div class="inline-btn-row">
          <el-button
            v-permission="['product:spu:soldExcel']"
            @click="soldExcel()"
          >
            导出商品
            <el-tooltip
              effect="light"
            >
              <template #content>
                <div style="max-width:500px">
                  如果通过商品名称进行数据导出， 需要注意商品名称的搜索规则与列表中的搜索规则是不一致的，导出的搜索规则为：商品名称连续的模糊搜索, 所以导出的
                  数据跟列表中显示的数据可能会不一致。例：商品名为 '新款5G手机'，正确搜索方式为 '新款5G'、'款5G手'、'G手机'， 错误方式为 '新款手机'、'新5G手机'、'新机'。
                </div>
              </template>
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-button>
          <el-button
            v-permission="['product:spu:upload']"
            @click="uploadSpu()"
          >
            导入商品
          </el-button>
          <el-dropdown
            v-permission="['product:spu:prodSale', 'product:spu:prodNotSale']"
            class="dropdown-btn"
          >
            <el-button>
              批量操作
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <!-- 上架按钮 -->
                <el-dropdown-item
                  v-if="prodStatusRadio===0 || prodStatusRadio===3 || prodStatusRadio===2"
                  v-permission="['product:spu:prodSale']"
                  @click="changeProdStatus('onTheShelf')"
                >
                  批量上架
                </el-dropdown-item>
                <!-- 下架按钮 -->
                <el-dropdown-item
                  v-if="prodStatusRadio===0 || prodStatusRadio!==3"
                  v-permission="['product:spu:prodNotSale']"
                  @click="changeProdStatus('offTheShelf')"
                >
                  批量下架
                </el-dropdown-item>
                <!--  删除按钮  -->
                <el-dropdown-item
                  v-permission="['product:spu:delete']"
                  @click="batchDeleteByIds"
                >
                  批量删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <span
          v-if="checkedCount"
          class="had-selected-tips"
        >已选商品 {{ checkedCount }}</span>
      </div>

      <!-- 商品展示表格 -->
      <div
        ref="closepopoverRef"
        class="table-con"
      >
        <el-table
          ref="prodListTableRef"
          :data="pageData.list"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
          @selection-change="onSelectSome"
          @sort-change="prodConditionSort"
        >
          <el-table-column
            type="selection"
            align="center"
            width="45"
          />
          <el-table-column
            label="商品信息"
            prop="spuName"
            width="200"
          >
            <template #default="{ row }">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <ImgShow
                    :src="row.mainImgUrl"
                    :img-style="{width:'60px',height:'60px'}"
                  />
                </div>
                <div class="table-cell-text">
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="row.showSpuName"
                  >
                    <template #reference>
                      <div class="prod-name">
                        {{ row.showSpuName }}
                      </div>
                    </template>
                  </el-popover>
                  <el-popover
                    placement="bottom"
                    trigger="click"
                    width="400"
                    @show="getProdName(row.spuId)"
                    @after-enter="getCurrentSpuId(row.spuId, 'prodName')"
                    @hide="initProdInf(row)"
                  >
                    <div class="spu-name-input-con">
                      <el-input
                        v-model="currentModifyProdName.spuNameZh"
                        type="textarea"
                        :rows="2"
                        maxlength="60"
                        placeholder="请输入中文商品名称"
                      />
                      <!-- <el-input
                        v-model="currentModifyProdName.spuNameEn"
                        type="textarea"
                        :rows="2"
                        maxlength="100"
                        placeholder="请输入英文商品名称"
                      /> -->
                    </div>
                    <div class="popover-bottom">
                      <el-button
                        @click="closePopover()"
                      >
                        取消
                      </el-button>
                      <el-button
                        type="primary"
                        @click="modifyProdName(row)"
                      >
                        保存
                      </el-button>
                    </div>
                    <template #reference>
                      <el-icon
                        v-show="row.spuId==currentMoveSpuId || (row.spuId==currentClickSpuId && currentShowPopover=='prodName')"
                        v-permission="['product:spu:modifyProdName']"
                      >
                        <EditPen />
                      </el-icon>
                    </template>
                  </el-popover>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="销售价"
            prop="priceFee"
            width="auto"
            sortable="custom"
          >
            <template #default="{ row }">
              <div class="table-cell-text">
                <span>{{ row.priceFee }}</span>
                <el-popover
                  v-if="(row.supplierDeliveryType!==1||row.salesType!==0) && row.supplierDeliveryType!==1"
                  placement="bottom"
                  trigger="click"
                  width="auto"
                  @show="getProdSku(row.spuId)"
                  @after-enter="getCurrentSpuId(row.spuId, 'priceFee')"
                  @after-leave="clearShowPopoverInf()"
                >
                  <div v-if="currentModifyProdSkuList.length===1">
                    <div class="single-input-number">
                      <el-input-number
                        v-model="currentModifyProdSkuList[0].priceFee"
                        :min="0.01"
                        :max="9999999.99"
                        :step="0.1"
                        :precision="2"
                        controls-position="right"
                      />
                      <div class="popover-bottom">
                        <el-button
                          @click="closePopover()"
                        >
                          取消
                        </el-button>
                        <el-button
                          v-permission="['product:spu:modifyProdPrice']"
                          type="primary"
                          @click="modifyProdPrice(row.spuId, currentModifyProdSkuList)"
                        >
                          保存
                        </el-button>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="currentModifyProdSkuList.length>1"
                    class="popover-table-con"
                  >
                    <el-table
                      :data="currentModifyProdSkuList"
                      header-cell-class-name="table-header"
                    >
                      <el-table-column
                        width="200"
                        prop="skuName"
                        label="规格名称"
                      />
                      <el-table-column
                        width="150"
                        prop="priceFee"
                        label="价格"
                      >
                        <template #default="scope">
                          <el-input-number
                            v-model="scope.row.priceFee"
                            :min="0.01"
                            :max="9999999.99"
                            :step="0.1"
                            :precision="2"
                            style="width: 100%"
                            controls-position="right"
                            :disabled="scope.row.status!==1"
                          />
                        </template>
                      </el-table-column>
                    </el-table>
                    <div class="popover-bottom">
                      <el-button
                        @click="closePopover()"
                      >
                        取消
                      </el-button>
                      <el-button
                        type="primary"
                        @click="modifyProdPrice(row.spuId, currentModifyProdSkuList)"
                      >
                        保存
                      </el-button>
                    </div>
                  </div>
                  <!-- 触发弹窗出现的按钮 -->
                  <template #reference>
                    <el-icon
                      v-show="row.spuId==currentMoveSpuId || (row.spuId==currentClickSpuId && currentShowPopover=='priceFee')"
                      :ref="`editPriceBtn${row.spuId}`"
                      v-permission="['product:spu:modifyProdPrice']"
                    >
                      <EditPen />
                    </el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="市场价"
            prop="marketPriceFee"
            width="auto"
            sortable="custom"
          >
            <template #default="{ row }">
              <span class="table-cell-text">{{ row.marketPriceFee }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="累计销量"
            prop="saleNum"
            width="auto"
            sortable="custom"
            min-width="120"
          />
          <el-table-column
            label="库存"
            prop="stock"
            width="auto"
            sortable="custom"
          >
            <template #default="{ row, $index }">
              <div class="table-cell-text">
                <span>{{ row.stock }}</span>
                <el-popover
                  v-if="!(row.supplierDeliveryType === 1 || row.spuMold === 2 || (row.spuMold === 3 && row.isBindVoucher === 1))"
                  :visible="row.visible"
                  trigger="click"
                  placement="bottom"
                  width="auto"
                  class="popover-box-height"
                  @show="getProdSku(row.spuId)"
                  @after-enter="getCurrentSpuId(row.spuId, 'prodStock')"
                  @hide="clearShowPopoverInf()"
                >
                  <div v-if="currentModifyProdSkuList.length === 1">
                    <div class="single-input-number">
                      <div class="stock-number">
                        <el-input-number
                          v-model="currentModifyProdSkuList[0].stock"
                          :min="0"
                          :max="9999999"
                          type="number"
                          :controls="false"
                          @blur="onChangeMoldStock(currentModifyProdSkuList[0])"
                        />
                        <div
                          v-if="row.spuMold!==1 && isHaveStockPoint"
                          class="shade"
                          @click="onSetStock(row, currentModifyProdSkuList[0], 0);visibleIndex = $index"
                        />
                      </div>
                      <div class="popover-bottom">
                        <el-button
                          @click="closePopover()"
                        >
                          取消
                        </el-button>
                        <el-button
                          v-permission="['product:spu:modifyProdStock']"
                          type="primary"
                          @click="modifyProdStock(row.spuId, currentModifyProdSkuList)"
                        >
                          保存
                        </el-button>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="currentModifyProdSkuList.length > 1"
                    class="popover-table-con"
                  >
                    <el-table
                      :data="currentModifyProdSkuList"
                      header-cell-class-name="table-header"
                    >
                      <el-table-column
                        prop="skuName"
                        label="规格名称"
                      />
                      <el-table-column
                        prop="stock"
                        label="库存"
                      >
                        <template #default="scope">
                          <div class="stock-number">
                            <el-input-number
                              v-model="scope.row.stock"
                              :max="9999999"
                              :min="0"
                              type="number"
                              style="width: 100%"
                              :controls="false"
                              :disabled="scope.row.status!==1"
                              @blur="onChangeMoldStock(scope.row)"
                            />
                            <div
                              v-if="scope.row.status===1 && row.spuMold!==1 && row.spuMold!==3 && isHaveStockPoint"
                              class="shade"
                              @click="onSetStock(row, scope.row, scope.$index);visibleIndex = $index"
                            />
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div class="popover-bottom">
                      <el-button
                        @click="closePopover()"
                      >
                        取消
                      </el-button>
                      <el-button
                        type="primary"
                        @click="modifyProdStock(row.spuId, currentModifyProdSkuList)"
                      >
                        保存
                      </el-button>
                    </div>
                  </div>
                  <template #reference>
                    <el-icon
                      v-show="row.spuId==currentMoveSpuId || (row.spuId==currentClickSpuId && currentShowPopover=='prodStock')"
                      :ref="`editStockBtn${row.spuId}`"
                      v-permission="['product:spu:modifyProdStock']"
                    >
                      <EditPen />
                    </el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="序号"
            prop="seq"
            width="auto"
            sortable="custom"
          >
            <template #default="{ row }">
              <div class="table-cell-text">
                <span>{{ row.exhibitionSeq }}</span>
                <el-popover
                  placement="bottom"
                  trigger="click"
                  width="auto"
                  @after-enter="getCurrentSpuId(row.spuId, 'seq')"
                  @hide="initProdInf(row)"
                >
                  <el-input-number
                    v-model="row.seq"
                    type="number"
                    :max="32767"
                    :min="0"
                    controls-position="right"
                  />
                  <div class="popover-bottom">
                    <el-button
                      @click="closePopover()"
                    >
                      取消
                    </el-button>
                    <el-button
                      type="primary"
                      @click="modifySeq(row)"
                    >
                      保存
                    </el-button>
                  </div>
                  <template #reference>
                    <el-icon
                      v-show="row.spuId === currentMoveSpuId || (row.spuId === currentClickSpuId && currentShowPopover === 'seq')"
                      v-permission="['product:spu:modifySeq']"
                    >
                      <EditPen />
                    </el-icon>
                  </template>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="商品类别"
            prop="spuMold"
            width="auto"
          >
            <template #default="{ row }">
              <div v-if="row.spuMold === 0">
                实物商品
              </div>
              <div v-else-if="row.spuMold === 1">
                虚拟商品
              </div>
              <div v-else-if="row.spuMold === 2">
                组合商品
              </div>
              <div v-else-if="row.spuMold === 3">
                电子卡券
              </div>
              <div v-else>
                --
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="商品类型"
            prop="spuType"
            width="auto"
          >
            <template #default="{ row }">
              <div v-if="row.spuType === 0">
                普通商品
              </div>
              <div v-if="row.spuType === 1">
                拼团商品
              </div>
              <div v-if="row.spuType === 2">
                秒杀商品
              </div>
              <div v-if="row.spuType === 5">
                组合选品
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="商品状态"
            prop="spuStatus"
            width="auto"
          >
            <template #default="{ row }">
              <span v-if="row.spuStatus === 0">下架</span>
              <span v-if="row.spuStatus === 1">上架</span>
              <span v-if="row.spuStatus === 2">违规下架</span>
              <span v-if="row.spuStatus === 3">违规下架待审核</span>
              <span v-if="row.spuStatus === 4">待审核</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('table.actions')"
            width="180"
          >
            <template #default="{ row }">
              <div class="table-btn-con">
                <el-button
                  v-permission="['product:spu:edit']"
                  type="primary"
                  link
                  @click="toReleaseProdPage(row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-show="row.spuStatus === 0"
                  v-permission="['product:spu:prodSale']"
                  type="primary"
                  link
                  @click="prodSale(row)"
                >
                  上架
                </el-button>
                <el-button
                  v-show="row.spuStatus === 1"
                  v-permission="['product:spu:prodNotSale']"
                  type="primary"
                  link
                  @click="prodNotSale(row.spuId)"
                >
                  下架
                </el-button>
                <el-button
                  v-show="row.spuStatus === 2"
                  v-permission="['product:spu:applyOnline']"
                  type="primary"
                  link
                  @click="offlineManageHandle(row)"
                >
                  申请上线
                </el-button>
                <el-button
                  v-show="row.spuStatus === 3"
                  v-permission="['product:spu:viewAudit']"
                  type="primary"
                  link
                  @click="offlineManageHandle(row)"
                >
                  等待审核
                </el-button>
                <el-button
                  v-permission="['product:spu:delete']"
                  type="primary"
                  link
                  @click="prodDelete(row.spuId)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination
      v-show="pageData.total>0"
      class="pagination"
      :page-sizes="[10, 20, 30, 50]"
      :current-page="pageQuery.pageNum"
      :page-size="pageQuery.pageSize"
      :total="pageData.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
    <!-- 下架管理 -->
    <offline-manage
      v-if="operateDialogVisible"
      ref="offlineDataRef"
      @on-re-apply-data-submit="rereapplyDataSubmit"
    />
    <spu-upload
      v-if="uploadVisible"
      ref="spuUploadRef"
      @refresh-data-list="getWaitingConsignmentExcel"
    />
    <!-- 库存设置 -->
    <stock-update
      v-if="stockUpdateVisible"
      ref="stockUpdateRef"
      :is-need-verify-delivery="true"
      :delivery-mode="selectDeliveryMode"
      :is-hide-station="stockPointInfo.stationSize === 0"
      @set-stock-callback="onSetStockCallback"
      @close="onClose"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/product/list'
import * as categoryApi from '@/api/product/category'
import OfflineManage from '@/components/offline-manage/index.vue'
import SpuUpload from './spu-upload.vue'
import { treeDataTranslate } from '@/utils'
import Big from 'big.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStockPointInfo } from '@/api/stock/warehouse-station.js'

let tempSearchForm = null
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const uploadVisible = ref(false)
const isSubmit = ref(false)
const selectedMenu = ref([])
const selectedPlatformCategories = ref([])
const categoryList = ref([]) // 店铺分类
const platformCategories = ref([]) // SaaS分类
const categoryListTreeProps = reactive({
  value: 'categoryId',
  label: 'name'
})
const platformCategoriesTreeProps = reactive({
  value: 'categoryId',
  label: 'name',
  checkStrictly: true
})
const prodStatusRadio = ref(0)
const currentMoveSpuId = ref('') // 移入项的spuId
const currentClickSpuId = ref('') // 点击项的spuId
const currentShowPopover = ref('') // 当前展示的弹窗
// 多选
const isSelectedAll = ref(false)
const isIndeterminate = ref(false)
const checkedCount = ref(0)
const selectedProdList = ref([]) // 被选中的商品列表
// 查询的参数
const searchForm = reactive({
  prodCode: '',
  spuName: '',
  saleBeginInp: null,
  saleEndInp: null,
  currentPriceBeginInp: null,
  currentPriceEndInp: null,
  spuMold: '',
  spuStatus: '',
  spuType: '',
  spuOrigin: '', // 商品来源
  supplierDeliveryType: '',
  spuIds: []
})
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})
// 返回参数
const pageData = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
const currentModifyProdSkuList = ref([]) // 当前准备修改的商品的规格列表
const currentModifyProdName = reactive({ spuNameZh: null, spuNameEn: null }) // 当前准备修改的商品的规格列表

let currentSpuId = null // 商品id
const operateDialogVisible = ref(false) // 操作对话框
const editItem = ref('') // 编辑项的ref值
// computed: {
//   language () {
//     return $store.getters.language === 'zh' ? 1 : 2
//   }
// },
const { query } = useRoute()
onMounted(() => {
  isSubmit.value = false
  searchForm.keyword = query.spuName ? query.spuName : searchForm.keyword
  searchForm.spuId = query.spuId
  getProdList()
  getProdCategoryList() // 店铺分类
  getPlatformCategories() // SaaS分类
  onGetStockPointInfo() // 获取库存点信息
})

// 条件搜索
const conditionSearch = (newData = false) => {
  loadsearchForm()
  getProdList(newData)
}
const loadsearchForm = () => {
  const dataType = parseInt(prodStatusRadio.value)
  pageQuery.pageNum = 1
  searchForm.spuId = searchForm.prodId || undefined
  searchForm.partyCodes = searchForm.prodCode || undefined
  searchForm.partyCodes = searchForm.partyCodes || undefined
  searchForm.shopPrimaryCategoryId = searchForm.shopPrimaryCategoryId || undefined
  searchForm.shopSecondaryCategoryId = searchForm.shopSecondaryCategoryId || undefined
  searchForm.primaryCategoryId = searchForm.primaryCategoryId || undefined
  searchForm.secondaryCategoryId = searchForm.secondaryCategoryId || undefined
  searchForm.categoryId = searchForm.categoryId || undefined
  searchForm.minSaleNum = searchForm.saleBeginInp || undefined
  searchForm.maxSaleNum = searchForm.saleEndInp || undefined
  searchForm.secondaryCategoryId = searchForm.secondaryCategoryId || undefined
  searchForm.minPrice = accuracyCount(searchForm.currentPriceBeginInp, 100, 2) || undefined
  searchForm.maxPrice = accuracyCount(searchForm.currentPriceEndInp, 100, 2) || undefined
  searchForm.isCompose = searchForm.currentyuPreSaleStatus === '' ? undefined : searchForm.currentyuPreSaleStatus
  searchForm.sort = searchForm.sort || undefined
  searchForm.dataType = dataType
}
/**
 * 获取商品列表
 */
const getProdList = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery, ...searchForm }
  } else {
    tempSearchForm.pageNum = pageQuery.pageNum
    tempSearchForm.pageSize = pageQuery.pageSize
  }
  pageLoading.value = true
  uploadVisible.value = false
  tempSearchForm.keyword = tempSearchForm.spuName
  // 在【在售中】商品列表搜索下架、平台下架、违规下架待审核状态时，显示【暂无数据】；在【已下架】商品列表中搜索上架状态时，显示【暂无数据】
  if ((tempSearchForm.dataType === 1 && (tempSearchForm.spuStatus === 0 || tempSearchForm.spuStatus === 2 || tempSearchForm.spuStatus === 3 || tempSearchForm.spuStatus === 4)) ||
    (tempSearchForm.dataType === 3 && tempSearchForm.spuStatus === 1)
  ) {
    pageData.list = []
    pageData.pages = 0
    pageData.total = 0
    return
  }

  api.page(tempSearchForm).then(res => {
    pageData.list = res.list || []
    pageData.list.forEach(item => {
      item.showSpuName = item.spuName
      item.exhibitionSeq = item.seq
      item.isSelected = false
      item.priceFee = formatPrice(item.priceFee, 1).toFixed(2)
      item.marketPriceFee = formatPrice(item.marketPriceFee, 1).toFixed(2)
    })
    pageData.pages = res.pages
    pageData.total = res.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
  isSelectedAll.value = false
  isIndeterminate.value = false
  selectedProdList.value = []
  checkedCount.value = 0
}
const onRangeChange = (type) => {
  if (type === 'sale') {
    const start = searchForm.saleBeginInp
    const end = searchForm.saleEndInp
    if (start > end) {
      searchForm.saleBeginInp = end
      searchForm.saleEndInp = start
    }
  } else if (type === 'price') {
    const start = searchForm.currentPriceBeginInp
    const end = searchForm.currentPriceEndInp
    if (start > end) {
      searchForm.currentPriceBeginInp = end
      searchForm.currentPriceEndInp = start
    }
  }
}
// 获取店铺分类
const getProdCategoryList = () => {
  pageLoading.value = true
  categoryApi.enableCategories({}).then(pageVO => {
    categoryList.value = treeDataTranslate(pageVO, 'categoryId', 'parentId')
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
/**
 * 获取SaaS分类
 */
const getPlatformCategories = () => {
  pageLoading.value = true
  categoryApi.getMySigningCategoryList().then(pageVO => {
    platformCategories.value = treeDataTranslate(pageVO, 'categoryId', 'parentId')
    platformCategories.value = removeNotThirdCategoryItem(platformCategories.value)
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

/**
 * 去除没有三级分类的类目
 */
const removeNotThirdCategoryItem = (treeData) => {
  const firstCategory = treeData
  const length = firstCategory.length
  for (let i = 0, index = 0; i < length; i++) {
    if (firstCategory[index].level !== 2) {
      if (firstCategory[index].children && firstCategory[index].children.length > 0 && (firstCategory[index].children.some(item => item.children) || firstCategory[index].level !== 0)) {
        const secondCategory = firstCategory[index].children
        firstCategory[index].children = removeNotThirdCategoryItem(secondCategory)
      } else {
        firstCategory.splice(index, 1)
        // 当前位置的元素已经被删除，当前位置索引不用++
        continue
      }
    }
    index++
  }
  return firstCategory
}
// loadLangInfo(data) {
//   const langType = language
//   data.forEach(category => {
//     category.categoryLangList.forEach(item => {
//       if (langType === item.lang) {
//         category.name = item.name
//       }
//     })
//   })
// },
// 监听店铺分类选择的变化
const handleSelectCategoryChange = (val) => {
  if (val.length === 1) { // 长度为1，表明当前选择的是一级分类（点击了一级分类）
    searchForm.shopPrimaryCategoryId = val[0] // 商家一级分类id
    searchForm.shopSecondaryCategoryId = undefined
  } else if (val.length === 2) { // 长度为2，表明当前选择的是二级分类（点击了二级分类）
    searchForm.shopPrimaryCategoryId = undefined
    searchForm.shopSecondaryCategoryId = val[1] // 商家二级分类id
  } else {
    searchForm.shopPrimaryCategoryId = undefined
    searchForm.shopSecondaryCategoryId = undefined
  }
  // searchForm.categoryId = val[val.length - 1]
  // if (searchForm.categoryId === undefined) {
  //   searchForm.categoryId = 0
  // }
}

/**
 * 监听SaaS分类选择变化
 */
const handlePlatformCategoryChange = (val) => {
  searchForm.primaryCategoryId = undefined
  searchForm.secondaryCategoryId = undefined
  searchForm.categoryId = undefined
  if (val.length === 1) { // 长度为1，表明当前选择的是一级分类（点击了一级分类）
    searchForm.primaryCategoryId = val[0] // 平台一级分类id
  } else if (val.length === 2) { // 长度为2，表明当前选择的是二级分类（点击了二级分类）
    searchForm.secondaryCategoryId = val[1] // 平台二级分类id
  } else if (val.length === 3) { // 长度为3，表明当前选择的是三级分类（点击了三级分类）
    searchForm.categoryId = val[2] // 平台三级分类id
  }
}

// 切换不同状态的商品展示
// 0：代表全部商品
// 1：在售中的商品
// 2：已售完的商品
// 3：已下架的商品
const switchProdList = () => {
  isSelectedAll.value = false
  isIndeterminate.value = false
  pageQuery.pageNum = 1
  conditionSearch(true)
}
const commonStore = useCommonStore()
const router = useRouter()
// 跳转发布商品页
const toReleaseProdPage = (row) => {
  /* 判断是否拥有权限 */
  const routeList = commonStore.routeList
  let flag = 0
  routeList.forEach(item => {
    if (item.children) {
      item.children.forEach(el => {
        if (el.path === '/product/manage' && el.children) {
          el.children.forEach(element => {
            if (element.path === 'prod-info') {
              flag = 1
            }
          })
        }
      })
    }
  })
  if (!flag) {
    return ElMessage.error('您暂时没有权限访问')
  }
  if (row === -1) {
    router.push('/product/manage/prod-info')
  } else {
    // 判断是否为供应商商品
    router.push('/product/manage/prod-info?spuId=' + row.spuId + (row.supplierSpuType === 1 || row.supplierSpuType === 2 ? '&postingSteps=2' : ''))
  }
}
// 导出excel
const soldExcel = () => {
  loadsearchForm()
  if (pageData.total === 0) {
    ElMessage({
      message: '没有商品可以导出！',
      duration: 1500
    })
    return
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true

  const dataType = parseInt(prodStatusRadio.value)
  searchForm.spuId = searchForm.prodId || undefined
  searchForm.partyCode = searchForm.prodCode || undefined
  searchForm.name = searchForm.spuName || undefined
  searchForm.shopPrimaryCategoryId = searchForm.shopPrimaryCategoryId || undefined
  searchForm.shopSecondaryCategoryId = searchForm.shopSecondaryCategoryId || undefined
  searchForm.primaryCategoryId = searchForm.primaryCategoryId || undefined
  searchForm.secondaryCategoryId = searchForm.secondaryCategoryId || undefined
  searchForm.categoryId = searchForm.categoryId || undefined
  searchForm.minSaleNum = searchForm.saleBeginInp || undefined
  searchForm.maxSaleNum = searchForm.saleEndInp || undefined
  searchForm.secondaryCategoryId = searchForm.secondaryCategoryId || undefined
  searchForm.minPrice = accuracyCount(searchForm.currentPriceBeginInp, 100, 2) || undefined
  searchForm.maxPrice = accuracyCount(searchForm.currentPriceEndInp, 100, 2) || undefined
  searchForm.isCompose = searchForm.currentyuPreSaleStatus === '' ? undefined : searchForm.currentyuPreSaleStatus
  searchForm.sort = searchForm.sort || undefined
  searchForm.dataType = dataType
  searchForm.spuIds = selectedProdList.value.map(el => el.spuId) || undefined
  searchForm.imgDomain = resourcesUrl
  api.soldExcel({ ...searchForm }).then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
    // var blob = data
    const fileName = '商品信息.xlsx'
    const elink = document.createElement('a')
    if ('download' in elink) { // 非IE下载
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
    isSubmit.value = false
  }).catch((e) => {
    ElMessage.error(e)
    isSubmit.value = false
  })
}

const spuUploadRef = ref(null)
const uploadSpu = () => {
  uploadVisible.value = true
  nextTick(() => {
    spuUploadRef.value.init()
  })
}

const getWaitingConsignmentExcel = () => {
  getProdList()
}

/**
 * 监听表格选中
 */
const onSelectSome = (val) => {
  selectedProdList.value = val
  checkedCount.value = val.length
  isSelectedAll.value = (pageData.list.length && val.length === pageData.list.length)
}
const prodListTableRef = ref()
/**
 * 全选按钮
 */
const onSelectAll = () => {
  isSelectedAll.value = prodListTableRef.value.getSelectionRows().length < pageData.list.length
  prodListTableRef.value.toggleAllSelection()
}

/**
 * 条件排序
 * @param {String} sortType
 * priceFee:当前价       5-正序 4-倒序
 * marketPriceFee:市场价 8-正序 7-倒序
 * actualSoldNum:实际销量      18-正序 17-倒序
 * stock:库存            11-正序 10-倒序
 * seq:序号              13-正序 12-倒序
 */
const prodConditionSort = (data) => {
  const { order, prop: sortType } = data
  let sort = null
  pageQuery.pageNum = 1
  if (sortType === 'priceFee') {
    sort = order ? order === 'ascending' ? 5 : 4 : null
  } else if (sortType === 'marketPriceFee') {
    sort = order ? order === 'ascending' ? 8 : 7 : null
  } else if (sortType === 'actualSoldNum') {
    sort = order ? order === 'ascending' ? 18 : 17 : null
  } else if (sortType === 'stock') {
    sort = order ? order === 'ascending' ? 11 : 10 : null
  } else if (sortType === 'seq') {
    sort = order ? order === 'ascending' ? 13 : 12 : null
  } else if (sortType === 'saleNum') {
    sort = order ? order === 'ascending' ? 3 : 2 : null
  }
  searchForm.sort = sort
  getProdList(true)
}

// 改变商品状态
// onTheShelf:上架
// offTheShelf:下架
const changeProdStatus = (status) => {
  // 如果没选商品，提示选择商品
  if (selectedProdList.value.length <= 0) {
    ElMessage({
      message: '请选择商品',
      type: 'warning'
    })
    return
  }

  if (status === 'onTheShelf') {
    prodSale(selectedProdList.value)
  } else if (status === 'offTheShelf') {
    prodNotSale(selectedProdList.value)
  }
}
// 商品上架
const prodSale = (spuIdOrSpuIds) => {
  // 是否操作单个商品
  const isSingle = !spuIdOrSpuIds.length
  // 过滤未导入商品
  if (!isSingle) {
    const isEveryNotSynUpdate = spuIdOrSpuIds.every(item => item.isSynUpdate !== -1)
    if (!isEveryNotSynUpdate) {
      ElMessage({
        message: '未完善的商品信息不能进行上架操作',
        type: 'warning'
      })
      return
    }
  } else {
    if (spuIdOrSpuIds.isSynUpdate === -1) {
      ElMessage({
        message: '请完善该商品信息',
        type: 'warning'
      })
      return
    }
  }
  const param = {
    status: 1,
    spuId: isSingle ? spuIdOrSpuIds.spuId : undefined,
    spuIds: isSingle ? undefined : spuIdOrSpuIds.map(item => { return item.spuId })
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.updateProdStatus(param).then(() => {
    ElMessage({
      message: '商品上架成功',
      type: 'success',
      duration: 1500,
      onClose: () => getProdList()
    })
    isSubmit.value = false
  }).catch(e => {
    isSubmit.value = false
  })
}
// 商品下架
const prodNotSale = (spuIdOrSpuIds) => {
  // 是否操作单个商品
  const isSingle = typeof (spuIdOrSpuIds) === 'number'
  const prodList = pageData.list.filter(item => {
    return item.spuStatus === 0
  })
  let flag = 0
  for (let i = 0; i < prodList.length; i++) {
    for (let j = 0; j < spuIdOrSpuIds.length; j++) {
      if (spuIdOrSpuIds[j].spuId === prodList[i].spuId) {
        flag = 1
        break
      }
    }
    if (flag) {
      break
    }
  }
  if (flag) {
    ElMessage.error('请勿选择已经下架的商品')
    return
  }
  const param = {
    status: 0,
    spuId: isSingle ? spuIdOrSpuIds : undefined,
    spuIds: isSingle ? undefined : spuIdOrSpuIds.map(item => { return item.spuId })
  }
  if (isSubmit.value) {
    return
  }
  ElMessageBox.confirm($t('order.order.offlineTip'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    isSubmit.value = true
    api.updateProdStatus(param).then(() => {
      ElMessage({
        message: '商品下架成功',
        type: 'success',
        duration: 1500,
        onClose: () => getProdList()
      })
      isSubmit.value = false
    }).catch(e => {
      isSubmit.value = false
    })
  }).catch(() => { })
}

/**
 * 商品违规下架操作
 */
const offlineManageHandle = (row) => {
  operateDialogVisible.value = true
  currentSpuId = row.spuId
  getOfflineDetailByProdId(row.spuId)
}
const offlineDataRef = ref(null)
/**
 * 获取最新下线商品的事件
 */
const getOfflineDetailByProdId = (spuId) => {
  api.getOfflineHandleEvent(spuId).then((data) => {
    // offlineDetail = data
    nextTick(() => {
      offlineDataRef.value.init(data)
    })
  })
}

/**
 * 提交上架申请
 */
const rereapplyDataSubmit = (data) => {
  const param = {
    handleId: currentSpuId,
    eventId: data.eventId,
    reapplyReason: data.reapplyReason // 申请理由
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.auditApply(param).then(() => {
    operateDialogVisible.value = false
    ElMessage({
      message: '提交成功',
      type: 'success',
      duration: 1000,
      onClose: () => getProdList()
    })
    isSubmit.value = false
  }).catch(e => {
    isSubmit.value = false
  })
}

// 商品删除
const prodDelete = (spuId) => {
  if (isSubmit.value) {
    return
  }
  ElMessageBox.confirm($t('order.order.deleteTip'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    isSubmit.value = true
    api.deleteById(spuId).then(() => {
      ElMessage({
        message: '商品删除成功',
        type: 'success',
        duration: 1500,
        onClose: () => getProdList()
      })
      isSubmit.value = false
    }).catch(e => {
      isSubmit.value = false
    })
  }).catch(() => { })
}

// 批量删除商品
const batchDeleteByIds = () => {
  if (selectedProdList.value.length <= 0) {
    ElMessage({
      message: '请选择商品',
      type: 'warning'
    })
    return
  }
  ElMessageBox.confirm($t('order.order.deleteTip'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    isSubmit.value = true
    api.deleteByIds(selectedProdList.value.map(el => el.spuId)).then(() => {
      ElMessage({
        message: '商品删除成功',
        type: 'success',
        duration: 1500,
        onClose: () => getProdList()
      })
      isSubmit.value = false
    }).catch(e => {
      isSubmit.value = false
    })
  }).catch(() => { })
}

/**
 * 鼠标移入单元格
 */
const cellMouseEnter = (row) => {
  currentMoveSpuId.value = row.spuId
}
/**
 * 鼠标移出单元格
 */
const cellMouseLeave = () => {
  currentMoveSpuId.value = ''
}

// 获取弹出弹窗项信息
const getCurrentSpuId = (spuId, currentShowPopoverInfo) => {
  currentClickSpuId.value = spuId
  currentShowPopover.value = currentShowPopoverInfo
}

// 清空选中项弹窗信息
const clearShowPopoverInf = () => {
  editItem.value = ''
  currentClickSpuId.value = ''
  currentShowPopover.value = ''
  currentModifyProdSkuList.value = []
  selectDeliveryMode.value = {}
}

const selectDeliveryMode = ref({})
/**
 * 获取商品sku列表
 */
const getProdSku = (spuId) => {
  currentModifyProdSkuList.value.splice(0, currentModifyProdSkuList.value.length)
  selectDeliveryMode.value = {}
  api.get(spuId).then(data => {
    selectDeliveryMode.value = data.deliveryMode ? JSON.parse(data.deliveryMode) : {}
    currentModifyProdSkuList.value = data.skus
    currentModifyProdSkuList.value.forEach(item => {
      item.originalStock = item.stock
      item.priceFee = parseFloat(formatPrice(item.priceFee, 1).toFixed(2))
      item.oldPriceFee = item.priceFee
      item.marketPriceFee = parseFloat(formatPrice(item.marketPriceFee, 1).toFixed(2))
      item.spuMold = data.spuMold
      item.OriginalPointStock = item.stockPointList?.reduce((acc, cur) => acc + cur.stock, 0)

      // 非自提商品，则将门店相关库存过滤并存储（提交时携带回去）
      if (!selectDeliveryMode.value.hasUserPickUp && !selectDeliveryMode.value.hasCityDelivery) {
        item.filterList = []
        item.stockPointList = item.stockPointList?.filter(stockItem => {
          if (stockItem.stockPointType === 2) {
            // 存储门店相关库存
            item.filterList.push(stockItem)
          }
          return stockItem.stockPointType === 1
        })
      }
    })
  })
}

/**
 * 获取商品名称列表
 */
const getProdName = (spuId) => {
  api.get(spuId).then(data => {
    data.spuLangList.forEach(spuLang => {
      if (spuLang.lang === 1) {
        currentModifyProdName.spuNameZh = spuLang.spuName
        currentModifyProdName.spuNameZhOld = spuLang.spuName
      } else {
        currentModifyProdName.spuNameEn = spuLang.spuName
        currentModifyProdName.spuNameEnOld = spuLang.spuName
      }
    })
  })
}

// 关闭弹窗后,初始化数据
const initProdInf = (row) => {
  row.spuName = row.showSpuName
  row.seq = row.exhibitionSeq
  clearShowPopoverInf()
}

// 关闭popover弹窗
const closepopoverRef = ref(null)
const closePopover = () => {
  closepopoverRef.value.click()
}

// 修改商品名称
const modifyProdName = (row) => {
  const nameObject = currentModifyProdName
  if (nameObject.spuNameZh.trim() === '') {
    ElMessage({
      message: '请输入中文商品名称',
      type: 'warning'
    })
    return
  } else if (nameObject.spuNameZh === nameObject.spuNameZhOld && nameObject.spuNameEn === nameObject.spuNameEnOld) {
    closePopover()
    return
  }
  const spuLangList = [{ lang: 1, spuName: nameObject.spuNameZh }]
  if (nameObject.spuNameEn) {
    spuLangList.push({ lang: 2, spuName: nameObject.spuNameEn })
  }
  const param = {
    spuId: row.spuId,
    spuLangList
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.updatePartProdStatus({ ...param }).then(() => {
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        getProdList()
        closePopover()
      }
    })
    isSubmit.value = false
  }).catch(e => {
    isSubmit.value = false
  })
}
// 修改商品价格
const modifyProdPrice = (spuId, skus) => {
  const skuList = []
  let isChangePriceFee = false
  let minPriceFee = 0
  // 判断是否价格有变动,没有变动不更新价格,关闭弹窗即可
  for (let i = 0; i < skus.length; i++) {
    if (skus[i].oldPriceFee !== skus[i].priceFee) {
      isChangePriceFee = true
      break
    }
  }

  if (isChangePriceFee === false) {
    closePopover()
    return
  }
  // 把需要传递的参数,单独取出来
  for (let i = 0; i < skus.length; i++) {
    if (skus[i].priceFee === '') {
      ElMessage({
        message: '请输入商品价格',
        type: 'warning'
      })
      return
    } else if (parseFloat(skus[i].priceFee) < 0.01) {
      ElMessage({
        message: '商品价格不能小于0.01',
        type: 'warning'
      })
      return
    } else {
      skuList.push({
        priceFee: accuracyCount(skus[i].priceFee, 100, 2),
        skuId: skus[i].skuId
      })
    }
  }
  // 获取多种规格下的最小价格
  minPriceFee = skuList[0].priceFee
  for (let i = 1; i < skuList.length; i++) {
    if (minPriceFee > skuList[i].priceFee) {
      minPriceFee = skuList[i].priceFee
    }
  }
  const param = {
    spuId,
    priceFee: minPriceFee,
    skuList
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.updatePartProdStatus({ ...param }).then(() => {
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        getProdList()
        closePopover()
      }
    })
    isSubmit.value = false
  }).catch(e => {
    isSubmit.value = false
  })
}

const stockPointInfo = ref({})
// 获取库存点信息
const onGetStockPointInfo = () => {
  getStockPointInfo().then((res) => {
    stockPointInfo.value = res
  })
}

/**
 * 是否存在库存点，存在多余库存点时，修改库存才进行弹窗
 * @type {ComputedRef<unknown>}
 */
const isHaveStockPoint = computed(() => {
  if (stockPointInfo.value.warehouseSize > 1) {
    // 仓库数量大于1（除默认仓库外还存在仓库），则直接返回true
    return true
  } else if ((selectDeliveryMode.value.hasUserPickUp || selectDeliveryMode.value.hasCityDelivery) && stockPointInfo.value.stationSize > 0) {
    // 开启了自提，且门店数量大于0返回true
    return true
  }
  return false
})

// 修改规格库存（虚拟商品/无库存点时）
const onChangeMoldStock = (row) => {
  row.stock = row.stock ? row.stock : 0
  if (row.spuMold === 1 || !isHaveStockPoint.value || (row.spuMold === 3 && row.isBindVoucher !== 1)) {
    row.stockPointList[0].changeStock = row.stock - (row.stockPointList[0].stock - (row.stockPointList[0].changeStock || 0))
    row.stockPointList[0].stock = row.stock || 0
  }
}

// 修改商品库存
const modifyProdStock = (spuId, skus) => {
  const skuList = []
  let totalChangeStock = 0
  let stockPointListChangeFlag = false
  for (let i = 0; i < skus.length; i++) {
    let changeStock = 0
    if (skus[i].stock === '' || skus[i].stock === undefined) {
      ElMessage({
        message: '请输入商品库存',
        type: 'warning'
      })
      return
    } else {
      if (skus[i].filterList && skus[i].stockPointList.length) {
        skus[i].stockPointList = skus[i].stockPointList.concat(skus[i].filterList)
        skus[i].filterList = []
      }
      changeStock = parseInt(skus[i].stock - skus[i].originalStock)
      totalChangeStock += changeStock
      skuList.push({
        changeStock,
        skuId: skus[i].skuId,
        stockPointList: skus[i].stockPointList
      })
      if (!stockPointListChangeFlag) {
        let tempPointTotalStock = 0
        for (const pItem of skus[i].stockPointList) {
          tempPointTotalStock += pItem.stock
        }
        if (tempPointTotalStock !== skus[i].OriginalPointStock) {
          stockPointListChangeFlag = true
        }
      }
    }
  }
  // 如果库存没有发生改变,就不更新库存,只关闭弹窗
  let skuChange = false
  for (let skuIndex = 0; skuIndex < skuList.length; skuIndex++) {
    if (skuList[skuIndex].changeStock !== 0) {
      skuChange = true
      break
    }
    for (let stockPointIndex = 0; stockPointIndex < skuList[skuIndex].stockPointList.length; stockPointIndex++) {
      if (skuList[skuIndex].stockPointList[stockPointIndex].changeStock && skuList[skuIndex].stockPointList[stockPointIndex].changeStock !== 0) {
        skuChange = true
        break
      }
    }
    if (skuChange) {
      break
    }
  }
  if (!skuChange && !stockPointListChangeFlag) {
    closePopover()
    return
  }
  const param = {
    spuId,
    changeStock: totalChangeStock,
    skuList
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.updatePartProdStatus({ ...param }).then(() => {
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        getProdList()
        closePopover()
      }
    })
    isSubmit.value = false
  }).catch(e => {
    isSubmit.value = false
  })
}

// 修改序号
const modifySeq = (scope) => {
  if (scope.seq === '') {
    ElMessage({
      message: '请输入序号',
      type: 'warning'
    })
    return
  } else if (scope.exhibitionSeq === scope.seq) {
    closePopover()
    return
  } else if (scope.seq > 32767) {
    scope.seq = 32767
  }
  const param = {
    spuId: scope.spuId,
    seq: scope.seq
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.updatePartProdStatus({ ...param }).then(() => {
    ElMessage({
      message: '修改成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        getProdList()
        closePopover()
      }
    })
    isSubmit.value = false
  }).catch(e => {
    isSubmit.value = false
  })
}
// 每页数
const sizeChangeHandle = (val) => {
  pageQuery.pageSize = val
  pageQuery.pageNum = 1
  getProdList()
}
// 当前页
const currentChangeHandle = (val) => {
  pageQuery.pageNum = val
  getProdList()
}

/**
 * 精度运算
 * @param {Number} a:第一个计算数(例如:被除数/被减数)
 * @param {Number} b:第二个计算数(例如:除数/减数)
 * @param {Number} countMode:计算方式(0:加 1:减 2:乘 3:除)
 */
const accuracyCount = (a, b, countMode) => {
  if (!a && a !== 0) {
    return null
  }
  let finalResult = 0
  if (countMode === 0) {
    finalResult = new Big(a).plus(b).valueOf()
  } else if (countMode === 1) {
    finalResult = new Big(a).minus(b).valueOf()
  } else if (countMode === 2) {
    finalResult = new Big(a).times(b).valueOf()
  } else if (countMode === 3) {
    finalResult = new Big(a).div(b).valueOf()
  } else {
    return
  }
  return parseInt(finalResult)
}
/**
 * 清空
 */
const clearSearchInfo = () => {
  searchForm.saleBeginInp = ''
  searchForm.saleEndInp = ''
  searchForm.currentPriceBeginInp = ''
  searchForm.currentPriceEndInp = ''
  searchForm.primaryCategoryId = ''
  searchForm.secondaryCategoryId = ''
  searchForm.categoryId = ''
  searchForm.shopPrimaryCategoryId = ''
  searchForm.shopSecondaryCategoryId = ''
  searchForm.prodCode = ''
  searchForm.spuName = ''
  selectedMenu.value = []
  selectedPlatformCategories.value = []
  searchForm.spuMold = ''
  searchForm.spuStatus = ''
  searchForm.spuType = ''
  searchForm.supplierDeliveryType = ''
  searchForm.spuOrigin = ''
}

const stockUpdateVisible = ref(false)
const stockUpdateRef = ref(null)
const onSetStock = (listValue, row, index) => {
  listValue.visible = true
  stockUpdateVisible.value = true
  nextTick(() => {
    stockUpdateRef.value.init(row, index)
  })
}

// 修改库存弹窗回调
const onSetStockCallback = (res, sum, index) => {
  currentModifyProdSkuList.value[index].stock = sum
  currentModifyProdSkuList.value[index].stockPointList = res
}
const visibleIndex = ref(undefined)
// 修改库存弹窗关闭执行
const onClose = () => {
  pageData.list[visibleIndex.value].visible = undefined
}
</script>

<style lang="scss" scoped>
.page-product-list {
  padding: 20px;
  // 1.筛选条件搜索
  .search-bar {
    padding: 20px;
    background: #f9f9f9;
  }

  .input-row{
    :deep(.el-input){
      width: 200px;
    }

    .range-box{
      display: flex;

      .interval-line{
        margin: 0 10px;
      }
    }
  }
  .main-content {
    .operation-bar {
      display: flex;
      align-items: center;
      .had-selected-tips {
        font-size: 12px;
        margin-left: 12px;
        color: #155bd4;
      }
      .all-check-btn {
        margin: 0 15px;
      }

      :deep(.el-radio-group){
        margin-right: 10px;
      }
      .dropdown-btn {
        margin-left: 10px;
      }
    }
    .table-con {
      .table-cell-con {
        .table-cell-text {
          display: flex;
          justify-content: space-between;
          .prod-name {
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            word-break: break-word;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      }
      .table-cell-text {
        display: flex;
        align-items: center;
        :deep(.el-icon) {
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }
  }
}
.pagination {
  text-align: right;
}
.popover-table-con {
  width: 370px;
  max-height: 400px;
  overflow-y: auto;
}
.spu-name-input-con {
  display: flex;
}
.popover-bottom {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.single-input-number,
.popover-table-con {
  .stock-number {
    position: relative;
    .shade {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      cursor: pointer;
    }
  }
}
</style>
<style scoped>
.single-input-number :deep(.el-input-number--small) { width: 100%; }
:deep(.table-row) {
  height: 100px !important;
}
</style>
