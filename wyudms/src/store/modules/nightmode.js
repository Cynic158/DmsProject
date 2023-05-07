// 主题模块
// const localmode = JSON.parse(localStorage.getItem("wyudmsStore"));

export default {
  namespaced: true,
  state() {
    return {
      // nightmode: localmode.nightmode.nightmode || true,
      nightmode: true,
    };
  },
  mutations: {
    changeMode(state) {
      state.nightmode = !state.nightmode;
    },
  },
};
