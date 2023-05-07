<template>
  <div class="sdstep">
    <div class="stepposition">
      <div class="stepcontainer">
        <div class="stepitem">
          <el-icon
            style="color: var(--primary-gray); font-size: 32px"
            v-if="adjuststep == -1"
            ><Remove
          /></el-icon>
          <el-icon
            style="color: var(--primary-green); font-size: 32px"
            v-if="adjuststep == 1"
            ><Clock
          /></el-icon>
          <el-icon
            style="color: var(--primary-green); font-size: 32px"
            v-if="adjuststep != 1 && adjuststep != -1"
            ><CircleCheck
          /></el-icon>
          <span v-if="adjuststep == -1">无进程</span>
          <span v-if="adjuststep == 1">未处理</span>
          <span
            v-if="adjuststep != 1 && adjuststep != -1"
            style="color: var(--text-green)"
            >已通过</span
          >
        </div>
        <div
          class="stepline"
          v-if="adjuststep == 1 || adjuststep == 0 || adjuststep == -1"
        ></div>
        <div
          class="stepline"
          v-if="adjuststep != 1 && adjuststep != 0 && adjuststep != -1"
          style="border-color: var(--primary-green)"
        ></div>

        <div class="stepitem">
          <el-icon
            style="color: var(--primary-gray); font-size: 32px"
            v-if="adjuststep == -1"
            ><Remove
          /></el-icon>
          <el-icon
            style="color: var(--primary-green); font-size: 32px"
            v-if="adjuststep == 1 || adjuststep == 0"
            ><Clock
          /></el-icon>
          <el-icon
            style="color: var(--primary-green); font-size: 32px"
            v-if="adjuststep == 2 || adjuststep == 4 || adjuststep == 5"
            ><CircleCheck
          /></el-icon>
          <el-icon style="color: red; font-size: 32px" v-if="adjuststep == 3"
            ><CircleClose
          /></el-icon>
          <span v-if="adjuststep == -1">无进程</span>
          <span v-if="adjuststep == 1 || adjuststep == 0">待处理</span>
          <span
            v-if="adjuststep == 2 || adjuststep == 4 || adjuststep == 5"
            style="color: var(--text-green)"
            >调宿中</span
          >
          <span v-if="adjuststep == 3" style="color: red">未通过</span>
        </div>
        <div class="stepline" v-if="adjuststep != 4 && adjuststep != 5"></div>
        <div
          class="stepline"
          v-if="adjuststep == 5 || adjuststep == 4"
          style="border-color: var(--primary-green)"
        ></div>

        <div class="stepitem">
          <el-icon
            style="color: var(--primary-gray); font-size: 32px"
            v-if="adjuststep == -1"
            ><Remove
          /></el-icon>
          <el-icon
            style="color: var(--primary-green); font-size: 32px"
            v-if="adjuststep == 1 || adjuststep == 2 || adjuststep == 0"
            ><Clock
          /></el-icon>
          <el-icon
            style="color: var(--primary-green); font-size: 32px"
            v-if="adjuststep == 5"
            ><CircleCheck
          /></el-icon>
          <el-icon
            style="color: red; font-size: 32px"
            v-if="adjuststep == 4 || adjuststep == 3"
            ><CircleClose
          /></el-icon>
          <span v-if="adjuststep == -1">无进程</span>
          <span v-if="adjuststep == 1 || adjuststep == 0">待处理</span>
          <span v-if="adjuststep == 5" style="color: var(--text-green)"
            >已完成</span
          >
          <span v-if="adjuststep == 4" style="color: red">已取消</span>
          <span v-if="adjuststep == 3" style="color: red">未通过</span>
          <span v-if="adjuststep == 2">调宿中</span>
        </div>
      </div>
      <p class="stepword" v-if="adjuststep == -1">
        当前未申请调宿，仅当需要调宿时再填写下方调宿原因
      </p>
      <p class="stepword" v-if="adjuststep == 1">
        当前已申请调宿，请等待申请通过
      </p>
      <p class="stepword" v-if="adjuststep == 0">当前调宿已通过，请等待通知</p>
      <p class="stepword" v-if="adjuststep == 2">
        当前调宿已开始，请调宿至{{ adjuststepobj.adjustbuilding }}栋{{
          adjuststepobj.adjustroom
        }}房{{ adjuststepobj.adjustbed }}床
      </p>
      <p class="stepword" v-if="adjuststep == 3">当前调宿未通过</p>
      <p class="stepword" v-if="adjuststep == 4">当前调宿已取消</p>
      <p class="stepword" v-if="adjuststep == 5">当前调宿已完成</p>
    </div>
    <div class="stureasontext">
      <span>调宿原因:</span>
      <textarea v-model="adjuststepobj.reason"></textarea>
    </div>
    <div class="stuadjusttext">
      <span>调宿批复:</span>
      <textarea readonly v-model="adjuststepobj.adjustmessage"></textarea>
    </div>
    <div class="adjuststepbtn">
      <button
        v-if="adjuststep == 3 || adjuststep == 4 || adjuststep == 5"
        @click="confirmadjuststep"
      >
        确定
      </button>
      <button v-if="adjuststep == -1" @click="sendadjuststep">申请调宿</button>
      <button v-if="adjuststep == 2" @click="canceladjuststep">取消调宿</button>
      <button v-if="adjuststep == 2" @click="finishadjuststep">完成调宿</button>
    </div>
  </div>
  <Dmsconfirm
    style="z-index: 99"
    v-model:handleId="deleteid"
    :confirmStr="deletestr"
    @settable="updatestep"
    @settable2="refreshstuinfo"
    :handleType="deletetype"
    :handleMessage="deletemessage"
  ></Dmsconfirm>
</template>

<script>
import {
  Clock,
  CircleCheck,
  CircleClose,
  Remove,
} from "@element-plus/icons-vue";
import { getadjuststatus, confirmstep } from "@/api/dorm";
import { onActivated, onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
export default {
  name: "dmsstep",
  components: {
    Clock,
    CircleCheck,
    CircleClose,
    Remove,
  },
  setup() {
    const store = useStore();
    const adjuststep = ref(1);
    const adjuststepobj = reactive({
      id: 0,
      reason: "",
      adjustbuilding: "",
      adjustroom: "",
      adjustbed: "",
      adjustmessage: "",
    });

    const updatestep = () => {
      getadjuststatus({ stuid: store.state.dsuser.dsuserInfo.id })
        .then((res) => {
          if (res.status == 0) {
            console.log("update");
            if (res.adjustdetail.length == 0) {
              adjuststep.value = -1;
              adjuststepobj.id = 0;
              adjuststepobj.reason = "";
              adjuststepobj.adjustbuilding = "";
              adjuststepobj.adjustroom = "";
              adjuststepobj.adjustbed = "";
              adjuststepobj.adjustmessage = "";
            } else {
              adjuststep.value = res.adjustdetail[0].status;
              adjuststepobj.id = res.adjustdetail[0].id;
              adjuststepobj.reason = res.adjustdetail[0].reason;
              adjuststepobj.adjustbuilding = res.adjustdetail[0].adjustbuilding;
              adjuststepobj.adjustroom = res.adjustdetail[0].adjustroom;
              adjuststepobj.adjustbed = res.adjustdetail[0].adjustbed;
              adjuststepobj.adjustmessage = res.adjustdetail[0].adjustmessage;
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    const confirmadjuststep = () => {
      // 发送请求将isconfirm改为1然后刷新调宿单
      confirmstep({ stuid: store.state.dsuser.dsuserInfo.id })
        .then((res) => {
          if (res.status == 0) {
            updatestep();
            store.commit("setNoticeContent", res.message);
          } else {
            store.commit("setNoticeContent", res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    const deleteid = ref(0);
    const deletestr = ref("确认要发起调宿申请吗？");
    const deletetype = ref(15);
    const deletemessage = ref("");
    const sendadjuststep = () => {
      if (adjuststepobj.reason.trim() == "") {
        store.commit("setNoticeContent", "申请原因不能为空");
      } else {
        deleteid.value = 1;
        deletestr.value = "确认要发起调宿申请吗？";
        deletetype.value = 15;
        deletemessage.value = adjuststepobj.reason.trim();
      }
    };
    const canceladjuststep = () => {
      deleteid.value = adjuststepobj.id;
      deletestr.value = "确认要中断调宿吗？";
      deletetype.value = 16;
      deletemessage.value = adjuststepobj.reason.trim() + "(学生自行取消调宿)";
    };
    const finishadjuststep = () => {
      deleteid.value = adjuststepobj.id;
      deletestr.value = "确认已完成调宿吗？";
      deletetype.value = 11;
      deletemessage.value = adjuststepobj.adjustmessage + "(学生已完成调宿)";
    };
    const refreshstuinfo = () => {
      updatestep();
      store.commit("dsdorm/setStuInfoStatus");
    };

    onMounted(() => {
      updatestep();
      watch(
        () => store.state.dsdorm.stepstatus,
        () => {
          updatestep();
        }
      );
    });

    onActivated(() => {
      updatestep();
    });

    return {
      adjuststep,
      updatestep,
      adjuststepobj,
      confirmadjuststep,
      sendadjuststep,
      canceladjuststep,
      finishadjuststep,
      deleteid,
      deletestr,
      deletetype,
      deletemessage,
      refreshstuinfo,
    };
  },
};
</script>

<style>
.sdstep {
  width: calc(100% - 790px);
  height: 650px;
  position: relative;
  /* right: 0;
  top: 50%;
  transform: translateY(-50%); */
  background-color: var(--primary-deep-gray);
  border-radius: 10px;
  display: inline-block;
  margin-left: 20px;
  margin-top: 20px;
  box-shadow: 0px 0px 4px 4px var(--shadow);
}
.stureasontext textarea::-webkit-scrollbar,
.stuadjusttext textarea::-webkit-scrollbar {
  width: 6px;
  height: 0;
}
.stureasontext textarea::-webkit-scrollbar-thumb,
.stuadjusttext textarea::-webkit-scrollbar-thumb {
  border-radius: 3px;
  /* background-color: var(--primary-morelight-gray); */
  background-color: var(--primary-mostlight-gray);
}
.stureasontext textarea::-webkit-scrollbar-thumb:hover,
.stuadjusttext textarea::-webkit-scrollbar-thumb:hover {
  /* background-color: var(--primary-mostlight-gray); */
  background-color: var(--primary-gray);
}
.stureasontext textarea,
.stuadjusttext textarea {
  width: 100%;
  height: 160px;
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
.stureasontext textarea:focus,
.stuadjusttext textarea:focus {
  outline: 0;
  border-color: var(--primary-light-green);
}
.stureasontext span,
.stuadjusttext span {
  color: var(--text-green);
  font-size: 16px;
}
.stureasontext {
  box-sizing: border-box;
  width: 84%;
  position: absolute;
  left: 50%;
  top: 150px;
  transform: translateX(-50%);
}
.stuadjusttext {
  box-sizing: border-box;
  width: 84%;
  position: absolute;
  left: 50%;
  top: 370px;
  transform: translateX(-50%);
}
.adjuststepbtn {
  width: 100%;
  position: absolute;
  left: 50%;
  top: 600px;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
  padding: 0 50px;
  box-sizing: border-box;
}
.adjuststepbtn button {
  width: 120px;
  height: 32px;
  border-radius: 5px;
  border: 0;
  background-color: var(--primary-light-green);
  color: var(--text-gray-black);
  font-weight: 700;
  cursor: pointer;
}
.adjuststepbtn button:hover {
  background-color: var(--primary-deep-green);
}
.stepposition {
  width: 100%;
  height: 100px;
  position: relative;
}
.stepcontainer {
  width: 84%;
  box-sizing: border-box;
  position: absolute;
  left: calc(50% + 3px);
  top: 20px;
  transform: translateX(-50%);
}
.stepitem {
  display: inline-block;
  position: relative;
  margin-left: -3px;
}
.stepitem span {
  position: absolute;
  left: 50%;
  top: 40px;
  transform: translateX(-50%);
  width: 50px;
  color: var(--text-gray);
}
.stepline {
  display: inline-block;
  box-sizing: border-box;
  border-bottom: 2px solid var(--primary-gray);
  width: calc((100% - 84px) / 2);
  margin-bottom: 16px;
  margin-left: -3px;
}
.stepword {
  position: absolute;
  left: 50%;
  top: 90px;
  transform: translate(-50%, -50%);
  color: var(--text-green);
  font-size: 20px;
  width: 100%;
  text-align: center;
}
</style>