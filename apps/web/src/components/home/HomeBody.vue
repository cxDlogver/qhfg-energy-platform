<template>
  <div 
    class="full-page-container" 
    @wheel="handleWheel"
    :style="{transform: `translateY(-${currentPage * 100}vh)`}"
    >

    <section 
      class="page" 
      :style="{  zIndex: currentPage === 0 ? 10 : 1  }"
      >
      <div class="page-content page1">
        <h1> {{ $t("message.systemTitle") }}</h1>
      </div>
    </section>

    <section 
      class="page"
      :style="{  zIndex: currentPage === 1 ? 10 : 1 }"
      >
      <div class="page-content page2">
        <h1>  {{ $t("common.theme") }}</h1>
        <div class="news-cards">
          <div
            class="card"
            v-for="(item, index) in themeList"
            :key="item.themeID"
            :class="{ 'card-highlight': themeIndex === index }"
             
             @click="selectTheme(item, index)"
          >
          
          <!-- 独立图片标签 -->
          <img :src="item.backgroundImage" alt="theme image" class="card-img">
          <!-- 标题放在图片下方 -->
          <h3 class="card-title">{{ $t(item.label) }}</h3>
        </div>
        </div>
      </div>
    </section>

   <section 
    class="page"
    :style="{ zIndex: currentPage === 2 ? 10 : 1 }"
    >
    <div class="page-content page3">
            <h1>  {{ $t("common.related information") }}</h1>
      <div class="teams">
        <div class="team">
           <div class="info_item">
          <div class="title">
            <span></span>
            <span class="label">{{ $t("message.Home.friendshipLink") }}</span>
          </div>
          <a href="https://www.tsinghua.edu.cn/xxgk.htm">{{ $t("message.Home.friendshipLink1") }}</a>
          <a href="https://www.env.tsinghua.edu.cn/">{{ $t("message.Home.friendshipLink2") }}</a>
          <a href="https://www.icon.tsinghua.edu.cn/">{{ $t("message.Home.friendshipLink3") }}</a>
        </div>
        </div>
        <div class="team">
           <div class="info_item">
          <div class="title">
            <span></span>
            <span class="label">{{ $t("message.Home.contactUs") }}</span>
          </div>
          <span>{{ $t("message.Home.address") }}</span>
          <span>{{ $t("message.Home.post_code") }}</span>
          <span>{{ $t("message.Home.telephone") }}</span>
          <span>{{ $t("message.Home.fax") }}</span>
        </div>
        </div>
        <div class="team">
           <div class="follow_us">
          <div class="title">
            <span></span>
            <span class="label">{{ $t("message.Home.followUs") }}</span>
          </div>
          <div class="content">
            <div class="item">
              <img src="/static/img/环境学院公众号.png" alt="" />
              <span>{{ $t("message.Home.qr_code1") }}</span>
            </div>
            <div class="item">
              <img src="/static/img/碳中和研究院公众号.jpg" alt="" />
              <span>{{ $t("message.Home.qr_code2") }}</span>
            </div>
          </div>
        </div>
        </div>
      </div>
      <div class="bottom">
        <span class="copyright">Copyright ©2025 {{ $t("common.copyright") }}</span>
      </div>
      
    </div>
   </section>

   

  </div>

       <!-- 悬浮天气栏（添加拖拽和伸缩功能） -->
    <div 
      ref="weatherRef"
      class="weather_popup" 
      :class="{ 'collapsed': isCollapsed,'dragging': isDragging }"
      :style="{ left: `${position.x}px`, top: `${position.y}px` }"
      @mousedown="startDrag"
      @mousemove="dragging"
      @mouseup="endDrag"
      
      @dblclick="toggleCollapse"
      @selectstart.prevent="isDragging"
    >
     
      <div class="weather_time">
        <div class="date_time" v-if="!isCollapsed">
          <span>{{ dateTime.dayTime }}</span>
          <span>{{ dateTime.hourTime }}</span>
        </div>
        
        <div class="weather_info">
          <div v-if="userLocation && !isCollapsed" class="location_debug" style="font-size: 12px; color: #666;">
    {{ $t("weather.currentLocation") }}: {{ userLocation.latitude }}, {{ userLocation.longitude }}
  </div>
          <span class="weather-icon">{{ isLoading ? '⏳' : weatherData.icon }}</span>
          <div v-if="!isCollapsed">
          <span class="weather-text">{{ weatherData.text }}</span>
          <span class="weather-temp">{{ weatherData.temp }}°C</span>
          <span class="weather-extra" v-if="weatherData.wind">{{ weatherData.wind }}</span>
          <span class="weather-extra" v-if="weatherData.humidity">{{ weatherData.humidity }}</span>
        </div>
        </div>
      </div>
    </div>



  <!-- 右侧圆点导航 -->
    <div class="page-nav">
      <div 
        class="nav-dot" 
        v-for="index in 3" 
        :key="index"
        :class="{ active: currentPage === index-1 }"
        @click="currentPage = Math.min(Math.max(index-1, 0), 2)"
      ></div>
    </div>


 
</template>

<script setup>
import axios from "axios";
import {
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch
} from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import img1 from '@/assets/img/HomeBodyTheme1.jpg'; // 新增
import img2 from '@/assets/img/HomeBodyTheme2.jpg'; // 新增
import img3 from '@/assets/img/HomeBodyTheme3.jpg'; // 新增

const { t} = useI18n(); // 关键：获取翻译函数
const router = useRouter();
const { locale } = useI18n();
watch(locale, () => {
  weatherData.text = t(weatherStatusKey.value);
  // 如果湿度label也需要切换
  weatherData.humidity = `${t("weather.humidityLabel")}: ${weatherData.humidity?.split(":")[1] || ""}`;
});
const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
};

const currentPage = ref(0); 
const isScrolling = ref(false); // 滚动锁定标记
const wheelDebounce = debounce((deltaY) => {
  // 滚动锁定：一次滚动只处理一次
  if (isScrolling.value) return;
  isScrolling.value = true;

  // 判断滚动方向
  if (deltaY > 0) { // 向下滚动
    currentPage.value = Math.min(currentPage.value + 1, 2);
  } else { // 向上滚动
    currentPage.value = Math.max(currentPage.value - 1, 0);
  }

  // 1秒后解锁（可根据需求调整，确保一次滚动只触发一次）
  setTimeout(() => {
    isScrolling.value = false;
  }, 800);

   
}, 200); // 防抖延迟 200ms（短时间内滚动算一次）

const handleWheel = (e) => {
  e.preventDefault();
  wheelDebounce(e.deltaY);
};


// 主题列表


const themeList = reactive([
  {
    label: "message.Home.theme1",
    path: "/home/nav-page1",
    themeID: "theme1",
    backgroundImage: img1 
  },
  { 
    label: "message.Home.theme2", 
    path: "/home/nav-page2",
    themeID: "theme2",
    backgroundImage: img2 
  },
  { 
    label: "message.Home.theme3", 
    path: "/home/nav-page3",
    themeID: "theme3",
    backgroundImage: img3 
  }
]);

const themeIndex = ref(0);

const selectTheme = (item, index) => {
  themeIndex.value = index;
  router.push({
    path: item.path,
  });
};

let weatherInterval = null;

// 添加位置和天气加载状态
const isLoading = ref(false);
const userLocation = reactive({ latitude: null, longitude: null });
const defaultLocation = { latitude: 39.9042, longitude: 116.4074 }; // 默认北京坐标

// 获取用户地理位置
const getUserLocation = (forceRefresh = false) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      ElMessage.warning('您的浏览器不支持地理位置功能');
      return reject(new Error('Geolocation not supported'));
    }

    isLoading.value = true;
    if (forceRefresh) {
      localStorage.removeItem('userLocation');
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.latitude = position.coords.latitude;
        userLocation.longitude = position.coords.longitude;
        localStorage.setItem('userLocation', JSON.stringify(userLocation));
        isLoading.value = false;
        // 添加位置验证
        if (userLocation.latitude && userLocation.longitude) {
          resolve(userLocation);
        } else {
          reject(new Error('获取到无效的位置坐标'));
        }
      },
      (error) => {
        isLoading.value = false;
        // 增强错误信息
        let errorMsg = '无法获取位置信息';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = '用户拒绝了位置请求';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = '位置信息不可用';
            break;
          case error.TIMEOUT:
            errorMsg = '位置请求超时';
            break;
          case error.UNKNOWN_ERROR:
            errorMsg = '未知错误';
            break;
          case error.PERMISSION_DENIED:
            errorMsg = '用户拒绝了位置请求，请在浏览器设置中启用位置权限';
            break;
          case error.TIMEOUT:
            errorMsg = '位置请求超时，请尝试刷新页面或检查网络连接';
            break;

        }
        ElMessage.warning(`${errorMsg}，将使用默认位置`);
        console.error('获取位置失败:', error);
        // 使用默认位置或缓存位置
        const cachedLocation = localStorage.getItem('userLocation');
        if (cachedLocation) {
          resolve(JSON.parse(cachedLocation));
        } else {
          resolve(defaultLocation);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0 ,
        distanceFilter: 10 // 位置变化超过10米才更新
      }
    );
  });
};
// 当前时间
const dateTime = reactive({
  dayTime: "",
  hourTime: "",
});

// 天气数据
const weatherData = reactive({
  icon: "☀️",
  text: t("weather.sunny"),
  temp: 24,
  wind:"",
  humidity:""
});

// 根据天气代码获取对应图标
const getWeatherIcon = (iconCode) => {
  // 简化的天气图标映射，实际项目中可扩展
  const iconMap = {
    "100": "☀️", "101": "⛅", "102": "☁️", "103": "☁️",
    "104": "☁️", "200": "🌫️", "201": "🌫️", "202": "🌫️",
    "203": "🌫️", "204": "🌫️", "300": "🌧️", "301": "🌧️",
    "302": "⛈️", "303": "⛈️", "304": "🌧️", "305": "🌧️",
    "306": "🌧️", "307": "🌧️", "308": "🌧️", "309": "🌧️",
    "310": "🌨️", "311": "🌨️", "312": "🌨️", "313": "❄️",
    "400": "🌧️", "401": "🌧️", "402": "⛈️", "403": "🌨️",
    "404": "🌨️", "405": "🌧️", "406": "🌨️", "407": "🌨️",
     "900": "☀️", "901": "🌙"
  };
  return iconMap[iconCode] || "☀️";
};
const weatherRef = ref(null);
const isDragging = ref(false);
const isCollapsed = ref(false);
const position = reactive({
  x: 0,
  y: 70 // 默认在header下方
});
let startX = 0;
let startY = 0;

onMounted(() => {
  initTime();
   try {
    // 先获取位置，再获取天气
    getUserLocation(true).then(location => {
      fetchWeatherData(location);
      // 设置定时刷新（每1分钟）
      weatherInterval = setInterval(async () => {
        await fetchWeatherData(location);
      }, 1 * 60 * 1000);
    }).catch(error => {
      console.error('初始化天气失败:', error);
    });
  } catch (error) {
    console.error('初始化天气失败:', error);
  }

  // 从localStorage恢复位置和状态
  const savedPos = localStorage.getItem('weatherPosition');
  const savedCollapsed = localStorage.getItem('weatherCollapsed');
  if (savedPos) {
    const { x, y } = JSON.parse(savedPos);
    position.x = x;
    position.y = y;
  }
  if (savedCollapsed) {
    isCollapsed.value = JSON.parse(savedCollapsed);
  }
});

onUnmounted(() => {
  clearInterval(weatherInterval);
});

// 初始化时间
const initTime = () => {
  Date.prototype.Format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1, // 月份
      "d+": this.getDate(), // 日
      "h+": this.getHours(), // 小时
      "m+": this.getMinutes(), // 分
      "s+": this.getSeconds(), // 秒
      "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
      S: this.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  };
  setInterval(() => {
    dateTime.dayTime = new Date().Format("yyyy-MM-dd");
    dateTime.hourTime = new Date().Format("hh:mm:ss");
  }, 1000);
};
const weatherStatusKey = ref("weather.sunny");
const fetchWeatherData = async (location) => {
  if (!location || !location.latitude || !location.longitude) {
    console.error('无效的位置信息');
    return;
  }

 

  // 替换为您的真实API密钥
  //const API_KEY = "";
  const API_KEY = "";

  //const API_HOST = "";
  const API_HOST = "";
  // 添加时间戳参数防止缓存
  const timestamp = new Date().getTime();
  // 和风天气API (需要替换为真实密钥)
  const weatherApiUrl = `/api/weather?longitude=${location.longitude}&latitude=${location.latitude}&t=${timestamp}&lang=en`;

  isLoading.value = true;
  try {
    const response = await axios.get(weatherApiUrl, {
      timeout: 5000 // 设置5秒超时
    });
    const data = response.data;
    if (data.code === '200') {
      weatherData.icon = getWeatherIcon(data.now.icon);
        const weatherStatusMap = {
    "sunny": "weather.sunny",
    "cloudy": "weather.cloudy",
    "few clouds": "weather.few clouds",
    "partly cloudy": "weather.partly cloudy",
    "overcast": "weather.overcast",
    "shower rain": "weather.shower rain fill",
    "heavy shower rain": "weather.heavy shower rain",
    "thundershower": "weather.thundershower",
    "light rain": "weather.light rain",
    "moderate rain": "weather.moderate rain",
    "heavy rain": "weather.heavy rain",
    "extreme rain": "weather.extreme rain",
    "drizzle rain": "weather.drizzle rain",
    "storm": "weather.storm",
    "heavy storm": "weather.heavy storm",
    "severe storm": "weather.severe storm",
    "freezing rain": "weather.freezing rain",
    "light snow": "weather.light snow",
    "moderate snow": "weather.moderate snow",
    "heavy snow": "weather.heavy snow",
    "snowstorm": "weather.snowstorm",
    "sleet": "weather.sleet",
    "rain and snow": "weather.rain and snow",
    "shower snow": "weather.shower snow",
    "snow flurry": "weather.snow flurry",
    "hot": "weather.hot",
    "cold": "weather.cold"
  };
      // weatherData.text = data.now.text;
      const statusKey = weatherStatusMap[data.now.text.toLowerCase()] || "weather.unknown";
      weatherData.text = t(statusKey);
      weatherData.temp = data.now.temp;
      // 可以添加更多天气信息
      weatherData.wind = `${data.now.windDir} ${data.now.windScale}级`;
      weatherData.humidity = `${t("weather.humidityLabel")}: ${data.now.humidity}%`;
    } else {
      ElMessage.error(`获取天气失败: ${data.msg || '未知错误'}`);
    }
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      ElMessage.error('天气请求超时，请检查网络连接');
    } else {
    console.error('获取天气数据失败:', error);
    ElMessage.error('获取天气数据失败，请检查API密钥和网络连接');}
  } finally {
    isLoading.value = false;
  }
};

// 拖拽相关变量
let dragFrameId = null;
const dragThreshold = 0.5; // 最小拖拽阈值（像素）
let hasMoved = false;
// 拖拽开始
const startDrag = (e) => {
  //if (isCollapsed.value) return; // 折叠状态不可拖拽
  isDragging.value = true;
  startX = e.clientX - position.x;
  startY = e.clientY - position.y;
  hasMoved = false;
  weatherRef.value.style.cursor = 'grabbing';
  // 阻止默认行为和事件冒泡
  e.preventDefault();
  e.stopPropagation();
  // 添加全局事件监听（提高灵敏度）
  document.addEventListener('mousemove', dragging);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('mouseleave', endDrag);
};
// 添加可配置的边界限制常量
const DRAG_BOUNDS = { 
  minX: 0, 
  minY: 0, // 修改为0以允许移动到header下方
  maxX: window.innerWidth, 
  maxY: window.innerHeight 
};

// 拖拽中（使用requestAnimationFrame提高流畅度）
const dragging = (e) => {
  if (!isDragging.value) return;
  e.preventDefault();
  e.stopPropagation();
  
  const newX = e.clientX - startX;
  const newY = e.clientY - startY;
  
  // 检查是否超过最小拖拽阈值
  if (!hasMoved) {
    const dx = Math.abs(newX - position.x);
    const dy = Math.abs(newY - position.y);
    if (dx < dragThreshold && dy < dragThreshold) {
      return; // 未超过阈值，不更新位置
    }
    hasMoved = true;
  }
  
  // 使用requestAnimationFrame优化动画流畅度
  if (dragFrameId) cancelAnimationFrame(dragFrameId);
  dragFrameId = requestAnimationFrame(() => {
    position.x = newX;
    position.y = newY;
    // 边界限制
    // 边界限制 - 现在可以移动到header下方
    position.x = Math.max(DRAG_BOUNDS.minX, Math.min(position.x, DRAG_BOUNDS.maxX - weatherRef.value.offsetWidth));
    position.y = Math.max(DRAG_BOUNDS.minY, Math.min(position.y, DRAG_BOUNDS.maxY - weatherRef.value.offsetHeight));
  });
};

// 拖拽结束
const endDrag = () => {
  if (isDragging.value) {
    isDragging.value = false;
    weatherRef.value.style.cursor = 'grab';
    localStorage.setItem('weatherPosition', JSON.stringify({x: position.x, y: position.y}));
    // 清除全局事件监听
    document.removeEventListener('mousemove', dragging);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('mouseleave', endDrag);
    // 取消动画帧
    if (dragFrameId) cancelAnimationFrame(dragFrameId);
  }
};

// 切换折叠/展开状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem('weatherCollapsed', JSON.stringify(isCollapsed.value));
};



</script>

<style lang="scss" scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  overflow: hidden; // 关键：隐藏浏览器默认滚动条
  height: 100%; // 确保高度充满视口
  margin: 0; // 清除默认边距（避免意外溢出）
  padding: 0; // 清除默认内边距
}

/* 容器：全屏 + 隐藏滚动条 */
.full-page-container {
  height: 300vh;
  width: 100vw; // 占满屏幕宽度
  position: relative; // 作为.page的定位基准
  transition: transform 0.5s ease; // 页面切换动画
  overflow: hidden;
  margin: 0;
  padding: 0;
}

/* 单个页面：全屏 + 绝对定位 + 过渡动画 */
.page {
  height: 100vh;
  width: 100vw;
  position: relative;
  //position:absolute;
  top: 0;
  left: 0;
  //border: 3px solid #fff; /* 页面边框（区分页面） */
}

/* 页面内容容器：垂直居中 */
.page-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  //justify-content: center;
  justify-content: flex-start;
  align-items: center;
  padding-top: 10px; // 顶部留适当间距（替代冗余的margin-top）
  padding-bottom: 60px; // 底部留间距，避免贴边
  max-height: 100vh; // 限制内容容器最大高度为视口高度
  
  box-sizing: border-box;

  
}


.page1 {
  position:relative;
  //background: url('@/assets/bg1.jpg') center/cover no-repeat;
  background-color: #2c3e50;
  color: white;
  //text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  text-align: center;
  justify-content: flex-start; /* 内容靠上 */
  padding-top: 100px; /* 配合靠上布局，增加顶部间距 */
 
  background-image: url('@/assets/img/background.gif'); /* 图片路径 */
  background-size: cover; /* 图片拉伸/压缩至填满容器，保持比例 */
  background-position: center; /* 图片居中显示 */
  background-repeat: no-repeat; /* 禁止重复平铺 */
  animation: bgScale 20s ease-in-out infinite; /* 背景图缓慢缩放 */


   /* 渐变蒙版：通过伪元素实现 */
  &::before {
    content: '';
    position: absolute; /* 相对于.page1定位 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* 渐变效果：可根据需求调整方向和透明度 */
    /* 示例：从上到下，从浅黑（透明）到深黑（半透明） */
    background: linear-gradient(
      to bottom,
        rgba(0, 0, 0, 0.2) 0%,  /* 顶部透明度低 */
       rgba(0, 0, 0, 0.5) 100% /* 底部透明度高 */

    );
    z-index: 1; /* 蒙版层级：在背景图之上，标题之下 */
  }

  h1{
    // font-size: 2.5rem;
    // line-height: 1.5;
    // max-width: 80%;
    // text-shadow: 0 2px 4px rgba(0,0,0,0.5); /* 文字添加阴影，增强与背景的对比度 */

    //  color: #050000;
    font-size: 3rem; /* 增大字体 */
    line-height: 1.6; /* 行高 */
    max-width: 80%; /* 限制最大宽度，避免过宽 */
    margin: 0 auto; /* 水平居中 */
    padding-top: 150px; /* 调整垂直位置（替代原padding-top） */
    color: #ffffff; /* 白色字体，与蒙版对比 */
    text-shadow:
      0 3px 6px rgba(0, 0, 0, 0.8),  /* 深色阴影增强可读性 */
      0 0 15px rgba(255, 255, 255, 0.2); /* 轻微白光边缘，提升通透感 */
    z-index: 2; /* 标题层级：在蒙版之上 */
    position: relative; /* 确保z-index生效 */
    
        /* 标题底部添加渐变投影条 */
    &::after {
      content: '';
      display: block;
      width: 60%;
      height: 3px;
      margin: 20px auto 0;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.8) 50%, 
        transparent 100%
      );
    }


  }

/* 背景图缩放动画 */
@keyframes bgScale {
  0%, 100% {
    background-size: 100% 100%; /* 原始大小 */
  }
  50% {
    background-size: 105% 105%; /* 轻微放大 */
  }
}
  

}
.page2 {
  background-color: #ffffff;
  position:relative;
  z-index:1;

  h1{
    font-size: 2.5rem;
    margin: 0 0 30px 0; // 仅保留底部间距，删除顶部冗余margin
    text-align: center; // 确保标题居中
    //color: #007bff;
    color: #3498db;
    margin-top: 7%; 
  }
  .news-cards{
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%; /* 确保容器占满页面宽度 */
    margin-top: 20px;
    max-height: calc(100vh - 200px); // 最大高度 = 视口高度 - 标题和上下padding的总高度
    overflow-y: auto; // 当卡片过多时，允许内部滚动（避免整体溢出）
    padding: 10px 0; 
  }
  .card{
    //width: 300px;
    flex: 1 1 calc(33.333% - 60px); /* 一行最多3个卡片（33.333%），减去左右gap的一半（30px*2） */
    min-width: 280px; /* 最小宽度，避免窄屏时卡片过窄 */
    max-width: 400px; /* 最大宽度，避免宽屏时卡片过大 */
    height: 300; /* 高度自动，由内容撑开（图片200px + 标题高度） */
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    overflow: hidden;
    //background: white;
    background-color: transparent; /* 透明背景，避免覆盖图片 */
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    &:hover {
      transform: translateY(-20px); /* 轻微上浮 */
      box-shadow: 0 8px 16px rgba(0,0,0,0.15); /* 加深阴影 */
    }

     /* 新增：背景图设置 */
    background-size: cover;       // 覆盖整个卡片
    background-position: center;  // 居中显示
    background-repeat: no-repeat; // 不重复
    .card-img{
      width: 100%;
      height: 220px;
      object-fit: cover;
      border-radius: 8px 8px 0 0;
      margin-bottom: 15px; /* 增加图片与标题的间距（数值可调整） */
    }
    .card-title{
      padding: 10px;
      background-color: #56b4fc;
      width: 100%;
      margin: 0;
      font-size: 1.2rem;
      color: #000;
      
    }

  }
}
.page2::before{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/img/HomeBodyTheme.jpg'); /* 你的背景图片路径 */
  background-size: cover;
  background-position: center;
  opacity: 0.5; /* 在此调整背景图片的透明度，0为完全透明，1为完全不透明 */
  z-index: -1; /* 将背景层置于内容之下 */
}
.page3 {
  background-color: #5db1e9;
    h1{
    font-size: 2.5rem;
    margin: 0 0 30px 0; // 仅保留底部间距，删除顶部冗余margin
    text-align: center; // 确保标题居中
    //color: #007bff;
    color: #ffffff;
    margin-top: auto; 
  }
  .page-content{
    justify-content: flex-start;
    padding: 60px 40px;
    max-height: 100vh;
    width: 100%;
    overflow-y:auto;
  }
  h2{
    font-size: 2.2rem;
    margin: 20px 0 50px 0;
    text-align: center;
    text-shadow: 0 1px 3px rgba(0,0,0,0.2);
    color: #f6f8fa;
  }
  .teams{
    display: flex;
    gap: 30px;
    flex-wrap:wrap ;
    justify-content: center;
    width: 100%;
    max-width: 1200px;
    margin-bottom: 20px;
  }
  .team{
    flex:1 1 calc(33.333% - 40px);
    min-width:280px;
    max-width:350px;

    background: rgb(235, 245, 246);
    border-radius: 10px;
    padding: 30px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: #2c3e50;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    color: #3498db;

    span:first-child {
      width: 4px;
      height: 20px;
      background-color: #3498db;
      margin-right: 10px;
    }

    .label {
      font-size: 1.3rem;
      font-weight: bold;
    }
  }

  .info_item {
    display: flex;
    flex-direction: column;
    gap: 15px;

    a, span {
      color: #555;
      font-size: 1rem;
      text-decoration: none;

      &:hover {
        color: #3498db;
      }
    }
  }

  .follow_us .content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .follow_us .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .follow_us img {
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .follow_us span {
    color: #555;
    font-size: 0.95rem;
    text-align: center;
  }

  .bottom {
    width: 100%;
    text-align: center;
    margin-top: auto;
    padding-bottom: 40px;

  }

  .copyright {
    color: #fff;
    font-size: 0.9rem;
    opacity: 0.9;
  }
}
/* 右侧导航点样式（关键：放在container外面，避免被overflow隐藏） */
.page-nav {
  position:fixed; /* 固定在右侧，不随页面滚动 */
  right: 30px;
  top: 50%;
  transform: translateY(-50%); /* 垂直居中 */
  display: flex;
  flex-direction: column;
  gap: 15px; /* 圆点之间的间距 */
  z-index: 100; /* 确保在所有页面上方显示 */
}

.nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%; /* 圆形 */
  background-color: rgba(9, 169, 233, 0.5); /* 未激活状态：半透明白色 */
  cursor: pointer;
  transition: all 0.3s ease; /* 点击/切换时的动画 */
  border: 2px solid transparent;
}

/* 激活状态的圆点（当前页面） */
.nav-dot.active {
  background-color: white; /* 白色填充 */
  transform: scale(1.3); /* 轻微放大 */
  border-color: #3498db; /* 蓝色边框高亮 */
}


  // 悬浮天气栏样式
  .weather_popup {
    position: absolute;
    z-index: 999; // 确保悬浮在内容上方但在header下方
    width: auto; // 自适应内容宽度
    padding: 10px 20px;
    background-color: rgba(255, 255, 255, 0.95); // 半透明背景
    border-radius:8px; 
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); // 添加阴影增强悬浮感
    border: 1px solid #eee;
    cursor: grab; // 初始光标
    transition: all 0.3s ease; // 添加过渡效果
    user-select: none; // 禁止文本选择
    -webkit-user-select: none; // Safari
    -moz-user-select: none; // Firefox
    -ms-user-select: none; // IE/Edge

    // 折叠状态样式
    &.collapsed {
      width: 40px;
      height: 40px;
      padding: 5px;
      border-radius: 50%; // 圆形
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
     &.dragging {
      // 拖拽中增强视觉反馈
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      transform: scale(1.02);
    }

  }
  // 添加加载状态样式
.weather_popup.loading {
  opacity: 0.8;
  cursor: wait;
}

.weather-extra {
  font-size: 12px;
  margin-left: 8px;
  color: #666;
}
.weather-text {
  margin-right: 10px; 
}
.weather_time {
  .date_time {
    span {
      margin-right: 10px; // 给“日期”span 右侧添加 10px 间距（可根据需求调整数值）
    }
  }
}
</style>
