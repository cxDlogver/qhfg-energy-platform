<template>
  <div class="lay">
    <div class="paperClass">
      <div class="article-title">
        {{ paper3.title }}
      </div>
      <div class="sub_title" v-html="paper3.subtitle"></div>
      <div class="content1" v-html="paper3.text1"></div>
      <div class="content1">
        {{ paper3.text2 }}
      </div>
      <!-- 图片1：统一使用img标签+content1类名 -->
      <div class="content1">
        <img
          src="@/assets/img/theme1-3-1.png"
          alt="图1"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">图1. 相关图表说明（保持原图片对应说明）</div>

      <div class="content1">
        {{ paper3.text3 }}
      </div>
      <!-- 图片2：统一使用img标签+content1类名 -->
      <div class="content1">
        <img
          src="@/assets/img/theme1-3-2.png"
          alt="图2"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">图2. 相关图表说明（保持原图片对应说明）</div>

      <div class="content1">
        {{ paper3.text4 }}
      </div>
      <!-- 图片3：统一使用img标签+content1类名 -->
      <div class="content1">
        <img
          src="@/assets/img/theme1-3-3.png"
          alt="图3"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">图3. 相关图表说明（保持原图片对应说明）</div>

      <div class="content1">
        {{ paper3.text5 }}
      </div>
      <div class="content1">
        {{ paper3.text6 }}
      </div>
      <!-- 底部信息：统一使用bottom-bar布局 -->
      <div class="bottom-bar">
        <div class="paper-link">
          <div>{{ paper3.text7 }}</div>
          <div style="display: flex; word-wrap: break-word">
            <a :href="paper3.link" target="_blank">{{ paper3.link }}</a>
          </div>
        </div>
        <div class="bottom-right">
          <div>{{ paper3.bottom1 }}</div>
          <div>{{ paper3.bottom2 }}</div>
          <div>{{ paper3.bottom3 }}</div>
        </div>
      </div>
      <div class="back-btn">
        <el-button type="primary" @click="goBack" size="small">
          {{ $t("common.back") }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { locale } = useI18n();

import { useRouter } from "vue-router";

const router = useRouter(); // 初始化路由实例

// 定义返回方法：跳转到nav-page1
const goBack = () => {
  router.push("/home/nav-page1");
};

// 内容完全保留，未做任何修改
const paper3 = computed(() => {
  if (locale.value === "chinese") {
    return {
      title:
        "清华大学环境学院、碳中和研究院、哈佛大学等联合团队系统解析我国太阳能发电平价路径与并网潜力",
      subtitle: `本文转自 <a href=\"https://www.tsinghua.edu.cn/info/1181/87813.htm\" target=\"_blank\">清华大学官网</a> ，发布时间：2021年10月19日`,
      text1:
        "<b>清华新闻网10月19日电</b>（通讯员 <b>鲁玺</b>）近日，清华大学环境学院、碳中和研究院、哈佛大学等国内外联合团队在碳中和背景下我国太阳能光伏发电平价动态与并网潜力研究方面取得新进展，系统动态评估了我国技术可行、经济平价、电网兼容的光伏发电潜力，揭示了光伏成本优势下'光伏+储能'的广阔应用前景。该研究成果可为碳中和背景下的光伏发电资源开发、新型电力系统规划提供参考，对于光伏发电与终端用能'电气化'与储能技术融合，促进工业、建筑、交通等领域的脱碳具有启示意义。",
      text2:
        "在碳中和、碳达峰的目标下，我国亟需通过能源结构调整与构建新型电力系统实现低碳零碳转型。光伏发电作为全球增长最为迅速的可再生能源之一，发电转换效率逐步提升，度电成本迅速下降。在光伏平价上网时代开启和向'双碳'目标迈进的关键节点，迫切需要明确近期光伏平价上网路径，挖掘未来中长期成本优势带动下'光伏+储能'在以新能源为主体的电力系统中的并网潜力。",
      text3:
        "该项研究解析了我国近期光伏发电平价上网路径，首次在空间尺度上明确了平价上网时间节点。研究引入空间地理、资源气象、工程经济等多源数据，在解析我国技术潜力时空分布特征的基础上，结合学习曲线模型和行业动态，构建了平价上网时间与平价上网潜力的评估方法。研究结果表明，我国2020年技术发电潜力总量达99.2PWh，超过同年电力需求的13倍，并有望在2060年增长到146.1PWh。光伏发电成本已由发展障碍转变为竞争优势，2021年我国78.6%的技术潜力已实现与煤电平价或低价上网，全国范围内的平价上网将在2023年前实现。",
      text4:
        "中长期视角下，光伏发电'无补贴'时代的成本优势有助于提高'光伏+储能'系统的经济可行性，从而为应对光伏发电的间歇性挑战提供契机。研究进一步以'光伏+储能'系统并网后净电力需求的波动性为优化目标，结合光伏出力、储能设备充放电特征等约束条件，在电网尺度构建了逐小时优化模型，以量化'光伏+储能'系统的并网潜力。研究结果表明，'光伏+储能'并网潜力有望在2030年和2060年达到5.2PWh和7.2PWh，且'光伏+储能'与需求侧具备更好的兼容性。同时，'光伏+储能'具备成本竞争力，全国平均度电成本在2030年和2060年分别为0.25元/千瓦时和0.12元/千瓦时。",
      text5:
        "该研究成果以“碳中和背景下我国光伏加储能系统的成本动态与并网潜力”（Combined solar power and storage as cost-competitive and grid-compatible supply for China's future carbon-neutral electricity system）为题于10月12日在线发表在《美国科学院院刊》（PNAS）上，并被推选为当期封面论文。",
      text6:
        "环境学院鲁玺副教授、国家博士后创新人才支持计划与清华大学“水木学者”计划入选者陈诗博士为共同第一作者，鲁玺和哈佛大学迈克尔·麦克尔罗伊（Michael B. McElroy）教授为共同通讯作者，清华大学郝吉明院士、贺克斌院士为共同作者。论文合作者还包括美国哈佛大学中国项目执行主任克里斯·尼尔森（Chris P.Nielsen）；清华大学环境学院王书肖教授、吴烨教授，博士生张憧宇、李佳聪；南开大学环境科学与工程学院徐鹤教授；中国人民大学应用经济学院魏楚教授与宋枫副教授。本研究受到国家自然科学基金杰出青年基金、面上项目，环境前沿技术北京实验室、清华大学-INDITEX可持续发展基金资助项目，哈佛大学校长办公室及哈佛全球研究所资助项目等资助。",
      text7: "论文链接：",
      link: "https://www.pnas.org/content/118/42/e2103471118",
      bottom1: "供稿：环境学院",
      bottom2: "编辑：李华山",
      bottom3: "审核：吕婷",
    };
  } else {
    return {
      title:
        "Systematic Analysis of Solar Power Grid Parity Pathways and Grid Integration Potential in China by a Joint Team from Tsinghua University, Harvard University, and Others",
      subtitle: `This article is reproduced from <a href=\"https://www.tsinghua.edu.cn/info/1181/87813.htm\" target=\"_blank\">the official website of Tsinghua University. Release date:</a>, Release date: October 19, 2021`,
      text1:
        "<b>Tsinghua News Network, October 19</b> (Reporter <b>Xi Lu</b>)——Recently, a joint team from the School of Environment and the Institute of Carbon Neutrality at Tsinghua University, Harvard University, and other domestic and international institutions has made new progress in the study of the dynamics of solar PV grid parity and grid integration potential in China under the framework of carbon neutrality. The team systematically evaluated the technically feasible, economically competitive, and grid-compatible PV power potential in China, revealing the broad application prospects of 'PV + energy storage' under the cost advantage of PV. The results can provide a reference for PV resource development and new power system planning under the background of carbon neutrality, and have implications for the integration of PV power with end-use electrification and energy storage technologies, promoting decarbonization in industry, buildings, transportation, and other sectors.",
      text2:
        "Under the goals of carbon neutrality and carbon peaking, China urgently needs to achieve low-carbon and zero-carbon transformation through energy structure adjustment and the construction of a new power system. As one of the fastest-growing renewable energy sources in the world, PV power generation has seen continuous improvement in conversion efficiency and rapid reduction in levelized cost of electricity. At the critical juncture of the PV grid parity era and the advancement towards the 'dual carbon' goals, it is urgent to clarify the near-term PV grid parity pathways and explore the grid integration potential of 'PV + energy storage' in a power system dominated by new energy sources, driven by future medium- and long-term cost advantages.",
      text3:
        "This study analyzes the recent PV grid parity pathways in China and, for the first time, clarifies the timing of grid parity on a spatial scale. The study introduces multi-source data such as spatial geography, resource meteorology, and engineering economics, and, based on the analysis of the spatiotemporal distribution characteristics of China's technical potential, combines learning curve models and industry dynamics to construct an evaluation method for grid parity timing and potential. The results show that China's total technical power generation potential in 2020 reached 99.2 PWh, more than 13 times the electricity demand in the same year, and is expected to grow to 146.1 PWh by 2060. The cost of PV power generation has shifted from a development barrier to a competitive advantage. By 2021, 78.6% of China's technical potential had achieved grid parity or lower prices compared to coal power, and nationwide grid parity will be achieved before 2023.",
      text4:
        "From a medium- and long-term perspective, the cost advantage of PV power generation in the 'subsidy-free' era helps improve the economic feasibility of 'PV + energy storage' systems, providing an opportunity to address the intermittency challenges of PV power. The study further takes the volatility of net electricity demand after grid integration of 'PV + energy storage' systems as the optimization objective, and, combined with constraints such as PV output and energy storage device charge-discharge characteristics, constructs an hourly optimization model at the grid scale to quantify the grid integration potential of 'PV + energy storage' systems. The results show that the grid integration potential of 'PV + energy storage' is expected to reach 5.2 PWh and 7.2 PWh in 2030 and 2060, respectively, and 'PV + energy storage' has better compatibility with the demand side. At the same time, 'PV + energy storage' is cost-competitive, with the national average levelized cost of electricity being 0.25 yuan/kWh and 0.12 yuan/kWh in 2030 and 2060, respectively.",
      text5:
        "This research was published online on October 12 in the Proceedings of the National Academy of Sciences (PNAS) as the cover article, under the title 'Combined solar power and storage as cost-competitive and grid-compatible supply for China's future carbon-neutral electricity system'.",
      text6:
        "Associate Professor Lu Xi from the School of Environment, Tsinghua University, and Dr. Chen Shi, a recipient of the National Postdoctoral Innovative Talent Support Program and the Tsinghua 'Shuimu Scholar' Program, are co-first authors. Professor Lu Xi and Professor Michael B. McElroy from Harvard University are co-corresponding authors. Academicians Hao Jiming and He Kebin from Tsinghua University are co-authors. Other contributors include Chris P. Nielsen, Executive Director of the China Project at Harvard University; Professors Wang Shuxiao and Wu Ye, and doctoral students Zhang Chongyu and Li Jiacong from the School of Environment, Tsinghua University; Professor Xu He from the School of Environmental Science and Engineering, Nankai University; Professors Wei Chu and Song Feng from the School of Applied Economics, Renmin University of China. This research was supported by the National Natural Science Foundation of China (Distinguished Young Scholars and General Program), Beijing Laboratory for Environmental Frontier Technologies, Tsinghua-INDITEX Sustainable Development Fund, and grants from the Harvard University President's Office and Harvard Global Institute.",
      text7: "Paper link:",
      link: "https://www.pnas.org/content/118/42/e2103471118",
      bottom1: "Provided by: School of Environment",
      bottom2: "Editor: Li Huashan",
      bottom3: "Reviewer: Lv Ting",
    };
  }
});
</script>

<style lang="scss" scoped>
/* 完全复用主题三的样式，确保格式统一 */
.lay {
  width: 100%;
  height: 100%;
  .paperClass {
    width: 100%;
    height: 100%;
    padding: 0px 10px;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    word-break: break-word;

    .article-title {
      width: 100%;
      max-width: 800px;
      margin: 0 auto 10px auto;
      line-height: 1.2;
      font-weight: 700;
      font-size: 30px;
      color: #000;
      text-align: center;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .sub_title {
      width: 100%;
      max-width: 100%;
      height: auto;
      line-height: 1.2;
      font-weight: 700;
      font-size: 20px;
      color: #000000;
      text-align: center;
      margin-bottom: 10px;
      word-break: break-word;
      overflow-wrap: break-word;
      :deep(a) {
        color: #028bed !important;
        text-decoration: underline !important;
      }
    }
    .title {
      width: 100%;
      height: auto;
      padding-left: 15%;
      line-height: 1.2;
      font-weight: 700;
      font-size: 21px;
      color: #000;
      text-align: start;
      margin-bottom: 10px;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .content1 {
      width: 100%;
      line-height: 2;
      padding-left: 15%;
      padding-right: 15%;
      font-size: 18px;
      color: #000;
      text-align: justify;
      text-indent: 2rem;
      margin-bottom: 10px;
      word-break: break-word;
      overflow-wrap: break-word;
      img {
        text-indent: 0;
      }
    }
    .image-caption {
      width: 100%;
      line-height: 1.8;
      font-size: 18px;
      color: #000;
      text-align: center;
      margin-bottom: 10px;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .bottom-bar {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 18px;
      padding-left: 15%;
      color: #000;
      line-height: 40px;
      margin-top: 20px;
      .paper-link {
        width: 50%;
        text-align: left;
        > div:first-child {
          margin-bottom: 5px;
        }
        > div:last-child {
          padding-left: 0;
        }
        a {
          color: #000;
        }
      }
      .bottom-right {
        width: 50%;
        font-size: 18px;
        padding-right: 15%;
        line-height: 40px;
        color: #000;
        text-align: end;
        margin-top: 0;
        > div {
          margin-bottom: 10px;
        }
      }
    }
    /* 移除原样式中与统一格式冲突的定义 */
    .bottom-left,
    .theme1-3-1,
    .theme1-3-2,
    .theme1-3-3 {
      display: none;
    }
  }
  .back-btn {
    padding-left: 15%;
    margin-bottom: 20px;
    text-align: left;

    .el-button {
      padding: 12px 30px; // 更大的内边距
      font-size: 18px; // 更大的字体
      min-width: 100px; // 更宽的最小宽度
      text-align: center; // 文字水平居中
    }
  }
}
</style>
