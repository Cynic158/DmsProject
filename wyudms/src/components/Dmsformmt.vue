<template>
  <Transition name="mt">
    <div class="mtmark" v-show="mtformhide">
      <div class="mtcontainer">
        <el-icon
          @click="mthide"
          style="
            position: absolute;
            right: 8px;
            top: 8px;
            font-size: 24px;
            color: var(--primary-green);
            z-index: 90;
            cursor: pointer;
          "
          ><CloseBold
        /></el-icon>
        <span class="mttitle">处理维修单</span>
        <span class="mtspan"
          ><span>维修类型:</span>{{ mtinfoobj.info[0].type }}</span
        >
        <span class="mtspan"
          ><span>楼栋房间:</span>{{ mtinfoobj.info[0].room }}</span
        >
        <span class="mtspan"
          ><span>申报时间:</span>{{ mtinfoobj.info[0].time }}</span
        >
        <span class="mtspan"
          ><span>预约时间:</span>{{ mtinfoobj.info[0].appoint }}</span
        >
        <span class="mtspan"
          ><span>手机号码:</span>{{ mtinfoobj.info[0].phone }}</span
        >
        <span class="mtspan"
          ><span>处理状态:</span>{{ mtinfoobj.info[0].status }}</span
        >
        <span class="mtlabel">维修描述</span
        ><textarea
          class="mttextarea"
          readonly
          v-model="mtinfoobj.info[0].content"
        ></textarea>
        <span class="mtlabel">维修图片</span>
        <div class="imggroup">
          <div class="mtnoimg" v-if="mtinfoobj.info[0].img.length == 0">
            无图片
          </div>
          <el-image
            v-if="mtimgurl"
            class="mtimg"
            :src="mtimgurl"
            :zoom-rate="1.2"
            :preview-src-list="mtimglist.list"
            :initial-index="0"
            fit="cover"
            :preview-teleported="true"
          />
          <el-image
            v-if="mtimgurl1"
            class="mtimg"
            :src="mtimgurl1"
            :zoom-rate="1.2"
            :preview-src-list="mtimglist.list"
            :initial-index="1"
            fit="cover"
            :preview-teleported="true"
          />
          <el-image
            v-if="mtimgurl2"
            class="mtimg"
            :src="mtimgurl2"
            :zoom-rate="1.2"
            :preview-src-list="mtimglist.list"
            :initial-index="2"
            fit="cover"
            :preview-teleported="true"
          />
        </div>
        <el-form :inline="true" :model="mtinfoobj.info[0]" class="mtform">
          <el-form-item label="维修人员" style="width: 50%">
            <el-select
              v-model="mtinfoobj.info[0].mtman"
              style="width: 100%"
              @change="mtmanchange"
            >
              <el-option
                v-for="item in mtmanoption.arr"
                :key="item"
                :label="item"
                :value="item"
              />
              <el-option label="暂不选" value="" />
            </el-select>
            <span
              style="
                color: var(--text-green);
                position: absolute;
                left: 150px;
                top: 0px;
              "
              >{{ mtinfoobj.info[0].mtphone }}</span
            >
          </el-form-item>
          <el-form-item label="维修回信" style="width: 95%">
            <el-input
              style="width: 100%"
              v-model="mtinfoobj.info[0].mtcontent"
              type="textarea"
              placeholder="输入回信"
              resize="none"
              rows="4"
            />
          </el-form-item>
          <el-form-item
            style="margin: 12px 20px 0 12px; float: right"
            v-if="mtinfoobj.info[0].status == '处理中'"
          >
            <el-button
              type="primary"
              @click="onEditDone"
              style="font-weight: 700; font-size: 16px"
              >完成</el-button
            >
          </el-form-item>
          <el-form-item
            style="margin: 12px 20px 0 12px; float: right"
            v-if="mtinfoobj.info[0].status == '未处理'"
          >
            <el-button
              type="primary"
              @click="onEditAccept"
              style="font-weight: 700; font-size: 16px"
              >受理</el-button
            >
          </el-form-item>
          <el-form-item style="margin: 12px 0 0 0; float: right">
            <el-button
              type="primary"
              @click="onEditCancel"
              style="font-weight: 700; font-size: 16px"
              >驳回</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </Transition>
  <Dmsconfirm
    style="z-index: 99"
    v-model:handleId="deleteid"
    :confirmStr="deletestr"
    @settable="settable"
    :handleType="deletetype"
    :handleMessage="deletemessage"
  ></Dmsconfirm>
</template>

<script>
import Dmsconfirm from "@/components/Dmsconfirm.vue";
import { getmaintainbyid, acceptmaintain, donemaintain } from "@/api/maintain";
import { getPersonnelList, getPersonnelPhone } from "@/api/personnel";
import { CloseBold } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
export default {
  name: "dmsformmt",
  components: {
    CloseBold,
    Dmsconfirm,
  },
  setup() {
    const store = useStore();

    let mtinfoobj = reactive({
      info: [
        {
          id: 0,
          appoint: "04-10 12:00--04-17 12:00",
          building: "48",
          room: "202",
          content: "风扇坏了",
          img: [],
          mtcontent: "已受理",
          mtman: "方某",
          mtphone: "",
          phone: "13356580997",
          status: "未处理",
          time: "2023-04-10 21:00",
          type: "水电-风扇",
        },
      ],
    });

    let mtimglist = reactive({
      list: [
        "http://127.0.0.1/dmssrc/simple.jpg",
        "http://127.0.0.1/dmssrc/simple1.jpg",
        "http://127.0.0.1/dmssrc/simple2.jpg",
      ],
    });

    let mtimgurl = ref("http://127.0.0.1/dmssrc/simple.jpg");
    let mtimgurl1 = ref("http://127.0.0.1/dmssrc/simple1.jpg");
    let mtimgurl2 = ref("http://127.0.0.1/dmssrc/simple2.jpg");

    let mtmanoption = reactive({
      arr: ["李某", "方某", "张某"],
    });

    const mtmanchange = (val) => {
      console.log(val);
      getPersonnelPhone({ pname: val })
        .then((res) => {
          if (res.status == 0) {
            console.log(res.personnelphone);
            if (res.personnelphone.length == 0) {
              mtinfoobj.info[0].mtphone = "";
            }
            mtinfoobj.info[0].mtphone = res.personnelphone[0].phone;
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    const mtformhide = ref(false);
    const mthide = () => {
      mtformhide.value = false;
    };

    const onEditAccept = () => {
      console.log(mtinfoobj.info[0].id);
      acceptmaintain({
        id: mtinfoobj.info[0].id,
        mtman: mtinfoobj.info[0].mtman,
        mtcontent: mtinfoobj.info[0].mtcontent,
        mtphone: mtinfoobj.info[0].mtphone,
      })
        .then((res) => {
          if (res.status == 0) {
            store.commit("setNoticeContent", res.message);
            settable();
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    const deleteid = ref(0);
    const deletestr = ref("确定要取消该维修单吗");
    const deletetype = ref(5);
    const deletemessage = ref("");
    const onEditCancel = () => {
      deleteid.value = mtinfoobj.info[0].id;
      deletestr.value = "确定要取消该维修单吗";
      deletetype.value = 5;
      deletemessage.value = mtinfoobj.info[0].mtcontent;
    };

    const settable = () => {
      mtformhide.value = false;
      store.commit("dsmaintain/setMtTableStatus");
    };

    const onEditDone = () => {
      // console.log(mtinfoobj.info[0].id);
      deleteid.value = mtinfoobj.info[0].id;
      deletestr.value = "确定该维修单已完成吗";
      deletetype.value = 18;
      deletemessage.value = mtinfoobj.info[0].mtcontent;
    };

    onMounted(() => {
      getPersonnelList({ type: 1 }).then((res) => {
        if (res.status == 0) {
          let parr = [];
          res.personnellist.forEach((item) => {
            parr.push(item.pname);
          });
          mtmanoption.arr = parr;
        }
      });
      watch(
        () => store.state.dsmaintain.editmtstatus,
        () => {
          getmaintainbyid({ id: store.state.dsmaintain.editmtid })
            .then((res) => {
              if (res.status == 0) {
                res.maintaininfo[0].room =
                  res.maintaininfo[0].building +
                  "栋" +
                  res.maintaininfo[0].room;
                if (!res.maintaininfo[0].img) {
                  res.maintaininfo[0].img = [];
                } else {
                  res.maintaininfo[0].img = res.maintaininfo[0].img.split(" ");
                }
                if (res.maintaininfo[0].status == 0) {
                  res.maintaininfo[0].status = "未处理";
                } else if (res.maintaininfo[0].status == 1) {
                  res.maintaininfo[0].status = "处理中";
                }
                if (!res.maintaininfo[0].mtcontent) {
                  res.maintaininfo[0].mtcontent = "";
                }
                if (!res.maintaininfo[0].mtman) {
                  res.maintaininfo[0].mtman = "";
                }
                if (!res.maintaininfo[0].mtphone) {
                  res.maintaininfo[0].mtphone = "";
                }
                mtinfoobj.info = res.maintaininfo;
                mtimgurl.value = mtinfoobj.info[0].img[0];
                mtimgurl1.value = mtinfoobj.info[0].img[1];
                mtimgurl2.value = mtinfoobj.info[0].img[2];
                mtimglist.list = mtinfoobj.info[0].img;
              } else {
                console.log(res.message);
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
          mtformhide.value = true;
        }
      );
    });

    return {
      onEditAccept,
      onEditCancel,
      onEditDone,
      mtimglist,
      mtimgurl,
      mtimgurl1,
      mtimgurl2,
      mtformhide,
      mthide,
      mtinfoobj,
      deleteid,
      deletestr,
      deletetype,
      deletemessage,
      settable,
      mtmanoption,
      mtmanchange,
    };
  },
};
</script>

<style>
.mtcontainer textarea::-webkit-scrollbar {
  width: 6px;
  height: 0;
}
.mtcontainer textarea::-webkit-scrollbar-thumb {
  border-radius: 3px;
  /* background-color: var(--primary-morelight-gray); */
  background-color: var(--primary-mostlight-gray);
}
.mtcontainer textarea::-webkit-scrollbar-thumb:hover {
  /* background-color: var(--primary-mostlight-gray); */
  background-color: var(--primary-gray);
}
.mtform {
  margin-left: 12px;
}
.mttextarea {
  width: 278px;
  height: 80px;
  resize: none;
  border-radius: 5px;
  background-color: var(--primary-deep-gray);
  padding: 10px;
  padding-top: 6px;
  color: var(--text-gray);
  vertical-align: top;
  font-size: 14px;
  margin-top: 12px;
}
.mttextarea:focus {
  outline: 0;
  border-color: var(--primary-light-green);
}
.mtlabel {
  color: var(--text-gray);
  margin-right: 12px;
  margin-left: 12px;
  font-size: 14px;
  margin-top: 16px;
  display: inline-block;
}
.mtmark {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 88;
  background-color: var(--transparent);
  width: 100%;
  height: 100%;
}
.mtcontainer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 89;
  border-radius: 10px;
  background-color: var(--primary-gray-black);
  width: 400px;
  height: 640px;
  padding: 5px 10px;
}
.mttitle {
  width: 100%;
  height: 32px;
  display: block;
  line-height: 32px;
  text-align: center;
  color: var(--text-green);
  font-size: 20px;
  border-bottom: 1px solid var(--primary-gray);
  margin-bottom: 5px;
}
.mtcontainer .mtspan {
  display: block;
  height: 32px;
  color: var(--text-green);
  line-height: 32px;
  margin-left: 12px;
}
.mtcontainer .mtspan span {
  color: var(--text-gray);
  margin-right: 12px;
}
.imggroup {
  display: inline-block;
  width: 298px;
  height: 80px;
  /* border: 1px solid var(--primary-gray); */
  vertical-align: top;
  margin-top: 12px;
  margin-bottom: 12px;
  box-sizing: border-box;
}
.mtimg {
  width: 80px;
  height: 80px;
  border-radius: 5px;
  border: 2px solid var(--primary-gray);
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 28px;
  box-sizing: border-box;
}
.mtimg:nth-of-type(3) {
  margin-right: 0;
}
.mtnoimg {
  width: 80px;
  height: 80px;
  border-radius: 5px;
  border: 2px solid var(--primary-mostlight-gray);
  box-sizing: border-box;
  text-align: center;
  line-height: 76px;
  color: var(--text-gray);
}
</style>