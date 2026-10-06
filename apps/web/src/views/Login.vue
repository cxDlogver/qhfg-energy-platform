<template>
  <div class="login">
    <div class="module_control">
      <div class="control_header">
        <span>{{ $t("message.systemTitle") }}</span>
      </div>
      <div class="control_body">
        <div class="right_form">
          <div class="login_title">
            —— <span class="title_label">{{ $t("login.loginPage") }}</span> ——
          </div>
          <el-form :model="form" label-width="auto" style="max-width: 600px">
            <el-form-item :label="$t('login.userName')">
              <el-input
                v-model="form.username"
                :placeholder="$t('login.userNamePlaceholder')"
                autocomplete="off"
                name="username"
              />
            </el-form-item>
            <el-form-item :label="$t('login.password')">
              <el-input
                v-model="form.password"
                type="password"
                :placeholder="$t('login.passwordPlaceholder')"
                show-password
                autocomplete="current-password"
                name="password"
              />
            </el-form-item>
          </el-form>
          <div class="login_btn" @click="login">{{ $t("login.login") }}</div>
        </div>
      </div>
      <div class="to_register">
        {{ $t("login.noAccount") }}
        <span @click="gotoRegister">{{ $t("login.register") }} →</span>
      </div>
      <div class="footer-center">
        <el-link type="primary" @click="$router.push('/forgot-password')">{{
          $t("login.forgotPassword")
        }}</el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { loginInterface } from "@/request";
import { useI18n } from "vue-i18n"; // 添加这行

const router = useRouter();
const { t } = useI18n(); // 添加这行
const form = reactive({
  username: "",
  password: "",
});

// 登录
const login = async () => {
  const { username, password } = form;
  if (!username || !password) {
    ElMessage.warning(t("login.userNameAndPasswordRequired"));
    return;
  }

  try {
    const res = await loginInterface(username, password);
    
    if (res.code === 200) {
      localStorage.setItem(
        "leiyangUser",
        JSON.stringify({
          username: username,
          token: res.data.token,
        })
      );
      window.dispatchEvent(new Event("loginStatusChanged"));
      ElMessage.success(t("login.loginSuccess"));
      router.push("/home");
      localStorage.setItem("currentSystemMenu", "home");
    } else {
      ElMessage.error(res.message || t("login.loginFailed"));
    }
  } catch (err) {
    ElMessage.error(t("login.unauthorized"));
  }
};

const gotoRegister = () => {
  router.push({
    name: "register",
  });
};

// onMounted(() => {
//   // 添加 meta 标签
//   const meta = document.createElement("meta");
//   meta.name = "google";
//   meta.content = "notranslate";
//   document.head.appendChild(meta);
// });
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  width: 100%;
  // height: 100vh;
  height: calc(100vh - 70px);
  background-image: url("@/assets/img/login.png");
  background-size: cover;
  background-position: center;
  display: flex; // 添加 flex 布局
  justify-content: center; // 水平居中
  align-items: center; // 垂直居中

  .module_control {
    width: 570px;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    padding: 30px;

    .control_header {
      display: flex;
      justify-content: center; // 水平居中
      align-items: center; // 垂直居中
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 30px;
    }

    .control_body {
      .right_form {
        .login_title {
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

        .login_btn {
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

    .to_register {
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
.footer-center {
  margin-top: 10px;
  text-align: center;
  width: 100%;
}
</style>
