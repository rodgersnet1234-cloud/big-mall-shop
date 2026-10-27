import { drag } from './hotarea/drag.js'
// 全局注册 directive
export function setupDirectiveDrag (app) {
  // v-permission 挂载到全局
  app.directive('drag', drag)
}
