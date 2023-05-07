<template>
  <el-icon
    style="margin-top: 14px; cursor: pointer; position: relative"
    title="切换全屏"
  >
    <FullScreen @click="changeMode" style="color: var(--primary-green)" />
  </el-icon>
</template>

<script>
import { FullScreen } from "@element-plus/icons-vue";
import screenfull from "screenfull";
import { useStore } from "vuex";
export default {
  name: "screenmode",
  components: {
    FullScreen,
  },
  setup() {
    const store = useStore();
    const changeMode = () => {
      if (screenfull.isEnabled) {
        let screen = window.screen;
        let body = document.body.getBoundingClientRect();
        let screenmode =
          screen.height === body.height && screen.width === body.width;
        if (screenmode == true) {
          screenfull.exit();
        } else {
          screenfull.request();
          store.commit(
            "setNoticeContent",
            "全屏后按f12可能会影响缩屏，可以通过按f11切换全屏或者缩屏"
          );
        }
      } else {
        console.log("浏览器不支持全屏插件");
      }
    };

    return { changeMode };
  },
};
</script>

<style>
</style>