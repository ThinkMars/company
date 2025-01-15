<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import UserForm from './components/UserForm.vue'
import RoleForm from '../role/components/RoleForm.vue'
import {
  getUserList,
  createUser,
  updateUser,
  deleteUser,
  updateUserRoles,
} from '@/api/user'

interface User {
  id: number
  username: string
  createTime: string
  roles: string[]
}

const loading = ref(false)
const userList = ref<User[]>([])
const total = ref(0)
const queryParams = ref({
  username: '',
  pageNum: 1,
  pageSize: 10,
})

const showUserForm = ref(false)
const isCreate = ref(false)
const currentUser = ref<Partial<User>>({})
const showRoleForm = ref(false)

const fetchUserList = async () => {
  try {
    loading.value = true
    // 模拟后端数据
    const mockData = {
      data: {
        list: [
          {
            id: 1,
            username: 'admin',
            createTime: '2024-01-01 12:00:00',
            roles: ['超级管理员'],
          },
          {
            id: 2,
            username: 'test',
            createTime: '2024-01-02 14:30:00',
            roles: ['普通用户'],
          },
          {
            id: 3,
            username: 'developer',
            createTime: '2024-01-03 09:15:00',
            roles: ['开发者', '测试员'],
          },
          {
            id: 4,
            username: 'guest',
            createTime: '2024-01-04 16:45:00',
            roles: ['访客'],
          },
          {
            id: 5,
            username: 'manager',
            createTime: '2024-01-05 11:20:00',
            roles: ['部门主管', '项目经理'],
          },
        ],
        total: 5,
      },
    }

    // const res = await getUserList(queryParams.value) // 注释掉真实API调用
    const res = mockData // 使用模拟数据
    userList.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.value.pageNum = 1
  fetchUserList()
}

const resetQuery = () => {
  queryParams.value = {
    username: '',
    pageNum: 1,
    pageSize: 10,
  }
  fetchUserList()
}

const handleCreate = () => {
  isCreate.value = true
  currentUser.value = {}
  showUserForm.value = true
}

const handleEdit = (row: User) => {
  isCreate.value = false
  currentUser.value = { ...row }
  showUserForm.value = true
}

const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm('确认删除该用户吗？', '提示', {
      type: 'warning',
    })
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    fetchUserList()
  } catch {
    // 取消删除
  }
}

const handleRole = (row: User) => {
  currentUser.value = { ...row }
  showRoleForm.value = true
}

const handleUserSubmit = async (form: any) => {
  try {
    if (isCreate.value) {
      await createUser(form)
      ElMessage.success('创建成功')
    } else {
      await updateUser(form)
      ElMessage.success('更新成功')
    }
    showUserForm.value = false
    fetchUserList()
  } catch (error) {
    console.error(error)
  }
}

const handleRoleSubmit = async (form: any) => {
  try {
    await updateUserRoles(form)
    ElMessage.success('角色更新成功')
    showRoleForm.value = false
    fetchUserList()
  } catch (error) {
    console.error(error)
  }
}

const handlePageChange = () => {
  fetchUserList()
}

onMounted(() => {
  fetchUserList()
})
</script>

<template>
  <el-card class="search-card">
    <el-form :inline="true" :model="queryParams">
      <el-form-item label="用户名">
        <el-input v-model="queryParams.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card class="table-card">
    <div class="operation-buttons">
      <div class="buttons-right">
        <el-button type="primary" @click="handleCreate">新增用户</el-button>
      </div>
    </div>

    <el-table :data="userList" v-loading="loading">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="roles" label="角色">
        <template #default="{ row }">
          <el-tag v-for="role in row.roles" :key="role" class="role-tag">{{
            role
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="handleDelete(row)"
            >删除</el-button
          >
          <el-button type="warning" size="small" @click="handleRole(row)"
            >角色管理</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </div>
  </el-card>

  <UserForm
    v-model="showUserForm"
    :is-create="isCreate"
    :form-data="currentUser"
    @submit="handleUserSubmit"
  />
  <RoleForm
    v-model="showRoleForm"
    :form-data="currentUser"
    @submit="handleRoleSubmit"
  />
</template>

<style scoped>
.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.operation-buttons {
  margin-bottom: 20px;
}

.role-tag {
  margin-right: 5px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
  display: flex;
  justify-content: flex-end;
}

.buttons-right {
  display: flex;
  justify-content: flex-end;
}
</style>
