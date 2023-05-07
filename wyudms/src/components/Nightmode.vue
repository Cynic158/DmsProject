<template>
  <div style="display: inline-block">
    <span
      class="iconfont icon-taiyang"
      v-if="$store.state.nightmode.nightmode == true"
      title="转白昼模式"
      @click="changeMode"
    ></span>
    <span
      class="iconfont icon-yueliang"
      v-if="$store.state.nightmode.nightmode == false"
      title="转黑夜模式"
      @click="changeMode"
    ></span>
  </div>
</template>

<script>
import { useStore } from "vuex";
export default {
  name: "nightmode",
  setup() {
    const store = useStore();
    const changeMode = () => {
      // document.documentElement 是全局变量时
      const el = document.documentElement;
      if (store.state.nightmode.nightmode == true) {
        //转成白昼
        el.style.setProperty(
          "--boxshadow",
          "0px 2px 2px 2px rgba(0, 0, 0, 0.2)"
        );
        el.style.setProperty("--transparent", "rgba(255, 255, 255, 0.5)");
        el.style.setProperty("--shadow", "rgba(0, 0, 0, 0.2)");
        el.style.setProperty("--room-four", "#005eff");
        el.style.setProperty("--room-three", "#0084ff");
        el.style.setProperty("--room-two", "#00a6ff");
        el.style.setProperty("--room-one", "#00d5ff");
        el.style.setProperty("--room-zero", "#74e8ff");
        el.style.setProperty("--primary-light-green", "#00c3ff");
        el.style.setProperty("--primary-green", "#00b3ff");
        el.style.setProperty("--primary-deep-green", "#0099ff");
        el.style.setProperty("--primary-black", "#cfcfcf");
        el.style.setProperty("--primary-deep-black", "#f0f0f0");
        el.style.setProperty("--primary-light-black", "#f9f9f9");
        el.style.setProperty("--primary-gray-black", "#f9f9f9");
        el.style.setProperty("--primary-deep-gray", "#fdfdfd");
        el.style.setProperty("--primary-light-gray", "#ebebeb");
        el.style.setProperty("--primary-morelight-gray", "#dadada");
        el.style.setProperty("--primary-mostlight-gray", "#cccccc");
        el.style.setProperty("--primary-gray", "#7a7a7a");
        el.style.setProperty("--primary-white", "#605f5f");
        el.style.setProperty("--text-light-green", "#00c3ff");
        el.style.setProperty("--text-green", "#00b3ff");
        el.style.setProperty("--text-white", "#646363");
        el.style.setProperty("--text-gray", "#748c8f");
        el.style.setProperty("--text-gray-black", "#ffffff");
        el.style.setProperty("--text-deep-gray", "#e6e6e6");
      } else if (store.state.nightmode.nightmode == false) {
        //转成黑夜
        el.style.setProperty(
          "--boxshadow",
          "0px 5px 5px 3px rgba(0, 0, 0, 0.5)"
        );
        el.style.setProperty("--transparent", "rgba(0, 0, 0, 0.5)");
        el.style.setProperty("--shadow", "rgba(0, 0, 0, 0.5)");
        el.style.setProperty("--room-four", "#00c300");
        el.style.setProperty("--room-three", "#008c00");
        el.style.setProperty("--room-two", "#006800");
        el.style.setProperty("--room-one", "#004900");
        el.style.setProperty("--room-zero", "#003000");
        el.style.setProperty("--primary-light-green", "#72e67e");
        el.style.setProperty("--primary-green", "#0f0");
        el.style.setProperty("--primary-deep-green", "#07e107");
        el.style.setProperty("--primary-black", "#000");
        el.style.setProperty("--primary-deep-black", "#181818");
        el.style.setProperty("--primary-light-black", "#1c1c1c");
        el.style.setProperty("--primary-gray-black", "#222");
        el.style.setProperty("--primary-deep-gray", "#333");
        el.style.setProperty("--primary-light-gray", "#444");
        el.style.setProperty("--primary-morelight-gray", "#555");
        el.style.setProperty("--primary-mostlight-gray", "#888");
        el.style.setProperty("--primary-gray", "#aaa");
        el.style.setProperty("--primary-white", "#fff");
        el.style.setProperty("--text-light-green", "#72e67e");
        el.style.setProperty("--text-green", "#0f0");
        el.style.setProperty("--text-white", "#fff");
        el.style.setProperty("--text-gray", "#aaa");
        el.style.setProperty("--text-gray-black", "#222");
        el.style.setProperty("--text-deep-gray", "#333");
      }
      // 设置 css 变量
      store.commit("nightmode/changeMode");
    };

    return { changeMode };
  },
};
</script>

<style>
.icon-yueliang,
.icon-taiyang {
  color: var(--primary-green);
  cursor: pointer;
  font-size: 40px;
}
</style>