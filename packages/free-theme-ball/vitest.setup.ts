import { beforeEach } from 'vitest'
import { JSDOM } from 'jsdom'

// 创建一个新的 JSDOM 实例
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')

// 设置全局变量
global.document = dom.window.document
global.window = dom.window as any

// 在每个测试之前重置 DOM
beforeEach(() => {
  // 清除之前设置的所有样式
  while (document.documentElement.style.length > 0) {
    const prop = document.documentElement.style[0]
    document.documentElement.style.removeProperty(prop)
  }
})
