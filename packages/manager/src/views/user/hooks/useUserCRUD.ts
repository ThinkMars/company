import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getUserList,
  addUser,
  updateUser,
  deleteUser,
  type User,
  type UserQuery,
} from '@/api/user'
import { getRoleList, type Role } from '@/api/role'

export function useUserCRUD() {
  const tableData = ref<User[]>([])
  const roleOptions = ref<Role[]>([])
  const total = ref(0)
  const loading = ref(false)

  const queryParams = ref<UserQuery>({
    keyword: '',
    page: 1,
    pageSize: 10,
  })

  const getList = async () => {
    loading.value = true
    try {
      const res = await getUserList(queryParams.value)
      tableData.value = res.data.list
      total.value = res.data.total
    } catch (error) {
      console.error('获取用户列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  const getRoles = async () => {
    try {
      const res = await getRoleList()
      roleOptions.value = res.data
    } catch (error) {
      console.error('获取角色列表失败:', error)
    }
  }

  const add = async (data: Partial<User>) => {
    try {
      await addUser(data)
      ElMessage.success('新增成功')
      getList()
    } catch (error) {
      console.error('新增用户失败:', error)
    }
  }

  const update = async (id: number, data: Partial<User>) => {
    try {
      await updateUser(id, data)
      ElMessage.success('编辑成功')
      getList()
    } catch (error) {
      console.error('编辑用户失败:', error)
    }
  }

  const remove = async (id: number) => {
    try {
      await deleteUser(id)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      console.error('删除用户失败:', error)
    }
  }

  // 初始化
  getList()
  getRoles()

  return {
    tableData,
    roleOptions,
    total,
    loading,
    queryParams,
    addUser: add,
    updateUser: update,
    deleteUser: remove,
    getList,
  }
}
