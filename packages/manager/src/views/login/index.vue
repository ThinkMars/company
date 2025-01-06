<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Key } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import type { FormInstance } from 'element-plus'
import { getCaptcha, login, register } from '@/api/login'

const router = useRouter()
const userStore = useUserStore()
const captchaImg = ref('') // 验证码图片base64数据

const activeTab = ref('login')
const loading = ref(false)
const registerLoading = ref(false)
const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()

// 初始化时加载验证码
const initCaptcha = () => {
  refreshCaptcha()
}

// 刷新验证码
const refreshCaptcha = async () => {
  try {
    const res = await getCaptcha()
    const { svg, captchaId } = res
    // 将SVG字符串转换为base64
    const base64Data = window.btoa(unescape(encodeURIComponent(svg)))
    captchaImg.value = `data:image/svg+xml;base64,${base64Data}`
    loginForm.captchaId = captchaId
    registerForm.captchaId = captchaId
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

// 组件挂载时加载验证码
onMounted(() => {
  initCaptcha()
})

const loginForm = reactive({
  username: '',
  password: '',
  captchaText: '',
  captchaId: '',
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { max: 10, message: '用户名最多10个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { max: 16, message: '密码最多16个字符', trigger: 'blur' },
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { max: 6, message: '验证码最多6个字符', trigger: 'blur' },
  ],
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 调用登录接口
        const res = await login(loginForm)
        userStore.setToken(res.access_token)
        userStore.setUserInfo(res.userInfo)
        router.replace('/')
      } catch (error) {
        console.error(error)
        // 验证码错误时刷新验证码
        refreshCaptcha()
      } finally {
        loading.value = false
      }
    }
  })
}

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  captchaId: '',
  captchaText: '',
})

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  captchaText: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { max: 6, message: '验证码最多6个字符', trigger: 'blur' },
  ],
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      registerLoading.value = true
      try {
        // 调用注册接口
        const res = await register(registerForm)
        ElMessage.success('注册成功')
        activeTab.value = 'login'
      } catch (error) {
        console.error(error)
        // 验证码错误时刷新验证码
        refreshCaptcha()
      } finally {
        registerLoading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">管理后台</h2>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="登录" name="login">
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-width="0"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="用户名"
                maxlength="10"
              >
                <template #prefix>
                  <el-icon>
                    <User />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码"
                maxlength="16"
              >
                <template #prefix>
                  <el-icon>
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="captchaText">
              <div class="captcha-container">
                <el-input
                  v-model="loginForm.captchaText"
                  placeholder="验证码"
                  maxlength="6"
                >
                  <template #prefix>
                    <el-icon>
                      <Key />
                    </el-icon>
                  </template>
                </el-input>
                <img
                  class="captcha-img"
                  :src="captchaImg"
                  alt="验证码"
                  @click="refreshCaptcha"
                />
              </div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :loading="loading" @click="handleLogin">
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="注册" name="register">
          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            label-width="0"
          >
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="用户名"
                maxlength="10"
              >
                <template #prefix>
                  <el-icon>
                    <User />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="密码"
                maxlength="16"
              >
                <template #prefix>
                  <el-icon>
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="确认密码"
                maxlength="16"
              >
                <template #prefix>
                  <el-icon>
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="captchaText">
              <div class="captcha-container">
                <el-input
                  v-model="registerForm.captchaText"
                  placeholder="验证码"
                  maxlength="6"
                >
                  <template #prefix>
                    <el-icon>
                      <Key />
                    </el-icon>
                  </template>
                </el-input>
                <img
                  class="captcha-img"
                  :src="captchaImg"
                  alt="验证码"
                  @click="refreshCaptcha"
                />
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                :loading="registerLoading"
                @click="handleRegister"
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-lighter);

  .login-box {
    width: 400px;
    padding: var(--spacing-extra-large);
    background-color: #fff;
    border-radius: var(--border-radius-base);
    box-shadow: var(--box-shadow-light);

    .title {
      text-align: center;
      color: var(--primary-color);
      font-size: 24px;
      margin-bottom: var(--spacing-extra-large);
      font-weight: 600;
    }

    // 自定义 Element Plus 组件主题色
    :deep(.el-tabs__item.is-active) {
      color: var(--primary-color);
    }

    :deep(.el-tabs__active-bar) {
      background-color: var(--primary-color);
    }

    .captcha-container {
      display: flex;
      gap: var(--spacing-base);

      .captcha-img {
        width: 100px;
        height: 40px;
        border-radius: var(--border-radius-small);
        cursor: pointer;
        vertical-align: middle;
        transition: all 0.3s;

        &:hover {
          opacity: 0.8;
        }
      }
    }

    .el-button--primary {
      width: 100%;
      background-color: var(--primary-color);
      border-color: var(--primary-color);

      &:hover,
      &:focus {
        background-color: var(--primary-light);
        border-color: var(--primary-light);
      }
    }
  }
}
</style>
