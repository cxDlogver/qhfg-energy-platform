<template>
  <div class="lay">
    <div class="paperClass">
      <div class="article-title">{{ paper3.title }}</div>
      <div class="sub-title" v-html="paper3.subtitle"></div>

      <div class="content1" v-html="paper3.text1"></div>

      <!-- 图片1：统一包裹在content1中 -->
      <div class="content1">
        <img
          :src="img1"
          alt="与会专家合影"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper3.img1Caption }}</div>

      <div class="content1" v-html="paper3.text2"></div>

      <!-- 图片2：统一包裹在content1中 -->
      <div class="content1">
        <img
          :src="img2"
          alt="贺克斌院士致辞"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper3.img2Caption }}</div>

      <div class="content1" v-html="paper3.text3"></div>

      <!-- 图片3：统一包裹在content1中 -->
      <div class="content1">
        <img
          :src="img3"
          alt="邹骥致辞"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper3.img3Caption }}</div>

      <div class="content1" v-html="paper3.text4"></div>

      <!-- 图片4：统一包裹在content1中 -->
      <div class="content1">
        <img
          :src="img4"
          alt="李俊峰致辞"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper3.img4Caption }}</div>

      <div class="content1" v-html="paper3.text5"></div>

      <!-- 图片5：统一包裹在content1中 -->
      <div class="content1">
        <img
          :src="img5"
          alt="王灿致辞"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper3.img5Caption }}</div>

      <div class="content1" v-html="paper3.text6"></div>

      <!-- 图片6：统一包裹在content1中 -->
      <div class="content1">
        <img
          :src="img6"
          alt="主旨报告环节"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper3.img6Caption }}</div>

      <div class="content1" v-html="paper3.text7"></div>

      <!-- 图片7：统一包裹在content1中 -->
      <div class="content1">
        <img
          :src="img7"
          alt="主持人现场"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper3.img7Caption }}</div>

      <div class="content1" v-html="paper3.text8"></div>

      <!-- 图片8：统一包裹在content1中 -->
      <div class="content1">
        <img
          :src="img8"
          alt="鲁玺介绍报告"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper3.img8Caption }}</div>

      <div class="content1" v-html="paper3.text9"></div>

      <!-- 图片9：统一包裹在content1中 -->
      <div class="content1">
        <img
          :src="img9"
          alt="圆桌讨论"
          style="
            width: 100%;
            max-width: 800px;
            display: block;
            margin: 20px auto;
          "
        />
      </div>
      <div class="image-caption">{{ paper3.img9Caption }}</div>

      <div class="content1" v-html="paper3.text10"></div>

      <div class="bottom-right" v-html="paper3.bottomInfo"></div>

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
import img1 from "@/assets/img/theme2-3-1.png";
import img2 from "@/assets/img/theme2-3-2.png";
import img3 from "@/assets/img/theme2-3-3.png";
import img4 from "@/assets/img/theme2-3-4.png";
import img5 from "@/assets/img/theme2-3-5.png";
import img6 from "@/assets/img/theme2-3-6.png";
import img7 from "@/assets/img/theme2-3-7.png";
import img8 from "@/assets/img/theme2-3-8.png";
import img9 from "@/assets/img/theme2-3-9.png";

// 引入路由
import { useRouter } from "vue-router";

const router = useRouter(); // 初始化路由实例

// 定义返回方法：跳转到nav-page1
const goBack = () => {
  router.push("/home/nav-page2");
};

const paper3 = computed(() => {
  if (locale.value === "chinese") {
    return {
      title: "《中国碳中和目标下的风光技术展望》报告重磅发布",
      subtitle:
        '本文转自<a href="https://mp.weixin.qq.com/s/bHW-AMmTmNf49Ip05iLRug" target="_blank">清华大学碳中和研究院</a>，发布时间：2024年01月11日',
      text1:
        "2024年1月8日，由清华大学碳中和研究院主办、清华大学环境学院承办的《中国碳中和目标下的风光技术展望》报告发布会顺利召开，二十余名专家出席会议，共同探讨了风光技术发展的关键问题和未来路径。发布会由能源基金会战略规划主任傅莎与清华大学地学系副主任张强教授共同主持。",
      img1Caption: "图1. 与会专家合影",
      text2:
        "在“双碳”目标下，发展风、光等可再生能源是实现低碳发展承诺、能源结构转型的一项重要举措，也是构建新型电力系统的关键、实现“零碳”电力系统的“主力军”。随着风、光可再生能源电力的大规模开发，风、光发电全产业链在技术、成本、安全供应、生态效益等方面面临着前所未有的机遇与挑战。《中国碳中和目标下的风光技术展望》报告站在全球气候变化与中国生态文明建设的关键节点，提出了风光可持续发展的战略措施，识别风、光发电开发的内在优势与产业新机遇、新业态，为我国未来电力系统的绿色与低碳发展提供数据支撑与科学建议。",
      img2Caption: "图2. 中国工程院院士、碳中和研究院院长贺克斌致辞",
      text3:
        "中国工程院院士、清华大学碳中和研究院院长贺克斌在致辞中表示，气候危机的加剧使各国通过科技创新推动绿色低碳转型的需求更加迫切。清华大学碳中和研究院一直在组织专家系统梳理和研究碳中和领域交叉融合创新的关键问题，为推动“双碳”各项工作开展提供总体架构和基础支撑。此次发布的报告是《中国碳中和技术路线展望》系列报告的第一份，后续将陆续发布新型电力系统、零碳货运、零碳工业技术等不同领域的技术路线展望报告，构建交流对话平台，推动相关领域合作，为实现“双碳”目标贡献力量。",
      img3Caption: "图3. 能源基金会首席执行官兼中国区总裁邹骥致辞",
      text4:
        "能源基金会首席执行官兼中国区总裁邹骥在致辞中充分肯定了“双碳”目标下该研究报告的重要意义，并深入分析了中国可再生能源发展的形势及挑战。邹骥表示，COP28为全球可再生能源发展确定了新目标，全球可再生能源发展正迎来一次全新的、高歌猛进的浪潮。通过十余年实践，中国已开始并将持续引领全球范围内可再生能源科技和产业革命潮流。然而，当前中国可再生能源前进道路仍面临来自技术、市场、资金等方面的诸多挑战，如现有电力系统安全稳定运行尚不能承载碳中和所要求的间歇高比例可再生能源的比例，短期内全供应链和需求侧尚不能做到动态均衡等，未来需加速打通各方面发展“堵点”，推动可再生能源可持续良性发展。",
      img4Caption:
        "图4. 国家气候战略中心首任主任、中国能源研究会常务理事李俊峰致辞",
      text5:
        "国家气候战略中心首任主任、中国能源研究会常务理事李俊峰在致辞中表示，风光可再生能源的发展正处在挑战与机遇并存的时代。机遇方面，前不久的COP28上，各国就能源转型达成共识，把可再生能源的发电能力提高三倍，为可再生能源的加速发展提供了全球背景，中国可再生能源的发展将对全球作出重大贡献。与此同时，大规模的风电光伏发展面临着技术、脱钩断链、产能过剩等重大挑战，未来如何形成新的良好健康的产业生态是需要思考解决的问题。",
      img5Caption:
        "图5. 清华大学碳中和研究院减污降碳协同增效研究中心主任、环境学院教授王灿致辞",
      text6:
        "清华大学碳中和研究院减污降碳协同增效研究中心主任、环境学院教授王灿在致辞中表示，风光已经成为绿色发展的新动能。实现碳中和目标的关键是能源的绿色低碳转型，风电光伏的发展是减污降碳的重要手段。从全球产业链和供应链安全的角度，中国风光技术具有独特优势，已成为全球最大的光伏和风电市场，为全球风光技术进步和成本下降作出了巨大贡献。但面向碳中和目标，中国风光技术仍需不断创新，且未来高比例风光发电的电力系统在面对极端天气时的韧性需进一步提升，他呼吁风光领域未来进行跨学科合作，结合人工智能领域等新技术，发展更加可靠的绿色技术。",
      img6Caption: "图6. 秦海岩、张传卫、王志峰、王彬分别作主旨报告",
      text7:
        "会上，中国可再生能源学会风能专业委员会秘书长、世界风能协会副主席、北京鉴衡认证中心主任秦海岩作《中国风电技术发展现状及趋势》主旨报告，明阳集团创始人、明阳新能源投资控股集团党委书记、董事局主席张传卫作《中国碳中和目标下的绿色新质生产力》主旨报告，中国科学院电工研究所研究员王志峰作《太阳能热发电技术发展思考》主旨报告，米塔碳（Meta Carbon）智能科技公司CEO、浙江大学特聘研究员王彬作《人工智能技术在气象遥感上的应用》主旨报告。",
      img7Caption:
        "图7. 能源基金会战略规划主任傅莎与清华大学地学系副主任张强教授主持",
      text8:
        "在报告发布环节，清华大学碳中和研究院院长助理、环境学院教授，报告总召集人鲁玺介绍了《中国碳中和目标下的风光技术展望》的主要内容。报告指出，在碳达峰碳中和的背景下，中国未来风能和太阳能发电将以倍增式发展。在碳中和目标下，2060年我国的风电与光伏装机量将达到2020年风光总装机量的十倍以上，且随着风光发电技术的不断发展与发电效率的提升，2060年的风光发电量将达到2020年风光发电量的十三倍以上。预计到2030、2035、2040、2050和2060年，风电和光伏的装机总量将分别达到所有电源总装机规模的45%、55%、65%、75%和83%。预计到2030年我国风光总装机容量有望达到2200-2400吉瓦，2060年达到5496-7662吉瓦。",
      img8Caption:
        "图8. 报告总召集人、清华大学环境学院教授、碳中和研究院院长助理鲁玺介绍报告内容",
      text9:
        "根据各地区的风光资源禀赋和现有能源装机特征，报告建议华北、西北和东北地区重点发展陆上风电；尽管华东与南方地区陆上风能资源较弱，但海上风电资源充足，因此应重点发展海上风电；华北与西北地区具有丰富的太阳能辐射资源，应着重推动集中式光伏发电的发展；虽然华东、华中和南方地区太阳能辐射资源相对较弱，但考虑到大量的电力供应需求，应基于工业及商业建筑面积，大力发展分布式光伏。该报告由清华大学碳中和研究院联合中国能源研究会可再生能源专业委员会、中国可再生能源学会风能专业委员会、中国光伏行业协会、中国电力工程顾问集团、中国科学院、中国治沙暨沙业学会、中国林业科学研究院等行业协会、研究机构团队共同完成，编写过程中组织了以“面向碳中和的风光技术”为主题的系列碳中和技术论坛与学术沙龙活动，建立了良好的交流合作平台与机制，100多位专家参与了报告撰写与审议工作。",
      img9Caption:
        "图9. 朱蓉、蒋莉萍、曹海滨、陈道户、杜东亚、李琼慧、徐征、王卫权参加圆桌讨论",
      text10:
        "在圆桌讨论环节，中国气象局国家气候中心二级研究员朱蓉，国网能源研究院国网三级顾问（原副院长）、正高级工程师蒋莉萍，国家电投北京公司副总经理、中国治沙暨沙业学会光伏治沙专委会副主任委员曹海滨，隆基股份能源发展研究院副院长陈道户，天合光能股份有限公司中国区总裁杜东亚，国网能源研究院新能源研究所资深专家、正高级工程师李琼慧，北京交通大学物理科学与工程学院教授、光电子技术研究所研究员徐征，中国能源研究会可再生能源专业委员会副秘书长、高级工程师王卫权参与讨论。清华大学地学系副主任张强教授主持本环节。来自地方、科研院所、高校、智库组织二十余名专家代表，来自中国日报、澎湃新闻、中国能源报、人民政协报、中国网、中国经济网、环球网等近十余家主流媒体代表现场或在线参加了报告发布会，发布会在线观看超20.8万人次。",
      bottomInfo:
        "文字 | 报告课题组<br>图片 | 刘秋实<br>排版 | 王雨薇<br>编辑 | 王雨薇<br>责编 | 张文静<br>审核 | 鲁玺",
    };
  } else {
    return {
      title:
        "Report Release: Technology Outlook on Wind and Solar Power toward China’s Neutrality Goal",
      subtitle:
        'This article is reproduced from the official website of the Institute for Carbon Neutrality, Tsinghua University (<a href="https://mp.weixin.qq.com/s/bHW-AMmTmNf49Ip05iLRug" target="_blank">Original link</a>).Release date: January 11, 2024.',
      text1: `On January 8, 2024, the release conference of the Wind and Solar Technology Outlook toward China’s Carbon Neutrality Goal was successfully held, hosted by the Tsinghua University Institute for Carbon Neutrality and organized by the School of Environment, Tsinghua University. More than 20 experts attended the conference to discuss key issues and future pathways for the development of wind and solar technologies. The conference was co-chaired by Sha Fu, Director of Strategic Planning at the Energy Foundation, and Professor Qiang Zhang, Deputy Director of the Department of Earth System Science at Tsinghua University.`,
      img1Caption: "Figure 1. Group photo of attending experts",
      text2: `Under the "dual-carbon" goals, the development of renewable energy such as wind and solar power is an important measure to fulfill low-carbon development commitments and promote energy structure transformation. It is also crucial for constructing a new-type power system and serving as the main force in achieving a "zero-carbon" power system. With the large-scale development of wind and solar renewable energy, the entire industry chain of wind and solar power generation faces unprecedented opportunities and challenges in terms of technology, cost, secure supply, and ecological benefits. Standing at the critical juncture of global climate change and China’s ecological civilization construction, the Wind and Solar Technology Outlook toward China’s Carbon Neutrality Goal proposes strategic measures for the sustainable development of wind and solar power, identifies the inherent advantages and new industrial opportunities and formats of wind and solar power development, and provides data support and scientific recommendations for the green and low-carbon development of China’s future power systems.`,
      img2Caption:
        "Figure 2. Kebin He, Academician of the Chinese Academy of Engineering and Dean of the Institute for Carbon Neutrality, delivers a speech",
      text3: `In his speech, Kebin He, Academician of the Chinese Academy of Engineering and Dean of the Tsinghua University Institute for Carbon Neutrality, stated that the worsening climate crisis has made the need for countries to promote green and low-carbon transformation through scientific and technological innovation more urgent. The Tsinghua University Institute for Carbon Neutrality has been organizing experts to systematically sort out and study key issues of interdisciplinary and integrated innovation in the field of carbon neutrality, providing an overall framework and basic support for promoting various "dual-carbon" initiatives. The released report is the first in the Carbon Neutrality Technology Roadmap Outlook series. In the future, technology roadmap outlook reports for different fields such as new-type power systems, zero-carbon freight, and zero-carbon industrial technologies will be successively released to build a platform for exchange and dialogue, promote cooperation in related fields, and contribute to achieving the "dual-carbon" goals.`,
      img3Caption:
        "Figure 3. Ji Zou, CEO and President of the Energy Foundation China, delivers a speech",
      text4: `Ji Zou, CEO and President of the Energy Foundation China, fully affirmed the significance of the research report under the "dual-carbon" goals and deeply analyzed the situation and challenges of China’s renewable energy development. Ji Zou noted that COP28 has set new goals for global renewable energy development, and the global renewable energy sector is ushering in a new wave of rapid progress. Through more than a decade of practice, China has begun and will continue to lead the global trend of renewable energy technology and industrial revolution. However, China’s renewable energy development still faces many challenges in technology, market, and capital. For example, the existing power system cannot yet ensure the safe and stable operation required to accommodate the high proportion of intermittent renewable energy needed for carbon neutrality, and the entire supply chain and demand side cannot achieve dynamic balance in the short term. In the future, it is necessary to accelerate the resolution of development "blocking points" in all aspects to promote the sustainable and sound development of renewable energy.`,
      img4Caption:
        "Figure 4. Junfeng Li, First Director of the National Climate Strategy Center and Executive Director of the China Energy Research Society, delivers a speech",
      text5: `Junfeng Li, First Director of the National Climate Strategy Center and Executive Director of the China Energy Research Society, stated that the development of wind and solar renewable energy is in an era of both challenges and opportunities. In terms of opportunities, at the recent COP28, countries reached a consensus on energy transition to triple renewable energy power generation capacity, providing a global context for the accelerated development of renewable energy. China’s renewable energy development will make significant contributions to the world. At the same time, the large-scale development of wind and photovoltaic power faces major challenges such as technology, supply chain disruptions, and overcapacity. How to form a new healthy industrial ecosystem in the future is an issue that needs to be addressed.`,
      img5Caption:
        "Figure 5. Can Wang, Director of the Research Center for Synergistic Pollution Reduction and Carbon Emission Reduction at the Tsinghua University Institute for Carbon Neutrality and Professor at the School of Environment, delivers a speech",
      text6: `Can Wang, Director of the Research Center for Synergistic Pollution Reduction and Carbon Emission Reduction at the Tsinghua University Institute for Carbon Neutrality and Professor at the School of Environment, stated that wind and solar power have become new drivers of green development. The key to achieving carbon neutrality is the green and low-carbon transformation of energy, and the development of wind and photovoltaic power is an important means of pollution reduction and carbon emission reduction. From the perspective of global industrial chain and supply chain security, China’s wind and solar technologies have unique advantages. China has become the world’s largest market for photovoltaic and wind power, making tremendous contributions to global technological progress and cost reduction in wind and solar power. However, facing the carbon neutrality goal, China’s wind and solar technologies still need continuous innovation, and the resilience of future power systems with a high proportion of wind and solar power to extreme weather needs to be further enhanced. He called for interdisciplinary cooperation in the wind and solar field in the future, integrating new technologies such as artificial intelligence to develop more reliable green technologies.`,
      img6Caption:
        "Figure 6. Haiyan Qin, Chuanwei Zhang, Zhifeng Wang, and Bin Wang deliver keynote speeches respectively",
      text7: `At the conference, Haiyan Qin, Secretary-General of the Wind Energy Professional Committee of the China Renewable Energy Society, Vice President of the World Wind Energy Association, and Director of the Beijing Jianheng Certification Center, delivered a keynote speech on Current Status and Trends of China’s Wind Power Technology Development; Chuanwei Zhang, Founder of Mingyang Group, Secretary of the Party Committee, and Chairman of the Board of Mingyang New Energy Investment Holding Group, delivered a keynote speech on Green New Productive Forces under China’s Carbon Neutrality Goal; Zhifeng Wang, Researcher at the Institute of Electrical Engineering, Chinese Academy of Sciences, delivered a keynote speech on Reflections on the Development of Solar Thermal Power Generation Technology; and Bin Wang, CEO of Meta Carbon Intelligent Technology Co., Ltd. and Distinguished Researcher at Zhejiang University, delivered a keynote speech on Applications of Artificial Intelligence Technology in Meteorological Remote Sensing.`,
      img7Caption:
        "Figure 7. Sha Fu, Director of Strategic Planning at the Energy Foundation, and Qiang Zhang, Deputy Director of the Department of Earth System Science at Tsinghua University, chair the conference",
      text8: `In the report release session, Xi Lu, Assistant Dean of the Tsinghua University Institute for Carbon Neutrality, Professor at the School of Environment, and General Convener of the report, introduced the main contents of the Wind and Solar Technology Outlook toward China’s Carbon Neutrality Goal. The report points out that against the backdrop of carbon peak and carbon neutrality, China’s future wind and solar power generation will develop in a multiplicative manner. Under the carbon neutrality goal, the installed capacity of wind and photovoltaic power in China will reach more than ten times the total installed capacity in 2020 by 2060, and with the continuous development of wind and solar power generation technologies and the improvement of power generation efficiency, wind and solar power generation in 2060 will reach more than thirteen times that in 2020. It is estimated that by 2030, 2035, 2040, 2050, and 2060, the total installed capacity of wind and photovoltaic power will account for 45%, 55%, 65%, 75%, and 83% of the total installed capacity of all power sources, respectively. It is expected that the total installed capacity of wind and solar power in China will reach 2,200-2,400 GW by 2030 and 5,496-7,662 GW by 2060.`,
      img8Caption:
        "Figure 8. Xi Lu, General Convener of the report, Professor at the School of Environment, and Assistant Dean of the Institute for Carbon Neutrality at Tsinghua University, introduces the report contents",
      text9: `Based on the wind and solar resource endowments and existing energy installed capacity characteristics of each region, the report suggests focusing on the development of onshore wind power in North China, Northwest China, and Northeast China. Although onshore wind energy resources in East China and Southern China are relatively weak, offshore wind energy resources are abundant, so offshore wind power should be prioritized. North China and Northwest China have rich solar radiation resources and should focus on promoting the development of centralized photovoltaic power generation. Although solar radiation resources in East China, Central China, and Southern China are relatively weak, considering the large demand for power supply, distributed photovoltaics should be vigorously developed based on industrial and commercial building areas.
The report was jointly completed by the Tsinghua University Institute for Carbon Neutrality, the Renewable Energy Professional Committee of the China Energy Research Society, the Wind Energy Professional Committee of the China Renewable Energy Society, the China Photovoltaic Industry Association, the China Electric Power Engineering Consulting Group, the Chinese Academy of Sciences, the Chinese Society of Desertification and Sand Industry, the Chinese Academy of Forestry, and other industry associations and research institutions. During the preparation process, a series of carbon neutrality technology forums and academic salons with the theme of "Wind and Solar Technologies for Carbon Neutrality" were organized to establish a good communication and cooperation platform and mechanism. More than 100 experts participated in the writing and review of the report.`,
      img9Caption:
        "Figure 9. Rong Zhu, Liping Jiang, Haibin Cao, Daohu Chen, Dongya Du, Qionghui Li, Zheng Xu, and Weiquan Wang participate in the roundtable discussion",
      text10: `In the roundtable discussion session, Rong Zhu, a Senior Researcher at the National Climate Center of the China Meteorological Administration; Liping Jiang, a Senior Consultant (Former Vice President) of the State Grid Energy Research Institute and a Senior Engineer; Haibin Cao, Deputy General Manager of the State Power Investment Beijing Company and Deputy Director of the Photovoltaic Desert Control Special Committee of the Chinese Society of Desertification and Sand Industry; Daohu Chen, Deputy Dean of the Energy Development Research Institute of Longi Green Energy; Dongya Du, President of the China Region of Trina Solar Co., Ltd.; Qionghui Li, a Senior Expert at the New Energy Research Institute of the State Grid Energy Research Institute and a Senior Engineer; Zheng Xu, a Professor at the School of Physical Science and Engineering and a Researcher at the Institute of Optoelectronic Technology of Beijing Jiaotong University; and Weiquan Wang, Deputy Secretary-General and Senior Engineer of the Renewable Energy Professional Committee of the China Energy Research Society, participated in the discussion. This session was chaired by Professor Qiang Zhang, Deputy Director of the Department of Earth System Science at Tsinghua University.
More than 20 expert representatives from local authorities, scientific research institutes, universities, and think tanks, as well as representatives from nearly ten mainstream media outlets including China Daily, The Paper, China Energy News, People’s Political Consultative Conference News, China.com, China Economic Net, and Huanqiu.com, attended the report release conference on-site or online. The conference was viewed online by more than 208,000 people.`,
      bottomInfo:
        "Text | Report Research Team<br>Images | Qiushi Liu<br>Layout | Yuwei Wang<br>Editor | Yuwei Wang<br>Copy Editor | Wenjing Zhang<br>Reviewer | Xi Lu",
    };
  }
});
</script>

<style lang="scss" scoped>
/* 与paper2、paper4完全一致的样式 */
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
    .image-caption {
      width: 100%;
      line-height: 1.8;
      font-size: 18px;
      color: #000;
      padding-left: 15%;
      padding-right: 15%;
      text-align: center;
      margin-bottom: 10px;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .bottom-right {
      width: 100%;
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
