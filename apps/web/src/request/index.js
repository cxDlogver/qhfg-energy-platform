// 封装所有请求数据的方法
import request from "./axios";

//登录
// export const loginInterface = async (username, password) => {
//   const response = await request.post("/login", {
//     username,
//     password,
//   });
//   return response.data;
// };
export const loginInterface = async (username, password) => {
  try {
    const response = await request.post("/login", {
      username,
      password,
    });
    
    return response;
  } catch (error) {
    throw error;
  }
};
//注册
export const registerInterface = async (
  username,
  password,
  fullName,
  phone,
  email,
  company,
  region,
  code
) => {
  
  const response = await request.post("/register", {
    username,
    password,
    fullName,
    phone,
    email,
    company,
    region,
    code,
  });
  return response;
};
//获取邮箱验证码
export const getEmailCodeInterface = (email) => {
  return request.get("/sendcode", {
    params: {
      email,
    },
  });
};

//获取筛选列表资源数据
export const getlayerListResourceData = (language) => {
  return request.get(`/list/getresourcelist?language=${language}`);
  // return request.get("/list/getresourcelist");
};


//获取筛选列表类型数据
export const getLayerListTypeData = async (conditionId, language) => {
  try {
    const response = await request.get(
      `/list/getdatatypelist?conditionId=${conditionId}&language=${language}`
    );
    return response.data?.children || []; // 确保返回数组，避免 undefined
  } catch (error) {
    console.error("获取数据类型列表失败:", error);
    return []; // 发生错误时返回空数组，防止页面崩溃
  }
};

//获取筛选列表空间/时间分辨率数据
export const getlayerListChildData = (conditionId, language) =>
  request.get(`/list/getchild?conditionId=${conditionId}&language=${language}`);
//编辑筛选列表数据
export const editlayerListData = async (conditionId, name) => {
  const response = await request.post("/list/updatecondition", {
    conditionId,
    name,
  });
  return response.data;
};

//增加筛选列表数据
export const addlayerListData = async (name, nameEn, parentId, type) => {
  const response = await request.post("/list/addChild", {
    name,
    nameEn,
    parentId,
    type,
  });
  return response.data;
};
//删除筛选列表数据
export const deletelayerListData = async (conditionId) => {
  const response = await request.post("/list/delcondition", {
    conditionId,
  });
  return response.data;
};

// MAP: "/io/data/供给侧数据/风力发电/低空风电/陆上风电/潜力数据/2.5MW/容量因子/10km/年/2021.qgs",
// LAYER: "2021.tif",
//请求图例
export const getLegendGraphic = async (MAP, LAYER, language) => {
  const response = await request.get(
    `/map/getlegend?MAP=${MAP}&LAYER=${LAYER}&language=${language}`
  );
  // console.log("图例数据", response.data);
  return response.data;
};

//识别点数据请求
export const getPointData = async (
  mapPath,
  layers,
  longitude,
  latitude,
  language,
  signal
) => {
  try {
    const response = await request.get(
      `/map/getpoint?MAP=${mapPath}&LAYERS=${layers}&LONGITUDE=${longitude}&LATITUDE=${latitude}&language=${language}`,
      {
        signal,
      }
    );
    
    return response.data ?? null;
  } catch (error) {
    if (error?.name === "CanceledError" || error?.name === "AbortError") {
      throw error;
    }
    console.error("点位数据请求失败:", error);
    throw new Error("点位数据请求失败");
  }
};
//请求表格数据129.211.174.149:18080/statistical/getexceldata
export const getExcelData = async (map, timeScale, year, level, language) => {
  const response = await request.get(
    // `/statistical/getexceldata?map=${map}&timeScale=${timeScale}&year=${year}&level=${level}&language=${language}`
    `/statistical/getexceldata?map=${map}&timeScale=${timeScale}&year=${year}&level=${level}&language=${language}`
  );
  
  return response.data;
};
// 表格数据下载（返回 Blob）
export const getDownloadData = async (
  map,
  timeScale,
  year,
  level,
  language
) => {
  const response = await request.get(
    `/statistical/download?map=${map}&timeScale=${timeScale}&year=${year}&level=${level}&language=${language}`,
    {
      responseType: "blob", // 💡 设置为 Blob 类型
    }
  );
  if(response instanceof Blob && response.type.includes("json")){const body=JSON.parse(await response.text());throw Object.assign(new Error(body.msg),{status:body.code});}
  return response;
};

export const getLinedata = async (data) => {
  const response = await request.get(
    `/statistical/getlinedata?map=${data.map}&timescale=${data.timescale}&timespan=${data.timespan}&level=${data.level}&places=${data.places}&language=${data.language}`
  );
  return response.data;
};

export const getRegions = async (data) => {
  const response = await request.get(
    `/region/getregions?map=${data.map}`
  );
  return response.data;
};

export const getDescription = async (data) => {
  const response = await request.get(
    `/i/getdescription?map=${data.map}&language=${data.language}`
  );
  return response.data;
};

// 发送重置密码验证码
// export const sendResetPwdCode = async (data) => {
//   const response = await request.get(
//     `/user/sendmodcode?email=${data.email}`
//   );
//   return response.data;
// };
export function sendResetPwdCode(params) {
  return request.get('/user/sendmodcode', { params });
}

// 重置密码
// export const resetPassword = async (data) => {
//   const response = await request.get(
//     `/user/modifypwd?email=${data.email}&code=${data.code}&password=${data.password}`
//   );
//   return response.data;
// };

export const resetPassword = async (data) => {
  return request.post('/user/modifypwd', {
    email: data.email,
    code: data.code,
    password: data.password
  });
};