<template>
  <div class="lay">
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
                  <h1 class="theme3-title" style="color: azure">
                    {{ navpage.theme3title }}
                  </h1>
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
          <div></div>
          <div class="view-container">
            <div class="back-btn">
              <el-button type="primary" @click="goBack" size="small">
                {{ $t("common.back1") }}
              </el-button>
            </div>
            <div>
              <p>{{ navpage.list }}</p>
            </div>
            <div class="article-list">
              <article class="article-item">
                <figure class="art-list-img">
                  <a class="img-ratio-169" href="/#/home/nav-page3/paper1">
                    <img
                      loading="lazy"
                      src="@/assets/img/theme3-1-1.png"
                      width="300"
                      height="160"
                      alt="pic-4"
                    />
                  </a>
                </figure>
                <div class="article-list-content">
                  <h2 class="article-list-title">
                    <router-link
                      to="/home/nav-page3/paper1"
                      class="art-title"
                      >{{ navpage.arttitle1 }}</router-link
                    >
                  </h2>
                  <p class="article-list-summary">
                    {{ navpage.artListSummary1 }}
                  </p>
                </div>
              </article>

              <article class="article-item">
                <figure class="art-list-img">
                  <a class="img-ratio-169" href="/#/home/nav-page3/paper2">
                    <img
                      loading="lazy"
                      src="@/assets/img/theme1-2-1.png"
                      width="300"
                      height="160"
                      alt="pic-4"
                    />
                  </a>
                </figure>
                <div class="article-list-content">
                  <h2 class="article-list-title">
                    <router-link
                      to="/home/nav-page3/paper2"
                      class="art-title"
                      >{{ navpage.arttitle2 }}</router-link
                    >
                  </h2>
                  <p class="article-list-summary">
                    {{ navpage.artListSummary2 }}
                  </p>
                </div>
              </article>

              <article class="article-item">
                <figure class="art-list-img">
                  <a class="img-ratio-169" href="/#/home/nav-page3/paper3">
                    <img
                      loading="lazy"
                      src="@/assets/img/theme3-3-1.png"
                      width="300"
                      height="160"
                      alt="pic-4"
                    />
                  </a>
                </figure>
                <div class="article-list-content">
                  <h2 class="article-list-title">
                    <router-link
                      to="/home/nav-page3/paper3"
                      class="art-title"
                      >{{ navpage.arttitle3 }}</router-link
                    >
                  </h2>
                  <p class="article-list-summary">
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
            <a href="https://www.tsinghua.edu.cn/xxgk.htm">{{
              $t("message.Home.friendshipLink1")
            }}</a>
            <a href="https://www.env.tsinghua.edu.cn/">{{
              $t("message.Home.friendshipLink2")
            }}</a>
            <a href="https://www.icon.tsinghua.edu.cn/">{{
              $t("message.Home.friendshipLink3")
            }}</a>
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
        <span class="copyright"
          >Copyright ©2024 {{ $t("common.copyright") }}</span
        >
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter(); // 初始化路由实例

// 定义返回方法：跳转到nav-page1
const goBack = () => {
  router.push("/home/");
};

import { useI18n } from "vue-i18n";
import { computed } from "vue";
const { locale } = useI18n();
const navpage = computed(() => {
  if (locale.value === "chinese") {
    return {
      theme3title: "高比例可再生能源系统风险与韧性提升",
      arttitle1: "中国可再生能源发电内在的时空不确定性研究",
      arttitle2: "大规模山区风电场对京津冀地区冬季空气质量的影响",
      arttitle3: "空气质量提升对光伏发电与碳中和目标的协同效益",
      list: "文章列表",
      home: "主页 / ",
      topic: "主题 / ",
      artListSummary1:
        "文章利用机器学习技术解析了可再生能源多时空尺度不确定性的分布规律，主要研究了风能、光能等可再生能源固有不确定性的统计特征。研究团队运用统计学习、深度学习等多元算法开发了分省级、年度小时级的可再生能源发电预测误差分布标准数据库，揭示了我国30个省份风力和光伏发电随机分布的时空规律。",
      artListSummary2:
        "风能是重要的可再生能源。风力发电在中国实现碳中和目标和空气质量达标方面发挥重要作用。通常，风力发电对于改善空气质量和减缓气候变化具有直接和间接的影响。间接影响体现在通过化石燃料替代进而减少大气污染物排放，而直接影响体现在通过改变区域气象条件，影响大气污染物分布，进而改变污染物浓度。诸多研究已对风力部署间接影响进行分析，近年也有越来越多研究开始讨论其直接影响，但较为综合地分析风力发电对空气质量的直接和间接影响的研究目前相对较少。本文采用更为综合的研究框架，全面评估风力发电对区域空气质量（尤其是处于风电场下风向的京津冀地区）的影响，为未来能源政策制定和完善提供参考。",
      artListSummary3:
        "碳中和目标驱动下，光伏发电装机水平预计将成倍增长。空气污染将会降低光伏发电水平，有损光伏发电的“减污降碳”效益，然而，我国空气污染及其改善对光伏发电的影响仍缺乏系统研究。针对这一问题，清华大学环境学院、碳中和研究院与哈佛大学研究团队耦合潜力评估与逐步线性回归统计模型，以1995年至2019年为分析时间尺度，以覆盖我国陆上全域的数据格点为空间框架，针对性地解析空气污染控制重点区域及不同气象条件下光伏发电水平的时间、空间变动性及其驱动因素，量化了空气质量提升对光伏发电与实现碳中和的协同效益。本研究首次将空气污染水平与气象条件的变化纳入统一分析框架下，综合考察其对我国光伏发电的影响。若不考虑同期气象因素变动对光伏发电的影响，则近十年我国空气质量改善对光伏发电的协同效益将被显著低估。",
    };
  } else {
    return {
      theme3title:
        " Risks and Resilience Enhancement in High-Proportion Renewable Energy Systems",
      arttitle1:
        "Inherent Spatiotemporal Uncertainty of Renewable Power in China",
      arttitle2:
        "Impacts of Large-Scale Deployment of Mountainous Wind Farms On Wintertime Regional Air Quality in the Beijing-Tian-Hebei Area",
      arttitle3:
        "Synergistic Benefits of Air Quality Improvement on Photovoltaic Power Generation and Carbon Neutrality Goals",
      list: "List of Articles",
      home: "Home / ",
      topic: "Topic / ",
      artListSummary1:
        "The study employs machine learning techniques to analyze the distribution patterns of renewable energy uncertainty across multiple spatiotemporal scales, focusing on the statistical characteristics of the inherent uncertainty in wind and solar power. The research team utilized statistical learning, deep learning, and other multivariate algorithms to develop a standardized provincial-level, annual hourly database of renewable energy generation forecast error distributions, revealing the spatiotemporal patterns of stochastic wind and solar power generation across 30 provinces in China.",
      artListSummary2:
        "Wind energy is a crucial renewable energy source. Wind power plays a significant role in helping China achieve its carbon neutrality goals and meet air quality standards. Generally, wind power has both direct and indirect effects on improving air quality and mitigating climate change. The indirect effect manifests through the reduction of atmospheric pollutant emissions by replacing fossil fuels, while the direct effect involves altering regional meteorological conditions, thereby influencing the distribution of atmospheric pollutants and their concentrations. Numerous studies have analyzed the indirect impacts of wind power deployment, and in recent years, an increasing number of studies have begun to explore its direct effects. However, comprehensive analyses of both the direct and indirect impacts of wind power on air quality remain relatively scarce. This study adopts a more integrated research framework to thoroughly assess the effects of wind power on regional air quality—particularly in the Beijing-Tianjin-Hebei (BTH) region, which lies downwind of wind farms—providing references for the formulation and refinement of future energy policies.",
      artListSummary3:
        "Tsinghua News, May 6 (Correspondent Shi Chen) — Under the carbon neutrality goal, photovoltaic (PV) power generation capacity is expected to multiply. Air pollution can reduce PV power generation efficiency, undermining its \"pollution and carbon reduction\" benefits. However, systematic research on the impact of air pollution and its improvement on PV power generation in China remains limited. To address this issue, research teams from Tsinghua University's School of Environment and Institute for Carbon Neutrality, in collaboration with Harvard University, coupled potential assessment with stepwise linear regression statistical models. Using a temporal scale from 1995 to 2019 and a spatial framework covering China's terrestrial areas, they analyzed the temporal and spatial variability of PV power generation levels in key air pollution control regions and under different meteorological conditions, as well as the driving factors, quantifying the synergistic benefits of air quality improvement for PV power generation and carbon neutrality. This study is the first to integrate changes in air pollution levels and meteorological conditions into a unified analytical framework to comprehensively assess their impact on PV power generation in China. If the influence of concurrent meteorological factors on PV power generation is not considered, the synergistic benefits of air quality improvement over the past decade would be significantly underestimated.",
    };
  }
});
import { onMounted, onBeforeUnmount } from "vue";


import img1 from "@/assets/img/home.png";
</script>

<style lang="scss" scoped>
.lay {
  width: 100%;
  height: 100%;
}
.img-topic {
  box-sizing: border-box;
  -webkit-text-size-adjust: 100%;
  background-image: url("@/assets/img/login.png");
  min-height: 330px;
}
.container {
  width: 90%;
  margin: 0 auto;
  min-width: 320px;
  padding: 2%;
}
.row {
  flex-wrap: wrap;
  margin: 0 -20px;
  box-sizing: border-box;
}
.content-column {
  width: 50%;
  height: 35%;
  padding: 0 20px;
  display: block;
  unicode-bidi: isolate;
}
.panel-topic {
  background: #19aada;
}
.panel-body {
  padding: 2rem;
  display: block;
  unicode-bidi: isolate;
}
.breadcrumb {
  opacity: 0.8;
}
.theme3-title {
  color: whitesmoke;
}
.content {
  display: 0 !important;
  .nav-btns {
    display: 0 !important;
  }
}
.main {
  padding: 2rem 0;
  .view-container {
    width: 100%;
    height: 100%;
  }
  .container {
    padding: 0 20px;
    width: 100%;
    margin: 0 auto;
    min-width: 320px;
  }
  .main-content {
    display: block;
    unicode-bidi: isolate;
    width: 100%;
    margin: 0 auto;
    padding: 0 20px; // 仅保留左右内边距
  }

  .article-list {
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
  .art-title {
    color: black;
  }
  .img-ratio-169 {
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

  a,
  span {
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
    padding: 12px 30px; // 更大的内边距
    font-size: 18px; // 更大的字体
    min-width: 100px; // 更宽的最小宽度
    text-align: center; // 文字水平居中
  }
}
</style>
