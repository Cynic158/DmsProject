<template>
  <div class="wincontainer">
    <!-- <router-view></router-view> -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
  </div>
</template>

<script>
export default {
  name: "mainwindow",
};
</script>

<style>
.wincontainer {
  width: 100%;
  height: 100%;
  box-shadow: inset 2px 2px 2px var(--shadow);
  padding: 10px;
  box-sizing: border-box;
}
</style>