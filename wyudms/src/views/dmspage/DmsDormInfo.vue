<template>
  <div style="width: 100%; height: 100%; position: relative">
    <el-carousel
      arrow="always"
      :autoplay="false"
      indicator-position="none"
      height="610px"
      ref="carouselMap"
      @change="changedorm"
    >
      <el-carousel-item
        v-for="buildingitem in buildinglist.list"
        :key="buildingitem"
        :name="buildingitem.building"
      >
        <div class="building">
          <div class="buildinghead">
            {{ buildingitem.building + "栋" }}
            <button class="infobtn" @click="detailshow">详细信息</button>
          </div>
          <div class="buildingdetail">
            <p class="buildingdetailitem">
              <span>楼栋名称:</span>
              {{ buildingitem.buildingname }}
            </p>
            <p class="buildingdetailitem">
              <span>房间总数:</span>
              {{ buildingitem.totalroom }}
            </p>
            <p class="buildingdetailitem">
              <span>学生总数:</span>
              {{ buildingitem.totalstu }}
            </p>
            <p class="buildingdetailitem">
              <span>舍管人员:</span>
              {{ buildingitem.personnelname }}
            </p>
            <p class="buildingdetailitem">
              <span>舍管电话:</span>
              {{ buildingitem.personnelphone }}
            </p>
            <p class="buildingdetailitem">
              <span>包含班级:</span>
              {{ buildingitem.buildingclass }}
            </p>
            <p class="buildingdetailitem">
              <span>包含专业:</span>
              {{ buildingitem.buildingmajor }}
            </p>
            <el-icon
              @click="detailhide"
              style="
                position: absolute;
                left: 50%;
                bottom: 4px;
                transform: translateX(-50%);
                color: var(--primary-green);
                font-size: 24px;
                cursor: pointer;
              "
              ><ArrowUpBold
            /></el-icon>
          </div>
          <ul class="buildingleft">
            <li class="leftnum" title="清空标识">标识</li>
            <li class="leftnum" v-for="i in 13" :key="i">{{ i }}</li>
          </ul>
          <div class="buildContainer">
            <ul class="buildingtop" style="width: 1632px">
              <li class="topnum" v-for="i in 24" :key="i">{{ i }}</li>
            </ul>
            <div class="roomContainer" style="width: 1640px">
              <!-- <div class="floor" v-for="i in 13" :key="i">
                <div class="room" v-for="i in 15" :key="i">201</div>
              </div> -->
              <div
                class="floor"
                v-for="flooritem in roomlist[buildingitem.building].room"
                :key="flooritem"
              >
                <div
                  :class="roomitem.roomclass"
                  v-for="roomitem in flooritem"
                  :key="roomitem"
                  @click="getroomstu(buildingitem.building, roomitem.roomname)"
                >
                  {{ roomitem.roomname }}
                </div>
                <!-- <div class="room room3">201</div>
                <div class="room room2">201</div>
                <div class="room room1">201</div>
                <div class="room room0">201</div> -->
              </div>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div
      style="
        position: absolute;
        left: 50%;
        top: 630px;
        transform: translateX(-50%);
        width: 1000px;
      "
    >
      <div class="roommark">
        <div class="room4" style="width: 100px; cursor: auto">房间人数</div>
        <div class="room4" style="cursor: auto">4</div>
        <div class="room3" style="cursor: auto">3</div>
        <div class="room2" style="cursor: auto">2</div>
        <div class="room1" style="cursor: auto">1</div>
        <div class="room0" style="cursor: auto">0</div>
      </div>
      <div class="jump">
        <input
          v-model="jumpNum"
          class="jumpnum"
          type="text"
          placeholder="跳转到（输入两位数字）"
        />
        <button class="jumpbtn" @click="jumpfun">跳转</button>
      </div>
    </div>
  </div>
  <Dmsdormroom></Dmsdormroom>
</template>

<script>
import { ArrowUpBold } from "@element-plus/icons-vue";
import { getbuildinglist, getroomlist, getroomstuinfo } from "@/api/dorm";
import { getPersonnelName } from "@/api/personnel";
import { onActivated, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import Dmsdormroom from "@/components/Dmsdormroom.vue";
export default {
  name: "dmsdorminfo",
  components: {
    Dmsdormroom,
    ArrowUpBold,
  },
  setup() {
    const store = useStore();
    const carouselMap = ref(null);
    const jumpNum = ref(40);
    const jumpfun = () => {
      carouselMap.value.setActiveItem(jumpNum.value);
    };

    const changedorm = (activeindex, oldindex) => {
      let doms = document.querySelectorAll(".buildingdetail");
      let domsarr = [...doms];
      domsarr.forEach((item) => {
        if (item.style.height == "320px") {
          item.classList.add("buildingdetailhide");
          setTimeout(() => {
            item.classList.remove("buildingdetailhide");
            item.style.height = "0";
          }, 300);
        }
      });
      console.log(activeindex, oldindex);
      store.commit("dsdorm/setActiveBuilding", activeindex);
      getroom(
        buildinglist.list[activeindex],
        roomlist[buildinglist.list[activeindex].building].getflag
      );
    };

    let buildinglist = reactive({
      list: [
        {
          building: "40",
          buildingname: "某某楼",
          buildingclass: "190701",
          buildingmajor: "计科",
          totalstu: 0,
          totalroom: 0,
          personnelname: "某某",
          personnelphone: "00000000000",
        },
      ],
    });
    let roomlist = reactive({
      40: {
        room: {},
      },
      41: {
        room: {},
      },
      42: {
        room: {},
      },
      43: {
        room: {},
      },
      44: {
        room: {},
      },
      45: {
        room: {},
      },
    });
    const getroom = (building, flag) => {
      if (flag == true) {
        console.log("已获取过宿舍数据");
      } else {
        store.commit("setNoticeContent", "获取宿舍信息中");
        roomlist[building.building] = {};
        roomlist[building.building].room = {};
        getroomlist({ building: building.building })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              // console.log(res.roomlist);
              let totalroom = res.roomlist.length;
              res.roomlist.forEach((item) => {
                roomlist[building.building].room[item.floor] = {};
              });
              res.roomlist.forEach((item) => {
                roomlist[building.building].room[item.floor][item.room] = {};
              });
              let totalstu = 0;

              res.roomlist.forEach((item) => {
                roomlist[building.building].room[item.floor][
                  item.room
                ].stucount = item.stucount;
                totalstu += parseInt(item.stucount);
                roomlist[building.building].room[item.floor][
                  item.room
                ].roomname = item.room;
                roomlist[building.building].room[item.floor][
                  item.room
                ].roomclass = "room" + item.stucount;
              });
              building.totalstu = totalstu;
              building.totalroom = totalroom;
              roomlist[building.building].getflag = true;
              // console.log(roomlist["40"]);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
        getPersonnelName({ pbuilding: building.building })
          .then((res) => {
            if (res.status == 0) {
              console.log(res.personnelname);
              let personnelname = "";
              let personnelphone = "";
              res.personnelname.forEach((item) => {
                personnelname += item.pname + "，";
                personnelphone += item.phone + "，";
              });
              personnelname = personnelname.substring(
                0,
                personnelname.length - 1
              );
              personnelphone = personnelphone.substring(
                0,
                personnelphone.length - 1
              );
              building.personnelname = personnelname;
              building.personnelphone = personnelphone;
            } else {
              console.log(res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
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
            store.commit("dsdorm/setDormRoomStatus");
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    const detailshow = () => {
      let doms = document.querySelectorAll(".buildingdetail");
      let domsarr = [...doms];
      domsarr.forEach((item) => {
        if (item.style.height == "320px") {
          item.classList.add("buildingdetailhide");
          setTimeout(() => {
            item.classList.remove("buildingdetailhide");
            item.style.height = "0";
          }, 300);
        } else {
          item.classList.add("buildingdetailshow");
          setTimeout(() => {
            item.classList.remove("buildingdetailshow");
            item.style.height = "320px";
          }, 300);
        }
      });
    };
    const detailhide = () => {
      let doms = document.querySelectorAll(".buildingdetail");
      let domsarr = [...doms];
      domsarr.forEach((item) => {
        item.classList.add("buildingdetailhide");
        setTimeout(() => {
          item.classList.remove("buildingdetailhide");
          item.style.height = "0";
        }, 300);
      });
    };
    onMounted(() => {
      store.commit("setNoticeContent", "获取宿舍列表中");
      getbuildinglist()
        .then((res) => {
          if (res.status == 0) {
            store.commit("setNoticeContent", res.message);
            // console.log(res.buildinglist);
            buildinglist.list = res.buildinglist;
            getroom(
              buildinglist.list[0],
              roomlist[buildinglist.list[0].building].getflag
            );
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    });

    onActivated(() => {
      carouselMap.value.setActiveItem(store.state.dsdorm.activebuilding);
    });

    return {
      jumpfun,
      carouselMap,
      jumpNum,
      changedorm,
      buildinglist,
      roomlist,
      getroomstu,
      detailshow,
      detailhide,
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
.building {
  height: 610px;
  width: 1000px;
  /* background-color: var(--primary-gray-black); */
  background-color: var(--primary-morelight-gray);
  border-radius: 10px;
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.buildingdetail {
  position: absolute;
  left: 50%;
  top: 40px;
  transform: translateX(-50%);
  width: 700px;
  height: 0px;
  border-radius: 0 0 10px 10px;
  background-color: var(--primary-light-gray);
  overflow: hidden;
  box-sizing: border-box;
}
.buildingdetailshow {
  animation: 0.3s linear detailshow;
  animation-fill-mode: forwards;
}
.buildingdetailhide {
  animation: 0.3s linear detailhide;
  animation-fill-mode: forwards;
}
@keyframes detailshow {
  from {
    height: 0;
  }
  100% {
    height: 320px;
  }
}
@keyframes detailhide {
  from {
    height: 320px;
  }
  100% {
    height: 0;
  }
}
.buildingdetailitem {
  margin: 0;
  margin-left: 12px;
  margin-right: 12px;
  margin-top: 8px;
  color: var(--text-green);
}
.buildingdetailitem span {
  color: var(--text-gray);
}
.buildinghead {
  position: relative;
  /* background-color: var(--primary-light-gray); */
  background-color: var(--primary-deep-gray);
  border-radius: 10px 10px 0 0;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-green);
  box-sizing: border-box;
  border-bottom: 2px solid var(--primary-mostlight-gray);
}
.infobtn {
  position: absolute;
  right: 10px;
  bottom: 6px;
  background-color: var(--primary-light-green);
  color: var(--text-gray-black);
  height: 28px;
  width: 80px;
  font-size: 14px;
  border-radius: 5px;
  border: 0;
  font-weight: 700;
  cursor: pointer;
}
.infobtn:hover {
  background-color: var(--primary-deep-green);
}
.buildingleft {
  width: 40px;
  height: 570px;
  float: left;
  box-sizing: border-box;
  /* background-color: var(--primary-deep-gray); */
  background-color: var(--primary-deep-gray);
  border-radius: 0 0 0 10px;
  color: var(--text-green);
  border-right: 2px solid var(--primary-morelight-gray);
}
.leftnum {
  width: 38px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  margin-bottom: 8px;
  display: inline-block;
  box-sizing: border-box;
  /* cursor: pointer; */
}
.leftnum:hover {
  /* background-color: var(--primary-gray-black); */
  background-color: var(--primary-mostlight-gray);
  color: var(--text-light-green);
}
.buildContainer {
  float: right;
  box-sizing: border-box;
  height: 570px;
  width: calc(100% - 40px);
  overflow: scroll;
}
.buildContainer::-webkit-scrollbar {
  width: 0;
  height: 8px;
}
.buildContainer::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: var(--primary-light-green);
}
.buildContainer::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary-green);
}
.buildingtop {
  width: 570px;
  height: 32px;
  margin-bottom: 8px;
  padding-left: 8px;
  /* background-color: var(--primary-deep-gray); */
  background-color: var(--primary-deep-gray);
  color: var(--text-green);
}
.topnum {
  width: 60px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  margin-right: 8px;
  display: inline-block;
  /* cursor: pointer; */
}
.topnum:hover {
  /* background-color: var(--primary-gray-black); */
  background-color: var(--primary-mostlight-gray);
  color: var(--text-light-green);
}
.roomContainer {
  height: 514px;
  width: 570px;
  padding-left: 8px;
  box-sizing: border-box;
}
.floor {
  height: 32px;
  margin-bottom: 8px;
}
.room4 {
  height: 32px;
  width: 60px;
  background-color: var(--room-four);
  /* color: var(--text-deep-gray); */
  color: var(--text-room);
  text-align: center;
  border-radius: 5px;
  line-height: 32px;
  margin-right: 8px;
  display: inline-block;
  cursor: pointer;
  font-weight: 700;
  user-select: none;
}
.room3 {
  background-color: var(--room-three);
  /* color: var(--text-gray-black); */
  height: 32px;
  width: 60px;
  color: var(--text-room);
  text-align: center;
  border-radius: 5px;
  line-height: 32px;
  margin-right: 8px;
  display: inline-block;
  cursor: pointer;
  font-weight: 700;
  user-select: none;
}
.room2 {
  background-color: var(--room-two);
  /* color: var(--text-light-green); */
  height: 32px;
  width: 60px;
  color: var(--text-room);
  text-align: center;
  border-radius: 5px;
  line-height: 32px;
  margin-right: 8px;
  display: inline-block;
  cursor: pointer;
  font-weight: 700;
  user-select: none;
}
.room1 {
  background-color: var(--room-one);
  /* color: var(--text-green); */
  height: 32px;
  width: 60px;
  color: var(--text-room);
  text-align: center;
  border-radius: 5px;
  line-height: 32px;
  margin-right: 8px;
  display: inline-block;
  cursor: pointer;
  font-weight: 700;
  user-select: none;
}
.room0 {
  background-color: var(--room-zero);
  /* color: var(--text-green); */
  height: 32px;
  width: 60px;
  color: var(--text-room);
  text-align: center;
  border-radius: 5px;
  line-height: 32px;
  margin-right: 8px;
  display: inline-block;
  cursor: pointer;
  font-weight: 700;
  user-select: none;
}
.jump {
  float: right;
}
.jumpnum {
  box-sizing: border-box;
  height: 32px;
  border-radius: 5px 0 0 5px;
  border: 1px solid var(--primary-mostlight-gray);
  border-right: 0;
  background-color: var(--primary-deep-gray);
  margin-top: 2px;
  padding-left: 5px;
  color: var(--text-gray);
}
.jumpnum:focus {
  border: 1px solid var(--primary-light-green);
  border-right: 0;
  outline: 0;
}
.jumpbtn {
  background-color: var(--primary-light-green);
  color: var(--text-gray-black);
  border-radius: 0 5px 5px 0;
  height: 32px;
  width: 60px;
  border: 0;
  font-weight: 700;
  cursor: pointer;
}
.jumpbtn:hover {
  background-color: var(--primary-deep-green);
}
.roommark {
  float: left;
  margin-right: 40px;
}
.el-carousel__arrow {
  background-color: var(--primary-morelight-gray);
  color: var(--primary-green);
}
.el-carousel__arrow:hover {
  background-color: var(--primary-deep-gray);
  color: var(--primary-green);
}
</style>