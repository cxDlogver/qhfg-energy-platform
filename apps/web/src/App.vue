<template>
  <router-view></router-view>
  <!-- 路由缓存 -->
  <!-- <router-view v-slot="{ Component }">
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
  </router-view> -->
</template>

<script setup>
// import { onMounted, onUnmounted } from 'vue';

// function setSessionAlive() {
//   sessionStorage.setItem('isAlive', '1');
// }

// function clearSessionAlive() {
//   sessionStorage.removeItem('isAlive');
// }

// function clearLocalData() {
//   localStorage.removeItem('dataServiceResults_en');
//   localStorage.removeItem('dataServiceResults_zh');
//   localStorage.removeItem('leiyangUser');
// }

// function handleVisibilityChange() {
//   // 当页面变为隐藏时（即将关闭/切换标签/刷新）
//   if (document.visibilityState === 'hidden') {
//     // 如果 sessionStorage 标记不存在，说明是最后一个标签页被关闭
//     if (!sessionStorage.getItem('isAlive')) {
//       clearLocalData();
//     }
//   }
// }

// function handleBeforeUnload() {
//   // 在页面关闭前清除数据
//   clearSessionAlive();  // 清除 sessionStorage 标记
//   clearLocalData();     // 清除 localStorage 数据
// }

// onMounted(() => {
//   setSessionAlive();
//   document.addEventListener('visibilitychange', handleVisibilityChange);
//   // 监听页面关闭或刷新前
//   window.addEventListener('beforeunload', handleBeforeUnload);
// });

// onUnmounted(() => {
//   document.removeEventListener('visibilitychange', handleVisibilityChange);
//   window.removeEventListener('beforeunload', handleBeforeUnload);
// });
</script>

<style lang="scss" scoped>

</style>
