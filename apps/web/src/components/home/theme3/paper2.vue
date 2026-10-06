<template>
  <div class="lay">
    <div class="paperClass">
      <div class="article-title">
        {{ paper2.title }}
      </div>
      <div class="sub-title" v-html="paper2.subtitle"></div>
      <div class="content1">
        {{ paper2.title1 }}
      </div>
      <div class="content1">
        {{ paper2.text1 }}
      </div>
      <div class="content1">
        {{ paper2.text2 }}
      </div>
      <div class="content1">
        {{ paper2.title2_1 }}
      </div>
      <div class="content1">
        {{ paper2.text3 }}
      </div>
      <div class="content1">
        {{ paper2.text4 }}
      </div>
      <div class="content1">
        {{ paper2.text5 }}
      </div>
      <div class="content1">
        {{ paper2.text6 }}
      </div>
      <div class="content1">
        {{ paper2.title2_2 }}
      </div>
      <div class="content1">
        {{ paper2.text7 }}
      </div>
      <div class="content1">
        {{ paper2.text8 }}
      </div>
      <div class="theme1-2-1"></div>
      <div class="content1">
        {{ paper2.text9 }}
      </div>
      <div class="content1">
        {{ paper2.text10 }}
      </div>
      <div class="content1">
        {{ paper2.text11 }}
      </div>
      <div class="theme1-2-2"></div>
      <div class="content1">
        {{ paper2.text12 }}
      </div>
      <div class="bottom-left">
        <div>{{ paper2.text13 }}</div>
        <div>
          https://www.sciencedirect.com/science/article/abs/pii/S135223102200139X
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

// 引入路由
import { useRouter } from "vue-router";

const router = useRouter(); // 初始化路由实例

// 定义返回方法：跳转到nav-page1
const goBack = () => {
  router.push("/home/nav-page3");
};

const paper2 = computed(() => {
  if (locale.value === "chinese") {
    return {
      title: "大规模山区风电场对京津冀地区冬季空气质量的影响",
      subtitle: `本文转自 <a href="https://mp.weixin.qq.com/s/qicllXfVVqE8lcLjgByPsQ" target="_blank">清洁空气政策伙伴关系</a> ，发布时间：2023年02月10日`,
      title1: "一、研究背景",
      text1:
        "风能是重要的可再生能源。风力发电在中国实现碳中和目标和空气质量达标方面发挥重要作用。通常，风力发电对于改善空气质量和减缓气候变化具有直接和间接的影响。间接影响体现在通过化石燃料替代进而减少大气污染物排放，而直接影响体现在通过改变区域气象条件，影响大气污染物分布，进而改变污染物浓度。诸多研究已对风力部署间接影响进行分析，近年也有越来越多研究开始讨论其直接影响，但较为综合地分析风力发电对空气质量的直接和间接影响的研究目前相对较少。本文采用更为综合的研究框架，全面评估风力发电对区域空气质量（尤其是处于风电场下风向的京津冀地区）的影响，为未来能源政策制定和完善提供参考。",
      title2: "二、研究方法与结论",
      text2:
        "研究团队采用高分辨率排放清单、耦合风电场拖曳参数化（WFP）方案的中尺度气象模型（WRF）以及空气质量模型（CMAQ）模型，建立起风电场影响下的污染物排放-气象-污染物浓度三者之间的关系，评估了张家口地区16GW（2030年预计实现水平）风电场运行对风电场区域和下风向京津冀地区气象状况与冬季空气质量的影响。",
      title2_1: "1.风电场运行对气象的影响",
      text3:
        "研究团队从轮毂高度风速（WS95）、2米高温度（T2）、2米高相对湿度（RH2）和大气边界层高度（PBLH）四个方面分析了张家口地区16GW风电场对气象的影响。",
      text4:
        "风电场运行促使风电场区域轮毂高度风速下降，但下风向的北京地区风速受影响极小。风电场区域风速在白天（14:00-16:00）下降0.410米/秒，在夜间（22:00-4:00）下降0.501米/秒，月均风速下降0.410米/秒。北京地区风速白天减少0.003米/秒，夜间减少0.006米/秒，几乎可忽略不计。",
      text5:
        "风电场运行促使风电场区域2米高温度降低，2米高湿度增加。温度降低可能是由于风力涡轮机加速了地面冷却风从山坡向山谷的流动。随着温度降低和风速下降，风电场地区湿度在白天和夜间分别增加了0.03%和0.348%。",
      text6:
        "风电场运行促使风电场区域和京津冀区域PBLH高度增加。风力涡轮机的运行导致风电场区域PBLH在白天平均增加2.937米，夜间增平均加16.836米；北京地区的PBLH在白天平均增加0.040米，夜间平均增加0.326米。在夜间，风电场运行对PBLH的影响甚至将波及到北京周边平原地区城市。PBLH变化主要与环流模式的波动有关，更活跃的垂直运动加强了大气垂直混合。",
      title2_2: "2.风电场运行对空气质量的影响",
      text7:
        "风电场区域和京津冀区域夜间PM2.5浓度增幅均受风电场运行影响较为显著，风电场区域夜间PM2.5浓度增幅最为明显。研究发现，在风电场区域和京津冀区域，相较白天（14:00-16:00）PM2.5月均浓度增加0.035μg/m³，夜间（22:00-4:00）浓度增加0.063μg/m³；在风电场地区，相较于白天PM2.5月均浓度增加0.120μg/m³，夜间浓度增加0.309μg/m³。虽然风电场运行增加了夜间PBLH高度，有利于大气污染物纵向扩散，但夜间PM2.5污染主要为二次污染（而不是由污染物的扩散和传输过程导致），且风电场运行使得夜间风速降低、湿度增加，这为污染物生成创造了有利条件。",
      text8:
        "相较清洁时段，重污染天气夜间与白天PM2.5浓度增幅均更小。如图1B所示，夜间，重污染天气期间北京地区PM2.5浓度平均增幅（0.17%）远低于清洁时段（0.73%），这可能是由于在重污染事件发生时，PBLH增加促进了夜间大气垂直混合过程，PM2.5稀释效应更强。白天，重污染天气期间北京地区与风电场地区PM2.5浓度平均增幅（0.14%与0.64%）均低于清洁时段（北京地区0.42%，风电场地区1.09%）。这可能是因为风机的垂直混合过程增加了PM2.5在相对静稳的白天的扩散。",
      text9:
        "16GW风电场运行对风电场区域和北京在清洁时段、中度污染时段、重度污染时段的PM2.5浓度的影响以及对月均PM2.5浓度的影响",
      text10:
        "此外，研究团队进一步分析了风力发电通过替代农村居民取暖用煤对空气质量改善的间接影响。结果显示，张家口风力发电16GW可满足北京地区77%的农村家庭采暖用电需求，通过替代燃煤采暖预计可分别减少SO2、NOx、一次PM10和一次PM2.5 排放1.56、0.94、3.15和2.45kt，北京地区PM2.5月均浓度下降5.709μg/m³，风电场地区下降0.113μg/m³。",
      text11:
        "综合考虑直接和间接影响，风电场运行会使北京地区PM2.5浓度大幅下降，达5.642μg/m³，但风电场地区PM2.5浓度轻微上升0.147μg/m³。这体现了风电场部署带来的环境不公问题，为消除或减小此类不公正现象，需加强区域协调相关政策，例如将风电部分分配给张家口地区居民，减少当地民用煤炭使用。",
      text12:
        "综上，本研究分析了风电场运行导致的气象条件变化对空气质量的影响，并首次就风电场运行对空气质量的影响进行综合分析。从月尺度来看，风电场运行导致的气象条件改变对京津冀地区空气质量的影响微乎其微、可忽略不计，但在某些特殊时段（如重污染天气下）风电场运行对空气质量影响利弊并存；在风电场部署及发电配置过程中需综合考量，注意区域环境正义问题，寻求环境效益最大化。",
      text13: "论文链接：",
      link: "https://www.sciencedirect.com/science/article/abs/pii/S135223102200139X",
    };
  } else {
    return {
      title:
        "Impact of Large-Scale Mountain Wind Farms on Winter Air Quality in the Beijing-Tianjin-Hebei Region",
      subtitle: `This article is reproduced from <a href="https://mp.weixin.qq.com/s/qicllXfVVqE8lcLjgByPsQ" target="_blank">Clean Air Policy Partnership</a>, Published: February 10, 2023`,
      title1: "1. Research Background",
      text1:
        "Wind energy is an important renewable energy source. Wind power plays a significant role in achieving China's carbon neutrality goals and air quality standards. Generally, wind power has both direct and indirect effects on improving air quality and mitigating climate change. The indirect effect is reflected in the reduction of air pollutant emissions through the substitution of fossil fuels, while the direct effect is reflected in the change of regional meteorological conditions, affecting the distribution and concentration of air pollutants. Many studies have analyzed the indirect effects of wind power deployment, and in recent years, more and more studies have begun to discuss its direct effects. However, comprehensive analyses of both direct and indirect effects of wind power on air quality are still relatively rare. This study adopts a more comprehensive research framework to fully assess the impact of wind power on regional air quality (especially in the Beijing-Tianjin-Hebei region downwind of wind farms), providing a reference for future energy policy formulation and improvement.",
      title2: "2. Research Methods and Conclusions",
      text2:
        "The research team used a high-resolution emission inventory, a mesoscale meteorological model (WRF) coupled with wind farm parameterization (WFP), and an air quality model (CMAQ) to establish the relationship among pollutant emissions, meteorology, and pollutant concentrations under the influence of wind farms. They evaluated the impact of the operation of a 16GW wind farm in Zhangjiakou (expected to be achieved by 2030) on meteorological conditions and winter air quality in both the wind farm area and the downwind Beijing-Tianjin-Hebei region.",
      title2_1: "2.1 Impact of wind farm operation on meteorology",
      text3:
        "The research team analyzed the impact of the 16GW wind farm in Zhangjiakou on meteorology from four aspects: hub-height wind speed (WS95), 2-meter temperature (T2), 2-meter relative humidity (RH2), and planetary boundary layer height (PBLH).",
      text4:
        "The operation of the wind farm caused a decrease in hub-height wind speed in the wind farm area, but the wind speed in downwind Beijing was hardly affected. In the wind farm area, wind speed decreased by 0.410 m/s during the day (14:00-16:00) and by 0.501 m/s at night (22:00-4:00), with a monthly average decrease of 0.410 m/s. In Beijing, wind speed decreased by 0.003 m/s during the day and 0.006 m/s at night, which is almost negligible.",
      text5:
        "The operation of the wind farm led to a decrease in 2-meter temperature and an increase in 2-meter humidity in the wind farm area. The temperature decrease may be due to wind turbines accelerating the flow of cold air from slopes to valleys. As temperature decreased and wind speed dropped, humidity in the wind farm area increased by 0.03% during the day and 0.348% at night.",
      text6:
        "The operation of the wind farm increased the PBLH in both the wind farm area and the Beijing-Tianjin-Hebei region. The operation of wind turbines led to an average daytime PBLH increase of 2.937 m and an average nighttime increase of 16.836 m in the wind farm area; in Beijing, the average daytime increase was 0.040 m and the average nighttime increase was 0.326 m. At night, the impact of wind farm operation on PBLH even extended to cities in the surrounding plains of Beijing. PBLH changes are mainly related to circulation pattern fluctuations, and more active vertical motion enhances atmospheric vertical mixing.",
      title2_2: "2.2 Impact of wind farm operation on air quality",
      text7:
        "The nighttime increase in PM2.5 concentration in both the wind farm area and the Beijing-Tianjin-Hebei region was significantly affected by wind farm operation, with the most obvious increase in the wind farm area. The study found that, compared to daytime (14:00-16:00), the monthly average PM2.5 concentration increased by 0.035 μg/m³ during the day and by 0.063 μg/m³ at night in both the wind farm area and the Beijing-Tianjin-Hebei region; in the wind farm area, the increase was 0.120 μg/m³ during the day and 0.309 μg/m³ at night. Although wind farm operation increased nighttime PBLH, which is conducive to vertical diffusion of air pollutants, nighttime PM2.5 pollution is mainly secondary (not caused by diffusion and transport), and wind farm operation reduced nighttime wind speed and increased humidity, creating favorable conditions for pollutant formation.",
      text8:
        "Compared to clean periods, the increase in PM2.5 concentration during heavy pollution events is smaller at night and during the day. As shown in Figure 1B, at night, the average increase in PM2.5 concentration in Beijing during heavy pollution events (0.17%) is much lower than during clean periods (0.73%), possibly because increased PBLH during pollution events promotes nighttime vertical mixing and stronger dilution of PM2.5. During the day, the average increase in PM2.5 concentration in Beijing and the wind farm area during heavy pollution events (0.14% and 0.64%) is lower than during clean periods (0.42% in Beijing, 1.09% in the wind farm area). This may be because the vertical mixing process of wind turbines increases the diffusion of PM2.5 during relatively stable daytime conditions.",
      text9:
        "The impact of the operation of a 16GW wind farm on PM2.5 concentrations in the wind farm area and Beijing during clean, moderate, and heavy pollution periods, as well as on monthly average PM2.5 concentrations.",
      text10:
        "In addition, the research team further analyzed the indirect impact of wind power on air quality improvement by replacing rural residential coal heating. The results showed that 16GW of wind power in Zhangjiakou could meet 77% of the rural household heating electricity demand in Beijing. By replacing coal heating, it is expected to reduce SO2, NOx, primary PM10, and primary PM2.5 emissions by 1.56, 0.94, 3.15, and 2.45 kt, respectively. The monthly average PM2.5 concentration in Beijing would decrease by 5.709 μg/m³, and by 0.113 μg/m³ in the wind farm area.",
      text11:
        "Considering both direct and indirect effects, the operation of the wind farm would significantly reduce PM2.5 concentrations in Beijing by 5.642 μg/m³, but slightly increase PM2.5 concentrations in the wind farm area by 0.147 μg/m³. This reflects the issue of environmental injustice brought by wind farm deployment. To eliminate or reduce such injustice, it is necessary to strengthen regional coordination policies, such as allocating part of the wind power to residents in Zhangjiakou to reduce local residential coal use.",
      text12:
        "In summary, this study analyzed the impact of meteorological changes caused by wind farm operation on air quality, and for the first time comprehensively analyzed the impact of wind farm operation on air quality. On a monthly scale, the impact of meteorological changes caused by wind farm operation on air quality in the Beijing-Tianjin-Hebei region is minimal and negligible, but during certain special periods (such as heavy pollution events), the impact of wind farm operation on air quality is both positive and negative. Comprehensive consideration is needed in wind farm deployment and power allocation, paying attention to regional environmental justice and seeking to maximize environmental benefits.",
      text13: "Paper link:",
      link: "https://www.sciencedirect.com/science/article/abs/pii/S135223102200139X",
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
      height: 40px;
      line-height: 40px;
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
      line-height: 40px;
      padding-left: 15%;
      padding-right: 15%;
      font-size: 18px;
      color: #000;
      text-align: start;
      text-indent: 2rem;
      margin-bottom: 10px;
      text-align: justify;
    }
    .theme1-2-1 {
      width: 60%;
      height: 300px;
      margin-left: 50%;
      transform: translateX(-50%);
      background: url("@/assets/img/theme1-2-1.png") no-repeat;
      background-size: 100% 100%;
      margin-bottom: 10px;
    }
    .theme1-2-2 {
      width: 60%;
      height: 300px;
      margin-left: 50%;
      transform: translateX(-50%);
      background: url("@/assets/img/theme1-2-2.png") no-repeat;
      background-size: 100% 100%;
      margin-bottom: 10px;
    }
    .bottom-left {
      width: 100%;
      padding-left: 15%;

      font-size: 16px;
      text-align: start;
      > div {
        margin-bottom: 10px;
      }
    }
    .bottom-right {
      width: 100%;
      font-size: 16px;

      padding-right: 15%;
      text-align: end;
      > div {
        margin-bottom: 10px;
      }
    }
    .nav-btns {
      width: 100%;
      text-align: center;
      margin-top: 20px;
      button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 5px;
        margin: 0 10px;
        cursor: pointer;
        &:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
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
