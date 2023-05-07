<template>
  <Transition name="confirm">
    <div class="confirmContainer" v-show="confirmshow">
      <div class="confirmBox">
        <el-icon class="confirmHide" @click="confirmhide"
          ><CloseBold
        /></el-icon>
        <div class="confirmContent">{{ confirmStr }}</div>
        <div class="confirmBtn">
          <button @click="confirmcancel">取消</button>
          <button @click="confirmclick">确定</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { deletestuinfo, getStuById } from "@/api/user";
import { deletenoticeinfo } from "@/api/notice";
import {
  deletemaintain,
  cancelmaintain,
  stucancelmaintain,
  donemaintain,
  studonemaintain,
} from "@/api/maintain";
import { deleteappeal, clearappeal } from "@/api/appeal";
import {
  nopassadjust,
  passadjust,
  deleteadjust,
  startadjust,
  canceladjust,
  finishadjust,
  changedormjob,
  addadjust,
  stucanceladjust,
} from "@/api/dorm";
import { CloseBold } from "@element-plus/icons-vue";
import { ref, watch } from "vue";
import { useStore } from "vuex";
import router from "@/router";
export default {
  name: "dmsconfirm",
  components: {
    CloseBold,
  },
  props: {
    confirmStr: {
      type: String,
      default: "确定执行该操作？",
    },
    handleId: {
      type: Number,
      default: 0,
    },
    handleType: {
      type: Number,
      default: 0,
    },
    handleMessage: {
      type: String,
      default: "无",
    },
    handleJob: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const confirmshow = ref(false);

    const confirmhide = () => {
      confirmshow.value = false;
    };

    let sendid = 0;
    let sendjob = 0;
    watch(
      () => props.handleId,
      () => {
        if (props.handleId != 0) {
          confirmshow.value = true;
          sendid = props.handleId;
          sendjob = props.handleJob;
          emit("update:handleId", 0);
        }
      }
    );

    const confirmclick = () => {
      store.commit("setNoticeContent", "处理中");
      confirmshow.value = false;
      // 根据传入的删除类型来发不同请求
      if (props.handleType == 0) {
        // 删除学生
        deletestuinfo({ delid: sendid })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable");
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 1) {
        // 删除公告
        deletenoticeinfo({ delid: sendid })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable");
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 2) {
        // 删除诉求
        deleteappeal({ delid: sendid, type: 0 })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable");
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 3) {
        // 清空诉求
        // console.log("clear");
        clearappeal()
          .then((res) => {
            if (res.status == 0) {
              console.log("clear");
              store.commit("setNoticeContent", res.message);
              emit("settable");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 4) {
        // 后台删除维修单
        deletemaintain({ id: sendid, type: 0 })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 5) {
        // 取消维修单
        cancelmaintain({ id: sendid, mtcontent: props.handleMessage })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 6) {
        // 驳回调宿申请
        nopassadjust({ id: sendid, adjustmessage: props.handleMessage })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 7) {
        // 通过调宿申请
        passadjust({ id: sendid, adjustmessage: props.handleMessage })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 8) {
        // 删除调宿申请
        deleteadjust({ id: sendid })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 9) {
        // 调宿中
        let strarr = props.handleMessage.split(",");
        startadjust({
          id: sendid,
          adjustbuilding: strarr[0],
          adjustroom: strarr[1],
          adjustbed: strarr[2],
        })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 10) {
        // 中断调宿申请
        canceladjust({ id: sendid, adjustmessage: props.handleMessage })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable2");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 11) {
        //完成调宿申请
        finishadjust({ id: sendid, adjustmessage: props.handleMessage })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable2");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 12) {
        //登出当前账号
        setTimeout(() => {
          store.commit("dsuser/setUser", {});
          router.push("/login");
        }, 1000);
      } else if (props.handleType == 13) {
        // 删除诉求
        deleteappeal({ delid: sendid, type: 1 })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 14) {
        // 变更职务
        let fromid = store.state.dsuser.dsuserInfo.id;
        let fromjob = store.state.dsuser.dsuserInfo.job;
        console.log(fromid, fromjob, sendid, sendjob);
        changedormjob({
          fromid: fromid,
          fromjob: fromjob,
          toid: sendid,
          tojob: sendjob,
        })
          .then((res) => {
            if (res.status == 0) {
              // 刷新房间
              store.commit("setNoticeContent", res.message);
              emit("settable");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 15) {
        // 新增调宿
        addadjust({
          stuid: store.state.dsuser.dsuserInfo.id,
          reason: props.handleMessage,
        })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 16) {
        // 中断调宿申请
        stucanceladjust({ id: sendid, reason: props.handleMessage })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 17) {
        // 取消维修单
        stucancelmaintain({ id: sendid })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 18) {
        // 完成维修单
        donemaintain({ id: sendid, mtcontent: props.handleMessage })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (props.handleType == 19) {
        // 完成维修单
        studonemaintain({ id: sendid, content: props.handleMessage })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              emit("settable");
            } else {
              store.commit("setNoticeContent", res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    };

    const confirmcancel = () => {
      confirmshow.value = false;
    };

    return { confirmshow, confirmhide, confirmclick, confirmcancel };
  },
};
</script>

<style scoped>
.confirmContainer {
  width: 100%;
  height: 100%;
  background-color: var(--transparent);
  position: absolute;
  left: 0;
  top: 0;
}
.confirmBox {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 120px;
  background-color: var(--primary-gray-black);
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid var(--primary-light-green);
}
.confirmHide {
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 24px;
  cursor: pointer;
  color: var(--primary-green);
}
.confirmContent {
  margin-top: 40px;
  margin-left: 20px;
  color: var(--text-light-green);
  text-align: left;
}
.confirmBtn {
  float: right;
  margin-top: 24px;
}
.confirmBtn button {
  margin-right: 12px;
  border-radius: 5px;
  border: 0;
  width: 60px;
  height: 28px;
  background-color: var(--primary-light-green);
  font-weight: 700;
  color: var(--text-gray-black);
  cursor: pointer;
}
.confirmBtn button:hover {
  background-color: var(--primary-deep-green);
}
</style>