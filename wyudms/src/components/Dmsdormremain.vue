<template>
  <Transition name="room">
    <div class="dormroommask" v-show="dormremainshow">
      <div class="dormroomcontainer">
        <p class="dormroomcontainertitle">
          {{ roomstu.roomname.building }}栋 {{ roomstu.roomname.room }}
        </p>
        <el-icon
          style="
            position: absolute;
            right: 8px;
            top: 6px;
            font-size: 28px;
            color: var(--primary-green);
            cursor: pointer;
          "
          @click="dormremainhide"
          ><CloseBold
        /></el-icon>
        <div class="dormroomitem" v-for="stu in roomstu.stulist" :key="stu">
          <p class="dormroomitemtitle">
            {{ stu.job }}<span style="float: right">{{ stu.sex }}</span>
          </p>
          <span class="dormroomitembed">{{ stu.bed }}</span>
          <div class="dormroomiteminfo">
            <p><span>姓名:</span>{{ stu.stuname }}</p>
            <p><span>班别:</span>{{ stu.stuclass }}</p>
            <p><span>学号:</span>{{ stu.stunumber }}</p>
            <p><span>手机:</span>{{ stu.phone }}</p>
            <p><span>专业:</span>{{ stu.major }}</p>
            <p><span>辅导员:</span>{{ stu.counsellor }}</p>
          </div>
        </div>
        <div class="nosturoom" v-if="roomstu.stulist.length == 0">
          该宿舍暂无入住学生
        </div>
      </div>
    </div>
  </Transition>
</template>
  
<script>
import { CloseBold } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
export default {
  name: "dmsdormremain",
  components: {
    CloseBold,
  },
  setup() {
    const store = useStore();

    const dormremainshow = ref(false);

    const dormremainhide = () => {
      dormremainshow.value = false;
    };

    let roomstu = reactive({
      stulist: [
        {
          id: 0,
          bed: "0",
          sex: "男",
          counsellor: "none",
          job: "舍员",
          major: "none",
          phone: "00000000000",
          stuclass: "000000",
          stuname: "none",
          stunumber: "0000000000",
        },
        {
          id: 0,
          bed: "0",
          sex: "男",
          counsellor: "none",
          job: "舍员",
          major: "none",
          phone: "00000000000",
          stuclass: "000000",
          stuname: "none",
          stunumber: "0000000000",
        },
        {
          id: 0,
          bed: "0",
          sex: "男",
          counsellor: "none",
          job: "舍员",
          major: "none",
          phone: "00000000000",
          stuclass: "000000",
          stuname: "none",
          stunumber: "0000000000",
        },
        {
          id: 0,
          bed: "0",
          sex: "男",
          counsellor: "none",
          job: "舍员",
          major: "none",
          phone: "00000000000",
          stuclass: "000000",
          stuname: "none",
          stunumber: "0000000000",
        },
      ],
      roomname: {
        building: "00",
        room: "000",
      },
    });

    onMounted(() => {
      watch(
        () => store.state.dsdorm.dormremainstatus,
        () => {
          roomstu.stulist = store.state.dsdorm.roomstu;
          roomstu.roomname = store.state.dsdorm.roomname;
          dormremainshow.value = true;
        }
      );
    });
    return { dormremainshow, dormremainhide, roomstu };
  },
};
</script>
  
  <style scoped>
.dormroommask {
  background-color: var(--transparent);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 101;
}
.dormroomcontainer {
  background-color: var(--primary-gray-black);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 460px;
  padding: 0 20px;
  border-radius: 10px;
}
.dormroomcontainertitle {
  margin: 0;
  margin-bottom: 10px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-green);
  border-bottom: 2px solid var(--primary-mostlight-gray);
  padding-top: 4px;
  padding-bottom: 4px;
}
.dormroomitem {
  border-radius: 5px;
  display: inline-block;
  width: 220px;
  background-color: var(--primary-light-gray);
  position: relative;
  padding: 10px;
  padding-top: 8px;
  padding-bottom: 4px;
  margin-right: 20px;
  margin-bottom: 20px;
}
.dormroomitem:nth-child(2n) {
  margin-right: 0;
}
.dormroomitemtitle {
  height: 20px;
  border-bottom: 2px solid var(--primary-mostlight-gray);
  line-height: 20px;
  display: inline-block;
  width: 152px;
  margin: 0;
  margin-bottom: 5px;
  color: var(--text-green);
  padding-bottom: 4px;
  padding-right: 18px;
  padding-left: 8px;
}
.dormroomitembed {
  position: absolute;
  top: 5px;
  right: 12px;
  font-size: 36px;
  color: var(--text-green);
}
.dormroomiteminfo p {
  margin: 0;
  color: var(--text-green);
  margin-bottom: 5px;
}
.dormroomiteminfo p:nth-of-type(7) {
  margin-bottom: 0;
}
.dormroomiteminfo span {
  color: var(--text-gray);
  margin-right: 12px;
}
.nosturoom {
  width: 500px;
  height: 400px;
  line-height: 400px;
  font-size: 24px;
  color: var(--text-gray);
  text-align: center;
}
</style>