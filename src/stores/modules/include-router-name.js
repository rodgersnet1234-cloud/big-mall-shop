import { defineStore } from 'pinia'
export const useIncludeRouterName = defineStore('includeRouterName', {
  state: () => {
    return {
      routerNameList: []
    }
  },
  actions: {
    addData (routerName) {
      this.routerNameList = routerName
    }
  }
})
