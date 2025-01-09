import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    // 侧边栏是否折叠
    isCollapse: false,
    // 侧边栏背景颜色
    asideBgColor: '#304156',
    // 侧边栏选中背景颜色
    asideActiveBgColor: '#212121',
    // 侧边栏字体颜色
    asideTextColor: '#fff',
    // 侧边栏选中字体颜色
    asideActiveTextColor: '#fff',
    // 侧边栏是否固定
    asideFixed: false,
    // 顶部栏背景颜色
    siderHeaderBgColor: '#001529',
    // 顶部栏字体颜色
    siderHeaderTextColor: '#fff',
    // 顶部栏高度
    headerHeight: '64px',
  }),
  actions: {
    setCollapse(value: boolean) {
      this.isCollapse = value
    },
    // setAsideWidth(value: string) {
    //   this.asideWidth = value
    // },
    // setAsideMinWidth(value: string) {
    //   this.asideMinWidth = value
    // },
    // setAsideMaxWidth(value: string) {
    //   this.asideMaxWidth = value
    // },
    // setAsideBgColor(value: string) {
    //   this.asideBgColor = value
    // },
    // setAsideFontColor(value: string) {
    //   this.asideFontColor = value
    // },
    // setAsideActiveFontColor(value: string) {
    //   this.asideActiveFontColor = value
    // },
    // setAsideActiveBgColor(value: string) {
    //   this.asideActiveBgColor = value
    // },
  },
})
