<template>
  <div class="role-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button type="primary" @click="handleAdd">新增角色</el-button>
          </div>
        </div>
      </template>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button type="success" link @click="handlePermission(row)"
              >权限配置</el-button
            >
            <el-button type="danger" link @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 角色表单弹窗 -->
    <RoleForm
      v-model="dialogVisible"
      :type="dialogType"
      :current-role="currentRole"
      @success="handleFormSuccess"
    />

    <!-- 权限配置弹窗 -->
    <RolePermission
      v-model="permissionDialogVisible"
      :role="currentRole"
      :permission-data="permissionData"
      :checked-keys="checkedKeys"
      @success="handlePermissionSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import type { Role } from '@/api/role'
import RoleForm from './components/RoleForm.vue'
import RolePermission from './components/RolePermission.vue'
import { useRoleCRUD } from './hooks/useRoleCRUD'

const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentRole = ref<Role>()

const {
  tableData,
  permissionData,
  checkedKeys,
  addRole,
  updateRole,
  deleteRole,
  getPermissions,
  getRolePermissions,
  updateRolePermissions,
} = useRoleCRUD()

const handleAdd = () => {
  dialogType.value = 'add'
  currentRole.value = undefined
  dialogVisible.value = true
}

const handleEdit = (row: Role) => {
  dialogType.value = 'edit'
  currentRole.value = row
  dialogVisible.value = true
}

const handleDelete = (row: Role) => {
  ElMessageBox.confirm('确认删除该角色吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteRole(row.id)
  })
}

const handlePermission = async (row: Role) => {
  currentRole.value = row
  await getPermissions()
  await getRolePermissions(row.id)
  permissionDialogVisible.value = true
}

const handleFormSuccess = async (data: Partial<Role>) => {
  if (dialogType.value === 'add') {
    await addRole(data)
  } else {
    await updateRole(currentRole.value!.id, data)
  }
}

const handlePermissionSuccess = async (permIds: number[]) => {
  if (!currentRole.value) return
  await updateRolePermissions(currentRole.value.id, permIds)
}
</script>

<style scoped lang="less">
.role-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-base);
  }
}
</style>
