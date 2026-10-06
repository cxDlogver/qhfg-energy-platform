<template>
  <div class="lay" >
      <div id="bg_topic" class="img-topic">
        <div class="container">
          <div class="row">
            <div class="content-column">

              <article>
                <div class="panel-topic">
                  <div class="panel-body">
                    <nav class="breadcrumb">
                      <router-link to="/home">{{ navpage.home }}</router-link>
                    </nav>
                    <h1 class="theme1-title" style="color: azure;">{{ navpage.theme1title }}</h1>
                  </div>
                </div>
                
              </article>
            </div>
          </div>
        </div>
      </div>
      

  <main class="main">
    <div class="container">
      <div class="main-content">
        <div>
        </div>
        <div class="view-container">
          <div class="back-btn">
              <el-button 
                type="primary" 
                @click="goBack"
                size="small"
            >
              {{ $t("common.back1") }}
            </el-button>
          </div>
          <div>
            <p>{{navpage.list}}</p>
          </div>
          
          <div class="article-list">
            <article class="article-item">
              <figure class="art-list-img">
                  <a class="img-ratio-169" href="/#/home/nav-page1/paper1">
                    <img loading="lazy" src="@/assets/img/theme1-1-1.png" width="300" height="160" alt="pic-4">
                  </a>
                </figure>
              <div class="article-list-content">
                <h2 class="article-list-title">
                  <router-link to="/home/nav-page1/paper1" class="art-title">{{navpage.arttitle1}}</router-link>
                </h2>
                <p class="article-list-summary" >
                  {{ navpage.artListSummary1 }}
                </p>
              </div>
            </article>

            <article class="article-item">
              <figure class="art-list-img">
                  <a class="img-ratio-169" href="/#/home/nav-page1/paper2">
                    <img loading="lazy" src="@/assets/img/theme1-3-2.png" width="300" height="160" alt="pic-4">
                  </a>
                </figure>
              <div class="article-list-content">
                <h2 class="article-list-title">
                  <router-link to="/home/nav-page1/paper2" class="art-title">{{navpage.arttitle2}}</router-link>
                </h2>
                <p class="article-list-summary" >
                 {{ navpage.artListSummary2 }}
                </p>
              </div>
            </article>

            <article class="article-item">
              <figure class="art-list-img">
                  <a class="img-ratio-169" href="/#/home/nav-page1/paper3">
                    <img loading="lazy" src="@/assets/img/theme1-4-2.png" width="300" height="160" alt="pic-4">
                  </a>
                </figure>
              <div class="article-list-content">
                <h2 class="article-list-title">
                 <router-link to="/home/nav-page1/paper3" class="art-title">{{navpage.arttitle3}}</router-link>
                </h2>
                <p class="article-list-summary" >
                  {{ navpage.artListSummary3 }}
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </main>
<footer class="page3-footer">
  <div class="teams">
    <!-- 友情链接 -->
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

    <!-- 联系我们 -->
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

    <!-- 关注我们 -->
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

  <!-- 版权信息 -->
  <div class="bottom">
    <span class="copyright">Copyright ©2024 {{ $t("common.copyright") }}</span>
  </div>
</footer>
  </div>
  
</template>

<script setup>

import { useRouter } from 'vue-router';

const router = useRouter(); // 初始化路由实例

// 定义返回方法：跳转到nav-page1
const goBack = () => {
  router.push('/home/');
};

import { useI18n } from "vue-i18n";
import { computed } from "vue";
const { locale } = useI18n();
const navpage = computed(()=>{
  if (locale.value === "chinese") {
    return {
    theme1title:"可再生能源资源利用现状与潜力洞察",
    arttitle1:"屋顶光伏的动态气候价值与潜力",
    arttitle2:"我国太阳能发电平价路径与并网潜力",
    arttitle3:"我国陆上风电跨区域联合并网及开发优化布局",
    list:"文章列表",
    home:"主页 / " ,
    topic:"主题 / ",
    artListSummary1:"近日，清华大学碳中和研究院院长助理、环境学院教授鲁玺课题组与美国密西根大学Michael T. Craig助理教授团队联合，在揭示屋顶光伏的动态气候价值与潜力实现方面取得新成果。该研究基于未来多维气候模式的气候变化路径结果，量化了气候变化对居民屋顶的光伏发电潜力与用能行为的双重影响，揭示了气候变化提升居民屋顶光伏使用价值并促进屋顶光伏投资的影响机制。该研究首次量化了气候变化对可再生能源应用价值的影响，对面向中长期的屋顶光伏开发布局与规划具有关键科学指导意义。",
    artListSummary2:"近日，清华大学环境学院、碳中和研究院、哈佛大学等国内外联合团队在碳中和背景下我国太阳能光伏发电平价动态与并网潜力研究方面取得新进展，系统动态评估了我国技术可行、经济平价、电网兼容的光伏发电潜力，揭示了光伏成本优势下“光伏+储能”的广阔应用前景。该研究成果可为碳中和背景下的光伏发电资源开发、新型电力系统规划提供参考，对于光伏发电与终端用能“电气化”与储能技术融合，促进工业、建筑、交通等领域的脱碳具有启示意义。",
    artListSummary3:"近日，清华大学环境学院鲁玺课题组在国际能源领域著名期刊《应用能源》（Applied Energy）发表题为《基于聚类分析的中国陆上风电开发优化布局研究》（Optimal allocation of onshore wind power in China based on cluster analysis）的研究论文。研究基于聚类分析方法首次对中国大陆风电资源的变动特性进行分区，并从风电时空变化特性的新视角探讨了风电资源规划开发策略，对碳中和目标下的风电等可再生能源的持续开发利用具有借鉴意义。"
}
}
  else{
    return {
      theme1title:" Current Status and Potential Insights of Renewable Energy Resource Utilization",
      arttitle1:"Dynamic Climate Value and Potential Realization of Rooftop Photovoltaics",
      arttitle2:"China's Solar Power Grid Parity Pathway and Grid Integration Potential",
      arttitle3:"Joint Inter-Regional Wind Power Grid and Deployment Optimization in China",
      list:"List of Articles",
      home:"Home / ",
      topic:"Topic / ",
      artListSummary1:"Recently, the research team led by Prof. Xi Lu from the Institute for Carbon Neutrality and the School of Environment, Tsinghua University, in collaboration with Assistant Professor Michael T. Craig’s team from the University of Michigan, has made new progress in revealing the dynamic climate value and potential realization of rooftop photovoltaics. Based on the results of future multidimensional climate models, this study quantifies the dual impact of climate change on the photovoltaic generation potential on residential rooftops and energy consumption behavior, revealing the mechanism through which climate change enhances the value of residential rooftop photovoltaics and promotes investment in rooftop photovoltaics. This study quantifies for the first time the impact of climate change on the value of renewable energy applications, providing key scientific guidance for the medium to long-term development and planning of rooftop photovoltaics.",
      artListSummary2:"Recently, a joint research team from Tsinghua University's School of Environment, Carbon Neutrality Institute, Harvard University, and other domestic and international institutions made new progress in studying the dynamic grid parity and grid integration potential of solar photovoltaic (PV) power generation in China under the carbon neutrality framework. The study systematically and dynamically evaluates the technically feasible, economically competitive, and grid-compatible potential of PV power generation in China, revealing the broad application prospects of \"PV + storage\" under the cost advantage of PV. The research findings can serve as a reference for PV resource development and new power system planning in the context of carbon neutrality, offering insights into the integration of PV power generation with end-use electrification and energy storage technologies to promote decarbonization in industries, buildings, transportation, and other sectors.",
      artListSummary3:"SOE, Tsinghua, January 27th, 2021. Recently, Xi Lu, from SOE, Tsinghua, and his research group published a paper titled Optimal allocation of onshore wind power in China based on cluster analysis on Applied Energy, a leading international journal in the field of energy. The study is the first to apply cluster analysis to identify the variability characteristics of wind power in the Chinese mainland. It also discusses the planning and development strategies of wind power from a novel perspective of the spatial and temporal variability characteristics of resources, which has implications for the sustainable development and utilization of renewable energy sources such as wind power under the goal of carbon neutrality."
    }
  }
}
);
import { onMounted, onBeforeUnmount } from 'vue'


import img1 from '@/assets/img/home.png';
</script>


<style lang="scss" scoped>
  .lay{
    width: 100%;
    height: 100%;
  }
  .img-topic{
    box-sizing: border-box;
    -webkit-text-size-adjust: 100%;
   background-image:url("@/assets/img/login.png");
    min-height: 330px;
    
  }
  .container{
    width: 90%;
    margin: 0 auto;
    min-width: 320px;
    padding: 2%;
  }
  .row{
    flex-wrap: wrap;
    margin: 0 -20px;
    box-sizing: border-box;
  }
  .content-column{
    width: 50%;
    height: 35%;
    padding: 0 20px;
    display: block;
    unicode-bidi: isolate;
  }
  .panel-topic{
    background: #19aada;
  }
  .panel-body{
    padding: 2rem;
    display: block;
    unicode-bidi: isolate;
  }
  .breadcrumb{
    opacity: .8;
  }
  .theme1-title{
    color: whitesmoke;
  }
.content{
  display: 0 !important;
  .nav-btns{
    display: 0 !important;
  }
}
.main{
    padding: 2rem 0;
    .view-container{
      width: 100%;
      height: 100%;
    }
    .container{
      padding: 0 20px;
      width: 100%;
      margin: 0 auto;
      min-width: 320px;
    }
    .main-content{
      display: block;
      unicode-bidi: isolate;
      width: 100%;
      margin: 0 auto;
      padding: 0 20px; // 仅保留左右内边距
    }
   
    .article-list{
      width: 100%; // 占满容器宽度
      padding-top: 10px;
      // 文章项采用flex布局，避免浮动导致的重叠
      .article-item {
      display: flex;
      align-items: flex-start; // 顶部对齐
      gap: 20px; // 图片与文字的间距
      margin-bottom: 30px; // 文章项之间的间距
      padding-bottom: 20px;
      border-bottom: 1px solid #eee; // 分隔线替代hr

      // 图片区域固定宽度
      .art-list-img {
        width: 30%; // 图片占30%宽度
        flex-shrink: 0; // 不缩小
        margin: 0; // 移除默认margin

        img {
          width: 100%;
          height: 100%;
          object-fit: cover; // 图片自适应裁剪，避免变形
          border-radius: 8px; // 增加圆角
        }
        }
      }
    // 文字区域占剩余宽度
    .article-list-content {
        flex: 1; // 占满剩余空间
        margin: 0; // 移除原有的margin-left
        padding: 10px 0; // 增加上下内边距

        .article-list-title {
          margin-top: 0; // 移除顶部间距
          margin-bottom: 10px;
          font-size: 1.3rem;
        }

        .article-list-summary {
          font-size: 1rem;
          line-height: 1.6; // 增加行高，提升可读性
          color: #555;
        }
      }
    }
    .art-title{
      color: black;
    }
    .img-ratio-169{
      padding-top: 26.25%;
    }
}
// 响应式适配（小屏幕自动堆叠）
@media (max-width: 768px) {
  .main {
    .article-item {
      flex-direction: column; // 垂直排列

      .art-list-img {
        width: 100%; // 图片占满宽度
        max-height: 200px; // 限制最大高度
      }
    }
  }
}
// 整体footer容器，压缩体积
.page3-footer {
  width: 100%;
  padding: 20px 40px 15px; // 上下内边距减半（原60px 30px → 20px 15px）
  background-color: #5db1e9;
  box-sizing: border-box;
}

// 团队容器，减少底部间距
.teams {
  display: flex;
  gap: 15px; // 间距减半（原30px → 15px）
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 20px; // 底部间距大幅减少（原60px → 20px）
}

// 单个团队卡片，减少内部填充
.team {
  flex: 1 1 calc(33.333% - 20px); // 调整宽度占比（原40px间距 → 20px）
  min-width: 220px; // 缩小最小宽度
  max-width: 280px; // 缩小最大宽度
  background: rgb(235, 245, 246);
  border-radius: 8px; // 适当减小圆角
  padding: 15px 20px; // 内部填充减半（原30px → 15px）
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); // 减小阴影
}

// 标题样式，压缩间距和字号
.title {
  display: flex;
  align-items: center;
  margin-bottom: 12px; // 标题下间距减半（原25px → 12px）
  color: #3498db;

  span:first-child {
    width: 3px; // 缩小左侧竖条
    height: 16px;
    margin-right: 8px; // 减少间距
  }

  .label {
    font-size: 1rem; // 适当减小字号（原1.3rem → 1rem）
    font-weight: 600;
  }
}

// 内容项样式，减少元素间距
.info_item {
  display: flex;
  flex-direction: column;
  gap: 8px; // 内容项间距减半（原15px → 8px）

  a, span {
    color: #555;
    font-size: 0.85rem; // 缩小字号（原1rem → 0.85rem）
    text-decoration: none;

    &:hover {
      color: #3498db;
    }
  }
}

// 关注我们区域，压缩二维码和间距
.follow_us .content {
  display: flex;
  flex-direction: column;
  gap: 10px; // 二维码间距减半（原20px → 10px）
  align-items: center;
}

.follow_us .item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px; // 图片与文字间距减少（原10px → 6px）
}

.follow_us img {
  width: 80px; // 二维码尺寸大幅缩小（原140px → 80px，约57%）
  height: 80px;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.follow_us span {
  font-size: 0.8rem; // 缩小文字（原0.95rem → 0.8rem）
}

// 底部版权信息，压缩间距
.bottom {
  margin-top: 15px; // 上方间距大幅减少（原50px → 15px）
  width: 100%;
  text-align: center;
}

.copyright {
  color: #fff;
  font-size: 0.8rem; // 缩小字号（原0.9rem → 0.8rem）
  opacity: 0.9;
}

.back-btn {
      //padding-left: 15%;
      margin-bottom: 20px;
      text-align: left;

      .el-button {
        padding: 12px 30px;   // 更大的内边距
        font-size: 18px;      // 更大的字体
        min-width: 100px;     // 更宽的最小宽度
         text-align: center;   // 文字水平居中
      }
    }
</style>
