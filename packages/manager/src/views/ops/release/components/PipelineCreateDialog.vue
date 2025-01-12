<template>
  <el-dialog
    title="创建流水线"
    v-model="visible"
    width="600px"
    :before-close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="form.type"
          placeholder="请选择类型"
          style="width: 100%"
        >
          <el-option label="前端" value="frontend" />
          <el-option label="Node后端" value="node" />
          <el-option label="JAVA后端" value="java" disabled />
        </el-select>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="Git仓库" prop="gitUrl">
        <el-input v-model="form.gitUrl" placeholder="请输入Git仓库地址" />
      </el-form-item>

      <el-form-item label="分支" prop="branch">
        <el-input v-model="form.branch" placeholder="请输入分支名称" />
      </el-form-item>

      <el-form-item label="子目录">
        <el-input v-model="form.subDir" placeholder="请输入子目录" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useTemplateRef, reactive, ref } from 'vue'
import type { FormRules } from 'element-plus'
import { createJob, updateJob } from '@/api/jenkins'

const props = defineProps({
  jobId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'submit'])

const visible = ref(true)
const formRef = useTemplateRef('formRef')
const form = reactive({
  type: 'frontend',
  name: '',
  gitUrl: '',
  branch: '',
  subDir: '',
})

const rules = reactive<FormRules>({
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { max: 50, message: '名称长度不能超过50个字符', trigger: 'blur' },
  ],
  gitUrl: [{ required: true, message: '请输入Git仓库地址', trigger: 'blur' }],
  branch: [{ required: true, message: '请输入分支名称', trigger: 'blur' }],
})

const handleClose = () => {
  emit('close')
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()

    if (props.jobId) {
      await updateJob(form)
    } else {
      await createJob(form)
    }

    ElMessage.success('创建成功')
    emit('submit')
  } catch (error) {
    console.log('表单校验失败', error)
  }
}
</script>
