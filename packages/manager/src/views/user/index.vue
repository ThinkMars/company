<script setup lang="ts">
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import type { User } from '@/api/user'
import UserForm from './components/UserForm.vue'
import { useUserCRUD } from './hooks/useUserCRUD'

const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentUser = ref<User>()

const {
  tableData,
  roleOptions,
  total,
  loading,
  queryParams,
  addUser,
  updateUser,
  deleteUser,
  getList,
} = useUserCRUD()

const handleAdd = () => {
  dialogType.value = 'add'
  currentUser.value = undefined
  dialogVisible.value = true
}

const handleEdit = (row: User) => {
  dialogType.value = 'edit'
  currentUser.value = row
  dialogVisible.value = true
}

const handleDelete = (row: User) => {
  ElMessageBox.confirm('确认删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteUser(row.id)
  })
}

const handleSearch = () => {
  queryParams.value.page = 1
  getList()
}

const handleSizeChange = (val: number) => {
  queryParams.value.pageSize = val
  getList()
}

const handleCurrentChange = (val: number) => {
  queryParams.value.page = val
  getList()
}

const handleFormSuccess = async (data: Partial<User>) => {
  if (dialogType.value === 'add') {
    await addUser(data)
  } else {
    await updateUser(currentUser.value!.id, data)
  }
}
</script>

<template>
  <div class="user-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button type="primary" @click="handleAdd">新增用户</el-button>
          </div>
          <div class="header-right">
            <el-input
              v-model="queryParams.keyword"
              placeholder="请输入用户名搜索"
              style="width: 200px"
              clearable
              @clear="handleSearch"
            >
              <template #suffix>
                <el-icon class="el-input__icon" @click="handleSearch">
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="roleName" label="角色" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button type="danger" link @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户表单弹窗 -->
    <UserForm
      v-model="dialogVisible"
      :type="dialogType"
      :current-user="currentUser"
      :role-options="roleOptions"
      @success="handleFormSuccess"
    />
  </div>
</template>

<style scoped lang="less">
.user-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-base);
  }

  .pagination {
    margin-top: var(--spacing-large);
    display: flex;
    justify-content: flex-end;
  }
}
</style>
