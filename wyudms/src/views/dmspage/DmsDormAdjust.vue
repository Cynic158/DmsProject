<template>
  <div style="position: relative; height: 100%; width: 100%">
    <div class="shuttleContainer">
      <div class="shuttleLeft">
        <div class="shuttleTitle">
          <span>申请调宿列表</span>
          <!-- <button class="addshuttle">手动添加</button> -->
        </div>
        <ul class="shuttleList">
          <li class="shuttleItem" v-for="i in dormadjustlist.list" :key="i">
            <span>{{ i.building }}栋{{ i.room }}</span>
            <span>{{ i.stuname }}</span>
            <span>{{ i.status }}</span>
            <button @click="showadjustdetail(i.stuid, i.id)">详情</button>
          </li>
        </ul>
      </div>
      <div class="shuttleStu">
        <p style="text-align: center">当前已选中学生:</p>
        <p
          style="text-align: center"
          v-if="$store.state.dsdorm.choosestu.building != ''"
        >
          {{ $store.state.dsdorm.choosestu.building }}栋{{
            $store.state.dsdorm.choosestu.room
          }}
          {{ $store.state.dsdorm.choosestu.stuname }}
        </p>
      </div>
      <button class="shuttleBtn" @click="adjustconfirm">确认调宿 -></button>
      <div class="shuttleRight">
        <div class="shuttleTitle" style="height: 70px">
          <span>{{ dormsearchtitle }}</span>
          <div style="padding-bottom: 8px">
            <input type="text" placeholder="楼栋" class="dormsearchrequired" />
            <input type="text" placeholder="房间" class="dormsearchrequired" />
            <button class="shuttleSearch" @click="searchroom">检索学生</button>
          </div>
        </div>
        <ul class="roomstuinfo">
          <li class="shuttleItem" v-for="i in dormsearchlist.list" :key="i">
            <span>床位{{ i.bed }}</span>
            <span>{{ i.stuname }}</span>
            <span>{{ i.job }}</span>
            <button @click="getroomstu(i.building, i.room)">详情</button>
          </li>
          <li
            class="shuttleItem"
            v-for="i in dormsearchlist.adjuststu"
            :key="i"
          >
            <span>床位{{ i.adjustbed }}</span>
            <span>{{ i.stuname }}</span>
            <span>调宿中</span>
          </li>
        </ul>
        <div class="confirmContainer">
          <!-- <p>确定要将学生 方文轩 调宿到 48栋202吗</p>
          <p>此操作将会发起调宿信息至对应学生</p> -->
          <p>左边选中要处理的调宿申请</p>
          <p>右边选出学生调宿到的房间</p>
          <p>点击中间按钮确认调宿即可</p>
        </div>
      </div>
    </div>
    <div class="remainContainer">
      <div class="remainTitle">
        未满宿舍列表
        <button @click="siftbuilding">筛查</button
        ><input type="text" placeholder="筛选楼栋" class="dormsiftrequired" />
      </div>
      <div class="remainmarkContainer">
        <p class="remainmark">
          <span style="width: 17%">楼栋</span>
          <span style="width: 17%">楼层</span>
          <span style="width: 17%">房间</span>
          <span style="width: 18%">类型</span>
          <span style="width: 17%">余位</span>
        </p>
      </div>

      <ul class="remainList">
        <li class="shuttleItem" v-for="i in dormsiftlist.list" :key="i">
          <span style="width: 17%">{{ i.building }}栋</span>
          <span style="width: 17%">{{ i.floor }}楼</span>
          <span style="width: 17%">{{ i.room }}</span>
          <span style="width: 18%">{{ i.type }}</span>
          <span style="width: 17%">{{ i.stucount }}</span>
          <button @click="getroomstu(i.building, i.room)">详情</button>
        </li>
      </ul>
    </div>
  </div>
  <Dmsdormremain></Dmsdormremain>
  <Dmsadjustdetail></Dmsadjustdetail>
  <Dmsconfirm
    style="z-index: 99"
    v-model:handleId="deleteid"
    :confirmStr="deletestr"
    @settable="setadjusttable"
    :handleType="deletetype"
    :handleMessage="deletemessage"
  ></Dmsconfirm>
</template>

<script>
import {
  getroomstuinfo,
  getremainlist,
  getadjustlist,
  getadjustdetail,
  roomexist,
  getadjustbyroom,
} from "@/api/dorm";
import { useStore } from "vuex";
import { onMounted, reactive, ref, watch } from "vue";
import Dmsdormremain from "@/components/Dmsdormremain.vue";
import Dmsadjustdetail from "@/components/Dmsadjustdetail.vue";
export default {
  name: "dmsdormadjust",
  components: {
    Dmsdormremain,
    Dmsadjustdetail,
  },
  setup() {
    const store = useStore();

    let dormsearchlist = reactive({
      list: [],
      building: "",
      room: "",
      adjuststu: [],
    });
    let dormsearchtitle = ref("请检索获得房间学生信息");
    const searchroom = () => {
      let searchval = document.querySelectorAll(".dormsearchrequired")[0].value;
      let searchval2 = document.querySelectorAll(".dormsearchrequired")[1]
        .value;
      if (searchval == "" || searchval2 == "") {
        store.commit("setNoticeContent", "检索项不能为空");
      } else {
        roomexist({ building: searchval, room: searchval2 })
          .then((res1) => {
            if (res1.status == 0) {
              if (res1.existinfo.length == 0) {
                dormsearchlist.building = "";
                dormsearchlist.room = "";
                store.commit("setNoticeContent", "该房间不存在");
                dormsearchtitle.value = "请检索获得房间学生信息";
              } else {
                // 房间存在
                getroomstuinfo({ building: searchval, room: searchval2 })
                  .then((res2) => {
                    if (res2.status == 0) {
                      dormsearchlist.building = searchval;
                      dormsearchlist.room = searchval2;
                      // 由此处检索是否有调宿到此宿舍的学生
                      getadjustbyroom({
                        adjustbuilding: searchval,
                        adjustroom: searchval2,
                      })
                        .then((res3) => {
                          if (res3.status == 0) {
                            if (
                              res3.adjuststu.length == 0 &&
                              res2.roomstuinfo.length == 0
                            ) {
                              store.commit(
                                "setNoticeContent",
                                "该房间未检索到学生"
                              );
                            } else {
                              res2.roomstuinfo.forEach((item) => {
                                if (item.sex == 0) {
                                  item.sex = "男";
                                } else if (item.sex == 1) {
                                  item.sex = "女";
                                }
                                if (item.job == 0) {
                                  item.job = "舍员";
                                } else if (item.job == 1) {
                                  item.job = "舍长";
                                } else if (item.job == 2) {
                                  item.job = "层长";
                                } else if (item.job == 3) {
                                  item.job = "舍长兼层长";
                                }
                                item.building = searchval;
                                item.room = searchval2;
                              });
                              dormsearchlist.adjuststu = res3.adjuststu;
                            }
                            dormsearchtitle.value = `${searchval}栋${searchval2}房`;
                            dormsearchlist.list = res2.roomstuinfo;
                          } else {
                            console.log(res3.message);
                          }
                        })
                        .catch((err) => {
                          console.log(err.message);
                        });
                    } else {
                      console.log(res2.message);
                    }
                  })
                  .catch((err) => {
                    console.log(err.message);
                  });
              }
            } else {
              console.log(res1.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    };

    let dormsiftlist = reactive({
      list: [],
    });
    const siftbuilding = () => {
      let siftval = document.querySelector(".dormsiftrequired").value.trim();
      getremainlist({ building: siftval })
        .then((res) => {
          if (res.status == 0) {
            // console.log(res.remainlist[0]);
            res.remainlist.forEach((item) => {
              item.stucount = 4 - parseInt(item.stucount);
              if (item.building != "44" || item.building != "45") {
                item.type = "男舍";
              } else {
                item.type = "女舍";
              }
            });
            // console.log(res.remainlist[0]);
            dormsiftlist.list = res.remainlist;
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    const getroomstu = (building, room) => {
      console.log(building, room);
      getroomstuinfo({ building: building, room: room })
        .then((res) => {
          if (res.status == 0) {
            // console.log(res.roomstuinfo);
            res.roomstuinfo.forEach((item) => {
              if (item.job == 0) {
                item.job = "舍员";
              } else if (item.job == 1) {
                item.job = "舍长";
              } else if (item.job == 2) {
                item.job = "层长";
              } else if (item.job == 3) {
                item.job = "舍长兼层长";
              }
              if (item.sex == 0) {
                item.sex = "男";
              } else if (item.sex == 1) {
                item.sex = "女";
              }
            });
            store.commit("dsdorm/setRoomName", {
              building: building,
              room: room,
            });
            store.commit("dsdorm/setRoomStu", res.roomstuinfo);
            store.commit("dsdorm/setDormRemainStatus");
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    let dormadjustlist = reactive({
      list: [],
    });
    const showadjustdetail = (stuid, adjustid) => {
      // console.log(stuid, adjustid);
      getadjustdetail({ stuid: stuid, adjustid: adjustid })
        .then((res) => {
          if (res.status == 0) {
            // console.log(res.studetail, res.adjustdetail);
            if (res.studetail[0].job == 0) {
              res.studetail[0].job = "舍员";
            } else if (res.studetail[0].job == 1) {
              res.studetail[0].job = "舍长";
            } else if (res.studetail[0].job == 2) {
              res.studetail[0].job = "层长";
            } else if (res.studetail[0].job == 3) {
              res.studetail[0].job = "舍长兼层长";
            }
            if (res.studetail[0].sex == 0) {
              res.studetail[0].sex = "男";
            } else if (res.studetail[0].sex == 1) {
              res.studetail[0].sex = "女";
            }
            if (res.adjustdetail[0].status == 0) {
              res.adjustdetail[0].status = "已通过";
            } else if (res.adjustdetail[0].status == 1) {
              res.adjustdetail[0].status = "未处理";
            } else if (res.adjustdetail[0].status == 2) {
              res.adjustdetail[0].status = "调宿中";
            } else if (res.adjustdetail[0].status == 3) {
              res.adjustdetail[0].status = "未通过";
            } else if (res.adjustdetail[0].status == 4) {
              res.adjustdetail[0].status = "已中断";
            } else if (res.adjustdetail[0].status == 5) {
              res.adjustdetail[0].status = "已完成";
            }
            store.commit("dsdorm/setStuDetail", res.studetail[0]);
            store.commit("dsdorm/setAdjustDetail", res.adjustdetail[0]);
            store.commit("dsdorm/setDormDetailStatus");
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    const deleteid = ref(0);
    const deletestr = ref("确认要调宿到该宿舍吗？");
    const deletetype = ref(0);
    const deletemessage = ref("");
    const adjustconfirm = () => {
      // 确认右方是否选择了房间、房间是否存在、是否满人、左方是否选择了学生
      if (
        store.state.dsdorm.choosestu.stuid == 0 ||
        store.state.dsdorm.choosestu.building == ""
      ) {
        // 左方没有选择要调宿的学生
        store.commit("setNoticeContent", "左方并未选中要调宿的学生");
      } else if (
        dormsearchlist.list.length + dormsearchlist.adjuststu.length ==
        4
      ) {
        store.commit("setNoticeContent", "右方宿舍学生人数已满");
      } else if (dormsearchlist.building == "" || dormsearchlist.room == "") {
        store.commit("setNoticeContent", "右方宿舍不存在");
      } else {
        console.log(dormsearchlist.building, dormsearchlist.room);
        deleteid.value = store.state.dsdorm.choosestu.adjustid;
        deletestr.value = "确认要调宿到该宿舍吗？";
        deletetype.value = 9;
        let adjuststr = `${dormsearchlist.building},${dormsearchlist.room},${
          dormsearchlist.list.length + 1
        }`;
        deletemessage.value = adjuststr;
      }
    };

    const setadjusttable = () => {
      leftlist();
      // 右侧也刷新
      searchroom();
    };
    const leftlist = () => {
      getadjustlist()
        .then((res) => {
          if (res.status == 0) {
            // console.log(res.adjustlist);
            res.adjustlist.forEach((item) => {
              switch (item.status) {
                case 0:
                  item.status = "已通过";
                  break;
                case 1:
                  item.status = "未处理";
                  break;
                case 2:
                  item.status = "调宿中";
                  break;
                case 3:
                  item.status = "未通过";
                  break;
                case 4:
                  item.status = "已中断";
                  break;
                case 5:
                  item.status = "已完成";
                  break;
                default:
                  item.status = "状态错误";
                  break;
              }
            });
            dormadjustlist.list = res.adjustlist;
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    onMounted(() => {
      getremainlist({ building: "" })
        .then((res) => {
          if (res.status == 0) {
            // console.log(res.remainlist[0]);
            res.remainlist.forEach((item) => {
              item.stucount = 4 - parseInt(item.stucount);
              if (item.building != "44" || item.building != "45") {
                item.type = "男舍";
              } else {
                item.type = "女舍";
              }
            });
            // console.log(res.remainlist[0]);
            dormsiftlist.list = res.remainlist;
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
      leftlist();
      watch(
        () => store.state.dsdorm.adjustliststatus,
        () => {
          leftlist();
        }
      );
      watch(
        () => store.state.dsdorm.adjustliststatus2,
        () => {
          setadjusttable();
        }
      );
    });

    return {
      searchroom,
      dormsearchlist,
      siftbuilding,
      dormsiftlist,
      dormsearchtitle,
      getroomstu,
      dormadjustlist,
      showadjustdetail,
      adjustconfirm,
      deleteid,
      deletestr,
      deletetype,
      deletemessage,
      setadjusttable,
    };
  },
};
</script>

<style>
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.shuttleList {
  height: 460px;
  margin-left: 8px;
  overflow: scroll;
}
.shuttleList::-webkit-scrollbar {
  width: 4px;
  height: 0;
}
.shuttleList::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: var(--primary-light-green);
}
.shuttleList::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary-green);
}
.shuttleItem {
  border-radius: 5px;
  border: 1px solid var(--primary-gray);
  box-sizing: border-box;
  height: 36px;
  line-height: 36px;
  margin-bottom: 8px;
  margin-right: 8px;
  background-color: var(--primary-light-gray);
  color: var(--text-gray);
  cursor: pointer;
}
.shuttleItem:hover {
  background-color: var(--primary-deep-gray);
  border: 1px solid var(--primary-light-green);
  color: var(--text-green);
}
.shuttleItem span {
  width: 30%;
  text-align: center;
  display: inline-block;
}
.shuttleItem span:nth-child(2) {
  width: 27%;
}
.shuttleItem span:nth-child(3) {
  width: 22%;
}
.roomstuinfo .shuttleItem span {
  width: 22%;
}
.roomstuinfo .shuttleItem span:nth-child(2) {
  width: 27%;
}
.roomstuinfo .shuttleItem span:nth-child(3) {
  width: 30%;
}
.shuttleItem button {
  float: right;
  margin-right: 6px;
  width: 50px;
  height: 24px;
  border: 0;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 5px;
  background-color: var(--primary-light-green);
  color: var(--primary-gray-black);
  font-weight: 600;
  font-size: 14px;
}
.shuttleItem button:hover {
  background-color: var(--primary-deep-green);
}
.shuttleContainer {
  width: 800px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.shuttleLeft,
.shuttleRight {
  height: 500px;
  width: 320px;
  float: left;
  border-radius: 5px;
  /* background-color: var(--primary-gray-black); */
  background-color: var(--primary-morelight-gray);
  padding-bottom: 8px;
}
.shuttleRight {
  float: right;
}
.shuttleStu {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  color: var(--text-light-green);
  font-weight: 600;
}
.shuttleStu p {
  margin: 8px;
}
.shuttleBtn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 0;
  border-radius: 5px;
  background-color: var(--primary-light-green);
  color: var(--primary-gray-black);
  cursor: pointer;
  width: 120px;
  height: 32px;
  font-weight: 700;
}
.shuttleBtn:hover {
  background-color: var(--primary-deep-green);
}
.shuttleBtn button {
  border: 0;
  border-radius: 5px;
  height: 32px;
  width: 60px;
  line-height: 34px;
  cursor: pointer;
}
.shuttleBtn button:nth-child(1) {
  margin-right: 12px;
}
.shuttleTitle {
  margin-bottom: 8px;
  position: relative;
  background-color: var(--primary-deep-gray);
  border-radius: 5px 5px 0 0;
}
/* .addshuttle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
  font-size: 14px;
  height: 24px;
  border-radius: 5px;
  border: 0;
  cursor: pointer;
  background-color: var(--primary-light-green);
  color: var(--primary-gray-black);
  font-weight: 700;
}
.addshuttle:hover {
  background-color: var(--primary-deep-green);
} */
.shuttleTitle span {
  display: block;
  text-align: center;
  height: 32px;
  line-height: 32px;
  color: var(--text-green);
  font-weight: 700;
}
.shuttleTitle input {
  width: 80px;
  height: 28px;
  margin-left: 20px;
  box-sizing: border-box;
  border-radius: 5px;
  padding-left: 5px;
  border: 1px solid var(--primary-gray);
  /* border: 1px solid var(--primary-mostlight-gray); */
  background-color: var(--primary-light-gray);
  color: var(--text-gray);
}
.shuttleTitle input:focus {
  border: 1px solid var(--primary-light-green);
  outline: 0;
}
.shuttleTitle .shuttleSearch {
  height: 28px;
  margin-left: 20px;
  width: 80px;
  border: 0;
  cursor: pointer;
  border-radius: 5px;
  background-color: var(--primary-light-green);
  color: var(--primary-gray-black);
  font-weight: 700;
}
.shuttleTitle .shuttleSearch:hover {
  background-color: var(--primary-deep-green);
}
.roomstuinfo {
  height: 330px;
  margin-left: 8px;
  overflow: scroll;
}
.roomstuinfo::-webkit-scrollbar {
  width: 4px;
  height: 0;
}
.roomstuinfo::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: var(--primary-light-green);
}
.roomstuinfo::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary-green);
}
.confirmContainer {
  background-color: var(--primary-deep-gray);
  /* color: var(--text-light-green); */
  color: var(--text-green);
  text-align: center;
  border-radius: 0 0 5px 5px;
  padding: 8px 0;
}
.confirmContainer p {
  height: 28px;
  line-height: 28px;
  margin: 0;
}
.remainContainer {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 508px;
  box-sizing: border-box;
  border-radius: 5px;
  width: calc(100% - 820px);
  /* background-color: var(--primary-gray-black); */
  background-color: var(--primary-morelight-gray);
}
.remainTitle {
  /* background-color: var(--primary-light-gray); */
  background-color: var(--primary-deep-gray);
  color: var(--text-green);
  height: 40px;
  border-radius: 5px 5px 0 0;
  padding-left: 8px;
  line-height: 40px;
  font-size: 20px;
  border-bottom: 1px solid var(--primary-gray);
  box-sizing: border-box;
}
.remainTitle input {
  margin-top: 6px;
  margin-right: 12px;
  float: right;
  width: 100px;
  height: 28px;
  box-sizing: border-box;
  border-radius: 5px;
  padding-left: 5px;
  border: 1px solid var(--primary-gray);
  /* background-color: var(--primary-deep-gray); */
  background-color: var(--primary-light-gray);
  color: var(--text-gray);
  font-size: 16px;
}
.remainTitle input:focus {
  border: 1px solid var(--primary-light-green);
  outline: 0;
}
.remainTitle button {
  margin-top: 6px;
  margin-right: 8px;
  float: right;
  width: 60px;
  height: 28px;
  border: 0;
  cursor: pointer;
  border-radius: 5px;
  background-color: var(--primary-light-green);
  color: var(--primary-gray-black);
  font-weight: 700;
  font-size: 16px;
}
.remainTitle button:hover {
  background-color: var(--primary-deep-green);
}
.remainmarkContainer {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 8px;
  padding-left: 8px;
  padding-right: 12px;
  background-color: var(--primary-deep-gray);
}
.remainmark {
  width: 100%;
  height: 32px;
  margin: 0;
  color: var(--text-light-green);
  line-height: 32px;
  box-sizing: border-box;
}
.remainmark span {
  height: 32px;
  display: inline-block;
  text-align: center;
}
.remainList {
  height: 420px;
  margin-left: 8px;
  margin-bottom: 8px;
  overflow: scroll;
}
.remainList::-webkit-scrollbar {
  width: 4px;
  height: 0;
}
.remainList::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: var(--primary-light-green);
}
.remainList::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary-green);
}
.remainList .shuttleItem span {
  display: inline-block;
  text-align: center;
  margin-left: 0;
}
</style>