// 维修模块
export default {
  namespaced: true,
  state() {
    return {
      editmtstatus: 1,
      editmtid: 0,
      mttablestatus: 0,
      mthistorytablestatus: 0,
      editmthistorystatus: 1,
      stumtformstatus: 0,
      stumtliststatus: 0,
    };
  },
  mutations: {
    setEditmtStatus(state) {
      state.editmtstatus += 1;
    },
    setEditmtId(state, payload) {
      state.editmtid = payload;
    },
    setMtTableStatus(state) {
      state.mttablestatus += 1;
    },
    setMtHistoryTableStatus(state) {
      state.mthistorytablestatus += 1;
    },
    setEditmtHistoryStatus(state) {
      state.editmthistorystatus += 1;
    },
    setStumtFormStatus(state) {
      state.stumtformstatus += 1;
    },
    setStumtListStatus(state) {
      state.stumtliststatus += 1;
    },
  },
};
