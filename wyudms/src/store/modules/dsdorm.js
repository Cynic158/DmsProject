// 宿舍模块
export default {
  namespaced: true,
  state() {
    return {
      activebuilding: 40,
      roomstu: [
        {
          id: 0,
          bed: "0",
          sex: "男",
          counsellor: "none",
          job: "舍员",
          major: "none",
          phone: "00000000000",
          stuclass: "000000",
          stuname: "none",
          stunumber: "0000000000",
        },
        {
          id: 0,
          bed: "0",
          sex: "男",
          counsellor: "none",
          job: "舍员",
          major: "none",
          phone: "00000000000",
          stuclass: "000000",
          stuname: "none",
          stunumber: "0000000000",
        },
        {
          id: 0,
          bed: "0",
          sex: "男",
          counsellor: "none",
          job: "舍员",
          major: "none",
          phone: "00000000000",
          stuclass: "000000",
          stuname: "none",
          stunumber: "0000000000",
        },
        {
          id: 0,
          bed: "0",
          sex: "男",
          counsellor: "none",
          job: "舍员",
          major: "none",
          phone: "00000000000",
          stuclass: "000000",
          stuname: "none",
          stunumber: "0000000000",
        },
      ],
      roomname: {
        building: "00",
        room: "000",
      },
      dormroomstatus: 0,
      dormremainstatus: 0,
      dormdetailstatus: 0,
      studetail: {
        id: 0,
        building: "00",
        room: "000",
        bed: "0",
        stuname: "none",
        job: "none",
        sex: "none",
        stuclass: "000000",
        stunumber: "0000000000",
        phone: "00000000000",
        major: "none",
        counsellor: "none",
      },
      adjustdetail: {
        id: 0,
        reason: "",
        adjustbuilding: "",
        adjustroom: "",
        adjustbed: "",
        adjustmessage: "",
        status: "",
      },
      adjustliststatus: 0,
      adjustliststatus2: 0,
      choosestu: {
        building: "",
        room: "",
        stuname: "",
        stuid: 0,
        adjustid: 0,
      },
      stepstatus: 0,
      step: 0,
      stuinfostatus: 0,
    };
  },
  mutations: {
    setActiveBuilding(state, payload) {
      state.activebuilding = payload;
    },
    setRoomStu(state, payload) {
      state.roomstu = payload;
    },
    setRoomName(state, payload) {
      state.roomname = payload;
    },
    setDormRoomStatus(state) {
      state.dormroomstatus += 1;
    },
    setDormRemainStatus(state) {
      state.dormremainstatus += 1;
    },
    setDormDetailStatus(state) {
      state.dormdetailstatus += 1;
    },
    setStuDetail(state, payload) {
      state.studetail = payload;
    },
    setAdjustDetail(state, payload) {
      state.adjustdetail = payload;
    },
    setAdjustListStatus(state) {
      state.adjustliststatus += 1;
    },
    setAdjustListStatus2(state) {
      state.adjustliststatus2 += 1;
    },
    setChooseStu(state, payload) {
      state.choosestu = payload;
    },
    setStepStatus(state) {
      state.stepstatus += 1;
    },
    setStep(state, payload) {
      state.step = payload;
    },
    setStuInfoStatus(state) {
      state.stuinfostatus += 1;
    },
  },
};
