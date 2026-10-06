<template>
  <div class="lay">
    <div class="paperClass">
      <div class="article-title">{{ paper4.title }}</div>
      <div class="sub-title" v-html="paper4.subtitle"></div>

      <div class="content1" v-html="paper4.text1"></div>
      <div class="content1" v-html="paper4.text2"></div>

      <!-- 图片1：统一包裹在content1中 -->
      <div class="content1">
        <img
          :src="img1"
          alt="全球太阳能光伏发电净减排空间分布"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper4.img1Caption }}</div>

      <div class="content1" v-html="paper4.text3"></div>
      <div class="content1" v-html="paper4.text4"></div>

      <!-- 图片2：统一包裹在content1中 -->
      <div class="content1">
        <img
          :src="img2"
          alt="多情景全球太阳能光伏发电排放与减排"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper4.img2Caption }}</div>

      <div class="content1" v-html="paper4.text5"></div>
      <div class="content1" v-html="paper4.text6"></div>
      <div class="content1" v-html="paper4.text7"></div>
      <div class="content1" v-html="paper4.text8"></div>

      <!-- 论文链接：统一边距 -->
      <div
        class="content1"
        style="
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        "
      >
        <div class="bottom-left" style="text-indent: 0">
          <div style="text-align: left; margin-bottom: 0; font-size: 18px">
            {{ $t("common.link") }}
          </div>
          <div style="text-align: left; margin-bottom: 10px; font-size: 18px">
            <a
              :href="paper4.paperLink"
              target="_blank"
              style="text-decoration: none; color: #000"
              >{{ paper4.paperLink }}</a
            >
          </div>
        </div>

        <div class="bottom-right" v-html="paper4.bottomInfo"></div>
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
import img1 from "@/assets/img/theme2-4-1.png";
import img2 from "@/assets/img/theme2-4-2.png";

// 引入路由
import { useRouter } from "vue-router";

const router = useRouter(); // 初始化路由实例

// 定义返回方法：跳转到nav-page1
const goBack = () => {
  router.push("/home/nav-page2");
};

const { locale } = useI18n();

// 内容完全保留，未做修改
const paper4 = computed(() => {
  if (locale.value === "chinese") {
    return {
      title:
        "环境学院鲁玺团队合作揭示全球光伏产业链温室气体排放与减排的时空分布特征",
      subtitle:
        '本文转自<a href="https://www.env.tsinghua.edu.cn/info/1129/8429.htm" target="_blank">清华大学环境学院官网</a>，发布时间：2023年10月12',
      text1:
        "清华大学环境学院2023年10月12日电（通讯员 陈诗） 在全球净零排放目标驱动下，光伏发电将成为未来全球温室气体减排的重要推动力量，因此，明确其全产业链的排放和减排特征对于发挥其低碳效益至关重要。近年来，光伏产业链的全球分布格局呈现复杂多变、区域差异显著等特点，生产侧和应用侧均有向中国集群的趋势。除产业链分布外，排放和减排特征也受到各国产业链排放和减排强度差异的影响。为厘清多因素影响下排放和减排时空特征，清华大学环境学院鲁玺教授团队联合国内外学者，构建了动态化和空间化的生命周期评估方法，在剖析产业分布格局、排放和减排强度两大类影响因素的基础上，对历史和未来全球产业链的排放与减排特征进行了核算。",
      text2:
        "研究定义净减排量，即使用光伏发电技术实现的温室气体减排量减去光伏产业链的排放量，来刻画各国使用光伏技术进行低碳转型的效果（图1）。在2009-2019年期间，全球累积净温室气体减排约为1288.5百万吨二氧化碳当量（CO2e），相当于同一时期全球CO2排放的0.36%。其中光伏装机贡献1968.8百万吨CO2e减排量，由光伏产业链排放产生的680.3百万吨排放部分抵消这一减排效果。净减排贡献最高的五个国家为中国、日本、美国、德国和印度，分别贡献266.3百万吨、198.2百万吨、167.9百万吨、157.3百万吨和144.0百万吨净减排量，合计占全球总量72.5%。中国贡献了全球光伏减排量的35.8%，承担了全球66.1%的产业链碳排放，且50%以上中国产生的排放服务于别国光伏装机市场。",
      img1Caption:
        "图1.全球太阳能光伏发电净减排空间分布差异显著。（a）2009-2019年净减排效果的国别分布特征；（b）2009-2019年全球减排与排放的变化趋势及主要贡献国家",
      text3:
        "该全球分布格局除生产装机格局外，受到各国排放和减排强度的时空变迁影响。从排放强度来看，得益于电网清洁程度提升、生产流程技术进步与效率提升，各国生产排放强度有不同程度下降。作为最大生产国的中国，其生产每千瓦光伏发电系统的排放强度在2009-2019年期间下降79.2%。从减排强度，即单位装机所能带来的温室气体减排能力来看，2009-2019年期间全球减排强度下降11.1%。各区域下降速度差异明显，得益于电力部门迅速的脱碳进程，欧洲地区的减排强度下降最显著，同期下降24.9%，而非洲和欧亚地区的温室气体减排强度下降幅度则分别仅为5.4%和-3.7%。",
      text4:
        "在各国纷纷出台相关贸易保护和提升自主生产能力政策的背景下，全球光伏产业链未来格局存在较大的不确定性。研究通过组合三类生产和三类装机情景，对未来光伏全球产业链的温室气体净减排能力进行了评估（图2）。研究表明，对净减排总量影响更为显著的是装机情景。至2060年，若基于现状扩大装机（C1），温室气体的累积减排量在865-1458亿吨之间；若全球实现均衡装机情景（C2），则减排量增加至1007-1566亿吨；若进一步优化装机开发时序以充分利用各国在温室气体减排强度方面的比较优势（C3），全球温室气体减排将进一步增加至1717-2447亿吨。这一优化情景下，非洲、亚欧大陆、中东、东南亚地区的装机水平将显著提升。",
      img2Caption:
        "图2.2020-2060年多情景全球太阳能光伏发电排放与减排的时空变化。（a）累计减排量;（b）各装机情景减排量差异及区域贡献；（c）累计排放量；（d）各生产情景产业链排放的国别贡献",
      text5:
        "最优装机和最优生产情景组合将能够为全球全产业链带来975亿吨净减排的增量，约相当于2020年全球温室气体排放的1.9倍，或1.5℃全球温升目标下剩余碳排放额度的23.2%。该研究工作通过对全球光伏产业链温室气体排放与减排的时空特征进行回顾和预测，从环境维度揭示了我国对全球光伏产业减排进程的历史贡献，研究展望的各情景下温室气体净减排效益的差异对于推进全球合作，以加速实现全球光伏发电的温室气体减排效益具有重要的启示和借鉴意义，并提示在开发和应用低碳技术时，需要特别关注技术的环境和气候效益在不同时空条件下的变化特征，从而协助制定更具效率的决策。",
      text6:
        "近日，该成果以“在高碳地区优先部署光伏发电会带来更多的碳减排效益”（Deploying solar photovoltaic energy first in carbon-intensive regions brings gigatons more carbon mitigations to 2060）为题在线发表于施普林格·自然（Springer Nature）出版社期刊《通讯·地球&环境》（Communications Earth & Environment）。",
      text7:
        "清华大学环境学院博士后陈诗为论文第一作者，环境学院鲁玺教授和哈佛大学迈克尔·麦克尔罗伊（Michael B. McElroy）教授为共同通讯作者，郝吉明院士，贺克斌院士，美国哈佛大学中国项目执行主任克里斯·尼尔森（Chris P. Nielsen），纽约城市大学何钢助理教授，国际应用系统分析研究所张少辉研究员，清华大学气候变化与可持续发展研究院院长助理、研究部主任杨秀，清华大学公共管理学院张芳助理教授为共同作者。",
      text8:
        "该研究得到国家自然科学重点项目、面上项目、青年项目，清华大学-INDITEX可持续发展基金资助项目、鄂尔多斯-清华大学碳中和协同创新专项、清华-丰田联合研究院跨学科专项、哈佛大学校长办公室及哈佛全球研究所资助项目、国家博士后创新人才支持计划和清华大学“水木学者”计划等的资助。",
      paperLink: "https://www.nature.com/articles/s43247-023-01006-x",
      bottomInfo: "供稿：环境学院<br>编辑：李华山<br>审核：郭玲",
    };
  } else {
    return {
      title:
        "Xi Lu’s Team from the School of Environment Reveals the Spatiotemporal Distribution and Mitigation Potential of Greenhouse Gas Emissions in the Global Photovoltaic Industry Chain.",
      subtitle:
        'This article is reproduced from the official website of the School of Environment, Tsinghua University (<a href="https://www.env.tsinghua.edu.cn/info/1129/8429.htm" target="_blank">Original link</a>). Release date: October 12, 2023.',
      text1: `Report from the School of Environment, Tsinghua University on October 12, 2023 (correspondent: Shi Chen). Driven by the global net-zero emissions goal, photovoltaic power generation is set to become a crucial driving force for future global greenhouse gas (GHG) mitigation. Therefore, it is of paramount importance to clarify the emissions and mitigation characteristics of its entire industry chain to fully leverage its low-carbon benefits. In recent years, the global distribution pattern of the photovoltaic industry chain has exhibited complex and dynamic features, with significant regional disparities, showing a trend of clustering towards China on both the manufacture and installation sides. Apart from the distribution of the industry chain, emissions and mitigation characteristics are also influenced by differences in emissions and mitigation intensities in different countries' industry chains. To elucidate the spatiotemporal characteristics of emissions and mitigation under the influence of multiple factors, Professor Xi Lu's team at Tsinghua University's School of Environment, in collaboration with academics from both domestic and international institutions, has developed a spatialized-dynamic life-cycle assessment method. Building upon the analysis of industry distribution patterns and the spatial-temporal evolution of emissions and mitigation intensities, they conducted a comprehensive assessment of the historical and future emissions and mitigation characteristics of the global industry chain.`,
      text2: `The study defines net GHG mitigation as the GHG mitigation achieved using photovoltaic power generation technology minus the emissions from the photovoltaic industry chain, depicting the effectiveness of each country's use of photovoltaic technology for low-carbon transition (Figure 1). During the period from 2009 to 2019, the global cumulative net GHG mitigation was approximately 1,288.5 million tons of carbon dioxide equivalent (CO2e), equivalent to 0.36% of global CO2 emissions during the same period. Among this, photovoltaic installed capacity contributed 1,968.8 million tons of CO2e mitigation, while emissions of 680.3 million tons from the photovoltaic industry chain partially offset this mitigation. The top five countries with the highest net mitigation contributions are China, Japan, the United States, Germany, and India, contributing 266.3 million tons, 198.2 million tons, 167.9 million tons, 157.3 million tons, and 144.0 million tons of net GHG mitigation respectively, totaling 72.5% of the global total. China contributed 35.8% of the global photovoltaic GHG mitigation, and 66.1% of the GHG emissions from the global industry chain, with over 50% of China's emissions serving the photovoltaic installation market in other countries.`,
      img1Caption:
        "Figure 1. Significant spatial difference in net GHG mitigation of global solar photovoltaic power generation. (a) National distribution characteristics of net GHG mitigation from 2009 to 2019; (b) Global trends in GHG mitigation and emissions, and major contributing countries from 2009 to 2019",
      text3: `The global distribution pattern is influenced not only by global manufacture and installation patterns but also by the spatiotemporal dynamics in emissions and mitigation intensity in different countries. Looking at emissions intensity, countries experienced a decline in emission intensity to varying degrees, thanks to the improvement of power grid emissions factor, technological progress, and efficiency improvement in manufacture processes. China, as the largest manufacturer, saw a 79.2% decrease in emissions intensity per kilowatt of photovoltaic power generation system from 2009 to 2019. Regarding mitigation intensity, namely the GHG mitigation per unit installed capacity, global mitigation intensity decreased by 11.1% from 2009 to 2019. There were significant differences in the rate of decline among regions. Due to the rapid decarbonization process in the power sector, the mitigation intensity in Europe decreased the most, with a decline of 24.9% during the same period, while Africa and Eurasia saw reductions of only 5.4% and -3.7%, respectively.`,
      text4: `Against the backdrop of countries implementing trade protection and policies to enhance independent manufacture capacity, there is considerable uncertainty in the future global photovoltaic industry chain. The study assessed the net GHG mitigation of the global photovoltaic industry chain in the future by combining three types of manufacture and installation scenarios (Figure 2). The research indicates that the installation scenario has a more significant impact on the net GHG mitigation total. By 2060, if new installations lock in the current pattern (C1), the cumulative GHG mitigation will be between 86.5 billion and 145.8 billion tons. If new installations are balanced across nations (C2), the GHG mitigation will increase to between 100.7 billion and 156.6 billion tons. If the installation development sequence is further optimized to fully utilize the comparative advantages in GHG mitigation intensity among nations (C3), global GHG mitigation will further increase to between 171.7 billion and 244.7 billion tons. In this optimized scenario, the installation capacity in Africa, Eurasia, the Middle East, and Southeast Asia will significantly increase.`,
      img2Caption:
        "Figure 2. Spatiotemporal dynamics in global solar photovoltaic power generation GHG emissions and mitigation under multiple scenarios from 2020 to 2060. (a) Cumulative GHG mitigation; (b) Differences in GHG mitigation among different installation scenarios and regional contributions; (c) Cumulative emissions levels; (d) Country-specific contributions to industry chain emissions under different manufacture scenarios",
      text5: `The combination of optimal installation and manufacture scenarios will bring an additional 97.5 billion tons of net GHG mitigation to the global industry chain, approximately equivalent to 1.9 times the global GHG emissions in 2020 or 23.2% of the remaining carbon emission quota under the 1.5°C global warming target. By reviewing and predicting the spatiotemporal characteristics of GHG emissions and mitigation in the global photovoltaic industry chain, this study reveals China's historical contributions to the global photovoltaic industry's GHG mitigation from an environmental perspective. The differences in the net GHG mitigation intensity and mitigation under various scenarios anticipated by the study provide fundamental insights and lessons for promoting global cooperation to accelerate the GHG mitigation of global photovoltaic power generation. It also highlights the need to pay special attention to the variation characteristics of environmental and climate benefits of technology under different spatial and temporal conditions when developing and applying low-carbon technologies, thereby assisting in the formulation of more efficient decisions.`,
      text6: `The research findings, titled "Deploying solar photovoltaic energy first in carbon-intensive regions brings gigatons more carbon mitigations to 2060", were recently published online in the journal "Communications Earth & Environment" by Springer Nature.`,
      text7: `Dr. Shi Chen, a postdoctoral researcher at the School of Environment, Tsinghua University, is the first author of the article. Professor Xi Lu from the School of Environment, Tsinghua University and Professor Michael B. McElroy from Harvard University are co-corresponding authors. The co-authors include Academician Hao Jiming, Academician Kebin He, Chris P. Nielsen, Executive Director of the Harvard China Project, Assistant Professor He Gang from the City University of New York, Zhang Shaohui, a research scholar from the International Institute for Applied Systems Analysis, Yang Xiu, Assistant to the Dean and Research Director of the Institute of Climate Change and Sustainable Development at Tsinghua University, and Assistant Professor Zhang Fang from the School of Public Policy and Management at Tsinghua University are co-authors.`,
      text8: `This research received support from the Natural Science Foundation of China, the Tsinghua University-INDITEX Sustainable Development Fund, the Ordos-Tsinghua Innovative & Collaborative Research Program in Carbon Neutrality, the Tsinghua-Toyota Joint Research Institute Cross-discipline Program,the Office of the President of Harvard University and the Harvard Global Institute grants to the Harvard-China Project on Energy, Economy, and Environment, the Postdoctoral Innovative Talent Support Program, and the Shui Mu Tsinghua Scholar Program.`,
      paperLink: "https://www.nature.com/articles/s43247-023-01006-x",
      bottomInfo:
        "Source: School of Environment<br>Editor: Huashan Li<br>Review: Ling Guo",
    };
  }
});
</script>

<style lang="scss" scoped>
/* 完全复用主题三paper1的样式规则 */
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
    .sub-title {
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
        color: rgb(0, 0, 255) !important;
        text-decoration: underline !important;
      }
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
    .buttom_bar {
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
      /* 图片注释边距与正文一致 */
      padding-left: 15%;
      padding-right: 15%;
      text-align: center;
      margin-bottom: 10px;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    .bottom-right {
      font-size: 18px;
      line-height: 40px;
      color: #000;
      text-align: end;
      margin-top: 20px;
      margin-bottom: 10px;
      padding-right: 15%;
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
