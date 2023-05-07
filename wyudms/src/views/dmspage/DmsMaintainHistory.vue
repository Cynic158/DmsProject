<template>
  <div style="position: relative">
    <div class="maintainsift">
      <el-form :inline="true" :model="sifthistoryobj" class="demo-form-inline">
        <el-form-item label="维修类型" style="width: 220px; margin-right: 32px">
          <el-cascader
            v-model="sifthistoryobj.type"
            :options="siftoptions"
            :props="siftprops"
            placeholder="全部"
          />
        </el-form-item>
        <el-form-item label="楼栋" style="width: 150px; margin-right: 32px">
          <el-input v-model="sifthistoryobj.building" placeholder="输入楼栋" />
        </el-form-item>
        <el-form-item label="状态" style="width: 150px; margin-right: 32px">
          <el-select v-model="sifthistoryobj.status">
            <el-option label="已完成" value="2" />
            <el-option label="已取消" value="3" />
            <el-option label="全部" value="" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right: 0; width: 60px">
          <el-button type="primary" @click="onSiftHistorySubmit"
            >检索</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="maintainhistorylist.list"
      style="width: 100%; margin: 10px 0 18px; display: inline-block"
    >
      <el-table-column
        align="center"
        label="申报时间"
        prop="time"
        width="180"
      />
      <el-table-column
        align="center"
        label="维修类型"
        prop="type"
        width="140"
      />
      <el-table-column
        align="center"
        label="楼栋房间"
        prop="room"
        width="120"
      />
      <el-table-column
        align="center"
        label="预约时间"
        prop="appoint"
        width="220"
      />
      <el-table-column align="center" label="维修描述" prop="content" />
      <el-table-column align="center" label="手机号" prop="phone" width="160" />
      <el-table-column align="center" label="状态" prop="status" width="80" />
      <el-table-column align="center" prop="id" width="150">
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
            @click="handleMaintainDetail(scope.$index, scope.row)"
            >详情</el-button
          >
          <el-button
            style="
              color: var(--text-gray-black);
              /* color: var(--text-deep-gray); */
              font-weight: 700;
            "
            size="small"
            type="danger"
            @click="handleMaintainDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <button class="sendNotice">发布公告</button> -->
    <div class="elpageMaintain">
      <el-pagination
        v-model:current-page="currentMaintainHistoryPage"
        :page-size="12"
        :disabled="maintainPageDisabled"
        background
        layout="total, prev, pager, next, jumper"
        :total="maintainhistorytotal"
        @current-change="handleMaintainCurrentChange"
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
  <Dmsformmthistory></Dmsformmthistory>
</template>

<script>
import Dmsformmthistory from "@/components/Dmsformmt.vue";
import Dmsconfirm from "@/components/Dmsconfirm.vue";
import { getmaintainhistory } from "@/api/maintain";
import { onMounted, reactive, ref, onActivated, watch } from "vue";
import { useStore } from "vuex";
export default {
  name: "dmsmaintainhistory",
  components: {
    Dmsconfirm,
    Dmsformmthistory,
  },
  setup() {
    const store = useStore();

    const maintainhistorytotal = ref(100);

    const sifthistoryobj = reactive({
      type: "",
      building: "",
      status: "",
    });

    let sifthistoryobjsend = {
      type: "",
      building: "",
      status: "",
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
      {
        value: "",
        label: "全部",
      },
    ];

    const siftprops = {
      expandTrigger: "hover",
    };

    const onSiftHistorySubmit = () => {
      store.commit("setNoticeContent", "检索中");
      console.log(sifthistoryobj);
      if (sifthistoryobj.type != "") {
        sifthistoryobjsend.type = sifthistoryobj.type.join("-");
      } else {
        sifthistoryobjsend.type = sifthistoryobj.type;
      }
      sifthistoryobjsend.building = sifthistoryobj.building;
      sifthistoryobjsend.status = sifthistoryobj.status;
      setmaintainhistorytable(true, sifthistoryobjsend, 1);
    };

    const maintainhistorylist = reactive({
      list: [
        {
          id: 1,
          time: "2023-02-17 23:26",
          type: "水电-风扇",
          room: "48栋202",
          appoint: "02-18 12:00--02-28 12:00",
          content: "风扇坏了风扇坏了风扇坏了...",
          phone: "13356580997",
          status: "未处理",
        },
      ],
    });

    const setmaintainhistorytable = (notice, sift, val) => {
      let siftflag = false;
      for (let v in sift) {
        if (sift[v] != "") {
          siftflag = true;
        }
      }
      if (siftflag == false) {
        sift = {};
      }
      getmaintainhistory({ page: val, sift: sift })
        .then((res) => {
          if (res.status == 0) {
            res.maintainhistorylist.forEach((item) => {
              item.room = item.building + "栋" + item.room;
              if (item.content.length > 12) {
                item.content = item.content.substring(0, 12) + "...";
              }
              if (item.status == 2) {
                item.status = "已完成";
              } else if (item.status == 3) {
                item.status = "已取消";
              }
            });
            maintainhistorytotal.value = Object.values(
              res.maintainhistorycount[0]
            )[0];
            maintainhistorylist.list = res.maintainhistorylist;
            if (notice) {
              store.commit("setNoticeContent", res.message);
              currentMaintainHistoryPage.value = 1;
            }
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    const handleMaintainDetail = (index, row) => {
      store.commit("dsmaintain/setEditmtId", row.id);
      store.commit("dsmaintain/setEditmtHistoryStatus");
    };
    const deleteid = ref(0);
    const deletestr = ref("确定要删除该维修单吗");
    const deletetype = ref(4);
    const handleMaintainDelete = (index, row) => {
      console.log(index, row);
      deleteid.value = row.id;
      deletestr.value = "确定要删除该维修单吗";
      deletetype.value = 4;
    };
    const settable = () => {
      setmaintainhistorytable(
        false,
        sifthistoryobjsend,
        currentMaintainHistoryPage.value
      );
    };

    const currentMaintainHistoryPage = ref(1);
    const maintainPageDisabled = ref(false);
    const handleMaintainCurrentChange = (val) => {
      setmaintainhistorytable(false, sifthistoryobjsend, val);
    };

    onMounted(() => {
      setmaintainhistorytable(true, sifthistoryobjsend, 1);
      watch(
        () => store.state.dsmaintain.mthistorytablestatus,
        () => {
          setmaintaintable(false, siftobjsend, currentMaintainPage.value);
        }
      );
    });

    onActivated(() => {
      if (maintainhistorylist.list.length != 0) {
        setmaintainhistorytable(
          false,
          sifthistoryobjsend,
          currentMaintainHistoryPage.value
        );
      } else {
        setmaintainhistorytable(false, sifthistoryobjsend, 1);
      }
    });

    return {
      sifthistoryobj,
      siftoptions,
      siftprops,
      onSiftHistorySubmit,
      maintainhistorylist,
      handleMaintainDelete,
      currentMaintainHistoryPage,
      maintainPageDisabled,
      handleMaintainCurrentChange,
      maintainhistorytotal,
      deleteid,
      deletestr,
      deletetype,
      settable,
      handleMaintainDetail,
    };
  },
};
</script>

<style>
.demo-form-inline {
  margin-top: 15px;
}
.el-form-item {
  margin-bottom: 10px;
}
.elpageMaintain {
  width: 600px;
  position: absolute;
  left: 50%;
  top: 620px;
  transform: translateX(-50%);
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