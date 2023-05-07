// 公告模块
export default {
  namespaced: true,
  state() {
    return {
      editnoticeobj: {
        title: "",
        content: "",
        noticeman: "",
      },
      editnoticestatus: 1,
      noticetablestatus: 1,
      editnoticetype: 0, //编辑类型，0为更改，1为发布
      editnoticetitle: "更改公告",
      activenotice: 0,
      activenoticepage: 1,
    };
  },
  mutations: {
    setEditNoticeobj(state, payload) {
      state.editnoticeobj = payload;
    },
    setEditNoticeStatus(state) {
      state.editnoticestatus += 1;
    },
    setNoticetableStatus(state) {
      state.noticetablestatus += 1;
    },
    setEditNoticeType(state, payload) {
      state.editnoticetype = payload;
    },
    setEditNoticeTitle(state, payload) {
      state.editnoticetitle = payload;
    },
    setActiveNotice(state, payload) {
      state.activenotice = payload;
    },
    setActiveNoticepage(state, payload) {
      state.activenoticepage = payload;
    },
  },
};
