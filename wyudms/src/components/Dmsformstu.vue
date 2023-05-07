<template>
  <Transition name="form">
    <div class="formbgmask" v-show="formshow">
      <el-form :inline="true" :model="editobj" class="stuform">
        <span class="stuformtitle">{{ $store.state.dsuser.edittitle }}</span>
        <el-form-item
          class="formhide"
          @click="formhide"
          style="position: absolute; right: 5px; top: 5px; margin-right: 0"
        >
          <el-icon style="font-size: 24px; cursor: pointer"
            ><CloseBold style="color: var(--primary-green)"
          /></el-icon>
          <el-input v-model="editobj.id" style="display: none" />
        </el-form-item>
        <el-form-item label="楼栋" style="width: 44%">
          <el-input
            class="required"
            v-model="editobj.building"
            placeholder="输入楼栋"
          />
        </el-form-item>
        <el-form-item label="楼层" style="width: 44%; margin-right: 0">
          <el-input
            class="required"
            v-model="editobj.floor"
            placeholder="输入楼层"
          />
        </el-form-item>
        <el-form-item label="房间" style="width: 44%">
          <el-input
            class="required"
            v-model="editobj.room"
            placeholder="输入房间"
          />
        </el-form-item>
        <el-form-item label="床号" style="width: 44%; margin-right: 0">
          <el-input
            class="required"
            v-model="editobj.bed"
            placeholder="输入床号"
          />
        </el-form-item>
        <el-form-item label="性别" style="width: 44%">
          <el-select v-model="editobj.sex">
            <el-option label="男" value="0" />
            <el-option label="女" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="职务" style="width: 44%; margin-right: 0">
          <el-select v-model="editobj.job">
            <el-option label="舍员" value="0" />
            <el-option label="舍长" value="1" />
            <el-option label="层长" value="2" />
            <el-option label="舍长兼层长" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="专业" style="width: 96%; margin-right: 0">
          <el-select v-model="editobj.major" style="width: 100%">
            <el-option
              v-for="i in majorlist.list"
              :key="i"
              :label="i"
              :value="i"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班别" style="width: 96%; margin-right: 0">
          <el-input
            class="required"
            v-model="editobj.stuclass"
            placeholder="输入班别"
          />
        </el-form-item>
        <el-form-item label="学号" style="width: 96%; margin-right: 0">
          <el-input
            class="required"
            v-model="editobj.stunumber"
            placeholder="输入学号"
          />
        </el-form-item>
        <el-form-item label="姓名" style="width: 96%; margin-right: 0">
          <el-input
            class="required"
            v-model="editobj.stuname"
            placeholder="输入姓名"
          />
        </el-form-item>
        <el-form-item label="手机" style="width: 96%; margin-right: 0">
          <el-input
            class="required"
            v-model="editobj.phone"
            placeholder="输入手机"
          />
        </el-form-item>
        <el-form-item label="辅导员" style="width: 96%; margin-right: 0">
          <el-select v-model="editobj.counsellor" style="width: 100%">
            <el-option
              v-for="i in counsellorlist.list"
              :key="i"
              :label="i"
              :value="i"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="身份证后六位"
          style="width: 96%; margin-right: 0"
          v-if="idpwdshow"
        >
          <el-input
            class="requiredpwd"
            v-model="idpwd"
            placeholder="输入身份证后六位"
          />
        </el-form-item>
        <el-form-item style="margin-right: 15px; width: 46%">
          <el-button
            type="primary"
            @click="onEditReset"
            style="width: 100%; font-weight: 700; font-size: 16px"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item style="margin-right: 0; width: 46%">
          <el-button
            type="primary"
            @click="onEditSubmit"
            style="width: 100%; font-weight: 700; font-size: 16px"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </Transition>
</template>

<script>
import md5 from "js-md5";
import { getmajorlist } from "@/api/major";
import { getPersonnelList } from "@/api/personnel";
import { updatestuinfo, addstu } from "@/api/user";
import { CloseBold } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
export default {
  name: "dmsformstu",
  components: {
    CloseBold,
  },
  setup() {
    const store = useStore();

    const formshow = ref(false);

    let editobj = reactive({
      id: "",
      building: "",
      floor: "",
      room: "",
      bed: "",
      sex: "0",
      job: "0",
      major: "计算机科学与技术",
      stuclass: "",
      stunumber: "",
      stuname: "",
      phone: "",
      counsellor: "辅导员一",
    });

    const idpwd = ref(0);

    let stuobj = {
      id: "",
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
    };

    const seteditobj = () => {
      editobj.id = stuobj.id;
      editobj.building = stuobj.building;
      editobj.floor = stuobj.floor;
      editobj.room = stuobj.room;
      editobj.bed = stuobj.bed;
      editobj.sex = stuobj.sex == 0 ? "0" : "1";
      editobj.job =
        stuobj.job == 0
          ? "0"
          : stuobj.job == 1
          ? "1"
          : stuobj.job == 2
          ? "2"
          : "3";
      editobj.major = stuobj.major;
      editobj.stuclass = stuobj.stuclass;
      editobj.stunumber = stuobj.stunumber;
      editobj.stuname = stuobj.stuname;
      editobj.phone = stuobj.phone;
      editobj.counsellor = stuobj.counsellor;
    };

    const formhide = () => {
      formshow.value = false;
    };

    const idpwdshow = ref(false);

    let majorlist = reactive({
      list: ["计算机科学与技术", "专业二", "专业三"],
    });
    let counsellorlist = reactive({
      list: ["辅导员1", "辅导员2", "辅导员3"],
    });
    onMounted(() => {
      getmajorlist()
        .then((res) => {
          if (res.status == 0) {
            let majorarr = [];
            res.majorlist.forEach((item) => {
              majorarr.push(item.majorname);
            });
            majorlist.list = majorarr;
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
      getPersonnelList({ type: 0 })
        .then((res) => {
          if (res.status == 0) {
            let counsellorarr = [];
            res.personnellist.forEach((item) => {
              counsellorarr.push(item.pname);
            });
            counsellorlist.list = counsellorarr;
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
      watch(
        () => store.state.dsuser.editstatus,
        () => {
          stuobj = store.state.dsuser.editobj;
          seteditobj();
          // 根据编辑类型更改标题以及显示输入身份证
          if (store.state.dsuser.edittype == 0) {
            idpwdshow.value = false;
            document.querySelector(".stuform").style.height = "560px";
          } else if (store.state.dsuser.edittype == 1) {
            idpwdshow.value = true;
            document.querySelector(".stuform").style.height = "600px";
          }
          formshow.value = true;
        }
      );
    });

    const onEditReset = () => {
      console.log("reset");
      seteditobj();
    };

    const onEditSubmit = () => {
      // 提交前进行校验
      let requiredDom = document.querySelectorAll(".required");
      let empty = false;
      // console.log(requiredDom);
      requiredDom.forEach((item) => {
        if (item.children[0].children[0].value == "") {
          empty = true;
        }
      });
      if (empty) {
        store.commit("setNoticeContent", "所有信息项都为必填，不可为空！");
      } else {
        if (store.state.dsuser.edittype == 0) {
          updatestuinfo({ editobj })
            .then((res) => {
              if (res.status == 0) {
                store.commit("setNoticeContent", res.message);
                store.commit("dsuser/setStutableStatus");
                document.querySelector(".formhide").click();
              } else {
                store.commit("setNoticeContent", res.message);
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
        } else if (store.state.dsuser.edittype == 1) {
          // 进行身份证后六位的校验以及md5处理
          let pwdstr =
            document.querySelector(".requiredpwd").children[0].children[0]
              .value;
          if (pwdstr.length != 6) {
            store.commit("setNoticeContent", "身份证后六位必须为六位数字");
          } else {
            store.commit("setNoticeContent", "导入学生信息中");
            // 进行md5处理
            let md5str = md5(pwdstr);
            // 发起请求
            addstu({ editobj, md5str })
              .then((res) => {
                if (res.status != 0) {
                  store.commit("setNoticeContent", res.message);
                } else if (res.status == 0) {
                  store.commit("setNoticeContent", res.message);
                  store.commit("dsuser/setStutableStatus");
                  document.querySelector(".formhide").click();
                  idpwd.value = 0;
                } else {
                  store.commit("setNoticeContent", res.message);
                }
              })
              .catch((err) => {
                console.log(err.message);
              });
          }
        }
      }
    };

    return {
      editobj,
      onEditReset,
      onEditSubmit,
      formshow,
      formhide,
      idpwdshow,
      idpwd,
      majorlist,
      counsellorlist,
    };
  },
};
</script>

<style scoped>
.formbgmask {
  background-color: var(--transparent);
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.stuformtitle {
  display: block;
  height: 32px;
  text-align: center;
  line-height: 32px;
  font-size: 20px;
  color: var(--text-green);
  margin: 10px 0;
}
.stuform {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--primary-gray-black);
  border-radius: 10px;
  padding: 0 10px 0 20px;
  width: 400px;
  height: 600px;
}
.stuform .el-form-item {
  margin-bottom: 18px;
}
/* .stuform input {
  height: 32px;
  box-sizing: border-box;
  border-radius: 5px;
  padding-left: 5px;
  border: 1px solid var(--primary-gray);
  background-color: var(--primary-light-gray);
  color: var(--text-gray);
  font-size: 16px;
}
.stuform input:focus {
  outline: 0;
  border: 1px solid var(--primary-light-green);
} */
</style>