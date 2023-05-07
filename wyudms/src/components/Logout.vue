<template>
  <el-icon
    style="cursor: pointer; color: var(--primary-green); margin-top: 14px"
    title="登出"
    ><SwitchButton
  /></el-icon>
</template>

<script>
import { SwitchButton } from "@element-plus/icons-vue";
export default {
  name: "logout",
  components: {
    SwitchButton,
  },
};
</script>

<style>
</style>