<template>
  <div class="sdcontainer">
    <div class="sdtitle">{{ stuaddress }} 查看宿舍信息</div>
    <div class="sditem" v-for="i in studorminfolist.list" :key="i">
      <div class="sditemtitle">
        <h1>{{ i.bed }}</h1>
        <div class="sditemjob">
          <span>{{ i.job }}</span
          ><button
            v-if="
              (jobtype == 1 || jobtype == 3) &&
              (i.job == '舍员' || i.job == '层长')
            "
            @click="changejob(i.id, i.job)"
          >
            更改</button
          ><span>{{ i.sex }}</span>
        </div>
        <!-- 只有在舍员和层长格子会出现，职务必须是舍长和舍长兼层长 -->
      </div>
      <div class="sditemcontainer">
        <p><span>姓名:</span> {{ i.stuname }}</p>
        <p><span>班别:</span> {{ i.stuclass }}</p>
        <p><span>学号:</span> {{ i.stunumber }}</p>
        <p><span>手机:</span> {{ i.phone }}</p>
        <p><span>邮箱:</span> {{ i.email }}</p>
        <p><span>专业:</span> {{ i.major }}</p>
        <p><span>辅导员:</span> {{ i.counsellor }}</p>
      </div>
    </div>
  </div>
  <Dmsstep></Dmsstep>

  <Dmsconfirm
    style="z-index: 99"
    v-model:handleId="deleteid"
    :confirmStr="deletestr"
    @settable="setroom"
    :handleType="deletetype"
    :handleJob="deletejob"
  ></Dmsconfirm>
</template>

<script>
import Dmsstep from "@/components/Dmsstep.vue";
import Dmsconfirm from "@/components/Dmsconfirm.vue";
import { getStuById } from "@/api/user";
import { getroomstuinfo } from "@/api/dorm";
import { onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
export default {
  name: "studorminfo",
  components: {
    Dmsconfirm,
    Dmsstep,
  },
  setup() {
    const store = useStore();
    const stuaddress = ref("xx栋 x层 xxx房");
    const studorminfolist = reactive({
      list: [
        {
          bed: "",
          sex: "",
          major: "",
          stuclass: "",
          stunumber: "",
          stuname: "",
          phone: "",
          counsellor: "",
          email: "",
          job: "",
        },
      ],
    });
    const jobtype = ref(0);

    const setroom = () => {
      getStuById({ stuid: store.state.dsuser.dsuserInfo.id })
        .then((res) => {
          if (res.status == 0) {
            store.commit("dsuser/setStuJob", res.stuobj[0].job);
            stuaddress.value = `${res.stuobj[0].building}栋 ${res.stuobj[0].floor}层 ${res.stuobj[0].room}房`;
            // 根据楼栋获取宿舍学生信息
            getroomstuinfo({
              building: res.stuobj[0].building,
              room: res.stuobj[0].room,
            })
              .then((res1) => {
                if (res1.status == 0) {
                  jobtype.value = store.state.dsuser.dsuserInfo.job;
                  res1.roomstuinfo.forEach((item) => {
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

                  studorminfolist.list = res1.roomstuinfo;
                } else {
                  console.log(res1.message);
                }
              })
              .catch((err1) => {
                console.log(err1.message);
              });
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    const deleteid = ref(0);
    const deletestr = ref("确认要转让舍长职务给该舍友吗？");
    const deletetype = ref(14);
    const deletejob = ref(0);
    const changejob = (toid, tojob) => {
      // console.log(toid);
      if (tojob == "舍员") {
        tojob = 0;
      } else if (tojob == "舍长") {
        tojob = 1;
      } else if (tojob == "层长") {
        tojob = 2;
      } else if (tojob == "舍长兼层长") {
        tojob = 3;
      }
      deletejob.value = tojob;
      deleteid.value = toid;
      deletestr.value = "确认要转让舍长职务给该舍友吗？";
      deletetype.value = 14;
    };

    onMounted(() => {
      jobtype.value = store.state.dsuser.dsuserInfo.job;
      setroom();
      watch(
        () => store.state.dsdorm.stuinfostatus,
        () => {
          setroom();
        }
      );
    });

    return {
      stuaddress,
      studorminfolist,
      jobtype,
      changejob,
      deleteid,
      deletestr,
      deletetype,
      deletejob,
      setroom,
    };
  },
};
</script>

<style>
.sdcontainer {
  width: 756px;
  height: 650px;
  background-color: var(--primary-deep-gray);
  box-shadow: 0px 0px 4px 4px var(--shadow);
  border-radius: 10px;
  box-sizing: border-box;
  display: inline-block;
  margin-left: 12px;
  vertical-align: top;
  margin-top: 20px;
  /* margin: 12px 120px; */
  /* position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%); */
}
.sdtitle {
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: var(--primary-gray-black);
  box-sizing: border-box;
  border-radius: 10px 10px 0 0;
  border-bottom: 2px solid var(--primary-mostlight-gray);
  color: var(--text-green);
  font-size: 24px;
}
.sditem {
  background-color: var(--primary-light-gray);
  display: inline-block;
  width: 340px;
  border-radius: 5px;
  margin-left: 24px;
  margin-top: 20px;
}
.sditemtitle {
  position: relative;
  height: 40px;
}
.sditemtitle h1 {
  position: absolute;
  left: 16px;
  top: 6px;
  color: var(--text-green);
  margin: 0;
  font-size: 40px;
  font-weight: 500;
}
.sditemjob {
  float: right;
  width: 280px;
  height: 100%;
  box-sizing: border-box;
  border-bottom: 2px solid var(--primary-mostlight-gray);
  line-height: 38px;
}
.sditemjob span:nth-of-type(1) {
  float: left;
  font-size: 18px;
  color: var(--text-green);
  margin-left: 12px;
  margin-right: 18px;
}
.sditemjob span:nth-of-type(2) {
  float: right;
  font-size: 18px;
  color: var(--text-green);
  margin-right: 12px;
}
.sditemjob button {
  width: 60px;
  height: 26px;
  border-radius: 5px;
  border: 0;
  background-color: var(--primary-light-green);
  color: var(--text-gray-black);
  font-weight: 700;
  cursor: pointer;
  margin-top: 6px;
}
.sditemjob button:hover {
  background-color: var(--primary-deep-green);
}
.sditemcontainer {
  padding-left: 24px;
}
.sditemcontainer p {
  color: var(--text-green);
  margin: 12px 0 12px 0;
}
.sditemcontainer span {
  color: var(--text-gray);
  margin-right: 12px;
}
</style>