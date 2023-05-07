<template>
  <Transition name="adjust">
    <div class="adjustmask" v-show="adjustshow">
      <div class="adjustcontainer">
        <p class="adjusttitle">调宿申请详情</p>
        <el-icon
          @click="adjusthide"
          style="
            position: absolute;
            right: 5px;
            top: 5px;
            font-size: 24px;
            color: var(--primary-green);
            cursor: pointer;
          "
          ><CloseBold
        /></el-icon>
        <div class="adjustinfo">
          <p>
            <span>房间:</span> {{ studetail.detail.building }}栋{{
              studetail.detail.room
            }}房{{ studetail.detail.bed }}号床
          </p>
          <p><span>姓名:</span> {{ studetail.detail.stuname }}</p>
          <p><span>职务:</span> {{ studetail.detail.job }}</p>
          <p><span>性别:</span> {{ studetail.detail.sex }}</p>
          <p><span>班别:</span> {{ studetail.detail.stuclass }}</p>
          <p><span>学号:</span> {{ studetail.detail.stunumber }}</p>
          <p><span>手机:</span> {{ studetail.detail.phone }}</p>
          <p><span>专业:</span> {{ studetail.detail.major }}</p>
          <p><span>辅导员:</span> {{ studetail.detail.counsellor }}</p>
          <p><span>处理状态:</span> {{ adjustdetail.detail.status }}</p>
          <p v-if="stayshow">
            <span>入住房间:</span> {{ adjustdetail.detail.adjustbuilding }}栋{{
              adjustdetail.detail.adjustroom
            }}房{{ adjustdetail.detail.adjustbed }}号床
          </p>
        </div>
        <div class="adjusttext">
          <span>调宿原因:</span>
          <textarea readonly v-model="adjustdetail.detail.reason"></textarea>
          <span>调宿意见:</span>
          <textarea v-model="adjustdetail.detail.adjustmessage"></textarea>
          <div class="adjustbtn">
            <button
              v-if="adjustdetail.detail.status == '未处理'"
              @click="passadjust"
            >
              通过
            </button>
            <button
              v-if="adjustdetail.detail.status == '已通过'"
              @click="chooseadjust"
            >
              选中
            </button>
            <button
              v-if="
                adjustdetail.detail.status == '未处理' ||
                adjustdetail.detail.status == '已通过'
              "
              @click="nopassadjust"
            >
              驳回
            </button>

            <button
              v-if="adjustdetail.detail.status == '调宿中'"
              @click="finishadjust"
            >
              完成
            </button>
            <button
              v-if="adjustdetail.detail.status == '调宿中'"
              @click="canceladjust"
            >
              中断
            </button>
            <button
              v-if="
                adjustdetail.detail.status == '未通过' ||
                adjustdetail.detail.status == '已中断' ||
                adjustdetail.detail.status == '已完成'
              "
              @click="deleteadjust"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <Dmsconfirm
    style="z-index: 102"
    v-model:handleId="deleteid"
    :confirmStr="deletestr"
    @settable="setadjust"
    @settable2="setadjust2"
    :handleType="deletetype"
    :handleMessage="deletemessage"
  ></Dmsconfirm>
</template>

<script>
import Dmsconfirm from "@/components/Dmsconfirm.vue";
import { CloseBold } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
export default {
  name: "dmsadjustdetail",
  components: {
    CloseBold,
    Dmsconfirm,
  },
  setup() {
    const store = useStore();

    const adjustshow = ref(false);
    const adjusthide = () => {
      adjustshow.value = false;
    };

    const studetail = reactive({
      detail: {
        id: 0,
        building: "48",
        room: "202",
        bed: "4",
        stuname: "方文轩",
        job: "舍长",
        sex: "男",
        stuclass: "190701",
        stunumber: "3119001333",
        phone: "13356580997",
        major: "计算机科学与技术",
        counsellor: "鲜红兰",
      },
    });
    const adjustdetail = reactive({
      detail: {
        id: 0,
        reason: "想换宿舍",
        adjustbuilding: "",
        adjustroom: "",
        adjustbed: "",
        adjustmessage: "",
        status: "未处理",
      },
    });

    const stayshow = ref(false);

    const deleteid = ref(0);
    const deletestr = ref("确认要驳回该调宿申请吗？");
    const deletetype = ref(0);
    const deletemessage = ref("");
    const setadjust = () => {
      adjustshow.value = false;
      store.commit("dsdorm/setAdjustListStatus");
    };
    const setadjust2 = () => {
      adjustshow.value = false;
      store.commit("dsdorm/setAdjustListStatus2");
    };
    const nopassadjust = () => {
      deleteid.value = adjustdetail.detail.id;
      deletestr.value = "确认要驳回该调宿申请吗？";
      deletetype.value = 6;
      deletemessage.value = adjustdetail.detail.adjustmessage;
    };
    const passadjust = () => {
      deleteid.value = adjustdetail.detail.id;
      deletestr.value = "确认要通过该调宿申请吗？";
      deletetype.value = 7;
      deletemessage.value = adjustdetail.detail.adjustmessage;
    };
    const deleteadjust = () => {
      deleteid.value = adjustdetail.detail.id;
      deletestr.value = "确认要删除该调宿申请吗？";
      deletetype.value = 8;
      deletemessage.value = adjustdetail.detail.adjustmessage;
    };
    const chooseadjust = () => {
      store.commit("dsdorm/setChooseStu", {
        building: studetail.detail.building,
        room: studetail.detail.room,
        stuname: studetail.detail.stuname,
        stuid: studetail.detail.id,
        adjustid: adjustdetail.detail.id,
      });
      adjustshow.value = false;
    };
    const canceladjust = () => {
      deleteid.value = adjustdetail.detail.id;
      deletestr.value = "确认要中断该调宿申请吗？";
      deletetype.value = 10;
      deletemessage.value = adjustdetail.detail.adjustmessage;
    };
    const finishadjust = () => {
      deleteid.value = adjustdetail.detail.id;
      deletestr.value = "确认该调宿申请已完成吗？";
      deletetype.value = 11;
      deletemessage.value = adjustdetail.detail.adjustmessage;
    };
    onMounted(() => {
      watch(
        () => store.state.dsdorm.dormdetailstatus,
        () => {
          studetail.detail = store.state.dsdorm.studetail;
          adjustdetail.detail = store.state.dsdorm.adjustdetail;
          if (
            adjustdetail.detail.status == "未处理" ||
            adjustdetail.detail.status == "未通过" ||
            adjustdetail.detail.status == "已通过"
          ) {
            stayshow.value = false;
          } else {
            stayshow.value = true;
          }
          adjustshow.value = true;
        }
      );
    });
    return {
      adjustshow,
      adjusthide,
      studetail,
      adjustdetail,
      stayshow,
      deleteid,
      deletestr,
      deletetype,
      deletemessage,
      nopassadjust,
      setadjust,
      setadjust2,
      passadjust,
      deleteadjust,
      chooseadjust,
      canceladjust,
      finishadjust,
    };
  },
};
</script>

<style scoped>
.adjustmask {
  background-color: var(--transparent);
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 101;
}
.adjustcontainer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 340px;
  background-color: var(--primary-gray-black);
  border-radius: 10px;
}
.adjustcontainer p {
  margin: 0;
}
.adjustcontainer .adjusttitle {
  height: 32px;
  line-height: 32px;
  font-size: 20px;
  text-align: center;
  color: var(--text-green);
  border-bottom: 2px solid;
  border-bottom: 2px solid var(--primary-mostlight-gray);
  margin: 0 8px;
}
.adjustinfo {
  display: inline-block;
  margin-left: 12px;
  width: 210px;
}
.adjustinfo p {
  margin-top: 8px;
  color: var(--text-green);
}
.adjustinfo p span {
  color: var(--text-gray);
  margin-right: 8px;
}
.adjusttext {
  float: right;
  width: 360px;
}
.adjusttext span {
  margin: 8px 0 4px 0;
  display: inline-block;
  color: var(--text-gray);
}
.adjusttext textarea {
  width: 320px;
  height: 80px;
  resize: none;
  border-radius: 5px;
  background-color: var(--primary-deep-gray);
  padding: 10px;
  padding-top: 6px;
  color: var(--text-gray);
  font-size: 14px;
}
.adjusttext textarea:focus {
  outline: 0;
  border-color: var(--primary-light-green);
}
.adjusttext textarea::-webkit-scrollbar {
  width: 6px;
  height: 0;
}
.adjusttext textarea::-webkit-scrollbar-thumb {
  border-radius: 3px;
  /* background-color: var(--primary-morelight-gray); */
  background-color: var(--primary-mostlight-gray);
}
.adjusttext textarea::-webkit-scrollbar-thumb:hover {
  /* background-color: var(--primary-mostlight-gray); */
  background-color: var(--primary-gray);
}
.adjustbtn {
  margin-top: 8px;
  margin-right: 12px;
}
.adjusttext button {
  border: 0;
  border-radius: 5px;
  background-color: var(--primary-light-green);
  color: var(--primary-gray-black);
  cursor: pointer;
  width: 60px;
  height: 28px;
  font-weight: 700;
  margin-right: 8px;
  line-height: 28px;
  padding: 0;
  float: right;
}
.adjusttext button:hover {
  background-color: var(--primary-deep-green);
}
</style>