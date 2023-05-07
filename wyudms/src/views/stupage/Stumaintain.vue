<template>
  <div class="leftstumt">
    <div class="leftstumtTitle">
      <span>申报维修列表</span><button @click="addstumt">申报维修</button>
    </div>
    <ul class="leftstumtList">
      <li
        class="leftstumtItem"
        v-for="i in stumtlist.list"
        :key="i"
        @click="mtclick(i.id, $event)"
      >
        <span>{{ i.type }}</span>
        <span>{{ i.content }}</span>
        <span>{{ i.time }}</span>
        <span>{{ i.status }}</span>
        <button
          @click="cancelstumt(i.id)"
          v-if="i.status == '未处理' || i.status == '处理中'"
        >
          取消
        </button>
      </li>
      <div
        v-if="stumtlist.list.length == 0"
        style="
          color: var(--text-gray);
          font-size: 30px;
          text-align: center;
          line-height: 560px;
        "
      >
        当前暂无申报维修
      </div>
    </ul>
  </div>
  <div class="rightstumt">
    <div class="mtstep">
      <div class="mtstepposition">
        <div class="mtstepcontainer">
          <div class="mtstepitem">
            <el-icon
              style="color: var(--primary-gray); font-size: 32px"
              v-if="maintainstep == -1"
              ><Remove
            /></el-icon>
            <el-icon
              style="color: var(--primary-green); font-size: 32px"
              v-if="maintainstep == 0"
              ><Clock
            /></el-icon>
            <el-icon
              style="color: var(--primary-green); font-size: 32px"
              v-if="maintainstep != 0 && maintainstep != -1"
              ><CircleCheck
            /></el-icon>
            <span v-if="maintainstep == -1">无进程</span>
            <span v-if="maintainstep == 0">未处理</span>
            <span
              v-if="maintainstep != 0 && maintainstep != -1"
              style="color: var(--text-green)"
              >已受理</span
            >
          </div>
          <div
            class="mtstepline"
            v-if="maintainstep == 0 || maintainstep == -1"
          ></div>
          <div
            class="mtstepline"
            v-if="maintainstep != 0 && maintainstep != -1"
            style="border-color: var(--primary-green)"
          ></div>

          <div class="mtstepitem">
            <el-icon
              style="color: var(--primary-gray); font-size: 32px"
              v-if="maintainstep == -1"
              ><Remove
            /></el-icon>
            <el-icon
              style="color: var(--primary-green); font-size: 32px"
              v-if="maintainstep == 0"
              ><Clock
            /></el-icon>
            <el-icon
              style="color: var(--primary-green); font-size: 32px"
              v-if="maintainstep == 1 || maintainstep == 2"
              ><CircleCheck
            /></el-icon>
            <el-icon
              style="color: red; font-size: 32px"
              v-if="maintainstep == 3"
              ><CircleClose
            /></el-icon>
            <span v-if="maintainstep == -1">无进程</span>
            <span v-if="maintainstep == 0">待处理</span>
            <span
              v-if="maintainstep == 1 || maintainstep == 2"
              style="color: var(--text-green)"
              >处理中</span
            >
            <span v-if="maintainstep == 3" style="color: red">已取消</span>
          </div>
          <div class="mtstepline" v-if="maintainstep != 2"></div>
          <div
            class="mtstepline"
            v-if="maintainstep == 2"
            style="border-color: var(--primary-green)"
          ></div>

          <div class="mtstepitem">
            <el-icon
              style="color: var(--primary-gray); font-size: 32px"
              v-if="maintainstep == -1"
              ><Remove
            /></el-icon>
            <el-icon
              style="color: var(--primary-green); font-size: 32px"
              v-if="maintainstep == 1 || maintainstep == 0"
              ><Clock
            /></el-icon>
            <el-icon
              style="color: var(--primary-green); font-size: 32px"
              v-if="maintainstep == 2"
              ><CircleCheck
            /></el-icon>
            <el-icon
              style="color: red; font-size: 32px"
              v-if="maintainstep == 3"
              ><CircleClose
            /></el-icon>
            <span v-if="maintainstep == -1">无进程</span>
            <span v-if="maintainstep == 0">待处理</span>
            <span v-if="maintainstep == 2" style="color: var(--text-green)"
              >已完成</span
            >
            <span v-if="maintainstep == 1">处理中</span>
            <span v-if="maintainstep == 3" style="color: red">已取消</span>
          </div>
        </div>
      </div>
      <div class="mtstepwordbox">
        <p class="mtstepword">
          <span>维修地址:</span>{{ maintainstepobj.building }}栋{{
            maintainstepobj.room
          }}
        </p>
        <p class="mtstepword">
          <span>维修类型:</span>{{ maintainstepobj.type }}
        </p>
        <p class="mtstepword">
          <span>发起时间:</span>{{ maintainstepobj.time }}
        </p>
        <p class="mtstepword">
          <span>预约时间:</span>{{ maintainstepobj.appoint }}
        </p>
        <p class="mtstepword">
          <span>维修人员:</span>{{ maintainstepobj.mtman }}
        </p>
        <p class="mtstepword">
          <span>维修电话:</span>{{ maintainstepobj.mtphone }}
        </p>
      </div>
      <div class="mtdestext">
        <span>维修描述:</span>
        <textarea v-model="maintainstepobj.content"></textarea>
        <div class="stumtnoimg" v-if="maintainstepobj.img.length == 0">
          无图片
        </div>
        <el-image
          v-if="maintainstepobj.img.length != 0"
          class="stumtimg"
          :src="maintainstepobj.img[0]"
          :zoom-rate="1.2"
          :preview-src-list="maintainstepobj.img"
          :initial-index="0"
          fit="cover"
          :preview-teleported="true"
        />
      </div>
      <div class="mtmsgtext">
        <span>维修回复:</span>
        <textarea readonly v-model="maintainstepobj.mtcontent"></textarea>
      </div>
      <div class="mtstepbtn">
        <button
          v-if="maintainstep == 0 || maintainstep == 1"
          @click="cancelmaintainstep"
        >
          维修取消
        </button>
        <button v-if="maintainstep == 1" @click="finishmaintainstep">
          维修完成
        </button>
      </div>
    </div>
  </div>
  <Stuformmaintain></Stuformmaintain>
  <Dmsconfirm
    style="z-index: 99"
    v-model:handleId="deleteid"
    :confirmStr="deletestr"
    @settable="setstumtlist"
    :handleType="deletetype"
    :handleMessage="deletemessage"
  ></Dmsconfirm>
</template>

<script>
import Dmsconfirm from "@/components/Dmsconfirm.vue";
import Stuformmaintain from "@/components/Stuformmaintain.vue";
import { getmaintainbyid, getstumaintainlist } from "@/api/maintain";
import {
  Clock,
  CircleCheck,
  CircleClose,
  Remove,
} from "@element-plus/icons-vue";
import { onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
export default {
  name: "stumaintain",
  components: {
    Clock,
    CircleCheck,
    CircleClose,
    Remove,
    Stuformmaintain,
    Dmsconfirm,
  },
  setup() {
    const store = useStore();
    const stumtlist = reactive({
      list: [
        {
          id: 0,
          time: "xxxx-xx-xx xx:xx",
          type: "none",
          content: "none",
          status: "none",
        },
      ],
    });

    const addstumt = () => {
      store.commit("dsmaintain/setStumtFormStatus");
    };

    const deleteid = ref(0);
    const deletestr = ref("确定要取消该维修吗？");
    const deletetype = ref(17);
    const deletemessage = ref("");
    const cancelstumt = (deletemtid) => {
      console.log(deletemtid);
      deleteid.value = deletemtid;
      deletestr.value = "确定要取消该维修吗？";
      deletetype.value = 17;
    };

    const maintainstep = ref(-1);
    const maintainstepobj = reactive({
      id: 0,
      content: "暂无维修单",
      mtcontent: "暂无维修单",
      type: "无",
      building: "--",
      room: "---",
      time: "暂无维修单",
      appoint: "暂无维修单",
      mtman: "-",
      mtphone: "-",
      img: [],
    });

    const mtclick = (mtid, e) => {
      console.log(mtid);
      document.querySelectorAll(".leftstumtItem").forEach((item) => {
        item.classList.remove("activemtitem");
      });
      if (e.target.parentNode.classList.contains("leftstumtItem")) {
        e.target.parentNode.classList.add("activemtitem");
      } else if (e.target.classList.contains("leftstumtItem")) {
        e.target.classList.add("activemtitem");
      }
      getmaintainbyid({ id: mtid })
        .then((res) => {
          if (res.status == 0) {
            console.log(res.maintaininfo);
            maintainstep.value = res.maintaininfo[0].status;
            maintainstepobj.id = res.maintaininfo[0].id;
            maintainstepobj.content = res.maintaininfo[0].content;
            maintainstepobj.appoint = res.maintaininfo[0].appoint;
            maintainstepobj.time = res.maintaininfo[0].time;
            maintainstepobj.building = res.maintaininfo[0].building;
            maintainstepobj.room = res.maintaininfo[0].room;
            maintainstepobj.type = res.maintaininfo[0].type;
            if (!res.maintaininfo[0].mtcontent) {
              maintainstepobj.mtcontent = "暂无回复";
            } else {
              maintainstepobj.mtcontent = res.maintaininfo[0].mtcontent;
            }
            if (!res.maintaininfo[0].mtman) {
              maintainstepobj.mtman = "-";
            } else {
              maintainstepobj.mtman = res.maintaininfo[0].mtman;
            }
            if (!res.maintaininfo[0].mtphone) {
              maintainstepobj.mtphone = "-";
            } else {
              maintainstepobj.mtphone = res.maintaininfo[0].mtphone;
            }
            if (!res.maintaininfo[0].img) {
              maintainstepobj.img = [];
            } else {
              maintainstepobj.img = res.maintaininfo[0].img.split(" ");
            }
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    const cancelmaintainstep = () => {
      deleteid.value = maintainstepobj.id;
      deletestr.value = "确定要取消该维修吗？";
      deletetype.value = 17;
    };
    const finishmaintainstep = () => {
      deleteid.value = maintainstepobj.id;
      deletestr.value = "确定该维修已完成吗？";
      deletetype.value = 19;
      deletemessage.value = maintainstepobj.content;
    };

    const setstumtlist = () => {
      getstumaintainlist({ stuid: store.state.dsuser.dsuserInfo.id })
        .then((res) => {
          if (res.status == 0) {
            if (res.maintainlist.length == 0) {
              stumtlist.list = [];
            } else {
              res.maintainlist.forEach((item) => {
                if (item.content.length > 4) {
                  item.content = item.content.substring(0, 4) + "...";
                }
                if (item.status == 0) {
                  item.status = "未处理";
                } else if (item.status == 1) {
                  item.status = "处理中";
                } else if (item.status == 2) {
                  item.status = "已完成";
                } else if (item.status == 3) {
                  item.status = "已取消";
                }
              });
              stumtlist.list = res.maintainlist;
              // 手动触发点击第一个
              setTimeout(() => {
                document.querySelector(".leftstumtItem").click();
              }, 300);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    onMounted(() => {
      setstumtlist();
      watch(
        () => store.state.dsmaintain.stumtliststatus,
        () => {
          setstumtlist();
        }
      );
    });

    return {
      stumtlist,
      addstumt,
      cancelstumt,
      setstumtlist,
      deleteid,
      deletestr,
      deletetype,
      mtclick,
      maintainstep,
      maintainstepobj,
      cancelmaintainstep,
      finishmaintainstep,
    };
  },
};
</script>

<style>
.stumtimg {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  border: 2px solid var(--primary-gray);
  background-repeat: no-repeat;
  background-size: cover;
  margin-left: 20px;
  margin-top: 12px;
  box-sizing: border-box;
  display: inline-block;
}
.stumtnoimg {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  border: 2px solid var(--primary-mostlight-gray);
  box-sizing: border-box;
  text-align: center;
  line-height: 96px;
  color: var(--text-gray);
  display: inline-block;
  margin-left: 20px;
  margin-top: 12px;
}
.rightstumt {
  display: inline-block;
  margin-top: 30px;
  width: calc(100% - 680px);
  background-color: var(--primary-deep-gray);
  height: 608px;
  border-radius: 10px;
  box-shadow: 0px 0px 4px 4px var(--shadow);
}
.mtstep {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 12px;
}
.mtdestext textarea::-webkit-scrollbar,
.mtmsgtext textarea::-webkit-scrollbar {
  width: 6px;
  height: 0;
}
.mtdestext textarea::-webkit-scrollbar-thumb,
.mtmsgtext textarea::-webkit-scrollbar-thumb {
  border-radius: 3px;
  /* background-color: var(--primary-morelight-gray); */
  background-color: var(--primary-mostlight-gray);
}
.mtdestext textarea::-webkit-scrollbar-thumb:hover,
.mtmsgtext textarea::-webkit-scrollbar-thumb:hover {
  /* background-color: var(--primary-mostlight-gray); */
  background-color: var(--primary-gray);
}
.mtdestext textarea,
.mtmsgtext textarea {
  width: 100%;
  height: 100px;
  resize: none;
  border-radius: 5px;
  background-color: var(--primary-light-gray);
  padding: 10px;
  padding-top: 6px;
  color: var(--text-gray);
  vertical-align: top;
  font-size: 14px;
  margin-top: 12px;
  box-sizing: border-box;
}
.mtdestext textarea:focus,
.mtmsgtext textarea:focus {
  outline: 0;
  border-color: var(--primary-light-green);
}
.mtdestext textarea {
  width: calc(100% - 120px);
  display: inline-block;
}
.mtdestext span,
.mtmsgtext span {
  color: var(--text-green);
  font-size: 16px;
  display: block;
}
.mtdestext {
  box-sizing: border-box;
  width: 84%;
  position: absolute;
  left: 50%;
  top: 270px;
  transform: translateX(-50%);
}
.mtmsgtext {
  box-sizing: border-box;
  width: 84%;
  position: absolute;
  left: 50%;
  top: 410px;
  transform: translateX(-50%);
}
.mtstepbtn {
  width: 100%;
  position: absolute;
  left: 50%;
  bottom: 12px;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
  padding: 0 50px;
  box-sizing: border-box;
}
.mtstepbtn button {
  width: 120px;
  height: 32px;
  border-radius: 5px;
  border: 0;
  background-color: var(--primary-light-green);
  color: var(--text-gray-black);
  font-weight: 700;
  cursor: pointer;
}
.mtstepbtn button:hover {
  background-color: var(--primary-deep-green);
}
.mtstepposition {
  width: 100%;
  height: 100px;
  position: relative;
}
.mtstepcontainer {
  width: 84%;
  box-sizing: border-box;
  position: absolute;
  left: calc(50% + 3px);
  top: 20px;
  transform: translateX(-50%);
}
.mtstepitem {
  display: inline-block;
  position: relative;
  margin-left: -3px;
}
.mtstepitem span {
  position: absolute;
  left: 50%;
  top: 40px;
  transform: translateX(-50%);
  width: 50px;
  color: var(--text-gray);
}
.mtstepline {
  display: inline-block;
  box-sizing: border-box;
  border-bottom: 2px solid var(--primary-gray);
  width: calc((100% - 84px) / 2);
  margin-bottom: 16px;
  margin-left: -3px;
}
.mtstepwordbox {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 84%;
}
.mtstepword {
  color: var(--text-green);
  font-size: 16px;
  width: 100%;
  margin: 8px 0;
}
.mtstepword span {
  color: var(--text-gray);
  margin-right: 12px;
}
.activemtitem {
  background-color: var(--primary-deep-gray) !important;
  border: 1px solid var(--primary-light-green) !important;
  color: var(--text-green) !important;
}
.leftstumtList {
  height: 560px;
  margin-left: 8px;
  overflow: scroll;
}
.leftstumtList::-webkit-scrollbar {
  width: 4px;
  height: 0;
}
.leftstumtList::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: var(--primary-light-green);
}
.leftstumtList::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary-green);
}
.leftstumtItem {
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
.leftstumtItem:hover {
  background-color: var(--primary-deep-gray);
  border: 1px solid var(--primary-light-green);
  color: var(--text-green);
}
.leftstumtItem span {
  width: 20%;
  text-align: center;
  display: inline-block;
}
.leftstumtItem span:nth-child(2) {
  width: 20%;
}
.leftstumtItem span:nth-child(3) {
  width: 30%;
}
.leftstumtItem button {
  float: right;
  margin-right: 6px;
  width: 50px;
  height: 24px;
  border: 0;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 5px;
  background-color: #f56c6c;
  color: var(--primary-gray-black);
  font-weight: 600;
  font-size: 14px;
}
.leftstumtItem button:hover {
  background-color: #fb4e4e;
}
.leftstumt {
  height: 600px;
  width: 640px;
  float: left;
  border-radius: 5px;
  /* background-color: var(--primary-gray-black); */
  background-color: var(--primary-morelight-gray);
  padding-bottom: 8px;
  margin-top: 30px;
  margin-left: 12px;
  margin-right: 20px;
  box-shadow: 0px 0px 4px 4px var(--shadow);
}
.leftstumtTitle {
  margin-bottom: 8px;
  position: relative;
  background-color: var(--primary-deep-gray);
  border-radius: 5px 5px 0 0;
  text-align: center;
  line-height: 32px;
  color: var(--text-green);
  font-weight: 700;
  width: 100%;
  height: 32px;
}
.leftstumtTitle button {
  position: absolute;
  right: 6px;
  top: 4px;
  width: 80px;
  height: 24px;
  border: 0;
  cursor: pointer;
  border-radius: 5px;
  /* margin-top: 5px; */
  background-color: var(--primary-light-green);
  color: var(--primary-gray-black);
  font-weight: 600;
  font-size: 14px;
}
.leftstumtTitle button:hover {
  background-color: var(--primary-deep-green);
}
</style>