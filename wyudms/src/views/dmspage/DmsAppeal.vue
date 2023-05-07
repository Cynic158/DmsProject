<template>
  <div style="position: relative">
    <div class="appealContainer">
      <p class="appealTitle">{{ appealinfo.info[0].type }}</p>
      <textarea
        class="appealContent"
        readonly
        v-model="appealinfo.info[0].content"
      ></textarea>
      <p class="appealFoot">
        <span class="appealTime">时间: {{ appealinfo.info[0].time }}</span>
        <span class="appealMan">学生: {{ appealinfo.info[0].appealstu }}</span>
      </p>
    </div>
    <el-table
      class="appealtable"
      :data="appeallist.list"
      @row-click="rowclick"
      style="
        width: calc(100% - 430px);
        margin-bottom: 18px;
        display: inline-block;
        position: absolute;
        left: 430px;
        top: 20px;
      "
    >
      <el-table-column align="center" label="时间" prop="time" width="200" />
      <el-table-column align="center" label="类型" prop="type" width="60" />
      <el-table-column
        align="center"
        label="学生"
        prop="appealstu"
        width="100"
      />
      <el-table-column align="center" label="学号" prop="stunumber" />
      <el-table-column align="center" label="手机" prop="phone" />
      <el-table-column align="center" label="楼栋" prop="building" width="60" />
      <el-table-column align="center" label="房间" prop="room" width="60" />
      <el-table-column align="center" prop="id" width="100">
        <template #header> 操作 </template>
        <template #default="scope">
          <el-button
            style="
              color: var(--text-gray-black);
              /* color: var(--text-deep-gray); */
              font-weight: 700;
            "
            size="small"
            type="danger"
            @click="handleAppealDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <button class="clearAppeal" @click="clearappeal">清空诉求</button>
    <div class="elpageAppeal">
      <el-pagination
        v-model:current-page="currentAppealPage"
        :page-size="12"
        :disabled="appealPageDisabled"
        background
        layout="total, prev, pager, next, jumper"
        :total="appealtotal"
        @current-change="handleAppealCurrentChange"
      />
    </div>
  </div>
  <Dmsconfirm
    style="z-index: 99"
    v-model:handleId="deleteid"
    :confirmStr="deletestr"
    @settable="settable"
    :handleType="deletetype"
  ></Dmsconfirm>
</template>

<script>
import Dmsconfirm from "@/components/Dmsconfirm.vue";
import { getAppealList, getAppealinfo } from "@/api/appeal";
import { onActivated, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
export default {
  name: "dmsappeal",
  components: {
    Dmsconfirm,
  },
  setup() {
    let appeallist = reactive({
      list: [
        {
          id: 1,
          time: "2023-02-17 23:26",
          type: "建议",
          appealstu: "方文轩",
          stunumber: "3119001333",
          phone: "13356580997",
          building: "48",
          room: "202",
        },
      ],
    });

    let appealinfo = reactive({
      info: [
        {
          type: "类型",
          content: "正文",
          time: "2023-03-01 17:16",
          appealstu: "学生一",
        },
      ],
    });

    const store = useStore();

    const settable = () => {
      setappealtable(1);
      setappealinfo(0);
    };
    const setappealtable = (val) => {
      getAppealList({ page: val })
        .then((res) => {
          if (res.status == 0) {
            appeallist.list = res.appeallist;
            appealtotal.value = Object.values(res.appealcount[0])[0];
            changebg();
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    const setappealinfo = (val) => {
      getAppealinfo({ id: val })
        .then((res) => {
          if (res.status == 0) {
            if (res.appealinfo.length == 0) {
              appealinfo.info = [
                {
                  type: "类型",
                  content: "正文",
                  time: "2023-03-01 17:16",
                  appealstu: "学生一",
                },
              ];
            } else {
              appealinfo.info = res.appealinfo;
              store.commit(
                "dsappeal/setActiveAppealpage",
                currentAppealPage.value
              );
            }
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    const deleteid = ref(0);
    const deletestr = ref("确定要删除该诉求吗");
    const deletetype = ref(2);
    const handleAppealDelete = (index, row) => {
      console.log(index, row);
      deleteid.value = row.id;
      deletestr.value = "确定要删除该诉求吗";
      deletetype.value = 2;
    };

    const currentAppealPage = ref(1);
    const appealtotal = ref(100);
    const appealPageDisabled = ref(false);
    const handleAppealCurrentChange = (val) => {
      setappealtable(val);
    };

    const changebg = () => {
      setTimeout(() => {
        let index = 0;
        document
          .querySelectorAll(".appealtable .el-table__row")
          .forEach((item) => {
            if (!item.getAttribute("index")) {
              item.addEventListener("click", function () {
                store.commit(
                  "dsappeal/setActiveAppeal",
                  item.getAttribute("index")
                );
                document
                  .querySelectorAll(".appealtable .el-table__row")
                  .forEach((item1) => {
                    item1.classList.remove("activeappealcolor");
                  });
                item.classList.add("activeappealcolor");
              });
            }
            item.setAttribute("index", index);
            index++;
          });
        if (store.state.dsappeal.activeappealpage == currentAppealPage.value) {
          document
            .querySelectorAll(".appealtable .el-table__row")
            .forEach((item) => {
              if (
                item.getAttribute("index") == store.state.dsappeal.activeappeal
              ) {
                item.classList.add("activeappealcolor");
              }
            });
        } else {
          document
            .querySelectorAll(".appealtable .el-table__row")
            .forEach((item) => {
              item.classList.remove("activeappealcolor");
            });
        }
      }, 500);
    };
    const rowclick = function (row) {
      // console.log(row);
      setappealinfo(row.id);
    };

    const clearappeal = () => {
      if (appeallist.list.length == 0) {
        store.commit("setNoticeContent", "当前已无诉求");
      } else {
        deleteid.value = -1;
        deletestr.value = "确定要清空所有诉求吗";
        deletetype.value = 3;
      }
    };

    onMounted(() => {
      setappealtable(1);
      setappealinfo(0);
    });

    onActivated(() => {
      if (appeallist.list.length != 0) {
        setappealtable(currentAppealPage.value);
      } else {
        setappealtable(1);
        setappealinfo(0);
      }
    });

    return {
      appeallist,
      handleAppealDelete,
      currentAppealPage,
      appealtotal,
      appealPageDisabled,
      handleAppealCurrentChange,
      rowclick,
      appealinfo,
      clearappeal,
      deleteid,
      setappealtable,
      deletetype,
      deletestr,
      settable,
    };
  },
};
</script>

<style>
.activeappealcolor {
  background-color: var(--primary-light-gray) !important;
  color: var(--text-green) !important;
}
.appealtable .el-table__row:hover {
  background-color: var(--primary-light-gray) !important;
  color: var(--text-green) !important;
}
/* 公告查看容器 */
.appealContainer {
  height: 600px;
  width: 400px;
  border-radius: 10px;
  /* background-color: var(--primary-light-gray); */
  background-color: var(--primary-deep-gray);
  box-sizing: border-box;
  display: inline-block;
  margin-top: 20px;
  margin-right: 24px;
}
/* 公告标题 */
.appealTitle {
  text-align: center;
  height: 40px;
  line-height: 40px;
  border-bottom: 2px solid var(--primary-mostlight-gray);
  color: var(--text-green);
  font-size: 20px;
  margin: 0;
  padding: 0 12px;
  box-sizing: border-box;
}
/* 公告正文 */
.appealContent {
  resize: none;
  width: 400px;
  height: 520px;
  box-sizing: border-box;
  background-color: transparent;
  border: 0;
  line-height: 24px;
  padding: 10px 10px 14px 14px;
  color: var(--text-green);
  /* background-color: var(--primary-deep-gray); */
  background-color: var(--primary-morelight-gray);
}
.appealContent:focus {
  outline: 0;
}
.appealContent::selection {
  background-color: var(--primary-light-gray);
  color: var(--text-green);
}
.appealContent::-webkit-scrollbar {
  width: 6px;
  height: 0;
}
.appealContent::-webkit-scrollbar-thumb {
  border-radius: 3px;
  /* background-color: var(--primary-morelight-gray); */
  background-color: var(--primary-mostlight-gray);
}
.appealContent::-webkit-scrollbar-thumb:hover {
  /* background-color: var(--primary-mostlight-gray); */
  background-color: var(--primary-gray);
}
/* 公告尾部 */
.appealFoot {
  height: 40px;
  margin: 0;
  padding: 0 12px;
  /* border-top: 2px solid var(--primary-mostlight-gray); */
  line-height: 32px;
  box-sizing: border-box;
}
/* 公告时间 */
.appealTime {
  float: left;
  color: var(--text-green);
  font-size: 16px;
}
/* 公告负责人 */
.appealMan {
  float: right;
  color: var(--text-green);
  font-size: 16px;
}
.elpageAppeal {
  width: 600px;
  position: absolute;
  left: 50%;
  top: 580px;
  transform: translateX(-5%);
}
.clearAppeal {
  position: absolute;
  left: 35%;
  top: 580px;
  width: 120px;
  height: 32px;
  border-radius: 5px;
  border: 0;
  background-color: var(--primary-light-green);
  /* color: var(--text-deep-gray); */
  color: var(--text-gray-black);
  font-weight: 700;
  cursor: pointer;
}
.clearAppeal:hover {
  background-color: var(--primary-deep-green);
}
/* 表格和分页和按钮样式 */
.el-table th.el-table__cell {
  background-color: var(--primary-morelight-gray);
}
.el-table thead {
  color: var(--text-gray);
}
.el-button--primary {
  background-color: var(--primary-green);
  border-color: var(--primary-green);
  color: var(--text-gray-black);
  font-weight: 700;
}
.el-button--primary:hover {
  background-color: var(--primary-deep-green);
  border-color: var(--primary-deep-green);
  color: var(--text-deep-gray);
}
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background-color: var(--primary-morelight-gray);
  color: var(--text-gray);
}
.el-pagination.is-background .btn-next:hover,
.el-pagination.is-background .btn-prev:hover,
.el-pagination.is-background .el-pager li:not(.is-active):hover {
  background-color: var(--primary-mostlight-gray);
  color: var(--text-green);
}
tr:hover {
  color: var(--text-green);
}
.el-pagination__total,
.el-pagination__goto {
  color: var(--text-green);
}
</style>