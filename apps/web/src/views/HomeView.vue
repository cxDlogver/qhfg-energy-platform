<template>
  <div class="home_view">
    <!-- 头部 -->
    <header class="header gray-text">
      <div class="system_title">
        {{ $t("message.systemTitleinShort") }}
      </div>

      <div class="system_menu">
        <div
          v-for="(item, index) in menus"
          :key="index"
          :to="'/' + item.value"
          :class="[
            'menu_item',
            currentMenu == item.value ? 'menu_item_active' : '',
          ]"
          @click="changeMenu(item.value)"
        >
          <span :class="['icon', 'iconfont', item.icon]"></span>
          <span>{{ $t(`message.${item.value}`) }}</span>
        </div>

        <el-dropdown placement="bottom-end">
          <div class="menu_item">
            <span class="icon iconfont icon-duoyuyan"></span>
            <span>{{ $t("message.language") }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in languageList"
                :key="item.code"
                @click="(event) => changeLanguage(item.code, event)"
                >{{ item.name }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="user_info">
        <template v-if="isLoggedIn">
          <el-dropdown @command="handleCommand">
            <div class="user-dropdown">
              <img src="/static/img/user.png" alt="" />
              <div class="user_name">{{ username }}</div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">{{
                  $t("message.Home.logout")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <div class="login-link" @click="goToLogin">
            {{ $t("message.Home.login") }}
          </div>
        </template>
      </div>
    </header>

    <!-- 路由切换 容器 -->
    <main class="view_container">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component
            :is="Component"
            :key="$route.name"
            v-if="$route.meta.keepAlive"
          />
        </keep-alive>
        <component
          :is="Component"
          :key="$route.name"
          v-if="!$route.meta.keepAlive"
        />
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import bus from "@/utils/bus";
import { initializeSourceDefaults } from "@/utils/sourceDefaults";
import { useI18n } from "vue-i18n";
import languageList from "@/assets/json/locales/config.json";
import { useRouter } from "vue-router";
const route = useRoute();

const { t, locale } = useI18n();
// 获取store 实例
const router = useRouter();
const menuCache = localStorage.getItem("currentSystemMenu");
const currentMenu = ref(menuCache || "home");
const menus = [
  {
    label: "主页",
    value: "home",
    icon: "icon-zhuye",
  },
  {
    label: "关于我们",
    value: "about",
    icon: "icon-guanyuwomen",
  },
  {
    label: "数据服务",
    value: "dataService",
    icon: "icon-shuju",
  },
];
// 监听路由变化，自动同步 currentMenu
watch(
  () => route.name,
  (newName) => {
    // 只同步已定义的菜单
    if (menus.some((item) => item.value === newName)) {
      currentMenu.value = newName;
      localStorage.setItem("currentSystemMenu", newName);
    }
  },
  { immediate: true }
);
// 切换菜单
const changeMenu = async (value) => {
  if (value === "language") {
    return;
  }
  if (value === "dataService") {
    try { await initializeSourceDefaults(locale.value); } catch (_) {}
    // 判断并写入默认数据
    let lang = locale.value; //获取当前语言
    let key =
      lang === "zh" || lang === "chinese"
        ? "dataServiceResults_zh"
        : "dataServiceResults_en"; //兼容常见写法
    if (!localStorage.getItem(key)) {
      // 这里的内容要和英文/中文一致，内容可根据语言切换
      const defaultObj =
        key === "dataServiceResults_zh"
          ? {
              filterResultList: ["陆上风电 容量因子(2.5MW,10km,2021)"],
              selectedResults: [true],
              timeResult: ["2021"],
              mapPathUrlList: [
                "发电侧/风力发电/低空风电/陆上风电/潜力数据/2.5MW/容量因子/10km/年",
              ],
              dataUnlitList: [""],
              dataTypeThreeList: ["容量因子"],
            }
          : {
              filterResultList: [
                "Onshore Wind Power Capacity Factor (2.5MW,10km,2021)",
              ],
              selectedResults: [true],
              timeResult: ["2021"],
              mapPathUrlList: [
                "发电侧/风力发电/低空风电/陆上风电/潜力数据/2.5MW/容量因子/10km/年",
              ],
              dataUnlitList: [""],
              dataTypeThreeList: ["Capacity Factor"],
            };
      localStorage.setItem(key, JSON.stringify(defaultObj));
    }
    // 通知数据服务页面刷新本地数据
    bus.emit("restoreDataServiceLocalData");
  }
  router.push({ name: value });
  currentMenu.value = value;
  document.title =
    "全球清洁能源智慧图谱决策系统 (GCE-IADS)" +
    menus.find((item) => item.value == value).label;
  localStorage.setItem("currentSystemMenu", value);
};

// 切换语言
const changeLanguage = async (code, event) => {
  locale.value = code;
  localStorage.setItem("language", code); // 修改存储的key名为更通用的"language"
  // 方案二：切换语言时自动写入对应语言的默认数据
  if (code === "zh" || code === "chinese") {
    localStorage.setItem(
      "dataServiceResults_zh",
      JSON.stringify({
        filterResultList: ["陆上风电 容量因子(2.5MW,10km,2021)"],
        selectedResults: [true],
        timeResult: ["2021"],
        mapPathUrlList: [
          "发电侧/风力发电/低空风电/陆上风电/潜力数据/2.5MW/容量因子/10km/年",
        ],
        dataUnlitList: [""],
        dataTypeThreeList: ["容量因子"],
      })
    );
  } else {
    localStorage.setItem(
      "dataServiceResults_en",
      JSON.stringify({
        filterResultList: [
          "Onshore Wind Power Capacity Factor (2.5MW,10km,2021)",
        ],
        selectedResults: [true],
        timeResult: ["2021"],
        mapPathUrlList: [
          "发电侧/风力发电/低空风电/陆上风电/潜力数据/2.5MW/容量因子/10km/年",
        ],
        dataUnlitList: [""],
        dataTypeThreeList: ["Capacity Factor"],
      })
    );
  }
  // 阻止事件冒泡，防止触发路由导航
  event?.stopPropagation();
  try { await initializeSourceDefaults(code, true); } catch (_) {}
  bus.emit("changeLanguage", code);
};

// 公共控件
const isShowCommonControl = ref(false);
const isLoggedIn = ref(false);
const username = ref("");

// 检查登录状态
const checkLoginStatus = () => {
  const userInfo = localStorage.getItem("leiyangUser");
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo);
      isLoggedIn.value = true;
      username.value = user.username;
    } catch (e) {
      isLoggedIn.value = false;
      username.value = "";
    }
  } else {
    isLoggedIn.value = false;
    username.value = "";
  }
};

// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === "logout") {
    // 清除登录信息
    localStorage.removeItem("leiyangUser");
    // localStorage.removeItem('dataServiceResults_en');
    // localStorage.removeItem('dataServiceResults_zh');
    localStorage.clear();
    isLoggedIn.value = false;
    username.value = "";
    // 发送事件，通知DataService清空页面变量
    bus.emit("clearDataServiceResult");
    ElMessage.success("退出成功");
    router.push("/home");
  }
};

// 跳转到登录页
const goToLogin = () => {
  router.push({
    path: "/home/login",
  });
};

onMounted(() => {
  const savedLocale = localStorage.getItem("language") || "chinese";
  locale.value = savedLocale; // 使用locale而不是t
  // 添加登录状态变化的事件监听
  window.addEventListener("loginStatusChanged", checkLoginStatus);
  checkLoginStatus();
});
onUnmounted(() => {
  window.removeEventListener("loginStatusChanged", checkLoginStatus);
});
</script>

<style lang="scss" scoped>
.home_view {
  position: relative; // 添加相对定位，作为悬浮元素的定位容器
  width: 100%;
  height: 100%;

  header {
    position: fixed; // 添加固定定位
    top: 0; // 固定在顶部
    left: 0; // 固定在左侧
    z-index: 1000; // 确保header在其他内容之上
    width: 100%;
    height: 70px;
    padding: 0px 30px 0px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #0070c0;
    background-color: #fff;
    border-bottom: 1px solid #ccc;

    .system_title {
      height: 100%;
      padding: 0 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      text-emphasis: none;
      // font-family: "YouSheBiaoTiHei";
      background: #4ba0fd;
      color: #fff;
      font-size: 20px;
      letter-spacing: 2px;
    }

    .system_menu {
      margin-left: auto;
      // flex: 1;
      height: 100%;
      padding: 0 50px;
      display: flex;
      align-items: center;
      gap: 20px;
      .menu_item {
        // width: 100px;
        height: 30px;
        padding: 0 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        // color: #181818;
        color: black;
        font-size: 17px;
        font-weight: 540;
        cursor: pointer;

        &:hover {
          color: #3772ff;
          border: none !important;
        }
      }

      .menu_item_active {
        font-weight: 600;
        color: #3772ff;
        border: none !important;
      }
    }
    .date_time {
      width: 190px;
      margin: 0 20px 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 25px;
      font-family: "液晶数字字体";
      color: #6f6f6f;
    }

    .user_info {
      height: 40px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 6px;

      .user-dropdown {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .user_name {
          font-size: 17px;
          color: black;
        }
      }

      .login-link {
        color: #409eff;
        cursor: pointer;
        font-size: 16px;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .view_container {
    position: relative;
    width: 100%;
    height: calc(100% - 70px);
    background-color: #ffffff;
    margin-top: 70px; // 添加上边距，防止内容被header遮挡
  }
}
</style>
