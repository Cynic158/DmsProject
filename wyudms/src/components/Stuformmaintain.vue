<template>
  <Transition name="mform">
    <div class="stumtformmask" v-show="stuformmtshow">
      <div class="stumtformcontainer">
        <div class="stumtformtitle">
          申报维修
          <el-icon
            style="
              position: absolute;
              right: 4px;
              top: 4px;
              font-size: 24px;
              color: var(--primary-green);
              cursor: pointer;
            "
            ><CloseBold @click="stuformmthide"
          /></el-icon>
        </div>
        <el-form :model="stumtformobj" class="stumtform">
          <el-form-item
            label="维修类型"
            style="width: 220px; margin-right: 32px"
          >
            <el-cascader
              v-model="stumtformobj.type"
              :options="siftoptions"
              :props="siftprops"
              placeholder="水电/灯管"
            />
          </el-form-item>
          <el-form-item label="预约时间">
            <!-- <el-input v-model="stumtformobj.appoint" placeholder="预约时间" /> -->
            <div class="timepicker">
              <el-date-picker
                v-model="stumtformobj.appoint"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="defaultTime"
                value-format="MM-DD hh:mm"
              />
            </div>
          </el-form-item>
          <el-form-item label="维修描述">
            <!-- <el-input v-model="stumtformobj.content" placeholder="维修描述" /> -->
            <el-input
              v-model="stumtformobj.content"
              type="textarea"
              placeholder="输入描述"
              resize="none"
              rows="6"
            />
          </el-form-item>
          <el-form-item label="上传图片">
            <el-upload
              v-model:file-list="stumtformobj.imglist"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :auto-upload="false"
              accept=".jpeg, .jpg, .png"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button
              type="primary"
              @click="stuaddmaintain"
              style="font-weight: 700; font-size: 16px"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </div>
  </Transition>
</template>

<script>
import { addmaintain } from "@/api/maintain";
import { CloseBold, Plus } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
export default {
  name: "stuformmaintain",
  components: {
    CloseBold,
    Plus,
  },
  setup() {
    const store = useStore();
    const stuformmtshow = ref(false);
    const stuformmthide = () => {
      stuformmtshow.value = false;
    };

    const siftoptions = [
      {
        value: "水电",
        label: "水电",
        children: [
          {
            value: "灯管",
            label: "灯管",
          },
          {
            value: "风扇",
            label: "风扇",
          },
          {
            value: "水龙头",
            label: "水龙头",
          },
          {
            value: "花洒",
            label: "花洒",
          },
          {
            value: "空调",
            label: "空调",
          },
          {
            value: "冷水管",
            label: "冷水管",
          },
          {
            value: "热水管",
            label: "热水管",
          },
          {
            value: "开关",
            label: "开关",
          },
          {
            value: "插座",
            label: "插座",
          },
          {
            value: "饮水机",
            label: "饮水机",
          },
        ],
      },
      {
        value: "土建",
        label: "土建",
        children: [
          {
            value: "厕所门",
            label: "厕所门",
          },
          {
            value: "阳台门",
            label: "阳台门",
          },
          {
            value: "浴室门",
            label: "浴室门",
          },
          {
            value: "进户门",
            label: "进户门",
          },
          {
            value: "窗户",
            label: "窗户",
          },
          {
            value: "天花板",
            label: "天花板",
          },
          {
            value: "墙壁",
            label: "墙壁",
          },
          {
            value: "门锁",
            label: "门锁",
          },
          {
            value: "洗手盘",
            label: "洗手盘",
          },
          {
            value: "厕所",
            label: "厕所",
          },
          {
            value: "下水道",
            label: "下水道",
          },
        ],
      },
      {
        value: "家具",
        label: "家具",
        children: [
          {
            value: "凳子",
            label: "凳子",
          },
          {
            value: "床板",
            label: "床板",
          },
          {
            value: "衣柜",
            label: "衣柜",
          },
          {
            value: "蚊帐架",
            label: "蚊帐架",
          },
          {
            value: "床梯",
            label: "床梯",
          },
          {
            value: "床架",
            label: "床架",
          },
          {
            value: "桌面",
            label: "桌面",
          },
        ],
      },
      {
        value: "其他",
        label: "其他",
        children: [
          {
            value: "灭鼠",
            label: "灭鼠",
          },
          {
            value: "灭蟑螂",
            label: "灭蟑螂",
          },
          {
            value: "灭蚁",
            label: "灭蚁",
          },
          {
            value: "其他",
            label: "其他",
          },
        ],
      },
    ];
    const siftprops = {
      expandTrigger: "hover",
    };

    const stumtformobj = reactive({
      type: ["水电", "灯管"],
      appoint: "",
      content: "",
      imglist: [],
    });

    const defaultTime = new Date();

    const stuaddmaintain = () => {
      let typestr = stumtformobj.type.join("-");
      if (!stumtformobj.appoint) {
        store.commit("setNoticeContent", "请选择预约时间");
      } else if (stumtformobj.content.trim() == "") {
        store.commit("setNoticeContent", "描述不可为空");
      } else {
        // 图片非必填，故直接上传即可
        //   console.log(stumtformobj.imglist);
        let appointstr = stumtformobj.appoint.join("--");
        let formdata = new FormData();
        formdata.append("stuid", store.state.dsuser.dsuserInfo.id);
        formdata.append("type", typestr);
        formdata.append("appoint", appointstr);
        formdata.append("content", stumtformobj.content);

        let imgi = 1;
        stumtformobj.imglist.forEach((item) => {
          formdata.append(`imgfiles${imgi}`, item.raw);
          imgi++;
        });
        //   formdata.append("imgfiles", stumtformobj.imglist);

        addmaintain(formdata)
          .then((res) => {
            if (res.status == 0) {
              store.commit("setNoticeContent", res.message);
              // 同时刷线左边列表
              store.commit("dsmaintain/setStumtListStatus");
              stuformmtshow.value = false;
            } else {
              console.log(res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
      //   console.log(stumtformobj.imglist);
    };

    const dialogImageUrl = ref("");
    const dialogVisible = ref(false);

    const handlePictureCardPreview = (uploadFile) => {
      dialogImageUrl.value = uploadFile.url;
      dialogVisible.value = true;
    };

    onMounted(() => {
      watch(
        () => store.state.dsmaintain.stumtformstatus,
        () => {
          stumtformobj.type = ["水电", "灯管"];
          stumtformobj.appoint = "";
          stumtformobj.content = "";
          stumtformobj.imglist = [];
          stuformmtshow.value = true;
        }
      );
      watch(
        () => stumtformobj.imglist,
        () => {
          if (stumtformobj.imglist.length > 5) {
            stumtformobj.imglist = stumtformobj.imglist.slice(-5);
          }
        }
      );
    });

    return {
      stuformmtshow,
      stuformmthide,
      siftoptions,
      siftprops,
      stumtformobj,
      stuaddmaintain,
      defaultTime,
      dialogImageUrl,
      dialogVisible,
      handlePictureCardPreview,
    };
  },
};
</script>

<style>
.el-dialog__headerbtn {
  font-size: 30px;
}
.el-dialog {
  margin: 0;
  width: 1000px;
  height: 570px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--primary-gray-black);
  border-radius: 10px;
}
.el-dialog__body {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-dialog img {
  height: 500px;
  max-width: 900px;
  border-radius: 10px;
  border: 2px solid var(--primary-gray);
  object-fit: cover;
}
.el-upload--picture-card {
  background-color: transparent !important;
}
.stumtform textarea::-webkit-scrollbar {
  width: 6px;
  height: 0;
}
.stumtform textarea::-webkit-scrollbar-thumb {
  border-radius: 3px;
  /* background-color: var(--primary-morelight-gray); */
  background-color: var(--primary-mostlight-gray);
}
.stumtform textarea::-webkit-scrollbar-thumb:hover {
  /* background-color: var(--primary-mostlight-gray); */
  background-color: var(--primary-gray);
}
.stumtformmask {
  background-color: var(--transparent);
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
}
.stumtformcontainer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 560px;
  /* height: 400px; */
  border-radius: 10px;
  background-color: var(--primary-gray-black);
}
.stumtformtitle {
  height: 32px;
  line-height: 32px;
  font-size: 20px;
  color: var(--text-green);
  text-align: center;
  border-bottom: 2px solid var(--primary-mostlight-gray);
}
.stumtform {
  padding: 12px;
}
</style>