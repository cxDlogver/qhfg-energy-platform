<template>
  <div class="lay">
    <div class="paperClass">
      <div class="article-title">
        {{ paper3.title }}
      </div>
      <div class="sub-title" v-html="paper3.subtitle"></div>
      <div class="content1" v-html="paper3.text1"></div>
      <div class="content1" v-html="paper3.text2"></div>
      <div class="content1">
        <img
          :src="img1"
          alt="Figure 1"
          style="
            width: 100%;
            max-width: 700px;
            display: block;
            margin: 20px auto;
          "
        />
        <div style="text-align: center; font-size: 16px; margin-bottom: 10px">
          {{ paper3.caption1 }}
        </div>
      </div>
      <div class="content1" v-html="paper3.text3"></div>
      <div class="content1">
        <img
          :src="img2"
          alt="Figure 2"
          style="
            width: 100%;
            max-width: 700px;
            display: block;
            margin: 20px auto;
          "
        />
        <div style="text-align: center; font-size: 16px; margin-bottom: 10px">
          {{ paper3.caption2 }}
        </div>
      </div>
      <div class="content1" v-html="paper3.text4"></div>
      <div class="content1">
        <img
          :src="img3"
          alt="Figure 3"
          style="
            width: 100%;
            max-width: 700px;
            display: block;
            margin: 20px auto;
          "
        />
        <div style="text-align: center; font-size: 16px; margin-bottom: 10px">
          {{ paper3.caption3 }}
        </div>
      </div>
      <div class="content1" v-html="paper3.text5"></div>
      <div class="content1" v-html="paper3.text6"></div>
      <div class="bottom-bar">
        <div class="paper-link">
          <div>{{ paper3.link }}</div>
          <div>
            <a :href="paper3.linkUrl" target="_blank">{{ paper3.linkUrl }}</a>
          </div>
        </div>
        <div class="bottom-right">
          <div>{{ paper3.contributed }}</div>
          <div v-if="paper3.edited">{{ paper3.edited }}</div>
          <div v-if="paper3.reviewed">{{ paper3.reviewed }}</div>
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
import img1 from "@/assets/img/theme3-3-1.png";
import img2 from "@/assets/img/theme3-3-2.png";
import img3 from "@/assets/img/theme3-3-3.png";
const { locale } = useI18n();

// 引入路由
import { useRouter } from "vue-router";

const router = useRouter(); // 初始化路由实例

// 定义返回方法：跳转到nav-page1
const goBack = () => {
  router.push("/home/nav-page3");
};

const paper3 = computed(() => {
  if (locale.value === "english") {
    return {
      title:
        "Tsinghua and Harvard Research Teams Collaborate to Reveal Synergistic Benefits of Air Quality Improvement on Photovoltaic Power Generation and Carbon Neutrality Goals",
      subtitle: `This article is reproduced from the official website of Tsinghua University<a href='https://www.tsinghua.edu.cn/info/1175/94219.htm' target='_blank'></a>. Release date: May 6, 2022.`,
      text1: `Tsinghua News, May 6 (Correspondent Shi Chen) — Under the carbon neutrality goal, photovoltaic (PV) power generation capacity is expected to multiply. Air pollution can reduce PV power generation efficiency, undermining its "pollution and carbon reduction" benefits. However, systematic research on the impact of air pollution and its improvement on PV power generation in China remains limited. To address this issue, research teams from Tsinghua University's School of Environment and Institute for Carbon Neutrality, in collaboration with Harvard University, coupled potential assessment with stepwise linear regression statistical models. Using a temporal scale from 1995 to 2019 and a spatial framework covering China's terrestrial areas, they analyzed the temporal and spatial variability of PV power generation levels in key air pollution control regions and under different meteorological conditions, as well as the driving factors, quantifying the synergistic benefits of air quality improvement for PV power generation and carbon neutrality. This study is the first to integrate changes in air pollution levels and meteorological conditions into a unified analytical framework to comprehensively assess their impact on PV power generation in China. If the influence of concurrent meteorological factors on PV power generation is not considered, the synergistic benefits of air quality improvement over the past decade would be significantly underestimated.`,
      text2: `The study shows that since 2008, China's air quality improvement has had a significant positive effect on solar power generation. Excluding the impact of meteorological conditions, based on China's 2020 PV installed capacity, the air quality improvement in 2020 compared to 2008 could provide an additional 4.5 billion kWh of PV power generation nationwide, equivalent to 1.7% of China's total PV power generation in 2020. Regions under the North China, EastChina, and Southern Power Grids contributed 87% of this increase. This additional power generation translates to approximately 1.9 billion yuan in electricity sales revenue and potential reductions of 3.6 million tons of CO₂ emissions from coal-fired power plants, as well as reductions of 1.5, 1.4, and 0.2 kilotons of SO₂, NOx, and primary PM₂.₅ emissions, respectively. If China's air quality further improves by 2060 (using current Tibet levels as a reference target), the required PV installed capacity to achieve carbon neutrality would decrease by 5.7% compared to a scenario where air quality remains at 2008 levels.`,
      caption1:
        "Figure 1. Temporal evolution and trends of direct normal irradiance (DNI) and diffuse irradiance (DIF) potential in mainland China (A, B, C), the East China Power Grid (D, E, F), and the Tibet Power Grid (G, H, I). Grid colors represent trends from the starting year (x-axis) to the ending year (y-axis), with black dots indicating statistically significant trends.",
      text3: `The study first used a potential assessment model to evaluate hourly PV power generation characteristics in China from 1995 to 2019, decomposing the total potential into DNI and DIF contributions (Figure 1). The results show that from 1995 to 2019, China's total potential declined at a rate of 1.07% per decade, with DNI and DIF potentials decreasing at 1.85% per decade and increasing at 1.03% per decade, respectively. Regional variations were notable: unlike the overall trend, after 2008, the East China, Northeast, and North China Power Grids showed DNI and DIF potentials increasing at 3.20% per decade and decreasing at 5.70% per decade, respectively.`,
      caption2:
        "Figure 2. Decomposition of driving factors for variability in total potential (A), DNI potential (B), and DIF potential (C) in mainland China (annual potential change relative to the 25-year average). Red lines represent total potential output from the assessment model, while black lines represent the combined influence of factors from the statistical model.",
      text4: `The study further coupled a multifactor stepwise regression model to decompose the spatiotemporal variability of PV power generation (Figure 2). The results indicate that aerosol optical depth (AOD) and cloud area index (CAR) were the dominant influencing factors. Before 2008, AOD's impact on regions outside the Northwest Power Grid intensified at 1.08% per decade, with the fastest increase in the East China Power Grid at 4.89% per decade. After 2008, as China's air pollution control measures strengthened, AOD's influence declined at 0.92% per decade outside the Northwest Power Grid. The East China Power Grid saw the most significant reduction in AOD impact (3.11% per decade), restoring regional potential. However, in the Central China, Southern, and Tibet Power Grids, post-2008 increases in CAR and humidity impacts (2.17% per decade) fully offset the synergistic benefits of AOD reduction, leading to declining regional potential.`,
      caption3: "Figure 3. Graphical abstract",
      text5: `The study highlights the synergistic benefits of air quality improvement for PV power generation, climate governance, and air quality enhancement, providing valuable insights for China's dual goals of clean air and carbon neutrality. These findings also offer lessons for other countries facing climate change and air pollution challenges. Effective air pollution control measures will enhance PV power generation, reduce the need for power infrastructure and rare earth elements in PV production, and accelerate the replacement of high-carbon power sources, further improving air quality.\nOn April 28, the findings were published in One Earth, a sister journal of Cell, under the title "Improved air quality in China can enhance solar power performance and accelerate carbon neutrality targets" (Figure 3).`,
      text6: `Postdoctoral researcher Shi Chen from the School of Environment, Tsinghua University, is the first author, with Associate Professor Xi Lu from the School of Environment, Tsinghua University, and Professor Michael B. McElroy of Harvard University as the corresponding authors. The co-authors include Academician Hao Jiming, Academician Kebin He, Professor Wang Shuxiao, Chris P. Nielsen (Executive Director of the Harvard China Project), and Assistant Researcher Geng Guannan. This study was supported by the National Natural Science Foundation of China (Outstanding Youth Fund, Key Projects, and General Projects), the Tsinghua–INDITEX Sustainable Development Fund, the Office of the President of Harvard University and the Harvard Global Institute, the National Postdoctoral Program for Innovative Talents, and Tsinghua University’s “Shuimu Scholar” Program.`,
      link: "Paper link:",
      linkUrl:
        "https://www.sciencedirect.com/science/article/pii/S2590332222002032",
      contributed: "Contributed by: School of Environment",
      edited: "Edited by: Huashan Li",
      reviewed: "Reviewed by: Ting LYU",
    };
  } else {
    return {
      title:
        "清华与哈佛研究团队合作揭示空气质量提升对光伏发电与碳中和目标的协同效益",
      subtitle:
        '本文转自<a href="https://www.tsinghua.edu.cn/info/1175/94219.htm" target="_blank">“清华大学官网”</a>，发布时间：2022年5月6日',
      text1:
        '清华新闻网5月6日电（通讯员 陈诗）碳中和目标驱动下，光伏发电装机水平预计将成倍增长。空气污染将会降低光伏发电水平，有损光伏发电的"减污降碳"效益，然而，我国空气污染及其改善对光伏发电的影响仍缺乏系统研究。针对这一问题，清华大学环境学院、碳中和研究院与哈佛大学研究团队耦合潜力评估与逐步线性回归统计模型，以1995年至2019年为分析时间尺度，以覆盖我国陆上全域的数据格点为空间框架，针对性地解析空气污染控制重点区域及不同气象条件下光伏发电水平的时间、空间变动性及其驱动因素，量化了空气质量提升对光伏发电与实现碳中和的协同效益。本研究首次将空气污染水平与气象条件的变化纳入统一分析框架下，综合考察其对我国光伏发电的影响。若不考虑同期气象因素变动对光伏发电的影响，则近十年我国空气质量改善对光伏发电的协同效益将被显著低估。',
      text2:
        "研究表明，2008年以来，我国空气质量改善对中国太阳能发电水平有着显著的正效益。排除气象条件影响，以我国2020年太阳能光伏装机情况进行分析，与2008年相比，2020年空气质量的提升可为全国光伏装机带来45亿千瓦时的光伏发电增益，相当于我国2020年光伏年发电量的1.7%，其中，华北、华东及南方电网发电量增益贡献占比达87%。该发电增益可折算为约19亿元售电收入，以及替代煤电机组潜在的3.6百万吨二氧化碳减排量，1.5、1.4、0.2千吨二氧化硫、氮氧化物及一次细颗粒物减排量。如果2060年我国空气质量进一步提升（以当前西藏地区水平作为目标参考），则实现碳中和目标所需的光伏发电装机与空气质量水平维持在2008年水平的情景相比将下降5.7%。",
      caption1:
        "图1 中国大陆（A、B、C）及华东电网（D、E、F）和西藏电网（G、H、I）直射（DNI）潜力与散射（DIF）潜力的时间演变及趋势。格点颜色代表从起始年（横坐标）到终末年（纵坐标）的潜力变化趋势，黑色点状标记代表该趋势统计显著",
      text3:
        "该研究首先通过潜力评估模型逐小时评估了1995年至2019年我国光伏发电的小时级出力特征，并依据直射光和散射光对发电量的贡献将总潜力分解为直射潜力与散射潜力（图1）。研究发现，从1995年到2019年，我国总潜力呈现1.07%/10年的下降趋势，直射光与散射光贡献潜力分别呈1.85%/10年和1.03%/10年的下降与上升趋势。潜力变动特征区域差异明显，区别于总体长期趋势，2008年以后我国华东、东北及华北电网的直射潜力与散射潜力分别呈3.20%/10年和5.70%/10年的上升与下降趋势。",
      caption2:
        "图2 中国大陆总潜力（A）、直射潜力（B）与散射潜力（C）变动性（当年潜力相对于25年平均潜力变化）的驱动因素分解。红色折线代表潜力评估模型输出的总潜力值，黑色折线代表统计模型输出的影响因素驱动力的叠加值",
      text4:
        "研究进一步耦合了多因素逐步回归统计模型，对光伏发电水平的长时序时空变动特征进行因素分解（图2）。结果表明，气溶胶光学厚度（AOD）与云面积指数（CAR）为主导影响因素。2008年以前，AOD对全国除西北电网外地区的影响呈1.08%/10年的增强趋势，其中增速最快的地区为华东电网，增速为4.89%/10年。随着我国空气污染控制措施的逐步加严，2008年以后，AOD对全国除西北电网外地区的影响呈0.92%/10年的下降趋势。其中受益于积极有效的空气污染控制措施，AOD影响的降低在华东电网最为显著，以3.11%/10年的下降趋势恢复该地区潜力。而对于我国华中、南方与西藏电网而言，2008年以后CAR与湿度的影响以2.17%/10年速度加剧，完全抵消了AOD下降的协同效益，导致区域潜力呈下降趋势。",
      caption3: "图3 图形摘要",
      text5:
        "该研究揭示的空气质量改善对光伏发电、气候治理和空气质量提升的协同效益不仅对我国实现清洁空气与碳中和双重目标具有参考价值，对于其他面临气候变化和空气污染双重挑战的国家也具有积极借鉴意义。实施卓有成效的空气污染控制措施将有助于光伏发电水平的提升，减少实现脱碳目标所需的电力基础设施以及光伏生产中对土地、稀土元素的需求；而光伏发电水平的提升将加速其对传统高碳电源的取代，进一步提升空气质量。",
      text6:
        '4月28日，该成果以"我国空气质量的改善将提升太阳能发电水平并加速碳中和目标的实现"（Improved air quality in China can enhance solar power performance and accelerate carbon neutrality targets）为题在线发表于细胞（Cell）出版社姊妹刊《一个地球》（One Earth）（图3）。',
      link: "论文链接：",
      linkUrl:
        "https://www.sciencedirect.com/science/article/pii/S2590332222002032",
      contributed: "供稿：环境学院",
      edited: "编辑：李华山",
      reviewed: "审核：吕婷",
    };
  }
});
</script>

<style lang="scss" scoped>
.lay {
  width: 100%;
  height: 100%;
  .paperClass {
    width: 100%;
    height: 100%;
    padding: 0px 10px;
    overflow-x: hidden;
    overflow-y: auto;
    .article-title {
      width: 800px;
      margin-left: 50%;
      transform: translateX(-50%);
      line-height: 40px;
      font-weight: 700;
      font-size: 30px;
      color: #000;
      text-align: center;
      margin-bottom: 10px;
    }
    .sub-title {
      width: 100%;
      min-height: 40px;
      line-height: 1.8;
      font-weight: 700;
      font-size: 20px;
      color: #000;
      text-align: center;
      margin-bottom: 10px;
      :deep(a) {
        color: rgb(0, 0, 255);
        text-decoration: underline;
      }
    }
    .content1 {
      width: 100%;
      line-height: 2;
      font-size: 18px;
      padding-left: 15%;
      padding-right: 15%;
      color: #000;
      text-align: justify;
      text-indent: 2rem;
      margin-bottom: 10px;
      img {
        text-indent: 0;
      }
      div[style*="text-align:center"] {
        text-indent: 0;
      }
    }
    .bottom-bar {
      width: 100%;
      padding-left: 15%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      font-size: 15px;
      color: #000;
      line-height: 2;
      margin-top: 20px;
      .paper-link {
        font-size: 18px;
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
    }
    .bottom-right {
      width: 100%;
      padding-right: 15%;
      font-size: 18px;
      line-height: 2;
      color: #000;
      text-align: end;
      margin-top: 0;
      > div {
        margin-bottom: 5px;
      }
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
