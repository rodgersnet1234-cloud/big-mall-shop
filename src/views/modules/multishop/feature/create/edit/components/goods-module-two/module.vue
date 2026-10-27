<template>
  <div class="module-two-component">
    <!-- 默认展示 start -->
    <template v-if="currentForm">
      <div class="module-left">
        <div class="module-left-header">
          <div class="header-top">
            <div class="main-title">
              热卖推荐
            </div>
            <div
              class="sub-title"
              :style="{color: 'rgba(243, 52, 51, 1)'}"
            >
              团购价更优惠
            </div>
          </div>
          <div class="header-bottom">
            <span>立即抢购</span>
            <el-icon class="el-icon-arrow-right">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
        <div class="module-left-content">
          <el-image
            src=""
            fit="fill"
          >
            <template #error>
              <div class="image-slot">
                <img
                  style="width: 27px;height: 21px"
                  src="@/assets/micro-page/def.png"
                  alt=""
                >
              </div>
            </template>
          </el-image>
        </div>
      </div>
      <div class="module-right">
        <div class="module-right-top">
          <div class="right-top-left">
            <div class="header-title">
              <div class="main-title">
                热卖推荐
              </div>
              <div
                class="sub-title"
                :style="{color: 'rgba(97, 200, 180, 1)','font-size': '11px'}"
              >
                今日上新72件
              </div>
            </div>
            <div class="show-redirect">
              <span>立即抢购</span>
              <el-icon class="el-icon-arrow-right">
                <ArrowRight />
              </el-icon>
            </div>
          </div>
          <div class="right-top-right">
            <el-image
              src=""
              fit="fill"
            >
              <template #error>
                <div class="image-slot">
                  <img
                    style="width: 15px;"
                    src="@/assets/micro-page/def.png"
                    alt=""
                  >
                </div>
              </template>
            </el-image>
          </div>
        </div>
        <div class="module-right-bottom">
          <div class="right-top-left">
            <div class="header-title">
              <div class="main-title">
                热卖推荐
              </div>
              <div
                class="sub-title"
                :style="{color: 'rgba(255, 110, 0, 1)'}"
              >
                发现好店
              </div>
            </div>
            <div class="show-redirect">
              <span>立即抢购</span>
              <el-icon class="el-icon-arrow-right">
                <ArrowRight />
              </el-icon>
            </div>
          </div>
          <div class="right-top-right">
            <el-image
              src=""
              fit="fill"
            >
              <template #error>
                <div class="image-slot">
                  <img
                    style="width: 15px;"
                    src="@/assets/micro-page/def.png"
                    alt=""
                  >
                </div>
              </template>
            </el-image>
          </div>
        </div>
      </div>
    </template>
    <!-- 默认展示 end -->
    <!-- 有配置信息 start -->
    <template v-else>
      <div class="module-left">
        <div class="module-left-header">
          <div class="header-top">
            <div
              class="main-title"
              :style="{
                'color': moduleForm.leftConfig.mainTitleColor,
                'font-size': moduleForm.leftConfig.mainTitleSize + 'px'
              }"
            >
              {{ moduleForm.leftConfig.mainTitle }}
            </div>
            <div
              class="sub-title"
              :style="{
                'color': moduleForm.leftConfig.subTitleColor,
                'font-size': moduleForm.leftConfig.subTitleSize + 'px'
              }"
            >
              {{ moduleForm.leftConfig.subTitle }}
            </div>
          </div>
          <div class="header-bottom">
            <span>立即抢购</span>
            <el-icon class="el-icon-arrow-right">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
        <div class="module-left-content">
          <el-image
            :src="checkFileUrl(moduleForm.leftConfig.imgMessage.img)"
            fit="fill"
          >
            <template #error>
              <div class="image-slot">
                <img
                  style="width: 27px;height: 21px"
                  src="@/assets/micro-page/def.png"
                  alt=""
                >
              </div>
            </template>
          </el-image>
        </div>
      </div>
      <div class="module-right">
        <div class="module-right-top">
          <div class="right-top-left">
            <div class="header-title">
              <div
                class="main-title"
                :style="{
                  'color': moduleForm.topConfig.mainTitleColor,
                  'font-size': moduleForm.topConfig.mainTitleSize + 'px'
                }"
              >
                {{ moduleForm.topConfig.mainTitle }}
              </div>
              <div
                class="sub-title"
                :style="{
                  'color': moduleForm.topConfig.subTitleColor,
                  'font-size': moduleForm.topConfig.subTitleSize + 'px'
                }"
              >
                {{ moduleForm.topConfig.subTitle }}
              </div>
            </div>
            <div class="show-redirect">
              <span>立即抢购</span>
              <el-icon class="el-icon-arrow-right">
                <ArrowRight />
              </el-icon>
            </div>
          </div>
          <div class="right-top-right">
            <el-image
              :src="checkFileUrl(moduleForm.topConfig.imgMessage.img)"
              fit="fill"
            >
              <template #error>
                <div class="image-slot">
                  <img
                    style="width: 15px;"
                    src="@/assets/micro-page/def.png"
                    alt=""
                  >
                </div>
              </template>
            </el-image>
          </div>
        </div>
        <div class="module-right-bottom">
          <div class="right-top-left">
            <div class="header-title">
              <div
                class="main-title"
                :style="{
                  'color': moduleForm.bottomConfig.mainTitleColor,
                  'font-size': moduleForm.bottomConfig.mainTitleSize + 'px'
                }"
              >
                {{ moduleForm.bottomConfig.mainTitle }}
              </div>
              <div
                class="sub-title"
                :style="{
                  'color': moduleForm.bottomConfig.subTitleColor,
                  'font-size': moduleForm.bottomConfig.subTitleSize + 'px'
                }"
              >
                {{ moduleForm.bottomConfig.subTitle }}
              </div>
            </div>
            <div class="show-redirect">
              <span>立即抢购</span>
              <el-icon class="el-icon-arrow-right">
                <ArrowRight />
              </el-icon>
            </div>
          </div>
          <div class="right-top-right">
            <el-image
              :src="checkFileUrl(moduleForm.bottomConfig.imgMessage.img)"
              fit="fill"
            >
              <template #error>
                <div class="image-slot">
                  <img
                    style="width: 15px;"
                    src="@/assets/micro-page/def.png"
                    alt=""
                  >
                </div>
              </template>
            </el-image>
          </div>
        </div>
      </div>
    </template>
    <!-- 有配置信息 end -->
  </div>
</template>
<script setup>
const props = defineProps({
  config: { // 配置信息
    type: Object,
    default: () => {}
  }
})

const moduleForm = ref({})
const currentForm = computed(() => {
  return JSON.stringify(moduleForm.value) === '{}'
})
watch(() => props.config, (newVal) => {
  nextTick(() => {
    moduleForm.value = {
      ...newVal
    }
  })
}, { deep: true })

</script>
<style lang="scss" scoped>
.module-two-component {
  width: 100%;
  display: flex;
  background: #fff;
  border-radius: 5px;
  .module-left {
    width: 50%;
    height: 100%;
    .module-left-header {
      overflow: hidden;
      margin: 12px 0 8.5px 12px;
      .header-top {
        display: flex;
        align-items: center;
        line-height: 1;
        .main-title {
          font-family: PingFang SC;
          font-weight: bold;
          font-size: 15px;
          max-width: calc(50% - 5px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
        }
        .sub-title {
          font-size: 12px;
          margin-left: 8px;
          max-width: calc(50% - 5px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
        }
      }
      .header-bottom {
        margin-top: 6px;
        span {
          color: #999;
          font-size: 11px;
          font-family: PingFang SC;
        }
        :deep(i) {
          font-size: 12px;
          color: #999;
          top: 2px;
        }
      }
    }
    .module-left-content {
      margin: 17px 0 13.5px 12px;
      :deep(.el-image) {
        width: 143px;
        height: 110px;
        background: rgba(243, 245, 247, 0.39);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .module-right {
    width: 50%;
    border-left: 1px solid #f9f9fb;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .module-right-top {
      width: 100%;
      overflow: hidden;
      border-bottom: 1px solid #f9f9fb;
      display: flex;
      .right-top-left {
        width: 50%;
        padding-left: 7px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .header-title {
          margin: 12px 0 0 0;
          .main-title {
            font-family: PingFang SC;
            font-weight: bold;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .sub-title {
            margin-top: 6px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .show-redirect {
          margin-top: 18px;
          margin-bottom: 13.5px;
          span {
            font-size: 12px;
            color: #999;
          }
          :deep(i) {
            font-size: 12px;
            color: #999;
            top: 2px;
          }
        }
      }
      .right-top-right {
        width: 50%;
        margin: 12px 0 0 2px;
        :deep(.el-image) {
          width: 64px;
          height: 64px;
          background: rgba(243, 245, 247, 0.39);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .module-right-bottom {
      width: 100%;
      display: flex;
      .right-top-left {
        width: 50%;
        padding-left: 7px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .header-title {
          margin-top: 12px;
          .main-title {
            font-size: 15px;
            font-family: PingFang SC;
            font-weight: bold;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .sub-title {
            font-size: 11px;
            margin-top: 6px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .show-redirect {
          margin-top: 18px;
          margin-bottom: 13.5px;
          span {
            font-size: 12px;
            color: #999;
          }
          :deep(i) {
            font-size: 12px;
            color: #999;
            top: 2px;
          }
        }
      }
      .right-top-right {
        width: 50%;
        padding: 13px 0 0 3.5px;
        :deep(.el-image) {
          width: 64px;
          height: 64px;
          background: rgba(243, 245, 247, 0.39);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}

</style>
