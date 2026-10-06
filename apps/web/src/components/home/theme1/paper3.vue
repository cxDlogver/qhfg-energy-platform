<template>
  <div class="lay">
    <div class="paperClass">
      <div class="article-title">
        {{ paper4.title }}
      </div>
      <div class="sub_title" v-html="paper4.subtitle"></div>
      <div class="content1">{{ paper4.text1 }}</div>
      <div class="content1">{{ paper4.text2 }}</div>

      <div class="content1">
        <img
          :src="img1"
          alt="图1"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper4.img1annotation }}</div>

      <div class="content1">{{ paper4.text3 }}</div>

      <div class="content1">
        <img
          :src="img2"
          alt="图2"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper4.img2annotation }}</div>

      <div class="content1">{{ paper4.text4 }}</div>

      <div class="bottom-bar">
        <div class="paper-link">
          <div>{{ paper4.text5 }}</div>
          <div>
            <a :href="paper4.link" target="_blank">{{ paper4.link }}</a>
          </div>
        </div>
        <div class="bottom-right">
          <div>{{ paper4.bottom1 }}</div>
          <div>{{ paper4.bottom2 }}</div>
          <div>{{ paper4.bottom3 }}</div>
          <div>{{ paper4.bottom4 }}</div>
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
import img1 from "@/assets/img/theme1-4-1.png";
import img2 from "@/assets/img/theme1-4-2.png";

import { useRouter } from "vue-router";

const router = useRouter(); // 初始化路由实例

// 定义返回方法：跳转到nav-page1
const goBack = () => {
  router.push("/home/nav-page1");
};

const { locale } = useI18n();

// 保持原有内容不变
const paper4 = computed(() => {
  if (locale.value === "chinese") {
    return {
      title:
        "环境学院鲁玺课题组在我国陆上风电跨区域联合并网及开发优化布局方面取得新进展",
      subtitle: `本文转自 <a href=\"https://mp.weixin.qq.com/s/Hwi-QRmaCCs2b1dBe71FRg\" target=\"_blank\">清华大学环境学院</a> ，发布时间：2021年01月28日`,
      text1:
        "近日，清华大学环境学院鲁玺课题组在国际能源领域著名期刊《应用能源》（Applied Energy）发表题为《基于聚类分析的中国陆上风电开发优化布局研究》（Optimal allocation of onshore wind power in China based on cluster analysis）的研究论文。研究基于聚类分析方法首次对中国大陆风电资源的变动特性进行分区，并从风电时空变化特性的新视角探讨了风电资源规划开发策略，对碳中和目标下的风电等可再生能源的持续开发利用具有借鉴意义。",
      text2:
        "发展风力发电已成为我国减少二氧化碳排放、实现2060年前碳中和目标的重要战略。近15年来，我国风电装机容量迅速增长，但与此同时，风电固有的随机性、波动性及供需分布不平衡等问题也造成了严峻的弃风现象，影响了风电持续开发的潜力及其环境和气候变化效应的发挥。本研究基于GEOS-5四维同化气象场数据与K均值聚类算法，根据风电出力变动性将中国大陆划分为7个风区（图1a），并分析了各风区内风电变动特征；研究进一步探究了风电跨区域联合并网对提高供电质量的作用，构建了综合考虑风力发电量、短期波动性、风电可信容量的多目标跨区域风电装机规划空间优化模型，确定了2030年各风区风电装机容量的最优配置。",
      img1annotation:
        "图1  (a) 我国陆上风能资源分布及基于风电波动性的风区划分；(b) 各风区月平均风电容量因子曲线；(c) 各风区风电出力序列相关系数随空间距离变化；(d) 各风区日内风电容量因子变化曲线",
      text3:
        "研究结果表明，受主导天气系统及地理条件影响，各风区的风电季节波动性及日内变化特征存在显著差异（图1b与图1d），为跨区域风电联合并网降低变动性、提高可靠性提供了理论基础。研究结果进一步表明，在2030年全国陆上风电装机800GW的目标下，多目标优化情景（MultiObj）与维持目前风电装机分布比例的基准情景相比，风力发电量增长0.2%、平均每小时功率变化下降10.3%，可信容量提高3.7%（图2）。通过对各风区风电渗透率的进一步分析，研究指出了未来跨区域特高压输电线路建设与风电开发协调发展的重要性。研究结果为2030年前碳达峰及2060年前碳中和目标下我国电力系统绿色低碳转型及风电发展路径规划提供了基础参考。",
      img2annotation: "图2  各优化情景下各风区风电装机容量比例及风电供电指标",
      text4:
        "清华大学环境学院鲁玺副教授为论文通讯作者，环境学院博士生张憧宇为该论文的第一作者，英国贝尔法斯特女王大学Aoife Foley教授为该论文的共同通讯作者。本研究得到了国家重点研发计划、国家自然科学基金委、清华大学-INDITEX可持续发展基金、环境前沿技术北京实验室等项目支持。",
      text5: "论文链接：",
      link: "https://doi.org/10.1016/j.apenergy.2021.116482",
      bottom1: "来源：清华大学环境学院官网",
      bottom2: "编辑 | 迟彤彤",
      bottom3: "审核 | 张楠楠",
      bottom4: "责编 | 陈超",
    };
  } else {
    return {
      title:
        " Progress in Cross-regional Joint Grid Integration and Optimal Development Layout of Onshore Wind Power in China by Xi Lu's Group, School of Environment, Tsinghua University",
      subtitle: `This article is reproduced from <a href=\"https://mp.weixin.qq.com/s/Hwi-QRmaCCs2b1dBe71FRg\" target=\"_blank\">the official website of the School of Environment, Tsinghua University</a>, Release date: January 28, 2021`,
      text1:
        'SOE, Tsinghua University, January 27, 2021. Recently, Xi Lu, from SOE, from the School of Environment at Tsinghua University, together with his research group, published a paper titled "Optimal allocation of onshore wind power in China based on cluster analysis" on Applied Energy, a leading international journal in the field of energy. The study is the first to apply cluster analysis to identify the variability characteristics of wind power in the Chinese mainland. It also discusses the planning and development strategies of wind power from a novel perspective of the spatial and temporal variability characteristics of resources, which has implications for the sustainable development and utilization of renewable energy sources such as wind power under the goal of carbon neutrality.',
      text2:
        "Wind power has become a key strategy for China to reduce CO2 emissions and achieve carbon neutrality by 2060. In the past 15 years, China's installed wind power capacity has increased rapidly, but the inherent randomness and volatility of wind power and the unbalanced distribution of supply and demand have caused severe wind curtailment, affecting the potential for sustainable development of wind power and its environmental and climate change effects. This study applies GEOS-5 four-dimensional assimilated meteorological field data and K-mean clustering algorithm to differentiate seven wind zones in the Chinese mainland based on wind power output variations (Figure 1a), and analyzes the power variability characteristics within each zone. The study further explores the role of a joint inter-regional wind power grid in improving power supply quality. The study constructs a multi-objective optimization model that integrates wind power capacity, short-term volatility, and wind power reliable capacity, thus determines the optimal configuration of installed wind power capacity in each wind zone in 2030.",
      img1annotation:
        "Figure 1. (a) Distribution of China's onshore wind energy resources and division of wind zones based on wind power volatility; (b) Wind zone’s monthly average wind power capacity factor curve; (c) Wind zone’s variations of wind power output correlation coefficient with spatial distance; (d) Wind zone’s intra-day wind power capacity factor variations",
      text3:
        "The study results show significant variations in the seasonal and intra-day capacity factors of wind power in each wind zone due to the dominant weather system and geographical conditions (Figure 1b and Figure 1d). This finding provides a theoretical basis for reducing variability and improving the reliability of a joint inter-regional wind power grid. The study further demonstrates that to obtain 800 GW of onshore wind power installed nationwide by 2030, the multi-objective optimization scenario (MultiObj) results in a 0.2% increase in wind power capacity, a 10.3% decrease in average hourly power variation, and a 3.7% increase in reliable capacity compared to the baseline scenario that maintains the current distribution ratio of installed wind power (Figure 2). Through further analysis of each zone’s wind power penetration, the study points out the significance of coordinating cross-regional UHV transmission lines with wind power development in the future. The study results provide a foundational reference for the green and low-carbon transition of China's power system and wind power development path planning under the goal of carbon peaking by 2030 and carbon neutrality by 2060.",
      img2annotation:
        "Figure 2. Installed wind power ratio and wind power supply indicators under each optimization scenario",
      text4:
        " Associate Professor Xi Lu from the School of Environment, Tsinghua University, is the corresponding author of the paper. PhD student Chongyu Zhang from the School of Environment is the first author. Professor Aoife Foley of Queen's University Belfast, UK, is the co-corresponding author of the paper. This study was supported by the National Key Research and Development Program,the National Natural Science Foundation of China, The Tsinghua University-INDITEX Sustainable Development Fund, and the Beijing Laboratory of Environmental Frontier Technology.",
      text5: "Paper link:",
      link: "https://doi.org/10.1016/j.apenergy.2021.116482",
      bottom1:
        "Source: Official website of the School of Environment, Tsinghua University",
      bottom2: "Editor | Tongtong Chi",
      bottom3: "Review | Nannan Zhang",
      bottom4: "Editor-in-Chief | Chao Chen",
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
    .bottom-left,
    .image-annotation {
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
