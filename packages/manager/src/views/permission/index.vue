<script setup lang="ts">
import { ref } from 'vue'
import PermissionForm from './components/PermissionForm.vue'
import type { Permission } from '@/api/permission'

const loading = ref(false)
const tableData = ref<Permission[]>([])
const permissionFormRef = ref()

// 分页
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 6,
})

// 查询条件
const queryParams = ref({
  name: '',
  code: '',
  type: undefined,
})

// 获取权限列表
const getList = async () => {
  try {
    loading.value = true
    // 模拟数据
    const mockData = [
      {
        id: 1,
        parentId: null,
        name: '用户管理',
        code: 'user:manage',
        type: 2 as const,
        path: '/user',
        sort: 1,
        createdAt: '2024-01-01 12:00:00',
        updatedAt: '2024-01-01 12:00:00',
      },
      {
        id: 2,
        parentId: null,
        name: '角色管理',
        code: 'role:manage',
        type: 2 as const,
        path: '/role',
        sort: 2,
        createdAt: '2024-01-02 14:30:00',
        updatedAt: '2024-01-02 14:30:00',
      },
      {
        id: 3,
        parentId: null,
        name: '权限管理',
        code: 'permission:manage',
        type: 2 as const,
        path: '/permission',
        sort: 3,
        createdAt: '2024-01-03 09:15:00',
        updatedAt: '2024-01-03 09:15:00',
      },
      {
        id: 4,
        parentId: 1,
        name: '新增用户',
        code: 'user:add',
        type: 3 as const,
        path: '',
        sort: 1,
        createdAt: '2024-01-04 16:45:00',
        updatedAt: '2024-01-04 16:45:00',
      },
      {
        id: 5,
        parentId: 1,
        name: '删除用户',
        code: 'user:delete',
        type: 3 as const,
        path: '',
        sort: 2,
        createdAt: '2024-01-05 11:20:00',
        updatedAt: '2024-01-05 11:20:00',
      },
    ]
    tableData.value = mockData
    pagination.value.total = mockData.length
  } finally {
    loading.value = false
  }
}

// 新增权限
const handleAdd = () => {
  permissionFormRef.value?.open()
}

// 编辑权限
const handleEdit = (row: Permission) => {
  permissionFormRef.value?.open(row)
}

// 删除权限
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确认删除该权限吗？', '提示', {
      type: 'warning',
    })
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    console.error(error)
  }
}

// 分页改变
const handlePageChange = (page: number) => {
  pagination.value.current = page
  getList()
}

// 初始化获取数据
getList()
</script>

<template>
  <!-- 查询表单 -->
  <el-card class="search-card">
    <el-form :inline="true" :model="queryParams">
      <el-form-item label="权限名称">
        <el-input v-model="queryParams.name" placeholder="请输入权限名称" />
      </el-form-item>
      <el-form-item label="权限编码">
        <el-input v-model="queryParams.code" placeholder="请输入权限编码" />
      </el-form-item>
      <el-form-item label="权限类型">
        <el-select
          v-model="queryParams.type"
          style="width: 100px"
          placeholder="请选择权限类型"
        >
          <el-option label="目录" :value="1" />
          <el-option label="菜单" :value="2" />
          <el-option label="按钮" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button
          @click="queryParams = { name: '', code: '', type: undefined }"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>

  <!-- 表格 -->
  <el-card>
    <div class="buttons-right">
      <el-button type="primary" @click="handleAdd">新增权限</el-button>
    </div>

    <el-table v-loading="loading" :data="tableData">
      <el-table-column prop="name" label="权限名称" />
      <el-table-column prop="code" label="权限编码" />
      <el-table-column prop="type" label="权限类型">
        <template #default="{ row }">
          {{ row.type === 1 ? '目录' : row.type === 2 ? '菜单' : '按钮' }}
        </template>
      </el-table-column>
      <el-table-column prop="path" label="权限路径" />
      <el-table-column prop="createdAt" label="创建时间" />
      <el-table-column prop="updatedAt" label="更新时间" />
      <el-table-column label="操作" width="150" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="handleDelete(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 权限表单弹窗 -->
  <PermissionForm ref="permissionFormRef" @success="getList" />
  <div class="pagination">
    <el-pagination
      v-model:current-page="pagination.current"
      v-model:page-size="pagination.pageSize"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handlePageChange"
    />
  </div>
</template>

<style scoped lang="less">
.search-card {
  margin-bottom: 20px;
}

.pagination {
  padding: 20px 0;
  text-align: right;
  display: flex;
  justify-content: flex-end;
}

.buttons-right {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}
</style>
