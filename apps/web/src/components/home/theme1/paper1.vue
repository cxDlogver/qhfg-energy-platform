<template>
  <div class="lay">
    <div class="paperClass">
      <div class="article-title">
        {{ paper1.title }}
      </div>
      <div class="sub_title" v-html="paper1.subtitle"></div>
      <div class="content1">{{ paper1.text1 }}</div>
      <div class="content1">{{ paper1.text2 }}</div>
      <div class="content1">{{ paper1.text3 }}</div>
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
      <div class="image-caption">{{ paper1.img1annotation }}</div>
      <div class="content1">{{ paper1.text4 }}</div>
      <div class="content1">{{ paper1.text5 }}</div>
      <div class="bottom-bar">
        <div class="paper-link">
          <div>{{ paper1.text6 }}</div>
          <div>
            <a :href="paper1.link" target="_blank">{{ paper1.link }}</a>
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
import img1 from "@/assets/img/theme1-1-1.png";

// 引入路由
import { useRouter } from "vue-router";

const router = useRouter(); // 初始化路由实例

// 定义返回方法：跳转到nav-page1
const goBack = () => {
  router.push("/home/nav-page1");
};

const { locale } = useI18n();

const paper1 = computed(() => {
  if (locale.value === "chinese") {
    return {
      title:
        "清华大学碳中和研究院鲁玺教授团队在揭示屋顶光伏的动态气候价值与潜力实现方面取得新成果",
      subtitle: `本文转自 <a href="https://www.icon.tsinghua.edu.cn/info/1066/1525.htm" target="_blank">清华大学碳中和研究院官网</a> ，发布时间：2024年04月22日`,
      text1:
        "近日，清华大学碳中和研究院院长助理、环境学院教授鲁玺课题组与美国密西根大学Michael T. Craig助理教授团队联合，在揭示屋顶光伏的动态气候价值与潜力实现方面取得新成果。该研究基于未来多维气候模式的气候变化路径结果，量化了气候变化对居民屋顶的光伏发电潜力与用能行为的双重影响，揭示了气候变化提升居民屋顶光伏使用价值并促进屋顶光伏投资的影响机制。该研究首次量化了气候变化对可再生能源应用价值的影响，对面向中长期的屋顶光伏开发布局与规划具有关键科学指导意义。",
      text2:
        "以屋顶光伏为代表的分布式光伏是驱动未来能源低碳化、电气化转型的关键组成部分。与大型集中式可再生能源不同，分布式光伏投资的推广与普及更加依靠其通过对用户本地供电而带来的经济价值和环境价值。而未来气候变化导致的温升和辐射变化，会从光伏供给和本地用电需求两个角度改变用户分布式光伏的'供-用'形态，进而影响分布式光伏的使用价值。故此，本研究以美国17个城市2000余个典型居民用户为例，基于其能耗监测的传感器数据模拟了不同用户用能行为对气候变化的反馈效应。研究进一步集成多种未来气候模式，分析了用户在世纪中期（2020-2059）与世纪末期（2060-2099）的不同气候情景下光伏潜力与用能特点的变化。在此基础上，研究基于气候变化对'供-用'的综合影响，建立用户尺度的最优化调度模型，分析居民在不同气候路径下的光伏收益与最优屋顶光伏安装容量。",
      text3:
        "结果显示，气候变化普遍地提升了屋顶光伏的用户使用收益，同时激励居民进一步扩大其光伏投资容量。具体而言，在RCP-4.5路径下，不同城市用户投资屋顶光伏的平均收益最高可提升可20%，而城市用户屋顶光伏投资最优容量最高可提升25%。",
      text4:
        "该研究成果以'气候变化对屋顶光伏价值及最优容量影响'（Climate change will impact the value and optimal adoption of residential rooftop solar）为题发表在著名期刊《自然-气候变化》（Nature climate change）上。",
      text5:
        "清华大学环境学院博士生施劢为该论文的第一作者，清华大学碳中和研究院、环境学院鲁玺教授与美国密西根大学Micheal T. Craig助理教授为该论文的共同通讯作者。本研究得到了国家自然科学基金委、国家重点研发计划、碳中和与能源智联研究项目、鄂尔多斯-清华碳中和创新与合作研究项目等项目支持。",
      text6: "论文链接：",
      link: "https://www.nature.com/articles/s41558-024-01978-4",
    };
  } else {
    return {
      title:
        "Professor Xi Lu's team at Tsinghua University's Institute for Carbon Neutrality has made new achievements in revealing the dynamic climate value and potential realization of rooftop photovoltaics",
      subtitle: `This article is reproduced from"<a href="https://www.icon.tsinghua.edu.cn/info/1066/1525.htm" target="_blank"> the official website of Tsinghua University's Institute for Carbon Neutrality</a>"，Release date：April 22, 2024`,
      text1:
        "Recently, the research team led by Xi Lu, Assistant Dean of the Institute of Carbon Neutrality at Tsinghua University and Professor of the School of Environment, together with the team led by Assistant Professor Michael T. Craig of the University of Michigan, have jointly achieved new results in revealing the dynamic climate value and potential realization of rooftop photovoltaics. Based on the climate change path results of future multidimensional climate models, the study quantified the dual impacts of climate change on the photovoltaic power generation potential and energy use behavior of residents' roofs, and revealed the impact mechanism of climate change on enhancing the use value of residents' rooftop photovoltaics and promoting rooftop photovoltaic investment. This study quantified the impact of climate change on the application value of renewable energy for the first time, and has key scientific guiding significance for the layout and planning of rooftop photovoltaic development in the medium and long term.",
      text2:
        "Distributed photovoltaics, represented by rooftop photovoltaics, are a key component in driving the future energy transition to low carbon and electrification. Unlike large-scale centralized renewable energy, the promotion and popularization of distributed photovoltaic investment relies more on the economic and environmental value it brings by providing local power to users. The temperature rise and radiation changes caused by future climate change will change the 'supply-use' form of distributed photovoltaics from the perspectives of photovoltaic supply and local electricity demand, thereby affecting the use value of distributed photovoltaics. Therefore, this study takes more than 2,000 typical residential users in 17 cities in the United States as an example, and simulates the feedback effect of different users' energy consumption behaviors on climate change based on their energy consumption monitoring sensor data. The study further integrates a variety of future climate models and analyzes the changes in photovoltaic potential and energy use characteristics of users under different climate scenarios in the middle of the century (2020-2059) and the end of the century (2060-2099). On this basis, based on the comprehensive impact of climate change on 'supply-use', the study establishes a user-scale optimal scheduling model to analyze the photovoltaic benefits and optimal rooftop photovoltaic installation capacity of residents under different climate paths.",
      text3:
        "The results show that climate change generally increases the user benefits of rooftop photovoltaics, while encouraging residents to further expand their photovoltaic investment capacity. Specifically, under the RCP-4.5 path, the average benefits of rooftop photovoltaics for users in different cities can be increased by up to 20%, and the optimal capacity of rooftop photovoltaics for urban users can be increased by up to 25%.",
      text4:
        "The research results were published in the prestigious journal Nature climate change under the title “Climate change will impact the value and optimal adoption of residential rooftop solar”",
      text5:
        "Shi Mao, a Ph.D. student in the School of Environment at Tsinghua University, is the first author of the paper, and Professor Lu Xi from the Institute of Carbon Neutrality and the School of Environment at Tsinghua University, and Assistant Professor Micheal T. Craig from the University of Michigan are the co-corresponding authors of the paper. This research was supported by the National Natural Science Foundation of China, the National Key R&D Program of China, the Carbon Neutrality and Energy Intelligence Connectivity Research Project, and the Ordos-Tsinghua Carbon Neutrality Innovation and Cooperative Research Project.",
      text6: "Paper link：",
      link: "https://www.nature.com/articles/s41558-024-01978-4",
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
    /* 返回按钮样式 */

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
