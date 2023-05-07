import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

import dsuser from "./modules/dsuser";
import dsnotice from "./modules/dsnotice";
import dsappeal from "./modules/dsappeal";
import dsmaintain from "./modules/dsmaintain";
import dsdorm from "./modules/dsdorm";
import nightmode from "./modules/nightmode";

export default createStore({
  state() {
    return {
      noticeContent: "",
    };
  },
  mutations: {
    setNoticeContent(state, payload) {
      state.noticeContent = payload;
    },
  },
  modules: {
    dsuser,
    dsnotice,
    dsappeal,
    nightmode,
    dsmaintain,
    dsdorm,
  },
  // 配置插件
  plugins: [
    // 默认存储在localStorage
    createPersistedState({
      // 本地存储名字
      key: "wyudmsStore",
      // 指定需要存储的模块
      paths: ["dsuser", "nightmode"],
    }),
  ],
});
