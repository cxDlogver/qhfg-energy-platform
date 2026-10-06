<template>
  <div class="condition_box gray-text" ref="conditionDom">
    <div class="condition_box_top">
      <div class="condition_box_top_left">
        <i class="iconfont icon-data-screen"></i>
        <span>{{ $t("message.conditions") }}</span>
      </div>
      <div class="submit_edit_btn">
        <el-button type="primary" @click="showEdit" size="small" v-show="false">
          {{ $t("message.edit") }}</el-button
        >
      </div>
    </div>
    <div class="condition_box_body">
      <div class="tree_container gray-text">
        <div class="tree_row">
          <div
            class="resourceTree"
            :class="{ 'has-datatype': layerListTypeData.length > 0 }"
          >
            <el-tree
              :data="layerListResourceData"
              check-strictly
              node-key="id"
              :props="defaultProps"
              :empty-text="$t('message.noData')"
              accordion
              highlight-current
              ref="treeRef"
              default-expand-all
            >
              <template #default="{ data }">
                <span class="custom-tree-node">
                  <el-checkbox
                    v-if="data.children && data.children.length === 0"
                    v-model="selectedResourceId"
                    :true-value="data.id"
                    :false-value="null"
                    @change="handleResourceCheckChange(data, $event)"
                  />
                  <!-- 编辑框展示 -->
                  <span v-if="!editNodeIdMap[data.id]">{{
                    locale === "chinese" ? data.name : data.nameEn
                  }}</span>
                  <el-input
                    v-else
                    v-model="editNodeInputValue[data.id]"
                    size="small"
                    @blur="confirmEditNode(data.id)"
                    @keyup.enter="confirmEditNode(data.id)"
                  />
                </span>
                <span class="operationTree" v-show="showEditFlag">
                  <el-button
                    type="primary"
                    :icon="CirclePlus"
                    circle
                    size="small"
                    @click="() => startAddNode(data.id, data.type)"
                  />
                  <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    size="small"
                    @click="() => deleteNode(data.id)"
                  />
                  <el-button
                    type="primary"
                    :icon="Edit"
                    circle
                    size="small"
                    @click="() => startEditNode(data.id, data.name)"
                  />
                </span>
              </template>
            </el-tree>
          </div>
          <div
            class="dataTypeTree_border"
            v-show="layerListTypeData.length > 0"
          >
            <div class="dataTypeTree">
              <el-tree
                :data="layerListTypeData"
                check-strictly
                node-key="id"
                :props="defaultProps"
                :empty-text="$t('message.noData')"
                accordion
                highlight-current
                ref="treeRef"
                default-expand-all
              >
                <template #default="{ data }">
                  <span class="custom-tree-node">
                    <el-checkbox
                      v-if="data.children && data.children.length === 0"
                      v-model="selectedDataTypeId"
                      :true-value="data.id"
                      :false-value="null"
                      @change="handleDataTypeCheckChange(data, $event)"
                    />
                    <!-- 编辑框展示 -->
                    <span v-if="!editNodeIdMap[data.id]">{{
                      locale === "chinese" ? data.name : data.nameEn
                    }}</span>
                    <el-input
                      v-else
                      v-model="editNodeInputValue[data.id]"
                      size="small"
                      @blur="confirmEditNode(data.id)"
                      @keyup.enter="confirmEditNode(data.id)"
                    />
                  </span>
                  <span class="operationTree" v-show="showEditFlag">
                    <el-button
                      type="primary"
                      :icon="CirclePlus"
                      circle
                      size="small"
                      @click="() => startAddNode(data.id, data.type)"
                    />
                    <el-button
                      type="danger"
                      :icon="Delete"
                      circle
                      size="small"
                      @click="() => deleteNode(data.id)"
                    />
                    <el-button
                      type="primary"
                      :icon="Edit"
                      circle
                      size="small"
                      @click="() => startEditNode(data.id, data.name)"
                    />
                  </span>
                </template>
              </el-tree>
            </div>
          </div>
        </div>
        <div
          class="tree_row child_time_row"
          v-show="layerListChildData.length > 0"
        >
          <div class="childTree">
            <div v-if="showChildTitle === 2" class="childtree_title">
              <div>
                <i class="iconfont icon-diqiu" style="color: #525960"></i>
              </div>
              <div>{{ $t("conditionBox.area") }}</div>
            </div>
            <div v-if="showChildTitle === 1" class="childtree_title">
              <i class="iconfont icon-shijian" style="color: #525960"></i
              >{{ $t("conditionBox.time") }}
            </div>
            <el-tree
              :data="layerListChildData"
              check-strictly
              node-key="id"
              :props="defaultProps"
              :empty-text="$t('message.noData')"
              accordion
              highlight-current
              ref="treeRef"
              default-expand-all
            >
              <template #default="{ data }">
                <span class="custom-tree-node">
                  <i
                    v-if="data.parentId === 1"
                    class="iconfont icon-wenjianjia"
                  ></i>
                  <el-checkbox
                    v-if="data.children && data.children.length === 0"
                    v-model="selectedChildId"
                    :true-value="data.id"
                    :false-value="null"
                    @change="handleChildCheckChange(data, $event)"
                  />
                  <!-- 编辑框展示 -->
                  <span v-if="!editNodeIdMap[data.id]">{{
                    locale === "chinese" ? data.name : data.nameEn
                  }}</span>
                  <el-input
                    v-else
                    v-model="editNodeInputValue[data.id]"
                    size="small"
                    @blur="confirmEditNode(data.id)"
                    @keyup.enter="confirmEditNode(data.id)"
                  />
                </span>
                <span class="operationTree" v-show="showEditFlag">
                  <el-button
                    type="primary"
                    :icon="CirclePlus"
                    circle
                    size="small"
                    @click="() => startAddNode(data.id, data.type)"
                  />
                  <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    size="small"
                    @click="() => deleteNode(data.id)"
                  />
                  <el-button
                    type="primary"
                    :icon="Edit"
                    circle
                    size="small"
                    @click="() => startEditNode(data.id, data.name)"
                  />
                </span>
              </template>
            </el-tree>
          </div>

          <div class="TimeTree" v-show="layerListTimeData.length > 0">
            <i></i>
            <div class="childtree_title">
              <i class="iconfont icon-shijian" style="color: #525960"></i
              >{{ $t("conditionBox.time") }}
            </div>
            <el-tree
              :data="layerListTimeData"
              check-strictly
              node-key="id"
              :props="defaultProps"
              :empty-text="$t('message.noData')"
              accordion
              highlight-current
              ref="treeRef"
              default-expand-all
            >
              <template #default="{ data }">
                <span class="custom-tree-node">
                  <el-checkbox
                    v-if="data.children && data.children.length === 0"
                    v-model="selectedTimeId"
                    :true-value="data.id"
                    :false-value="null"
                    @change="handleTimeCheckChange(data, $event)"
                  />
                  <!-- 编辑框展示 -->
                  <span v-if="!editNodeIdMap[data.id]">{{
                    locale === "chinese" ? data.name : data.nameEn
                  }}</span>
                  <el-input
                    v-else
                    v-model="editNodeInputValue[data.id]"
                    size="small"
                    @blur="confirmEditNode(data.id)"
                    @keyup.enter="confirmEditNode(data.id)"
                  />
                </span>
                <span class="operationTree" v-show="showEditFlag">
                  <el-button
                    type="primary"
                    :icon="CirclePlus"
                    circle
                    size="small"
                    @click="() => startAddNode(data.id, data.type)"
                  />
                  <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    size="small"
                    @click="() => deleteNode(data.id)"
                  />
                  <el-button
                    type="primary"
                    :icon="Edit"
                    circle
                    size="small"
                    @click="() => startEditNode(data.id, data.name)"
                  />
                </span>
              </template>
            </el-tree>
          </div>
        </div>
      </div>
      <el-dialog
        :title="$t('conditionBox.addNode')"
        v-model="addNodeDialogVisible"
        width="300px"
        @close="cancelAddNode"
        class="add-node-dialog"
      >
        <el-form ref="addNodeFormRef" :model="addNodeForm" label-width="100px">
          <!-- 节点名称 -->
          <el-form-item :label="$t('conditionBox.nodeName')">
            <el-input
              v-model="addNodeForm.name"
              :placeholder="$t('conditionBox.nodeNamePlaceholder')"
            />
          </el-form-item>
          <el-form-item :label="$t('conditionBox.nodeNameEn')">
            <el-input
              v-model="addNodeForm.nameEn"
              :placeholder="$t('conditionBox.nodeNameEnPlaceholder')"
            />
          </el-form-item>

          <!-- 节点类型 -->
          <el-form-item :label="$t('conditionBox.nodeType')">
            <el-select
              v-model="addNodeForm.type"
              :placeholder="$t('conditionBox.nodeTypePlaceholder')"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="locale === 'chinese' ? item.label : item.labelEn"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="cancelAddNode">{{
            $t("conditionBox.cancel")
          }}</el-button>
          <el-button type="primary" @click="confirmAddNode">{{
            $t("conditionBox.confirm")
          }}</el-button>
        </template>
      </el-dialog>
    </div>
    <div class="temporal_resolution">
      <div class="yearPicker" v-show="showTimePicker === 1">
        <el-date-picker
          type="years"
          v-model="selectedYear"
          :placeholder="$t('conditionBox.yearPlaceholder')"
          format="YYYY"
          value-format="YYYY"
          :disabled-date="disabledDate"
          @change="handleYearChange"
        >
        </el-date-picker>
      </div>
      <div class="monthPicker" v-show="showTimePicker === 2">
        <el-date-picker
          type="months"
          v-model="selectedMonth"
          :placeholder="$t('conditionBox.monthPlaceholder')"
          format="YYYY-MM"
          value-format="YYYY-MM"
          :disabled-date="disabledDate"
          @change="handleMonthChange"
        >
        </el-date-picker>
      </div>
      <div class="hourPicker" v-show="showTimePicker === 3">
        <el-date-picker
          type="datetimerange"
          v-model="selectedHour"
          :start-placeholder="$t('conditionBox.startHourPlaceholder')"
          :end-placeholder="$t('conditionBox.endHourPlaceholder')"
          format="YYYY-MM-DD HH"
          value-format="YYYYMMDDHH"
          :disabled-date="disabledHourDate"
          @change="handleHourChange"
        >
        </el-date-picker>
      </div>
      <div class="submit_confirm_btn" v-show="showTimePicker">
        <el-button type="primary" @click="sendConfirm">{{
          $t("message.confirm")
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, defineExpose, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getlayerListResourceData,
  getLayerListTypeData,
  getlayerListChildData,
  editlayerListData,
  addlayerListData,
  deletelayerListData,
} from "@/request";
import { Delete, Edit, Search, CirclePlus } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
// 添加 watch 监听语言变化
watch(locale, (newLocale) => {
  // 重新获取所有数据
  fetchResourceData();
  // 如果当前有选中的资源，重新获取其相关数据
  if (selectedResourceId.value) {
    fetchTypeData(selectedResourceId.value);
  }
  // 如果当前有选中的数据类型，重新获取其相关数据
  if (selectedDataTypeId.value) {
    fetchChildData(selectedDataTypeId.value);
  }
  // 如果当前有选中的子节点，且需要获取时间数据
  if (selectedChildId.value && layerListTimeData.length > 0) {
    fetchTimeData(selectedChildId.value);
  }
});
const conditionDom = ref(null);

// 关键：暴露 DOM 给父组件
defineExpose({
  conditionDom,
});

onMounted(() => {
  fetchResourceData();
});

let defaultProps = reactive({
  children: "children",
  label: "name",
});
//树形结构内容-----获取资源类型数据
let layerListResourceData = reactive([]);
const treeRef = ref(null);
async function fetchResourceData() {
  try {
    const language = localStorage.getItem("language");
    const response = await getlayerListResourceData(language);
    // const response = await getlayerListResourceData(locale.value);
    const children = response.data?.children ?? [];
    layerListResourceData.splice(0, layerListResourceData.length, ...children);
  } catch (err) {
    if (err.code === "ECONNABORTED") {
      console.error("请求超时！", err.message);
    } else {
      console.error("其他错误：", err.message);
    }
  }
}

//树形结构内容-----获取数据类型数据
let layerListTypeData = reactive([]);
async function fetchTypeData(dataId) {
  // const language = localStorage.getItem("language");
  const data = await getLayerListTypeData(dataId, locale.value);
  layerListTypeData.length = 0; // 清空数组
  layerListTypeData.push(...data); // 更新数据
}

//树形结构内容-----获取子节点数据
let layerListChildData = reactive([]);
async function fetchChildData(dataId) {
  try {
    // const language = localStorage.getItem("language");
    const response = await getlayerListChildData(dataId, locale.value);
    const children = response.data?.children ?? [];
    layerListChildData.splice(0, layerListChildData.length, ...children);
  } catch (error) {
    console.error("获取子节点数据失败:", error);
  } finally {
    if (
      layerListChildData.length > 0 &&
      layerListChildData[0].type == "space"
    ) {
      showChildTitle.value = 2;
    } else {
      showChildTitle.value = 1;
    }
  }
}

//树形结构内容-----获取时间分辨率数据
let layerListTimeData = reactive([]);
async function fetchTimeData(dataId) {
  try {
    // const language = localStorage.getItem("language");
    const response = await getlayerListChildData(dataId, locale.value);
    const children = response.data?.children ?? [];
    // 只在有变化时更新
    layerListTimeData.splice(0, layerListTimeData.length, ...children);
  } catch (error) {
    console.error("Failed to fetch time data:", error);
  }
}

// 选择资源类型
const handleResourceCheckChange = (data, checked) => {
  if (checked) {
    // 清空其他选择
    selectedDataTypeId.value = null;
    selectedChildId.value = null;
    selectedTimeId.value = null;
    // 清空时间选择器的值
    selectedYear.value = [];
    selectedMonth.value = [];
    selectedHour.value = [];
    fetchTypeData(data.id);
  } else {
    layerListTypeData.splice(0, layerListTypeData.length);
  }
  layerListChildData.splice(0, layerListChildData.length);
  layerListTimeData.splice(0, layerListTimeData.length);
  showTimePicker.value = 0;
};
const showChildTitle = ref(0);
//选择数据类型
const handleDataTypeCheckChange = (data, checked) => {
  if (checked) {
    // 清空后续选择
    selectedChildId.value = null;
    selectedTimeId.value = null;
    fetchChildData(data.id);
  } else {
    layerListChildData.splice(0, layerListChildData.length);
  }
  layerListTimeData.splice(0, layerListTimeData.length);
  showTimePicker.value = 0;
};

//选择孩子1类型
const handleChildCheckChange = (data, checked) => {
  if (checked) {
    selectedTimeId.value = null;
    if (
      data.name == t("conditionBox.year") ||
      (data.nameEn &&
        data.nameEn.toLowerCase() === t("conditionBox.year").toLowerCase())
    ) {
      // if (data.name == "年") {
      showTimePicker.value = 1;
    } else if (
      data.name == t("conditionBox.month") ||
      (data.nameEn &&
        data.nameEn.toLowerCase() === t("conditionBox.month").toLowerCase())
    ) {
      showTimePicker.value = 2;
    } else if (
      data.name == t("conditionBox.hour") ||
      (data.nameEn &&
        data.nameEn.toLowerCase() === t("conditionBox.hour").toLowerCase())
    ) {
      showTimePicker.value = 3;
    } else if (
      data.name == t("conditionBox.annualAverage") ||
      (data.nameEn &&
        data.nameEn.toLowerCase() ===
          t("conditionBox.annualAverage").toLowerCase())
    ) {
      showTimePicker.value = 4;
      //设置多年平均
      timeResult.value = locale.value === "chinese" ? data.name : data.nameEn;
    } else {
      fetchTimeData(data.id);
    }
  } else {
    layerListTimeData.splice(0, layerListTimeData.length);
    showTimePicker.value = 0;
  }
};

//选择孩子2类型
const handleTimeCheckChange = (data, checked) => {
  if (checked) {
    if (
      data.name == t("conditionBox.year") ||
      (data.nameEn &&
        data.nameEn.toLowerCase() === t("conditionBox.year").toLowerCase())
    ) {
      showTimePicker.value = 1;
    } else if (
      data.name == t("conditionBox.month") ||
      (data.nameEn &&
        data.nameEn.toLowerCase() === t("conditionBox.month").toLowerCase())
    ) {
      showTimePicker.value = 2;
    } else if (
      data.name == t("conditionBox.hour") ||
      (data.nameEn &&
        data.nameEn.toLowerCase() === t("conditionBox.hour").toLowerCase())
    ) {
      showTimePicker.value = 3;
    } else if (data.name === t("conditionBox.annualAverage") || data.nameEn?.toLowerCase() === t("conditionBox.annualAverage").toLowerCase()) {
      showTimePicker.value = 4;
      timeResult.value = locale.value === "chinese" ? data.name : data.nameEn;
    }
  } else {
    showTimePicker.value = 0;
  }
};
const editNodeIdMap = reactive({});
const editNodeInputValue = reactive({});
const selectedResourceId = ref(null);
const selectedDataTypeId = ref(null);
const selectedChildId = ref(null);
const selectedTimeId = ref(null);

//控制条件框的编辑显示隐藏
let showEditFlag = ref(false);
const showEdit = () => {
  showEditFlag.value = showEditFlag.value ? false : true;
};

//条件框的增加
// 用于添加节点的弹窗状态
const addNodeDialogVisible = ref(false);
const addNodeForm = reactive({
  name: "", // 节点名称
  nameEn: "", // 节点英文名称
  parentId: null, // 父节点 ID
  type: "", // 节点类型
});
// 类型下拉框选项
const typeOptions = ref([
  {
    label: "资源类型",
    labelEn: "Resource Type",
    value: "resource",
  },
  {
    label: "数据类型",
    labelEn: "Data Type",
    value: "datatype",
  },
  {
    label: "空间分辨率",
    labelEn: "Spatial Resolution",
    value: "space",
  },
  {
    label: "时间分辨率",
    labelEn: "Temporal Resolution",
    value: "time",
  },
]);
const addNodeFormRef = ref(null);

// 开始添加节点
const startAddNode = (parentId) => {
  addNodeForm.parentId = parentId;
  addNodeForm.type = "";
  addNodeForm.name = ""; // 清空之前的输入值
  addNodeForm.nameEn = ""; // 清空之前的输入值
  addNodeDialogVisible.value = true;
};

// 确认添加节点
const confirmAddNode = async () => {
  if (!addNodeForm.name.trim()) {
    ElMessage.error(t("conditionBox.error.nodeNameEmpty"));
    return;
  }
  if (!addNodeForm.nameEn.trim()) {
    ElMessage.error(t("conditionBox.error.nodeNameEnEmpty"));
    return;
  }
  // 如果未选择类型，设置默认值为 "node"
  const typeToSend = addNodeForm.type || "node";
  try {
    await addlayerListData(
      addNodeForm.name,
      addNodeForm.nameEn,
      addNodeForm.parentId,
      typeToSend
    );
    await fetchResourceData();
    ElMessage.success(t("conditionBox.addSuccess"));
  } catch (error) {
    ElMessage.error(t("conditionBox.addFail"));
  } finally {
    addNodeDialogVisible.value = false; // 关闭弹窗
  }
};

// 取消添加节点
const cancelAddNode = () => {
  addNodeDialogVisible.value = false;
};

//条件框的删除
const deleteNode = async (id) => {
  try {
    // 弹出确认对话框
    await ElMessageBox.confirm(
      t("conditionBox.deleteConfirm"),
      t("conditionBox.warning"),
      {
        confirmButtonText: t("conditionBox.confirm"),
        cancelButtonText: t("conditionBox.cancel"),
        type: "warning",
      }
    );
    // 如果用户点击"确定"，继续执行删除逻辑
    await deletelayerListData(id);
    await fetchResourceData();
    ElMessage.success(t("conditionBox.deleteSuccess"));
  } catch (error) {
    // 如果用户点击"取消"或删除操作失败，捕获错误
    if (error !== "cancel") {
      ElMessage.error(t("conditionBox.deleteFail"));
    }
  }
};

//条件框的编辑
// 开始编辑节点
const startEditNode = (id, currentValue) => {
  editNodeInputValue[id] = currentValue; // 初始化编辑框的值为当前节点的值
  editNodeIdMap[id] = true; // 将当前节点设置为编辑状态
};
// 确认编辑节点
const confirmEditNode = async (id) => {
  const newValue = editNodeInputValue[id]?.trim();
  if (!newValue) {
    ElMessage.error(t("conditionBox.nodeEmpty"));
    return;
  }
  try {
    await editlayerListData(id, newValue);
    ElMessage.success(t("conditionBox.editSuccess"));
    fetchResourceData();
  } catch (error) {
    ElMessage.error(t("conditionBox.editFail"));
  } finally {
    editNodeIdMap[id] = false; // 退出编辑状态
  }
};

//时间选择器的时间范围
function disabledDate(time) {
  return time.getTime() > Date.now();
}
function disabledHourDate(time) {
  if (selectedHour.value && selectedHour.value[0]) {
    const firstDate = new Date(selectedHour.value[0].slice(0, 8));
    const currentDate = new Date(
      time.getFullYear(),
      time.getMonth(),
      time.getDate()
    );
    // 如果已经选择了第一个日期，则只允许选择同一天
    return firstDate.getTime() !== currentDate.getTime();
  }
  return false;
}

//叶子节点的路径列表
const pathListResource = ref("");
const pathListDataType = ref("");
const pathListChild = ref("");
const pathListTime = ref("");
//获取路径
const getPathByKey = (curKey, layerListData) => {
  let result = []; // 记录路径结果
  let traverse = (curKey, path, layerListData) => {
    if (layerListData.length === 0) {
      return;
    }
    for (let item of layerListData) {
      path.push(item);
      if (item.id === curKey) {
        result = JSON.parse(JSON.stringify(path));
        return;
      }
      const children = Array.isArray(item.children) ? item.children : [];
      traverse(curKey, path, children); // 遍历
      path.pop(); // 回溯
    }
  };
  traverse(curKey, [], layerListData);
  return result;
};

// 根据 parentId 查找父节点的 children
const findParentNodeById = (layerListData, parentId) => {
  for (let i = 0; i < layerListData.length; i++) {
    const node = layerListData[i];
    if (node.id === parentId) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findParentNodeById(node.children, parentId);
      if (found) return found; // 在子树中查找
    }
  }
  return null;
};

//传递给index的路径
const pathUrl = ref("");
const pathUrlList = ref([]);
const tempTimeFlag = ref("");
let filterResultList = ref([]);
let dataTypeThree = ref("");
let dataTypeThreeList = ref([]);

let timeResult = ref([]);
let selectedYear = ref([]);
let selectedMonth = ref([]);
let selectedHour = ref([]);
let showTimePicker = ref(0);

// 添加新的响应式数组来管理复选框状态
const selectedResults = ref([]);

const clearTimeData = () => {
  selectedYear.value = null;
  selectedMonth.value = null;
  selectedHour.value = null;
  timeResult.value = null;
  dataUnitList.value = [];
  dataTypeThree.value = "";
  dataTypeThreeList.value = [];
  filterResultList.value = [];
  selectedResults.value = [];
  pathUrlList.value = [];
  emitResultList.value = [];
};

//timeResult的值
const handleYearChange = (value) => {
  timeResult.value = value;
};
const handleMonthChange = (value) => {
  timeResult.value = value;
};
const handleHourChange = (value) => {
  if (!value || !value[0] || !value[1]) {
    timeResult.value = [];
    return;
  }
  const startTime = value[0];
  const endTime = value[1];
  const result = [];
  // 将时间字符串转换为Date对象
  const startDate = new Date(
    startTime.substring(0, 4), // 年
    parseInt(startTime.substring(4, 6)) - 1, // 月（需要-1因为JS月份从0开始）
    startTime.substring(6, 8), // 日
    startTime.substring(8, 10) // 小时
  );
  const endDate = new Date(
    endTime.substring(0, 4),
    parseInt(endTime.substring(4, 6)) - 1,
    endTime.substring(6, 8),
    endTime.substring(8, 10)
  );

  // 循环生成每个小时的时间
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hour = String(currentDate.getHours()).padStart(2, "0");

    result.push(`${year}-${month}-${day} ${hour}:00`);

    // 增加一个小时
    currentDate.setHours(currentDate.getHours() + 1);
  }

  timeResult.value = result;
};
//数据的单位：例如容量因子单位无量纲
const dataUnitList = ref([]);

const mapUnitMap = {
  容量因子: "",
  发电潜力: "GWh/km<sup>2</sup>",
  装机潜力: "MW/km<sup>2</sup>",
  平准化度电成本: "",
  装机量: "GW",
  发电量: "GWh",
  电厂区位: "Sites",
  全社会用电量: "TWh",
  人均社会用电量: "",
  电网: "",
  总电量消耗: "",
};
// 用于传递给父组件的响应式数组
const emitResultList = ref([]);
const emit = defineEmits(["updateEmitResultList"]);
//点击确认按钮
const sendConfirm = () => {
  if (timeResult.value === null || timeResult.value.length === 0) {
    ElMessage({
      message: "请输入时间分辨率",
      type: "error",
    });
  } else {
    pathListResource.value = getPathByKey(
      selectedResourceId.value,
      layerListResourceData
    );
    pathListDataType.value = getPathByKey(
      selectedDataTypeId.value,
      layerListTypeData
    );
    let dataUnit =
      mapUnitMap[
        pathListDataType.value[pathListDataType.value.length - 1].name
      ] || "";

    dataTypeThree.value =
      locale.value === "chinese"
        ? pathListDataType.value[pathListDataType.value.length - 1].name
        : pathListDataType.value[pathListDataType.value.length - 1].nameEn;

    pathListChild.value = getPathByKey(
      selectedChildId.value,
      layerListChildData
    );
    pathListTime.value = getPathByKey(selectedTimeId.value, layerListTimeData);
    pathUrl.value =
      pathListResource.value.map((item) => item.name).join("/") +
      "/" +
      pathListDataType.value.map((item) => item.name).join("/") +
      "/" +
      pathListChild.value.map((item) => item.name).join("/") +
      "/" +
      pathListTime.value.map((item) => item.name).join("/");
    if (pathUrl.value.slice(-1) === "/")
      pathUrl.value = pathUrl.value.slice(0, -1);
    pathUrlList.value = [];

    if (timeResult.value !== t("conditionBox.annualAverage")) {
      for (let i = 0; i < timeResult.value.length; i++) {
        pathUrlList.value.push(pathUrl.value);
      }
    } else {
      pathUrlList.value.push(pathUrl.value);
    }
    // 结果列表显示内容

    if (timeResult.value == t("conditionBox.annualAverage")) {
      let tempAverageResult = `${pathListResource.value
        .slice(-1)
        .map((item) => (locale.value === "chinese" ? item.name : item.nameEn))
        .join("")}${pathListDataType.value
        .slice(1)
        .map((item) => (locale.value === "chinese" ? item.name : item.nameEn))
        .join("")}${dataUnit ? `(${dataUnit})` : ""}(${timeResult.value})`;
      filterResultList.value.push(tempAverageResult);
    } else {
      filterResultList.value = timeResult.value.map((time) => {
        if (time.length === 4) {
          tempTimeFlag.value = "年";
        }
        let Unit = dataUnit ? `(${dataUnit})` : "";
        let tempFilterResult = `${
          pathListResource.value[pathListResource.value.length - 1][
            locale.value === "chinese" ? "name" : "nameEn"
          ]
        } ${
          pathListDataType.value[pathListDataType.value.length - 1][
            locale.value === "chinese" ? "name" : "nameEn"
          ]
        }${Unit}(${
          pathListDataType.value.length < 3
            ? ""
            : pathListDataType.value[1][
                locale.value === "chinese" ? "name" : "nameEn"
              ] +
              "," +
              pathListChild.value
                .map((item) =>
                  locale.value === "chinese" ? item.name : item.nameEn
                )
                .join("") +
              ","
        }${time})`;
        return tempFilterResult;
      });
    }

    // 初始化选中状态数组
    selectedResults.value = new Array(filterResultList.value.length).fill(
      false
    );
    dataUnitList.value = new Array(filterResultList.value.length).fill(
      dataUnit
    );
    dataTypeThreeList.value = new Array(filterResultList.value.length).fill(
      dataTypeThree.value
    );
    emitResultList.value = [
      [...filterResultList.value], // 筛选数据结果 ['陆上风电 发电潜力(GWh/km<sup>2</sup>)(2.5MW,10km,2021)']
      [...selectedResults.value], // 选中状态数组 [false, false, false, ...]
      (Array.isArray(timeResult.value) ? [...timeResult.value] : [timeResult.value]), // 时间分辨率 ['2021年', '2022年', ...]
      [...pathUrlList.value], // 路径URL列表 ['/陆上风电/发电潜力/GWh/km<sup>2</sup>(2.5MW,10km,2021)', ...]
      [...dataUnitList.value], // 数据单位列表 ['GWh/km<sup>2</sup>', ...]
      [...dataTypeThreeList.value], // 数据类型 ['"发电潜力", ...]
    ];
    
    emit("updateEmitResultList", emitResultList.value);
  }
  // 清空时间选择器
  clearTimeData();
};
</script>

<style lang="scss" scoped>
.gray-text {
  color: black;
  // color: rgb(63, 57, 57);
  font-size: 14px;
}
:deep(.el-checkbox__inner) {
  background-color: rgba(255, 255, 255, 0.4);
}

:deep(
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content
  ) {
  background-color: rgba(255, 255, 255, 0.4);
}
.iconfont {
  margin-right: 8px;
}
.condition_box {
  z-index: 10;
  position: absolute;
  overflow: visible;
  top: 10px;
  left: 30px;
  min-width: 10vw;
  // min-width: 10%;
  // max-width: 17%;
  max-width: 720px;
  // min-height: 30%;
  // min-height: 37%;
  max-height: 50vh;

  border-radius: 4px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(3px);
  box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.8);

  :deep(.temporal_resolution) {
    position: absolute;
    display: flex;
    width: 100%;
    bottom: -35px; // 设置为负值，使其位于 condition_box 底部外侧
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    .yearPicker,
    .monthPicker {
      width: 88%;
      min-width: 260px;
      .el-input {
        width: 100%;
        /* 修改 el-date-picker 输入框的背景色 */
        .el-input__wrapper {
          background-color: rgba(255, 255, 255, 0.4) !important;
          --el-input-placeholder-color: black;
          // --el-input-placeholder-color: rgb(26, 23, 23);
        }
      }
    }

    .hourPicker {
      width: 88%;
      min-width: 260px;
      .el-date-editor {
        background-color: rgba(255, 255, 255, 0.4) !important;
        width: 100%;
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
    // :deep(.el-date-editor .el-range-input) {
    //   background: rgba(255, 255, 255, 0.4) !important;
    //   --el-input-placeholder-color: black;
    //   // --el-input-placeholder-color: rgb(26, 23, 23);
    // }

    .el-time-spinner__wrapper {
      width: 100% !important;
    }

    .el-scrollbar:nth-of-type(2) {
      display: none;
    }
    :deep(.el-input__inner) {
      color: black; /* 修改为你需要的颜色 */
    }
    :deep(.hour-picker) {
      .el-time-spinner__wrapper {
        width: 100% !important;
      }

      .el-scrollbar:nth-of-type(2) {
        display: none !important;
      }
    }
  }

  .condition_box_top {
    display: flex;
    margin: 10px;
    justify-content: space-between;
    align-items: center;
  }

  :deep(.condition_box_body) {
    .el-tree {
      color: black; /* 再显式覆盖字体颜色 */
      font-size: 14px;
    }
    .el-tree {
      min-width: 400px;
    }
    .tree_container {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 10px;
      .tree_row {
        display: flex;
        gap: 10px;
        /* 限制最大高度并启用滚动条 */
        max-height: 300px; /* 可根据需要调整 */
        overflow-y: auto;
        overflow-x: hidden;

        .tree_row::-webkit-scrollbar {
          width: 10px;
          display: block; /* 确保滚动条始终显示 */
        }
        .resourceTree {
          // min-width: 5vw;
          // max-width: 10vw;
          min-width: 100px;
          max-width: 360px;
          // width: 700px;
          transition: all 0.3s ease;
          padding-left: 8px;
          padding-right: 0; /* 确保右侧没有内边距 */
          margin-right: -10px; /* 使用负边距将滚动条向右移动 */
          overflow-x: auto;
          max-height: 200px;
          // overflow-y: hidden;
        }

        .dataTypeTree_border {
          border-left: 1px solid #ccc;
          display: flex;
          position: relative;
        }

        .dataTypeTree {
          min-width: 100px;
          max-width: 360px;
          padding-right: 10px;
          height: 100%;
          overflow-x: auto;
          max-height: 200px;
        }

        &.child_time_row {
          border-top: 1px solid #ccc;
          .childTree {
            min-width: 100px;
            max-width: 360px;
            max-height: 120px; // 你可以根据实际需要调整
            overflow-y: auto;
            overflow-x: hidden;
          }

          .TimeTree {
            min-width: 100px;
            max-width: 360px;
            max-height: 130px; // 你可以根据实际需要调整
            overflow-y: auto;
            overflow-x: hidden;
            // padding-left: 50px;
            // padding-right: 10px;
            // width: 100%; // 添加这行
            // box-sizing: border-box; // 添加这行
          }
          .childtree_title {
            display: flex;
            margin: 10px;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
    .tree_container::-webkit-scrollbar {
      width: 10px;
      display: block; /* 确保滚动条始终显示 */
    }

    .el-tree {
      background-color: transparent;

      .el-tree-node__content {
        height: 32px;
      }
    }
    .add-node-dialog {
      :deep(.el-dialog__title) {
        font-size: 10px;
      }

      :deep(.el-form-item__label) {
        font-size: 14px;
      }

      :deep(.el-input__inner),
      :deep(.el-select__inner) {
        font-size: 14px;
      }

      :deep(.el-button) {
        font-size: 14px;
      }
    }

    .custom-tree-node {
      display: flex;
      align-items: center;
      font-size: 14px;
    }

    .custom-tree-node .el-checkbox {
      margin-right: 8px; /* 在复选框右侧添加8px的间距 */
    }

    .operationTree {
      margin-left: 10px;

      .el-button {
        padding: 4px;
        margin-left: 4px;
      }
    }
  }
}
:deep(.el-picker-panel__footer .el-button--text) {
  color: #ffffff !important;
  background-color: #0056b3 !important;
}
</style>
