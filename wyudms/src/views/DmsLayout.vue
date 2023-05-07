<template>
  <div class="dmslayout">
    <el-container style="height: 100%">
      <el-header
        style="padding: 0; background-color: var(--primary-light-black)"
      >
        <DmsHeader></DmsHeader>
      </el-header>
      <el-container>
        <el-aside
          width="auto"
          style="background-color: var(--primary-gray-black); overflow: hidden"
        >
          <DmsAside></DmsAside>
        </el-aside>
        <el-main
          style="
            padding: 0;
            background-color: var(--primary-deep-black);
            min-width: 1336px;
            min-height: 693px;
          "
        >
          <MainWindow></MainWindow>
        </el-main>
      </el-container>
    </el-container>
    <Dmsformstu style="z-index: 100"></Dmsformstu>
    <Dmsformnotice style="z-index: 100"></Dmsformnotice>
    <Notification></Notification>
  </div>
</template>

<script>
import DmsHeader from "@/components/DmsHeader.vue";
import DmsAside from "@/components/DmsAside.vue";
import MainWindow from "@/components/MainWindow.vue";
import Notification from "@/components/Notification.vue";
import Dmsformstu from "@/components/Dmsformstu.vue";
import Dmsformnotice from "@/components/Dmsformnotice.vue";
import { onMounted } from "vue";
export default {
  name: "dmslayout",
  components: {
    DmsHeader,
    DmsAside,
    MainWindow,
    Notification,
    Dmsformstu,
    Dmsformnotice,
  },
  setup() {
    onMounted(() => {
      const el = document.documentElement;
      el.style.setProperty("--el-menu-active-color", "var(--text-green)");
      // el.style.setProperty(
      //   "--el-menu-hover-bg-color",
      //   "var(--primary-deep-gray)"
      // );
      el.style.setProperty(
        "--el-menu-hover-bg-color",
        "var(--primary-light-gray)"
      );
      el.style.setProperty("--el-menu-border-color", "transparent");
      el.style.setProperty("--el-menu-bg-color", "transparent");
      el.style.setProperty("--el-menu-text-color", "var(--text-gray)");
      el.style.setProperty(
        "--el-bg-color-overlay",
        "var(--primary-gray-black)"
      );
      el.style.setProperty(
        "--el-border-color-light",
        "var(--primary-gray-black)"
      );
      el.style.setProperty(
        "--el-text-color-primary",
        "var(--primary-gray-black)"
      );
      el.style.setProperty("--el-bg-color", "var(--text-green)");
      el.style.setProperty("--el-text-color-regular", "var(--text-gray)");
      // el.style.setProperty("--el-border-color-lighter", "var(--primary-gray)");
      el.style.setProperty(
        "--el-border-color-lighter",
        "var(--primary-mostlight-gray)"
      );
      el.style.setProperty("--el-fill-color-blank", "var(--primary-deep-gray)");
      // el.style.setProperty(
      //   "--el-fill-color-light",
      //   "var(--primary-light-black)"
      // );
      el.style.setProperty(
        "--el-fill-color-light",
        "var(--primary-light-gray)"
      );
      el.style.setProperty(
        "--el-input-focus-border-color",
        "var(--primary-green)"
      );
      // el.style.setProperty("--el-border-color", "var(--primary-gray)");
      el.style.setProperty(
        "--el-border-color",
        "var(--primary-mostlight-gray)"
      );
      el.style.setProperty(
        "--el-button-hover-bg-color",
        "var(--primary-deep-green)"
      );
      el.style.setProperty("--el-color-primary", "var(--primary-light-green)");
      el.style.setProperty("--el-color-white", "var(--text-deep-gray)");
      el.style.setProperty(
        "--el-disabled-bg-color",
        "var(--primary-gray-black)"
      );
      el.style.setProperty(
        "--el-color-primary-light-3",
        "var(--primary-green)"
      );
    });
  },
};
</script>

<style>
.dmslayout {
  height: 100%;
}
</style>