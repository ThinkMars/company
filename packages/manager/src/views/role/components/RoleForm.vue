<template>
  <el-dialog
    v-model="visible"
    :title="type === 'add' ? '新增角色' : '编辑角色'"
    width="500px"
    @closed="handleClosed"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input v-model="formData.code" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Role } from '@/api/role'
import { useRoleForm } from '../hooks/useRoleForm'

interface Props {
  modelValue: boolean
  type: 'add' | 'edit'
  currentRole?: Role
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const { formData, formRef, rules, resetForm, validate } = useRoleForm(props)

const handleClosed = () => {
  resetForm()
}

const handleSubmit = async () => {
  await validate()
  emit('success', formData)
  visible.value = false
}
</script>

<style scoped lang="less">
.dialog-footer {
  padding: @spacing-base 0;
}
</style>
