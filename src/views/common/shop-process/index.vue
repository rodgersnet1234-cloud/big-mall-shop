<template>
  <div class="page-shop-process">
    <Navbar />
    <div class="sp-wrapper">
      <!-- 待申请开店状态 -->
      <div
        v-if="applyStatus===-2"
        class="submit-status-tips status-tips"
      >
        <el-icon class="text-icon">
          <WarningFilled />
        </el-icon>
        <span class="text">您还没有开店，请提交您的开店申请</span>
      </div>
      <!-- 店铺正在审核状态 -->
      <div
        v-if="applyStatus === 0 && loadGetAuditingInfo"
        class="pedding-status-tips status-tips"
      >
        <el-icon class="text-icon">
          <CircleCheckFilled />
        </el-icon>
        <span class="text">您的开店申请正在审核中！请耐心等待~</span>
      </div>
      <!-- 开店未通过状态 -->
      <div
        v-if="applyStatus === -1"
        class="fail-status-tips status-tips"
      >
        <el-icon class="text-icon">
          <CircleClose />
        </el-icon>
        <span class="text">您的开店申请未通过！原因是：{{ auditingInfo }}</span>
      </div>

      <!-- 准备 协议部分 第0步 -->
      <div
        v-if="applyStep===0 && loadGetAuditingInfo"
        class="shop-agreement"
      >
        <div class="sa-title">
          申请开店
        </div>
        <div class="sa-content">
          <div v-rich="shopProtocol" />
        </div>
        <div class="sa-checkbox">
          <el-checkbox v-model="isAgree">
            <span class="text">我已阅读并同意<span class="flag">《商家入驻协议》</span></span>
          </el-checkbox>
        </div>
        <div
          class="next-btn"
          @click="toNextStep"
        >
          下一步
        </div>
      </div>

      <div
        v-if="applyStep > 0"
        class="info-frame"
      >
        <div
          v-if="applyStatus === -2"
          class="sbi-title title"
        >
          申请开店
        </div>
        <div
          v-if=" applyStatus === 0"
          class="sbi-title title"
        >
          开店申请审核中
        </div>
        <div
          v-if=" applyStatus === -1"
          class="sbi-title title"
        >
          开店申请审核未通过
        </div>
        <div class="sbi-content content">
          <div class="progress-bar">
            <div
              class="first-step step"
              :class="{'active-step':applyStep>0}"
            >
              <div class="step-item">
                <div class="si-wrapper">
                  <div class="step-num">
                    1
                  </div>
                  <div class="step-text">
                    基本信息
                  </div>
                </div>
              </div>
            </div>
            <div
              class="second-step step"
              :class="{'active-step':applyStep>1}"
            >
              <div class="step-item">
                <div class="si-wrapper">
                  <div class="step-num">
                    2
                  </div>
                  <div class="step-text">
                    工商信息
                  </div>
                </div>
              </div>
            </div>
            <div
              class="third-step step"
              :class="{'active-step':applyStep>2}"
            >
              <div class="step-item">
                <div class="si-wrapper">
                  <div class="step-num">
                    3
                  </div>
                  <div class="step-text">
                    签约信息
                  </div>
                </div>
              </div>
            </div>
            <div
              class="fourth-step step"
              :class="{'active-step':applyStep>3}"
            >
              <div class="step-item">
                <div class="si-wrapper">
                  <div class="step-num">
                    4
                  </div>
                  <div class="step-text">
                    财务信息
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 第一步 基本信息 -->
          <div
            v-if="applyStep===1"
            class="shop-base-info"
          >
            <div class="company-info">
              <el-form
                ref="baseInfoFormRef"
                :model="baseInfoForm"
                :rules="baseInfoRule"
                class="base-info"
                label-width="100px"
                @submit.prevent
              >
                <div class="ci-wrapper">
                  <div class="right-info">
                    <el-form-item
                      label="店铺logo"
                      prop="shopLogo"
                    >
                      <div class="business-license-box">
                        <div class="license-content">
                          <img-upload
                            v-if="applyStatus !== 0"
                            v-model="baseInfoForm.shopLogo"
                            :limit="1"
                            @update:model-value="imgChange(baseInfoForm.shopLogo, 'baseInfoFormRef', 'shopLogo')"
                          />
                          <el-image
                            v-if="applyStatus === 0 && baseInfoForm.shopLogo"
                            class="rotating-img"
                            style="width: 120px; height: 120px;"
                            :preview-teleported="true"
                            :src="checkFileUrl(baseInfoForm.shopLogo)"
                            :preview-src-list="[checkFileUrl(baseInfoForm.shopLogo)]"
                          >
                            <template #error>
                              <img
                                class="img-slot"
                                src="~@/assets/images/def.png"
                                alt
                              >
                            </template>
                          </el-image>
                        </div>
                        <div class="upload-tips">
                          仅限jpg、gif、png，仅限上传1张
                        </div>
                      </div>
                    </el-form-item>
                    <div class="bg-img">
                      <div class="business-license-box">
                        <el-form-item
                          label="店铺背景图"
                          prop="mobileBackgroundPic"
                        >
                          <div class="license-content">
                            <img-upload
                              v-if="applyStatus !== 0"
                              v-model="baseInfoForm.mobileBackgroundPic"
                              :limit="1"
                              @update:model-value="imgChange(baseInfoForm.mobileBackgroundPic, 'baseInfoFormRef', 'mobileBackgroundPic')"
                            />
                            <el-image
                              v-if="applyStatus === 0 && baseInfoForm.mobileBackgroundPic"
                              class="rotating-img"
                              :preview-teleported="true"
                              style="width: 120px; height: 120px"
                              :src="checkFileUrl(baseInfoForm.mobileBackgroundPic)"
                              :preview-src-list="[checkFileUrl(baseInfoForm.mobileBackgroundPic)]"
                            >
                              <template #error>
                                <img
                                  class="img-slot"
                                  src="~@/assets/images/def.png"
                                  alt
                                >
                              </template>
                            </el-image>
                          </div>
                          <div class="img-tips">
                            <p>移动端背景图</p>
                            <p>(建议尺寸750*380)</p>
                          </div>
                        </el-form-item>
                      </div>
                      <div class="business-license-box">
                        <el-form-item
                          label-width="0"
                          prop="pcBackgroundPic"
                        >
                          <div class="license-content">
                            <img-upload
                              v-if="applyStatus !== 0"
                              v-model="baseInfoForm.pcBackgroundPic"
                              :limit="1"
                              @update:model-value="imgChange(baseInfoForm.pcBackgroundPic, 'baseInfoFormRef', 'pcBackgroundPic')"
                            />
                            <el-image
                              v-if="applyStatus === 0 && baseInfoForm.pcBackgroundPic"
                              class="rotating-img"
                              :preview-teleported="true"
                              style="width: 120px; height: 120px"
                              :src="checkFileUrl(baseInfoForm.pcBackgroundPic)"
                              :preview-src-list="[checkFileUrl(baseInfoForm.pcBackgroundPic)]"
                            >
                              <template #error>
                                <img
                                  class="img-slot"
                                  src="~@/assets/images/def.png"
                                  alt
                                >
                              </template>
                            </el-image>
                          </div>
                          <div class="img-tips">
                            <p>PC端背景图</p>
                            <p>(建议尺寸590*220)</p>
                          </div>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="left-info">
                    <el-form-item
                      label="商家名称"
                      prop="merchantName"
                    >
                      <el-input
                        v-model.trim="baseInfoForm.merchantName"
                        placeholder="请输入10字以内的商家名称"
                        maxlength="10"
                        :disabled="isNotEdit"
                      />
                    </el-form-item>
                    <el-form-item
                      label="店铺名称"
                      prop="shopName"
                    >
                      <el-input
                        v-model.trim="baseInfoForm.shopName"
                        placeholder="请输入20字以内的店铺名称"
                        maxlength="20"
                        :disabled="isNotEdit"
                      />
                    </el-form-item>
                    <el-form-item
                      label="联系人"
                      prop="contactName"
                    >
                      <el-input
                        v-model.trim="baseInfoForm.contactName"
                        placeholder="请输入常用联系人姓名"
                        maxlength="10"
                        :disabled="isNotEdit"
                      />
                    </el-form-item>
                    <el-form-item
                      label="联系方式"
                      prop="contactPhone"
                    >
                      <el-input
                        v-model.trim="baseInfoForm.contactPhone"
                        placeholder="请输入常用联系人11位手机号码"
                        maxlength="11"
                        :disabled="isNotEdit"
                        @input="onHandlePhone('contactPhone')"
                      />
                    </el-form-item>
                    <el-form-item
                      label="店铺简介"
                      prop="intro"
                    >
                      <div style="width:100%">
                        <div class="business-license-box">
                          <div class="license-content">
                            <el-input
                              v-model="baseInfoForm.intro"
                              :disabled="isNotEdit"
                              type="textarea"
                              :rows="4"
                              maxlength="200"
                              placeholder="请输入200字以内店铺简介"
                            />
                          </div>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </div>

                <div class="btn">
                  <div
                    v-if="applyStatus !== 0"
                    class="next-btn"
                    @click="toNextStep"
                  >
                    提交，下一步
                  </div>
                  <div
                    v-if="applyStatus === 0"
                    class="next-btn"
                    @click="viewNextStep"
                  >
                    查看下一步
                  </div>
                </div>
              </el-form>
            </div>
          </div>

          <!-- 第二步 工商信息 -->
          <div
            v-else-if="applyStep===2"
            class="company-info"
          >
            <!-- native modifier has been removed, please confirm whether the function has been affected  -->
            <el-form
              ref="companyInfoFormRef"
              :model="companyInfoForm"
              :rules="companyInfoRule"
              label-width="auto"
              @submit.prevent
            >
              <div class="ci-wrapper company">
                <div class="left-info">
                  <el-form-item
                    label="统一社会信用代码"
                    prop="creditCode"
                  >
                    <el-input
                      v-model="companyInfoForm.creditCode"
                      maxlength="20"
                      placeholder="统一社会信用代码"
                      :disabled="isNotEdit"
                    />
                  </el-form-item>
                  <el-form-item
                    label="企业名称"
                    prop="firmName"
                  >
                    <el-input
                      v-model="companyInfoForm.firmName"
                      maxlength="50"
                      placeholder="输入50字以内的企业名称"
                      :disabled="isNotEdit"
                    />
                  </el-form-item>
                  <el-form-item
                    label="住所"
                    prop="residence"
                  >
                    <el-input
                      v-model="companyInfoForm.residence"
                      maxlength="50"
                      placeholder="输入50字以内的住所"
                      :disabled="isNotEdit"
                    />
                  </el-form-item>
                  <el-form-item
                    label="法定代表人"
                    prop="representative"
                  >
                    <el-input
                      v-model="companyInfoForm.representative"
                      maxlength="20"
                      placeholder="输入20字以内的法定代表人"
                      :disabled="isNotEdit"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="paySettlementType===1"
                    label="法人身份证号"
                    prop="legalIds"
                  >
                    <el-input
                      v-model="companyInfoForm.legalIds"
                      maxlength="18"
                      placeholder="输入法人身份证号"
                      :disabled="isNotEdit"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="paySettlementType===1"
                    label="法人手机号"
                    prop="legalPhone"
                  >
                    <el-input
                      v-model="companyInfoForm.legalPhone"
                      maxlength="11"
                      placeholder="输入法人手机号"
                      :disabled="isNotEdit"
                      @input="onHandlePhone('legalPhone')"
                    />
                  </el-form-item>
                  <el-form-item
                    label="注册资本"
                    class="capital-int"
                  >
                    <el-input-number
                      v-model="companyInfoForm.capital"
                      prop="capital"
                      :disabled="isNotEdit"
                      controls-position="right"
                      style="width:200px"
                      :max="99999999"
                      :precision="2"
                    />
                    <span class="price-unit-text">万元</span>
                  </el-form-item>
                  <el-form-item
                    label="成立日期"
                    prop="foundTime"
                  >
                    <el-date-picker
                      v-model="companyInfoForm.foundTime"
                      style="width:200px"
                      type="date"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      placeholder="选择日期"
                      :disabled="isNotEdit"
                      :picker-options="pickerOptions"
                    />
                  </el-form-item>
                  <el-form-item
                    label="营业期限"
                    prop="startTime"
                  >
                    <div style="display: flex">
                      <el-date-picker
                        v-model="companyInfoForm.startTime"
                        style="width:172px;"
                        type="date"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        placeholder="开始日期"
                        :disabled="isNotEdit"
                        clearable
                        @change="onValidateTime('startTime')"
                      />
                      <span style="margin: 0 10px">-</span>
                      <span class="end-time">
                        <el-date-picker
                          ref="endTimeRef"
                          v-model="companyInfoForm.endTime"
                          style="width:172px;"
                          type="date"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          :placeholder="(isNotEdit && !companyInfoForm.endTime && companyInfoForm.startTime) ? '' : '结束日期'"
                          clearable
                          :disabled="isNotEdit || !companyInfoForm.startTime"
                          @change="onValidateTime('endTime')"
                        />
                        <span
                          v-if="isNotEdit && !companyInfoForm.endTime && companyInfoForm.startTime"
                          class="text"
                        >
                          无固定期限
                        </span>
                      </span>
                    </div>
                  </el-form-item>
                  <el-form-item
                    label="经营范围"
                    prop="businessScope"
                    style="margin-bottom:30px;"
                  >
                    <el-input
                      v-model="companyInfoForm.businessScope"
                      type="textarea"
                      resize="none"
                      :rows="4"
                      placeholder="输入500字以内经营范围"
                      maxlength="500"
                      :disabled="isNotEdit"
                    />
                  </el-form-item>
                </div>
                <div class="right-info">
                  <el-form-item
                    label="营业执照电子版"
                    prop="businessLicense"
                  >
                    <div class="business-license-box">
                      <div class="license-content">
                        <img-upload
                          v-if="applyStatus !== 0"
                          v-model="companyInfoForm.businessLicense"
                          :limit="1"
                          @update:model-value="imgChange(companyInfoForm.businessLicense, 'companyInfoFormRef', 'businessLicense')"
                        />
                        <el-image
                          v-if="applyStatus === 0 && companyInfoForm.businessLicense"
                          class="rotating-img"
                          :preview-teleported="true"
                          style="width: 120px; height: 120px"
                          :src="checkFileUrl(companyInfoForm.businessLicense)"
                          :preview-src-list="[checkFileUrl(companyInfoForm.businessLicense)]"
                        >
                          <template #error>
                            <img
                              class="img-slot"
                              src="~@/assets/images/def.png"
                              alt
                            >
                          </template>
                        </el-image>
                        <div class="example-box">
                          <img
                            src="@/assets/example-img/Business-license.png"
                            alt
                          >
                          <div class="tips">
                            示例
                          </div>
                        </div>
                      </div>
                      <div class="upload-tips">
                        仅限jpg、gif、png，仅限上传1张
                      </div>
                    </div>
                  </el-form-item>
                  <div class="id-box">
                    <div class="upload-content">
                      <div class="upload-img">
                        <el-form-item
                          class="idcard"
                          label="法人身份证"
                          prop="identityCardFront"
                        >
                          <img-upload
                            v-if="applyStatus !== 0 || (applyStatus === 0 && !companyInfoForm.identityCardFront)"
                            v-model="companyInfoForm.identityCardFront"
                            :limit="1"
                            @update:model-value="imgChange(companyInfoForm.identityCardFront, 'companyInfoFormRef', 'identityCardFront')"
                          />
                          <el-image
                            v-if="applyStatus === 0 && companyInfoForm.identityCardFront"
                            class="rotating-img"
                            :preview-teleported="true"
                            style="width: 120px; height: 120px"
                            :src="checkFileUrl(companyInfoForm.identityCardFront)"
                            :preview-src-list="[checkFileUrl(companyInfoForm.identityCardFront)]"
                          >
                            <template #error>
                              <img
                                class="img-slot"
                                src="~@/assets/images/def.png"
                                alt
                              >
                            </template>
                          </el-image>
                        </el-form-item>
                        <el-form-item
                          class="idcard"
                          label-width="0"
                          prop="identityCardLater"
                        >
                          <img-upload
                            v-if="applyStatus !== 0 || (applyStatus === 0 && !companyInfoForm.identityCardLater)"
                            v-model="companyInfoForm.identityCardLater"
                            :limit="1"
                            @update:model-value="imgChange(companyInfoForm.identityCardLater, 'companyInfoFormRef', 'identityCardLater')"
                          />
                          <el-image
                            v-if="applyStatus === 0 && companyInfoForm.identityCardLater"
                            class="rotating-img"
                            :preview-teleported="true"
                            style="width: 120px; height: 120px"
                            :src="checkFileUrl(companyInfoForm.identityCardLater)"
                            :preview-src-list="[checkFileUrl(companyInfoForm.identityCardLater)]"
                          >
                            <template #error>
                              <img
                                class="img-slot"
                                src="~@/assets/images/def.png"
                                alt
                              >
                            </template>
                          </el-image>
                        </el-form-item>
                      </div>
                      <div class="upload-example">
                        <div class="example-box">
                          <img
                            src="@/assets/example-img/idcard1.png"
                            alt
                          >
                          <div class="tips">
                            人像面示例
                          </div>
                        </div>
                        <div class="example-box">
                          <img
                            src="@/assets/example-img/idcard2.png"
                            alt
                          >
                          <div class="tips">
                            国徽面示例
                          </div>
                        </div>
                      </div>
                      <div class="upload-tips">
                        请上传身份证正反面照片，仅限jpg、gif、png，仅限上传2张
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="footer">
                <div
                  v-if="applyStatus !== 0"
                  class="btn-box"
                >
                  <div
                    class="prev-btn"
                    @click="toPrevStep"
                  >
                    上一步
                  </div>
                  <div
                    class="next-btn"
                    @click="toNextStep"
                  >
                    提交，下一步
                  </div>
                </div>
                <div
                  v-if="applyStatus === 0"
                  class="btn-box"
                >
                  <div
                    class="prev-btn"
                    @click="toPrevStep"
                  >
                    查看上一步
                  </div>
                  <div
                    class="next-btn"
                    @click="viewNextStep"
                  >
                    查看下一步
                  </div>
                </div>
              </div>
            </el-form>
          </div>

          <!-- 第三步 签约信息 -->
          <div
            v-else-if="applyStep===3"
            class="signing-content"
          >
            <!-- 签约类目 -->
            <div class="s-category-item s-item">
              <div class="table-data-title">
                <div class="text">
                  <span class="stress">*</span>签约类目
                </div>
                <div class="tips">
                  已签约<span class="txt-bold">{{ signCategoryList.length }}</span>个类目，
                  最多可签约<span class="txt-bold">200</span>个类目
                </div>
                <div
                  v-if="applyStatus !== 0"
                  class="edit-btn"
                  @click="cateAddOrUpdateHandle(0)"
                >
                  新增签约类目
                </div>
              </div>
              <div class="si-content">
                <el-table
                  :data="signCategoryList"
                  :header-cell-style="{height:'50px',background:'#F5F5F5',color:'#000','font-weight': '400'}"
                >
                  <el-table-column
                    prop="name"
                    label="类目"
                    align="center"
                  />
                  <el-table-column
                    prop="parentName"
                    label="上级类目"
                    align="center"
                  />
                  <el-table-column
                    prop="platformRate"
                    label="类目扣率"
                    align="center"
                  >
                    <template #default="{ row }">
                      <span>{{ row.platformRate }} %</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="qualifications"
                    label="经营资质"
                    width="250"
                    align="center"
                  >
                    <template #default="{row}">
                      <div
                        v-if="row.imgs && row.imgs.length"
                        class="img-box"
                      >
                        <el-image
                          v-for="(item, index) in row.imgs"
                          :key="index"
                          class="rotating-img"
                          :preview-teleported="true"
                          :src="checkFileUrl(item)"
                          :preview-src-list="checkFileUrl(row.imgs)"
                        >
                          <template #error>
                            <img
                              class="img-slot"
                              src="~@/assets/images/def.png"
                              alt
                            >
                          </template>
                        </el-image>
                      </div>
                      <span v-if="!row.imgs || !row.imgs.length">--</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="categoryStatus"
                    label="状态"
                    width="80"
                  >
                    <template #default="scope">
                      <div
                        v-if="scope.row.categoryStatus === 1"
                        class="tag-txt"
                      >
                        正常
                      </div>
                      <div
                        v-if="scope.row.categoryStatus === 0"
                        class="tag-txt red-tag-txt"
                      >
                        下架
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <!-- 签约品牌 -->
            <div class="s-brand-item s-item">
              <div class="table-data-title">
                <div class="text">
                  签约品牌
                </div>
                <div class="tips">
                  已签约<span class="txt-bold">{{ signedBrands.length }}</span>个品牌，
                  最多可签约<span class="txt-bold">50</span>个品牌
                </div>
                <div
                  v-if="applyStatus !== 0"
                  class="edit-btn"
                  @click="cateAddOrUpdateHandle(1)"
                >
                  新增签约品牌
                </div>
              </div>
              <div class="si-content">
                <!-- height="284" -->
                <el-table
                  :data="signedBrands"
                  :header-cell-style="{height:'50px',background:'#F5F5F5',color:'#000','font-weight': '400'}"
                >
                  <el-table-column
                    prop="name"
                    label="品牌名称"
                    align="center"
                  />
                  <el-table-column
                    prop="firstLetter"
                    label="检索首字母"
                    align="center"
                  />
                  <el-table-column
                    prop="parentName"
                    label="上级类目"
                    align="center"
                  />
                  <el-table-column
                    prop="platformRate"
                    label="品牌logo"
                    align="center"
                  >
                    <template #default="scope">
                      <div class="img-box">
                        <el-image
                          class="rotating-img"
                          :preview-teleported="true"
                          :src="checkFileUrl(scope.row.imgUrl)"
                          :preview-src-list="[checkFileUrl(scope.row.imgUrl)]"
                        >
                          <template #error>
                            <img
                              class="img-slot"
                              src="~@/assets/images/def.png"
                              alt
                            >
                          </template>
                        </el-image>
                        <span v-if="!scope.row.imgUrl">--</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="imgs"
                    label="授权文件"
                    width="250"
                    align="center"
                  >
                    <template #default="{row}">
                      <div
                        v-if="row.imgs && row.imgs.length"
                        class="img-box"
                      >
                        <el-image
                          v-for="(item, index) in row.imgs"
                          :key="index"
                          class="rotating-img"
                          :preview-teleported="true"
                          :src="checkFileUrl(item)"
                          :preview-src-list="checkFileUrl(row.imgs)"
                        >
                          <template #error>
                            <img
                              class="img-slot"
                              src="~@/assets/images/def.png"
                              alt
                            >
                          </template>
                        </el-image>
                      </div>
                      <div v-if="!row.imgs.length">
                        --
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="brandStatus"
                    label="状态"
                    width="80"
                  >
                    <template #default="{row}">
                      <div
                        v-if="row.type === 0 && row.brandStatus === 1"
                        class="tag-txt"
                      >
                        正常
                      </div>
                      <div
                        v-if="row.type === 0 && row.brandStatus === 0"
                        class="tag-txt red-tag-txt"
                      >
                        下架
                      </div>
                      <!-- 自定义的品牌 -->
                      <div
                        v-if="row.type === 1 && row.brandStatus === 3"
                        class="tag-txt"
                      >
                        待审核
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div
              v-if="applyStatus !== 0"
              class="btn-box"
            >
              <div
                class="prev-btn"
                @click="toPrevStep"
              >
                上一步
              </div>
              <div
                class="next-btn"
                @click="toNextStep"
              >
                下一步
              </div>
            </div>
            <div
              v-if="applyStatus === 0"
              class="btn-box"
            >
              <div
                class="prev-btn"
                @click="toPrevStep"
              >
                查看上一步
              </div>
              <div
                class="next-btn"
                @click="viewNextStep"
              >
                查看下一步
              </div>
            </div>
          </div>

          <!-- 第四步 财务信息 -->
          <div
            v-else
            class="finance-info content-wrapper"
          >
            <div
              v-if="paySettlementType===0"
              class="table-data-title"
            >
              <div class="text">
                <span class="stress">*</span>结算银行账户
              </div>
              <div class="tips">
                已添加<span class="txt-bold">{{ bankCartInfoForm.data.length }}</span>个结算账户，最多可添加<span class="txt-bold">5</span>个结算账户，如需修改结算账户请在店铺信息模块操作
              </div>
              <div
                v-if="applyStatus !== 0 && applyStatus !== 1"
                class="edit-btn"
                @click="addBankInfo"
              >
                新增
              </div>
            </div>
            <div
              v-else
              class="table-data-title"
            >
              <div class="text">
                <span class="stress">*</span>结算银行账户
              </div>
              <div class="tips">
                开店时最多可添加1个对公账户
              </div>
            </div>
            <div class="fi-content">
              <!-- 添加图表 -->
              <!-- 审核状态applyStatus 0 未审核 1已通过 -1未通过 -->
              <!-- native modifier has been removed, please confirm whether the function has been affected  -->
              <el-form
                v-if="applyStatus !== 0 && applyStatus !== 1"
                ref="bankCartInfoFormRef"
                :model="bankCartInfoForm"
                :rules="bankCartInfoForm.rule"
                @submit.prevent
              >
                <el-table
                  ref="bankTableRef"
                  class="add-bank-info-table"
                  :data="bankCartInfoForm.data"
                  :header-cell-style="{height:'50px',background:'#F5F5F5',color:'#000','font-weight': '400'}"
                  style="width: 100%"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    width="80"
                  />
                  <template v-if="paySettlementType===0">
                    <el-table-column
                      prop="bankName"
                      label="银行名称"
                    >
                      <template #default="scope">
                        <el-form-item
                          :prop="'data.' + scope.$index + '.bankName'"
                          :rules="bankCartInfoForm.rule.bankName"
                        >
                          <el-input
                            v-model="scope.row.bankName"
                            placeholder="输入银行名称"
                            maxlength="20"
                            style="width:200px"
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="recipientName"
                      label="账户名"
                    >
                      <template #default="scope">
                        <el-form-item
                          :prop="'data.' + scope.$index + '.recipientName'"
                          :rules="bankCartInfoForm.rule.recipientName"
                        >
                          <el-input
                            v-model="scope.row.recipientName"
                            maxlength="20"
                            placeholder="不超过20个字符"
                            style="width:200px"
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="cardNo"
                      label="账号"
                      width="300"
                    >
                      <template #default="scope">
                        <el-form-item
                          :prop="'data.' + scope.$index + '.cardNo'"
                          :rules="bankCartInfoForm.rule.cardNo"
                        >
                          <el-input
                            v-model.trim="scope.row.cardNo"
                            maxlength="30"
                            placeholder="输入账号"
                            style="width:230px"
                            @input="onCardNoInput($event, scope.$index)"
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="branchName"
                      label="支行名称"
                    >
                      <template #default="scope">
                        <el-form-item
                          :prop="'data.' + scope.$index + '.branchName'"
                          :rules="bankCartInfoForm.rule.branchName"
                        >
                          <el-input
                            v-model="scope.row.branchName"
                            placeholder="例如：南京市雨花区雨花支行"
                            maxlength="20"
                            style="width:230px"
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column width="50">
                      <template #default="scope">
                        <el-icon
                          v-if="bankCartInfoForm.data.length > 1"
                          @click="deleteBankInfoItem(scope.$index)"
                        >
                          <Remove />
                        </el-icon>
                      </template>
                    </el-table-column>
                  </template>
                  <template v-else-if="paySettlementType===1">
                    <el-table-column
                      prop="parentBankName"
                      label="银行名称"
                    >
                      <template #default="scope">
                        <el-form-item
                          :prop="'data.' + scope.$index + '.parentBankName'"
                          :rules="bankCartInfoForm.rule.parentBankName"
                        >
                          <el-select
                            v-model="selectBank"
                            filterable
                            placeholder="请选择"
                            style="width:200px"
                            @change="changeBank"
                          >
                            <el-option
                              v-for="item in bankList"
                              :key="item.bankId"
                              :label="item.bankName"
                              :value="item.bankName"
                            />
                          </el-select>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="bankName"
                      label="开户分行名称"
                    >
                      <template #default="scope">
                        <el-form-item
                          :prop="'data.' + scope.$index + '.bankName'"
                          :rules="bankCartInfoForm.rule.bankName"
                        >
                          <el-input
                            v-model="scope.row.bankName"
                            maxlength="20"
                            placeholder="例如：南京市雨花区雨花支行"
                            style="width:200px"
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="accountNo"
                      label="企业对公账户"
                      width="300"
                    >
                      <template #default="scope">
                        <el-form-item
                          :prop="'data.' + scope.$index + '.accountNo'"
                          :rules="bankCartInfoForm.rule.accountNo"
                        >
                          <el-input
                            v-model.trim="scope.row.accountNo"
                            maxlength="23"
                            oninput="value=value.replace(/[^\d]/g,'')"
                            placeholder="请输入企业对公账户"
                            style="width:230px"
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="unionBank"
                      label="支付行号"
                    >
                      <template #default="scope">
                        <el-form-item
                          :prop="'data.' + scope.$index + '.unionBank'"
                          :rules="bankCartInfoForm.rule.unionBank"
                        >
                          <el-input
                            v-model="scope.row.unionBank"
                            placeholder="请输入12位的支付行号"
                            oninput="value=value.replace(/[^\d]/g,'')"
                            maxlength="12"
                            style="width:230px"
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                  </template>
                </el-table>
              </el-form>

              <!-- 展示图表 -->
              <div
                v-if="applyStatus === 0 || applyStatus === 1"
                class="show-tab"
              >
                <el-table
                  :data="bankCartInfoForm.data"
                  style="width: 100%"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    width="80"
                  />
                  <template v-if="paySettlementType===0">
                    <el-table-column
                      prop="bankName"
                      label="银行"
                    />
                    <el-table-column
                      prop="recipientName"
                      label="账户名"
                    />
                    <el-table-column
                      prop="cardNo"
                      label="账号"
                    />
                    <el-table-column
                      prop="branchName"
                      label="支行"
                    />
                  </template>
                  <template v-else-if="paySettlementType===1">
                    <el-table-column
                      prop="parentBankName"
                      label="银行名称"
                    />
                    <el-table-column
                      prop="bankName"
                      label="开户分行名称"
                    />
                    <el-table-column
                      prop="accountNo"
                      label="企业对公账户"
                    />
                    <el-table-column
                      prop="unionBank"
                      label="支付行号"
                    />
                  </template>
                </el-table>
              </div>
              <div
                v-if="applyStatus !== 0 && applyStatus !== 1"
                class="btn-box"
              >
                <div
                  class="prev-btn"
                  @click="toPrevStep"
                >
                  上一步
                </div>
                <div
                  class="next-btn"
                  @click="toNextStep"
                >
                  提交
                </div>
              </div>
              <div
                v-if="applyStatus === 0 || applyStatus === 1"
                class="btn-box"
              >
                <div
                  class="prev-btn"
                  @click="toPrevStep"
                >
                  查看上一步
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <category-add-or-update
      v-if="cateAddOrUpdateVisible"
      ref="cateAddOrUpdateRef"
      :sign-category-list="signCategoryList"
      :push="categoryPush"
      :delete-by-id="deleteById"
      :splice="categorySplice"
      :map="categoryMap"
      @close-popup="closePopup"
    />
    <brand-add-or-update
      v-if="brandAddOrUpdateVisible"
      ref="brandAddOrUpdateRef"
      :brand-name-list="brandNameList"
      :parent-brand-list="parentBrandList"
      @close-popup="closePopup"
    />

    <!-- 图片预览 -->
    <picture-preview
      v-if="picturePreviewVisible"
      ref="picturePreviewRef"
    />
  </div>
</template>

<script setup>
import Navbar from '@/layout/components/Navbar.vue'
import brandAddOrUpdate from './components/brand-add-or-update/index.vue'
import categoryAddOrUpdate from './components/category-add-or-update/index.vue'
import * as api from '@/api/multishop/shop-process'
import { isMobile, isEmail, isCreditCode, validNoEmptySpace, checkIDCard } from '@/utils/validate'
import moment from 'moment'
import { Debounce } from '@/utils/debounce'
import { useAllinpayStore } from '@/stores/modules/allinpay.js'
import { ElMessage } from 'element-plus'
const paySettlementType = ref(useAllinpayStore().paySettlementType) // 是否开启通联支付 1：开启 0：关闭
const isAgree = ref(false)
const applyStep = ref(0)
const picturePreviewVisible = ref(false) // 预览图片弹窗
const companyInfoFormRef = ref(null)
const cateAddOrUpdateRef = ref(null)
const brandAddOrUpdateRef = ref(null)
const bankCartInfoFormRef = ref(null)
const picturePreviewRef = ref(null)
const baseInfoFormRef = ref(null)

const applyStatus = ref(0) // 店铺申请状态 0：未审核 1：已通过 -1：未通过 -2：未提交过申请
const isNotEdit = ref(false) // 是否不可以编辑信息, 当申请状态为待审核时不能编辑
const auditingInfo = ref('') // 审核信息
const baseInfoForm = reactive({
  accountStatus: null,
  allinpayShopStatus: null,
  area: '',
  areaId: null,
  city: '',
  cityId: null,
  collectionNum: null,
  companyAcctProtocolNo: null,
  companyInfoProcessStatus: null,
  contactName: '',
  contactPhone: '',
  contractEndTime: null,
  contractStartTime: null,
  createTime: null,
  idCardCollectProcessStatus: null,
  intro: '',
  isBindPhone: null,
  isCreateMember: null,
  isPreferred: null,
  legalAcctProtocolNo: null,
  merchantAccount: null,
  merchantName: '',
  mobileBackgroundPic: '',
  noticeMobile: null,
  pcBackgroundPic: '',
  province: '',
  provinceId: null,
  shopId: null,
  shopLat: null,
  shopLng: null,
  shopLogo: '',
  shopName: '',
  shopStatus: null,
  type: null,
  updateTime: null
})

// 第一步---基本信息
const isContactPhone = ref(false)
const setBaseInfoForm = (val) => {
  baseInfoForm.accountStatus = val.accountStatus
  baseInfoForm.allinpayShopStatus = val.allinpayShopStatus
  baseInfoForm.area = val.area
  baseInfoForm.areaId = val.areaId
  baseInfoForm.city = val.city
  baseInfoForm.cityId = val.cityId
  baseInfoForm.collectionNum = val.collectionNum
  baseInfoForm.companyAcctProtocolNo = val.companyAcctProtocolNo
  baseInfoForm.companyInfoProcessStatus = val.companyInfoProcessStatus
  baseInfoForm.contactName = val.contactName
  baseInfoForm.contactPhone = val.contactPhone
  isContactPhone.value = Boolean(val.contactPhone)
  baseInfoForm.contractEndTime = val.contractEndTime
  baseInfoForm.contractStartTime = val.contractStartTime
  baseInfoForm.createTime = val.createTime
  baseInfoForm.idCardCollectProcessStatus = val.idCardCollectProcessStatus
  baseInfoForm.intro = val.intro
  baseInfoForm.isBindPhone = val.isBindPhone
  baseInfoForm.isCreateMember = val.isCreateMember
  baseInfoForm.isPreferred = val.isPreferred
  baseInfoForm.legalAcctProtocolNo = val.legalAcctProtocolNo
  baseInfoForm.merchantAccount = val.merchantAccount
  baseInfoForm.merchantName = val.merchantName
  baseInfoForm.mobileBackgroundPic = val.mobileBackgroundPic
  baseInfoForm.noticeMobile = val.noticeMobile
  baseInfoForm.pcBackgroundPic = val.pcBackgroundPic
  baseInfoForm.province = val.province
  baseInfoForm.provinceId = val.provinceId
  baseInfoForm.shopId = val.shopId
  baseInfoForm.shopLat = val.shopLat
  baseInfoForm.shopLng = val.shopLng
  baseInfoForm.shopLogo = val.shopLogo
  baseInfoForm.shopName = val.shopName
  baseInfoForm.shopStatus = val.shopStatus
  baseInfoForm.type = val.type
  baseInfoForm.updateTime = val.updateTime
}

const categoryPush = item => {
  signCategoryList.value.push(item)
}
const deleteById = (id, list) => {
  for (let index = list.length - 1; index >= 0; index--) {
    if (list[index] && list[index].categoryId === id) {
      list.splice(index, 1)
    }
  }
  return list
}

const signCategoryList = ref([]) // 签约的分类信息
const categorySplice = (inx, num) => {
  signCategoryList.value.splice(inx, num)
}

const categoryMap = (fun) => {
  return signCategoryList.value.map(fun)
}
// eslint-disable-next-line no-unused-vars
const validateCardNo = (rule, value, callback) => {
  if (bankCartInfoForm.data.length > 1) {
    let flag = 0
    for (const item of bankCartInfoForm.data) {
      if (item.cardNo === value) {
        flag++
      }
    }
    if (flag > 1) {
      callback(new Error(`银行卡号${value}重复`))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
const validEmptyTab = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error($t('内容不能全为空格')))
  } else {
    callback()
  }
}
const validateMobile = (rule, value, callback) => {
  if (isMobile(value) || (isContactPhone.value && isStarMobile(value))) {
    callback()
  } else {
    callback(new Error('输入正确的联系方式'))
  }
}
const validIDCard = (rule, value, callback) => {
  if (!value || !checkIDCard(value)) {
    callback(new Error('请输入正确的法人身份证'))
  } else {
    callback()
  }
}
const vaildCreditCode = (rule, value, callback) => {
  if (!isCreditCode(value)) {
    callback(new Error($t('请输入正确的统一社会信用代码')))
  } else {
    // 检查统一信用码是否已存在
    api.checkForDuplicateCreditCode({
      creditCode: value,
      shopId: baseInfoForm.shopId === null ? -1 : baseInfoForm.shopId
    }).then(data => {
      if (data) {
        callback(new Error('该统一社会信用代码重复，请重新输入'))
      } else {
        callback()
      }
    }).catch(() => {
      callback()
    })
  }
}
const validMobile = (rule, value, callback) => {
  if (isMobile(value) || (isLegalPhone.value && isStarMobile(value))) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号'))
  }
}
// 基础信息验证
const baseInfoRule = {
  merchantName: [
    { required: true, message: '商家名称不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '商家名称长度在2-10个字符之间', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  shopName: [
    { required: true, message: '店铺名称不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '店铺名称长度在2-20个字符之间', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  contactName: [
    { required: true, message: '联系人不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '联系人长度在2-10个字符之间', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请填写联系方式', trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ],
  shopLogo: [
    { required: true, message: '请上传店铺logo', trigger: 'change' }
  ],
  mobileBackgroundPic: [
    { required: true, message: '请上传移动端背景图', trigger: 'change' }
  ],
  pcBackgroundPic: [
    { required: true, message: '请上传PC端背景图', trigger: 'change' }
  ],
  intro: [
    { validator: validEmptyTab, trigger: 'blur' }
  ]
}

// 成立日期：今日之前可选
const pickerOptions = reactive({
  disabledDate (time) {
    const date = moment().add(0, 'days').startOf('days')
    return (
      time.getTime() > date.valueOf()
    )
  }
})
const companyInfoRule = reactive({
  creditCode: [
    { required: true, message: '请填写统一社会信用代码', trigger: 'blur' },
    { validator: vaildCreditCode, trigger: 'blur' }
  ],
  firmName: [
    { required: true, message: '企业名称不能为空', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  residence: [
    // 住所
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  businessScope: [
    { required: true, message: '经营范围不能为空', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  businessLicense: [
    { required: true, message: '营业执照需要上传', trigger: 'change' }
  ],
  representative: [
    { required: true, message: '法定代表人不能为空', trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  legalIds: [
    { required: true, message: '法人身份证不能为空', trigger: 'blur' },
    { validator: validIDCard, trigger: 'blur' }
  ],
  legalPhone: [
    { required: true, message: '法人手机号不能为空', trigger: 'blur' },
    { validator: validMobile, trigger: 'blur' }
  ],
  identityCardFront: [
    { required: true, message: '上传法人身份证人像面', trigger: 'change' }
  ],
  identityCardLater: [
    { required: true, message: '上传法人身份证国徽面', trigger: 'change' }
  ]
})

// 第三步---签约信息
const signedBrands = ref([]) // 平台品牌+自定义品牌

const parentBrandList = ref([]) // 自定义品牌的上级分类
// 已有品牌类目
const brandNameList = ref([])

// 第四步---财务信息
const bankCartInfoForm = reactive({
  data: [
    {
      bankName: '',
      recipientName: '',
      cardNo: '',
      branchName: '',
      accountNo: '', // 企业对公账户
      parentBankName: '', // 开户银行名称
      unionBank: '', // 支付行号 12位数字
      bankCardPro: 1 // 银行卡属性 0-法人 1-企业对公
    }
  ],
  rule: {
    bankName: [
      { required: true, message: paySettlementType.value === 1 ? '请填写开户支行名称' : '银行名称不能为空', trigger: 'blur' },
      { min: 2, max: 20, message: paySettlementType.value === 1 ? '开户支行名称长度在2到20个字符' : '银行名称长度在2到20个字符', trigger: 'blur' },
      { validator: validEmptyTab, trigger: 'blur' }
    ],
    recipientName: [
      { required: true, message: '账户名不能为空', trigger: 'blur' },
      { min: 2, max: 20, message: '账户名长度在2到20个字符', trigger: 'blur' },
      { validator: validEmptyTab, trigger: 'blur' }
    ],
    cardNo: [
      { required: true, message: '账号不能为空', trigger: 'blur' },
      { min: 8, max: 30, message: '账号在8到30个字符', trigger: 'blur' },
      { validator: validateCardNo, trigger: 'blur' },
      { validator: validEmptyTab, trigger: 'blur' }
    ],
    branchName: [
      { required: true, message: '支行名称不能为空', trigger: 'blur' },
      { min: 2, max: 20, message: '支行名称长度在2到20个字符', trigger: 'blur' },
      { validator: validEmptyTab, trigger: 'blur' }
    ],
    accountNo: [
      { required: true, message: '请填写企业对公账户', trigger: 'blur' }
    ],
    parentBankName: [
      { required: true, message: '请填写开户银行名称', trigger: 'change' }
    ],
    unionBank: [
      { required: true, message: '请填写支付行号', trigger: 'blur' },
      { min: 12, max: 12, message: '请填写正确的支付行号', trigger: 'blur' }
    ]
  }
})
const bankList = ref([])
const selectBank = ref('') // 选择的银行，通联
const submit = ref(false)
const loadGetAuditingInfo = ref(false)
watch(() => applyStep.value, (newStep) => {
  if (newStep === 0) {
    getShopProtocol()
    return
  }
  switch (newStep) {
    case 0:
      getShopProtocol()
      break
    case 1:
      getBasicInfo()
      break
    case 2:
      getCompanyInfo()
      break
    case 3:
      getSignCategoryList()
      getSignBrandList()
      break
    case 4:
      getBankCartInfo()
      if (paySettlementType.value === 1) {
        getBankList()
      }
      break
  }
})

onMounted(() => {
  // 获取店铺审核状态
  getAuditingInfo()
  if (paySettlementType.value === 1) {
    bankCartInfoForm.data = [{
      bankName: '',
      accountNo: '', // 企业对公账户
      parentBankName: '', // 开户银行名称
      unionBank: '', // 支付行号 12位数字
      bankCardPro: 1 // 银行卡属性 0-法人 1-企业对公
    }]
  } else {
    bankCartInfoForm.data = [{
      bankName: '',
      recipientName: '',
      cardNo: '',
      branchName: ''
    }]
  }
  switch (applyStep.value) {
    case 0:
      getShopProtocol()
      break
    case 1:
      getBasicInfo()
      break
    case 2:
      getCompanyInfo()
      break
    case 3:
      getSignBrandList()
      break
    case 4:
      getBankCartInfo()
      break
  }
})

const onHandlePhone = (attr) => {
  if (attr === 'contactPhone') {
    const rex = isContactPhone.value ? /[^\d|*]/g : /[^\d]/g
    baseInfoForm.contactPhone = baseInfoForm.contactPhone.replace(rex, '')
  } else if (attr === 'legalPhone') {
    const rex = isLegalPhone.value ? /[^\d|*]/g : /[^\d]/g
    companyInfoForm.value.legalPhone = companyInfoForm.value.legalPhone.replace(rex, '')
  }
}

/**
 * 图片的值发生改变，重新校验对应表单字段
 * @param {String} value 改变的值
 * @param {String} formName 表单名称
 * @param {String} prop 校验字段
 */
const imgChange = (value, formName, prop) => {
  const formMap = { // 表单类型
    companyInfoFormRef, // 工商信息表单
    baseInfoFormRef // 基本信息表单
  }
  if (value) {
    formMap[formName].value?.validateField(prop)
  }
}

const shopProtocol = ref(null)
/**
 * 获取店铺协议
 */
const getShopProtocol = async () => {
  const data = await api.getShopProtocol()
  shopProtocol.value = data
}

/**
 * 获取店铺审核状态信息
 */
const getAuditingInfo = () => {
  api.getAuditingInfo().then(data => {
    if (data) {
      // 审核状态status 0 未审核 1已通过 -1未通过 2平台下线 3 平台下线待审核
      applyStatus.value = data.status
      auditingInfo.value = data.remarks
      isNotEdit.value = data.status === 0
    } else {
      // 未开店
      applyStatus.value = -2
    }
    if (applyStatus.value === 0) {
      applyStep.value = 1
    }
    loadGetAuditingInfo.value = true
  })
}

/**
 * 获取店铺基本信息
 */
const getBasicInfo = () => {
  api.getBasicInfo().then(data => {
    if (data) {
      setBaseInfoForm(data)
    }
  })
}

/**
 * 储存基本信息
 */
const saveBasicInfo = function () {
  if (submit.value) {
    return
  }
  submit.value = true
  api.saveBasicInfo(baseInfoForm).then(() => {
    applyStep.value += 1
    ElMessage({
      message: '基本信息保存成功',
      type: 'success',
      duration: 1000
    })
    submit.value = false
  }).catch(() => {
    submit.value = false
  })
}

const companyInfoForm = ref({
  creditCode: '',
  firmName: '',
  residence: '',
  representative: '',
  capital: '',
  foundTime: '',
  startTime: '',
  endTime: '',
  businessScope: '',
  businessLicense: '',
  identityCardFront: '',
  identityCardLater: '',
  legalIds: '',
  legalPhone: ''
})
/**
 * 获取工商信息
 */
const isLegalPhone = ref(false)
const getCompanyInfo = () => {
  api.getCompanyInfo().then(data => {
    if (data) {
      companyInfoForm.value = data
      isLegalPhone.value = Boolean(data.legalPhone)
    }
  })
}

/**
 * 储存工商信息
 */
const saveCompanyInfo = Debounce(function () {
  api.saveCompanyInfo(companyInfoForm.value).then(() => {
    ElMessage({
      message: '工商信息保存成功',
      type: 'success',
      duration: 1000
    })
    // ElMessage.success('保存成功')
    applyStep.value += 1
  }).catch(() => {})
}, 1500)

// 获取可选银行名称列表（通联）
const getBankList = () => {
  api.getBankList().then(data => {
    bankList.value = data
  })
}

/**
 * 增加银行信息项
 */
const addBankInfo = () => {
  if (bankCartInfoForm.data.length < 5) {
    bankCartInfoForm.data.push(
      {
        bankName: '',
        recipientName: '',
        cardNo: '',
        branchName: ''
      }
    )
  } else {
    ElMessage({
      message: '最多可添加5个结算账户',
      type: 'error',
      duration: 1000
    })
  }
}

/**
 * 签约类目列表
 */
const getSignCategoryList = () => {
  api.getSignCategoryList().then((data) => {
    if (data) {
      data.forEach(item => {
        item.imgs = item.qualifications ? item.qualifications.split(',') : []
      })

      signCategoryList.value = data
      parentBrandList.value = JSON.parse(JSON.stringify(signCategoryList.value))
      const obj = {}
      parentBrandList.value = parentBrandList.value.reduce((cur, next) => {
        if (!obj[next.name]) {
          obj[next.name] = cur.push(next)
        }
        return cur
      }, []) // 设置cur默认类型为数组，并且初始值为空的数组 数组对象去重
    }
  })
}

/**
 * 获取签约品牌列表
 */
const getSignBrandList = () => {
  signedBrands.value = []
  api.getSignBrandList().then(data => {
    const bNameList = []
    data.platformBrandList.forEach((item) => {
      bNameList.push(item.name)
      let parentName = ''
      if (item.categories) {
        parentName = `${item.categories[0].categories[0].name}>${item.categories[0].categories[1].name}>${item.categories[0].name}`
      }
      item.parentName = parentName
    })
    brandNameList.value = bNameList
    data.customizeBrandList.forEach((item) => {
      let parentName = ''
      if (item.categories) {
        parentName = `${item.categories[0].categories[0].name}>${item.categories[0].categories[1].name}>${item.categories[0].name}`
      }
      item.parentName = parentName
    })
    signedBrands.value.splice(0, signedBrands.value.length)
    data.platformBrandList.length ? signedBrands.value.push(...data.platformBrandList) : signedBrands.value = []
    if (data.customizeBrandList.length > 0) {
      signedBrands.value.push(...data.customizeBrandList)
    }
    signedBrands.value.forEach(item => {
      brandNameList.value.push(item.name)
      item.imgs = item.qualifications ? item.qualifications.split(',') : []
    })
  })
}

/**
 * 获取银行卡列表
 */
const getBankCartInfo = () => {
  api.getBankCartInfoList().then(data => {
    bankCartInfoForm.data = data
    if (bankCartInfoForm.data === null || bankCartInfoForm.data.length === 0) {
      if (paySettlementType.value === 1) {
        bankCartInfoForm.data = [{
          bankName: '',
          accountNo: '', // 企业对公账户
          parentBankName: '', // 开户银行名称
          unionBank: '', // 支付行号 12位数字
          bankCardPro: 1 // 银行卡属性 0法人 1企业对公
        }]
      } else {
        bankCartInfoForm.data = [
          {
            bankName: '',
            recipientName: '',
            cardNo: '',
            branchName: ''
          }
        ]
      }
    } else if (paySettlementType.value === 1) {
      bankCartInfoForm.data = [{
        ...data[0],
        accountNo: data[0].bankCardNo,
        bankName: data[0].branchName,
        parentBankName: data[0].bankName
      }]
      selectBank.value = data[0].bankName
    }
  })
}

const changeBank = (value) => {
  bankCartInfoForm.data[0].parentBankName = value
}

/**
 * 删除银行信息项
 * @param {Number} index 索引
 */
const deleteBankInfoItem = (index) => {
  bankCartInfoForm.data.splice(index, 1)
}

const router = useRouter()
/**
 * 保存银行卡信息
 */
const saveBankCartInfo = Debounce(() => {
  if (submit.value) {
    return
  }
  submit.value = true
  const req = paySettlementType.value === 1 ? api.saveAllinpayBankCartInfo(bankCartInfoForm.data[0]) : api.saveBankCartInfo(bankCartInfoForm.data)
  req.then(() => {
    ElMessage({
      message: '店铺申请成功！',
      type: 'success',
      duration: 1500
    })
    if (paySettlementType.value === 1) {
      location.reload()
      router.push({ path: '/dashboard' })
      return
    }
    // 店铺信息
    getAuditingInfo()
    // 获取银行卡列表
    getBankCartInfo()
  }).finally(() => {
    submit.value = false
  })
}, 1500)

/**
 * 查看下一步
 */
const viewNextStep = () => {
  applyStep.value += 1
}
/**
 * 上一步
 */
const toPrevStep = () => {
  applyStep.value -= 1
}

/**
 * 下一步
 */
const toNextStep = Debounce(() => {
  if (applyStep.value === 0) {
    // 第零步
    if (isAgree.value === false) {
      ElMessage({
        message: '请先阅读并同意下方《商家入驻协议》',
        type: 'error',
        duration: 1500
      })
    } else {
      applyStep.value += 1
    }
    return
  }
  if (isNotEdit.value) {
    // 店铺处于审核状态不发送数据更新请求
    return
  }
  if (applyStep.value === 1) {
    // 第一步 基本信息
    baseInfoFormRef.value?.validate((valid) => {
      if (valid) {
        saveBasicInfo()
      }
    })
    return
  }
  if (applyStep.value === 2) {
    // 第二步 工商信息
    companyInfoFormRef.value?.validate((valid) => {
      if (valid) {
        if (!companyInfoForm.value.businessScope.trim()) {
          ElMessage({
            message: '经营范围不能为空或空格！',
            type: 'error',
            duration: 1000
          })
          return
        }
        saveCompanyInfo()
      }
    })
    return
  }
  if (applyStep.value === 3) {
    // 第三步 签约信息
    if (!signCategoryList.value.length) {
      ElMessage({
        message: '请至少选择一项类目',
        type: 'error',
        duration: 1000
      })
      return
    }
    applyStep.value += 1
    return
  }
  if (applyStep.value === 4) {
    // 第四步 财务信息
    bankCartInfoFormRef.value?.validate((valid) => {
      if (valid) {
        saveBankCartInfo()
      }
    })
  }
}, 300)

const cateAddOrUpdateVisible = ref(false)
const brandAddOrUpdateVisible = ref(false)
/**
 * 编辑签约信息弹窗
 * @param {Number} type 签约类型 0:类别 1:品牌
 */
const cateAddOrUpdateHandle = (type) => {
  if (applyStep.value === 0) {
    return
  }
  if (type === 0) {
    cateAddOrUpdateVisible.value = true
    nextTick(() => {
      cateAddOrUpdateRef.value?.init()
    })
  } else if (type === 1) {
    brandAddOrUpdateVisible.value = true
    nextTick(() => {
      brandAddOrUpdateRef.value?.init()
    })
  }
}
/**
 * 关闭弹窗
 */
const closePopup = (val) => {
  if (val === 'category') {
    cateAddOrUpdateVisible.value = false
    getSignCategoryList()
  } else if (val === 'brand') {
    getSignBrandList()
  }
}

const onValidateTime = (value) => {
  if (value === 'endTime') {
    if (!companyInfoForm.value.endTime) companyInfoForm.value.endTime = undefined
  } else {
    if (!companyInfoForm.value.startTime) companyInfoForm.value.endTime = undefined
  }
  if (companyInfoForm.value.endTime && Date.parse(companyInfoForm.value.startTime) >= Date.parse(companyInfoForm.value.endTime)) {
    ElMessage({
      message: '营业起始日期不能大于营业终止时间',
      type: 'error',
      duration: 1500
    })
    companyInfoForm.value.endTime = undefined
  }
}
const onCardNoInput = (value, index) => {
  const newValue = value.replace(/[^\d]/g, '')
  bankCartInfoForm.data[index].cardNo = newValue
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
