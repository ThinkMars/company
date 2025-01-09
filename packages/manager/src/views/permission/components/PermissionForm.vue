<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { Permission } from '@/api/permission'

const visible = ref(false)
const formType = ref<'add' | 'edit'>('add')
const formData = ref<Partial<Permission>>({
  name: '',
  code: '',
  type: undefined,
  path: '',
  sort: 0,
})

const title = computed(() => {
  return formType.value === 'add' ? '新增权限' : '编辑权限'
})

const rules = ref({
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入权限编码', trigger: 'blur' }],
  type: [{ required: true, message: '请选择权限类型', trigger: 'change' }],
  path: [{ required: true, message: '请输入权限路径', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }],
})

const emit = defineEmits(['success'])

// 打开弹窗
const open = (data?: Permission) => {
  if (data) {
    formType.value = 'edit'
    formData.value = { ...data }
  } else {
    formType.value = 'add'
    formData.value = {
      name: '',
      code: '',
      type: undefined,
      path: '',
      sort: 0,
    }
  }
  visible.value = true
}

// 提交表单
const handleSubmit = () => {
  ElMessage.success(`${title.value}成功`)
  visible.value = false
  emit('success')
}

defineExpose({
  open,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入权限名称" />
      </el-form-item>
      <el-form-item label="权限编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入权限编码" />
      </el-form-item>
      <el-form-item label="权限类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择权限类型">
          <el-option label="目录" :value="1" />
          <el-option label="菜单" :value="2" />
          <el-option label="按钮" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="权限路径" prop="path">
        <el-input v-model="formData.path" placeholder="请输入权限路径" />
      </el-form-item>
      <el-form-item label="排序号" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.el-form {
  padding: 20px;
}
</style>
