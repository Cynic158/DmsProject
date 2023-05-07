<template>
  <div class="stuselfheader">
    <div class="leftline"></div>
    <div class="centertitle">学生个人信息</div>
    <div class="rightline"></div>
  </div>
  <div class="infocontainer">
    <div class="infoitem"><span>姓名</span>{{ infolist.list.stuname }}</div>
    <div class="infoitem"><span>性别</span>{{ infolist.list.sex }}</div>
    <div class="infoitem"><span>职务</span>{{ infolist.list.job }}</div>
    <div class="infoitem"><span>楼栋</span>{{ infolist.list.building }}栋</div>
    <div class="infoitem"><span>房间</span>{{ infolist.list.room }}房</div>
    <div class="infoitem"><span>床号</span>{{ infolist.list.bed }}号床</div>
    <div class="infoitem"><span>专业</span>{{ infolist.list.major }}</div>
    <div class="infoitem"><span>班别</span>{{ infolist.list.stuclass }}</div>
    <div class="infoitem"><span>学号</span>{{ infolist.list.stunumber }}</div>
    <div class="infoitem">
      <span>手机</span>{{ infolist.list.phone }}
      <button v-if="!editphonestatus" @click="editphone">更改</button>
      <button v-if="editphonestatus" @click="savephone">保存</button>
      <button v-if="editphonestatus" @click="cancelphone">取消</button>
      <input type="text" v-if="editphonestatus" v-model="phoneVal" />
    </div>
    <div class="infoitem">
      <span>邮箱</span>{{ infolist.list.email }}
      <button v-if="!editemailstatus" @click="editemail">更改</button>
      <button v-if="editemailstatus" @click="saveemail">保存</button>
      <button v-if="editemailstatus" @click="cancelemail">取消</button>
      <input type="text" v-if="editemailstatus" v-model="emailVal" />
    </div>
    <div class="infoitem">
      <span>辅导员</span>{{ infolist.list.counsellor }}
    </div>
  </div>
</template>

<script>
import { onActivated, onMounted, reactive, ref } from "vue";
import { getStuById, updatephone, updateemail } from "@/api/user";
import { useStore } from "vuex";
export default {
  name: "stuselfinfo",
  setup() {
    const store = useStore();
    const infolist = reactive({
      list: {
        stuname: "",
        sex: "",
        job: "",
        building: "",
        room: "",
        bed: "",
        major: "",
        stuclass: "",
        stunumber: "",
        phone: "",
        email: "",
        counsellor: "",
      },
    });

    const setinfolist = () => {
      getStuById({ stuid: store.state.dsuser.dsuserInfo.id })
        .then((res) => {
          if (res.status == 0) {
            // console.log(res.stuobj);
            if (res.stuobj[0].job == 0) {
              res.stuobj[0].job = "舍员";
            } else if (res.stuobj[0].job == 1) {
              res.stuobj[0].job = "舍长";
            } else if (res.stuobj[0].job == 2) {
              res.stuobj[0].job = "层长";
            } else if (res.stuobj[0].job == 3) {
              res.stuobj[0].job = "舍长兼层长";
            }
            if (res.stuobj[0].sex == 0) {
              res.stuobj[0].sex = "男";
            } else if (res.stuobj[0].sex == 1) {
              res.stuobj[0].sex = "女";
            }
            infolist.list = res.stuobj[0];
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    const phoneVal = ref("");
    const editphonestatus = ref(false);
    const editphone = () => {
      editphonestatus.value = true;
    };
    const cancelphone = () => {
      phoneVal.value = "";
      editphonestatus.value = false;
    };
    const savephone = () => {
      let exp =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (phoneVal.value.trim() == "") {
        store.commit("setNoticeContent", "手机号不能为空");
      } else if (!exp.test(phoneVal.value.trim())) {
        store.commit("setNoticeContent", "手机号格式有误");
      } else {
        updatephone({
          stuid: store.state.dsuser.dsuserInfo.id,
          phone: phoneVal.value.trim(),
        })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              setinfolist();
              phoneVal.value = "";
              editphonestatus.value = false;
            } else {
              console.log(res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
      // editphonestatus.value = false;
    };

    const emailVal = ref("");
    const editemailstatus = ref(false);
    const editemail = () => {
      editemailstatus.value = true;
    };
    const cancelemail = () => {
      emailVal.value = "";
      editemailstatus.value = false;
    };
    const saveemail = () => {
      let exp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (emailVal.value.trim() == "") {
        store.commit("setNoticeContent", "邮箱不能为空");
      } else if (!exp.test(emailVal.value.trim())) {
        store.commit("setNoticeContent", "邮箱格式有误");
      } else {
        updateemail({
          stuid: store.state.dsuser.dsuserInfo.id,
          email: emailVal.value.trim(),
        })
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              setinfolist();
              emailVal.value = "";
              editemailstatus.value = false;
            } else {
              console.log(res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    };
    onMounted(() => {
      setinfolist();
    });

    onActivated(() => {
      setinfolist();
    });

    return {
      infolist,
      editphonestatus,
      editphone,
      cancelphone,
      savephone,
      editemailstatus,
      editemail,
      cancelemail,
      saveemail,
      phoneVal,
      emailVal,
    };
  },
};
</script>

<style scoped>
.stuselfheader {
  width: 100%;
  height: 40px;
  background-color: var(--primary-deep-gray);
  box-shadow: 0px 0px 4px 4px var(--shadow);
  box-sizing: border-box;
}
.leftline {
  height: 20px;
  box-sizing: border-box;
  width: 50px;
  display: inline-block;
  border-bottom: 2px solid var(--primary-morelight-gray);
  margin-top: 1px;
  margin-left: 20px;
}
.centertitle {
  display: inline-block;
  margin: 0 10px;
  color: var(--text-green);
  line-height: 40px;
  text-align: center;
  height: 40px;
  vertical-align: top;
  font-size: 20px;
}
.rightline {
  height: 20px;
  box-sizing: border-box;
  width: calc(100% - 230px);
  display: inline-block;
  border-bottom: 2px solid var(--primary-morelight-gray);
  margin-top: 1px;
}
.infocontainer {
  /* border-radius: 5px; */
  width: calc(100% - 40px);
  margin: 10px 20px 0 20px;
  /* box-shadow: 0px 0px 4px 4px var(--shadow); */
}
.infoitem {
  width: 100%;
  height: 40px;
  color: var(--text-green);
  line-height: 40px;
  box-sizing: border-box;
  background-color: var(--primary-deep-gray);
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0px 0px 2px 2px var(--shadow);
}
.infoitem span {
  width: 100px;
  display: inline-block;
  height: 100%;
  border-right: 2px solid var(--primary-morelight-gray);
  color: var(--text-gray);
  text-align: center;
  margin-right: 30px;
}
.infoitem button {
  float: right;
  width: 60px;
  height: 28px;
  border-radius: 5px;
  border: 0;
  background-color: var(--primary-light-green);
  color: var(--text-gray-black);
  font-weight: 700;
  cursor: pointer;
  margin-top: 6px;
  margin-right: 12px;
}
.infoitem button:hover {
  background-color: var(--primary-deep-green);
}
.infoitem input {
  float: right;
  width: 240px;
  height: 28px;
  box-sizing: border-box;
  border-radius: 5px;
  margin-right: 12px;
  margin-top: 6px;
  padding-left: 5px;
  border: 1px solid var(--primary-gray);
  /* border: 1px solid var(--primary-mostlight-gray); */
  background-color: var(--primary-light-gray);
  color: var(--text-gray);
}
.infoitem input:focus {
  border: 1px solid var(--primary-light-green);
  outline: 0;
}
</style>