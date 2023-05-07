import axios from "axios";
import store from "@/store";
import router from "@/router";

const request = axios.create({
  // baseURL: "http://127.0.0.1",
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    // 拦截业务逻辑
    // 进行请求配置的修改
    // 如果本地又token就在头部携带
    // 1. 获取用户信息对象
    const { dsuserInfo } = store.state.dsuser;
    // 2. 判断是否有token
    if (dsuserInfo.token) {
      // 3. 设置token
      config.headers.Authorization = `Bearer ${dsuserInfo.token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// res => res.data  取出data数据，将来调用接口的时候直接拿到的就是后台的数据
request.interceptors.response.use(
  (res) => {
    // console.log(res.data.message);
    if (res.data.message == "voidtoken") {
      store.commit("dsuser/setUser", {});
      // const fullPath = encodeURIComponent(router.currentRoute.value.fullPath);
      // encodeURIComponent 转换uri编码，防止解析地址出问题
      router.push("/login");
    }
    return res.data;
  },
  (err) => {
    // 401 状态码，进入该函数
    if (err.response && err.response.status === 401) {
      // 1. 清空无效用户信息
      // 2. 跳转到登录页
      // 3. 跳转需要传参（当前路由地址）给登录页码
      store.commit("dsuser/setUser", {});
      // 当前路由地址
      // 组件里头：`/user?a=10` $route.path === /user  $route.fullPath === /user?a=10
      // js模块中：router.currentRoute.value.fullPath 就是当前路由地址，router.currentRoute 是ref响应式数据
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath);
      // encodeURIComponent 转换uri编码，防止解析地址出问题
      router.push("/login?redirectUrl=" + fullPath);
    }
    return Promise.reject(err);
  }
);

export default request;
