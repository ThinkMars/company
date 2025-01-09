<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import RoleForm from './components/RoleForm.vue'

interface Role {
  id: number
  name: string
  permissions: string[]
  createTime: string
  updateTime: string
}

const loading = ref(false)
const roleList = ref<Role[]>([])
const total = ref(0)
const queryParams = ref({
  name: '',
  pageNum: 1,
  pageSize: 10,
})

const showRoleForm = ref(false)
const isCreate = ref(false)
const currentRole = ref<Partial<Role>>({})

const fetchRoleList = async () => {
  try {
    loading.value = true
    // 模拟数据
    const mockData = {
      data: {
        list: [
          {
            id: 1,
            name: '管理员',
            permissions: ['用户管理', '角色管理'],
            createTime: '2024-01-01 12:00:00',
            updateTime: '2024-01-05 09:00:00',
          },
          {
            id: 2,
            name: '开发者',
            permissions: ['代码管理', '部署管理'],
            createTime: '2024-01-02 14:30:00',
            updateTime: '2024-01-06 11:00:00',
          },
        ],
        total: 2,
      },
    }
    const res = mockData
    roleList.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.value.pageNum = 1
  fetchRoleList()
}

const resetQuery = () => {
  queryParams.value = {
    name: '',
    pageNum: 1,
    pageSize: 10,
  }
  fetchRoleList()
}

const handleCreate = () => {
  isCreate.value = true
  currentRole.value = {}
  showRoleForm.value = true
}

const handleEdit = (row: Role) => {
  isCreate.value = false
  currentRole.value = { ...row }
  showRoleForm.value = true
}

const handleDelete = async (row: Role) => {
  try {
    await ElMessageBox.confirm('确认删除该角色吗？', '提示', {
      type: 'warning',
    })
    // await deleteRole(row.id)
    ElMessage.success('删除成功')
    fetchRoleList()
  } catch {
    // 取消删除
  }
}

const handlePermission = (row: Role) => {
  currentRole.value = { ...row }
  // 打开权限管理弹窗
  showRoleForm.value = true
}

const handleRoleSubmit = async (form: any) => {
  try {
    if (isCreate.value) {
      // await createRole(form)
      ElMessage.success('创建成功')
    } else {
      // await updateRole(form)
      ElMessage.success('更新成功')
    }
    showRoleForm.value = false
    fetchRoleList()
  } catch (error) {
    console.error(error)
  }
}

const handlePageChange = () => {
  fetchRoleList()
}

onMounted(() => {
  fetchRoleList()
})
</script>

<template>
  <el-card class="search-card">
    <el-form :inline="true" :model="queryParams">
      <el-form-item label="角色名称">
        <el-input v-model="queryParams.name" placeholder="请输入角色名称" />
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
        <el-button type="primary" @click="handleCreate">新增角色</el-button>
      </div>
    </div>

    <el-table :data="roleList" v-loading="loading">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="permissions" label="角色权限">
        <template #default="{ row }">
          <el-tag
            v-for="permission in row.permissions"
            :key="permission"
            class="permission-tag"
          >
            {{ permission }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="updateTime" label="修改时间" width="180" />
      <el-table-column label="操作" width="260">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="handleDelete(row)"
            >删除</el-button
          >
          <el-button type="warning" size="small" @click="handlePermission(row)"
            >权限管理</el-button
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

  <RoleForm
    v-model="showRoleForm"
    :is-create="isCreate"
    :form-data="currentRole"
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

.permission-tag {
  margin-right: 5px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.buttons-right {
  display: flex;
  justify-content: flex-end;
}
</style>
