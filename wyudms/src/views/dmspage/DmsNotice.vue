<template>
  <div style="position: relative">
    <div class="noticeContainer">
      <p class="noticeTitle">{{ noticeinfo.info[0].title }}</p>
      <textarea
        class="noticeContent"
        readonly
        v-model="noticeinfo.info[0].content"
      >
      </textarea>
      <p class="noticeFoot">
        <span class="noticeTime">时间: {{ noticeinfo.info[0].time }}</span>
        <span class="noticeMan"
          >负责人: {{ noticeinfo.info[0].noticeman }}</span
        >
      </p>
    </div>
    <el-table
      class="noticetable"
      @row-click="rowclick"
      :data="noticelist.list"
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
      <el-table-column align="center" label="标题" prop="title" />
      <el-table-column
        align="center"
        label="负责人"
        prop="noticeman"
        width="150"
      />
      <el-table-column
        align="center"
        prop="id"
        width="150"
        v-if="pagetype == 0"
      >
        <template #header> 操作 </template>
        <template #default="scope">
          <el-button
            style="
              background-color: var(--primary-light-green);
              /* color: var(--text-deep-gray); */
              color: var(--text-gray-black);
              font-weight: 700;
              border: 0px;
            "
            size="small"
            @click="handleNoticeEdit(scope.$index, scope.row)"
            >更改</el-button
          >
          <el-button
            style="
              color: var(--text-gray-black);
              /* color: var(--text-deep-gray); */
              font-weight: 700;
            "
            size="small"
            type="danger"
            @click="handleNoticeDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <button class="sendNotice" @click="publish" v-if="pagetype == 0">
      发布公告
    </button>
    <div class="elpageNotice">
      <el-pagination
        v-model:current-page="currentNoticePage"
        :page-size="12"
        :disabled="noticePageDisabled"
        background
        layout="total, prev, pager, next, jumper"
        :total="noticetotal"
        @current-change="handleNoticeCurrentChange"
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
import { getNoticeList, getNoticeinfo } from "@/api/notice";
import { onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
export default {
  name: "dmsnotice",
  components: {
    Dmsconfirm,
  },
  setup() {
    let noticelist = reactive({
      list: [
        {
          id: 1,
          time: "2023-02-17 23:26",
          title: "40栋维修水管暂时供水",
          noticeman: "管理员",
        },
      ],
    });

    let noticeinfo = reactive({
      info: [
        {
          title: "无标题",
          content: "正文",
          time: "2023-03-01 17:16",
          noticeman: "管理员",
        },
      ],
    });

    const store = useStore();

    const handleNoticeEdit = (index, row) => {
      store.commit("dsnotice/setEditNoticeType", 0);
      store.commit("dsnotice/setEditNoticeTitle", "更改公告");
      getNoticeinfo({ id: row.id })
        .then((res) => {
          if (res.status == 0) {
            store.commit("dsnotice/setEditNoticeobj", res.noticeinfo[0]);
            store.commit("dsnotice/setEditNoticeStatus");
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    const settable = () => {
      setnoticetable(1);
      setnoticeinfo(0);
    };
    const setnoticetable = (val) => {
      getNoticeList({ page: val })
        .then((res) => {
          if (res.status == 0) {
            noticelist.list = res.noticelist;
            noticetotal.value = Object.values(res.noticecount[0])[0];
            changebg();
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    const setnoticeinfo = (val) => {
      getNoticeinfo({ id: val })
        .then((res) => {
          if (res.status == 0) {
            noticeinfo.info = res.noticeinfo;
            store.commit(
              "dsnotice/setActiveNoticepage",
              currentNoticePage.value
            );
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    const deleteid = ref(0);
    const deletestr = ref("确定要删除该公告吗");
    const deletetype = ref(1);
    const handleNoticeDelete = (index, row) => {
      console.log(index, row);
      deleteid.value = row.id;
      deletestr.value = "确定要删除该公告吗";
      deletetype.value = 1;
    };

    const currentNoticePage = ref(1);
    const noticetotal = ref(100);
    const noticePageDisabled = ref(false);
    const handleNoticeCurrentChange = (val) => {
      setnoticetable(val);
    };

    const changebg = () => {
      setTimeout(() => {
        let index = 0;
        document
          .querySelectorAll(".noticetable .el-table__row")
          .forEach((item) => {
            if (!item.getAttribute("index")) {
              item.addEventListener("click", function () {
                store.commit(
                  "dsnotice/setActiveNotice",
                  item.getAttribute("index")
                );
                document
                  .querySelectorAll(".noticetable .el-table__row")
                  .forEach((item1) => {
                    item1.classList.remove("activenoticecolor");
                  });
                item.classList.add("activenoticecolor");
              });
            }
            item.setAttribute("index", index);
            index++;
          });
        if (store.state.dsnotice.activenoticepage == currentNoticePage.value) {
          document
            .querySelectorAll(".noticetable .el-table__row")
            .forEach((item) => {
              if (
                item.getAttribute("index") == store.state.dsnotice.activenotice
              ) {
                item.classList.add("activenoticecolor");
              }
            });
        } else {
          document
            .querySelectorAll(".noticetable .el-table__row")
            .forEach((item) => {
              item.classList.remove("activenoticecolor");
            });
        }
      }, 500);
    };
    const rowclick = function (row) {
      // console.log(row);
      setnoticeinfo(row.id);
    };

    const publish = () => {
      const emptyobj = {
        title: "无标题",
        content: "",
        noticeman: "管理员",
      };
      store.commit("dsnotice/setEditNoticeTitle", "发布公告");
      store.commit("dsnotice/setEditNoticeType", 1);
      store.commit("dsnotice/setEditNoticeobj", emptyobj);
      store.commit("dsnotice/setEditNoticeStatus");
    };

    const pagetype = ref(1);
    onMounted(() => {
      setnoticetable(1);
      setnoticeinfo(0);
      watch(
        () => store.state.dsnotice.noticetablestatus,
        () => {
          setnoticetable(currentNoticePage.value);
          setnoticeinfo(store.state.dsnotice.editnoticeobj.id);
        }
      );
      pagetype.value = store.state.dsuser.dsuserInfo.type;
    });

    return {
      noticelist,
      handleNoticeEdit,
      handleNoticeDelete,
      currentNoticePage,
      noticetotal,
      noticePageDisabled,
      handleNoticeCurrentChange,
      rowclick,
      noticeinfo,
      publish,
      deleteid,
      setnoticetable,
      deletetype,
      deletestr,
      settable,
      pagetype,
    };
  },
};
</script>

<style>
.activenoticecolor {
  background-color: var(--primary-light-gray) !important;
  color: var(--text-green) !important;
}
.noticetable .el-table__row:hover {
  background-color: var(--primary-light-gray) !important;
  color: var(--text-green) !important;
}
/* 公告查看容器 */
.noticeContainer {
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
.noticeTitle {
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
.noticeContent {
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
.noticeContent:focus {
  outline: 0;
}
.noticeContent::selection {
  background-color: var(--primary-light-gray);
  color: var(--text-green);
}
.noticeContent::-webkit-scrollbar {
  width: 6px;
  height: 0;
}
.noticeContent::-webkit-scrollbar-thumb {
  border-radius: 3px;
  /* background-color: var(--primary-morelight-gray); */
  background-color: var(--primary-mostlight-gray);
}
.noticeContent::-webkit-scrollbar-thumb:hover {
  /* background-color: var(--primary-mostlight-gray); */
  background-color: var(--primary-gray);
}
/* 公告尾部 */
.noticeFoot {
  height: 40px;
  margin: 0;
  padding: 0 12px;
  /* border-top: 2px solid var(--primary-mostlight-gray); */
  line-height: 32px;
  box-sizing: border-box;
}
/* 公告时间 */
.noticeTime {
  float: left;
  color: var(--text-green);
  font-size: 16px;
}
/* 公告负责人 */
.noticeMan {
  float: right;
  color: var(--text-green);
  font-size: 16px;
}
.elpageNotice {
  width: 600px;
  position: absolute;
  left: 50%;
  top: 580px;
  transform: translateX(-5%);
}
.sendNotice {
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
.sendNotice:hover {
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