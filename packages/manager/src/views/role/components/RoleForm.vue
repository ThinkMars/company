<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ElTree } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  isCreate: Boolean,
  formData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])
const treeRef = ref<InstanceType<typeof ElTree>>()

const form = ref({ ...props.formData })
const permissionOptions = ref([
  {
    id: 1,
    label: '用户管理',
    children: [
      { id: 2, label: '查看用户' },
      { id: 3, label: '编辑用户' },
    ],
  },
  {
    id: 4,
    label: '角色管理',
    children: [
      { id: 5, label: '查看角色' },
      { id: 6, label: '编辑角色' },
    ],
  },
])

const defaultProps = {
  children: 'children',
  label: 'label',
}

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const title = computed(() => (props.isCreate ? '添加角色' : '编辑角色'))

const handleSubmit = () => {
  const checkedKeys = treeRef.value?.getCheckedKeys() || []
  emit('submit', { ...form.value, permissions: checkedKeys })
  visible.value = false
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="600px">
    <el-form :model="form" label-width="80px">
      <el-form-item label="角色名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="权限">
        <el-tree
          ref="treeRef"
          :data="permissionOptions"
          show-checkbox
          node-key="id"
          :props="defaultProps"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
