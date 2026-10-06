<template>
  <div class="lay">
    <div class="paperClass">
      <div class="article-title">{{ paper2.title }}</div>
      <div class="sub-title" v-html="paper2.subtitle"></div>
      <div class="content1" v-html="paper2.text1"></div>
      <div class="content1" v-html="paper2.text2"></div>
      <div class="content1" v-html="paper2.text3"></div>

      <!-- 图片1：统一样式并包裹在content1中 -->
      <div class="content1">
        <img
          :src="img1"
          alt="论文在线发表首页"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper2.img1Caption }}</div>

      <div class="content1" v-html="paper2.text4"></div>

      <!-- 图片2：统一样式并包裹在content1中 -->
      <div class="content1">
        <img
          :src="img2"
          alt="风电光伏布局优化结果图"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper2.img2Caption }}</div>

      <div class="content1" v-html="paper2.text5"></div>

      <!-- 图片3：统一样式并包裹在content1中 -->
      <div class="content1">
        <img
          :src="img3"
          alt="不同情景下储能装机容量图"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper2.img3Caption }}</div>

      <div class="content1" v-html="paper2.text6"></div>

      <!-- 图片4：统一样式并包裹在content1中 -->
      <div class="content1">
        <img
          :src="img4"
          alt="特高压传输网络建设情况图"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper2.img4Caption }}</div>

      <div class="content1" v-html="paper2.text7"></div>

      <!-- 图片5：统一样式并包裹在content1中 -->
      <div class="content1">
        <img
          :src="img5"
          alt="不同土地利用政策优化结果图"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper2.img5Caption }}</div>

      <div class="content1" v-html="paper2.text8"></div>

      <!-- 底部信息：统一使用bottom-bar布局 -->
      <div class="bottom-bar">
        <div class="paper-link">
          <div>{{ $t("common.link") }}</div>
          <div>
            <a :href="paper2.paperLink" target="_blank">{{
              paper2.paperLink
            }}</a>
          </div>
        </div>
        <div class="bottom-right">
          <!-- 保留底部右侧结构，内容为空 -->
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
import img1 from "@/assets/img/theme2-2-1.png";
import img2 from "@/assets/img/theme2-2-2.png";
import img3 from "@/assets/img/theme2-2-3.png";
import img4 from "@/assets/img/theme2-2-4.png";
import img5 from "@/assets/img/theme2-2-5.png";

const { locale } = useI18n();

// 引入路由
import { useRouter } from "vue-router";

const router = useRouter(); // 初始化路由实例

// 定义返回方法：跳转到nav-page1
const goBack = () => {
  router.push("/home/nav-page2");
};

// 内容完全保留，未做修改
const paper2 = computed(() => {
  if (locale.value === "chinese") {
    return {
      title: "高时空分辨率电力系统优化模型揭示碳中和目标下可再生能源发展布局",
      subtitle:
        '本文转自<a href="https://www.icon.tsinghua.edu.cn/info/1066/1466.htm" target="_blank">清华大学碳中和研究院</a>，发布时间：2024年03月01',
      text1:
        "近日，清华大学碳中和研究院气候治理与碳金融研究中心、能源环境经济研究所张希良教授、张达副教授团队与清华大学碳中和研究院、环境学院鲁玺教授团队联合美国加州大学圣迭戈分校（UCSD）Michael R. Davidson助理教授团队、中国气象科学研究院张小曳院士团队，开发了具有高时空精度的可再生能源布局与电力系统优化模型（Renewable Energy Siting and Power-system Optimization Model, RESPO），并使用该模型研究了我国未来长期碳中和目标下的可再生能源发展布局优化。分析结果显示，在我国2060年度电力需求为15.4万亿度的假设下，我国需要分别部署20亿~40亿千瓦的风电和光伏装机，同时应重视发展储能系统和扩大特高压跨省传输网络。",
      text2:
        "发展以风力和光伏发电为代表的可再生能源是推动我国电力系统低碳转型、实现碳中和目标的重要途径。建设高比例可再生能源的电力系统，需要综合考虑风光资源、地理特征、土地利用和电网消纳能力等因素，以进行资源配置。长期以来，由于提升时空分辨率会增加电力系统优化模型复杂度、带来求解困难，因此，针对我国可再生能源发展的电力系统容量扩张和运行优化模型在时空分辨率上精度有限，难以充分刻画可再生能源发电在时间和空间两个维度上的异质性。",
      text3:
        "为此，联合研究团队开发了RESPO模型，首次实现了电力系统优化模型同时在格点（约31km×25km）和全年8760小时逐小时级别对大区域尺度（中国内地）的可再生能源容量扩张和运行调度进行优化。2月26日，研究论文以Spatially Resolved Land and Grid Model of Carbon Neutrality in China(《支撑碳中和目标的高精度土地利用和电力规划模型》)为题，在线刊登于《美国科学院院刊》（Proceedings of the National Academy of Sciences，PNAS）。",
      img1Caption: "图1. 论文在线发表首页",
      text4:
        "研究团队使用RESPO模型针对我国未来长期碳中和目标下的可再生能源发展布局优化开展研究，设计了涵盖不同风电光伏投资成本、储能建设成本、跨省传输线路建设成本、火力发电灵活性、电力系统负排放目标、土地利用政策严格程度和模型时空分辨率假设的34组情景进行分析比较。研究基准情景结果显示，在我国2060年度电力需求为15.4万亿度的假设下，我国需要分别部署20亿~40亿千瓦的风电和光伏装机，其中80%的光伏装机和55%的风电装机集中在电力负荷中心100公里范围以内（如图2所示）。",
      img2Caption:
        "图2. RESPO模型在2060年碳中和背景下的风电光伏布局优化结果，(A)和(B)：格点级风电与光伏的装机容量；(C)和(D)：风电和光伏接入到各用电负荷中心的装机容量；(E)和(F)：与接入的负荷中心距离—风电和光伏装机容量累计分布",
      text5:
        "此外，发展储能系统和扩大特高压跨省传输网络是提高电力系统的可再生能源消纳和安全保供能力的重要发展方向。基准情景结果显示，为了保障约60亿千瓦规模的风光消纳，需要建设超过5亿千瓦的抽水蓄能和超过7亿千瓦的电化学储能装机；当允许模型考虑部署以压缩空气储能（20小时放电容量）和液流电池（10小时放电容量）为代表的长时储能技术时，长时储能装机可能达到3亿千瓦的规模。",
      img3Caption: "图3. 不同情景下储能的装机容量",
      text6:
        "研究的基准情景结果还显示，2060年的跨省传输容量将提高到2020年水平约3倍。其中，扩张幅度最大的区域线路为蒙西—山东（由约1000万千瓦提高到9000万千瓦）；部分其他重要的南北方向电力传输通道也需要进一步加强，例如福建—浙江需要新增约7000万千瓦容量将福建的海风发电输送至浙江。图4显示了跨省电力传输（子图A1）、总容量（子图B1）与相对2020年的新增容量（子图C1）情况。",
      img4Caption:
        "图4. 2060年基准情景下特高压传输网络建设情况，(A)：跨省净电量流向；(B)：区域间总的传输容量；(C)：新建传输容量",
      text7:
        "为评估土地利用政策严格程度对于相关结果的影响，研究还分别针对风电和集中式光伏的可建设潜力设计了高、中、低三个情景，形成3×3共计九种情景。模型结果显示，当可供集中式光伏建设用地假设更加保守时，分布式光伏将在一定程度上替代集中式光伏装机；在高电力需求和农业大省，能源与粮食的用地竞争更加明显，一些东部省份将利用几乎所有可供集中式光伏建设的土地。相比之下，不同土地利用假设对风电装机结果影响有限。图5显示了不同土地利用情景下的装机容量（子图A）、平均供电成本（子图B）、风光装机（子图C）、分电网区域装机（子图D）、跨省传输通道容量（子图E）与储能装机容量（子图F）情况。",
      img5Caption:
        "图5. 不同土地利用政策严格程度下的优化结果，(A)：各发电技术最优装机容量；(B)：电力系统(不含配电)度电平均成本构成；(C)：风电和光伏的装机容量；(D)：不同区域风电和光伏的装机容量；(E)：传输线路容量；(F)：储能装机容量",
      text8:
        "研究团队未来将以该研究开发的高时空分辨率电力系统优化建模框架为基础，进一步推进交叉学科研究，深入分析我国电力系统转型路径中的关键科学问题。研究得到国家自然科学基金（“面向我国碳中和最优路径实现的自然—社会系统多尺度相互作用模式耦合、数据监测支持和决策支撑研究的顶层设计”重点专项和“我国中长期风能与太阳能发电协同发展的布局优化和激励机制研究”面上项目），以及清华大学原创探索计划（“追光专项”）的支持。",
      paperLink: "https://www.pnas.org/doi/10.1073/pnas.2306517121",
    };
  } else {
    return {
      title:
        "High Spatiotemporal Resolution Power System Optimization Model Reveals Layout of Renewable Energy under Carbon Neutrality Goals",
      subtitle:
        'Source: Official website of Institute for Carbon Neutrality, Tsinghua University (<a href="https://www.icon.tsinghua.edu.cn/info/1066/1466.htm" target="_blank">Original link</a>), published on March 01, 2024.',
      text1: `Recently, the research team led by Professor Xiliang Zhang and Associate Professor Da Zhang from the Center for Climate Governance and Carbon Finance, the Institute of Energy, Environment and Economy, and the Institute for Carbon Neutrality at Tsinghua University collaborated with Professor Xi Lu’s team from the Institute for Carbon Neutrality and the School of Environment at Tsinghua University, Assistant Professor Michael R. Davidson’s team from the University of California, San Diego (UCSD), and Academician Xiaoye Zhang’s team from the Chinese Academy of Meteorological Sciences. Together, they developed the Renewable Energy Siting and Power-system Optimization (RESPO) model with high spatiotemporal precision. The model was used to study the optimal layout of renewable energy under China's long-term carbon neutrality target. The analysis shows that under the assumption of an annual electricity demand of 15.4 trillion kWh in 2060, China needs to deploy 2-4 billion kW of wind and photovoltaic (PV) installations, while emphasizing the development of energy storage systems and the expansion of ultra-high voltage (UHV) cross-provincial transmission networks.`,
      text2: `Developing renewable energy represented by wind and PV power is a crucial pathway to promote the low-carbon transformation of China's power system and achieve carbon neutrality. Constructing a power system with a high proportion of renewable energy requires comprehensive consideration of factors such as wind-solar resources, geographical features, land use, and grid integration capacity for optimal resource allocation. For a long time, improving spatiotemporal resolution has increased the complexity of power system optimization models and posed solving difficulties, resulting in limited precision in spatiotemporal resolution for models addressing China's renewable energy development, power system capacity expansion, and operational optimization. These models struggle to fully characterize the heterogeneity of renewable energy generation in both temporal and spatial dimensions.`,
      text3: `To address this, the joint research team developed the RESPO model, which for the first time enables power system optimization models to optimize large-scale regional (mainland China) renewable energy capacity expansion and operational scheduling at both grid cell level (approximately 31km×25km) and hourly resolution throughout the year (8,760 hours). On February 26, the research paper titled "Spatially Resolved Land and Grid Model of Carbon Neutrality in China" was published online in Proceedings of the National Academy of Sciences (PNAS).`,
      img1Caption:
        "Figure 1. Front page of the online publication of the paper",
      text4: `Using the RESPO model, the research team conducted studies on the optimal layout of renewable energy under China's long-term carbon neutrality target, designing 34 scenarios for comparative analysis. These scenarios covered different assumptions, including wind-PV investment costs, energy storage construction costs, cross-provincial transmission line construction costs, thermal power flexibility, power system negative emission targets, strictness of land use policies, and model spatiotemporal resolution. The baseline scenario results show that under the assumption of an annual electricity demand of 15.4 trillion kWh in 2060, China needs to deploy 2-4 billion kW of wind and PV installations, with 80% of PV installations and 55% of wind installations concentrated within 100 kilometers of power load centers (as shown in Figure 2).`,
      img2Caption:
        "Figure 2. Optimal layout of wind and PV power in the context of carbon neutrality in 2060 by the RESPO model. (A) and (B): Grid cell-level installed capacity of wind and PV; (C) and (D): Installed capacity of wind and PV connected to each power load center; (E) and (F): Cumulative distribution of installed capacity of wind and PV by distance from the connected load centers",
      text5: `Additionally, developing energy storage systems and expanding UHV cross-provincial transmission networks are important directions to enhance the renewable energy integration and security supply capacity of the power system. Baseline scenario results show that to ensure the integration of approximately 6 billion kW of wind-solar power, more than 500 million kW of pumped hydro storage and more than 700 million kW of electrochemical energy storage installations are needed. When the model is allowed to consider the deployment of long-duration energy storage technologies represented by compressed air energy storage (20-hour discharge capacity) and flow batteries (10-hour discharge capacity), the long-duration energy storage installation may reach a scale of 300 million kW.`,
      img3Caption:
        "Figure 3. Installed capacity of energy storage under different scenarios",
      text6: `The baseline scenario results also show that cross-provincial transmission capacity in 2060 will increase to approximately three times the 2020 level. Among them, the most expanded regional line is Mengxi-Shandong (from approximately 10 million kW to 90 million kW). Some other important north-south power transmission corridors also need further strengthening. For example, Fujian-Zhejiang needs to add approximately 70 million kW of capacity to transmit Fujian's offshore wind power to Zhejiang. Figure 4 shows the cross-provincial power transmission (subgraph A1), total capacity (subgraph B1), and new capacity relative to 2020 (subgraph C1).`,
      img4Caption:
        "Figure 4. Construction of UHV transmission networks in the baseline scenario for 2060. (A): Cross-provincial net power flow; (B): Total inter-regional transmission capacity; (C): Newly built transmission capacity",
      text7: `To evaluate the impact of land use policy strictness on the results, the study designed high, medium, and low scenarios for the construction potential of wind power and centralized PV, forming 3×3=9 scenarios. The model results show that when the assumption of available land for centralized PV construction is more conservative, distributed PV will partially replace centralized PV installations. In provinces with high electricity demand and major agricultural production, the competition for land between energy and food is more pronounced, and some eastern provinces will use almost all available land for centralized PV construction. In contrast, different land use assumptions have limited impact on wind power installation results. Figure 5 shows the installed capacity (subgraph A), average power supply cost (subgraph B), wind-PV installation (subgraph C), installation by power grid region (subgraph D), cross-provincial transmission channel capacity (subgraph E), and energy storage installed capacity (subgraph F) under different land use scenarios.`,
      img5Caption:
        "Figure 5. Optimization results under different land use policy strictness levels. (A): Optimal installed capacity of each power generation technology; (B): Composition of the average cost per kWh of the power system (excluding distribution); (C): Installed capacity of wind and PV; (D): Installed capacity of wind and PV in different regions; (E): Transmission line capacity; (F): Installed capacity of energy storage",
      text8: `In the future, the research team will build on the high-spatiotemporal resolution power system optimization modeling framework developed in this study to further advance interdisciplinary research and deeply analyze key scientific issues in the transformation path of China's power system. The research was supported by the National Natural Science Foundation of China (key project "Top-Level Design for Multi-Scale Interaction Mode Coupling, Data Monitoring Support, and Decision Support Research of Natural-Social Systems for Achieving China's Optimal Carbon Neutrality Path" and general project "Research on Layout Optimization and Incentive Mechanisms for Coordinated Development of Medium- and Long-Term Wind and Solar Power in China"), as well as the Tsinghua University Original Exploration Program ("Chasing Light Special Project").`,
      paperLink: "https://www.pnas.org/doi/10.1073/pnas.2306517121",
    };
  }
});
</script>

<style lang="scss" scoped>
/* 完全复用主题三的样式规则 */
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
      /* 修改图片注释的边距与正文一致 */
      padding-left: 15%;
      padding-right: 15%;
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
        width: 100%;
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
    /* 移除原样式中与主题三格式冲突的定义 */
    .sub-title,
    .bottom-right {
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
