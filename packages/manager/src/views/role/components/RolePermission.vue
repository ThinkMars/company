<template>
  <el-dialog v-model="visible" title="权限配置" width="600px">
    <el-tree
      ref="treeRef"
      :data="permissionData"
      show-checkbox
      node-key="id"
      :default-checked-keys="checkedKeys"
      :props="{ label: 'name' }"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ElTree } from 'element-plus'
import type { Role } from '@/api/role'
import type { Permission } from '@/api/permission'

interface Props {
  modelValue: boolean
  role?: Role
  permissionData: Permission[]
  checkedKeys: number[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const treeRef = ref<InstanceType<typeof ElTree>>()

const handleSubmit = () => {
  if (!treeRef.value) return
  const checkedKeys = treeRef.value.getCheckedKeys()
  const halfCheckedKeys = treeRef.value.getHalfCheckedKeys()
  emit('success', [...checkedKeys, ...halfCheckedKeys])
  visible.value = false
}
</script>
