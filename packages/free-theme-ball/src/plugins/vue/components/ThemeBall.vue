<template>
  <div
    class="theme-ball"
    :class="{ active: isOpen, hidden: isHidden }"
    :style="{ top: position.y + 'px', right: position.x + 'px' }"
    @mouseenter="handleMouseEnter"
    @mouseleave="startHideTimer"
  >
    <div
      class="ball"
      @mousedown.stop="startDrag"
      :class="{ dragging: isDragging }"
    >
      <div class="ball-inner" :style="{ backgroundColor: currentColor }">
        <div class="ball-glow" :style="{ backgroundColor: currentColor }">
          <div
            class="ball-pulse"
            :style="{ backgroundColor: currentColor }"
          ></div>
        </div>
      </div>
    </div>
    <div v-show="isOpen" class="theme-panel">
      <div class="panel-header">
        <h3>超级主题球</h3>
        <button class="close-btn" @click="isOpen = false">×</button>
      </div>
      <div class="panel-content">
        <div class="preset-colors">
          <h4>推荐主题</h4>
          <div class="themes-container">
            <div class="themes-column">
              <div
                class="color-category"
                v-for="category in leftThemes"
                :key="category.name"
              >
                <div class="category-name">{{ category.name }}</div>
                <div class="color-list">
                  <div
                    v-for="color in category.colors"
                    :key="color.value"
                    class="color-item"
                    :style="{ backgroundColor: color.value }"
                    :title="color.name"
                    @click="selectPresetColor(color.value)"
                  ></div>
                </div>
              </div>
            </div>
            <div class="themes-column">
              <div
                class="color-category"
                v-for="category in rightThemes"
                :key="category.name"
              >
                <div class="category-name">{{ category.name }}</div>
                <div class="color-list">
                  <div
                    v-for="color in category.colors"
                    :key="color.value"
                    class="color-item"
                    :style="{ backgroundColor: color.value }"
                    :title="color.name"
                    @click="selectPresetColor(color.value)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="divider">或</div>
        <div class="color-picker">
          <label>自定义主题色</label>
          <input type="color" v-model="currentColor" @input="updateTheme" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ThemeDetector } from '../../../core/theme-detector'
import { ThemeModifier } from '../../../core/theme-modifier'
import { leftThemes, rightThemes } from '../../../constants/preset-themes'

const isOpen = ref(false)
const isHidden = ref(false)
const isDragging = ref(false)
const currentColor = ref('#409EFF')
const hideTimer = ref<number | null>(null)
const position = ref({
  y: window.innerHeight / 2,
  x: 20, // 默认右侧距离
})
const detector = new ThemeDetector()

let startY = 0
let startX = 0
let startTop = 0
let startRight = 0
let dragStartTime = 0
let hasMoved = false
const DRAG_THRESHOLD = 3 // 拖拽阈值（像素）
const CLICK_THRESHOLD = 200 // 点击时间阈值（毫秒）

const handleResize = () => {
  position.value = {
    y: Math.max(50, Math.min(window.innerHeight - 50, position.value.y)),
    x: Math.max(20, Math.min(window.innerWidth - 20, position.value.x)),
  }
}

const cleanup = () => {
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
    hideTimer.value = null
  }
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('resize', handleResize)
}

const handleMouseMove = (e: Event) => {
  if (!isDragging.value) return
  hasMoved = true

  const mouseEvent = e as MouseEvent
  const deltaY = mouseEvent.clientY - startY
  const deltaX = startX - mouseEvent.clientX
  const newY = startTop + deltaY
  const newX = startRight + deltaX

  position.value = {
    y: Math.max(50, Math.min(window.innerHeight - 50, newY)),
    x: Math.max(20, Math.min(window.innerWidth - 20, newX)),
  }
}

const handleMouseUp = (e: Event) => {
  isDragging.value = false
  const dragEndTime = Date.now()
  const isDragClick = !hasMoved && dragEndTime - dragStartTime < CLICK_THRESHOLD

  if (isDragClick) {
    togglePanel()
  }

  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

const startDrag = (e: Event) => {
  if (isOpen.value) return
  isDragging.value = true
  hasMoved = false
  dragStartTime = Date.now()

  const mouseEvent = e as MouseEvent
  startY = mouseEvent.clientY
  startX = mouseEvent.clientX
  startTop = position.value.y
  startRight = position.value.x

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const startHideTimer = () => {
  if (!isOpen.value) {
    if (hideTimer.value) {
      clearTimeout(hideTimer.value)
    }
    hideTimer.value = window.setTimeout(() => {
      isHidden.value = true
    }, 5000)
  }
}

const handleMouseEnter = () => {
  cleanup()
  isHidden.value = false
}

onMounted(() => {
  const variables = detector.detectThemeVariables()
  const primaryColor = variables.find(
    (v) => v.name === `${detector.getPrefix()}color-primary`,
  )
  if (primaryColor) {
    currentColor.value = primaryColor.value
  }
  startHideTimer()
  window.addEventListener('resize', handleResize)
})

onUnmounted(cleanup)

const togglePanel = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    isHidden.value = false
  }
}

const updateTheme = () => {
  const palette = ThemeModifier.generatePalette(currentColor.value)
  ThemeModifier.applyTheme(palette)
}

const selectPresetColor = (color: string) => {
  currentColor.value = color
  updateTheme()
}
</script>

<style scoped>
.theme-ball {
  position: fixed;
  z-index: 9999;
  transition: opacity 0.3s ease-in-out;
}

.theme-ball.hidden {
  opacity: 0.3;
  transform: translateX(36px);
}

.theme-ball.hidden:hover {
  opacity: 1;
  transform: translateX(0);
}

.ball {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  backdrop-filter: blur(4px);
  animation: float 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  user-select: none;
  touch-action: none;
}

.ball:hover {
  transform: scale(1.15);
}

.ball.dragging {
  cursor: grabbing;
  transform: scale(0.95);
  animation: none;
}

.ball-inner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.3s;
  position: relative;
}

.ball-glow {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  opacity: 0.5;
  animation: glow 1.5s ease-in-out infinite;
  filter: blur(8px);
}

.ball-pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes glow {
  0% {
    opacity: 0.4;
    transform: scale(1);
  }

  50% {
    opacity: 0.6;
    transform: scale(1.15);
  }

  100% {
    opacity: 0.4;
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.6;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.4;
  }

  100% {
    transform: scale(0.95);
    opacity: 0.6;
  }
}

@keyframes float {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  50% {
    transform: scale(0.88);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.theme-panel {
  position: fixed;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.close-btn {
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: #909399;
}

.color-picker {
  margin-bottom: 16px;
}

.color-picker label {
  display: block;
  margin-bottom: 8px;
}

input[type='color'] {
  width: 100%;
  height: 40px;
  padding: 0;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
}

.preset-colors {
  margin-bottom: 20px;
}

.preset-colors h4 {
  margin: 0 0 12px;
  font-size: 14px;
  color: #606266;
}

.themes-container {
  display: flex;
  gap: 16px;
}

.themes-column {
  flex: 1;
}

.color-category {
  margin-bottom: 16px;
}

.category-name {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.color-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-item {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
  border: 1px solid #ebeef5;
}

.color-item:hover {
  transform: scale(1.1);
}

.divider {
  text-align: center;
  color: #909399;
  font-size: 12px;
  margin: 16px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #ebeef5;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}
</style>
