<template>
  <div class="theme-panel">
    <div class="panel-header">
      <h3>超级主题球</h3>
      <button v-if="closeable" class="close-btn" @click="$emit('close')">
        ×
      </button>
    </div>
    <div class="panel-content">
      <div class="preset-colors">
        <h4>推荐主题</h4>
        <div class="themes-container">
          <div class="themes-column">
            <div
              v-for="category in leftThemes"
              :key="category.name"
              class="color-category"
            >
              <div class="category-name">{{ category.name }}</div>
              <div class="color-list">
                <div
                  v-for="color in category.colors"
                  :key="color.value"
                  class="color-item"
                  :style="{ backgroundColor: color.value }"
                  :title="color.name"
                  @click="updateTheme(color.value)"
                />
              </div>
            </div>
          </div>
          <div class="themes-column">
            <div
              v-for="category in rightThemes"
              :key="category.name"
              class="color-category"
            >
              <div class="category-name">{{ category.name }}</div>
              <div class="color-list">
                <div
                  v-for="color in category.colors"
                  :key="color.value"
                  class="color-item"
                  :style="{ backgroundColor: color.value }"
                  :title="color.name"
                  @click="updateTheme(color.value)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="divider">或</div>
      <div class="color-picker">
        <label>自定义主题色</label>
        <input type="color" :value="currentColor" @change="handleColorChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { leftThemes, rightThemes } from '../../../constants/preset-themes'
import { ThemeModifier } from '../../../core/theme-modifier'

defineProps<{
  currentColor: string
  closeable?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:currentColor', value: string): void
  (e: 'close'): void
}>()

const handleColorChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  updateTheme(target.value)
}

const updateTheme = (color: string) => {
  const palette = ThemeModifier.generatePalette(color)
  ThemeModifier.applyTheme(palette)
  emit('update:currentColor', color)
}
</script>

<style scoped>
.theme-panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 320px;
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
