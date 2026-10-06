<template>
  <div class="register">
    <div class="module_control">
      <div class="control_header">
        <span>{{ $t("message.systemTitle") }}</span>
      </div>
      <div class="control_body">
        <div class="right_form">
          <div class="register_title">
            ——
            <span class="title_label">{{ $t("register.registerPage") }}</span>
            ——
          </div>
          <el-form
            :model="form"
            ref="registerForm"
            label-width="auto"
            style="max-width: 600px"
          >
            <el-form-item
              :label="$t('register.userName')"
              prop="username"
              :rules="rules.username"
            >
              <el-input
                v-model="form.username"
                :placeholder="$t('register.userNamePlaceholder')"
              />
            </el-form-item>
            <!-- 密码 -->
            <el-form-item
              :label="$t('register.password')"
              prop="password"
              :rules="[
                {
                  required: true,
                  message: () => $t('register.passwordTip'),
                  trigger: 'blur',
                  min:6,
                },
              ]"
            >
              <el-input
                v-model="form.password"
                type="password"
                :placeholder="$t('register.password')"
                show-password
              />
            </el-form-item>
            <!-- 确认密码 -->
            <el-form-item
              :label="$t('register.password_confirm')"
              prop="password_confirm"
              :rules="[
                {
                  required: true,
                  message: () => $t('register.passwordTip_confirm'),
                  trigger: 'blur',
                  validator: (rule, value, callback) => {
                    if (value !== form.password) {
                      callback(new Error('两次输入的密码不一致'));
                    } else {
                      callback();
                    }
                  },
                },
              ]"
            >
              <el-input
                v-model="form.password_confirm"
                type="password"
                :placeholder="$t('register.password_confirm')"
                show-password
              />
            </el-form-item>
            <!-- 真实姓名 -->
            <el-form-item
              :label="$t('register.realName')"
              prop="fullName"
              :rules="[
                {
                  required: true,
                  message: () => $t('register.realNameTip'),
                  trigger: 'blur',
                },
              ]"
            >
              <el-input
                v-model="form.fullName"
                :placeholder="$t('register.realName')"
              />
            </el-form-item>
            <!-- 国家/地区选择 -->
            <el-form-item :label="t('register.countryCode')" prop="countryCode">
              <el-select
                v-model="form.countryCode"
                :placeholder="t('register.countryCodePlaceholder')"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="item in countryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!-- 手机号输入框 -->
            <el-form-item :label="t('register.phone')" prop="phone" :rules="rules.phone">
              <el-input
                v-model="form.phone"
                :placeholder="t('register.phonePlaceholder')"
              >
                <template #prepend>
                  {{ form.countryCode }}
                </template>
              </el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item
              :label="$t('register.email')"
              prop="email"
              :rules="rules.email"
            >
              <el-input
                v-model="form.email"
                :placeholder="$t('register.emailPlaceholder')"
              />
            </el-form-item>
            <!-- 单位 -->
            <el-form-item
              :label="$t('register.unit')"
              prop="company"
              :rules="[
                {
                  required: true,
                  message: () => $t('register.unitTip'),
                  trigger: 'blur',
                  pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, 
                  min:4,
                  validator: (rule, value, callback) => {
                    if (!value) return callback();
                    
                    // 检查是否存在长度≥4的重复子串
                    for (let i = 0; i < value.length - 3; i++) {
                      const char = value[i];
                      if (
                        value[i + 1] === char &&
                        value[i + 2] === char &&
                        value[i + 3] === char
                      ) {
                        return callback(new Error('错误'));
                      }
                    }
                    callback();
                  },
                },
              ]"
            >
              <el-input
                v-model="form.company"
                :placeholder="$t('register.unitPlaceholder')"
              />
            </el-form-item>
            <!-- 身份 -->
            <el-form-item
              :label="$t('register.identity')"
              prop="region"
              :rules="[
                {
                  required: true,
                  message: () => $t('register.identityTip'),
                  trigger: 'blur',
                },
              ]"
            >
              <el-select
                v-model="form.region"
                :placeholder="$t('register.identityPlaceholder')"
                style="width: 100%;"
              >
                <el-option v-for="(item, index) in identityOptions" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('register.identifyingCode')"
              prop="code"
              :rules="rules.code"
            >
              <el-input
                v-model="form.code"
                :placeholder="$t('register.identifyingCodePlaceholder')"
                style="width: 200px; margin-right: 10px"
              />
              <el-button :disabled="codeBtnDisabled" @click="getEmailCode">{{
                codeBtnText
              }}</el-button>
            </el-form-item>
          </el-form>
          <div class="register_btn" @click="register">
            {{ $t("register.register") }}
          </div>
        </div>
      </div>
      <div class="to_login">
        {{ $t("register.hasAccount") }}
        <span @click="gotoLogin">{{ $t("register.login") }} →</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { registerInterface, getEmailCodeInterface } from "@/request";
import { useI18n } from "vue-i18n";
import { getCountryOptions } from '@/assets/json/countryOptions';

const { t, locale } = useI18n();
const router = useRouter();
const registerForm = ref(null);

// 使用计算属性获取当前语言的国家选项
const countryOptions = computed(() => getCountryOptions(locale.value));

const identityOptions = computed(() => [
  { label: t('register.identity1'), value: t('register.identity1') },
  { label: t('register.identity2'), value: t('register.identity2') },
  { label: t('register.identity3'), value: t('register.identity3') },
  { label: t('register.identity4'), value: t('register.identity4') },
  { label: t('register.identity5'), value: t('register.identity5') },
  { label: t('register.identity6'), value: t('register.identity6') },
  { label: t('register.identity7'), value: t('register.identity7') }
])

const form = reactive({
  countryCode: "+86", // 默认中国区号
  username: "",
  password: "",
  password_confirm: "",
  fullName: "",
  phone: "",
  email: "",
  company: "",
  region: "",
  code: "",
});

const codeBtnTextContent = ref("获取验证码");
const codeBtnDisabled = ref(false);
let timer = null;
let count = 60; // 倒计时秒数

const codeBtnText = computed(() => {
  if (codeBtnDisabled.value) {
    codeBtnTextContent.value = t("register.code.retryAfter", { count });
    return codeBtnTextContent.value;
  }
  return t("register.code.getCode");
});

// 获取邮箱验证码
const getEmailCode = async () => {
  if (!form.email) {
    ElMessage.warning(t("register.code.emailRequired"));
    return;
  }
  codeBtnDisabled.value = true;
  try {
    await getEmailCodeInterface(form.email);
    ElMessage.success(t("register.code.codeSent"));
    
    codeBtnTextContent.value = t("register.code.retryAfter", { count });
    timer = setInterval(() => {
      count--;
      codeBtnTextContent.value = t("register.code.retryAfter", { count });

      if (count <= 0) {
        clearInterval(timer);
        timer = null;
        codeBtnDisabled.value = false;
        count=60
      }
    }, 1000);
  } catch (e) {
    ElMessage.error(t("register.code.sendFailed"));
    codeBtnDisabled.value = false;
  }
};

// 手机号验证函数
const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error(t("register.phoneTip")));
    return;
  }

  // 移除所有空格和连字符
  const cleanNumber = value.replace(/[\s-]/g, "");

  // 检查是否以+开头
  if (form.countryCode === "+86") {
    // 中国手机号格式
    if (!/^1[3-9]\d{9}$/.test(cleanNumber)) {
      callback(new Error(t("register.phoneLocalTip")));
      return;
    }
  } else {
    // 国际号码格式
    if (!/^\d{6,15}$/.test(cleanNumber)) {
      callback(new Error(t("register.phoneInternationalTip")));
      return;
    }
  }
  callback();
};

//用户名验证函数
const validateUsername = (rule, value, callback) => {
  // 只能包含字母、数字、下划线，且长度4-20
  const reg = /^[a-zA-Z0-9_]{4,20}$/;
  if (!reg.test(value)) {
    callback(new Error(t('register.error.usernameLength')));
  } else {
    callback();
  }
};

const rules = reactive({
  username: [
    { required: true, message: () => t('register.usernameTip'), trigger: 'blur' },
    { validator: validateUsername, trigger: 'blur' }
  ],
  email: [
    {
      required: true,
      message: () => t('register.emailTip1'),
      trigger: 'blur',
    },
    {
      type: 'email',
      message: () => t('register.emailTip2'),
      trigger: 'blur',
    },
  ],
  phone: [
    { required: true, validator: validatePhone, trigger: "blur" }
  ],
  code: [
    {
      required: true,
      message: () => t('register.identifyingCodeTip'),
      trigger: 'blur',
    },
  ]
});

// 注册
const register = () => {
  registerForm.value.validate(async (valid) => {
    
    if (!valid) return;
    // 拼接完整手机号
    // const fullPhone = form.countryCode + form.phone;
    // 传 fullPhone 给后端
    // const res = await registerInterface(
    //   form.username,
    //   form.password,
    //   form.fullName,
    //   fullPhone, // 这里用拼接后的手机号
    //   form.email,
    //   form.company,
    //   form.region,
    //   form.code
    // );
    try {
      const res = await registerInterface(
        form.username,
        form.password,
        form.fullName,
        form.phone,
        form.email,
        form.company,
        form.region,
        form.code
      );
      
      if (res.code === 200) {
        // 不再自动写入token和用户名
        ElMessage.success(t("register.registerSuccess"));
        router.push("/home/login"); // 跳转到登录页
      } else {
        const errorMessages = {
          411: t("register.error.codeError"),
          412: t("register.error.usernameExists"),
          413: t("register.error.emailExists"),
          414: t("register.error.phoneExists"),
          416: t("register.error.usernameLength"),
          419: t("register.error.registerFailed"),
        };

        if (errorMessages[res.code]) {
          ElMessage.error(errorMessages[res.code]);
          return;
        }
      }
    } catch (error) {
      
      ElMessage.error(error.msg || t("register.error.registerFailed"));
    }
  });
};

const gotoLogin = () => {
  router.push("/home/login");
};
</script>

<style lang="scss" scoped>
.register {
  position: relative;
  width: 100%;
  // height: 100vh;
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
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .control_body {
      .right_form {
        .register_title {
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

        .register_btn {
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background-color: #409eff;
          color: white;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 16px;

          &:hover {
            background-color: #66b1ff;
          }
        }
      }
    }

    .to_login {
      text-align: center;
      margin-top: 20px;
      color: #666;

      span {
        color: #409eff;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

:deep(.el-form-item__error) {
  position: static !important;
  white-space: normal !important;
  word-break: break-all;
  line-height: 1.5;
  font-size: 13px;
  max-width: 300px;
  color: #f56c6c;
}
</style>
