import pcShopSigns from '@/assets/pc-micro-page/pc_shop_signs.png'
import pcShopSignsActive from '@/assets/pc-micro-page/pc_shop_signs_active.png'
import pcPictureBy from '@/assets/pc-micro-page/pc_picture_by.png'
import pcPictureByActive from '@/assets/pc-micro-page/pc_picture_by_active.png'
import pcAuxiliaryInterval from '@/assets/pc-micro-page/pc_auxiliary_interval.png'
import pcAuxiliaryIntervalActive from '@/assets/pc-micro-page/pc_auxiliary_interval_active.png'
import pcFloorTitle from '@/assets/pc-micro-page/pc_floor_title.png'
import pcFloorTitleActive from '@/assets/pc-micro-page/pc_floor_title_active.png'
import pcUniversalHotspot from '@/assets/pc-micro-page/pc_universal_hotspot.png'
import pcUniversalHotspotActive from '@/assets/pc-micro-page/pc_universal_hotspot_active.png'
import pcStoreList from '@/assets/pc-micro-page/pc_store_list.png'
import pcStoreListActive from '@/assets/pc-micro-page/pc_store_list_active.png'
import pcLimitedSkill from '@/assets/pc-micro-page/pc_limited_skill.png'
import pcLimitedSkillActive from '@/assets/pc-micro-page/pc_limited_skill_active.png'
import pcDiscountCoupon from '@/assets/pc-micro-page/pc_discount_coupon.png'
import pcDiscountCouponActive from '@/assets/pc-micro-page/pc_discount_coupon_active.png'
import pcGoodsModule from '@/assets/pc-micro-page/pc_goods_module.png'
import pcGoodsModuleActive from '@/assets/pc-micro-page/pc_goods_module_active.png'
export const configComponentList = [
  {
    type: 'shop_signs', // 当前组件类型(唯一)
    currentType: 'basic', // 当前组件属于哪个栏目(大类)
    title: 'businessSigns', // 组件的标题文字
    pic: pcShopSigns, // 组件的默认图片
    picActive: pcShopSignsActive, // 组件的激活图片
    components: 'storeSignate', // 组件所对应的组件名
    rightConfigTitle: 'businessSigns', // 组件所对应的配置信息标题
    Ref: 'shopSignsTools', // 这个组件每个对应ref
    rightConfigMessage: {}
  },
  {
    type: 'picture_by',
    currentType: 'basic',
    title: 'pictureBy',
    pic: pcPictureBy,
    picActive: pcPictureByActive,
    components: 'pictureShuffling',
    rightConfigTitle: 'pictureBy',
    Ref: 'pictureByTools', // 这个组件每个对应ref
    rightConfigMessage: {}
  },
  {
    type: 'auxiliary_interval',
    currentType: 'basic',
    title: 'AuxiliaryInterval',
    pic: pcAuxiliaryInterval,
    picActive: pcAuxiliaryIntervalActive,
    components: 'intervalComponent',
    rightConfigTitle: 'AuxiliaryInterval',
    Ref: 'auxiliaryIntervalTools', // 这个组件每个对应ref
    rightConfigMessage: {}
  },
  {
    type: 'floor_title',
    currentType: 'basic',
    title: 'floorTitle',
    pic: pcFloorTitle,
    picActive: pcFloorTitleActive,
    components: 'floorTitleComponent',
    rightConfigTitle: 'floorTitle',
    Ref: 'floorTitleTools', // 这个组件每个对应ref
    rightConfigMessage: {} // 右边配置信息
  },
  {
    type: 'goods_list',
    currentType: 'basic',
    title: 'goodsList',
    pic: pcStoreList,
    picActive: pcStoreListActive,
    components: 'goodListComponent',
    rightConfigTitle: 'goodsList',
    Ref: 'goodsListTools', // 这个组件每个对应ref
    rightConfigMessage: {} // 右边配置信息
  },
  {
    type: 'universal_hotspot',
    currentType: 'basic',
    title: 'UniversalHotspot',
    pic: pcUniversalHotspot,
    picActive: pcUniversalHotspotActive,
    components: 'hotSpotComponent',
    rightConfigTitle: 'UniversalHotspot',
    Ref: 'universalHotspotTools',
    rightConfigMessage: {} // 右边配置信息
  },
  {
    type: 'limited_skill',
    currentType: 'mark_activity',
    title: 'limitedKill',
    pic: pcLimitedSkill,
    picActive: pcLimitedSkillActive,
    components: 'limitedSkillComponent',
    rightConfigTitle: 'limitedKill',
    Ref: 'limitedSkillTools',
    rightConfigMessage: {} // 右边配置信息
  },
  {
    type: 'discount_coupon',
    currentType: 'mark_activity',
    title: 'discountCoupon',
    pic: pcDiscountCoupon,
    picActive: pcDiscountCouponActive,
    components: 'discountCouponComponent',
    rightConfigTitle: 'discountCoupon',
    Ref: 'discountCouponTools',
    rightConfigMessage: {} // 右边配置信息
  },
  {
    type: 'goods_module1',
    currentType: 'extend_component',
    title: 'goodsModule1',
    pic: pcGoodsModule,
    picActive: pcGoodsModuleActive,
    components: 'goodsModuleComponentOne',
    rightConfigTitle: 'goodsModule1',
    Ref: 'goodsModule1Tools',
    rightConfigMessage: {} // 右边配置信息
  },
  {
    type: 'goods_module2',
    currentType: 'extend_component',
    title: 'goodsModule2',
    pic: pcGoodsModule,
    picActive: pcGoodsModuleActive,
    components: 'goodsModuleComponentTwo',
    rightConfigTitle: 'goodsModule2',
    Ref: 'goodsModule2Tools',
    rightConfigMessage: {} // 右边配置信息
  },
  {
    type: 'goods_module3',
    currentType: 'extend_component',
    title: 'goodsModule3',
    pic: pcGoodsModule,
    picActive: pcGoodsModuleActive,
    components: 'goodsModuleComponentThree',
    rightConfigTitle: 'goodsModule3',
    Ref: 'goodsModule3Tools',
    rightConfigMessage: {} // 右边配置信息
  },
  {
    type: 'goods_module4',
    currentType: 'extend_component',
    title: 'goodsModule4',
    pic: pcGoodsModule,
    picActive: pcGoodsModuleActive,
    components: 'goodsModuleComponentFour',
    rightConfigTitle: 'goodsModule4',
    Ref: 'goodsModule4Tools',
    rightConfigMessage: {} // 右边配置信息
  },
  {
    type: 'goods_module5',
    currentType: 'extend_component',
    title: 'goodsModule5',
    pic: pcGoodsModule,
    picActive: pcGoodsModuleActive,
    components: 'goodsModuleComponentFive',
    rightConfigTitle: 'goodsModule5',
    Ref: 'goodsModule5Tools',
    rightConfigMessage: {} // 右边配置信息
  }
]
