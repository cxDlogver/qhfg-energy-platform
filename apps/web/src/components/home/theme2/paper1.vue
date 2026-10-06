<template>
  <div class="lay">
    <div class="paperClass">
      <div class="article-title" v-html="paper1.title"></div>
      <div class="sub_title" v-html="paper1.subtitle"></div>
      <div class="content1" v-html="paper1.text1"></div>

      <!-- 图片1：统一样式 -->
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
      <div class="image-caption">{{ paper1.img1Caption }}</div>

      <div class="content1" v-html="paper1.text2"></div>
      <div class="content1" v-html="paper1.text3"></div>

      <!-- 图片2：统一样式 -->
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
      <div class="image-caption">{{ paper1.img2Caption }}</div>

      <div class="content1" v-html="paper1.text4"></div>

      <!-- 底部信息：统一使用bottom-bar布局 -->
      <div class="bottom-bar">
        <div class="paper-link">
          <div>论文链接：</div>
          <div>
            <a :href="paper1.paperLink" target="_blank">{{
              paper1.paperLink
            }}</a>
          </div>
        </div>
        <div class="bottom-right">
          <div>{{ paper1.bottom1 }}</div>
          <div>{{ paper1.bottom2 }}</div>
          <div>{{ paper1.bottom3 }}</div>
          <div>{{ paper1.bottom4 }}</div>
          <div>{{ paper1.bottom5 }}</div>
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
import img1 from "@/assets/img/theme2-1-1.png";
import img2 from "@/assets/img/theme2-1-2.png"; // 补充图片2引入

const { locale } = useI18n();

// 引入路由
import { useRouter } from "vue-router";

const router = useRouter(); // 初始化路由实例

// 定义返回方法：跳转到nav-page1
const goBack = () => {
  router.push("/home/nav-page2");
};

// 内容完全保留，未做修改
const paper1 = computed(() => {
  if (locale.value === "chinese") {
    return {
      title:
        "环境学院鲁玺课题组在时空动态化评估我国陆上风电碳足迹及成本变动性方面取得新进展",
      subtitle:
        '本文转自<a href="https://mp.weixin.qq.com/s/bxtRprB2GMt6PwInL1w_sA" target="_blank">清华大学环境研究院</a>，发布时间：2024年04月23日',
      text1:
        "近日，清华大学环境学院鲁玺教授课题组在时空动态化评估我国双碳目标下陆上风电全生命周期碳足迹及成本变动性方面取得新进展，揭示了我国陆上风电产业链发展的关键减排部门、地区和措施，为未来“零碳”风电发展提供了数据支持与科学依据，研究方法为其他可再生能源领域排放的精细化评估奠定了基础，从而为实现低碳能源转型和促进全球清洁能源的可持续发展这一更广泛的目标作出贡献。",
      img1Caption:
        "图1. 我国陆上风电全生命周期碳排放的各阶段与部门贡献情况及未来碳足迹变化",
      text2:
        "全球能源结构的低碳转型需要大规模发展风电以减缓气候变化进程。在过去的20年里，全球风电总装机容量经历了指数级增长。中国作为风电装机容量最大的国家以及世界上最大的风电组件生产商和供应商，已成为全球风电市场未来发展的关键贡献者。近期国家发布的《关于完善能源绿色低碳转型体制机制和政策措施的意见》中提出：“建立清洁低碳能源产业链供应链协同创新机制。推动构建以需求端技术进步为导向，产学研用深度融合、上下游协同、供应链协作的清洁低碳能源技术创新促进机制。”再一次强调了我国低碳转型道路中不仅要考虑低碳能源的替代作用，同时也要关注低碳能源产业链的排放情况，强调了清洁能源产业链低碳发展的重要性。尤其是风电的全生命周期排放受到上游供应链和产业链的强烈影响。因此，了解中国风电行业碳中和目标下的碳排放时空变化和相关成本，可以为能源转型政策设计提供信息，为国内和国际风电行业的“零碳”发展措施提供宝贵的数据支持。",
      text3:
        "研究结果显示，2017年我国陆上风电生命周期二氧化碳排放量为26.20 g/kWh，根据我国的碳中和目标，预计到2060年将降至8.61 g/kWh。2017年，电力供应部门在风电生命周期中贡献了42.8%的二氧化碳排放量。此外，回收风电相关的金属可以减少32.8%的二氧化碳排放量。各省碳足迹的差异归因于中国不均衡的工业发展，这影响了与风力发电部署相关的区域排放。河北省和内蒙古自治区以及江苏省是中国最大的风力相关制造业基地之一。值得注意的是，位于华东的江苏省拥有更清洁的产业链。在华北地区，特别是煤炭、钢铁和风能相关生产产业的核心地区，这些区域产业中国风力发电碳排放总量的44.1%。内蒙古和河北省与风力相关的制造过程相关的较高排放因子导致华北风力发电的碳足迹更大。研究考虑了中国预计的碳价格，以预测陆上风电生命周期成本的时空变化。分析表明，到2060年，随着碳价格上涨到980元/t二氧化碳，预计中国陆上风电的发展将产生405元/kW的额外碳成本，占总成本的12.04%。此外，由于碳强度较高，碳定价政策也可能潜在地影响风电的区域成本竞争力，特别是在华北地区。",
      img2Caption:
        "图2. 2017年中国各省市级区域陆上风电全生命周期的二氧化碳排放空间分布及拉动影响",
      text4:
        "相关研究成果以《中国碳中和目标下的风电时空碳足迹及相关成本》（Spatiotemporal carbon footprint and associated costs of wind power toward China’s carbon neutrality）为题发表在期刊《资源、保护与回收》（Resources, Conservation & Recycling）上。文章通讯作者为清华大学环境学院鲁玺教授，第一作者是环境学院2021级博士生阮梓纹，清华大学环境学院2023级博士生尹自华、2018级博士生张憧宇、2021级博士生王家兴、2018级博士生时光，哈佛大学学生肖恩·莫布里（Shawn C. Mobley）、同济大学李彦助理教授、对外经贸大学孔朝阳副教授、北京大学能源研究院陈丹副主任、清华大学环境学院贺克斌院士在研究方法及结果讨论方面提供了重要帮助。本研究得到了国家重点研发计划、国家自然科学基金委、清华大学-INDITEX可持续发展基金、鄂尔多斯-清华碳中和创新与合作研究项目的资助。",
      paperLink: "https://doi.org/10.1016/j.resconrec.2024.107593",
      bottom1: "供稿 | 大气污染与控制教研所",
      bottom2: "通讯员 | 阮梓纹",
      bottom3: "编辑 | 张楠楠",
      bottom4: "审核 | 鲁玺  徐明",
      bottom5: "责编 | 陈超",
    };
  } else {
    return {
      title: `New Progress in Spatiotemporal Dynamic Assessment of Carbon Footprint and Cost Variability of Onshore Wind Power in China by Xi Lu's Research Group from the School of Environment`,
      subtitle:
        'This article is reproduced from the official website of the School of Environment, Tsinghua University (<a href="https://mp.weixin.qq.com/s/bxtRprB2GMt6PwInL1w_sA" target="_blank">Original link</a>).Release date: April 23, 2024.',
      text1: `Recently, Professor Xi Lu's research group from the School of Environment at Tsinghua University has made new progress in the spatiotemporal dynamic assessment of the full-life-cycle carbon footprint and cost variability of onshore wind power under China's dual-carbon goals. It has revealed the key emission reduction sectors, regions, and measures for the development of China's onshore wind power industry chain, providing data support and scientific basis for the future development of "zero-carbon" wind power. The research method has laid a foundation for the refined assessment of emissions in other renewable energy fields, thereby contributing to the broader goal of achieving low-carbon energy transformation and promoting the sustainable development of global clean energy.`,
      img1Caption:
        "Figure 1. Contributions of various stages and sectors to the full-life-cycle carbon emissions of onshore wind power in China and future changes in carbon footprint",
      text2: `The global low-carbon transformation of energy structure requires the large-scale development of wind power to slow down the process of climate change. Over the past 20 years, the total installed capacity of global wind power has experienced exponential growth. As the country with the largest installed capacity of wind power and the world's largest producer and supplier of wind power components, China has become a key contributor to the future development of the global wind power market. The recently issued "Opinions on Improving the System Mechanism and Policy Measures for Green and Low-carbon Energy Transformation" emphasizes: "Establish a collaborative innovation mechanism for clean and low-carbon energy supply chains. Promote the construction of a clean and low-carbon energy technology innovation promotion mechanism oriented by demand-side technological progress, with in-depth integration of industry, academia, research and application, upstream and downstream collaboration, and supply chain cooperation." It once again emphasizes that in China's low-carbon transformation path, we should not only consider the substitution effect of low-carbon energy but also pay attention to the emission situation of the low-carbon energy industry chain, highlighting the importance of low-carbon development of the clean energy industry chain. In particular, the full-life-cycle emissions of wind power are strongly affected by upstream supply chains and industry chains. Therefore, understanding the spatiotemporal changes of carbon emissions and related costs in China's wind power industry under the carbon neutrality goal can provide information for energy transition policy design and valuable data support for "zero-carbon" development measures in the domestic and international wind power industries.`,
      text3: `The research results show that the life-cycle CO₂ emissions of onshore wind power in China were 26.20 g/kWh in 2017, and are expected to drop to 8.61 g/kWh by 2060 according to China's carbon neutrality goal. In 2017, the power supply sector contributed 42.8% of CO₂ emissions in the life cycle of wind power. In addition, recycling metals related to wind power can reduce CO₂ emissions by 32.8%. The differences in carbon footprints among provinces are attributed to China's uneven industrial development, which affects regional emissions related to wind power deployment. Hebei Province, Inner Mongolia Autonomous Region, and Jiangsu Province are among the largest wind-related manufacturing bases in China. Notably, Jiangsu Province, located in East China, has a cleaner industrial chain. In North China, especially in the core areas of coal, steel, and wind energy-related production industries, these regional industries account for 44.1% of China's total wind power carbon emissions. The higher emission factors associated with wind-related manufacturing processes in Inner Mongolia and Hebei Province lead to a larger carbon footprint of wind power in North China. The research considers China's projected carbon prices to predict the spatiotemporal changes in the life-cycle costs of onshore wind power. The analysis shows that by 2060, as the carbon price rises to 980 yuan/ton CO₂, the development of onshore wind power in China is expected to generate an additional carbon cost of 405 yuan/kW, accounting for 12.04% of the total cost. In addition, due to the high carbon intensity, carbon pricing policies may potentially affect the regional cost competitiveness of wind power, especially in North China.`,
      img2Caption:
        "Figure 2. Spatial distribution and driving impact of full-life-cycle CO₂ emissions of onshore wind power in China's provincial and municipal regions in 2017",
      text4: `The relevant research results were published in the journal Resources, Conservation & Recycling under the title "Spatiotemporal carbon footprint and associated costs of wind power toward China’s carbon neutrality". The corresponding author of the article is Professor Xi Lu from the School of Environment at Tsinghua University, and the first author is Ziwen Ruan, a 2021 doctoral student at the School of Environment. Zihua Yin, a 2023 doctoral student, Chongyu Zhang, a 2018 doctoral student, Jiaxing Wang, a 2021 doctoral student, Guang Shi, a 2018 doctoral student from the School of Environment at Tsinghua University, Shawn C. Mobley, a student from Harvard University, Associate Professor Yan Li from Tongji University, Associate Professor Zhaoyang Kong from the University of International Business and Economics, Deputy Director Dan Chen from the Institute of Energy at Peking University, and Academician Kebin He from the School of Environment at Tsinghua University provided important assistance in research methods and result discussions. This research was funded by the National Key Research and Development Program of China, the National Natural Science Foundation of China, the Tsinghua University-INDITEX Sustainable Development Fund, and the Ordos-Tsinghua Innovative & Collaborative Research Program in Carbon Neutrality.`,
      paperLink: "https://doi.org/10.1016/j.resconrec.2024.107593",
      bottom1: "Contribution | Institute of Air Pollution Control",
      bottom2: "Correspondent | Ziwen Ruan",
      bottom3: "Editor | Nannan Zhang",
      bottom4: "Review | Xi Lu, Ming Xu",
      bottom5: "Responsible Editor | Chao Chen",
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
    .sub-title,
    .bottom-left {
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
