<template>
  <div class="container">
    <!-- 顶部操作区 -->
    <div class="operation-bar">
      <el-button-group>
        <el-button type="primary" :icon="Plus">新增</el-button>
        <el-button type="primary" :icon="Edit">编辑</el-button>
        <el-button type="primary" :icon="Delete">删除</el-button>
      </el-button-group>

      <el-dropdown trigger="click">
        <el-button type="primary">
          更多操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>导入</el-dropdown-item>
            <el-dropdown-item>导出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="demo-form">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="searchForm.department" placeholder="请选择部门">
            <el-option label="技术部" value="tech" />
            <el-option label="市场部" value="marketing" />
            <el-option label="人事部" value="hr" />
          </el-select>
        </el-form-item>
        <el-form-item label="入职日期">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="searchForm.status">
            <el-radio label="all">全部</el-radio>
            <el-radio label="active">在职</el-radio>
            <el-radio label="inactive">离职</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>员工列表</span>
          <el-button type="primary" link>导出Excel</el-button>
        </div>
      </template>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="joinDate" label="入职日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '在职' ? 'success' : 'danger'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="工作进度" width="200">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button type="success" link @click="handleView(row)"
              >查看</el-button
            >
            <el-popconfirm title="确定删除吗？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus, Edit, Delete, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  name: '',
  department: '',
  dateRange: [],
  status: 'all',
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const tableData = ref([
  {
    name: '张三',
    department: '技术部',
    email: 'zhangsan@example.com',
    status: '在职',
    joinDate: '2023-01-01',
    progress: 90,
  },
  {
    name: '李四',
    department: '市场部',
    email: 'lisi@example.com',
    status: '在职',
    joinDate: '2023-02-15',
    progress: 75,
  },
  {
    name: '王五',
    department: '人事部',
    email: 'wangwu@example.com',
    status: '离职',
    joinDate: '2022-06-01',
    progress: 100,
  },
])

const handleSearch = () => {
  ElMessage.success('触发搜索')
  console.log('搜索条件：', searchForm)
}

const resetForm = () => {
  searchForm.name = ''
  searchForm.department = ''
  searchForm.dateRange = []
  searchForm.status = 'all'
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑: ${row.name}`)
}

const handleView = (row: any) => {
  ElMessage.info(`查看: ${row.name}`)
}

const handleDelete = (row: any) => {
  ElMessage.success(`删除: ${row.name}`)
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // 重新加载数据
}
</script>

<style scoped>
.container {
  padding: 20px;
}

.operation-bar {
  margin-bottom: 16px;
  display: flex;
  gap: 16px;
}

.search-card {
  margin-bottom: 16px;
}

.table-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-card__header) {
  padding: 12px 20px;
}

:deep(.el-form--inline .el-form-item) {
  margin-bottom: 16px;
}
</style>
