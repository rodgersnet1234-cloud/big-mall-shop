<template>
  <div class="page-prod-info">
    <div class="prod-main-containers">
      <!-- 步骤 -->
      <div class="post-step">
        <div
          class="step-item"
          :class="{ 'active': postingSteps === 1 || postingSteps === 2 || postingSteps === 3 }"
        >
          <!-- 01、选择商品类目 -->
          <div class="step-txt">
            01、选择商品类目
          </div>
        </div>
        <div
          class="step-item"
          :class="{ 'active': postingSteps === 2 || postingSteps === 3 }"
        >
          <!-- 02、编辑商品信息 -->
          <div class="step-txt">
            02、{{ isViewOnly ? '查看商品详情' : '编辑商品信息' }}
          </div>
        </div>
        <div
          v-if="!isViewOnly"
          class="step-item"
          :class="{ 'active': postingSteps === 3 }"
        >
          <!-- 03、编辑商品详情 -->
          <div class="step-txt">
            03、商品详情
          </div>
        </div>
      </div>

      <!-- 内容 -->
      <div class="prod-content">
        <!-- 01、选择商品类目 -->
        <div
          v-show="postingSteps === 1"
          class="prod-content-item"
        >
          <selectCategory
            ref="selectCategoryRef"
            :data-form="dataForm"
            :posting-steps="postingSteps"
            @get-category-selected="getCategorySelected"
            @clear-stock="onClearStock"
          />
        </div>
        <!-- 普通商品 -->
        <div v-show="(postingSteps === 2 && dataForm.goodsType === 0) || (postingSteps === 3 && dataForm.goodsType === 0)">
          <el-form
            ref="dataFormRef"
            class="part-form"
            :model="dataForm"
            :rules="rules"
            label-width="110px"
            @submit.prevent
          >
            <div class="info-box">
              <div v-show="postingSteps === 2">
                <!-- 1.商品基本信息 -->
                <div class="part-content">
                  <div class="part-tit">
                    基本信息
                  </div>
                  <!-- 商品SaaS分类（发布后不可修改） -->
                  <el-form-item
                    label="已选分类"
                    prop="categoryId"
                    class="part-form-div"
                  >
                    <div class="part-form-item">
                      <div class="classify-show">
                        <category-group
                          :selected-categories="selectedCategories"
                          :show-category-select-btn="showCategorySelectBtn"
                          :single="true"
                          :is-platform="true"
                          @select-or-revise-category="selectOrReviseCategory('platform', selectedCategories)"
                        />
                        <el-alert
                          :title="dataForm.spuId ? '商品发布后SaaS分类不可修改' : '商品发布后SaaS分类不可修改，请选择准确的分类'"
                          type="info"
                          class="ca-warning"
                          :closable="false"
                          show-icon
                        />
                      </div>
                      <category-selector
                        v-if="categorySelectorVisible"
                        ref="categorySelectorRef"
                        @get-category-selected="getCategorySelected"
                      />
                    </div>
                  </el-form-item>
                  <!-- </div> -->

                  <!-- 商品店铺分类 -->
                  <el-form-item
                    v-if="!isViewOnly"
                    label=""
                    prop="shopCategoryId"
                    class="part-form-div"
                  >
                    <div class="part-form-item">
                      <div class="classify-show">
                        <category-group
                          :selected-categories="selectedShopCategories"
                          :show-category-select-btn="showShopCategorySelectBtn"
                          :single="true"
                          :is-platform="false"
                          @select-or-revise-category="selectOrReviseCategory('shop', selectedShopCategories)"
                        />
                      </div>
                      <category-selector
                        v-if="categorySelectorVisible"
                        ref="categorySelectorRef"
                        @get-category-selected="getCategorySelected"
                      />
                    </div>
                  </el-form-item>

                  <!-- 商品基本属性 -->
                  <el-form-item
                    v-if="basicAttrs.length > 0"
                    label="基本属性"
                  >
                    <div class="text">
                      请准确填写规格，有利于商品在搜索和推荐中露出，错误填写可能面临商品下架或流量损失！（注：带<span class="stars-icon" />为重要规格，必填）
                    </div>
                    <spu-category-attrs
                      :attrs-list="basicAttrs"
                      @get-value-of-basic-attrs="getValueOfBasicAttrs"
                    />
                  </el-form-item>

                  <!-- 商品名称 -->
                  <div class="prod-name-box">
                    <el-form-item
                      label="商品名称"
                      prop="nameZh"
                      class="prod-name-con"
                    >
                      <el-input
                        v-model="dataForm.nameZh"
                        maxlength="60"
                      />
                      <!-- <div class="el-form-item-tips">{{ $t("product.postProductTips3") }}</div> -->
                      <div class="hint">
                        商品名称建议：商品描述+属性，长度不超过60个字符
                      </div>
                    </el-form-item>
                    <el-form-item
                      v-if="curLang.includes(2)"
                      label-width="0"
                      prop="nameEn"
                      class="prod-name-con"
                    >
                      <el-input
                        v-model="dataForm.nameEn"
                        maxlength="60"
                      />
                      <div class="hint">
                        The suggestion: description + attribute, length cannot exceed 60
                      </div>
                    </el-form-item>
                  </div>

                  <!-- 商品卖点 -->
                  <div class="prod-name-box">
                    <el-form-item
                      label="商品卖点"
                      prop="sellingPointZh"
                      class="prod-name-con"
                    >
                      <el-input
                        v-model="dataForm.sellingPointZh"
                        maxlength="100"
                      />
                      <div class="hint">
                        商品卖点展示在商品名称下面，长度不超过100个字符
                      </div>
                    </el-form-item>
                    <el-form-item
                      v-if="curLang.includes(2)"
                      label-width="0"
                      prop="sellingPointEn"
                      class="prod-name-con"
                    >
                      <el-input
                        v-model="dataForm.sellingPointEn"
                        maxlength="100"
                      />
                      <div class="hint">
                        Displayed under the title, the length cannot exceed 100
                      </div>
                    </el-form-item>
                  </div>

                  <!-- 商品轮播图 -->
                  <el-form-item
                    label="商品轮播图"
                    prop="imgUrls"
                    class="part-form-div"
                  >
                    <div class="part-form-item">
                      <imgs-upload
                        v-model:modelValue="dataForm.imgUrls"
                        @update:model-value="changeImages()"
                      />
                      <div class="banner-tips">
                        建议图片尺寸为 800*800，可拖动排序，最多上传9张，首图为主图
                      </div>
                    </div>
                  </el-form-item>

                  <!-- 商品视频 -->
                  <el-form-item
                    label="商品视频"
                    prop="video"
                    class="part-form-div"
                  >
                    <div class="part-form-item">
                      <video-upload v-model:value="dataForm.video" />
                      <el-button
                        v-if="dataForm.video"
                        class="video-del-btn"
                        type="danger"
                        @click="deleteVideo"
                      >
                        删除视频
                      </el-button>
                    </div>
                  </el-form-item>
                </div>

                <!-- 商品品牌 + 商品排序 -->
                <div class="prod-brand-sort">
                  <el-form-item label="商品品牌">
                    <div class="select-prod-brand">
                      <div class="brand">
                        <span class="brand-name">{{ dataForm.brand ? dataForm.brand.name : '' }}</span>
                        <el-icon
                          v-if="dataForm.brand && dataForm.brand.name"
                          class="el-icon-close del-brand"
                          @click="handleCloseBrand"
                        >
                          <Close />
                        </el-icon>
                      </div>
                      <div
                        class="default-btn text-btn"
                        @click="handleBrandPick()"
                      >
                        选择
                      </div>
                    </div>
                    <brand-selector
                      v-if="brandSelectVisible"
                      ref="brandSelectRef"
                      :is-single="true"
                      @close="brandSelectClose"
                      @refresh-select-brand="selectedBrand"
                    />
                  </el-form-item>
                  <el-form-item
                    label="商品排序"
                    label-width="70px"
                  >
                    <div class="select-prod-sort">
                      <el-input
                        v-model.number="dataForm.seq"
                        type="number"
                        :max="32767"
                        :min="0"
                        :step="1"
                        validate-event
                        oninput="value=value.replace(/[^0-9]/g,'')"
                        style="width:150px"
                        @input="value => dataForm.seq = Math.min(value, 32767)"
                      />
                    </div>
                  </el-form-item>
                </div>
                <!-- 是否组合选品 -->
                <el-form-item
                  v-if="dataForm.spuMold === 0"
                  label="组合选品"
                >
                  <el-tooltip
                    :disabled="!dataForm.spuId || dataForm.spuId === ''"
                    class="item"
                    effect="light"
                    content="商品发布成功后不可更改"
                    placement="top"
                  >
                    <el-radio-group
                      v-model="dataForm.spuType"
                      :disabled="dataForm.spuId !== ''"
                      @change="handleProdTpyeChange"
                    >
                      <el-radio :label="dataForm.spuType > 0 && dataForm.spuType !== 5 ? dataForm.spuType : 0">
                        否
                      </el-radio>
                      <el-radio :label="5">
                        是
                      </el-radio>
                    </el-radio-group>
                  </el-tooltip>
                  <div class="el-form-item-tips">
                    组合选品不可单买且不会被买家搜索到，仅用于套餐和赠品的非主商品以及组合商品的关联商品
                  </div>
                </el-form-item>

                <!-- 预售商品 -->
                <div
                  v-if="dataForm.spuType != 5 && dataForm.spuMold === 0"
                  class="prod-presale"
                >
                  <el-form-item label="是否开启预售">
                    <el-radio-group
                      v-model="preSaleType"
                      @change="preSaleTypeChange"
                    >
                      <el-radio :label="-1">
                        关闭
                      </el-radio>
                      <el-radio :label="0">
                        开启
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <template v-if="dataForm.preSaleType !== -1">
                    <el-form-item label="预售类型">
                      <el-radio-group v-model="dataForm.preSaleType">
                        <el-radio :label="0">
                          全款预售
                        </el-radio>
                        <el-radio :label="1">
                          定金预售
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>

                    <!-- 定金预售 -->
                    <template v-if="dataForm.preSaleType === 1">
                      <el-form-item
                        label="定金收取"
                        prop="depositValue"
                      >
                        <el-radio-group
                          v-model="dataForm.depositType"
                          class="presaleItem"
                          @change="changedepositValue"
                        >
                          <div>
                            <el-radio :label="0">
                              按比例
                              <el-input
                                v-if="dataForm.depositType === 0"
                                v-model="dataForm.depositValue"
                                class="input-width"
                                :disabled="dataForm.depositType !== 0"
                                @change="(val) => { if (!(/^(([1-9][0-9]*)+|[0]{1})(.[0-9]{1,2})?$/.test(val)) || val / 1 > 100 || val / 1 <= 0 || dataForm.depositValue >= 100) { dataForm.depositValue = null } }"
                              >
                                <template #append>
                                  %
                                </template>
                              </el-input>
                              <el-input
                                v-if="dataForm.depositType !== 0"
                                :value="null"
                                disabled
                                class="input-width"
                              >
                                <template #append>
                                  %
                                </template>
                              </el-input>
                              收取
                            </el-radio>
                          </div>
                          <div>
                            <el-radio :label="1">
                              按金额
                              <el-input
                                v-if="dataForm.depositType === 1"
                                v-model="dataForm.depositValue"
                                class="input-width"
                                @change="(val) => { if (!(/^(([1-9][0-9]*)+|[0]{1})(.[0-9]{1,2})?$/.test(val)) || val === null || val / 1 <= 0) { dataForm.depositValue = null } }"
                              />
                              <el-input
                                v-if="dataForm.depositType !== 1"
                                :value="null"
                                class="input-width"
                                disabled
                              />
                              元收取
                            </el-radio>
                          </div>
                        </el-radio-group>
                        <div class="hint">
                          建议定价收取金额不超过商品售价的20%
                        </div>
                      </el-form-item>

                      <el-form-item
                        label="定金膨胀"
                        class="presaleItem"
                        prop="depositExpansionValue"
                      >
                        原定金
                        <el-input
                          :value="dataForm.depositValue"
                          disabled
                          placeholder="原定金"
                          class="input-width"
                        />
                        {{ ['%', '元'][dataForm.depositType] }}膨胀后可抵扣
                        <el-input
                          v-model="dataForm.depositExpansionValue"
                          placeholder="抵扣金额"
                          class="input-width"
                          @change="changeDepositExpansionValue"
                        />{{ ['%', '元'][dataForm.depositType] }}
                      </el-form-item>
                      <el-form-item
                        label="支付时间"
                        class="presaleItem"
                      >
                        <div class="presaleItem-date">
                          定金支付时间 <el-date-picker
                            v-model="depositTime"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            end-placeholder="结束日期"
                          />
                        </div>
                        <div class="presaleItem-date">
                          尾款支付时间 <el-date-picker
                            v-model="balanceTime"
                            type="datetimerange"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                          />
                        </div>
                        <div class="hint">
                          建议定金支付时间不超过商品发布当日的90天，尾款支付时间不能早于定金支付时间
                        </div>
                      </el-form-item>
                    </template>
                    <!-- end定价预售 -->

                    <el-form-item label="发货时间">
                      <el-radio-group
                        v-model="preSaleDeliveryType"
                        class="presaleItem"
                      >
                        <div>
                          <el-radio :label="-1">
                            <el-date-picker
                              v-model="dataForm.preSaleDeliveryTime"
                              :disabled="preSaleDeliveryType !== -1"
                              type="date"
                              format="YYYY-MM-DD"
                              placeholder="选择日期时间"
                              value-format="YYYY-MM-DD HH:mm:ss"
                              :picker-options="{
                                disabledDate(time) {
                                  var date = new Date()
                                  var time1 = date.getTime() + (1000 * 60 * 60 * 24 * 90)
                                  return time.getTime() < new Date(new Date().toLocaleDateString()).getTime() || time.getTime() > time1
                                },
                              }"
                            />开始发货
                          </el-radio>
                        </div>
                        <div>
                          <el-radio :label="0">
                            {{ ['付款成功后', '尾款支付'][dataForm.preSaleType] }}
                            <el-input
                              v-if="dataForm.preSaleDeliveryType === -1"
                              :value="null"
                              :disabled="preSaleDeliveryType !== 0"
                              :max="90"
                              class="input-width"
                              :controls="false"
                            />
                            <el-input-number
                              v-if="dataForm.preSaleDeliveryType !== -1"
                              v-model="dataForm.preSaleDeliveryType"
                              :min="0"
                              :disabled="preSaleDeliveryType !== 0"
                              :precision="0"
                              :max="90"
                              class="input-width"
                              :controls="false"
                            />
                            天后发货
                          </el-radio>
                        </div>
                      </el-radio-group>
                      <div class="hint">
                        只允许设置90天内的发货时间，以免引起客户投诉
                      </div>
                    </el-form-item>
                  </template>
                </div>
                <!-- end预售商品 -->

                <!-- 是否关联卡券 -->
                <el-form-item
                  v-if="dataForm.spuMold === 3"
                  label="是否关联卡券"
                >
                  <el-radio-group v-model="dataForm.isBindVoucher">
                    <el-radio :label="1">
                      是
                    </el-radio>
                    <el-radio :label="0">
                      否
                    </el-radio>
                  </el-radio-group>
                  <div class="el-form-item-tips">
                    卡券在【商品-卡券管理】进行设置，若不关联卡券，需要主动联系用户发放卡券内容
                  </div>
                </el-form-item>

                <!-- 2.商品sku与库存 -->
                <div class="part-content">
                  <div class="part-tit">
                    规格库存
                  </div>

                  <el-form-item
                    label="商品规格"
                    class="part-form-div"
                  >
                    <div class="part-form-item">
                      <!-- sku-组件 -->
                      <sku-block
                        ref="skuBlockRef"
                        v-model:salesAttrs="salesAttrs"
                        v-model:skuTree="originalSkuTree"
                        :save-sales-attrs="originalSalesAttrs"
                        :on-fetch-group="fetchSkuTree"
                        :on-fetch-sku="fetchSku"
                        :on-create-sku="createSku"
                        :on-create-group="createGroup"
                        :on-handle-sku-value-img="changeSkuGroupImg"
                        :switch-sku-image-status="switchSkuImageStatus"
                        :category-id="dataForm.shopCategoryId"
                        :has-sku-val="hasSkuValue"
                        @on-change="changeSkuGroupData"
                      />
                    </div>
                  </el-form-item>

                  <!-- 价格及库存 -->
                  <el-form-item
                    label="价格及库存"
                    class="part-form-div"
                    required
                  >
                    <div class="setup-spec">
                      <div class="sku-table">
                        <!-- sku表格 -->
                        <!-- :data="salesAttrs" -->
                        <sku-table
                          v-if="isHaveStockPointInfo"
                          ref="skuTableRef"
                          :data="skuTableListData"
                          :is-combo-spu="dataForm.isComboSpu"
                          :flatten="flatten"
                          :is-no-sku-value="isNoSkuValue"
                          :pre-bind-voucher-list="preBindVoucherList"
                          :spu-id="parseInt(dataForm.spuId)"
                          :is-category-id="!!dataForm.shopCategoryId"
                          :spu-mold="dataForm.spuMold"
                          :is-bind-voucher="dataForm.isBindVoucher"
                          :delivery-mode="dataForm.deliveryMode"
                          :stock-point-info="stockPointInfo"
                          @on-change-data="handleChangeData"
                        />
                      </div>
                    </div>
                  </el-form-item>

                  <!-- 总库存 -->
                  <el-form-item
                    class="part-form-div"
                    prop="totalStock"
                  >
                    <template #label>
                      总库存
                      <el-tooltip
                        class="item"
                        effect="light"
                        content="每个规格库存的总和"
                        placement="top"
                      >
                        <el-icon class="el-icon-question">
                          <QuestionFilled />
                        </el-icon>
                      </el-tooltip>
                    </template>
                    <el-input
                      v-model="dataForm.totalStock"
                      :disabled="true"
                      :readonly="true"
                      style="width:215px"
                    />
                  </el-form-item>
                </div>
                <!-- 3.运费设置 -->
                <div
                  v-if="(dataForm.spuMold !== 1 && dataForm.spuMold !== 3) && dataForm.spuType !== 5"
                  class="part-content"
                >
                  <div class="part-tit">
                    运费设置
                  </div>
                  <el-form-item
                    label="配送方式"
                    required
                  >
                    <el-checkbox
                      v-model="dataForm.deliveryMode.hasShopDelivery"
                    >
                      快递发货
                    </el-checkbox>
                    <el-checkbox
                      v-model="dataForm.deliveryMode.hasCityDelivery"
                      :disabled="stationNumber===0"
                    >
                      同城配送
                    </el-checkbox>
                    <el-checkbox
                      v-model="dataForm.deliveryMode.hasUserPickUp"
                      :disabled="stationNumber===0"
                    >
                      到店自提
                    </el-checkbox>
                    <div class="el-form-item-tips">
                      “用户自提”及“同城配送”需在【库存一仓库门店一门店管理】处进行设置才能生效，且共享总部库存的门店无需额外设置商品库存数量
                    </div>
                  </el-form-item>
                  <el-form-item
                    v-if="dataForm.deliveryMode.hasShopDelivery"
                    label="运费设置"
                  >
                    <div class="fl-row">
                      <el-radio
                        v-model="dataForm.tableRate"
                        :label="0"
                      >
                        包邮
                      </el-radio>
                      <el-radio
                        v-model="dataForm.tableRate"
                        :label="-1"
                        @change="onHandleFreight"
                      >
                        固定运费
                      </el-radio>
                      <el-radio
                        v-model="dataForm.tableRate"
                        :label="1"
                      >
                        运费模板
                      </el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item
                    v-if="dataForm.tableRate>0&&dataForm.deliveryMode.hasShopDelivery"
                    label="运费模板"
                    prop="deliveryTemplateId"
                  >
                    <div class="part-form-logistics">
                      <el-select
                        v-model="dataForm.deliveryTemplateId"
                        placeholder="请选择"
                        style="width:215px"
                        @change="changeTransportId"
                      >
                        <el-option
                          v-for="item in transportTemplates"
                          :key="item.transportId"
                          :label="item.transName"
                          :value="item.transportId"
                        />
                      </el-select>
                      <div class="lb">
                        <el-button
                          type="primary"
                          link
                          class="tb"
                          @click="getTransportData"
                        >
                          刷新
                        </el-button>
                        <span
                          v-permission="['user:transport:save']"
                          class="vertical"
                        />
                        <el-button
                          v-permission="['user:transport:save']"
                          type="primary"
                          link
                          class="tb"
                          @click="addTransportTemplate"
                        >
                          新建
                        </el-button>
                      </div>
                      <div class="log-tem-tips">
                        运费模板支持按地区设置运费，按购买件数计算运费，按重量计算运费等
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item
                    v-if="dataForm.tableRate===-1&&dataForm.deliveryMode.hasShopDelivery"
                    label="固定运费"
                    prop="deliveryAmount"
                  >
                    <div class="freight">
                      <el-input
                        v-model="dataForm.deliveryAmount"
                        :min="0.01"
                        maxlength="10"
                        placeholder="请输入金额"
                        @blur="handleInputValue(dataForm.deliveryAmount,'deliveryAmount',0.01,9999)"
                      />
                    </div>
                  </el-form-item>
                </div>

                <!-- 其他设置（虚拟商品才显示这个其他设置） -->
                <div
                  v-if="dataForm.spuMold === 1 || dataForm.spuMold === 3"
                  class="part-content"
                >
                  <div class="part-tit">
                    其他设置
                  </div>
                  <template v-if="dataForm.spuMold === 1">
                    <!-- 核销次数 -->
                    <el-form-item
                      label="核销次数"
                      prop="writeOffNum"
                    >
                      <!-- -1.多次核销 0.无需核销 1.单次核销 -->
                      <el-radio-group v-model="dataForm.writeOffNum">
                        <el-radio :label="0">
                          无需核销
                        </el-radio>
                        <el-radio :label="1">
                          单次核销
                        </el-radio>
                        <el-radio :label="-1">
                          多次核销
                        </el-radio>
                      </el-radio-group>
                      <div class="hint">
                        需要核销的商品会生成核销码，可提供给商家线下核销
                      </div>
                    </el-form-item>
                    <el-form-item
                      v-if="dataForm.writeOffNum === -1"
                      label="有效核销次数"
                      class="options-box expiry-date"
                    >
                      <!-- writeOffMultipleCountSelect 核销次数 -1：无限次 2：多次 -->
                      <el-radio-group
                        v-model="writeOffMultipleCountSelect"
                        @change="changeWriteOffMultipleCount"
                      >
                        <el-radio :label="-1">
                          无限次
                        </el-radio>
                        <!-- 最多核销 writeOffMultipleCount 次 -->
                        <el-radio :label="2">
                          最多核销
                          <input
                            v-model="writeOffMultipleCount"
                            type="number"
                            class="native-input-style"
                            :disabled="writeOffMultipleCountSelect === -1"
                            :max="9999"
                            :min="2"
                            @change="changeWriteOffMultipleCountIn()"
                          >
                          次
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <!-- writeOffTime核销有效期（选择“无需核销”，不需要选择核销有效期） -1.长期有效 0.自定义 1.当天 x.x天内 -->
                    <el-form-item
                      v-if="dataForm.writeOffNum !== 0"
                      label="有效期"
                      class="options-box expiry-date"
                      prop="writeOffEnd"
                    >
                      <el-radio-group
                        v-model="dataForm.writeOffTime"
                        @change="changeWriteOffTime"
                      >
                        <div class="radio-item">
                          <!-- 长期有效 -->
                          <el-radio :label="-1">
                            长期有效
                          </el-radio>
                        </div>
                        <div class="radio-item">
                          <!-- 当天有效 -->
                          <el-radio :label="1">
                            购买后当天有效<span class="weak-text">（每天24点前可以使用）</span>
                          </el-radio>
                        </div>
                        <div class="radio-item">
                          <!-- N天内有效 -->
                          <el-radio :label="2">
                            购买后
                            <input
                              v-model="validDays"
                              type="number"
                              class="native-input-style"
                              :disabled="dataForm.writeOffTime !== 2"
                              :max="9999"
                              :min="2"
                              @blur="getValidDays(validDays)"
                            >
                            天内有效
                          </el-radio>
                        </div>
                        <div class="radio-item date-picker">
                          <!-- 自定义（N 至 M 内有效） -->
                          <el-radio :label="0">
                            在
                            <el-date-picker
                              v-model="dataForm.writeOffStart"
                              type="datetime"
                              placeholder="开始日期"
                              value-format="YYYY-MM-DD HH:mm:ss"
                              :disabled-date="PickerOptions.disabledDate"
                              :disabled="dataForm.writeOffTime !== 0"
                              @change="changeDate(0)"
                            />
                            至
                            <el-date-picker
                              v-model="dataForm.writeOffEnd"
                              type="datetime"
                              placeholder="结束日期"
                              value-format="YYYY-MM-DD HH:mm:ss"
                              :disabled-date="PickerOptions.disabledDate"
                              :disabled="dataForm.writeOffTime !== 0"
                              @change="changeDate(1)"
                            />
                            <span>内有效</span>
                          </el-radio>
                        </div>
                      </el-radio-group>
                    </el-form-item>
                  </template>
                  <!-- 用户留言 -->
                  <el-form-item
                    class="userMessage"
                    label="用户留言"
                  >
                    <div
                      v-for="(item, index) in dataForm.virtualRemark"
                      :key="index"
                      class="msg-int-box"
                    >
                      <el-input
                        v-model="dataForm.virtualRemark[index].name"
                        class="native-input-style"
                        link
                        maxlength="10"
                        @blur="changeMsgInput(item.name, index)"
                      />
                      <el-checkbox
                        v-model="item.isRequired"
                        class="required-checkbox"
                      >
                        必填
                      </el-checkbox>
                      <!--删除/添加-->
                      <div class="create-refresh-btn">
                        <div
                          class="default-btn text-btn"
                          @click="deleteUserMessage(index)"
                        >
                          删除
                        </div>
                      </div>
                    </div>
                    <div v-if="dataForm.virtualRemark?.length < 10">
                      <span
                        class="text-btn"
                        @click="addUserMessage()"
                      >
                        <el-icon><Plus /></el-icon>添加字段
                      </span>
                    </div>
                    <div class="hint">
                      购买商品时让买家输入留言，最多可设置 10 条
                    </div>
                  </el-form-item>

                  <!-- 使用说明（电子卡券才显示） -->
                  <el-form-item
                    v-if="dataForm.spuMold === 3"
                    label="使用说明"
                    class="options-box"
                    prop="directions"
                    :required="true"
                  >
                    <el-input
                      v-model="dataForm.directions"
                      maxlength="250"
                      style="width: 50%;"
                      :autosize="{ minRows: 6, maxRows: 10 }"
                      show-word-limit
                      type="textarea"
                    />
                  </el-form-item>
                </div>
              </div>

              <!-- 4.商品详情 -->
              <div
                v-if="postingSteps === 3"
                class="part-content"
              >
                <!-- <div class="part-tit">商品详情</div> -->
                <div class="part-form-info">
                  <product-details
                    ref="productDetailsRef"
                    v-model:detail="dataForm.detail"
                  />
                </div>
              </div>
            </div>
          </el-form>
        </div>
        <!-- 供应商商品 -->
        <supplier-add
          v-if="postingSteps > 1 && dataForm.goodsType === 1"
          ref="prodSupplierAddRef"
          :supplier-spu-id="supplierSpuId"
          :posting-steps="postingSteps"
          :is-view-only="isViewOnly"
          :stock-point-info="stockPointInfo"
        />
      </div>
    </div>
    <div
      v-show="!(postingSteps === 1 && dataForm.goodsType === 1)"
      class="foot-btn"
    >
      <div class="inner">
        <div v-if="postingSteps === 1">
          <el-button
            type="primary"
            @click="next2"
          >
            选好了，下一步
          </el-button>
        </div>
        <div v-if="postingSteps === 2">
          <el-button
            v-if="!($route.query.spuId)"
            plain
            @click="postingSteps = 1"
          >
            上一步
          </el-button>
          <el-button
            v-if="!isViewOnly"
            type="primary"
            plain
            @click="save"
          >
            保存
          </el-button>
          <el-button
            v-if="!isViewOnly"
            type="primary"
            @click="next3"
          >
            下一步
          </el-button>
        </div>
        <div v-if="postingSteps === 3">
          <el-button @click="postingSteps = 2">
            上一步
          </el-button>
          <el-button
            type="primary"
            @click="save"
          >
            保存
          </el-button>
        </div>
      </div>
    </div>

    <transport-add-or-update
      v-if="transportVisible"
      ref="transportAddOrUpdateRef"
      @refresh-data-list="getTransportData()"
    />
  </div>
</template>

<script setup>
import selectCategory from './components/posting-select-category.vue'
import skuBlock from '@/components/sku/sku-block/index.vue'
import productDetails from './components/product-details.vue'
import supplierAdd from './components/supplier-add.vue'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { treeDataTranslate, idList, getUUID } from '@/utils'
import { validNoEmptySpace } from '@/utils/validate'
import { shopCategoryPage, getShopAttrs } from '@/api/product/category'
import { transportPage } from '@/api/distribution-manage/transport'
import * as api from '@/api/product/prod-info'
import Cookies from 'vue-cookies'
import Big from 'big.js'
import { getStockPointInfo } from '@/api/stock/warehouse-station.js'
import { getDomain } from '@/utils/index.js'
import { shopUserInfo } from '@/api/multishop/shop-user'
import { getStationListByIds, getStationDelivery } from '@/api/delivery/station'
import http from '@/utils/request.js'
import TransportAddOrUpdate from '@/views/modules/order/delivery-manage/transport/add-or-update.vue'

const validateTime = (rule, value, callback) => {
  if (new Date() >= Date.parse(value)) {
    callback(new Error('结束时间不能少于或等于当前时间'))
  } else {
    callback()
  }
}
const validateNameZh = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('不能全为空格'))
  } else {
    callback()
  }
}
const validateNameEn = (rule, value, callback) => {
  if (value === null || value === '') {
    dataFormRef.value.clearValidate('nameEn')
    callback()
  } else if (validNoEmptySpace(value)) {
    callback(new Error('不能全为空格'))
  } else {
    callback()
  }
}
const validateSellingPointZh = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('不能全为空格'))
  } else {
    callback()
  }
}
const validateSellingPointEn = (rule, value, callback) => {
  if (value === null || value === '') {
    dataFormRef.value.clearValidate('sellingPointEn')
    callback()
  } else if (validNoEmptySpace(value)) {
    callback(new Error('不能全为空格'))
  } else {
    callback()
  }
}
const rules = {
  categoryId: [
    { required: true, message: '请选择SaaS分类', trigger: 'blur' }
  ],
  shopCategoryId: [
    { required: true, message: '请选择店铺分类', trigger: 'blur' }
  ],
  imgUrls: [
    { required: true, message: '请选择商品轮播图', trigger: ['blur', 'change'] }
  ],
  nameZh: [
    { required: true, message: '请输入中文商品名称', trigger: 'blur' },
    { validator: validateNameZh, trigger: 'blur' }
  ],
  nameEn: [
    { validator: validateNameEn, trigger: 'blur' }
  ],
  sellingPointZh: [
    { validator: validateSellingPointZh, trigger: 'blur' }
  ],
  sellingPointEn: [
    { validator: validateSellingPointEn, trigger: 'blur' }
  ],
  deliveryTemplateId: [
    { required: true, message: '请选择运费模板', trigger: 'change' }
  ],
  deliveryAmount: [
    { required: true, message: '请输入金额', trigger: 'change' }
  ],
  depositValue: [
    { required: true, message: '请输入定金', trigger: ['blur', 'change'] }
  ],
  depositExpansionValue: [
    { required: true, message: '请输入膨胀定金', trigger: ['blur', 'change'] }
  ],
  writeOffEnd: [
    { validator: validateTime, trigger: 'blur' }
  ],
  directions: [
    { required: true, message: '请输入使用说明', trigger: 'blur' },
    { validator: validateNameZh, trigger: 'blur' }
  ]
}

const flatten = ref(null)

// 限制日期
const PickerOptions = {
  disabledDate (time) {
    const date = moment().add(-1, 'days').startOf('days')
    return (
      time.getTime() <= date.valueOf()
    )
  }
}

const appStore = useAppStore()
const commonStore = useCommonStore()

const language = computed(() => appStore.language === 'zh' ? 1 : 2)

const originalSalesAttrs = ref([]) // 原始销售属性
const basicAttrs = ref([]) // 基础属性

watch(language, () => {
  loadAttrsData(originalSalesAttrs.value)
  loadAttrsData(basicAttrs.value)
})

onBeforeMount(() => {
  onGetStationDelivery()
  init()
  getTransportData() // 运费模板
  // 同城配送设置
})

const route = useRoute()
const router = useRouter()
const dataForm = ref({
  tableRate: -1, // 0 包邮 -1 固定运费 大于0运费模板id
  deliveryAmount: 0.01,
  // 商品类型(0普通商品 1拼团 2秒杀 3积分 5活动商品)
  spuType: 0,
  goodsType: 0, // 0 普通商品 1供应商商品
  spuMold: 0, // 0 实物商品 1虚拟商品 2组合商品
  spuId: route.query.spuId || null, // 商品id
  categoryId: null, // 分类id
  shopCategoryId: null, // 店铺分类id
  nameZh: '', // 中文商品名称
  supplierSpuType: 0, // 普通商品
  nameEn: '', // 英文商品名称
  sellingPointZh: '', // 中文商品卖点
  sellingPointEn: '', // 英文商品卖点
  detailEn: '',
  detailZh: '',
  brandId: null, // 品牌id（非必选）
  imgUrls: '', // 轮播图 多个图片逗号分隔
  isCompose: 0, // 是否为组合商品0普通商品，1组合商品
  mainImgUrl: '', // 商品主图
  hasSkuImg: 0, // sku是否含有图片 0无 1有
  scoreFee: 0, // 积分价格（非必填）
  seq: 0, // 商品排序（非必填）
  spuAttrValues: [], // 商品属性值列表
  deliveryMode: {
    hasShopDelivery: true,
    hasUserPickUp: false,
    hasCityDelivery: false
  }, // 配送方式
  deliveryTemplateId: '', // 运费模板id
  detail: '', // 详情信息（非必填）
  skuList: [], // sku列表
  totalStock: 0, // 商品总库存
  video: '', // 商品视频
  brand: null, // 品牌
  // 核销次数 -1.多次核销 0.无需核销 1.单次核销
  writeOffNum: 0,
  virtualRemark: [], // 用户留言
  // isRefund: 0, // 是否可以退款 0不可以 1可以
  writeOffTime: -1,
  writeOffMultipleCount: '',

  // 预售
  preSaleType: -1, // 预售状态
  depositType: 0, // 定金收取类型 0.按比例 1.按金额
  depositValue: null, // 定金数值
  depositExpansionValue: null, // 定金膨胀数值
  depositStartTime: null, // 定金支付开始时间
  depositEndTime: null, // 定金支付结束时间
  balanceStartTime: null, // 尾款支付开始时间
  balanceEndTime: null, // 尾款支付结束时间
  preSaleDeliveryType: -1, // 预售发货类型 0.固定时间 x.尾款支付后x天发货

  // 电子卡券
  isBindVoucher: 1,
  directions: ''
})

const selectCategoryRef = ref(null)
const postingSteps = ref(1) // 步骤条
const stationNumber = ref(0)
onMounted(() => {
  if (route.query.spuId && route.query.postingSteps === '2') {
    dataForm.value.goodsType = 1
    nextTick(() => {
      selectCategoryRef.value.prodSopplierNext(Number(route.query.spuId))
    })
  } else if (route.query.spuId) {
    postingSteps.value = 2
  }
  getShopInfo()
})
const getShopInfo = () => {
  shopUserInfo().then(data => {
    stationNumber.value = data.stationNumber
  })
}

// 是否存在的符合配送方式的共享总部门店
const stationDelivery = reactive({})
provide('stationDeliveryInfo', stationDelivery)
const onGetStationDelivery = () => {
  getStationDelivery().then((res) => {
    Object.assign(stationDelivery, res)
  })
}

watch(() => dataForm.value.deliveryMode, () => {
  if (dataForm.value.spuMold === 2) {
    onHandleStockCombo() // 处理组合库存
  }
}, { deep: true })

// 组合库存处理
const onHandleStockCombo = () => {
  let existComboList = false // 存在不为空的组合商品列表
  const skuList = skuTableData.value.map(sku => {
    const tempObj = {}
    tempObj.skuId = sku.skuId
    tempObj.skuComboList = sku.skuComboList.map(item => {
      existComboList = true
      return {
        skuId: sku.skuId,
        comboSkuId: item.comboSkuId,
        comboCount: item.comboCount || 1,
        comboSpuId: item.comboSpuId
      }
    })
    return tempObj
  })
  if (!existComboList) return
  const deliveryMode = JSON.stringify(dataForm.value.deliveryMode)
  const paramData = {
    spuId: dataForm.value.spuId,
    deliveryMode,
    skuList
  }
  http({
    url: '/mall4cloud_product/mp/sku/calculate_stock_by_sku_ids',
    method: 'post',
    data: paramData
  }).then((res) => {
    const skus = res.skus
    skuTableData.value.forEach((sku, skuInx) => {
      sku.stock = skus[skuInx].stock
    })
  })
}

// 是否开启预售
const preSaleTypeChange = (e) => {
  if (e === -1) {
    resetPreSale()
  }
}

// 重置预售
const resetPreSale = () => {
  dataForm.value.preSaleType = -1
  dataForm.value.depositType = 0
  dataForm.value.depositValue = null
  dataForm.value.depositExpansionValue = null
  dataForm.value.depositStartTime = null
  dataForm.value.depositEndTime = null
  dataForm.value.balanceStartTime = null
  dataForm.value.balanceEndTime = null
  dataForm.value.preSaleDeliveryType = null
}

// 切换定金收取比例  depositValue 0.按比例 1.按金额
const changedepositValue = (e) => {
  if (e === 0 && dataForm.value.depositValue > 100) {
    dataForm.value.depositValue = null
  }
}

const selectedCategories = ref([]) // 选中的SaaS分类
const selectedCategoriesChange = (data) => {
  selectedCategories.value = data
}

// 当前语言 1中文 2英文
const curLang = ref([1])

const prodSupplierAddRef = ref(null)
// 保存
const save = () => {
  if (dataForm.value.goodsType === 1) {
    prodSupplierAddRef.value.submit()
  } else if (dataForm.value.goodsType === 0) {
    changeFormatOfFormData()
  }
}

const supplierSpuId = ref(null)
const writeOffMultipleCountSelect = ref(-1) // 核销次数 -1：无限次 2：多次
const writeOffMultipleCount = ref(null)
const validDays = ref(null) // 购买后有效天数

// 是否为查看供应商商品
const isViewOnly = ref(false)
/**
 * 发布商品步骤
 * @param val 当前步骤
 * @param supplierSpuIdPar 供应商商品id
 * @param isViewOnlyFlag 是否仅查看（未导入的供应商商品）
 */
const postingStepsChange = (val, supplierSpuIdPar, isViewOnlyFlag = false) => {
  postingSteps.value = val
  isViewOnly.value = isViewOnlyFlag
  if (supplierSpuIdPar) supplierSpuId.value = supplierSpuIdPar
}

const dataFormRef = ref(null)
const skuBlockRef = ref(null)

const hasSkuImage = ref(false)
const originalSpuAttrValueList = ref([]) // 基本属性回显原数据
const backTotalStock = ref(null) // 回显总库存
const showCategorySelectBtn = ref(true) // '选择分类'按钮显隐

const stockPointInfo = ref({})
const isHaveStockPointInfo = ref(false)
const preBindVoucherList = ref([]) // 商品当前绑定的卡券
const init = () => {
  const spuId = dataForm.value.spuId
  dataForm.value.spuId = spuId || ''
  nextTick(() => {
    dataFormRef.value.resetFields()
    if (!dataForm.value.spuId) {
      selectCategoryRef.value.init(false, false)
      isNoSkuValue.value = true
      // 未获取默认仓库id，则需要获取默认仓库id
      if (!isHaveStockPointInfo.value) {
        getStockPointInfo().then((res) => {
          isHaveStockPointInfo.value = true
          stockPointInfo.value = res
        })
      }
      return
    }
    api.getProdInfoPage(spuId).then(data => {
      if (data.category) {
        selectedCategories.value = [{ name: data.category.categories[0].name }, { name: data.category.categories[1].name }, { name: data.category.name }]
      }
      data.skus.forEach(sku => {
        if (!sku.stockWarning) {
          sku.stockWarning = 0
        }
      })
      dataForm.value = { ...dataForm.value, ...data }
      writeOffMultipleCountSelect.value = dataForm.value.writeOffMultipleCount === -1 ? -1 : 2
      writeOffMultipleCount.value = dataForm.value.writeOffMultipleCount > -1 ? dataForm.value.writeOffMultipleCount : ''
      // 虚拟商品
      if (dataForm.value.spuMold === 1) {
        const writeOffTime = dataForm.value.writeOffTime
        if (writeOffTime !== -1 && writeOffTime !== 0 && writeOffTime !== 1) {
          validDays.value = writeOffTime
          dataForm.value.writeOffTime = 2
        }
        if (writeOffTime !== 0) {
          dataForm.value.writeOffStart = null
          dataForm.value.writeOffEnd = null
        }
      }
      // 留言处理
      if (dataForm.value.spuMold === 1 || dataForm.value.spuMold === 3) {
        if (dataForm.value.virtualRemark && dataForm.value.virtualRemark.length) {
          const isStr = Object.prototype.toString.call(dataForm.value.virtualRemark) === '[object String]'
          if (isStr) {
            dataForm.value.virtualRemark = JSON.parse(dataForm.value.virtualRemark)
          }
        } else {
          dataForm.value.virtualRemark = []
        }
      }

      if (dataForm.value.spuMold === 3 && dataForm.value.isBindVoucher === 1) {
        preBindVoucherList.value = dataForm.value.skus?.map(i => {
          return {
            voucherId: i.voucherId,
            name: i.voucherName,
            notEnabledNum: i.stock
          }
        })
        preBindVoucherList.value = preBindVoucherList.value.filter(i => i.voucherId)
      }
      hasSkuImage.value = !!dataForm.value.hasSkuImg

      originalSpuAttrValueList.value = data.spuAttrValues
      backTotalStock.value = data.skus.reduce((res, { stock }) => {
        res += (stock || 0)
        return res
      }, 0)
      // 配送方式
      dataForm.value.deliveryMode = JSON.parse(data.deliveryMode)

      // 运费设置
      dataForm.value.tableRate = data.deliveryTemplateId > 0 ? 1 : data.deliveryTemplateId
      dataForm.value.deliveryTemplateId = data.deliveryTemplateId > 0 ? data.deliveryTemplateId : ''
      dataForm.value.deliveryAmount = bigActualTotal(data.deliveryAmount || 0, 100)

      if (dataForm.value.shopCategory && dataForm.value.shopCategory.status === 1) {
        // 回显分类
        getCategoryBack(data.categoryId, data.shopCategoryId)
      }

      // 商品分类选择按钮
      showCategorySelectBtn.value = false
      // 根据分类获取基本属性列表
      data.spuAttrValues.forEach(spuAttrValue => {
        if (spuAttrValue.spuAttrValueLangList && spuAttrValue.spuAttrValueLangList.length > 0) {
          spuAttrValue.spuAttrValueLangList.forEach(spuAttrValueLang => {
            if (spuAttrValueLang.lang === language.value) {
              spuAttrValue.attrName = spuAttrValueLang.attrName
              spuAttrValue.attrValueName = spuAttrValueLang.attrValueName
            }
          })
        }
      })
      getAttrsByCategoryId(data.categoryId, data.spuAttrValues)
      // sku回显
      nextTick(() => {
        skuBackShow(data.shopCategoryId, data.skus) // 销售属性
      })
      // 商品详情
      dataForm.value.detail = data.detailList[0] ? data.detailList[0].detail : null
      // 商品数据
      dataForm.value.spuLangList.forEach(spuLang => {
        if (spuLang.lang === 1) {
          dataForm.value.nameZh = spuLang.spuName
          dataForm.value.sellingPointZh = spuLang.sellingPoint
        } else if (spuLang.lang === 2) {
          dataForm.value.nameEn = spuLang.spuName
          dataForm.value.sellingPointEn = spuLang.sellingPoint
        }
      })
      // 回显商品名
      if (dataForm.value.nameEn) curLang.value = [1, 2]

      // 未获取默认仓库id，则需要获取默认仓库id
      if (!isHaveStockPointInfo.value) {
        getStockPointInfo().then((res) => {
          isHaveStockPointInfo.value = true
          stockPointInfo.value = res
        })
      }
    })
  })
}

const selectedShopCategories = ref([]) // 选中的店铺分类

// 获取分类
const getCategoryBack = (categoryId, shopCategoryId) => {
  selectCategoryRef.value.init(categoryId, shopCategoryId)
  shopCategoryPage().then(data => {
    // 获取店铺分类数据
    const shopCategoryList = treeDataTranslate(data, 'categoryId', 'parentId')
    selectedShopCategories.value = idList(shopCategoryList, shopCategoryId, 'categoryId', 'children').reverse() // 选中的分类
  })
}

const categorySelectorRef = ref(null)
const selectKey = ref('')
const categorySelectorVisible = ref(false) // 分类选择器弹窗显隐

// 选择/修改分类
const selectOrReviseCategory = (key, selectedCategories, index = true) => {
  const data = JSON.parse(JSON.stringify(selectedCategories))
  selectKey.value = key
  categorySelectorVisible.value = index
  nextTick(() => {
    categorySelectorRef.value.init(0, key, data) // 1代表从创建分类进入
  })
}

// 获取子组件返回分类数据
const getCategorySelected = (selectedCategoriesPra, parentId, selectKeyPra) => {
  categorySelectorVisible.value = false
  if (selectedCategoriesPra) {
    if (selectKey.value === 'platform' || selectKeyPra === 'platform') {
      selectedCategories.value = selectedCategoriesPra
      dataForm.value.categoryId = parentId
      getAttrsByCategoryId(parentId) // 请求基本属性
      // 重新校验表单对应字段
      dataFormRef.value.validateField('categoryId')
      dataForm.value.brand = null
      dataForm.value.brandId = null
    } else {
      selectedShopCategories.value = selectedCategoriesPra
      dataForm.value.shopCategoryId = parentId
      querySalesAttrData() // 请求销售属性
      // 重新校验表单对应字段
      dataFormRef.value.validateField('shopCategoryId')
    }
  }
}

// 国际化数据筛选
const loadAttrsData = (data) => {
  data.forEach(attr => {
    // 属性名
    let name = null
    for (let i = 0; i < attr.attrLangList.length; i++) {
      const attrLang = attr.attrLangList[i]
      name = attrLang.name ? attrLang.name : name
      if (attrLang.lang === language.value && attrLang.name) {
        break
      }
    }
    attr.name = name
    // 属性值
    for (let k = 0; k < attr.attrValues.length; k++) {
      let value = null
      const attrValues = attr.attrValues[k]
      for (let j = 0; j < attrValues.values.length; j++) {
        const attrValue = attrValues.values[j]
        if (attrValue.lang === 1 || attrValue.lang === language.value) {
          value = attrValue.value ? attrValue.value : value
        }
      }
      attrValues.value = value
    }
  })
}

// 根据分类获取基本属性列表
const getAttrsByCategoryId = (categoryId, spuAttrValues) => {
  const param = {
    categoryId,
    attrType: 1 // 基本属性
  }
  api.getAttrsByCategoryId(param).then((data) => {
    // 获取数据回显
    if (spuAttrValues) {
      data.forEach((attr) => {
        spuAttrValues.forEach(spuAttr => {
          if (!attr.attrValues.length && (!spuAttr.attrValueId || spuAttr.attrValueId === 0)) {
            if (attr.attrId === spuAttr.attrId) {
              attr.attrValue = spuAttr.attrValueName
            }
          } else {
            if (attr.attrValues.some(attr => spuAttr.attrValueId === attr.attrValueId)) {
              attr.attrValue = spuAttr.attrValueId
            }
          }
        })
      })
    }
    basicAttrs.value = data
    loadAttrsData(basicAttrs.value)
  })
}

const spuAttrValueList = ref([]) // 商品基本属性值列表

// 基本属性数据
// eslint-disable-next-line no-unused-vars
const getValueOfBasicAttrs = (attrsList, attrs, st) => {
  const spuAttrValue = {}
  if (dataForm.value.spuId) { // 回显
    originalSpuAttrValueList.value.forEach((item) => {
      if (item.attrId === attrs.attrId) {
        attrs.spuAttrValueId = item.spuAttrValueId
        spuAttrValue.spuAttrValueId = attrs.spuAttrValueId
      }
    })
  }
  // 获取基本属性子组件返回数据
  spuAttrValue.attrId = attrs.attrId // 属性id
  spuAttrValue.attrName = attrs.name // 属性名
  spuAttrValue.searchType = attrs.searchType // 属性值
  if (st === 0) { // 下拉选择
    attrs.attrValues.some(attr => {
      if (attrs.attrValue === attr.attrValueId) {
        spuAttrValue.attrValueId = attrs.attrValue // 属性值id
        spuAttrValue.attrValueName = attr.value // 属性值
        spuAttrValueList.value.push(spuAttrValue)
        return true
      }

      return false
    })
  }
  if (st === 1) { // 输入框
    spuAttrValue.attrValueId = ''
    spuAttrValue.attrValueName = attrs.attrValue // 属性值id
    spuAttrValueList.value.push(spuAttrValue) // 属性值
  }
  // 去重
  dataForm.value.spuAttrValues = removeDuplication(spuAttrValueList.value, 'attrId')
}

const brandSelectVisible = ref(false) // 品牌选择组件显隐
const brandSelectRef = ref(null)

// 选择/修改品牌
const handleBrandPick = () => {
  if (!dataForm.value.categoryId) {
    return
  }
  brandSelectVisible.value = true
  nextTick(() => {
    brandSelectRef.value.init(dataForm.value.brand, dataForm.value.categoryId)
  })
}

// 添加指定品牌
const selectedBrand = (brand) => {
  if (brand) {
    dataForm.value.brandId = brand.brandId
    dataForm.value.brand = brand
  }
}

// 删除品牌
const handleCloseBrand = () => {
  dataForm.value.brandId = ''
  dataForm.value.brand = null
}

// 删除视频
const deleteVideo = () => {
  dataForm.value.video = null
}

// 轮播图
const changeImages = () => {
  if (dataForm.value.imgUrls) {
    // 重新校验表单对应字段
    dataFormRef.value.validateField('imgUrls')
  }
}

const isNoSkuValue = ref(false) // 回显时的商品是否有sku
const salesAttrs = ref([]) // 销售属性列表
const skuTableListData = ref([])

// sku回显
// eslint-disable-next-line no-unused-vars
const skuBackShow = (categoryId, skus) => {
  if (skus && skus.length > 0) {
    const salesAttrsPra = []
    const ids = []
    const attrValueNameMapId = []
    const stockPointIds = []
    skus.forEach(sku => {
      sku.spuSkuAttrValues?.forEach((attrInfo, idx) => {
        if (attrInfo.spuSkuAttrValueLangList) {
          attrInfo.spuSkuAttrValueLangList.forEach(spuSkuAttrValueLang => {
            if (spuSkuAttrValueLang.lang === language.value || spuSkuAttrValueLang.lang === 0) {
              attrInfo.attrName = spuSkuAttrValueLang.attrName
              attrInfo.attrValueName = spuSkuAttrValueLang.attrValueName
            }
          })
        }
        // 无sku
        if (attrInfo.attrName === null && attrInfo.attrValueName === null) {
          isNoSkuValue.value = true
          return
        }

        /** 有sku */
        /** left的每一项 */

        // 每一层id一致
        ids[idx] = ids[idx] || attrInfo.attrId || getUUID() // 无attrId则随机生成一个新id
        attrInfo.attrId = ids[idx]

        if (!attrValueNameMapId[idx]) {
          attrValueNameMapId[idx] = {}
        }

        const attrValueId = attrValueNameMapId[idx][attrInfo.attrValueName] || attrInfo.attrValueId || getUUID()
        attrValueNameMapId[idx][attrInfo.attrValueName] = attrValueId
        attrInfo.attrValueId = attrValueId
        const skuValueItem = {
          id: attrValueId,
          is_show: !!sku.imgUrl,
          text: attrInfo.attrValueName
        }

        if (idx === 0) {
          skuValueItem.imgUrl = sku.imgUrl || null
        }
        if (salesAttrsPra.some(el => el.text === attrInfo.attrName)) {
          salesAttrsPra.forEach(el => {
            if (el.text === attrInfo.attrName) {
              el.leaf.push(skuValueItem)
            }
          })
        } else {
          salesAttrsPra.push({
            id: ids[idx],
            leaf: [skuValueItem],
            text: attrInfo.attrName
          })
        }
      })
      if (!sku.spuSkuAttrValues.length) {
        isNoSkuValue.value = true
      }
    })
    // 去重
    salesAttrsPra.forEach(attr => {
      attr.leaf = removeDuplication(attr.leaf, 'text')
    })
    skus.forEach(skuItem => {
      if (!skuItem.stock) skuItem.stock = 0
      skuItem.marketPriceFee = parseFloat(bigActualTotal(parseFloat(skuItem.marketPriceFee), 100)) // 市场价
      skuItem.priceFee = parseFloat(bigActualTotal(parseFloat(skuItem.priceFee), 100)) // 销售价
      skuItem.stockPointList?.forEach(stockItem => {
        if (stockItem.stockPointType === 2 && stockItem.stockPointId && !stockPointIds.includes(stockItem.stockPointId)) {
          stockPointIds.push(stockItem.stockPointId)
        }
      })
      // 非自提商品，则将门店相关库存过滤并存储（提交时携带回去）
      if (!(dataForm.value?.deliveryMode?.hasUserPickUp || dataForm.value?.deliveryMode?.hasCityDelivery)) {
        skuItem.filterList = []
        skuItem.filterStock = 0 // 过滤出来的库存数量（库存数量变化，用于之后重新勾选后添加回去）
        skuItem.stockPointList = skuItem.stockPointList?.filter(stockItem => {
          if (stockItem.stockPointType === 2) {
            // 存储门店相关库存
            skuItem.filterList.push(stockItem)
            skuItem.filterStock += Number(stockItem.stock)
          }
          return stockItem.stockPointType === 1
        })
      }
    })
    flatten.value = skus.map(item => {
      const obj = item
      obj.stock = calcStock(item.stockPointList)
      return obj
    })
    salesAttrsPra.forEach((attr, i) => {
      salesAttrs.value[i] = attr
    })
    skuTableListData.value = salesAttrs.value
    // 根据设置的门店id获取门店列表，用于获取最新门店状态
    if (stockPointIds.length) {
      onGetPageStation(stockPointIds)
    }
  }
  querySalesAttrData(skus)
}

// 门店列表，用于计算库存时的状态判断
const onGetPageStation = (ids) => {
  getStationListByIds(ids).then(res => {
    const sList = res || []
    for (const flattenIt of flatten.value) {
      flattenIt.filterList?.forEach(it => {
        const fRes = sList.find(f => f.stationId === it.stockPointId)
        it.status = fRes ? fRes.status : it.status
        it.sameCityDelivery = fRes ? fRes?.sameCityDelivery : it.sameCityDelivery
        it.selfPickup = fRes ? fRes.selfPickup : it.selfPickup
      })
      flattenIt.stockPointList?.forEach(it => {
        if (it.stockMode === 2) {
          const fRes = sList.find(f => f.stationId === it.stockPointId)
          it.status = fRes ? fRes.status : it.status
          it.sameCityDelivery = fRes ? fRes.sameCityDelivery : it.sameCityDelivery
          it.selfPickup = fRes ? fRes.selfPickup : it.selfPickup
        }
      })
      flattenIt.stock = calcStock(flattenIt.stockPointList)
    }
  })
}

const calcStock = (stockPointList = []) => {
  const { hasShopDelivery, hasCityDelivery, hasUserPickUp } = dataForm.value?.deliveryMode
  return stockPointList.reduce((total, item) => {
    let stock = 0
    if (item.stockMode === 2 && item.status === 1 && ((hasCityDelivery && item.sameCityDelivery) || (hasUserPickUp && item.selfPickup))) {
      stock = Number(item.stock)
    }
    // 区域仓库:商品支持快递配送
    // 默认仓库:商品支持快递或商品不支持快递，但门店是共享总部库存+门店状态为营业+门店和商品有共同的物流类型
    if (!item.stockMode && (hasShopDelivery || (item.type === 0 && ((hasCityDelivery && stationDelivery?.sameCityDelivery) || (hasUserPickUp && stationDelivery?.selfPickup))))) {
      stock = Number(item.stock)
    }
    return total + stock
  }, 0)
}

const skuTree = ref([]) // 规格列表
const originalSkuTree = ref([]) // sku属性选项列表(不受改变影响)

// 获取店铺中的销售属性
const querySalesAttrData = (skus) => {
  if (!skus) {
    originalSalesAttrs.value.splice(0, originalSalesAttrs.value.length)
  }
  skuTree.value.splice(0, skuTree.value.length) // 清空
  // 收集已创建属性id
  const usedAttridsSet = skus?.reduce((attrIdsSet, skuItem) => {
    skuItem.spuSkuAttrValues.forEach(val => attrIdsSet.add(val.attrName))
    return attrIdsSet
  }, new Set())
  getShopAttrs().then((data) => {
    loadAttrsData(data)
    originalSalesAttrs.value = data
    let skuTrees = []
    data.forEach((item) => {
      // 将已创建属性以外的其他属性放入新数组
      if (!usedAttridsSet?.has(item.name) || !usedAttridsSet) {
        skuTrees.push({ id: item.attrId, text: item.name })
      }
    })
    // 去重
    skuTrees = removeDuplication(skuTrees, 'text')
    originalSkuTree.value = skuTrees
    skuTree.value = skuTrees
  })
}

// 规格组件相关 start
const fetchSkuTree = () => {
  // 异步获取规格列表
  return new Promise(resolve => {
    resolve(skuTree.value)
  })
}

const fetchSku = (id) => {
  // 异步获取规格可选值
  return new Promise(resolve => {
    resolve(getSkus(id))
  })
}

const sku = ref([])
// 获取规格可选值
const getSkus = (id) => {
  sku.value = []
  let idPar = id + ''
  if (idPar.slice(0, 2) === '000') {
    idPar = idPar.slice(3)
  }
  originalSalesAttrs.value.forEach(attr => {
    if (Number(idPar) === attr.attrId) {
      attr.attrValues.forEach(attrVal => {
        const attrValue = {}
        attrValue.text = attrVal.value
        attrValue.id = attrVal.attrValueId
        sku.value.push(attrValue)
      })
    }
  })
  return sku.value
}

const createGroup = (text) => {
  // 创建新的规格名
  return new Promise((resolve, reject) => {
    if (text) {
      // resolve(parseInt(Math.random() * 100, 10) + 1)
      resolve(getUUID())
    } else {
      reject(new Error())
    }
  })
}

const createSku = (data) => {
  // 创建新的规格值
  return new Promise((resolve) => {
    resolve(data.data.map(item => {
      return {
        // id: parseInt(Math.random() * 100, 10) + parseInt(Math.random() * 100, 10),
        id: getUUID(),
        text: item
        // leaf: []
      }
    }))
  })
}

// SkuGroup返回数据
const changeSkuGroupData = async (data) => {
  examineGroupData(data)
  skuTree.value = data
  skuTableListData.value = data
  if (!data.length) {
    dataForm.value.hasSkuImg = 0
  }
}

// skuGroup返回了数据，则检查该数据，并更新isNoSkuValue
const examineGroupData = (data) => {
  if (!(data && data.length)) {
    isNoSkuValue.value = true
    return
  }
  let noSku = true // 是否不存在sku
  for (let i = 0; i < data.length; i++) {
    if (data[i].leaf && data[i].leaf.length) {
      noSku = false
      break
    }
  }
  isNoSkuValue.value = noSku
}

// 切换规格图片是否可添加状态
const switchSkuImageStatus = (sts) => {
  dataForm.value.hasSkuImg = sts ? 1 : 0
}

// 添加/修改/删除规格图片的处理
const changeSkuGroupImg = (data) => {
  skuTree.value = salesAttrs.value
  skuTree.value.forEach(el => {
    if (el.id === data.id) {
      el.leaf = data.leaf
    }
  })
}

const skuTableData = ref([]) // sku表格返回数据

// SkuTable返回数据
const handleChangeData = (data) => {
  const salePrices = []
  const marketPrices = []
  let totalStock = 0
  data?.forEach((sku) => {
    if (!sku.marketPriceFee) {
      sku.marketPriceFee = 0
    }
    if (sku.stock && sku.status === 1) {
      totalStock += Number(sku.stock) // 库存累加
    }
    if (sku.status === 1) {
      salePrices.push(sku.priceFee) // 售价
      marketPrices.push(sku.marketPriceFee) // 市场价
    }
    if ((!sku.stockPointList || !sku.stockPointList.length)) {
      sku.stockPointList = [{
        stock: 0,
        stockPointId: stockPointInfo.value.defaultWarehouseId,
        stockPointType: 1,
        type: 0
      }]
    }
  })
  skuTableData.value = data
  dataForm.value.priceFee = Math.min.apply(null, salePrices) // 最低价-售价
  dataForm.value.marketPriceFee = Math.min.apply(null, marketPrices) // 最低价-市场价
  dataForm.value.totalStock = totalStock // 总库存
}

// 切换商品类型（虚拟/实物）清除库存
const onClearStock = () => {
  skuTableData.value?.forEach((sku) => {
    if (sku.stock) {
      sku.stock = 0
      sku.stockPointList = []
    }
    dataForm.value.totalStock = 0 // 总库存
  })
}

const transportTemplates = ref([]) // 运费模板列表

// 运费模板
const getTransportData = () => {
  transportPage().then(data => {
    transportTemplates.value = data
  })
}

const transportAddOrUpdateRef = ref(null)
const transportVisible = ref(false)
const addTransportTemplate = () => {
  transportVisible.value = true
  nextTick(() => {
    transportAddOrUpdateRef.value.init()
  })
}

// 选择运费模板
const changeTransportId = (id) => {
  dataForm.value.deliveryTemplateId = id
}

// 用户留言-添加字段
const addUserMessage = () => {
  if (dataForm.value.virtualRemark.length >= 10) {
    ElMessage({
      message: '最多可设置10条',
      type: 'error',
      duration: 1000
    })
    return
  }
  const data = {
    name: '',
    isRequired: false
  }
  dataForm.value.virtualRemark.push(data)
}

// 用户留言-删除字段
const deleteUserMessage = (index) => {
  dataForm.value.virtualRemark.splice(index, 1)
}

/* 用户留言输入框失焦 */
const changeMsgInput = (name, index) => {
  dataForm.value.virtualRemark[index].name = name.trim()
}

// 处理提交的skuList的数据格式
const changeSkuFormat = () => {
  // const nameOfAttrs = [] // 属性名组合
  /** 原始sku属性选项Id数组 */
  const originalSkuIds = originalSalesAttrs.value.map((attr) => attr.attrId)
  skuTableData.value.forEach(skuItem => {
    const attrsZh = []
    const attrsEn = []
    const valueZh = []
    const valueEn = []
    if (skuItem.spuSkuAttrValues?.length > 0) {
      skuItem.spuSkuAttrValues.forEach((attr, index) => {
        // sku图片
        skuTree.value[0]?.leaf?.forEach((attrVal) => {
          if (attr.attrValueName === attrVal.text && index === 0) {
            // if (attrVal.is_show) {
            skuItem.imgUrl = attrVal.imgUrl ? attrVal.imgUrl : null
            // }
          }
        })
        // 新增(手动输入)属性的id为空
        if (!originalSkuIds.includes(attr.attrId)) {
          attr.attrId = ''
        }
        const originalSku = getSkus(attr.attrId)
        const originalSkuValIds = originalSku.map(sku => sku.id) // 原始sku属性值选项Id数组
        // 当sku属性id为空时，sku属性值id也为空 || 请求到的属性值列表中不包含当前的id
        if (!attr.attrId || !originalSkuValIds.includes(attr.attrValueId)) {
          // 新增(手动输入)属性值的id为空
          attr.attrValueId = ''
        }

        // 多个属性名、属性值收集
        const attrInfo = getAttrInfo(originalSalesAttrs.value, attr)
        attrsZh.push(attrInfo.attrNameZh)
        attrsEn.push(attrInfo.attrNameEn)
        valueZh.push(attrInfo.valueZh)
        valueEn.push(attrInfo.valueEn)
        attr.attrId = '' + attr.attrId
        attr.attrValueId = ''
        if (attr.attrId && attr.attrId?.slice(0, 2) !== '000') attr.attrId = '000' + attr.attrId
      })
      // attrs.push(attr.attrName)
      const skuLangZh = { lang: 1 }
      const skuLangEn = { lang: 2 }

      // attrs（属性名拼接）
      // 多个销售属性名逗号分隔  如：'颜色,版本'
      skuLangZh.attrs = Array.from(new Set(attrsZh)).join(',')
      skuLangEn.attrs = Array.from(new Set(attrsEn)).join(',')

      // skuName（属性值拼接）
      if (valueZh.length > 1) {
        skuLangZh.skuName = valueZh.join(' ') // 属性值名称 如：'红色 256G'
        skuLangEn.skuName = valueEn.join(' ') // 属性值名称 如：'红色 256G'
      } else if (skuItem.spuSkuAttrValues[0] && !skuItem.spuSkuAttrValues[1]) {
        skuLangZh.skuName = String(valueZh[0])
        skuLangEn.skuName = String(valueEn[0])
      }
      skuItem.skuLangList = []
      skuItem.skuLangList.push(skuLangZh)
      skuItem.skuLangList.push(skuLangEn)
    } else {
      skuItem.spuSkuAttrValues = []
    }
    if (dataForm.value.hasSkuImg === 0) {
      skuItem.imgUrl = null
    }
  })
  // 已存在skuId&无属性的情况下，修改sku信息时应带上原本的skuId，避免skuId被更新
  if (dataForm.value.skus?.length === 1 && skuTableData.value.length === 1) {
    if (!dataForm.value.skus[0].spuSkuAttrValues.length && !skuTableData.value[0].spuSkuAttrValues.length) {
      skuTableData.value[0].skuId = dataForm.value.skus[0].skuId
    }
  }
  dataForm.value.skuList = skuTableData.value
}

const getAttrInfo = (data, attr) => {
  if (!attr.attrId && !attr.attrValueId) {
    return { attrNameZh: attr.attrName, valueZh: attr.attrValueName, attrNameEn: attr.attrName, valueEn: attr.attrValueName }
  }
  const attrInfo = {}
  data.forEach(spuSkuAttrValue => {
    if (spuSkuAttrValue.attrId === attr.attrId) {
      // 属性名
      attrInfo.attrNameZh = attr.attrName
      attrInfo.attrNameEn = attr.attrName
      // 属性值
      if (!attr.attrValueId) {
        attrInfo.valueZh = attr.attrValueName
        attrInfo.valueEn = attr.attrValueName
        return attrInfo
      }
      spuSkuAttrValue.attrValues.forEach(attrValue => {
        if (attrValue.attrValueId === attr.attrValueId) {
          if (attrValue.values.length === 1) {
            // attrValue.values长度为1，即只存在中文
            attrInfo.valueZh = attrValue.values[0].value
            attrInfo.valueEn = attrValue.values[0].value
          } else {
            attrValue.values.forEach(value => {
              if (value.lang === 1) {
                attrInfo.valueZh = value.value
              } else {
                attrInfo.valueEn = value.value
              }
            })
          }
        }
      })
    }
  })
  return attrInfo
}

// 基本属性未填写部分数据处理
const basicAttrData = () => {
  const spuAttrIds = []
  dataForm.value.spuAttrValues.forEach(spuAttrItem => {
    spuAttrIds.push(spuAttrItem.attrId)
  })
  // 已填id数组中不包含当前项id
  basicAttrs.value.forEach(attr => {
    if (!spuAttrIds.includes(attr.attrId)) {
      dataForm.value.spuAttrValues.push({
        attrId: attr.attrId,
        attrName: attr.name,
        attrValueId: '',
        attrValueName: ''
      })
    }
  })
  // 去重
  dataForm.value.spuAttrValues = removeDuplication(dataForm.value.spuAttrValues, 'attrId')
  basicAttrVerification()
}

const basicAttrNotComplete = ref(false) // 基本属性不完整

// 基本属性填写校验
const basicAttrVerification = () => {
  // 重要属性id数组
  const importantBasicAttrIds = []
  basicAttrs.value.forEach((el) => {
    // searchType 作为搜索参数 0:不需要，1:需要（1即为重要属性，重要属性必填）
    if (el.searchType === 1) {
      importantBasicAttrIds.push(el.attrId)
    }
  })
  dataForm.value.spuAttrValues.some(attrValue => {
    basicAttrNotComplete.value = false
    // 重要属性 且 属性值（属性值id）为空
    if (importantBasicAttrIds.includes(attrValue.attrId) &&
      (!attrValue.attrValueId || !attrValue.attrValueName)) {
      ElMessage({
        message: '重要基本属性不能为空！',
        duration: 1000
      })
      basicAttrNotComplete.value = true
      return true
    }
    return false
  })
}

const hasSkuValue = ref(true) // 是否有属性值

// 表单验证
const formValidation = () => {
  basicAttrData() // 基本属性校验
  if (basicAttrNotComplete.value) {
    return false
  }
  if (!dataForm.value.imgUrls) {
    ElMessage({
      message: '请上传商品轮播图！',
      duration: 1000
    })
    return false
  }
  if (skuTree.value?.some((item) => item.id && item.leaf && !item.leaf.length)) {
    ElMessage({
      message: '请选择已添加规格的规格值！',
      duration: 1500
    })
    hasSkuValue.value = false
    return false
  }
  // 勾选“添加属性图片”但未上传任何图片时（至少上传一张图片）
  if (dataForm.value.hasSkuImg === 1 && !dataForm.value.skuList?.find(el => el.imgUrl)) {
    ElMessage({
      message: '请上传规格图片！',
      duration: 1000
    })
    return false
  }
  // 防止参数没有skuComboList属性，后台报错
  if (dataForm.value.spuMold === 2) {
    dataForm.value.skuList.forEach(item => {
      if (!item.skuComboList) {
        item.skuComboList = []
      }
    })
  }
  if (dataForm.value.spuMold === 2 && dataForm.value.skuList.some(item => (item.skuComboList.length === 0 && item.status !== 0))) {
    ElMessage({
      message: '组合商品规格至少需要关联一个商品！',
      duration: 1000
    })
    return false
  }
  if (dataForm.value.skuList?.some((skuItem) => skuItem.stock === '' || skuItem.stock === null)) {
    ElMessage({
      message: '商品库存不能为空！',
      duration: 1000
    })
    return false
  }
  // 虚拟商品校验
  if (dataForm.value.spuMold === 1) {
    // 自定义核销有效天数
    if (dataForm.value.writeOffNum !== 0 && dataForm.value.writeOffTime === 2) {
      if (!validDays.value) {
        ElMessage({
          message: '请填写核销有效天数',
          type: 'error',
          duration: 1000
        })
        return false
      }
    }
    // 自定义核销有效天数
    if (dataForm.value.writeOffNum !== 0 && dataForm.value.writeOffTime === 0 && (!dataForm.value.writeOffStart || !dataForm.value.writeOffEnd)) {
      if (!validDays.value) {
        ElMessage({
          message: '请选择核销有效日期',
          type: 'error',
          duration: 1000
        })
        return false
      }
    }
    if (dataForm.value.virtualRemark.length && dataForm.value.virtualRemark.find(el => !el.name)) {
      ElMessage({
        message: '请填写已添加的留言',
        type: 'error',
        duration: 1000
      })
      return false
    }
  }
  if (dataForm.value.skuList?.some((skuItem) => !skuItem.priceFee)) {
    ElMessage({
      message: '商品销售价格必须大于0！',
      duration: 1000
    })
    return false
  }
  let index = 0
  dataForm.value.skuList.forEach(temp => {
    if (temp.status === 0) {
      index++
    }
  })
  if (index === dataForm.value.skuList.length && dataForm.value.skuList.length !== 0) {
    ElMessage({
      message: 'sku状态不能全部为禁用！',
      duration: 1000
    })
    return false
  }
  for (let i = 0; i < dataForm.value.skuList.length; i++) {
    const sku = dataForm.value.skuList[i]
    if (
      sku.partyCode &&
      dataForm.value.skuList.find((el, index) => el.partyCode &&
          index !== i &&
          el.partyCode === sku.partyCode)
    ) {
      ElMessage({
        message: '商品编码不能重复',
        duration: 1000
      })
      return false
    }
  }
  return true
}

// 表单提交数据处理
const changeFormatOfFormData = () => {
  dataFormRef.value.validate(valid => {
    if (dataForm.value.spuMold === 1 || dataForm.value.spuMold === 3) {
      // 重置预售
      resetPreSale()
    }
    if (!valid) {
      ElMessage({
        message: '请先将必填信息填写完整！',
        duration: 1500
      })
      return
    }
    if (!dataForm.value.deliveryMode.hasShopDelivery && !dataForm.value.deliveryMode.hasCityDelivery && !dataForm.value.deliveryMode.hasUserPickUp) {
      ElMessage({
        message: '请选择配送方式',
        duration: 1500
      })
      return
    }
    // sku数据格式转换
    changeSkuFormat()

    if (writeOffMultipleCountSelect.value !== -1) {
      dataForm.value.writeOffMultipleCount = writeOffMultipleCount.value || 2
    } else {
      dataForm.value.writeOffMultipleCount = -1
    }

    // 修改商品详情时，将未修改的基本属性项push到dataForm.spuAttrValues
    if (dataForm.value.spuId) {
      const spuAttrValIds = []
      dataForm.value.spuAttrValues.forEach(attr => {
        spuAttrValIds.push(attr.attrId)
      })
      originalSpuAttrValueList.value.forEach(attr => {
        if (!spuAttrValIds.includes(attr.attrId)) {
          dataForm.value.spuAttrValues.push(attr)
        }
      })
    }
    // 表单验证
    const dataFormVal = formValidation()
    if (!dataFormVal) {
      return
    }
    if (writeOffMultipleCountSelect.value !== -1) {
      dataForm.value.writeOffMultipleCount = writeOffMultipleCount.value || 2
    } else {
      dataForm.value.writeOffMultipleCount = -1
    }

    // 深拷贝dataForm，使页面展示数据不受下面数据修改的影响
    let dataFormPra = JSON.parse(JSON.stringify(dataForm.value))

    if (dataForm.value.spuMold === 1 || dataForm.value.spuMold === 3) {
      dataFormPra.virtualRemark = JSON.stringify(dataForm.value.virtualRemark)
    }

    // 虚拟商品
    if (dataForm.value.spuMold === 1) {
      // 选择"无需核销"，没有核销有效期
      if (dataForm.value.writeOffNum === 0) {
        dataFormPra.writeOffTime = null
      }
      // 自定义核销有效天数
      if (dataForm.value.writeOffNum !== 0 && dataForm.value.writeOffTime === 2) {
        dataFormPra.writeOffTime = parseInt(validDays.value)
      }
      // 清空配送方式
      dataFormPra.deliveryMode = {
        hasShopDelivery: false,
        hasUserPickUp: false,
        hasCityDelivery: false
      }
    }
    // 预售商品验证
    if (!depositValidate()) return
    if (dataForm.value.spuMold !== 1) {
      // 普通商品，清空虚拟商品/电子卡券信息
      if (dataForm.value.spuMold !== 3) dataFormPra.virtualRemark = null
      dataFormPra = {
        ...dataFormPra,
        writeOffNum: null,
        writeOffTime: null,
        writeOffStart: null,
        writeOffEnd: null
        // isRefund: null
      }
    }

    if (dataForm.value.spuMold !== 3) {
      dataFormPra.directions = null
      dataFormPra.isBindVoucher = null
    }

    // deliveryMode转换格式
    dataFormPra.deliveryMode = JSON.stringify(dataFormPra.deliveryMode)

    dataFormPra.skuList.forEach(sku => {
      // 价格 * 100
      if (sku.priceFee > 0) {
        sku.priceFee = parseFloat(bigProductTotalAmount(parseFloat(sku.priceFee), 100)) // 售价*100
      }
      if (sku.marketPriceFee > 0) {
        sku.marketPriceFee = parseFloat(bigProductTotalAmount(parseFloat(sku.marketPriceFee), 100)) // 市场价*100
      }
      // 修改时，将移除的门店库存相关列表合并回去
      if (sku.skuId && !dataFormPra.deliveryMode?.hasUserPickUp && !dataFormPra.deliveryMode?.hasCityDelivery) {
        if (sku.filterList && sku.stockPointList.length) {
          sku.stockPointList = sku.stockPointList.concat(sku.filterList)
          sku.filterList = []
        }
      }
    })

    dataFormPra.priceFee = parseFloat(bigProductTotalAmount(parseFloat(dataFormPra.priceFee), 100)) // 最低-售价*100
    dataFormPra.marketPriceFee = parseFloat(bigProductTotalAmount(parseFloat(dataFormPra.marketPriceFee), 100)) // 最低-市场价*100
    // 轮播图首图为主图mainImgUrl
    dataFormPra.mainImgUrl = (dataFormPra.imgUrls).split(',')[0]
    // 删除多余参数(修改商品时)
    if (dataForm.value.skus) {
      dataFormPra.skus = undefined
    }
    // 多语言信息
    dataFormPra.spuLangList = []
    dataFormPra.spuLangList.push({ lang: 1, spuName: dataForm.value.nameZh, sellingPoint: dataForm.value.sellingPointZh, detail: dataForm.value.detail })
    dataFormPra.spuLangList.push({ lang: 2, spuName: dataForm.value.nameEn, sellingPoint: dataForm.value.sellingPointEn, detail: dataForm.value.detail })
    // 请求提交表单

    dataFormSubmit(dataFormPra)
  })
}

const isSubmit = ref(false)

// 表单提交
const dataFormSubmit = Debounce((dataFormPar) => {
  if (isSubmit.value) {
    return
  }

  // 活动商品移除预售相关信息
  if (dataFormPar.spuType === 5) {
    dataFormPar = {
      ...dataFormPar,
      // 预售
      preSaleType: -1, // 预售状态
      depositType: 0, // 定金收取类型 0.按比例 1.按金额
      depositValue: null, // 定金数值
      depositExpansionValue: null, // 定金膨胀数值
      depositStartTime: null, // 定金支付开始时间
      depositEndTime: null, // 定金支付结束时间
      balanceStartTime: null, // 尾款支付开始时间
      balanceEndTime: null, // 尾款支付结束时间
      preSaleDeliveryType: -1 // 预售发货类型 0.固定时间 x.尾款支付后x天发货
    }
  }
  isSubmit.value = true
  dataFormPar.deliveryTemplateId = dataFormPar.tableRate > 0 ? dataFormPar.deliveryTemplateId : dataFormPar.tableRate
  if (dataFormPar.tableRate === -1) {
    dataFormPar.deliveryAmount = new Big(dataFormPar.deliveryAmount || 0).times(100).valueOf()
  } else {
    dataFormPar.deliveryAmount = ''
  }
  // 移除不需要的数据
  dataFormPar.shopCategory = null
  dataFormPar.category = null
  dataFormPar.brand = null
  dataFormPar.detailList = null
  if (dataFormPar.spuMold === 0) dataFormPar.writeOffMultipleCount = null
  const request = dataForm.value.spuId ? api.update(dataFormPar) : api.save(dataFormPar)
  request.then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
        isSubmit.value = false
        /* 判断是否拥有权限 */
        const routeList = commonStore.routeList
        let flag = 0
        routeList.forEach(item => {
          if (item.children) {
            item.children.forEach(el => {
              if (el.path === '/product/manage' && el.children) {
                el.children.forEach(element => {
                  if (element.path === 'list') {
                    flag = 1
                  }
                })
              }
            })
          }
        })
        if (!flag) {
          router.push('/dashboard')
          return
        }
        router.push('/product/manage/list')
      }
    })
  }).catch(() => {
    isSubmit.value = false
  })
}, 1500)

const showShopCategorySelectBtn = ref(true) // 店铺'选择分类'按钮显隐
const skuTableRef = ref(null) // sku表格ref

// 精度运算-乘法
const bigProductTotalAmount = (a, b) => {
  return new Big(a).times(b).valueOf()
}

// 精度运算-除法
const bigActualTotal = (a, b) => {
  if (a == null) {
    return ''
  }
  return new Big(a).div(b).valueOf()
}

// 去重
const removeDuplication = (items, validKey) => {
  items.reverse() // 倒序，保留最新的数据
  const ids = []
  const list = []
  for (let i = 0; i < items.length; i++) {
    if (ids.indexOf(items[i][validKey]) === -1) {
      list.push(items[i])
      ids.push(items[i][validKey])
    }
  }
  list.reverse()
  return list
}

const brandSelectClose = () => {
  brandSelectVisible.value = false
}

const noshopCategoryId = () => {
  dataForm.value.shopCategoryId = ''
}

const next2 = () => {
  if (dataForm.value.goodsType === 0 && (!dataForm.value.categoryId || !dataForm.value.shopCategoryId)) {
    ElMessage({
      message: '请选择分类！',
      duration: 1000
    })
    return
  }
  postingSteps.value = 2
  getCategoryBack(dataForm.value.categoryId, dataForm.value.shopCategoryId)
  getAttrsByCategoryId(dataForm.value.categoryId) // 请求基本属性
  querySalesAttrData() // 请求销售属性
}

const next3 = () => {
  if (dataForm.value.goodsType === 0) {
    let index = false
    dataFormRef.value.validate(valid => {
      if (!valid) {
        ElMessage({
          message: '请先将必填信息填写完整！',
          duration: 1500
        })
        index = true
      }
      if (!dataForm.value.deliveryMode.hasShopDelivery && !dataForm.value.deliveryMode.hasCityDelivery && !dataForm.value.deliveryMode.hasUserPickUp) {
        ElMessage({
          message: '请选择配送方式',
          duration: 1500
        })
        return
      }
      if (index) {
        return
      }

      if (!dataForm.value.deliveryTemplateId && dataForm.value.spuMold === 0 && dataForm.value.spuType !== 5 && dataForm.value.tableRate !== 0 && dataForm.value.tableRate !== -1) {
        ElMessage({
          message: '请选择运费模板！',
          duration: 1000
        })
        return
      }
      // sku数据格式转换
      changeSkuFormat()

      if (writeOffMultipleCountSelect.value !== -1) {
        dataForm.value.writeOffMultipleCount = writeOffMultipleCount.value || 2
      } else {
        dataForm.value.writeOffMultipleCount = -1
      }

      if (!formValidation()) {
        return
      }
      // 预售商品
      if (!depositValidate()) return
      postingSteps.value = 3
    })
  } else if (dataForm.value.goodsType === 1) {
    if (!prodSupplierAddRef.value.formValidation()) {
      return
    }
    // 预售商品
    if (!depositValidate()) return
    postingSteps.value = 3
  }
}

// 商品类型切换
const handleProdTpyeChange = (val) => {
  // 活动商品则支持所有配送类型
  if (val === 5) {
    for (const key in dataForm.value.deliveryMode) {
      if (Object.hasOwnProperty.call(dataForm.value.deliveryMode, key)) {
        dataForm.value.deliveryMode[key] = true
      }
    }
  }
}

// 膨胀金额验证
const changeDepositExpansionValue = (e) => {
  if (!(/^([0]|([1-9][0-9]*))(.[0-9]{1,2})?$/.test(e)) || e === null) dataForm.value.depositExpansionValue = null
  if (dataForm.value.depositType === 0 && e > 100) {
    dataForm.value.depositExpansionValue = null
  }
  if (e / 1 < dataForm.value.depositValue / 1) {
    ElMessage.warning('定金膨胀金额不能小于定金')
    dataForm.value.depositExpansionValue = null
  }
}

const preSaleType = computed({
  get: () => { return dataForm.value.preSaleType === -1 ? -1 : 0 },
  set: (val) => {
    dataForm.value.preSaleType = val
  }
})

const depositTime = computed({
  get: () => {
    if (dataForm.value.depositStartTime || dataForm.value.depositEndTime) {
      return [dataForm.value.depositStartTime, dataForm.value.depositEndTime]
    }
    return null
  },
  set: (value) => {
    if (value) {
      dataForm.value.depositStartTime = value[0] || null
      dataForm.value.depositEndTime = value[1] || null
      return
    }
    dataForm.value.depositStartTime = null
    dataForm.value.depositEndTime = null
  }
})

const balanceTime = computed({
  get: () => {
    if (dataForm.value.balanceStartTime || dataForm.value.balanceEndTime) {
      return [dataForm.value.balanceStartTime, dataForm.value.balanceEndTime]
    }
    return null
  },
  set: (value) => {
    if (value) {
      dataForm.value.balanceStartTime = value[0] || null
      dataForm.value.balanceEndTime = value[1] || null
      return
    }
    dataForm.value.balanceStartTime = null
    dataForm.value.balanceEndTime = null
  }
})

const preSaleDeliveryType = computed({
  get: function () {
    return dataForm.value.preSaleDeliveryType === -1 ? -1 : 0
  },
  set: function (val) {
    dataForm.value.preSaleDeliveryType = val
  }
})

/**
 * @return {Boolean}  false 验证失败  true 验证通过
 */
const depositValidate = () => {
  if (dataForm.value.spuType != 5 && preSaleType.value !== -1 && dataForm.value.spuMold !== 1) {
    if (dataForm.value.preSaleType === 1) {
      if (!dataForm.value.depositValue && !dataForm.value.depositValue.trim()) {
        ElMessage.warning('请填写定金金额')
        return false
      }
      if (dataForm.value.depositType === 1 && dataForm.value.depositValue > dataForm.value.priceFee) {
        ElMessage.warning('商品售价不能小于定金')
        return false
      }
      if (dataForm.value.depositExpansionValue / 1 < dataForm.value.depositValue / 1) {
        ElMessage.warning('定金膨胀金额不能小于定金')
        return false
      }
      if (!depositTime.value) {
        ElMessage.warning('请填写定金支付时间')
        return false
      }
      if (!balanceTime.value) {
        ElMessage.warning('请填写尾款支付时间')
        return false
      }
      const depositStartTime = new Date(dataForm.value && dataForm.value.depositStartTime ? dataForm.value.depositStartTime.replace(/-/g, '/') : null).getTime()
      const balanceStartTime = new Date(dataForm.value && dataForm.value.balanceStartTime ? dataForm.value.balanceStartTime.replace(/-/g, '/') : null).getTime()
      if (depositStartTime > balanceStartTime) {
        ElMessage.warning('尾款支付开始时间需在定金支付开始时间之后')
        return false
      }
      const depositEndTime = new Date(dataForm.value && dataForm.value.depositEndTime ? dataForm.value.depositEndTime.replace(/-/g, '/') : null).getTime()
      const balanceEndTime = new Date(dataForm.value && dataForm.value.balanceEndTime ? dataForm.value.balanceEndTime.replace(/-/g, '/') : null).getTime()
      if (depositEndTime > balanceEndTime) {
        ElMessage.warning('尾款支付结束时间需在定金支付结束时间之后')
        return false
      }
    }
    if (preSaleDeliveryType.value === -1 && !dataForm.value.preSaleDeliveryTime) {
      ElMessage.warning('请填写发货时间')
      return false
    }
  } else if (dataForm.value.preSaleType !== -1) {
    dataForm.value.preSaleType = -1 // 预售状态
  }
  return true
}

const changeWriteOffMultipleCount = (value) => {
  if (value === -1) {
    writeOffMultipleCount.value = ''
  } else {
    writeOffMultipleCount.value = 2
  }
}

const changeWriteOffMultipleCountIn = () => {
  if (writeOffMultipleCount.value === '' || writeOffMultipleCount.value < 2) {
    writeOffMultipleCount.value = 2
  }

  // 限制只能输入整数
  if (writeOffMultipleCount.value > 2) {
    writeOffMultipleCount.value = Math.trunc(writeOffMultipleCount.value)
  }

  if (writeOffMultipleCount.value > 9999) {
    writeOffMultipleCount.value = 9999
  }
}

// 虚拟商品 - 核销有效期
const changeWriteOffTime = (value) => {
  if (value !== 2) validDays.value = ''
  if (value !== 0 && dataForm.value.writeOffStart && dataForm.value.writeOffEnd) {
    dataForm.value.writeOffStart = null
    dataForm.value.writeOffEnd = null
  }
}

// 自定义核销有效期天数
const getValidDays = (validDaysVal) => {
  const num = parseInt(validDaysVal) || 2
  validDays.value = num
  if (num > 9999) {
    validDays.value = 9999
  } else if (num < 2) {
    validDays.value = 2
  }
}

// 校验自定义核销有效期日期
const changeDate = (sts) => {
  if (sts === 0) {
    // 校验开始时间
    if (Date.parse(dataForm.value.writeOffStart) >= Date.parse(dataForm.value.writeOffEnd)) {
      ElMessage({
        message: '开始时间不能大于或等于结束时间',
        type: 'error',
        duration: 1500
      })
      dataForm.value.writeOffStart = ''
    }
  } else if (sts === 1) {
    // 校验结束时间
    if (new Date() >= Date.parse(dataForm.value.writeOffEnd)) {
      ElMessage({
        message: '结束时间不能少于或等于当前时间',
        type: 'error',
        duration: 1500
      })
      dataForm.value.writeOffEnd = ''
      return
    }
    if (Date.parse(dataForm.value.writeOffStart) >= Date.parse(dataForm.value.writeOffEnd)) {
      ElMessage({
        message: '结束时间不能少于或等于开始时间',
        type: 'error',
        duration: 1500
      })
      dataForm.value.writeOffEnd = ''
    }
  }
}

const onHandleFreight = () => {
  dataForm.value.deliveryAmount = dataForm.value.deliveryAmount < 0.01 ? 0.01 : dataForm.value.deliveryAmount
}

/**
 * 处理输入框数据
 * @param data
 * @param dataFields
 * @param min 最小值
 * @param max 最大值
 */
const handleInputValue = (data, dataFields, min, max) => {
  dataForm.value[dataFields] = checkInput(data)
  if (data || data === 0) {
    // 保留两位小数
    if (data > max) {
      dataForm.value[dataFields] = max
    }
    if (data < min) {
      dataForm.value[dataFields] = min
    }
  }
}
/**
 * 只允许输入正数和小数(保留小数点后两位)
 */
const checkInput = (num) => {
  if (num) {
    let tmpVal = String(num).replace(/[^\d^\\.]/g, '')
    const reg = /^(0|([1-9]\d*))(\.\d{1,2})?$/ // 最多允许后输入两位小数
    if (!reg.test(tmpVal)) {
      tmpVal = tmpVal + ''
      tmpVal = tmpVal.substring(0, tmpVal.indexOf('.') + 3)
      const n = (tmpVal.split('.')).length - 1
      if (n > 1) {
        tmpVal = tmpVal.substring(0, tmpVal.indexOf('.'))
      }
    }
    return tmpVal
  } else {
    return ''
  }
}

provide('prodData', {
  noshopCategoryId,
  getCategorySelected,
  getCategoryBack,
  postingStepsChange,
  supplierSpuId: supplierSpuId.value,
  getAttrsByCategoryId,
  selectedCategoriesChange,
  hasSkuImage
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
