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
                  <h1 class="theme2-title" style="color: azure">
                    {{ navpage.theme2title }}
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
              <!-- Paper1 -->
              <article class="article-item">
                <figure class="art-list-img">
                  <a class="img-ratio-169" href="/#/home/nav-page2/paper1">
                    <img
                      loading="lazy"
                      src="@/assets/img/theme2-1-1.png"
                      width="300"
                      height="160"
                      alt="pic-1"
                    />
                  </a>
                </figure>
                <div class="article-list-content">
                  <h2 class="article-list-title">
                    <router-link
                      to="/home/nav-page2/paper1"
                      class="art-title"
                      >{{ navpage.arttitle1 }}</router-link
                    >
                  </h2>
                  <p class="article-list-summary">
                    {{ navpage.artListSummary1 }}
                  </p>
                </div>
              </article>

              <!-- Paper2 -->
              <article class="article-item">
                <figure class="art-list-img">
                  <a class="img-ratio-169" href="/#/home/nav-page2/paper2">
                    <img
                      loading="lazy"
                      src="@/assets/img/theme2-2-1.png"
                      width="300"
                      height="160"
                      alt="pic-2"
                    />
                  </a>
                </figure>
                <div class="article-list-content">
                  <h2 class="article-list-title">
                    <router-link
                      to="/home/nav-page2/paper2"
                      class="art-title"
                      >{{ navpage.arttitle2 }}</router-link
                    >
                  </h2>
                  <p class="article-list-summary">
                    {{ navpage.artListSummary2 }}
                  </p>
                </div>
              </article>

              <!-- Paper3 -->
              <article class="article-item">
                <figure class="art-list-img">
                  <a class="img-ratio-169" href="/#/home/nav-page2/paper3">
                    <img
                      loading="lazy"
                      src="@/assets/img/theme2-3-1.png"
                      width="300"
                      height="160"
                      alt="pic-3"
                    />
                  </a>
                </figure>
                <div class="article-list-content">
                  <h2 class="article-list-title">
                    <router-link
                      to="/home/nav-page2/paper3"
                      class="art-title"
                      >{{ navpage.arttitle3 }}</router-link
                    >
                  </h2>
                  <p class="article-list-summary">
                    {{ navpage.artListSummary3 }}
                  </p>
                </div>
              </article>

              <!-- Paper4 -->
              <article class="article-item">
                <figure class="art-list-img">
                  <a class="img-ratio-169" href="/#/home/nav-page2/paper4">
                    <img
                      loading="lazy"
                      src="@/assets/img/theme2-4-1.png"
                      width="300"
                      height="160"
                      alt="pic-4"
                    />
                  </a>
                </figure>
                <div class="article-list-content">
                  <h2 class="article-list-title">
                    <router-link
                      to="/home/nav-page2/paper4"
                      class="art-title"
                      >{{ navpage.arttitle4 }}</router-link
                    >
                  </h2>
                  <p class="article-list-summary">
                    {{ navpage.artListSummary4 }}
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
      theme2title: "碳中和目标下可再生能源发展路径",
      arttitle1:
        "环境学院鲁玺课题组在时空动态化评估我国陆上风电碳足迹及成本变动性方面取得新进展",
      arttitle2:
        "高时空分辨率电力系统优化模型揭示碳中和目标下可再生能源发展布局",
      arttitle3: "《中国碳中和目标下的风光技术展望》报告重磅发布",
      arttitle4: "氢能与燃料电池发展分析",
      list: "文章列表",
      home: "主页 / ",
      artListSummary1:
        "揭示我国陆上风电产业链发展的关键减排部门、地区和措施，2017年陆上风电生命周期碳排放为26.20 g/kWh，预计2060年降至8.61 g/kWh，为未来“零碳”风电发展提供数据支持。",
      artListSummary2:
        "开发RESPO模型，首次实现格点和逐小时级别优化，研究显示2060年我国需部署20亿~40亿千瓦风电和光伏装机，强调储能和特高压传输的重要性。",
      artListSummary3:
        "报告指出2060年我国风电与光伏装机将达2020年的十倍以上，建议分区域发展陆上/海上风电及集中式/分布式光伏，为电力系统绿色低碳发展提供科学建议。",
      artListSummary4:
        "研究氢能产业链的关键技术环节，从制氢、储运到燃料电池应用，展望氢能在交通和能源领域的变革潜力，分析碳中和目标下的发展路径与挑战。",
    };
  } else {
    return {
      theme2title:
        "Renewable Energy Development Path under Carbon Neutrality Goals",
      arttitle1:
        "Progress in Spatiotemporal Dynamic Assessment of Carbon Footprint and Cost Variability of Onshore Wind Power in China by Lu Xi's Research Group",
      arttitle2:
        "High Spatiotemporal Resolution Power System Optimization Model Reveals Renewable Energy Development Layout under Carbon Neutrality Goals",
      arttitle3:
        "Report “Outlook on Wind and Solar Technologies under China's Carbon Neutrality Goal” Released",
      arttitle4: "Development Analysis of Hydrogen Energy and Fuel Cells",
      list: "List of Articles",
      home: "Home / ",
      artListSummary1:
        "Reveals key emission reduction sectors, regions, and measures for China's onshore wind power industry chain. The life-cycle carbon emissions of onshore wind power in 2017 were 26.20 g/kWh, expected to drop to 8.61 g/kWh by 2060, providing data support for future 'zero-carbon' wind power development.",
      artListSummary2:
        "Developed the RESPO model, achieving grid-level and hourly optimization for the first time. The study shows that China needs to deploy 2-4 billion kW of wind and photovoltaic installations by 2060, emphasizing the importance of energy storage and UHV transmission.",
      artListSummary3:
        "The report indicates that China's wind and photovoltaic installations will be more than ten times that of 2020 by 2060, suggesting regional development of onshore/offshore wind power and centralized/distributed photovoltaics to provide scientific advice for green and low-carbon development of power systems.",
      artListSummary4:
        "Studies key technical links in the hydrogen energy industry chain, from hydrogen production, storage and transportation to fuel cell applications, prospects the transformative potential of hydrogen energy in transportation and energy sectors, and analyzes development paths and challenges under carbon neutrality goals.",
    };
  }
});
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
.theme2-title {
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
    padding: 0 20px;
  }
  .article-list {
    width: 100%;
    padding-top: 10px;
    .article-item {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
      .art-list-img {
        width: 30%;
        flex-shrink: 0;
        margin: 0;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }
      }
    }
    .article-list-content {
      flex: 1;
      margin: 0;
      padding: 10px 0;
      .article-list-title {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 1.3rem;
      }
      .article-list-summary {
        font-size: 1rem;
        line-height: 1.6;
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
@media (max-width: 768px) {
  .main {
    .article-item {
      flex-direction: column;
      .art-list-img {
        width: 100%;
        max-height: 200px;
      }
    }
  }
}
.page3-footer {
  width: 100%;
  padding: 20px 40px 15px;
  background-color: #5db1e9;
  box-sizing: border-box;
}
.teams {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 20px;
}
.team {
  flex: 1 1 calc(33.333% - 20px);
  min-width: 220px;
  max-width: 280px;
  background: rgb(235, 245, 246);
  border-radius: 8px;
  padding: 15px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.title {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: #3498db;
  span:first-child {
    width: 3px;
    height: 16px;
    margin-right: 8px;
  }
  .label {
    font-size: 1rem;
    font-weight: 600;
  }
}
.info_item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  a,
  span {
    color: #555;
    font-size: 0.85rem;
    text-decoration: none;
    &:hover {
      color: #3498db;
    }
  }
}
.follow_us .content {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}
.follow_us .item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.follow_us img {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.follow_us span {
  font-size: 0.8rem;
}
.bottom {
  margin-top: 15px;
  width: 100%;
  text-align: center;
}
.copyright {
  color: #fff;
  font-size: 0.8rem;
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
