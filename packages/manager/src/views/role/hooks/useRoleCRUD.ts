import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getRoleList,
  addRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  updateRolePermissions,
  type Role,
} from '@/api/role'
import { getPermissionList, type Permission } from '@/api/permission'

export function useRoleCRUD() {
  const tableData = ref<Role[]>([])
  const permissionData = ref<Permission[]>([])
  const checkedKeys = ref<number[]>([])

  const getList = async () => {
    try {
      const res = await getRoleList()
      tableData.value = res.data
    } catch (error) {
      console.error('获取角色列表失败:', error)
    }
  }

  const add = async (data: Partial<Role>) => {
    try {
      await addRole(data)
      ElMessage.success('新增成功')
      getList()
    } catch (error) {
      console.error('新增角色失败:', error)
    }
  }

  const update = async (id: number, data: Partial<Role>) => {
    try {
      await updateRole(id, data)
      ElMessage.success('编辑成功')
      getList()
    } catch (error) {
      console.error('编辑角色失败:', error)
    }
  }

  const remove = async (id: number) => {
    try {
      await deleteRole(id)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      console.error('删除角色失败:', error)
    }
  }

  const getPermissions = async () => {
    try {
      const res = await getPermissionList()
      permissionData.value = res.data
    } catch (error) {
      console.error('获取权限列表失败:', error)
    }
  }

  const getRolePerms = async (roleId: number) => {
    try {
      const res = await getRolePermissions(roleId)
      checkedKeys.value = res.data
    } catch (error) {
      console.error('获取角色权限失败:', error)
    }
  }

  const updatePerms = async (roleId: number, permIds: number[]) => {
    try {
      await updateRolePermissions(roleId, permIds)
      ElMessage.success('保存成功')
    } catch (error) {
      console.error('保存角色权限失败:', error)
    }
  }

  // 初始化获取列表
  getList()

  return {
    tableData,
    permissionData,
    checkedKeys,
    addRole: add,
    updateRole: update,
    deleteRole: remove,
    getPermissions,
    getRolePermissions: getRolePerms,
    updateRolePermissions: updatePerms,
  }
}
