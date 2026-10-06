<template>
  <div class="chart_box gray-text">
    <div class="param_box">
      <div class="region-cascader">
        <el-cascader
          class="icon-cascader"
          ref="cascaderRef"
          v-model="selectedAreaValue"
          :options="options"
          :props="{
            expandTrigger: 'click',
            multiple: true,
            checkStrictly: true,
          }"
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="1"
          clearable
          @change="handlerChange"
          v-if="!is_show"
          :placeholder="$t('chart.selectRegion')"
          style="width: 80px"
        >
          <template #default="{ node, data }">
            <div class="custom-node">
              <!-- 根据数据的value值显示不同的标题（区域、次区域、国家、省级、县级） -->
              <div v-if="data.value === '区域'" class="icon-title">
                <span style="color: #333">{{ data.label }}</span>
              </div>
              <div v-if="data.value === '次区域'" class="icon-title">
                <span style="color: #333">{{ data.label }}</span>
              </div>
              <div v-if="data.value === '国家'" class="icon-title">
                <span style="color: #333">{{ data.label }}</span>
              </div>
              <div v-if="data.value === '电网'" class="icon-title">
                <span style="color: #333">{{ data.label }}</span>
              </div>
              <div v-if="data.value === '省级'" class="icon-title">
                <span style="color: #333">{{ data.label }}</span>
              </div>
              <div v-if="data.value === '县级'" class="icon-title">
                <span style="color: #333">{{ data.label }}</span>
              </div>
              <div v-if="data.value === '地级'" class="icon-title">
                <span style="color: #333">{{ data.label }}</span>
              </div>
            </div>
            <div
              class="node-wrapper"
              @click.stop.prevent="handleNodeClick(node, data)"
            >
              <span class="node-text">{{ data.label }}</span>
              <span class="blank-area"></span>
            </div>
          </template>
        </el-cascader>
      </div>
      <el-select
        v-model="select_time_value"
        :placeholder="$t('chart.elSelectPlaceholder')"
        @change="handleTimeChange"
        :style="{ width: timeSelectWidth }"
        v-show="showTimePicker > 0"
      >
        <el-option
          v-for="item in timeSelection"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <!-- 当路径包含具体年份时，显示该年份 -->
      <div
        v-show="showTimePicker === 0 && time_value"
        class="specific-time-display"
      >
        {{ time_value }}
      </div>
      <div class="temporal_resolution">
        <div class="yearPicker" v-show="showTimePicker === 1">
          <el-date-picker
            type="years"
            v-model="selectedYear"
            :placeholder="$t('chart.year')"
            format="YYYY"
            value-format="YYYY"
            :disabled-date="disabledDate"
            @change="handleYearChange"
            style="width: 160px"
          >
          </el-date-picker>
        </div>
        <div class="monthPicker" v-show="showTimePicker === 2">
          <el-date-picker
            type="year"
            v-model="yearValue"
            :placeholder="$t('chart.year')"
            format="YYYY"
            value-format="YYYY"
            :disabled-date="disabledDate"
            @change="handleYear_MonthChange"
            style="width: 80px"
          ></el-date-picker>
          <el-date-picker
            type="months"
            v-model="selectedMonth"
            :placeholder="$t('chart.month')"
            format="YYYY-MM"
            value-format="YYYYMM"
            :disabled-date="disabledMonthDate"
            @change="handleMonthChange"
            style="width: 100px"
          >
          </el-date-picker>
        </div>
        <div class="hourPicker" v-show="showTimePicker === 3">
          <el-date-picker
            type="year"
            v-model="yearValue"
            :placeholder="$t('chart.year')"
            format="YYYY"
            value-format="YYYY"
            :disabled-date="disabledDate"
            @change="handleYear_HourChange"
            style="width: 80px"
          >
          </el-date-picker>
          <el-date-picker
            type="datetimerange"
            v-model="selectedHour"
            :start-placeholder="$t('chart.startHourPlaceholder')"
            :end-placeholder="$t('chart.endHourPlaceholder')"
            format="YYYY-MM-DD HH"
            value-format="YYYY-MM-DD HH:00:00"
            :disabled-date="disabledHourDate"
            @change="handleHourChange"
            style="width: 200px"
          >
          </el-date-picker>
        </div>
      </div>
      <el-button type="primary" @click="searchData">{{
        $t("message.confirm")
      }}</el-button>
    </div>
    <div class="echart_box">
      <div class="chart" ref="chartRef"></div>
    </div>

    <TableBox :resData1="resData1"></TableBox>
    <div class="tool-box-container">
      <ToolBox
        :resData1="resData1"
        :is_download_Disabled="is_download_Disabled"
      ></ToolBox>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, onActivated, onDeactivated, nextTick, reactive, ref, watch, computed } from "vue";
import * as echarts from "@/utils/echarts";
import { getLinedata, getRegions, getDescription } from "@/request";
import TableBox from "./table/TableBox.vue";
import ToolBox from "./table/ToolBox.vue";
import bus from "@/utils/bus";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import original_options from "./original_options.js";
import original_options_en from "./original_options_en.js";
import original_options2 from "./original_options2.js";
import original_options2_en from "./original_options2.js";
function processMapPath(map) {
  if (map.endsWith("m")) {
    const lastSlashIndex = map.lastIndexOf("/");
    if (lastSlashIndex !== -1) {
      map = map.substring(0, lastSlashIndex);
    }
  }
  return map;
}
const { t, locale } = useI18n();
// 监听语言变化并更新列表
watch(locale, async () => {
  update_options();
  updateChart();

  // 清空当前选择的区域，避免语言切换后显示不匹配的选项
  selectedAreaValue.value = [];
  lastValidSelection.value = [];

  // 重新获取区域选项数据
  if (selectedMap.value) {
    const map = processMapPath(selectedMap.value);
    const region_params = {
      map,
    };

    try {
      const region_res = await getRegions(region_params);
      if (region_res) {
        options.value = dynamic_region(region_res.regionsZn);
      } else {
        options.value = [];
      }
    } catch (regionError) {
      console.error("语言切换时获取区域数据失败:", regionError);
      options.value = [];
    }

    // 重新获取数据说明
    const description_params = {
      map: selectedMap.value.split("/").slice(0, -1).join("/"),
      language: locale.value,
    };
    try {
      const description_res = await getDescription(description_params);
      if (description_res) {
        resData1.value = description_res;
      } else {
        resData1.value = null;
      }
    } catch (error) {
      console.error("语言切换时获取数据说明失败:", error);
      resData1.value = null;
    }
  }
});

const resData1 = ref(null);

onMounted(() => {
  bus.on("clearSelected", handleClearSelected);
  initChart();
});

const chartRef = ref(null);

// 图相关数据
const chartData = ref({});
const chartType = ref("line"); // 默认折线图
// 时间分辨率的使用
const select_time_value = ref(""); // 右侧选择的时间分辨率
const map_time_value = ref(""); // 地图传的时间分辨率
const time_value = ref(""); // 地图传的时间分辨率
const choose_time_value = ref(false); // 决定图的横坐标

const showTimePicker = ref(0);
const selectedYear = ref([]);
const selectedMonth = ref([]);
const selectedHour = ref([]);
const timeResult = ref([]);
const timeScale = ref("年");
const timeScale_line = ref("");
const timeSpan = ref([]);
const timeSpan_year = ref([]);
const timeSpan_month = ref([]);
const timeSpan_hour = ref([]);
let timeSelection1 = ref("年");
let timeSelection2 = ref("月");
let timeSelection3 = ref("小时");
// 选择小时、月后的年份选择
const Year_Hour = ref("");
const Year_Month = ref("");
const yearValue = ref("");
// 右侧区域选择的使用
const selectedMap = ref("");
const selectedLevel = ref("区域");
const selectedPlaces = ref([]);
let tableParams_year = ref("");
let tableParams_timescale = ref("");
let options = ref([]);
function update_options() {
  // 更新时间相关的选项
  if (locale.value === "chinese") {
    timeSelection1.value = "年";
    timeSelection2.value = "月";
    timeSelection3.value = "小时";
    if (
      select_time_value.value === "Year" ||
      select_time_value.value === "年"
    ) {
      timeScale.value = "年";
      select_time_value.value = "年";
      selectedAreaValue.value = "年";
    } else if (
      select_time_value.value === "Month" ||
      select_time_value.value === "月"
    ) {
      timeScale.value = "月";
      select_time_value.value = "月";
      time_value.value = "月";
    } else if (
      select_time_value.value === "Hour" ||
      select_time_value.value === "小时"
    ) {
      timeScale.value = "小时";
      select_time_value.value = "小时";
      time_value.value = "小时";
    }
    if (time_value.value === "Year") {
      time_value.value = "年";
    } else if (time_value.value === "Month") {
      time_value.value = "月";
    } else if (time_value.value === "Hour") {
      time_value.value = "小时";
    }
  } else {
    timeSelection1.value = "Year";
    timeSelection2.value = "Month";
    timeSelection3.value = "Hour";
    if (
      select_time_value.value === "年" ||
      select_time_value.value === "Year"
    ) {
      timeScale.value = "Year";
      select_time_value.value = "Year";
      time_value.value = "Year";
    } else if (
      select_time_value.value === "月" ||
      select_time_value.value === "Month"
    ) {
      timeScale.value = "Month";
      select_time_value.value = "Month";
      time_value.value = "Month";
    } else if (
      select_time_value.value === "小时" ||
      select_time_value.value === "Hour"
    ) {
      timeScale.value = "Hour";
      select_time_value.value = "Hour";
      time_value.value = "Hour";
    }
    if (time_value.value === "年") {
      time_value.value = "Year";
    } else if (time_value.value === "月") {
      time_value.value = "Month";
    } else if (time_value.value === "小时") {
      time_value.value = "Hour";
    }
  }
}

let timeSelectWidth = ref("160px");

// 右面时间分辨率年月小时改变
const handleTimeChange = (newValue) => {
  if (newValue !== null) {
    // 修改宽度
    timeSelectWidth.value = "80px";
  }

  selectedYear.value = [];
  selectedMonth.value = [];
  selectedHour.value = [];
  Year_Hour.value = "";
  Year_Month.value = "";
  yearValue.value = "";
  timeScale.value = newValue;
  timeResult.value = [];
  timeSpan_year.value = [];
  timeSpan_month.value = [];
  timeSpan_hour.value = [];
  time_value.value = newValue;

  if (newValue === "年" || newValue === "Year") {
    timeScale_line.value = "yr";
    timeSpan.value = timeSpan_year.value;
    showTimePicker.value = 1;
  } else if (newValue === "月" || newValue === "Month") {
    timeScale_line.value = `mo_${Year_Month.value}`;
    timeSpan.value = timeSpan_month.value;
    showTimePicker.value = 2;
  } else if (newValue === "小时" || newValue === "Hour") {
    timeSpan.value = timeSpan_hour.value;
    timeScale_line.value = `hr_${Year_Hour.value}`;
    showTimePicker.value = 3;
  } else {
    showTimePicker.value = 0;
  }
};

const timeSelection = computed(() => [
  {
    value: t("chart.year"),
    label: t("chart.year"),
  },
  {
    value: t("chart.month"),
    label: t("chart.month"),
  },
  {
    value: t("chart.hour"),
    label: t("chart.hour"),
  },
]);

// timeResult的值 右面日历变化
const handleYearChange = (value) => {
  timeResult.value = value;
  timeScale_line.value = "yr";
  timeScale.value = value;
  timeSpan.value = value;
  timeSpan_year.value = timeSpan.value;
};

const handleMonthChange = (value) => {
  timeResult.value = value;
  timeScale.value = value;
  if (value === null) {
    timeSpan.value = [];
  } else {
    timeSpan.value = [...value];
    timeSpan.value = timeSpan.value.map((item) =>
      item.replace(/(\d{4})(\d{2})/, "$1$2")
    );
  }
  timeSpan_month.value = timeSpan.value;
};

const handleHourChange = (value) => {
  timeScale_line.value = `hr_${Year_Hour.value}`;

  if (!value || !value[0] || !value[1]) {
    timeResult.value = [];
    timeSpan.value = [];
    return;
  }

  let startTime = value[0];
  let endTime = value[1];
  const result = [startTime, endTime];
  timeResult.value = result;
  timeSpan.value = [...value];
  timeSpan_hour.value = timeSpan.value;
};

// 月的年改变
const handleYear_MonthChange = (value) => {
  Year_Month.value = value;
  timeScale_line.value = `mo_${Year_Month.value}`;
};

// 小时的年改变
const handleYear_HourChange = (value) => {
  Year_Hour.value = value;
  timeScale_line.value = `hr_${Year_Hour.value}`;
};

// 右侧确定按钮响应
const searchData = async (values) => {
  // 传递给TableBox组件和Map2D的参数
  const boundaryType = selectedMap.value.includes("陆上风电")
    ? "boundary"
    : "ocean";
  const boundaryArea = selectedPlaces.value.join(",");
  const boundaryParams = {
    level: selectedLevel.value,
    area: boundaryArea,
    class: boundaryType,
    CRS: "EPSG:4326",
  };

  if (timeScale_line.value !== "yr") {
    tableParams_year.value = yearValue.value;
    if (timeScale_line.value.startsWith("mo")) {
      tableParams_timescale.value = "月";
    } else {
      tableParams_timescale.value = "小时";
    }
  } else {
    tableParams_year.value = "";
    tableParams_timescale.value = "年";
  }

  // level参数始终使用中文，后端可能不支持英文level值
  const tableParams = {
    map: selectedMap.value,
    timescale: tableParams_timescale.value,
    year: tableParams_year.value,
    level: selectedLevel.value, // 保持原始的中文level值
    language: locale.value,
  };

  bus.emit("boundaryParams", boundaryParams);
  bus.emit("tableParams", tableParams);

  // 没有选择则返回
  if (selectedMap.value === "" || timeScale_line.value === "") return;

  const params = {
    map: selectedMap.value,
    timescale: timeScale_line.value,
    timespan: timeSpan.value === null ? [] : timeSpan.value,
    level: selectedLevel.value,
    places: selectedPlaces.value,
    language: locale.value,
  };

  try {
    const res = await getLinedata(params);
    resData.value = [res];
    // 处理图表数据
    await getChartData();
    updateChart();
  } catch (error) {
    console.error("获取数据失败:", error);
    ElMessage.error(t("message.dataFetchError"));
  }
};

// 清除所选项
const handleClearSelected = (data) => {
  resData1.value = data;
};

// 时间选择器的时间范围
function disabledDate(time) {
  return time.getTime() > Date.now();
}

// 选择小时 -- 必须确定年份
function disabledMonthDate(time) {
  const selectedYear = Number(yearValue.value);
  if (time.getFullYear() !== selectedYear) {
    return true; // 不是指定年份，禁用
  }
  return false; // 没有首个时间，允许选择（只限制年份）
}

function disabledHourDate(time) {
  const selectedYear = Number(yearValue.value);
  if (time.getFullYear() !== selectedYear) {
    return true; // 不是指定年份，禁用
  }
  return false; // 没有首个时间，允许选择（只限制年份）
}

// 接收DataService文件传的地图数据
const props = defineProps({
  selectMapPath: {
    type: String,
    default: "",
  },
  dataUnit: {
    type: String,
    default: "",
  },
  dataTypeThree: {
    type: String,
    default: "",
  },
  hourYear: {
    type: String,
    default: "",
  },
  tifMapPath: {
    type: String,
    default: "",
  },
});

const dataUnitMap = {
  "GWh/km<sup>2</sup>": "GWh/km²",
  "MW/km<sup>2</sup>": "MW/km²",
};

const selectedValues = ref("");
const is_download_Disabled = ref(true);

// 监听 props.selectMapPath 变化 左侧
watch(
  () => props.selectMapPath,
  async (newPath) => {
    try {
      if (newPath) {
        if (
          newPath.includes("潜力数据") &&
          !newPath.startsWith("用户侧") &&
          !newPath.startsWith("电网侧")
        ) {
          is_download_Disabled.value = false;
        } else {
          is_download_Disabled.value = true;
        }

        // 更新选中值
        selectedMap.value = newPath;
        selectedValues.value = newPath.split("/").slice(0, -1).join("/");

        if (
          selectedMap.value.split("/").pop() === "年" ||
          selectedMap.value.split("/").pop() === "月" ||
          selectedMap.value.split("/").pop() === "小时"
        ) {
          selectedMap.value = newPath.split("/").slice(0, -1).join("/");
        }

        map_time_value.value = newPath.split("/").pop();
        // 横坐标切换语言
        time_value.value = newPath.split("/").pop();
        if (locale.value === "english") {
          if (time_value.value === "年") {
            time_value.value = "Year";
          } else if (time_value.value === "月") {
            time_value.value = "Month";
          } else if (time_value.value === "小时") {
            time_value.value = "Hour";
          }
        }

        // 重置时间选择器状态
        select_time_value.value = "";
        showTimePicker.value = 0;
        timeSelectWidth.value = "160px";
        selectedAreaValue.value = [];
        selectedPlaces.value = [];

        // 根据地图路径设置默认时间尺度
        // 检查路径是否包含4位数字年份（如2021）
        const specificYearMatch = newPath.match(/\b(20\d{2})\b/);
        const yearMatch = specificYearMatch || newPath.includes("年");
        const monthMatch = newPath.includes("月");
        const hourMatch = newPath.includes("小时");

        if (specificYearMatch && !monthMatch && !hourMatch) {
          // 路径包含具体年份，直接设置为该年份，不显示时间选择器
          const specificYear = specificYearMatch[1];
          select_time_value.value = "";
          time_value.value = specificYear;
          timeScale.value = specificYear;
          timeScale_line.value = "yr";
          showTimePicker.value = 0; // 不显示时间选择器
          timeSelectWidth.value = "160px";
          selectedYear.value = [specificYear];
          timeSpan_year.value = [specificYear];
          timeSpan.value = [specificYear];
        } else if (yearMatch && !monthMatch && !hourMatch) {
          // 路径只包含"年"字符，显示年份选择器
          select_time_value.value = locale.value === "chinese" ? "年" : "Year";
          time_value.value = locale.value === "chinese" ? "年" : "Year";
          timeScale.value = locale.value === "chinese" ? "年" : "Year";
          timeScale_line.value = "yr";
          showTimePicker.value = 1;
          timeSelectWidth.value = "80px";
        } else if (monthMatch) {
          select_time_value.value = locale.value === "chinese" ? "月" : "Month";
          time_value.value = locale.value === "chinese" ? "月" : "Month";
          timeScale.value = locale.value === "chinese" ? "月" : "Month";
          timeScale_line.value = `mo_${
            props.hourYear || new Date().getFullYear()
          }`;
          showTimePicker.value = 2;
          timeSelectWidth.value = "80px";
          yearValue.value =
            props.hourYear || new Date().getFullYear().toString();
          Year_Month.value =
            props.hourYear || new Date().getFullYear().toString();
        } else if (hourMatch) {
          select_time_value.value =
            locale.value === "chinese" ? "小时" : "Hour";
          time_value.value = locale.value === "chinese" ? "小时" : "Hour";
          timeScale.value = locale.value === "chinese" ? "小时" : "Hour";
          timeScale_line.value = `hr_${
            props.hourYear || new Date().getFullYear()
          }`;
          showTimePicker.value = 3;
          timeSelectWidth.value = "80px";
          yearValue.value =
            props.hourYear || new Date().getFullYear().toString();
          Year_Hour.value =
            props.hourYear || new Date().getFullYear().toString();
        }

        let tmpTime = "";
        let tmpMap = "";
        let tmpTimespan = [];

        if (specificYearMatch && !monthMatch && !hourMatch) {
          // 路径包含具体年份，只请求该年份的数据
          const specificYear = specificYearMatch[1];
          tmpTime = "yr";
          tmpMap = selectedMap.value;
          tmpTimespan = [specificYear]; // 只包含该具体年份
        } else if (yearMatch && !monthMatch && !hourMatch) {
          tmpTime = "yr";
          tmpMap = selectedMap.value;
          tmpTimespan = []; // 获取所有年份数据
        } else if (monthMatch) {
          tmpTime = `mo_${props.hourYear}`;
          tmpMap = selectedMap.value;
          tmpTimespan = [];
        } else if (hourMatch) {
          tmpTime = `hr_${props.hourYear}`;
          tmpMap = selectedMap.value;
          tmpTimespan = [];
        } else {
          // 默认情况，如果路径包含年份数字但没有明确的时间单位
          tmpTime = "yr";
          tmpMap = selectedMap.value;
          tmpTimespan = [];
        }

        const params = {
          map: tmpMap,
          timescale: tmpTime,
          timespan: tmpTimespan,
          level: "区域",
          places: [
            "东亚与太平洋地区",
            "中东与北非地区",
            "北美地区",
            "南亚地区",
            "拉丁美洲与加勒比地区",
            "撒哈拉以南非洲地区",
            "欧洲与中亚地区",
          ],
          language: locale.value,
        };

        const region_params = {
          map: processMapPath(tmpMap),
        };

        try {
          const region_res = await getRegions(region_params);
          if (region_res) {
            options.value = dynamic_region(region_res.regionsZn);
          }

          const res = await getLinedata(params);

          // 根据返回的数据设置时间选择器的默认值
          if (res && res.xAxisData && res.xAxisData.length > 0) {
            if (specificYearMatch && !monthMatch && !hourMatch) {
              // 路径包含具体年份，只设置该年份，确保图表只显示该年份数据
              const specificYear = specificYearMatch[1];
              selectedYear.value = [specificYear];
              timeSpan_year.value = [specificYear];
              timeSpan.value = [specificYear];

              // 过滤返回的数据，只保留该具体年份的数据
              if (res.xAxisData.includes(specificYear)) {
                const yearIndex = res.xAxisData.indexOf(specificYear);
                res.xAxisData = [specificYear];
                // 同时过滤SeriesData中对应的数据
                if (res.SeriesData && res.SeriesData.length > 0) {
                  res.SeriesData.forEach((series) => {
                    if (series.data && series.data.length > yearIndex) {
                      series.data = [series.data[yearIndex]];
                    }
                  });
                }
              }
            } else if (yearMatch && !monthMatch && !hourMatch) {
              // 路径只包含"年"字符，设置所有返回的年份数据
              selectedYear.value = res.xAxisData;
              timeSpan_year.value = res.xAxisData;
              timeSpan.value = res.xAxisData;
            } else if (monthMatch) {
              selectedMonth.value = res.xAxisData;
              timeSpan_month.value = res.xAxisData;
              timeSpan.value = res.xAxisData;
            } else if (hourMatch) {
              selectedHour.value = res.xAxisData;
              timeSpan_hour.value = res.xAxisData;
              timeSpan.value = res.xAxisData;
            } else {
              // 默认情况，当路径包含年份数字时，设置为年份数据
              selectedYear.value = res.xAxisData;
              timeSpan_year.value = res.xAxisData;
              timeSpan.value = res.xAxisData;
            }
          }

          const description_params = {
            map: tmpMap.split("/").slice(0, -1).join("/"),
            language: locale.value,
          };

          const description_res = await getDescription(description_params);
          if (description_res) {
            resData1.value = description_res;
          } else {
            resData1.value = null;
          }
          resData.value = [res];

          // 设置默认选中的区域（区域级别）
          selectedLevel.value = "区域";
          selectedPlaces.value = [
            "东亚与太平洋地区",
            "中东与北非地区",
            "北美地区",
            "南亚地区",
            "拉丁美洲与加勒比地区",
            "撒哈拉以南非洲地区",
            "欧洲与中亚地区",
          ];

          await getChartData();
          updateChart();
        } catch (regionError) {
          console.error("获取区域数据失败:", regionError);
          await getChartData();
          updateChart();
        }
      } else {
        resData1.value = null;
        // 路径为空时清空数据
        selectedValues.value = [];
        resData.value = [];
        selectedMap.value = "";
        await getChartData();
        updateChart();
      }
    } catch (error) {
      console.error("数据处理失败:", error);
      await getChartData();
      updateChart();
    }
  }
);

function getPureMapPath(mapPath) {
  // 去掉最后的 /年、/月、/小时 或 /4位数字（年份）
  return mapPath.replace(/(\/年|\/月|\/小时|\/[0-9]{4})$/, "");
}

// 递归查找area在options中的正确路径，根据返回的level确定层级
function getValidPath(area, options, targetLevel) {
  // 如果area是字符串，直接使用；如果是对象，根据targetLevel获取对应值
  let targetValue = "";
  if (typeof area === "string") {
    targetValue = area;
  } else if (typeof area === "object" && area !== null) {
    if (targetLevel === "区域" && area["区域"]) {
      targetValue = area["区域"];
    } else if (targetLevel === "次区域" && area["次区域"]) {
      targetValue = area["次区域"];
    } else if (targetLevel === "国家" && area["国家"]) {
      targetValue = area["国家"];
    } else if (targetLevel === "省级" && area["省级"]) {
      targetValue = area["省级"];
    } else if (targetLevel === "地级" && area["地级"]) {
      targetValue = area["地级"];
    } else if (targetLevel === "县级" && area["县级"]) {
      targetValue = area["县级"];
    }
  }

  if (!targetValue) {
    return [];
  }

  // 递归查找目标值的完整路径
  function findPath(opts, currentPath = []) {
    for (const opt of opts) {
      const newPath = [...currentPath, opt.value];

      // 如果找到目标值，返回路径
      if (opt.value === targetValue) {
        return newPath;
      }

      // 如果有children，递归查找
      if (opt.children && opt.children.length > 0) {
        const childPath = findPath(opt.children, newPath);
        if (childPath) return childPath;
      }
    }
    return null;
  }

  const path = findPath(options);

  // 如果没有找到路径，可能是因为需要包含父级路径
  // 对于"东亚"这种次区域，需要包含完整的层级路径
  if (!path) {
    // 特殊处理，需要找到包含该目标值的完整路径
    function findCompletePathForTarget(opts, currentPath = []) {
      for (const opt of opts) {
        const newPath = [...currentPath, opt.value];

        // 如果当前节点就是目标值，返回路径
        if (opt.value === targetValue) {
          return newPath;
        }

        if (opt.children && opt.children.length > 0) {
          // 检查直接子节点中是否有目标值
          for (const child of opt.children) {
            if (child.value === targetValue) {
              const fullPath = [...newPath, child.value];
              return fullPath;
            }
          }

          // 递归查找更深层的子节点
          const childPath = findCompletePathForTarget(opt.children, newPath);
          if (childPath) return childPath;
        }
      }
      return null;
    }

    const completePath = findCompletePathForTarget(options);
    const result = completePath ? [completePath] : [];
    return result;
  }

  const result = path ? [path] : [];
  return result;
}

const handleMapPointSelected = async ({ level, places, map, language, area }) => {
  // 自动高亮 - 使用places数组中的第一个值作为目标值
  const targetPlace = places && places.length > 0 ? places[0] : "";
  const validPath = getValidPath(targetPlace, options.value, level);
  selectedAreaValue.value = validPath;

  // 请求统计图接口
  const pureMap = getPureMapPath(map);

  // 根据地图路径确定时间尺度
  let timescale = "yr";
  let timespan = [];

  // 检查路径是否包含具体年份
  const specificYearMatch = map.match(/\b(20\d{2})\b/);

  if (specificYearMatch && !map.includes("月") && !map.includes("小时")) {
    // 路径包含具体年份，只请求该年份的数据
    timescale = "yr";
    timespan = [specificYearMatch[1]];
  } else if (map.includes("年")) {
    timescale = "yr";
    timespan = [];
  } else if (map.includes("月")) {
    timescale = `mo_${props.hourYear || new Date().getFullYear()}`;
    timespan = [];
  } else if (map.includes("小时")) {
    timescale = `hr_${props.hourYear || new Date().getFullYear()}`;
    timespan = [];
  }

  const params = {
    map: pureMap,
    timescale: timescale,
    timespan: timespan,
    level,
    places,
    language,
  };

  try {
    const res = await getLinedata(params);

    if (res && res.SeriesData && res.xAxisData) {
      // 更新组件数据
      resData.value = [res];

      // 自动设置时间尺度选择器
      if (res.xAxisData && res.xAxisData.length > 0) {
        const firstTimeData = res.xAxisData[0];
        // 根据返回的时间数据格式判断时间尺度
        const isChineseMode =
          language === "chinese" || locale.value === "chinese";

        // 检查地图路径是否包含具体年份
        const specificYearMatch = map.match(/\b(20\d{2})\b/);

        if (firstTimeData.length === 4) {
          // 年份格式如"2021"
          // 如果路径包含具体年份，只显示该年份
          if (
            specificYearMatch &&
            !map.includes("月") &&
            !map.includes("小时")
          ) {
            const specificYear = specificYearMatch[1];
            select_time_value.value = "";
            time_value.value = specificYear; // 直接显示具体年份，如"2021"
            timeScale.value = specificYear;
            timeScale_line.value = "yr";
            showTimePicker.value = 0; // 不显示时间选择器，直接显示年份
            selectedYear.value = [specificYear];
            timeSpan_year.value = [specificYear];
            timeSpan.value = [specificYear];
            timeSelectWidth.value = "160px";
          } else {
            // 多个年份数据，显示年份选择器
            select_time_value.value = isChineseMode ? "年" : "Year";
            time_value.value = isChineseMode ? "年" : "Year";
            timeScale.value = isChineseMode ? "年" : "Year";
            timeScale_line.value = "yr";
            showTimePicker.value = 1;
            selectedYear.value = res.xAxisData;
            timeSpan_year.value = res.xAxisData;
            timeSpan.value = res.xAxisData;
            timeSelectWidth.value = "80px";
          }
        } else if (firstTimeData.length === 6) {
          // 月份格式如"202101"
          select_time_value.value = isChineseMode ? "月" : "Month";
          time_value.value = isChineseMode ? "月" : "Month";
          timeScale.value = isChineseMode ? "月" : "Month";
          timeScale_line.value = `mo_${
            props.hourYear || new Date().getFullYear()
          }`;
          showTimePicker.value = 2;
          selectedMonth.value = res.xAxisData;
          timeSpan_month.value = res.xAxisData;
          timeSpan.value = res.xAxisData;
          yearValue.value =
            props.hourYear || new Date().getFullYear().toString();
          Year_Month.value =
            props.hourYear || new Date().getFullYear().toString();
          timeSelectWidth.value = "80px";
        } else if (firstTimeData.length >= 10) {
          // 小时格式如"2021-01-01 00:00:00"
          select_time_value.value = isChineseMode ? "小时" : "Hour";
          time_value.value = isChineseMode ? "小时" : "Hour";
          timeScale.value = isChineseMode ? "小时" : "Hour";
          timeScale_line.value = `hr_${
            props.hourYear || new Date().getFullYear()
          }`;
          showTimePicker.value = 3;
          selectedHour.value = res.xAxisData;
          timeSpan_hour.value = res.xAxisData;
          timeSpan.value = res.xAxisData;
          yearValue.value =
            props.hourYear || new Date().getFullYear().toString();
          Year_Hour.value =
            props.hourYear || new Date().getFullYear().toString();
          timeSelectWidth.value = "80px";
        }
      }

      // 设置选中的区域和层级
      selectedPlaces.value = places;
      selectedLevel.value = level;
      selectedMap.value = pureMap;

      // 更新lastValidSelection以便手动选择时的验证逻辑能正常工作
      lastValidSelection.value = [...validPath];

      // 更新图表数据并渲染
      await getChartData();
      updateChart();
    }
  } catch (e) {
    console.error("获取折线图数据失败", e);
    ElMessage.error(t("message.dataFetchError"));
  }

  // 表格
  const isChineseMode = language === "chinese" || locale.value === "chinese";

  // 根据实际的时间尺度设置表格参数，但timeScale始终使用中文
  let tableTimeScale = "年"; // 默认使用中文
  let tableYear = "";

  if (timescale.startsWith("mo_")) {
    tableTimeScale = "月"; // 始终使用中文
    tableYear = timescale.split("_")[1] || new Date().getFullYear().toString();
  } else if (timescale.startsWith("hr_")) {
    tableTimeScale = "小时"; // 始终使用中文
    tableYear = timescale.split("_")[1] || new Date().getFullYear().toString();
  }

  // level和timeScale参数始终使用中文，后端可能不支持英文值
  const tableParams = {
    map: pureMap,
    timescale: tableTimeScale,
    year: tableYear,
    level: level, // 保持原始的中文level值
    language,
  };
  bus.emit("tableParams", tableParams);
};
bus.on("mapPointSelected", handleMapPointSelected);

function dynamic_region(regions) {
  const arr = regions.split("/");
  const length = arr.length;
  if (locale.value === "chinese") {
    if (arr[0] === "电网") {
      const newOption = structuredClone(original_options2);
      return filterNodesByLevel(newOption, length);
    } else {
      const newOption = structuredClone(original_options);
      return filterNodesByLevel(newOption, length);
    }
  } else {
    if (arr[0] === "电网") {
      const newOption = structuredClone(original_options2_en);
      return filterNodesByLevel(newOption, length);
    } else {
      const newOption = structuredClone(original_options_en);
      return filterNodesByLevel(newOption, length);
    }
  }
}

function filterNodesByLevel(nodes, level) {
  return nodes.reduce((filtered, node) => {
    // 1. 过滤 > level 的节点
    if (node.level === level) {
      node.leaf = true;
    }
    if (node.level > level) {
      return filtered; // 跳过该节点
    }
    // 2. 深拷贝节点（避免修改原数据，可选但推荐）
    const newNode = { ...node };
    // 3. 递归处理子节点（若存在 children）
    if (newNode.children && Array.isArray(newNode.children)) {
      newNode.children = filterNodesByLevel(newNode.children, level);
    }
    // 4. 将处理后的节点加入结果数组
    filtered.push(newNode);
    return filtered;
  }, []);
}

let is_show = ref(false);

// 响应式数据
const resData = ref([]);

// 层级映射配置
const LEVEL_MAPPING = {
  1: "区域",
  2: "次区域",
  3: "国家",
  4: "省级",
  5: "县级",
  6: "县级",
};

// 中英文层级映射
const LEVEL_TRANSLATION = {
  区域: { chinese: "区域", english: "Region" },
  次区域: { chinese: "次区域", english: "Subregion" },
  国家: { chinese: "国家", english: "Country" },
  省级: { chinese: "省级", english: "Province" },
  地级: { chinese: "地级", english: "Prefecture" },
  县级: { chinese: "县级", english: "County" },
};

// 根据语言转换level值
function translateLevel(level, targetLanguage) {
  const translation = LEVEL_TRANSLATION[level];
  if (!translation) return level;

  return targetLanguage === "chinese"
    ? translation.chinese
    : translation.english;
}

const selectedAreaValue = ref([]);
let lastValidSelection = ref([]);

const handlerChange = async (values) => {
  // 获取所有路径的长度
  // 空选不处理
  if (!values.length) return;
  const pathLengths = values.map((arr) => arr.length);
  const firstLevel = pathLengths[0];
  const isSameLevel = pathLengths.every((length) => length === firstLevel);
  if (!isSameLevel) {
    ElMessage.error("请选择相同层级的区域！");
    // 强制取消勾选（清空 UI 中的勾选项）
    selectedAreaValue.value = [...lastValidSelection.value]; // 彻底还原
    return;
  }
  // 合法则记录新值
  lastValidSelection.value = [...values];
  selectedPlaces.value = values.map((item) => item[item.length - 1]);
  // 获取所有子数组的 length，再取最大值
  const maxLength = Math.max(...values.map((arr) => arr.length));
  selectedLevel.value = LEVEL_MAPPING[maxLength] || "未知层级";
  await getChartData();
  updateChart();
};

const getChartData = () => {
  chartData.value = {
    SeriesData: [],
    xAxis: resData.value[0]?.xAxisData || [],
    min_y_value: 0,
    max_y_value: 0.5,
  };
  // 确定图表类型
  if (chartData.value.xAxis.length === 1) {
    chartType.value = "bar";
  } else {
    chartType.value = "line";
  }
  // 遍历resData中的每个元素
  resData.value.forEach((element) => {
    // 检查element和SeriesData是否存在
    if (element && element.SeriesData) {
      // 遍历每个SeriesData项
      element.SeriesData.forEach((dataItem) => {
        // 确保dataItem有必要的属性
        if (dataItem.name && dataItem.data) {
          chartData.value.SeriesData.push({
            name:
              locale.value === "chinese" ? dataItem.name[0] : dataItem.name[1], // 如果name是数组则取第一个元素
            data: dataItem.data,
            type: chartType.value,
            smooth: true,
          });

          const maxvalue = Math.max(...dataItem.data);
          const minvalue = Math.min(...dataItem.data);
          chartData.value.max_y_value = Math.max(
            maxvalue,
            chartData.value.max_y_value
          );
          chartData.value.min_y_value = Math.min(
            minvalue,
            chartData.value.min_y_value
          );
        } else {
          console.warn("无效的SeriesData项:", dataItem);
        }
      });

      // 如果需要，也可以处理xAxisData
      if (element.xAxisData) {
        chartData.value.xAxisData = element.xAxisData;
      }
    } else {
      console.warn("无效的resData元素:", element);
    }
  });
};

let mychart = null;

// 初始化echarts
const initChart = async () => {
  if (chartRef.value) {
    mychart = echarts.init(chartRef.value);
    window.addEventListener("resize", resizeChart);
  }
};

const updateChart = () => {
  if (!mychart) {
    initChart();
    return;
  }

  mychart.clear();
  // 准备x轴数据（假设所有系列共享相同的x轴）
  const xAxisData = chartData.value.xAxis;

  // 确定图表类型
  if (xAxisData.length === 1) {
    chartType.value = "bar";
  } else {
    chartType.value = "line";
  }

  // 转换series数据
  const series = chartData.value.SeriesData.map((dataItem, index) => ({
    name: dataItem.name, // 可以根据你的数据结构调整名称
    type: chartType.value,
    data: dataItem.data,
    smooth: true,
    symbol: "circle",
    symbolSize: 6,
    itemStyle: {
      color: getColorByIndex(index), // 自定义颜色函数
    },
    lineStyle: {
      width: 2,
    },
    emphasis: {
      focus: "series",
    },
  }));

  const option = {
    title: {
      text: selectedMap.value
        ? `${props.dataTypeThree} ${
            props.dataUnit !== ""
              ? `${
                  dataUnitMap[props.dataUnit] === undefined
                    ? ""
                    : `(${dataUnitMap[props.dataUnit]})`
                }`
              : ""
          }`
        : "",
      left: "center",
      textStyle: {
        color: "#333",
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    grid: {
      left: "3%",
      top: "15%", // 为图例留出空间
      right: "5%",
      bottom: "6%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xAxisData,
      name: time_value.value || t("chart.year"), // 添加横轴名称，默认为"年"
      nameLocation: "middle", // 名称位置在轴的末端
      nameTextStyle: {
        color: "#333",
        padding: [10, 0, 0, 0], // 调整文字位置
      },
      axisLine: {
        lineStyle: {
          color: "#999",
        },
      },
      axisLabel: {
        color: "#000",
      },
    },
    yAxis: {
      nameTextStyle: {
        color: "#000",
      },
      type: "value",
      min: chartData.value.min_y_value,
      max: chartData.value.max_y_value,
      axisLine: {
        show: true,
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
        },
      },
      axisLabel: {
        color: "#000",
        formatter: function (value) {
          // 使用科学计数法格式化数值
          return value.toExponential(2);
        },
      },
    },
    series: series,
  };

  mychart.setOption(option);
};

// 辅助函数：根据索引返回不同颜色
const getColorByIndex = (index) => {
  const colors = [
    "#5470C6",
    "#91CC75",
    "#EE6666",
    "#FAC858",
    "#73C0DE",
    "#3BA272",
    "#FC8452",
    "#9A60B4",
  ];
  return colors[index % colors.length];
};

// 处理节点点击事件
const handleNodeClick = (node, data) => {
  // 可以根据需要添加节点点击逻辑
};

const resizeChart = () => mychart?.resize();
onActivated(() => {window.addEventListener("resize", resizeChart);nextTick(resizeChart);});
onDeactivated(() => window.removeEventListener("resize", resizeChart));
onBeforeUnmount(() => {window.removeEventListener("resize", resizeChart);bus.off("clearSelected", handleClearSelected);bus.off("mapPointSelected", handleMapPointSelected);mychart?.dispose();mychart=null;});
</script>

<style lang="scss" scoped>
.chart_box {
  z-index: 10;
  position: absolute;
  top: 10px;
  right: 30px;
  width: 540px;
  height: 770px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(3px);
  box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.8);

  .param_box {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 50px;
    margin: 10px 1px 10px;
    // 设置时间选择器的背景色
    :deep(.el-input__wrapper),
    :deep(.el-select__wrapper) {
      background-color: rgba(255, 255, 255, 0.4) !important;
      color: black !important;
    }
    // 修改el-select的输入框中显示已经选择的option name的字体颜色
    :deep(.el-select__placeholder) {
      color: black !important;
    }
    :deep(.el-input__inner::placeholder) {
      color: black !important;
    }
    .year .month .hour {
      width: 50px;
      height: 30px;
      text-align: center;
      line-height: 30px;
    }
    .hour {
      margin-right: 30px;
    }
    .temporal_resolution {
      :deep(.el-input__inner) {
        color: black; /* 修改为你需要的颜色 */
        --el-input-placeholder-color: black;
      }
      display: inline-block;
      .hourPicker {
        display: inline-block;
        justify-content: space-between;
        :deep(.el-date-editor) {
          .el-range-input {
            color: black; // 修改输入框文本颜色
            &::placeholder {
              color: black; // 修改占位符文本颜色
            }
          }
          .el-range-separator {
            color: black; // 修改分隔符颜色
          }
        }
      }
    }
    /* 1. 禁用整个节点的默认点击事件 */
    .region-cascader .el-cascader-node {
      pointer-events: none;
    }
    /* 2. 仅允许复选框和箭头区域交互 */
    .region-cascader .el-cascader-node__prefix,
    .region-cascader .el-cascader-node__postfix {
      pointer-events: none;
      cursor: pointer;
    }
  }

  .echart_box {
    height: 308px;
    width: 504px;
    margin-top: 10px;

    .chart {
      height: 308px;
      width: 452px;
      margin: 0px auto;
      border: 1px solid rgb(85, 82, 82, 0.2);
    }
  }
}

.specific-time-display {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 12px;
  background-color: rgba(255, 255, 255, 0.4);
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #333;
  font-size: 14px;
  min-width: 80px;
}

.tool-box-container {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>

<style scoped>
.icon-title {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 5px 10px;
  background: #ffffff;
  border-bottom: 1px solid #ffffff;
  z-index: 1;

  height: 40px; /* 固定高度 */
  box-sizing: border-box; /* 确保padding包含在高度内 */
}
.node-wrapper {
  display: flex;
  align-items: center;
}
.node-text {
  margin-left: 5px;
}
.blank-area {
  flex: 1;
}
.arrow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: yellow; /* 设置高亮背景颜色，可按需修改 */
}
.arrow {
  color: red;
  transition: color 0.3s ease;
}
</style>
