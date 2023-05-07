// 诉求模块
export default {
  namespaced: true,
  state() {
    return {
      activeappeal: 0,
      activeappealpage: 1,
      appealformid: 0,
      appealformstatus: 0,
      appealformtype: 0,
      appealformobj: {
        id: 0,
        type: "建议",
        content: "",
      },
    };
  },
  mutations: {
    setActiveAppeal(state, payload) {
      state.activeappeal = payload;
    },
    setActiveAppealpage(state, payload) {
      state.activeappealpage = payload;
    },
    setAppealFormStatus(state) {
      state.appealformstatus += 1;
    },
    setAppealFormType(state, payload) {
      state.appealformtype = payload;
    },
    setAppealFormObj(state, payload) {
      state.appealformobj = payload;
    },
    setAppealFormId(state, payload) {
      state.appealformid = payload;
    },
  },
};
