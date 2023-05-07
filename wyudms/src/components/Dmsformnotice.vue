<template>
  <Transition name="nform">
    <div class="formbgmask" v-show="nformshow">
      <el-form :inline="true" :model="editnoticeobj" class="noticeform">
        <span class="noticeformtitle">{{
          $store.state.dsnotice.editnoticetitle
        }}</span>
        <el-form-item
          class="formhide"
          @click="nformhide"
          style="position: absolute; right: 5px; top: 5px; margin-right: 0"
        >
          <el-icon style="font-size: 24px; cursor: pointer"
            ><CloseBold style="color: var(--primary-green)"
          /></el-icon>
          <el-input v-model="editnoticeobj.id" style="display: none" />
        </el-form-item>
        <el-form-item label="标题" style="width: 90%">
          <el-input
            class="nrequired"
            v-model="editnoticeobj.title"
            placeholder="输入标题"
          />
        </el-form-item>
        <el-form-item label="正文" style="width: 90%">
          <el-input
            class="contentrequired"
            v-model="editnoticeobj.content"
            type="textarea"
            placeholder="输入正文"
            resize="none"
            rows="8"
          />
        </el-form-item>
        <el-form-item label="负责人" style="width: 44%">
          <el-select v-model="editnoticeobj.noticeman">
            <el-option
              v-for="i in adminlist.list"
              :key="i"
              :label="i"
              :value="i"
            />
          </el-select>
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
import { getPersonnelList } from "@/api/personnel";
import { updatenoticeinfo, addnotice } from "@/api/notice";
import { CloseBold } from "@element-plus/icons-vue";
import { reactive, ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
export default {
  name: "dmsformnotice",
  components: {
    CloseBold,
  },
  setup() {
    const store = useStore();

    const nformshow = ref(false);

    let editnoticeobj = reactive({
      id: "",
      title: "",
      content: "",
      noticeman: "管理员",
    });

    let noticeobj = {
      id: "",
      title: "",
      content: "",
      noticeman: "管理员",
    };

    const seteditnoticeobj = () => {
      editnoticeobj.id = noticeobj.id;
      editnoticeobj.title = noticeobj.title;
      editnoticeobj.content = noticeobj.content;
      editnoticeobj.noticeman = noticeobj.noticeman;
    };

    const nformhide = () => {
      nformshow.value = false;
    };

    let adminlist = reactive({
      list: ["管理员", "管理员1"],
    });
    onMounted(() => {
      getPersonnelList({ type: 3 })
        .then((res) => {
          if (res.status == 0) {
            let adminarr = [];
            res.personnellist.forEach((item) => {
              adminarr.push(item.pname);
            });
            adminlist.list = adminarr;
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
      watch(
        () => store.state.dsnotice.editnoticestatus,
        () => {
          noticeobj = store.state.dsnotice.editnoticeobj;
          seteditnoticeobj();
          nformshow.value = true;
        }
      );
    });

    const onEditReset = () => {
      seteditnoticeobj();
    };

    const onEditSubmit = () => {
      // 提交前进行校验
      let requiredDom = document.querySelector(".nrequired");
      let requiredDom1 = document.querySelector(".contentrequired");
      let empty = false;
      if (
        requiredDom.children[0].children[0].value == "" ||
        requiredDom1.children[0].value == ""
      ) {
        empty = true;
      }
      if (empty) {
        store.commit("setNoticeContent", "所有信息项都为必填，不可为空！");
      } else {
        if (store.state.dsnotice.editnoticetype == 0) {
          updatenoticeinfo({ editnoticeobj })
            .then((res) => {
              if (res.status == 0) {
                store.commit("setNoticeContent", res.message);
                store.commit("dsnotice/setNoticetableStatus");
                nformshow.value = false;
              } else {
                store.commit("setNoticeContent", res.message);
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
        } else if (store.state.dsnotice.editnoticetype == 1) {
          store.commit("setNoticeContent", "发布公告中");
          // 发起请求
          let noticetime = new Date();
          addnotice({ editnoticeobj, noticetime })
            .then((res) => {
              if (res.status == 0) {
                store.commit("setNoticeContent", res.message);
                store.commit("dsnotice/setNoticetableStatus");
                nformshow.value = false;
              } else {
                store.commit("setNoticeContent", res.message);
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
        }
      }
    };

    return {
      editnoticeobj,
      onEditReset,
      onEditSubmit,
      nformshow,
      nformhide,
      adminlist,
    };
  },
};
</script>
  
<style>
/* .noticeform textarea {
  height: 180px !important;
} */
.noticeform textarea::-webkit-scrollbar {
  width: 6px;
  height: 0;
}
.noticeform textarea::-webkit-scrollbar-thumb {
  border-radius: 3px;
  /* background-color: var(--primary-morelight-gray); */
  background-color: var(--primary-mostlight-gray);
}
.noticeform textarea::-webkit-scrollbar-thumb:hover {
  /* background-color: var(--primary-mostlight-gray); */
  background-color: var(--primary-gray);
}
.formbgmask {
  background-color: var(--transparent);
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.noticeformtitle {
  display: block;
  height: 32px;
  text-align: center;
  line-height: 32px;
  font-size: 20px;
  color: var(--text-green);
  margin: 10px 0;
}
.noticeform {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--primary-gray-black);
  border-radius: 10px;
  padding: 0 10px 0 20px;
  width: 400px;
  height: 400px;
}
.noticeform .el-form-item {
  margin-bottom: 18px;
}
</style>