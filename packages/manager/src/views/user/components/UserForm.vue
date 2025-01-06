<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/api/user'
import type { Role } from '@/api/role'
import { useUserForm } from '../hooks/useUserForm'

interface Props {
  modelValue: boolean
  type: 'add' | 'edit'
  currentUser?: User
  roleOptions: Role[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const { formData, formRef, rules, resetForm, validate } = useUserForm(props)

const handleClosed = () => {
  resetForm()
}

const handleSubmit = async () => {
  await validate()
  emit('success', formData)
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="type === 'add' ? '新增用户' : '编辑用户'"
    width="500px"
    @closed="handleClosed"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="type === 'add'">
        <el-input v-model="formData.password" type="password" show-password />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="formData.roleId" placeholder="请选择角色">
          <el-option
            v-for="role in roleOptions"
            :key="role.id"
            :label="role.name"
            :value="role.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="formData.status"
          :active-value="1"
          :inactive-value="0"
        />
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

<style scoped lang="less">
.dialog-footer {
  padding: @spacing-base 0;
}
</style>
