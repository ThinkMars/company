import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import type { User } from '@/api/user'

interface Props {
  type: 'add' | 'edit'
  currentUser?: User
}

export function useUserForm(props: Props) {
  const formRef = ref<FormInstance>()

  const formData = reactive({
    username: props.currentUser?.username || '',
    password: '',
    email: props.currentUser?.email || '',
    roleId: props.currentUser?.roleId || undefined,
    status: props.currentUser?.status || 1,
  })

  const rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
    ],
    password: [
      {
        required: props.type === 'add',
        message: '请输入密码',
        trigger: 'blur',
      },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
    ],
    roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
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
