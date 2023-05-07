<template>
  <div style="position: relative">
    <el-form :inline="true" :model="selectobj" class="demo-form-inline">
      <el-form-item label="楼栋号" style="width: 140px; margin-right: 12px">
        <el-input v-model="selectobj.building" placeholder="输入楼栋" />
      </el-form-item>
      <el-form-item label="楼层" style="width: 130px; margin-right: 12px">
        <el-input v-model="selectobj.floor" placeholder="输入楼层" />
      </el-form-item>
      <el-form-item label="房间号" style="width: 140px; margin-right: 12px">
        <el-input v-model="selectobj.room" placeholder="输入房间" />
      </el-form-item>
      <el-form-item label="性别" style="width: 120px; margin-right: 12px">
        <el-select v-model="selectobj.sex">
          <el-option label="男" value="0" />
          <el-option label="女" value="1" />
          <el-option label="全部" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="职务" style="width: 120px; margin-right: 12px">
        <el-select v-model="selectobj.job">
          <el-option label="舍员" value="0" />
          <el-option label="舍长" value="1" />
          <el-option label="层长" value="2" />
          <el-option label="全部" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="专业" style="width: 200px; margin-right: 12px">
        <el-select v-model="selectobj.major" placeholder="全部">
          <el-option
            v-for="i in majorlist.list"
            :key="i"
            :label="i"
            :value="i"
          />
          <el-option label="全部" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="班别" style="width: 150px; margin-right: 12px">
        <el-input v-model="selectobj.stuclass" placeholder="输入六位数字" />
      </el-form-item>
      <el-form-item label="辅导员" style="width: 160px; margin-right: 12px">
        <el-select v-model="selectobj.counsellor">
          <el-option
            v-for="i in counsellorlist.list"
            :key="i"
            :label="i"
            :value="i"
          />
          <el-option label="全部" value="" />
        </el-select>
      </el-form-item>
      <el-form-item style="margin-right: 0; width: calc(100% - 1257px)">
        <el-button type="primary" @click="onSubmit">检索</el-button>
      </el-form-item>
    </el-form>
    <div style="height: 32px; width: 100%; margin-top: 12px">
      <el-form :inline="true" :model="searchobj" style="float: left">
        <el-form-item label="单个检索" style="width: 160px; margin-right: 12px">
          <el-select v-model="searchobj.type">
            <el-option label="学号" value="0" />
            <el-option label="姓名" value="1" />
            <el-option label="手机" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="输入" style="width: 160px; margin-right: 12px">
          <el-input v-model="searchobj.content" placeholder="输入内容" />
        </el-form-item>
        <el-form-item style="margin-right: 0; width: 60px">
          <el-button type="primary" @click="onSearchSubmit">检索</el-button>
        </el-form-item>
      </el-form>
      <input type="file" id="excelfile" hidden />
      <button class="resetselect" @click="resetselect">重置条件检索</button>
      <button class="importstu" @click="impexcel">导入添加学生</button>
      <button class="exportstu" @click="expexcelselect">导出筛选列表</button>
      <button class="exportstu" @click="expexcelall">导出全部列表</button>
      <button class="refreshstu" @click="refreshlist">学生列表刷新</button>
      <span class="selectspan">上方可任意条件筛选</span>
    </div>
    <el-table
      :data="stulist.list"
      ref="stutable"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column align="center" label="楼栋" prop="building" width="60" />
      <el-table-column align="center" label="楼层" prop="floor" width="60" />
      <el-table-column align="center" label="房间" prop="room" width="60" />
      <el-table-column align="center" label="床号" prop="bed" width="60" />
      <el-table-column align="center" label="性别" prop="sex" width="60" />
      <el-table-column align="center" label="职务" prop="job" width="100" />
      <el-table-column align="center" label="专业" prop="major" width="200" />
      <el-table-column align="center" label="班别" prop="stuclass" width="80" />
      <el-table-column align="center" label="学号" prop="stunumber" />
      <el-table-column align="center" label="姓名" prop="stuname" width="100" />
      <el-table-column align="center" label="手机" prop="phone" />
      <el-table-column align="center" label="辅导员" prop="counsellor" />
      <el-table-column align="center" prop="id">
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
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            style="
              color: var(--text-gray-black);
              /* color: var(--text-deep-gray); */
              font-weight: 700;
            "
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="elpage">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="10"
        :disabled="pagedisabled"
        background
        layout="total, prev, pager, next, jumper"
        :total="totalcount"
        @current-change="handleCurrentChange"
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
import * as XLSX from "xlsx";
import {
  getStuList,
  getStuById,
  demoexcel,
  expstu,
  searchstu,
} from "@/api/user";
import { getmajorlist } from "@/api/major";
import { getPersonnelList } from "@/api/personnel";
import { onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import Dmsconfirm from "@/components/Dmsconfirm.vue";
export default {
  name: "dmsstuinfo",
  components: {
    Dmsconfirm,
  },
  setup() {
    const store = useStore();
    const impexcel = () => {
      // 暂时搁置，excel批量导入
      // let excelfile = document.querySelector("#excelfile").files[0];
      // let reader = new FileReader();
      // reader.readAsBinaryString(excelfile);
      // reader.onloadend = function (evt) {
      //   if (evt.target.readyState == FileReader.DONE) {
      //     let data = reader.result;
      //     var workbook = XLSX.read(data, { type: "binary" });
      //   }
      //   let sheet_name_list = workbook.SheetNames;
      //   let result = XLSX.utils.sheet_to_json(
      //     workbook.Sheets[sheet_name_list[0]],
      //     { header: 1 }
      //   );
      //   console.log(result);
      //   demoexcel({ result });
      // };

      // 单个导入
      const emptyobj = {
        building: "",
        floor: "",
        room: "",
        bed: "",
        sex: 0,
        job: 0,
        major: "计算机科学与技术",
        stuclass: "",
        stunumber: "",
        stuname: "",
        phone: "",
        counsellor: "辅导员一",
      };
      store.commit("dsuser/setEditTitle", "导入学生");
      store.commit("dsuser/setEditType", 1);
      store.commit("dsuser/setEditobj", emptyobj);
      store.commit("dsuser/setEditStatus");
    };

    const exportByExcel = (jsonData, header) => {
      let arrAll = [];
      jsonData.forEach((item) => {
        let arr = [];
        header.forEach((item1) => {
          let singleData = "";
          for (let i in item) {
            if (item1 === i) {
            } else {
              singleData = item[item1];
            }
          }
          arr.push(singleData);
        });
        arrAll.push(arr);
      });
      const workbook = XLSX.utils.book_new();

      const worksheetName = "SheetJS";
      const worksheetData = [header, ...arrAll];
      // Converts an array of arrays of JS data to a worksheet.
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);

      // At this point, out.xls will have been downloaded.
      // Output format determined by filename
      XLSX.writeFile(workbook, "out.xls");
    };
    const expfun = (expdata) => {
      store.commit("setNoticeContent", "导出中");
      expstu(expdata)
        .then((res) => {
          if (res.status == 0) {
            res.expobj.forEach((item) => {
              if (item.sex == 0) {
                item.sex = "男";
              } else if (item.sex == 1) {
                item.sex = "女";
              }
              if (item.job == 0) {
                item.job = "舍员";
              } else if (item.job == 1) {
                item.job = "舍长";
              } else if (item.job == 2) {
                item.job = "层长";
              } else if (item.job == 3) {
                item.job = "舍长兼层长";
              }
            });
            exportByExcel(res.expobj, [
              "building",
              "floor",
              "room",
              "bed",
              "sex",
              "job",
              "major",
              "stuclass",
              "stunumber",
              "stuname",
              "phone",
              "counsellor",
              "email",
            ]);
            store.commit("setNoticeContent", res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    const expexcelall = () => {
      let expdata = { type: 0 };
      expfun(expdata);
    };

    const expexcelselect = () => {
      let expdata = { type: 1, select: selectobjsend };
      expfun(expdata);
    };

    const totalcount = ref(100);
    const getlist = (changepage, selectdata, page = 1) => {
      // 先判断是否有筛选条件
      let selectflag = false;
      for (let v in selectdata) {
        // 存在筛选条件
        if (selectdata[v] != "") {
          selectflag = true;
        }
      }
      // 初始化要发送的筛选对象
      let select = {};
      // 存在筛选条件就添加筛选对象的数据
      if (selectflag) {
        select = selectdata;
      }
      // 发送请求
      let dataobj = {
        select,
        page,
      };
      getStuList(dataobj)
        .then((res) => {
          if (res.status == 0) {
            // 需要将数据中的性别以及职务转换
            for (let i = 0; i < res.list.length; i++) {
              if (res.list[i].sex == 0) {
                res.list[i].sex = "男";
              } else {
                res.list[i].sex = "女";
              }
              if (res.list[i].job == 1) {
                res.list[i].job = "舍长";
              } else if (res.list[i].job == 2) {
                res.list[i].job = "层长";
              } else if (res.list[i].job == 3) {
                res.list[i].job = "舍长兼层长";
              } else {
                res.list[i].job = "舍员";
              }
            }
            // 刷新表格以及页码总数计数
            stulist.list = res.list;
            totalcount.value = Object.values(res.totalcount[0])[0];
            // 如果不是页码变更导致的表格刷新就不进行通知
            if (!changepage) {
              store.commit("setNoticeContent", res.message);
              currentPage.value = 1;
            }
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
      // console.log(dataobj);

      // getStuList()
      //   .then((res) => {
      //     let result = res.stuArr.map((item) => {
      //       return { ...item };
      //     });
      //     console.log(result);
      //   })
      //   .catch((err) => {
      //     console.log(err.message);
      //   });
    };

    const resetselect = () => {
      // console.log("getlist并且重置检索条件");
      selectobj.building = "";
      selectobj.floor = "";
      selectobj.room = "";
      selectobj.job = "";
      selectobj.sex = "";
      selectobj.major = "";
      selectobj.stuclass = "";
      selectobj.counsellor = "";
    };

    const refreshlist = () => {
      resetselect();
      getlist(false, selectobj);
      currentPage.value = 1;
    };

    const selectobj = reactive({
      building: "",
      floor: "",
      room: "",
      job: "",
      sex: "",
      major: "",
      stuclass: "",
      counsellor: "",
    });

    let selectobjsend = {
      building: "",
      floor: "",
      room: "",
      job: "",
      sex: "",
      major: "",
      stuclass: "",
      counsellor: "",
    };

    const searchobj = reactive({
      type: "0",
      content: "",
    });

    let stulist = reactive({
      list: [
        {
          id: 1,
          building: "48",
          floor: "2",
          room: "202",
          bed: "1",
          sex: "男",
          job: "舍员",
          major: "计算机科学与技术",
          stuclass: "190701",
          stunumber: "3119001333",
          stuname: "方文轩",
          phone: "13356580997",
          counsellor: "鲜红兰",
        },
      ],
    });

    // 直接进行检索时，提交检索对象，默认页码为1
    const onSubmit = () => {
      store.commit("setNoticeContent", "检索中");
      selectobjsend.building = selectobj.building;
      selectobjsend.floor = selectobj.floor;
      selectobjsend.room = selectobj.room;
      selectobjsend.job = selectobj.job;
      selectobjsend.sex = selectobj.sex;
      selectobjsend.major = selectobj.major;
      selectobjsend.stuclass = selectobj.stuclass;
      selectobjsend.counsellor = selectobj.counsellor;
      getlist(false, selectobjsend);
    };

    const onSearchSubmit = () => {
      if (searchobj.content == "") {
        store.commit("setNoticeContent", "单个检索的输入框内不能为空");
      } else {
        store.commit("setNoticeContent", "查询中");
        searchstu(searchobj)
          .then((res) => {
            if (res.status == 0) {
              // 刷新表格以及页码总数计数
              stulist.list = res.sturesult;
              totalcount.value = Object.values(res.totalcount[0])[0];
              store.commit("setNoticeContent", res.message);
            } else {
              console.log(res.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    };

    const handleEdit = (index, row) => {
      store.commit("dsuser/setEditType", 0);
      store.commit("dsuser/setEditTitle", "编辑学生");
      getStuById({ stuid: row.id })
        .then((res) => {
          if (res.status == 0) {
            store.commit("dsuser/setEditobj", res.stuobj[0]);
            store.commit("dsuser/setEditStatus");
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    const deleteid = ref(0);
    const deletestr = ref("确认要删除该学生吗？");
    const deletetype = ref(0);
    const handleDelete = (index, row) => {
      console.log(row.id);
      deleteid.value = row.id;
      deletestr.value = "确认要删除该学生吗？";
      deletetype.value = 0;
    };
    const settable = () => {
      getlist(true, selectobjsend, currentPage.value);
    };

    // 页码更改表格时，提交检索对象并且提交页码
    const currentPage = ref(1);
    const pagedisabled = ref(false);
    const handleCurrentChange = (val) => {
      // console.log(`current page: ${val}`);
      getlist(true, selectobjsend, val);
    };

    let majorlist = reactive({
      list: ["计算机科学与技术", "专业二", "专业三"],
    });
    let counsellorlist = reactive({
      list: ["辅导员1", "辅导员2", "辅导员3"],
    });
    // 当页面初始化完成后获取一次数据
    onMounted(() => {
      getlist(false, selectobjsend);
      getmajorlist()
        .then((res) => {
          if (res.status == 0) {
            let majorarr = [];
            res.majorlist.forEach((item) => {
              majorarr.push(item.majorname);
            });
            majorlist.list = majorarr;
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
      getPersonnelList({ type: 0 })
        .then((res) => {
          if (res.status == 0) {
            let counsellorarr = [];
            res.personnellist.forEach((item) => {
              counsellorarr.push(item.pname);
            });
            counsellorlist.list = counsellorarr;
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
      watch(
        () => store.state.dsuser.stutablestatus,
        () => {
          getlist(true, selectobjsend, currentPage.value);
        }
      );
    });
    return {
      impexcel,
      expexcelselect,
      expexcelall,
      resetselect,
      refreshlist,
      getlist,
      totalcount,
      selectobj,
      searchobj,
      onSubmit,
      onSearchSubmit,
      stulist,
      handleEdit,
      deleteid,
      deletestr,
      deletetype,
      handleDelete,
      settable,
      handleCurrentChange,
      currentPage,
      pagedisabled,
      majorlist,
      counsellorlist,
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
.importstu,
.refreshstu,
.exportstu,
.resetselect {
  float: right;
  width: 120px;
  height: 32px;
  margin-left: 10px;
  border-radius: 5px;
  background-color: var(--primary-light-green);
  /* color: var(--text-deep-gray); */
  color: var(--text-gray-black);
  font-weight: 700;
  border: 0;
  cursor: pointer;
}
.importstu:hover,
.refreshstu:hover,
.exportstu:hover,
.resetselect:hover {
  background-color: var(--primary-deep-green);
}
.selectspan {
  float: right;
  height: 32px;
  line-height: 32px;
  color: var(--text-green);
}
.elpage {
  width: 600px;
  position: absolute;
  left: 50%;
  top: 600px;
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
  width: 100%;
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