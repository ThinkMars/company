<template>
  <el-dialog v-model="visible" title="选择图标" width="800px">
    <div class="icon-list">
      <div
        v-for="icon in iconList"
        :key="icon"
        class="icon-item"
        @click="handleSelect(icon)"
      >
        <el-icon>
          <component :is="icon" />
        </el-icon>
        <span>{{ icon }}</span>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as ElementPlusIcons from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'select'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const iconList = Object.keys(ElementPlusIcons)

const handleSelect = (icon: string) => {
  emit('select', icon)
  visible.value = false
}
</script>

<style scoped lang="scss">
.icon-list {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    border: 1px solid #eee;
    border-radius: 4px;

    &:hover {
      background-color: #f5f7fa;
    }

    .el-icon {
      font-size: 20px;
      margin-bottom: 5px;
    }

    span {
      font-size: 12px;
      color: #666;
    }
  }
}
</style>
