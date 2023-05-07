<template>
  <el-row class="row-bg dmsheader" justify="space-between">
    <el-col :span="12" class="dmstitle" v-if="headertype == 0"
      >邑大宿舍管理系统 管理端</el-col
    >
    <el-col :span="12" class="dmstitle" v-if="headertype == 1"
      >邑大宿舍管理系统 学生端</el-col
    >
    <el-col :span="12" class=".toolcol">
      <el-avatar
        shape="square"
        style="
          color: var(--text-green);
          background-color: var(--primary-light-gray);
          font-size: 20px;
        "
        >{{ headername.substring(0, 1) }}</el-avatar
      >
      <span class="dmsheaderName">{{ headername }}</span>
      <Logout class="logout" @click="logoutfun"></Logout>
      <Nightmode class="nightmode"></Nightmode>
      <Screenmode class="screenmode"></Screenmode>
    </el-col>
  </el-row>
  <Dmsconfirm
    style="z-index: 99"
    v-model:handleId="deleteid"
    :confirmStr="deletestr"
    :handleType="deletetype"
  ></Dmsconfirm>
</template>

<script>
import Nightmode from "./Nightmode.vue";
import Screenmode from "./Screenmode.vue";
import Logout from "./Logout.vue";
import Dmsconfirm from "@/components/Dmsconfirm.vue";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
export default {
  name: "dmsheader",
  components: {
    Nightmode,
    Screenmode,
    Logout,
    Dmsconfirm,
  },
  setup() {
    const store = useStore();
    const deleteid = ref(0);
    const deletestr = ref("确定登出当前账号吗");
    const deletetype = ref(12);
    const logoutfun = () => {
      deleteid.value = 1;
      deletestr.value = "确定登出当前账号吗";
      deletetype.value = 12;
    };

    const headertype = ref(1);
    const headername = ref("");
    onMounted(() => {
      headertype.value = store.state.dsuser.dsuserInfo.type;
      headername.value = store.state.dsuser.dsuserInfo.dsuserName;
    });

    return {
      deleteid,
      deletestr,
      deletetype,
      logoutfun,
      headertype,
      headername,
    };
  },
};
</script>

<style scoped>
.dmsheader {
  height: 100%;
  line-height: 60px;
  box-shadow: var(--boxshadow);
}
.dmstitle {
  font-size: 25px;
  padding-left: 20px;
  color: var(--text-green);
}
.nightmode {
  /* position: absolute;
  right: 7px;
  top: 5px;
  z-index: 1001; */
  float: right;
  margin-right: 10px;
}
.el-avatar {
  float: right;
  margin: 10px 20px;
  border: 2px solid var(--primary-green);
}
.dmsheaderName {
  float: right;
  margin-left: 40px;
  color: var(--text-green);
}

.screenmode {
  font-size: 2em;
  float: right;
  margin-right: 10px;
}
.logout {
  margin-right: 10px;
  float: right;
  font-size: 2em;
}
</style>