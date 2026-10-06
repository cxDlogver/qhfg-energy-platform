import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";


import { ElMessage } from "element-plus";
import { i18n } from "@/config/i18n.js";





const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/home",
      name: "root",
      component: () => import("@/views/HomeView.vue"),
      meta: {
        title: "首页",
        keepAlive: false,
      },
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/components/home/HomeBody.vue"),
          meta: { title: "主页", keepAlive: false },
        },
        {
          path: "login",
          name: "login",
          component: () => import("@/views/Login.vue"),
          meta: { title: "登录页面", keepAlive: false },
        },
        {
          path: "register",
          name: "register",
          component: () => import("@/views/Register.vue"),
          meta: { title: "注册页面", keepAlive: false },
        },
        {
          path: "about",
          name: "about",
          component: () => import("@/views/AboutView.vue"),
          meta: { title: "关于我们", keepAlive: false },
        },
        {
          path: "dataService",
          name: "dataService",
          component: () => import("@/components/dataService/DataService.vue"),
          meta: {
            title: "数据服务",
            keepAlive: true,
            requiresAuth: true, // 添加登录权限要求
          },
        },
        {
          path:"nav-page1",
          name: "theme1-directory",
          component:()=>import("@/components/home/nav-page1.vue"),

          props: (route) => ({ themeID: 'theme1' }),
          
        },
        {
          path:"/home/nav-page1/paper1",
          name:"paper1-1",
          component:()=>import("@/components/home/theme1/paper1.vue")

        },
        {
          path:"/home/nav-page1/paper2",
          name:"paper1-2",
          component:()=>import("@/components/home/theme1/paper2.vue")

        },
        {
          path:"/home/nav-page1/paper3",
          name:"paper1-3",
          component:()=>import("@/components/home/theme1/paper3.vue")

        },
        {
          path:"nav-page2",
          name: "theme2-directory",
          component:()=>import("@/components/home/nav-page2.vue"),

          props: (route) => ({ themeID: 'theme2' }),
          
          
        },
        {
          path:"/home/nav-page2/paper1",
          name:"paper2-1",
          component:()=>import("@/components/home/theme2/paper1.vue")

        },
        {
          path:"/home/nav-page2/paper2",
          name:"paper2-2",
          component:()=>import("@/components/home/theme2/paper2.vue")

        },
        {
          path:"/home/nav-page2/paper3",
          name:"paper2-3",
          component:()=>import("@/components/home/theme2/paper3.vue")

        },
        {
          path:"/home/nav-page2/paper4",
          name:"paper2-4",
          component:()=>import("@/components/home/theme2/paper4.vue")

        },
        {
          path:"nav-page3",
          name: "theme3-directory",
          component:()=>import("@/components/home/nav-page3.vue"),

          props: (route) => ({ themeID: 'theme3' }),
          
        },
         {
          path:"/home/nav-page3/paper1",
          name:"paper3-1",
          component:()=>import("@/components/home/theme3/paper1.vue")

        },
        {
          path:"/home/nav-page3/paper2",
          name:"paper3-2",
          component:()=>import("@/components/home/theme3/paper2.vue")

        },
        {
          path:"/home/nav-page3/paper3",
          name:"paper3-3",
          component:()=>import("@/components/home/theme3/paper3.vue")

        },
       
      ],
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () => import("@/views/ForgotPassword.vue"),
      meta: { title: "重置密码", keepAlive: false }
    },
    {
      path: "/",
      redirect: "/home",
    },
  ],
});

// 修改路由守卫逻辑
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("leiyangUser");

  // 需要登录但未登录的情况
  if (to.meta.requiresAuth && !isAuthenticated) {
    ElMessage.error(i18n.global.t("message.auth.loginRequired"));

    next("/home/login");
    return;
  }

  // 已登录用户访问登录/注册页面时重定向到首页
  if (
    (to.path === "/home/login" || to.path === "/home/register") &&
    isAuthenticated
  ) {
    next("/home");
    return;
  }

  // 其他情况正常放行
  next();
});

export default router;
