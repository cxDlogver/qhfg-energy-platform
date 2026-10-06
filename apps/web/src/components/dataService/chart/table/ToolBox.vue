<template>
  <div class="tools_box2 gray-text">
    <el-button class="clear_button" @click="clearSelected">{{
      $t("chart.clear")
    }}</el-button>
    <!-- 文件下载，下载数据前需要同意用户使用协议 -->
    <el-button class="download_button" 
      :disabled=props.is_download_Disabled
      @click="open"
    >{{
      $t("chart.download")
    }}</el-button>
    <!-- 数据来源i展开是简要的数据说明，以及对应数据的引用来源。 -->
    <el-button class="info" circle size="large" @click="showDetailInfo">i</el-button>
    <el-dialog
      v-model="showInfoModal"
      :title="dataDescription"
      width="650px"
      :append-to-body="true"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="info-dialog-custom"
      center
    >
      <div class="info-dialog-body" v-html="dataDescriptionDetail"></div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch} from "vue";
import bus from "@/utils/bus";
import { getDownloadData, getDescription } from "@/request";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";



const open = () => {
  ElMessageBox.confirm(
    `
    <div style="margin-bottom: 16px; text-align: justify; line-height: 1.8;">
      ${t('agreement.content')}
    </div>
    <ol style="margin-left: 0; padding-left: 0;">
      <li style="margin-bottom: 10px; text-align: justify; line-height: 1.8;">${t('agreement.clause1')}</li>
      <li style="margin-bottom: 10px; text-align: justify; line-height: 1.8;">${t('agreement.clause2')}</li>
      <li style="margin-bottom: 10px; text-align: justify; line-height: 1.8;">${t('agreement.clause3')}</li>
      <li style="margin-bottom: 10px; text-align: justify; line-height: 1.8;">${t('agreement.clause4')}</li>
      <li style="margin-bottom: 10px; text-align: justify; line-height: 1.8;">${t('agreement.clause5')}</li>
      <li style="margin-bottom: 10px; text-align: justify; line-height: 1.8;">${t('agreement.clause6')}</li>
      <li style="margin-bottom: 10px; text-align: justify; line-height: 1.8;">${t('agreement.clause7')}</li>
      <li style="margin-bottom: 10px; text-align: justify; line-height: 1.8;">${t('agreement.clause8')}</li>
      <li style="margin-bottom: 10px; text-align: justify; line-height: 1.8;">${t('agreement.clause9')}</li>
      <li style="margin-bottom: 10px; text-align: justify; line-height: 1.8;">${t('agreement.clause10')}</li>
    </ol>
    `,
    t('agreement.title'),
    {
      confirmButtonText: t('agreement.confirmButton'),
      cancelButtonText: t('agreement.cancelButton'),
      type: 'info',
      width: '90%',
      center: true,
      showClose: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      dangerouslyUseHTMLString: true,
    }
  )
    .then(() => {
      downloadExcel();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: t('agreement.cancelMessage'),
      })
    })
}

const showAgreement = ref(false);


let dataDescription = "数据说明";
let dataDescriptionDetail = "无数据来源说明";


// 控制 el-card 显隐
const showCard = ref(false);
const showInfoModal = ref(false);

const acceptAgreement = () => {
  showAgreement.value = false;
  // 调用下载函数
  downloadExcel();
};
const { t, locale } = useI18n();

onMounted(() => {
  bus.on("excelDataParams", handleExcelDataParams);
});
onUnmounted(() => {
  bus.off("tableParams", handleTableParams);
  
  bus.off("excelDataParams", handleExcelDataParams);
});
const tableParams = ref({});
const handleTableParams = params => { tableParams.value = params; };
bus.on("tableParams", handleTableParams);

const clearSelected = () => {
  tableParams.value = [];
  bus.emit("clearSelected", tableParams.value);
  showCard.value = false; // 清除后关闭信息卡片
};
const handleExcelDataParams = (params) => {
  tableParams.value = params;
};

//文件下载
const downloadExcel = async () => {
  try {
    if (tableParams.value.length == 0) {
      ElMessage.error(t("chart.noParamsSelected"));
      return;
    }
    //从服务器获取数据并下载为Excel文件
    const res = await getDownloadData(tableParams.value.map, tableParams.value.timescale, tableParams.value.year, tableParams.value.level, tableParams.value.language);
     // 先打印查看数据是否正确
    // 明确指定Blob的type
    const blob = new Blob([res], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    //创建下载链接并触发下载
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "数据.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (error.status == 403) {
      ElMessage.error(t("chart.hasNoPermission"));
      return;
    }
    console.error("下载失败：", error);
  }
};


//接收数据
const props = defineProps({
  selectMapPath: String,
  resData1:Object,
  is_download_Disabled:Boolean,
});

// 监听 props.selectMapPath 变化
watch(
  () => props.selectMapPath,
  async (newPath) => {
    try {
      
      if (newPath) {
        
      } 
    } catch (error) {
      console.error("数据处理失败:", error);
    }
  }
);
const showDetailInfo = () => {
  showInfoModal.value = true;
  // console.log('props.resData1', props.resData1); // 调试用
  // dataDescription = "测试标题";
  // dataDescriptionDetail = "这里是测试内容。";
  if(props.resData1){
    dataDescription = props.resData1.dataName;
    if(locale.value === "chinese"){
      dataDescriptionDetail = props.resData1.descriptionZn;
    }else{
      dataDescriptionDetail = props.resData1.descriptionEn;
    }
  } else {
    dataDescription = "数据说明";
    dataDescriptionDetail = "无数据来源说明";
  }
};
</script>

<style scoped lang="scss">
.gray-text {
  color: black;
  font-size: 14px;
}
/* 覆盖所有 el-button 的字体背景颜色 */
:deep(.el-button) {
  color: black !important;
  background-color: rgba(255, 255, 255, 0.4) !important;
}
.el-message-box {
  width: 800px; /* 设置弹窗宽度 */
}

/* 自定义MessageBox弹窗样式 */
:deep(.el-message-box) {
  width: 90% !important; /* 宽度占屏幕90% */
  max-width: 1800px !important; /* 最大宽度 */
  min-width: 1200px !important; /* 最小宽度 */
  max-height: 90vh !important; /* 弹窗最大高度占屏幕90% */
}

/* 协议弹窗标题样式 */
:deep(.el-message-box__header) {
  text-align: center;
  padding: 20px 30px 10px 30px;
}

:deep(.el-message-box__title) {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

:deep(.el-message-box__content) {
  max-height: 75vh;
  min-height: 400px;
  overflow-y: auto;
  padding: 30px;
  line-height: 1.8;
  font-size: 14px;
  text-align: justify;
  word-break: break-word;
  hyphens: auto;
  
  /* 协议内容样式优化 */
  ol {
    padding-left: 20px;
    margin: 0;
  }
  
  li {
    margin-bottom: 12px;
    text-indent: 0;
    padding-left: 0;
  }
  
  /* 明显的滚动条样式 */
  &::-webkit-scrollbar {
    width: 12px;
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background: #409EFF;
    border-radius: 6px;
    border: 2px solid #fff;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #1976d2;
  }
}

/* 协议弹窗按钮区域样式 */
:deep(.el-message-box__btns) {
  padding: 15px 30px 20px 30px;
  text-align: center;
}

:deep(.el-message-box__btns .el-button) {
  min-width: 100px;
  height: 36px;
  font-size: 14px;
  border-radius: 6px;
}

.agreement-modal {
  position: fixed;
  top: 0;
  left: 0;
  // // width: 50vh;
  width: 100%;
  height: 85vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  z-index: 1000;
}
.agreement-content {
  // background: #fff;
  // padding: 60px;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  // max-width: none;
  overflow-y: auto;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.9 ); // 半透明白色背景
  backdrop-filter: blur(3px); // 背景模糊效果（毛玻璃效果）
  box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.8); // 透明的阴影效果
}
.tools_box2 {
  position: relative; // 为 absolute 卡片提供定位参考
  display: flex;
  width: 100%;
  height: calc(20% - 60px);
  margin-top: 10px;

  .clear_button {
    width: 100px;
    height: 30px;
    line-height: 30px;
    margin-left: 50px;
  }

  .download_button {
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin-left: 120px;
    border-radius: 4px;
  }

  .info {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    justify-content: center;
    margin-left: 20px;
    margin-top: 2px;
  }
  // 重点：覆盖 el-card 的默认背景
  :deep(.el-card) {
    background: rgb(255, 255, 255) !important;
  }
  .info-card {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    width: 340px;
    min-height: 180px;
    max-height: 380px;
    z-index: 1000;
    padding: 0 !important;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 6px 32px rgba(0,0,0,0.18);
    overflow: hidden;
    :deep(.el-card__body) {
      padding: 0;
    }
    .clearfix {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 18px 8px 18px;
      border-bottom: 1px solid #f0f0f0;
      background: #f7fafd;
    }
    .info-card-title {
      font-weight: bold;
      font-size: 16px;
      color: #222;
      flex: 1;
      text-align: left;
    }
    .info-card-close {
      font-size: 20px;
      color: #888;
      cursor: pointer;
      margin-left: 12px;
      transition: color 0.2s;
    }
    .info-card-close:hover {
      color: #f56c6c;
    }
    .card-content {
      text-align: justify;
      max-height: 280px;
      overflow-y: auto;
      margin: 0;
      padding: 18px 20px 16px 20px;
      box-sizing: border-box;
      /* 优化滚动条样式 */
      // &::-webkit-scrollbar {
      //   width: 6px;
      // }
      // &::-webkit-scrollbar-track {
      //   background: #f1f1f1;
      // }
      // &::-webkit-scrollbar-thumb {
      //   background: #888;
      //   border-radius: 3px;
      // }
      // &::-webkit-scrollbar-thumb:hover {
      //   background: #555;
      // }
    }

    p {
      margin: 6px 10px;
    }
  }
}
.info-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.info-modal-content {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.18);
  width: 90vw;
  max-width: 900px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.info-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px 12px 28px;
  border-bottom: 1px solid #e0e0e0;
  background: rgba(247,250,253,0.9);
}
.info-modal-title {
  font-weight: bold;
  font-size: 20px;
  color: #222;
}
.info-modal-close {
  font-size: 28px;
  color: #888;
  cursor: pointer;
  margin-left: 18px;
  transition: color 0.2s;
}
.info-modal-close:hover {
  color: #f56c6c;
}
.info-modal-body {
  padding: 24px 32px 28px 32px;
  overflow-y: auto;
  font-size: 16px;
  line-height: 1.8;
  color: #222;
  text-align: justify;
  max-height: 60vh;
}
:deep(.info-dialog-custom .el-dialog__wrapper) {
  backdrop-filter: blur(4px);
  background: rgba(0,0,0,0.35);
}
:deep(.info-dialog-custom .el-dialog) {
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.18);
  background: rgba(255,255,255,0.96);
  padding: 0;
}
:deep(.info-dialog-custom .el-dialog__header) {
  background: rgba(247,250,253,0.9);
  border-radius: 16px 16px 0 0;
  font-size: 20px;
  font-weight: bold;
  color: #222;
  padding: 20px 28px 12px 28px;
  border-bottom: 1px solid #e0e0e0;
}
:deep(.info-dialog-custom .el-dialog__body) {
  padding: 24px 32px 28px 32px;
  max-height: 60vh;
  overflow-y: auto;
  font-size: 16px;
  line-height: 1.8;
  color: #222;
  text-align: justify;
}
.info-dialog-body {
  width: 100%;
}
</style>
