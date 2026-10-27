import spu from './product/spu/zh'
import transport from './delivery/transport/zh'
import discount from './discount/zh'
import attr from './product/attr/zh'
import category from './product/category/zh'
import notice from './multishop/notice/zh'
import shopUser from './multishop/shop-user/zh'
import hotSearch from './multishop/hot-search/zh'
import imgbox from './biz/imgbox/zh'
import videobox from './biz/videobox/zh'
import role from './rbac/role/zh'
import menu from './rbac/menu/zh'
import menuPermission from './rbac/menu-permission/zh'
import selector from './components/category-selector/zh'
import shopUserAccount from './multishop/shop-user-account/zh'
import shopRefundAddr from './multishop/shop-refund-addr/zh'
import coupon from './coupon/coupon/zh'
import order from './order/order/zh'
import orderInvoice from './order/orderInvoice/zh'
import constant from './constant/zh'
import group from './group/zh'
import admin from './admin/zh'
import distributionProd from './distributionProd/zh'
import shop from './shop/zh'
import station from './delivery/station/zh'
import address from './address/zh'
import product from './product/zh'
import pcdecorate from './pcdecorate/zh'
import shopFeature from './shopFeature/zh'
import seckill from './seckill/zh'
import chat from './chat/zh'
import stock from './stock/zh'
import purchase from './stock/purchase/zh.js'
import live from './live/zh'
import customerManager from './customer/customer-manager/zh'
import outletConfig from './outletConfig/zh'
import printer from './printer/zh'
import imMsgBizSkills from './imMsgBizSkills/zh'
import voucher from './voucher/zh'

export default {
  language: '简体中文',
  pay: {
    notPaid: '未付款',
    obligation: '待付款'
  },
  route: {
    dashboard: '首页'
  },
  tip: {
    select: '请选择',
    input: '请输入'
  },
  navbar: {
    logOut: '退出登录'
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  date: {
    start: '开始日期',
    end: '结束日期',
    tip: '至',
    t: '今日',
    y: '昨日',
    n: '近7天',
    m: '近30天',
    a: '全部'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '手机号/用户名/邮箱',
    password: '密码',
    any: '随便填',
    thirdparty: '第三方登录',
    thirdpartyTips: '本地不能模拟，请结合自己业务进行模拟！！！',
    userNameTips: '请输入账号',
    passwordTips: '请输入密码',
    userNameNoNull: '账号不能为空',
    pawNoNull: '密码不能为空',
    noUserName: '没有账号？',
    toRegister: '立即注册',
    forgetPassword: '忘记密码了？',
    login: '登录',
    agree: '登录即视为同意',
    agreement: '供应商协议',
    passwordEmpty: '确认密码不能为空',
    usernameTips: '请输入正确的手机号/用户名'
  },
  register: {
    reg: '供应商注册',
    hasAccount: '已有账号？',
    toLogin: '前去登录',
    username: '请输入用户名',
    usernameEmptyTips: '请设置用户名',
    usernameErrTips: '用户名由字母、数字或下划线 4-16位组成，且不能为纯数字',
    mobile: '请输入手机号',
    mobileErrTips: '请输入正确的手机号',
    validCode: '请输入验证码',
    getCode: '获取验证码',
    validCodeErrTips: '请输入验证码',
    passwordTips: '请设置8-20位登录密码',
    passwordEmptyTips: '登录密码不能为空',
    passwordErrorTips: '登录密码长度为6-20位',
    passwordErrorTips2: '不允许使用空格作为密码的开头或结尾',
    register: '立即注册',
    agree: '我已阅读同意',
    agree2: '已阅读并同意本协议',
    agreement: '供应商注册协议',
    readAgreement: '请先阅读按钮下方《商家注册协议》',
    registerSuccess: '注册成功！即将跳转到登录页...',
    passwordVerification: '密码由字母、数字和特殊符号三种字符组成8-20位半角字符，区分大小写'
  },
  forgetPassword: {
    retrievePassword: '找回密码',
    nextStep: '下一步',
    returnLogin: '返回登录'
  },
  resetPassword: {
    passwordTips: '请输入新密码',
    passwordTips2: '请确认密码',
    passwordTips3: '密码长度为6-20位',
    passwordError: '确认密码不一致',
    returnStep: '返回上一步'
  },
  unit: {
    dollar: '元',
    item: '件'
  },
  table: {
    search: '搜索',
    add: '添加',
    export: '导出',
    id: '序号',
    status: '状态',
    actions: '操作',
    edit: '编辑',
    create: '新建',
    clear: '清空',
    reset: '重置',
    publish: '发布',
    delete: '删除',
    cancel: '取消',
    confirm: '确定',
    offline: '下线',
    submit: '提交',
    view: '查看',
    seq: '排序号',
    actionSuccess: '操作成功',
    tips: '提示',
    noNull: '不能为空',
    sureToDelete: '确定进行删除操作?',
    sureToExport: '确定进行导出操作?',
    createTime: '创建时间',
    updateTime: '更新时间',
    applyForListing: '申请上架',
    platformDown: '平台下架',
    disable: '禁用',
    enable: '启用',
    waitReview: '等待审核',
    allSelect: '当页全选',
    checkAll: '全选'
  },
  form: {
    content: '请输入内容',
    nameZh: '中文名称',
    nameEn: '英文名称'
  },
  action: {
    putOnShelf: '上架',
    offShelf: '下架'
  },
  tinymce: {
    uploadImages: '上传图片'
  },
  dashboard: {
    contractNotValid: '未到签约有效期',
    validityContractExpired: '签约有效期已过'
  },
  rbac: {
    role,
    menu,
    menuPermission
  },
  multishop: {
    hotSearch,
    shopUser,
    notice,
    shopUserAccount,
    shopRefundAddr
  },
  product: {
    ...product,
    attr,
    category,
    spu
  },
  pcdecorate: {
    ...pcdecorate
  },
  shopFeature: {
    ...shopFeature
  },
  delivery: {
    transport,
    station
  },
  discount: {
    discount
  },
  biz: {
    imgbox,
    videobox
  },
  coupon: {
    coupon
  },
  order: {
    order,
    orderInvoice
  },
  constant: {
    ...constant
  },
  group: {
    ...group
  },
  distributionProd: {
    ...distributionProd
  },
  seckill: {
    ...seckill
  },
  chat: {
    ...chat
  },
  admin: {
    ...admin
  },
  shop: {
    ...shop
  },
  address: {
    ...address
  },
  components: {
    selector
  },
  stock: {
    ...stock,
    purchase
  },
  live: {
    ...live
  },
  customer: {
    customerManager
  },
  station: {
    ...station
  },
  outletConfig: {
    ...outletConfig
  },
  printer: {
    ...printer
  },
  imMsgBizSkills: {
    ...imMsgBizSkills
  },
  voucher: {
    ...voucher
  }
}
