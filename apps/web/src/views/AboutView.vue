<template>
  <div class="about_view">
    <div class="about-container">
      <h1 class="title">{{ $t("about.title") }}</h1>

      <div class="section" id="background">
        <h2 class="section-title">
          <i class="iconfont icon-info"></i>
          {{ $t("about.background.title") }}
        </h2>
        <div class="content">
          <p>{{ $t("about.background.content1") }}</p>
          <p>{{ $t("about.background.content2") }}</p>
        </div>
      </div>

      <div class="section" id="features">
        <h2 class="section-title">
          <i class="iconfont icon-function"></i>
          {{ $t("about.features.title") }}
        </h2>
        <div class="content">
          <div class="feature-main">
            {{ $t("about.features.content1")
            }}<strong>{{ $t("about.features.highlight1") }}</strong
            >{{ $t("about.features.content2") }}<br />
            {{ $t("about.features.content3")
            }}<strong>{{ $t("about.features.highlight2") }}</strong
            >{{ $t("about.features.content4") }}<br />
            {{ $t("about.features.content5") }}
          </div>
        </div>
      </div>

      <div class="section" id="team">
        <h2 class="section-title">
          <i class="iconfont icon-team"></i>
          {{ $t("about.team.title") }}
        </h2>
        <div class="content">
          <div class="team-intro">
            {{ $t("about.team.intro") }}
          </div>
          <div class="team-grid">
            <div class="team-group">
              <h3>
                <i class="iconfont icon-user"></i>
                {{ $t("about.team.developers.title") }}
              </h3>
              <div class="member-list">
                <!-- 添加调试信息 -->
                <div v-if="developersList.length === 0" style="color: red">
                  开发团队列表为空
                </div>
                <span
                  v-for="member in developersList"
                  :key="member"
                  class="member"
                  >{{ member }}</span
                >
              </div>
            </div>
            <div class="team-group">
              <h3>
                <i class="iconfont icon-expert"></i>
                {{ $t("about.team.advisors.title") }}
              </h3>
              <div class="member-list">
                <span
                  v-for="member in advisorsList"
                  :key="member"
                  class="member"
                  >{{ member }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section" id="thanks">
        <h2 class="section-title">
          <i class="iconfont icon-thanks"></i>
          {{ $t("about.thanks.title") }}
        </h2>
        <div class="content">
          <p>{{ $t("about.thanks.content") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

// 使用 ref 来存储团队成员列表
const developersList = ref([]);
const advisorsList = ref([]);

// 更新成员列表的函数
const updateTeamLists = () => {
  try {
    // 根据当前语言选择显示中文或英文名字
    if (locale.value === 'chinese') {
      developersList.value = [
        "鲁玺",
        "李朝君",
        "许春",
        "苏雨琦",
        "程垦",
        "马泽洋",
        "苏展毅",
        "石坤",
        "李新杰",
      ];
      advisorsList.value = ["罗勇", "王剑晓"];
    } else {
      developersList.value = [
        "Lu Xi",
        "Li Chaojun",
        "Xu Chun",
        "Su Yuqi",
        "Cheng Ken",
        "Ma Zeyang",
        "Su Zhanyi",
        "Shi Kun",
        "Li Xinjie",
      ];
      advisorsList.value = ["Luo Yong", "Wang Jianxiao"];
    }

    // 打印检查获取的值
    
    
  } catch (error) {
    console.error("更新团队列表时出错：", error);
    developersList.value = [];
    advisorsList.value = [];
  }
};

// 在组件挂载后立即更新列表
onMounted(() => {
  
  updateTeamLists();
});

// 监听语言变化并更新列表
watch(locale, () => {
  
  updateTeamLists();
});
</script>

<style lang="scss" scoped>
.about_view {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
  padding: 40px 0;

  .about-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px;

    .title {
      text-align: center;
      font-size: 38px;
      color: #222;
      font-weight: bold;
      margin-bottom: 48px;
      letter-spacing: 2px;
      position: relative;
      &::after {
        content: "";
        display: block;
        margin: 16px auto 0;
        width: 80px;
        height: 4px;
        border-radius: 2px;
        background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
      }
    }

    .section {
      background: rgba(255, 255, 255, 0.97);
      border-radius: 12px;
      padding: 32px 28px 28px 28px;
      margin-bottom: 32px;
      box-shadow: 0 4px 24px rgba(64, 158, 255, 0.08);
      transition: box-shadow 0.3s;
      &:hover {
        box-shadow: 0 8px 32px rgba(64, 158, 255, 0.16);
      }

      .section-title {
        color: #409eff;
        font-size: 26px;
        margin-bottom: 18px;
        border-bottom: 2px solid #409eff22;
        padding-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        i {
          font-size: 22px;
        }
      }

      .content {
        color: #333;
        line-height: 2;
        font-size: 16px;

        .feature-main {
          background: linear-gradient(90deg, #f6faff 60%, #eaf6ff 100%);
          border-left: 4px solid #409eff;
          border-radius: 8px;
          padding: 20px 24px;
          font-size: 16.5px;
          color: #222;
          margin-bottom: 28px;
          line-height: 2;
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.06);
          strong {
            color: #409eff;
            font-weight: 600;
          }
        }
        .feature-highlight-grid {
          display: flex;
          gap: 32px;
          justify-content: center;
          .feature-highlight {
            flex: 1;
            min-width: 120px;
            max-width: 200px;
            background: #e8f4ff;
            border-radius: 8px;
            padding: 18px 0 12px 0;
            text-align: center;
            box-shadow: 0 2px 8px rgba(64, 158, 255, 0.06);
            transition: box-shadow 0.2s;
            &:hover {
              box-shadow: 0 4px 16px rgba(64, 158, 255, 0.12);
            }
            i {
              font-size: 32px;
              color: #409eff;
              margin-bottom: 8px;
              display: block;
            }
            .desc {
              font-size: 16px;
              color: #222;
              margin-top: 8px;
              font-weight: 500;
            }
          }
        }

        .team-intro {
          margin-bottom: 18px;
        }
        .team-grid {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
          .team-group {
            flex: 1;
            min-width: 280px; // 增加最小宽度
            background: rgba(255, 255, 255, 0.8); // 添加背景色
            padding: 20px; // 添加内边距
            border-radius: 8px; // 添加圆角
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05); // 添加阴影
            h3 {
              display: flex;
              align-items: center;
              font-size: 18px; // 增大字号
              color: #409eff;
              margin-bottom: 16px; // 增加底部间距
              i {
                font-size: 22px; // 增大图标尺寸
                margin-right: 8px;
              }
            }
            .member-list {
              display: flex;
              flex-wrap: wrap;
              gap: 12px; // 统一间距
              .member {
                background: #e8f4ff;
                color: #222;
                border-radius: 6px; // 增大圆角
                padding: 6px 14px; // 增加内边距
                font-size: 15px;
                transition: all 0.3s; // 添加过渡效果
                &:hover {
                  background: #409eff;
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
  }
}

/* 可选：自定义iconfont图标样式 */
.iconfont {
  color: #409eff;
  vertical-align: middle;
}
</style>
