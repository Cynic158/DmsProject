// 用户模块
export default {
  namespaced: true,
  state() {
    return {
      // 用户信息
      dsuserInfo: {
        id: "",
        dsuserName: "",
        token: "",
        type: null,
        job: 0,
      },
      // 登录后回跳路径
      redirectUrl: "/",
      editobj: {
        building: "",
        floor: "",
        room: "",
        bed: "",
        sex: "",
        job: "",
        major: "",
        stuclass: "",
        stunumber: "",
        stuname: "",
        phone: "",
        counsellor: "",
      },
      editstatus: 1,
      stutablestatus: 1,
      edittype: 0, //编辑类型，0为更新，1为新增
      edittitle: "编辑学生",
    };
  },
  mutations: {
    // 修改用户信息，payload就是用户信息对象
    setUser(state, payload) {
      state.dsuserInfo = payload;
    },
    // 修改回跳地址
    setRedirectUrl(state, url) {
      state.redirectUrl = url;
    },
    setEditobj(state, payload) {
      state.editobj = payload;
    },
    setEditStatus(state) {
      state.editstatus += 1;
    },
    setStutableStatus(state) {
      state.stutablestatus += 1;
    },
    setEditType(state, payload) {
      state.edittype = payload;
    },
    setEditTitle(state, payload) {
      state.edittitle = payload;
    },
    setStuJob(state, payload) {
      state.dsuserInfo.job = payload;
    },
  },
};
