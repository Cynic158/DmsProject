<template>
  <div>
    <div class="calendarbox">
      <el-config-provider :locale="locale">
        <el-calendar />
      </el-config-provider>
    </div>
    <div class="pieGroup">
      <div class="totalCount">
        <span>总人数: {{ totalstu.total }}</span>
        <span>男: {{ totalstu.boy }}</span>
        <span>女: {{ totalstu.girl }}</span>
      </div>
      <div class="buildingpie"></div>
      <div class="gradepie"></div>
    </div>
  </div>
</template>

<script>
import { gethomedata } from "@/api/user";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { onMounted, reactive } from "vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
export default {
  name: "dmshome",
  setup() {
    echarts.use([
      TooltipComponent,
      LegendComponent,
      PieChart,
      CanvasRenderer,
      LabelLayout,
    ]);

    const buildingpieoption = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
        textStyle: {
          color: "#aaa",
        },
      },
      series: [
        {
          name: "楼栋人数",
          type: "pie",
          top: "20%",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 64, name: "40栋" },
            { value: 91, name: "41栋" },
            { value: 75, name: "42栋" },
            { value: 58, name: "43栋" },
            { value: 81, name: "44栋" },
            { value: 43, name: "45栋" },
          ],
        },
      ],
    };
    const gradepieoption = {
      backgroundColor: "transparent",
      // backgroundColor: "#222",
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
        textStyle: {
          color: "#aaa",
        },
      },
      series: [
        {
          name: "年级人数",
          type: "pie",
          top: "10%",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 123, name: "18级" },
            { value: 245, name: "19级" },
            { value: 168, name: "21级" },
            { value: 134, name: "22级" },
            { value: 197, name: "23级" },
          ],
        },
      ],
    };

    let totalstu = reactive({
      total: 0,
      boy: 0,
      girl: 0,
    });
    onMounted(() => {
      gethomedata()
        .then((res) => {
          if (res.status == 0) {
            let homedataarr = [];
            res.homedata.forEach((item) => {
              homedataarr.push(Object.values(item)[0]);
            });
            totalstu.total = homedataarr[0];
            totalstu.boy = homedataarr[1];
            totalstu.girl = homedataarr[2];
            buildingpieoption.series[0].data[0].value = homedataarr[3];
            buildingpieoption.series[0].data[1].value = homedataarr[4];
            buildingpieoption.series[0].data[2].value = homedataarr[5];
            buildingpieoption.series[0].data[3].value = homedataarr[6];
            buildingpieoption.series[0].data[4].value = homedataarr[7];
            buildingpieoption.series[0].data[5].value = homedataarr[8];
            gradepieoption.series[0].data[0].value = homedataarr[9];
            gradepieoption.series[0].data[1].value = homedataarr[10];
            gradepieoption.series[0].data[2].value = homedataarr[11];
            gradepieoption.series[0].data[3].value = homedataarr[12];
            gradepieoption.series[0].data[4].value = homedataarr[13];
            const buildingpieDom = document.querySelector(".buildingpie");
            const gradepieDom = document.querySelector(".gradepie");
            const buildingpie = echarts.init(buildingpieDom);
            const gradepie = echarts.init(gradepieDom);
            //获取到数据再init饼图
            buildingpieoption && buildingpie.setOption(buildingpieoption);
            gradepieoption && gradepie.setOption(gradepieoption);
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    });

    return { locale: zhCn, totalstu };
  },
};
</script>

<style>
.el-calendar .el-calendar__header {
  border-bottom: 1px solid var(--primary-mostlight-gray);
}
.el-calendar .el-calendar-table tbody td {
  border-color: var(--primary-mostlight-gray);
}
.el-calendar-table td.is-selected {
  /* background-color: var(--primary-morelight-gray); */
  background-color: var(--primary-light-gray);
}
.el-calendar-table td .el-calendar-day:hover {
  /* background-color: var(--primary-morelight-gray); */
  background-color: var(--primary-light-gray);
}
.el-calendar-table td {
  color: var(--text-light-green);
}
.el-calendar-table .el-calendar-table__row .prev .el-calendar-day,
.el-calendar-table .el-calendar-table__row .next .el-calendar-day {
  color: var(--text-gray);
}
.el-calendar-table td.is-today {
  color: var(--text-green);
  font-size: 24px;
}
.el-calendar__title {
  color: var(--text-light-green);
}
.el-calendar .el-button {
  border-color: var(--primary-mostlight-gray);
}
.el-calendar .el-button:focus,
.el-calendar .el-button:hover {
  /* background-color: var(--primary-morelight-gray); */
  background-color: var(--primary-light-gray);
  /* border-color: var(--primary-gray); */
  border-color: var(--primary-mostlight-gray);
}
.calendarbox {
  float: left;
  width: calc(100% - 470px);
  height: 652px;
  margin-top: 20px;
}
.totalCount {
  height: 32px;
  line-height: 32px;
  color: var(--text-light-green);
  background-color: var(--primary-deep-gray);
}
.totalCount span {
  display: inline-block;
  width: 30%;
  text-align: center;
}
.totalCount span:nth-of-type(1) {
  width: 40%;
}
.pieGroup {
  float: right;
}
.buildingpie,
.gradepie {
  width: 450px;
  height: 300px;
  margin-top: 10px;
  background-color: var(--primary-deep-gray);
}
.buildingpie {
  height: 320px;
}
</style>