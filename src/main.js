import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from '@/stores'
// i18n
import { setupI18n } from '@/lang'
import 'virtual:svg-icons-register'
import svgIcon from '@/icons/svg-icon.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// element-plus
import ElementPlus from 'element-plus'
// 日期格式使用中文（即：一周从周一开始算）
import 'dayjs/locale/zh-cn'
import 'element-plus/dist/index.css'
// 全局样式
import '@/styles/index.scss'

import { HandleDirective } from 'vue-slicksort'

import moment from 'moment'

// 权限路由、菜单
import '@/permission.js'
import router from '@/router'
// 自定义指令
import { setupDirective } from '@/directive'
import { setupDirectiveDrag } from '@/views/modules/multishop/feature/create/edit/directive/index.js'
// 图片域名替换
import { checkFileUrl } from '@/utils/index.js'

// 兼容低版浏览器
import legacy from './plugins/legacy'
legacy()

// element-plus 图标
const app = createApp(App)
app.config.globalProperties.checkFileUrl = checkFileUrl

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// i18n
app.use(setupI18n)
// 状态管理
setupStore(app)
// 注册指令(directive)
setupDirective(app)
setupDirectiveDrag(app)
app.directive('handle', HandleDirective)
// svg
app.component('SvgIcon', svgIcon)
// router
app.use(router)
// element-plus
app.use(ElementPlus)
app.mount('#app')

// 自定义moment（js时间组件）
moment.locale('zh-cn', {
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'YYYY-MM-DD HH:mm:ss'
  },
  week: {
    // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    dow: 1, // 星期一， 是一个星期的第一天
    doy: 4 // 1月4日所在的的一周是一年的第一周
  }
})
