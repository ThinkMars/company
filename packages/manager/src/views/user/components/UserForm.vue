<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  isCreate: Boolean,
  formData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const form = ref({ ...props.formData })
const roleOptions = ref([
  // { value: 'super_admin', label: '超级管理员', disabled: true },
  { value: 'admin', label: '管理员' },
  { value: 'user', label: '普通用户' },
])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const title = computed(() => (props.isCreate ? '新建用户' : '编辑用户'))

const handleSubmit = () => {
  emit('submit', form.value)
  visible.value = false
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="600px">
    <el-form :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码" v-if="isCreate">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.roles" multiple>
          <el-option
            v-for="role in roleOptions"
            :key="role.value"
            :label="role.label"
            :value="role.value"
            :disabled="role.disabled"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
