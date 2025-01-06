import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getPermissionList,
  addPermission,
  updatePermission,
  deletePermission,
  type Permission,
} from '@/api/permission'

export function usePermissionCRUD() {
  const tableData = ref<Permission[]>([])

  const treeData = computed(() => {
    return [{ id: 0, name: '根目录', children: tableData.value }]
  })

  const getList = async () => {
    try {
      const res = await getPermissionList()
      tableData.value = res.data
    } catch (error) {
      console.error('获取权限列表失败:', error)
    }
  }

  const add = async (data: Partial<Permission>) => {
    try {
      await addPermission(data)
      ElMessage.success('新增成功')
      getList()
    } catch (error) {
      console.error('新增权限失败:', error)
    }
  }

  const update = async (id: number, data: Partial<Permission>) => {
    try {
      await updatePermission(id, data)
      ElMessage.success('编辑成功')
      getList()
    } catch (error) {
      console.error('编辑权限失败:', error)
    }
  }

  const remove = async (id: number) => {
    try {
      await deletePermission(id)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      console.error('删除权限失败:', error)
    }
  }

  // 初始化获取列表
  getList()

  return {
    tableData,
    treeData,
    addPermission: add,
    updatePermission: update,
    deletePermission: remove,
  }
}
