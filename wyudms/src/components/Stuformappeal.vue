<template>
  <Transition name="aform">
    <div class="appealformmask" v-if="appealformshow">
      <div class="appealformcontainer">
        <div class="appealformtitle">
          {{ appealtitle }}
          <el-icon
            style="
              position: absolute;
              right: 5px;
              top: 5px;
              font-size: 26px;
              color: var(--primary-green);
              cursor: pointer;
            "
            ><CloseBold @click="appealformhide"
          /></el-icon>
        </div>
        <el-form :inline="true" :model="appealeditobj" class="appealform">
          <el-form-item label="类型" style="width: 30%">
            <el-select v-model="appealeditobj.type">
              <el-option label="建议" value="建议" />
              <el-option label="投诉" value="投诉" />
            </el-select>
          </el-form-item>
          <el-form-item label="正文" style="width: 98%">
            <el-input
              class="contentrequired"
              v-model="appealeditobj.content"
              type="textarea"
              placeholder="输入正文"
              resize="none"
              rows="8"
            />
          </el-form-item>
          <el-form-item style="margin-right: 8px; float: right">
            <el-button
              type="primary"
              @click="onappealSubmit"
              style="font-weight: 700; font-size: 16px"
              >确定</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </Transition>
</template>

<script>
import { CloseBold } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { getAppealinfo, updateappeal, addappeal } from "@/api/appeal";
export default {
  name: "stuformappeal",
  components: {
    CloseBold,
  },
  setup(props, { emit }) {
    const store = useStore();
    const appealformshow = ref(false);
    const appealtitle = ref("更改诉求");
    const appealformhide = () => {
      appealformshow.value = false;
    };

    const appealeditobj = reactive({
      id: 0,
      type: "建议",
      content: "",
    });

    const onappealSubmit = () => {
      if (
        appealeditobj.type.trim() == "" ||
        appealeditobj.content.trim() == ""
      ) {
        store.commit("setNoticeContent", "正文不能为空");
      } else {
        // console.log("根据类型发送诉求，成功后");
        if (store.state.dsappeal.appealformtype == 0) {
          // 发布请求
          addappeal({
            type: appealeditobj.type,
            content: appealeditobj.content,
            stuid: store.state.dsuser.dsuserInfo.id,
          })
            .then((res) => {
              if (res.status == 0) {
                store.commit("setNoticeContent", res.message);
                emit("settable");
                appealformshow.value = false;
              } else {
                store.commit("setNoticeContent", res.message);
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
        } else if (store.state.dsappeal.appealformtype == 1) {
          // 修改请求
          updateappeal(appealeditobj)
            .then((res) => {
              if (res.status == 0) {
                store.commit("setNoticeContent", res.message);
                emit("settable");
                appealformshow.value = false;
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

    onMounted(() => {
      watch(
        () => store.state.dsappeal.appealformstatus,
        () => {
          if (store.state.dsappeal.appealformtype == 0) {
            // 0为发布1为修改
            appealtitle.value = "发布诉求";
            appealeditobj.content = "";
            appealeditobj.type = "建议";
            appealformshow.value = true;
          } else if (store.state.dsappeal.appealformtype == 1) {
            appealtitle.value = "更改诉求";
            getAppealinfo({ id: store.state.dsappeal.appealformid })
              .then((res) => {
                if (res.status == 0) {
                  appealeditobj.id = res.appealinfo[0].id;
                  appealeditobj.type = res.appealinfo[0].type;
                  appealeditobj.content = res.appealinfo[0].content;
                  appealformshow.value = true;
                } else {
                  console.log(res.message);
                }
              })
              .catch((err) => {
                console.log(err.message);
              });
          }
        }
      );
    });

    return {
      appealformshow,
      appealtitle,
      appealformhide,
      appealeditobj,
      onappealSubmit,
    };
  },
};
</script>

<style>
.appealformmask {
  position: absolute;
  left: 0;
  top: 0;
  background-color: var(--transparent);
  width: 100%;
  height: 100%;
  z-index: 98;
}
.appealformcontainer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  background-color: var(--primary-gray-black);
  width: 450px;
  height: 345px;
}
.appealformtitle {
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  color: var(--text-green);
  border-bottom: 2px solid var(--primary-mostlight-gray);
  box-sizing: border-box;
  position: relative;
  text-align: center;
}
.appealform textarea::-webkit-scrollbar {
  width: 6px;
  height: 0;
}
.appealform textarea::-webkit-scrollbar-thumb {
  border-radius: 3px;
  /* background-color: var(--primary-morelight-gray); */
  background-color: var(--primary-mostlight-gray);
}
.appealform textarea::-webkit-scrollbar-thumb:hover {
  /* background-color: var(--primary-mostlight-gray); */
  background-color: var(--primary-gray);
}
.appealform {
  width: 100%;
  padding-left: 12px;
  padding-top: 12px;
  padding-right: 12px;
  box-sizing: border-box;
}
.appealform .el-form-item {
  margin-bottom: 18px;
}
</style>