<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="500px"
    @closed="handleClosed"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="上级权限">
        <el-tree-select
          v-model="formData.parentId"
          :data="treeData"
          :props="{ label: 'name', value: 'id' }"
          placeholder="请选择上级权限"
          clearable
        />
      </el-form-item>
      <el-form-item label="权限类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio :label="1">目录</el-radio>
          <el-radio :label="2">菜单</el-radio>
          <el-radio :label="3">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="权限编码" prop="code">
        <el-input v-model="formData.code" />
      </el-form-item>
      <el-form-item label="路由路径" prop="path" v-if="formData.type !== 3">
        <el-input v-model="formData.path" />
      </el-form-item>
      <el-form-item label="图标" prop="icon" v-if="formData.type !== 3">
        <el-input v-model="formData.icon">
          <template #append>
            <el-button @click="showIconSelect = true">选择图标</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" :max="999" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>

    <!-- 图标选择弹窗 -->
    <IconSelect v-model="showIconSelect" @select="selectIcon" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { Permission } from '@/api/permission'
import IconSelect from './IconSelect.vue'
import { usePermissionForm } from '../hooks/usePermissionForm'

interface Props {
  modelValue: boolean
  type: 'add' | 'edit'
  currentNode?: Permission
  parentNode?: Permission
  treeData: Permission[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const title = computed(() => {
  if (props.type === 'add') {
    return props.parentNode
      ? `新增 ${props.parentNode.name} 的子级`
      : '新增权限'
  }
  return '编辑权限'
})

const { formData, formRef, rules, resetForm, validate } =
  usePermissionForm(props)

const showIconSelect = ref(false)

const handleClosed = () => {
  resetForm()
}

const selectIcon = (icon: string) => {
  formData.icon = icon
  showIconSelect.value = false
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
