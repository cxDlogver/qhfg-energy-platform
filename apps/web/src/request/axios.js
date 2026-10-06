// 封装axios
import axios from "axios";
const baseURL = "/api";
const request = axios.create({
  baseURL: baseURL,
  timeout: 100000,
});
// 设置请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const userInfo = localStorage.getItem("leiyangUser");
    let token = "";
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        token = user.token;
      } catch (e) {
        console.error("解析用户信息失败:", e);
      }
    }
    

    // 设置请求头
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json;charset=UTF-8",
      token: token, // 添加 token 到请求头
    };

    // 如果是 GET 请求，确保参数正确设置
    if (config.method === "get") {
      // 确保params对象存在
      config.params = {
        ...config.params,
      };
    }
    return config;
  },
  (error) => {
    // console.log(error)
    return Promise.reject(error);
  }
);

// 定义响应拦截器
request.interceptors.response.use(
  (res) => {
    // 只要后端有响应（无论 status），都返回 res.data
    if (res && res.data) {
      // token 处理逻辑
      if (res.data.token) {
        const userInfo = localStorage.getItem("leiyangUser");
        if (userInfo) {
          try {
            const user = JSON.parse(userInfo);
            user.token = res.data.token;
            localStorage.setItem("leiyangUser", JSON.stringify(user));
          } catch (e) {
            console.error("更新 token 失败:", e);
          }
        }
      }
      return res.data;
    }
    throw Error("请求数据失败");
  },
  (err) => {
    // 只在真正的网络错误时 reject
    if (err.response && err.response.data) {
      // 有响应体的错误也 resolve，前端能拿到 code/msg
      return Promise.resolve(err.response.data);
    }
    // 只有断网、超时等才 reject
    return Promise.reject(err);
  }
);

export default request;
