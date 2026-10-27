import { checkPermission } from './permission'
import { richDirective } from './rich'
import { onHandleInput } from './input-rule'

// 全局注册 directive
export function setupDirective (app) {
  // v-permission 挂载到全局
  app.directive('permission', checkPermission)
  // 富文本指令
  app.directive('rich', richDirective)
  // inout的输入校验
  app.directive('input-rule', onHandleInput)
}
