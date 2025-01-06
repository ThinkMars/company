import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import type { Permission } from '@/api/permission'

interface Props {
  type: 'add' | 'edit'
  currentNode?: Permission
  parentNode?: Permission
}

export function usePermissionForm(props: Props) {
  const formRef = ref<FormInstance>()

  const formData = reactive({
    parentId: props.parentNode?.id || null,
    type:
      props.type === 'add'
        ? props.parentNode
          ? props.parentNode.type === 3
            ? 3
            : props.parentNode.type + 1
          : 1
        : props.currentNode?.type || 1,
    name: props.currentNode?.name || '',
    code: props.currentNode?.code || '',
    path: props.currentNode?.path || '',
    icon: props.currentNode?.icon || '',
    sort: props.currentNode?.sort || 0,
  })

  const rules = {
    type: [{ required: true, message: '请选择权限类型', trigger: 'change' }],
    name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    code: [{ required: true, message: '请输入权限编码', trigger: 'blur' }],
    path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  }

  const resetForm = () => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }

  const validate = async () => {
    if (!formRef.value) return
    await formRef.value.validate()
  }

  return {
    formRef,
    formData,
    rules,
    resetForm,
    validate,
  }
}
