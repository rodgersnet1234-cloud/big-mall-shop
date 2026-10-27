import spu from './product/spu/en'
import transport from './delivery/transport/en'
import discount from './discount/en'
import attr from './product/attr/en'
import category from './product/category/en'
import notice from './multishop/notice/en'
import shopUser from './multishop/shop-user/en'
import hotSearch from './multishop/hot-search/en'
import imgbox from './biz/imgbox/en'
import videobox from './biz/videobox/en'
import role from './rbac/role/en'
import menu from './rbac/menu/en'
import menuPermission from './rbac/menu-permission/en'
import selector from './components/category-selector/en'
import shopUserAccount from './multishop/shop-user-account/en'
import shopRefundAddr from './multishop/shop-refund-addr/en'
import coupon from './coupon/coupon/en'
import order from './order/order/en'
import orderInvoice from './order/orderInvoice/en'
import constant from './constant/en'
import discountProd from './distributionProd/en'
import group from './group/en'
import admin from './admin/en'
import shop from './shop/en'
import station from './delivery/station/en'
import address from './address/en'
import product from './product/en'
import seckill from './seckill/en'
import chat from './chat/en'
import stock from './stock/en'
import live from './live/en'
import customerManager from './customer/customer-manager/en'
import outletConfig from './outletConfig/en'
import printer from './printer/en'
import imMsgBizSkills from './imMsgBizSkills/en'
import voucher from './voucher/en'

export default {
  language: 'English',
  pay: {
    notPaid: 'Not Paid',
    obligation: 'obligation'
  },
  route: {
    dashboard: 'Dashboard'
  },
  navbar: {
    logOut: 'Log Out'
  },
  tip: {
    select: 'please select prod',
    input: 'please input'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  date: {
    start: 'Start date',
    end: 'End date',
    tip: 'to',
    t: 'today',
    y: 'yesterday',
    n: 'nearly 7',
    m: 'nearly 30',
    a: 'whole'
  },
  login: {
    title: 'Login Form',
    logIn: 'Login',
    username: 'Username',
    password: 'Password',
    any: 'any',
    thirdparty: 'Or connect with',
    thirdpartyTips: 'Can not be simulated on local, so please combine you own business simulation! ! !',
    userNameTips: 'Please enter the account',
    passwordTips: 'Please enter the password',
    userNameNoNull: 'Account cannot be empty',
    pawNoNull: 'password cannot be empty',
    noUserName: 'No account?',
    toRegister: 'go to register',
    forgetPassword: 'Forgot your password?',
    login: 'login',
    agree: 'Login is deemed as consent',
    agreement: 'Supplier Agreement',
    passwordEmpty: 'Confirm password cannot be empty',
    usernameTips: 'Please enter the correct mobile number / user name / email'
  },
  register: {
    reg: 'Supplier registration',
    hasAccount: 'Existing account?',
    toLogin: 'Go to login',
    username: 'Please enter the user name',
    usernameEmptyTips: 'Please set the user name',
    usernameErrTips: 'The user name consists of letters, numbers or underlined 4-16 digits and cannot be a pure number',
    mobile: 'Please enter your mobile number',
    mobileErrTips: 'Please enter the correct mobile number',
    validCode: 'Please enter the correct mobile number',
    getCode: 'Get verification code',
    validCodeErrTips: 'Please enter the verification code',
    passwordTips: 'Please set the 6-20 digit login password',
    passwordEmptyTips: 'Login password cannot be empty',
    passwordErrorTips: 'The length of the login password is 6-20 bits',
    passwordErrorTips2: 'Spaces are not allowed at the beginning or end of a password',
    register: 'register',
    agree: 'I have read consent',
    agree2: 'Have read and agreed to this Agreement',
    Agreement: 'Supplier Registration Agreement',
    readAgreement: 'Please read the merchant Registration Agreement under the button first',
    registerSuccess: 'Registration succeeded! About to jump to landing page...',
    passwordVerification: 'Passwords are composed of three types of characters: letters, numbers, and special symbols. They are 8-20 half width characters and are case sensitive'
  },
  forgetPassword: {
    retrievePassword: 'Retrieve password',
    nextStep: 'next step',
    returnLogin: 'Return to login'
  },
  resetPassword: {
    passwordTips: 'Please enter a new password',
    passwordTips2: 'Please confirm the password',
    passwordTips3: 'Password length is 6-20 bits',
    passwordError: 'Incorrect confirmation password',
    returnStep: 'Back to the previous step'
  },
  unit: {
    dollar: 'Yuan',
    item: 'Pieces'
  },
  table: {
    search: 'Search',
    add: 'Add',
    export: 'Export',
    id: 'ID',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    create: 'Create',
    publish: 'Publish',
    delete: 'Delete',
    cancel: 'Cancel',
    submit: 'Submit',
    offline: 'Offline',
    clear: 'Clear',
    reset: 'Reset',
    view: 'view',
    confirm: 'Confirm',
    actionSuccess: 'Actions Success',
    tips: 'Tips',
    seq: 'Queue number',
    sureToDelete: 'Be sure to delete?',
    sureToExport: 'Be sure to export operation?',
    createTime: 'create time',
    updateTime: 'update time',
    applyForListing: 'Apply on shelve',
    waitReview: 'Waiting for review',
    platformDown: 'Platform take down',
    disable: 'disable',
    enable: 'enable',
    allSelect: 'Select all on current page',
    checkAll: 'Check All'
  },
  form: {
    content: 'Please enter content',
    nameZh: 'Chinese name',
    nameEn: 'English name'
  },
  action: {
    putOnShelf: 'Put on the shelf',
    offShelf: 'off the shelf'
  },
  tinymce: {
    uploadImages: 'Upload Images'
  },
  dashboard: {
    contractNotValid: 'contract ot valid',
    validityContractExpired: 'validity contract expired'
  },
  rbac: {
    role,
    menu,
    menuPermission
  },
  multishop: {
    notice,
    shopUser,
    hotSearch,
    shopUserAccount,
    shopRefundAddr
  },
  product: {
    ...product,
    attr,
    category,
    spu
  },
  delivery: {
    transport
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
  discountProd: {
    ...discountProd
  },
  admin: {
    ...admin
  },
  shop: {
    ...shop
  },
  station: {
    ...station
  },
  address: {
    ...address
  },
  chat: {
    ...chat
  },
  seckill: {
    ...seckill
  },
  components: {
    selector
  },
  stock: {
    ...stock
  },
  live: {
    ...live
  },
  customer: {
    customerManager
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
