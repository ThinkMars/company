<template>
  <div class="theme-ball" :class="{ active: isOpen }">
    <div class="ball" @click="togglePanel">
      <div class="ball-inner" :style="{ backgroundColor: currentColor }"></div>
    </div>
    <div v-show="isOpen" class="theme-panel">
      <div class="panel-header">
        <h3>主题设置</h3>
        <button class="close-btn" @click="isOpen = false">×</button>
      </div>
      <div class="panel-content">
        <div class="color-picker">
          <label>主题色</label>
          <input type="color" v-model="currentColor" @input="updateTheme" />
        </div>
        <div class="sliders">
          <div class="slider-item">
            <label>色相</label>
            <input
              type="range"
              min="-180"
              max="180"
              v-model.number="hue"
              @input="adjustHue"
            />
          </div>
          <div class="slider-item">
            <label>饱和度</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              v-model.number="saturation"
              @input="adjustSaturation"
            />
          </div>
          <div class="slider-item">
            <label>亮度</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              v-model.number="lightness"
              @input="adjustLightness"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ThemeDetector } from '../../../core/theme-detector'
import { ThemeModifier } from '../../../core/theme-modifier'

const isOpen = ref(false)
const currentColor = ref('#409EFF')
const hue = ref(0)
const saturation = ref(0)
const lightness = ref(0)

const detector = new ThemeDetector()

onMounted(() => {
  const variables = detector.detectVariables()
  const primaryColor = variables.find((v) => v.name === '--el-color-primary')
  if (primaryColor) {
    currentColor.value = primaryColor.value
  }
})

const togglePanel = () => {
  isOpen.value = !isOpen.value
}

const updateTheme = () => {
  const palette = ThemeModifier.generatePalette(currentColor.value)
  ThemeModifier.applyTheme(palette)
}

const adjustHue = () => {
  currentColor.value = ThemeModifier.adjustHue(currentColor.value, hue.value)
  updateTheme()
}

const adjustSaturation = () => {
  currentColor.value = ThemeModifier.adjustSaturation(
    currentColor.value,
    saturation.value,
  )
  updateTheme()
}

const adjustLightness = () => {
  currentColor.value = ThemeModifier.adjustLightness(
    currentColor.value,
    lightness.value,
  )
  updateTheme()
}
</script>

<style scoped>
.theme-ball {
  position: fixed;
  right: 20px;
  top: 50%;
  z-index: 9999;
}

.ball {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.ball:hover {
  transform: scale(1.1);
}

.ball-inner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background-color 0.3s;
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

.slider-item {
  margin-bottom: 12px;
}

.slider-item label {
  display: block;
  margin-bottom: 4px;
}

input[type='range'] {
  width: 100%;
}
</style>
