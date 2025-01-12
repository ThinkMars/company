<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Key } from '@element-plus/icons-vue'
import { useUserStore } from '@/pinia/user'
import type { FormInstance } from 'element-plus'
import { getCaptcha, login, changePassword } from '@/api/login'

const router = useRouter()
const userStore = useUserStore()
const captchaImg = ref('') // 验证码图片base64数据

const loading = ref(false)
const changePasswordLoading = ref(false)
const loginFormRef = ref<FormInstance>()
const changePasswordFormRef = ref<FormInstance>()

const isFlipped = ref(false)
const isRotating = ref(false)
const isFlipping = ref(false)

const toggleFlip = () => {
  if (isRotating.value || isFlipping.value) return

  // 第一阶段：旋转变形动画
  isRotating.value = true
  setTimeout(() => {
    isRotating.value = false
    // 第二阶段：开始翻转动画
    isFlipping.value = true
    isFlipped.value = !isFlipped.value

    // 翻转动画结束后重置状态
    setTimeout(() => {
      isFlipping.value = false
    }, 800)
  }, 1000) // 旋转变形动画持续1秒
}

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
    changePasswordForm.captchaId = captchaId
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
        userStore.setToken(res.access_token || '')
        userStore.setUserInfo(res.userInfo || '')
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

const changePasswordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  captchaId: '',
  captchaText: '',
})

const changePasswordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== changePasswordForm.newPassword) {
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

const handleChangePassword = async () => {
  if (!changePasswordFormRef.value) return
  await changePasswordFormRef.value.validate(async (valid) => {
    if (valid) {
      changePasswordLoading.value = true
      try {
        // 调用修改密码接口
        const res = await changePassword(changePasswordForm)
        if (res) {
          ElMessage.success('密码修改成功')
          isFlipped.value = false
        }
      } catch (error) {
        console.error(error)
        // 验证码错误时刷新验证码
        refreshCaptcha()
      } finally {
        changePasswordLoading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="login-container">
    <div
      class="flip-container"
      :class="{
        'is-flipped': isFlipped && !isRotating,
        'is-rotating': isRotating,
        'is-flipping': isFlipping,
      }"
    >
      <!-- 登录卡片面 -->
      <div class="card-front">
        <div class="login-box">
          <h2 class="title">Company 管理后台</h2>
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
          <div class="card-switch">
            忘记密码？
            <a @click="toggleFlip">修改密码</a>
          </div>
        </div>
      </div>

      <!-- 修改密码卡片面 -->
      <div class="card-back">
        <div class="login-box">
          <h2 class="title">修改密码</h2>
          <el-form
            ref="changePasswordFormRef"
            :model="changePasswordForm"
            :rules="changePasswordRules"
            label-width="0"
          >
            <el-form-item prop="oldPassword">
              <el-input
                v-model="changePasswordForm.oldPassword"
                type="password"
                placeholder="原密码"
                maxlength="16"
              >
                <template #prefix>
                  <el-icon>
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="newPassword">
              <el-input
                v-model="changePasswordForm.newPassword"
                type="password"
                placeholder="新密码"
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
                v-model="changePasswordForm.confirmPassword"
                type="password"
                placeholder="确认新密码"
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
                  v-model="changePasswordForm.captchaText"
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
                :loading="changePasswordLoading"
                @click="handleChangePassword"
              >
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
          <div class="card-switch">
            <a @click="toggleFlip">返回登录</a>
          </div>
        </div>
      </div>
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
  perspective: 1000px;

  .flip-container {
    width: 400px;
    height: 480px; // 调整卡片总高度
    position: relative;
    transform-style: preserve-3d;
    transition: transform 1s;

    &.is-rotating {
      animation: rotateAndMorph 1s ease-in-out;
      transform: rotate(0deg);
    }

    &.is-flipping {
      transition: transform 0.8s;
    }

    &.is-flipped {
      transform: rotateY(180deg);
    }
  }

  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
  }

  .card-back {
    transform: rotateY(180deg);
  }

  .login-box {
    // width: 100%;
    // height: 100%;
    padding: 25px var(--spacing-extra-large); // 调整上下内边距
    background-color: #fff;
    border-radius: var(--border-radius-base);
    box-shadow: var(--box-shadow-light);

    .title {
      text-align: center;
      color: var(--primary-color);
      font-size: 24px;
      margin-bottom: 20px; // 减少标题底部间距
      font-weight: 600;
    }

    .card-switch {
      text-align: center;
      margin-top: 15px; // 减少底部切换按钮的上边距
      color: #606266;

      a {
        color: var(--primary-color);
        cursor: pointer;
        margin-left: 5px;

        &:hover {
          text-decoration: underline;
        }
      }
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

  @keyframes rotateAndMorph {
    0% {
      transform: rotate(0deg) scale(1);
    }

    25% {
      transform: rotate(90deg) scale(0.8) skew(15deg);
    }

    50% {
      transform: rotate(180deg) scale(1.2) skew(-15deg);
    }

    75% {
      transform: rotate(270deg) scale(0.9) skew(10deg);
    }

    100% {
      transform: rotate(360deg) scale(1);
    }
  }
}
</style>
