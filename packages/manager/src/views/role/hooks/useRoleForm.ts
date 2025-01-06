import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import type { Role } from '@/api/role'

interface Props {
  type: 'add' | 'edit'
  currentRole?: Role
}

export function useRoleForm(props: Props) {
  const formRef = ref<FormInstance>()

  const formData = reactive({
    name: props.currentRole?.name || '',
    code: props.currentRole?.code || '',
    description: props.currentRole?.description || '',
  })

  const rules = {
    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
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
