<template>
  <div class="forgot-pwd">
    <div class="module_control">
      <div class="control_header">
        <span>{{ $t('forgotPassword.platformTitle') }}</span>
      </div>
      <div class="control_body">
        <div class="right_form">
          <div class="forgot_title">
            ——
            <span class="title_label">{{ $t('forgotPassword.resetTitle') }}</span>
            ——
          </div>
          <el-form :model="form" :rules="rules" ref="resetForm" label-width="auto" style="max-width: 600px">
            <el-form-item :label="$t('forgotPassword.email')" prop="email">
              <div class="email-row">
                <el-input
                  v-model="form.email"
                  :placeholder="$t('forgotPassword.emailPlaceholder')"
                />
                <el-button
                  class="code-btn"
                  :disabled="countdown > 0"
                  @click="sendCode"
                >
                  {{ countdown > 0 ? countdown + 's' :  $t('forgotPassword.getCode') }}
                </el-button>
              </div>
            </el-form-item>
            <el-form-item :label="$t('forgotPassword.code')" prop="code">
              <el-input v-model="form.code" :placeholder="$t('forgotPassword.codePlaceholder')" />
            </el-form-item>
            <el-form-item :label="$t('forgotPassword.newPassword')" prop="password">
              <el-input v-model="form.password" type="password" :placeholder="$t('forgotPassword.confirmPasswordPlaceholder')" show-password />
            </el-form-item>
            <el-form-item :label="$t('forgotPassword.confirmPassword')" prop="confirmPwd">
              <el-input v-model="form.confirmPwd" type="password" :placeholder="$t('forgotPassword.confirmPasswordPlaceholder')" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit" style="width:100%">{{ $t('forgotPassword.resetBtn') }}</el-button>
            </el-form-item>
            <el-form-item>
              <el-link @click="$router.push('/home/login')">{{ $t('forgotPassword.backLogin') }}</el-link>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { sendResetPwdCode, resetPassword } from '@/request';
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

const router = useRouter();
const countdown = ref(0);
let timer = null;

const form = reactive({
  email: '',
  code: '',
  password: '',
  confirmPwd: ''
});

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

const resetForm = ref(null);

// 发送验证码
const sendCode = async () => {
  if (!form.email) {
    ElMessage.warning('请输入邮箱');
    return;
  }
  try {
    const params = { email: form.email };
    const res = await sendResetPwdCode(params);
    if (res.code === 200) {
      ElMessage.success('验证码发送成功');
      countdown.value = 60;
      timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
          timer = null;
        }
      }, 1000);
    } else if (res.code === 415) {
      ElMessage.error('邮箱格式不正确');
    } else if (res.code === 412) {
      ElMessage.error('用户邮箱不存在');
    } else {
      ElMessage.error(res.msg || '发送失败');
    }
  } catch (e) {
    // 优先显示后端返回的msg
    if (e.response && e.response.data && e.response.data.msg) {
      ElMessage.error(e.response.data.msg);
    } else {
      ElMessage.error('网络错误');
    }
  }
};

// 提交重置密码
const submit = () => {
  resetForm.value.validate(async (valid) => {
    if (!valid) return;
    try {
      const params = {
        email: form.email,
        code: form.code,
        password: form.password,
      };
      const res = await resetPassword(params);
      if (res.code === 200) {
        ElMessage.success('修改成功，请重新登录');
        router.push('/home/login');
      } else if (res.code === 411) {
        ElMessage.error('验证码错误');
      } else {
        ElMessage.error(res.msg || '修改失败');
      }
    } catch (e) {
      ElMessage.error('网络错误');
    }
  });
};
</script>

<style lang="scss" scoped>
.forgot-pwd {
  position: relative;
  width: 100%;
  height: calc(100vh - 70px);
  background-image: url("@/assets/img/register.png");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;

  .module_control {
    width: 570px;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    padding: 30px;

    .control_header {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 30px;
      /* 居中显示 */
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .control_body {
      .right_form {
        .forgot_title {
          text-align: center;
          margin-bottom: 30px;
          color: #666;
          font-size: 20px;

          .title_label {
            color: #409eff;
            font-weight: bold;
          }
        }

        .el-form {
          margin-bottom: 20px;
        }
        .email-row {
          display: flex;
          align-items: center;
          width: 100%;
        }
        .email-row .el-input {
          flex: 1;
        }
        .code-btn {
          margin-left: 12px;
          min-width: 110px;
          height: 40px;
        }
      }
    }
  }
}
</style>