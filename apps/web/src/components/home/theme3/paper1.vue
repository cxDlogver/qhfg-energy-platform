<template>
  <div class="lay">
    <div class="paperClass">
      <div class="article-title">
        {{ paper1.title }}
      </div>
      <div class="sub_title" v-html="paper1.subtitle"></div>
      <div class="content1">{{ paper1.text1 }}</div>
      <div class="title">{{ paper1.title1 }}</div>
      <div class="content1">{{ paper1.text2 }}</div>
      <div class="content1">{{ paper1.text3 }}</div>
      <div class="title">{{ paper1.title2 }}</div>
      <div class="content1">{{ paper1.text4 }}</div>
      <div class="title">{{ paper1.title3 }}</div>
      <div class="content1">{{ paper1.text5 }}</div>
      <div class="content1">{{ paper1.text6 }}</div>
      <div class="content1">{{ paper1.text7 }}</div>
      <div class="content1">{{ paper1.text8 }}</div>
      <!-- 图1 -->
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
      <div class="image-caption">{{ paper1.text9 }}</div>
      <div class="content1">{{ paper1.text10 }}</div>
      <div class="content1">{{ paper1.text11 }}</div>
      <!-- 图2 -->
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
      <div class="image-caption">{{ paper1.text12 }}</div>
      <div class="content1">{{ paper1.text13 }}</div>
      <div class="content1">{{ paper1.text14 }}</div>
      <!-- 图3 -->
      <div class="content1">
        <img
          :src="img3"
          alt="图3"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper1.text15 }}</div>
      <div class="content1">{{ paper1.text16 }}</div>
      <div class="content1">{{ paper1.text17 }}</div>
      <!-- 图4 -->
      <div class="content1">
        <img
          :src="img4"
          alt="图4"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper1.text18 }}</div>
      <div class="title">{{ paper1.title4 }}</div>
      <div class="content1">{{ paper1.text19 }}</div>
      <div class="title">{{ paper1.title5 }}</div>
      <div class="content1">{{ paper1.text20 }}</div>
      <div class="content1">{{ paper1.text21 }}</div>
      <div class="content1">{{ paper1.text22 }}</div>
      <div class="content1">{{ paper1.text23 }}</div>
      <div class="bottom-bar">
        <div class="paper-link">
          <div>{{ $t("common.link") }}</div>
          <div>
            <a :href="paper1.link" target="_blank">{{ paper1.link }}</a>
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
import img1 from "@/assets/img/theme3-1-1.png";
import img2 from "@/assets/img/theme3-1-2.png";
import img3 from "@/assets/img/theme3-1-3.png";
import img4 from "@/assets/img/theme3-1-4.png";
const { locale } = useI18n();

// 引入路由
import { useRouter } from "vue-router";

const router = useRouter(); // 初始化路由实例

// 定义返回方法：跳转到nav-page1
const goBack = () => {
  router.push("/home/nav-page3");
};
const paper1 = computed(() => {
  if (locale.value === "chinese") {
    return {
      title: "Nature Communications 中国可再生能源发电内在的时空不确定性研究",
      subtitle:
        '本文转自<a href="https://mp.weixin.qq.com/s/3k-tQVhAo30hRLwP07-DZA" target="_blank">PKU智慧城市实验室</a>，发布时间：2024年05月07日',
      text1:
        "文章利用机器学习技术解析了可再生能源多时空尺度不确定性的分布规律，主要研究了风能、光能等可再生能源固有不确定性的统计特征。研究团队运用统计学习、深度学习等多元算法开发了分省级、年度小时级的可再生能源发电预测误差分布标准数据库，揭示了我国30个省份风力和光伏发电随机分布的时空规律。",
      title1: "01 背景介绍",
      text2:
        "构建清洁低碳、安全高效的能源体系，是满足碳中和情景下可持续发展的重大战略需求。在可再生能源资源量化技术领域，国际上已有研究广泛探索地区风光资源发电潜力，并构建世界各国可再生能源资源数据集，但关于风能和太阳能输出预测的长期、高粒度和全国性规模误差分析标准仍存在空白。",
      text3:
        "可再生能源的间歇性和波动性是新型能源体系运行规划的重要挑战。为了支持能源系统规划和市场运作，需要对可再生能源发电的不确定性进行深入分析。",
      title2: "02 本文亮点",
      text4:
        "（1）提出一阶差分和峰值比率是影响预测误差分布的两个主要指标，为改进预测模型提供方向。（2）对比包括ARIMA、RF、RNN、FCNN和SVM在内的多种能源预测方法，为选择最合适的预测工具提供了依据。（3）通过研究省级预测误差的季节性特征，揭示了预测误差在全国不同省份和不同时间的分布模式，并提出不同地区可再生能源发展的优先级和建议，有助于实现我国能源生产的优化配置。",
      title3: "03 图文解析",
      text5: "1.可再生能源发电预测误差的标准数据集",
      text6:
        "利用中国各省的可再生能源装机和发电数据，研究应用自回归综合移动平均模型（ARIMA）获取 2016 年 30个省份（不包括西藏（风能）、重庆（太阳能）、香港、澳门和台湾）小时级风电和太阳能输出潜力的误差分析标准值。风电的全国平均预测误差介于2.1%至13.6%之间，其中，天津的预测误差最大，云南的误差最小，且风电预测误差主要集中在中国东部地区。相比之下，太阳能的预测误差整体上低于风电，误差范围为3.9%至10.0%，在省级预测误差中，上海的误差最大，新疆的误差最小，光伏预测误差主要分布在中国的中部、北部和东部地区。",
      text7:
        "其他方法：比较了随机森林、循环神经网络、神经网络和支持向量机等多种预测方法。所有方法在全国范围内的总体误差保持相似，范围在 6% 到 9% 之间。",
      text8:
        "时间尺度影响：为了研究预测时间尺度对全国风电和太阳预测误差分布的影响，分析了预测时间尺度 2 小时、6 小时以及 24 小时的预测误差，得出预测误差随着预测时间尺度的增加而增加的结论。",
      text9:
        "图1  a 风电预测误差空间分布；b 光伏预测误差空间分布；c 不同预测算法的误差分析；d 不同预测时长的误差分析",
      text10: "2.可再生能源发电预测误差的影响因素",
      text11:
        "统计分析表明，可再生能源发电的一阶差值和峰值比是预测误差的两个主要影响因素，均反映了发电量的波动情况。由于预测模型是基于不规则的逐时风输出量而采用的，因此风电预测误差受到逐时发电量的影响。相反，由于太阳能发电具有每日周期性，因此光伏预测误差会受到每日波动的影响。",
      text12:
        "图2  a 风电预测误差每小时峰值影响；b 不同发电区间的风电峰值分布；c 太阳能预测误差每小时峰值影响；d 不同发电区间的太阳能峰值分布",
      text13: "3.可再生能源发电预测误差的空间分布规律",
      text14:
        "为了探究预测误差的空间特征，研究者考察了全国各省份的可再生能源预测概率密度函数和预测误差，通过可视化的方式表现了我国不同地区可再生能源不确定性的分布规律。结果表明，概率密度函数越集中在某个区间内，该区间内的预测误差越小。风力发电方面，天津市区间 1 内的平均预测误差较小（仅为 10.6%），该区间内的概率密度函数集中在区间 1-4；相比之下，区间 8 内的预测误差达到 21.5%，并且该区间内的概率密度函数分布在几乎所有区间中。每个区间内的预测误差也反映了该区间内的方差和波动幅度。",
      text15: "图3 我国典型地区可再生能源预测误差分区间概率密度函数",
      text16: "4.可再生能源发电预测误差的季节性规律",
      text17:
        "研究者比较了不同季节各省的预测误差。从全国范围来看，春季和夏季是风电不确定性的主导季节，占总预测误差的 55.48%，春季和冬季是太阳能不确定性的主导季节，占总预测误差的 57.6%。各省的风电和太阳能也具有相似的发电不确定性特征。具体分省来看，春季和夏季天津和山东的风不确定性分别占总预测误差的 59.9%和 57.4%；北京、湖北和内蒙古春季和冬季的太阳不确定性分别占总预测误差的 60.4%、58.0% 和 63.9%。",
      text18:
        "图4  a 不同季节各省风电预测误差；b 典型地区风电预测误差季节性规律；c 不同季节各省光伏预测误差；d 典型地区光伏预测误差季节性规律",
      title4: "04 结论",
      text19:
        "研究者基于上述分析，强调了可再生能源发电预测误差分析标准的研究对于学术研究、工业界和政策决策的重要性，并提出了相关政策建议，如在我国各省级电力系统需要额外关注夏季风电和冬季光伏的强不确定性带来的冲击，指出了不同地区可再生能源发展的不同优先级，省间输电通道扩容仍是我国局部区域可再生能源波动性的应对方法之一。",
      text20:
        "文中提出的标准可以帮助建立风能和太阳能发电的概率分布函数，适用于鲁棒优化和风险评估，为评估可再生能源项目的投资收益和风险方面提供参考。此外，还讨论了储能设备在缓解电力系统中可再生能源份额增加所带来的电力平衡压力方面的实施问题。该研究结果为能源系统随机优化和安全评估等领域研究提供标准数据参考，为我国新型能源体系的战略规划与中长期布局提供政策建议。",
      title5: "05 展望",
      text21:
        "本研究采用ARIMA模型作为标准预测方法存在局限性，可能无法完全捕捉到天气预测的准确性和运行限制策略等复杂影响因素。除了一阶差分和峰值比率的影响外，可能还有其他未考虑的因素影响预测误差，如地形、气候模式、技术发展等。",
      text22:
        "未来的研究需要更深入地研究预测误差分布偏差的影响，以及考虑更复杂的实际因素对预测误差的影响。尽管文章提供了省级的预测误差分析，但可能还需要更深入地研究特定地区的微观特征，如城市层面的风能和太阳能资源分布。文章中使用了2016年的数据，未来的研究需要考虑如何利用实时数据和持续更新的数据集来提高预测的准确性。",
      text23:
        "文章中的预测模型和误差分析可以应用于实际的能源系统规划和运行中，以进一步验证其有效性和可行性。此外，文章的研究方法可以推广至更大时空尺度的研究，例如全球其他地区的长周期可再生能源的不确定性分析和预测。",
      text24: "论文链接：",
      link: "https://www.nature.com/articles/s41467-023-40670-7",
      contributor:
        "供稿 | 大气污染与控制教研所 | 通讯员 阮梓纹 | 编辑 张楠楠 | 审核 鲁玺 徐明 | 责编 陈超",
      bottom1: "供稿 | 大气污染与控制教研所",
      bottom2: "通讯员 | 阮梓纹",
      bottom3: "编辑 | 张楠楠",
      bottom4: "审核 | 鲁玺 徐明",
      bottom5: "责编 | 陈超",
    };
  } else {
    return {
      title:
        "Nature Communications: Inherent Spatiotemporal Uncertainty of Renewable Power in China",
      subtitle: `This article is reproduced from the official website of the Smart City Lab, Peking University <a href='https://mp.weixin.qq.com/s/3k-tQVhAo30hRLwP07-DZA' target='_blank'></a>. Release date: May 7, 2024.`,
      text1:
        "The study employs machine learning techniques to analyze the distribution patterns of renewable energy uncertainty across multiple spatiotemporal scales, focusing on the statistical characteristics of the inherent uncertainty in wind and solar power. The research team utilized statistical learning, deep learning, and other multivariate algorithms to develop a standardized provincial-level, annual hourly database of renewable energy generation forecast error distributions, revealing the spatiotemporal patterns of stochastic wind and solar power generation across 30 provinces in China.",
      title1: "01 Background",
      text2:
        "Constructing a clean, low-carbon, safe, and efficient energy system is a major strategic need to meet sustainable development under the carbon neutrality scenario. In the field of renewable energy resource quantification technology, international studies have widely explored the power generation potential of regional wind and solar resources and constructed renewable energy resource datasets for countries worldwide. However, there is still a gap in long-term, high-granularity, and national-scale error analysis standards for wind and solar power output predictions.",
      text3:
        "The intermittency and volatility of renewable energy pose significant challenges to the operation and planning of new energy systems. In-depth analysis of the uncertainty of renewable energy power generation is required to support energy system planning and market operations.",
      title2: "02 Highlights",
      text4:
        "(1) Key Indicators Identified: The study proposes that first-order differences and peak ratios are the two primary metrics influencing forecast error distributions, providing direction for improving prediction models. (2) Comparative Analysis of Methods: Multiple energy forecasting methods—including ARIMA, RF, RNN, FCNN, and SVM—are compared, offering insights for selecting the most suitable prediction tools. (3) Spatiotemporal Patterns Revealed: By examining seasonal variations in provincial forecast errors, the study uncovers distribution patterns across different regions and timeframes, proposing regional priorities for renewable energy development to optimize China's energy production layout.",
      title3: "03 Graphical Analysis",
      text5:
        "1.Standard Datasets for Renewable Energy Power Generation Prediction Errors",
      text6:
        "Using renewable energy installed capacity and power generation data from provinces of China, the study applies the Autoregressive Integrated Moving Average Model (ARIMA) to obtain hourly-level error analysis standard values for wind and solar output potential in 30 provinces (excluding Tibet (wind energy), Chongqing (solar energy), Hong Kong, Macau, and Taiwan) in 2016. The national average prediction error for wind power ranges from 2.1% to 13.6%, with Tianjin having the largest error and Yunnan the smallest. Wind power prediction errors are mainly concentrated in eastern China. In contrast, solar energy prediction errors are overall lower than those of wind power, ranging from 3.9% to 10.0%. At the provincial level, Shanghai has the largest error and Xinjiang the smallest. Photovoltaic prediction errors are mainly distributed in central, northern, and eastern China.",
      text7:
        "Comparative Methods: Compared multiple prediction methods such as Random Forest, Recurrent Neural Network, Neural Network, and Support Vector Machine. The overall errors of all methods nationwide remain similar, ranging from 6% to 9%.",
      text8:
        "Temporal Scale Impact: To study the impact of prediction time scales on the national wind and solar prediction error distribution, the prediction errors for time scales of 2 hours, 6 hours, and 24 hours were analyzed, concluding that prediction errors increase with the extension of the prediction time scale.",
      text9:
        "Figure 1: a) Wind power prediction error spatial distribution; b) Photovoltaic prediction error spatial distribution; c) Error analysis of different prediction algorithms; d) Error analysis of different prediction durations",
      text10:
        "2. Factors Influencing Renewable Energy Power Generation Prediction Errors",
      text11:
        "Statistical analysis shows that first-order differences and peak ratios of renewable energy power generation are the two main factors affecting prediction errors, both reflecting the volatility of power generation. Since prediction models are based on irregular hourly wind output, wind power prediction errors are influenced by hourly power generation. Conversely, since solar power generation has daily periodicity, photovoltaic prediction errors are affected by daily fluctuations.",
      text12:
        "Figure 2: a) Hourly peak impact on wind power prediction errors; b) Wind power peak distribution in different generation intervals; c) Hourly peak impact on solar prediction errors; d) Solar peak distribution in different generation intervals",
      text13:
        "3. Spatial Distribution Patterns of Renewable Energy Power Generation Prediction Errors",
      text14:
        "To explore the spatial characteristics of prediction errors, researchers examined the probability density functions and prediction errors of renewable energy predictions across all provinces nationwide, visually representing the distribution patterns of renewable energy uncertainty in different regions of China. Results show that the more concentrated the probability density function is within a certain interval, the smaller the prediction error within that interval. For wind power generation, the average prediction error in interval 1 of Tianjin is smaller (only 10.6%), with the probability density function in this interval concentrated in intervals 1-4; in contrast, the prediction error in interval 8 reaches 21.5%, and the probability density function in this interval is distributed across almost all intervals. The prediction error within each interval also reflects the variance and volatility amplitude within that interval.",
      text15:
        "Figure 3: Probability density function of renewable energy prediction errors by interval in typical regions of China",
      text16:
        "4. Seasonal Patterns of Renewable Energy Power Generation Prediction Errors",
      text17:
        "Researchers compared prediction errors across different seasons in various provinces. Nationwide, spring and summer are the dominant seasons for wind power uncertainty, accounting for 55.48% of total prediction errors, while spring and winter are the dominant seasons for solar uncertainty, accounting for 57.6% of total prediction errors. Wind and solar power in various provinces also show similar power generation uncertainty characteristics. Specifically, by province, spring and summer wind uncertainty in Tianjin and Shandong account for 59.9% and 57.4% of total prediction errors respectively; spring and winter solar uncertainty in Beijing, Hubei, and Inner Mongolia account for 60.4%, 58.0%, and 63.9% of total prediction errors respectively.",
      text18:
        "Figure 4: a) Wind power prediction errors by season across provinces; b) Seasonal patterns of wind power prediction errors in typical regions; c) Photovoltaic prediction errors by season across provinces; d) Seasonal patterns of photovoltaic prediction errors in typical regions",
      title4: "04 Conclusions",
      text19:
        "Based on the above analysis, researchers emphasize the importance of studying renewable energy power generation prediction error analysis standards for academic research, industry, and policy decision-making, and propose relevant policy recommendations. For example, provincial power systems in China need to pay extra attention to the impact of strong uncertainty from summer wind power and winter photovoltaic, pointing out different priorities for renewable energy development in different regions, and inter-provincial transmission channel expansion remains one of the response methods for renewable energy volatility in local regions of China.",
      text20:
        "The standards proposed in the paper can help establish probability distribution functions for wind and solar power generation, applicable to robust optimization and risk assessment, providing reference for evaluating investment returns and risks of renewable energy projects. Additionally, the implementation issues of energy storage equipment in alleviating power balance pressure brought by increased renewable energy share in power systems are discussed. The research results provide standard data reference for research in fields such as energy system stochastic optimization and safety assessment, offering policy recommendations for strategic planning and medium-to-long-term layout of China's new energy system.",
      title5: "05 Future Prospects",
      text21:
        "This study has limitations in using the ARIMA model as the standard prediction method, which may not fully capture complex influencing factors such as weather prediction accuracy and operational constraint strategies. Beyond the influence of first-order differences and peak ratios, there may be other unconsidered factors affecting prediction errors, such as terrain, climate patterns, and technological development.",
      text22:
        "Future research needs to more deeply study the impact of prediction error distribution bias, as well as consider the influence of more complex practical factors on prediction errors. Although the article provides provincial-level prediction error analysis, it may still need more in-depth research on micro-characteristics of specific regions, such as city-level wind and solar energy resource distribution. The article uses 2016 data, and future research needs to consider how to use real-time data and continuously updated datasets to improve prediction accuracy.",
      text23:
        "The prediction models and error analysis in the article can be applied to actual energy system planning and operation to further verify their effectiveness and feasibility. Additionally, the research methods in the article can be extended to larger spatiotemporal scale research, such as long-term renewable energy uncertainty analysis and prediction in other regions globally.",
      text24: "Paper link:",
      link: "https://www.nature.com/articles/s41467-023-40670-7",
      contributor:
        "Contributed by | Institute of Atmospheric Pollution and Control | Correspondent Zhiwen Ruan | Editor Nannan Zhang | Reviewers Xi Lu, Ming Xu | Responsible Editor Chao Chen",
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
    .title,
    .title1 {
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
    .bottom-left {
      display: none;
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
