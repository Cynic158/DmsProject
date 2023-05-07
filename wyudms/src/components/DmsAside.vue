<template>
  <el-menu
    default-active="/dms"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    :unique-opened="true"
    @open="handleOpen"
    @close="handleClose"
    ref="elmenu"
    :router="true"
  >
    <div @click="menuFold" class="fold">
      <el-icon
        style="margin-right: 20px; width: 24px; height: 18px; font-size: 18px"
        ><back v-if="!isCollapse" /><right v-else-if="isCollapse"
      /></el-icon>
      <Transition name="fold">
        <span v-show="!isCollapse">收起</span>
      </Transition>
    </div>
    <el-menu-item index="/dms">
      <el-icon style="margin-right: 20px"><monitor /></el-icon>
      <template #title>首页</template>
    </el-menu-item>
    <el-menu-item index="/dms/stuinfo" v-if="menutype == 0">
      <el-icon style="margin-right: 20px"><user /></el-icon>
      <template #title>学生信息管理</template>
    </el-menu-item>
    <el-sub-menu index="3" v-if="menutype == 0">
      <template #title>
        <el-icon><bell /></el-icon>
        <span class="menuTitleLeft">公告诉求管理</span>
      </template>
      <el-menu-item index="/dms/notice" class="menuItemLeft"
        >公告管理</el-menu-item
      >
      <el-menu-item index="/dms/appeal" class="menuItemLeft"
        >诉求管理</el-menu-item
      >
    </el-sub-menu>
    <el-sub-menu index="4" v-if="menutype == 0">
      <template #title>
        <el-icon><officeBuilding /></el-icon>
        <span class="menuTitleLeft">宿舍信息管理</span>
      </template>
      <el-menu-item index="/dms/dorminfo" class="menuItemLeft"
        >楼层查询</el-menu-item
      >
      <el-menu-item index="/dms/dormadjust" class="menuItemLeft"
        >调宿管理</el-menu-item
      >
    </el-sub-menu>
    <el-sub-menu index="5" v-if="menutype == 0">
      <template #title>
        <el-icon><brush /></el-icon>
        <span class="menuTitleLeft">维修信息管理</span>
      </template>
      <el-menu-item index="/dms/maintaininfo" class="menuItemLeft"
        >维修管理</el-menu-item
      >
      <el-menu-item index="/dms/maintainhistory" class="menuItemLeft"
        >历史维修</el-menu-item
      >
    </el-sub-menu>
    <el-menu-item index="/dms/stuselfinfo" v-if="menutype == 1">
      <el-icon style="margin-right: 20px"><user /></el-icon>
      <template #title>个人信息</template>
    </el-menu-item>
    <el-sub-menu index="7" v-if="menutype == 1">
      <template #title>
        <el-icon><bell /></el-icon>
        <span class="menuTitleLeft">公告以及投诉</span>
      </template>
      <el-menu-item index="/dms/notice" class="menuItemLeft"
        >查看公告</el-menu-item
      >
      <el-menu-item index="/dms/stuappeal" class="menuItemLeft"
        >投诉建议</el-menu-item
      >
    </el-sub-menu>
    <el-menu-item index="/dms/studorminfo" v-if="menutype == 1">
      <el-icon style="margin-right: 20px"><officeBuilding /></el-icon>
      <template #title>宿舍信息/申请调宿</template>
    </el-menu-item>
    <el-menu-item index="/dms/stumaintain" v-if="menutype == 1">
      <el-icon style="margin-right: 20px"><brush /></el-icon>
      <template #title>维修信息/申报维修</template>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { onMounted, ref } from "vue";
import {
  User,
  Monitor,
  Bell,
  OfficeBuilding,
  Brush,
  Back,
  Right,
} from "@element-plus/icons-vue";
import { useStore } from "vuex";
export default {
  name: "dmsaside",
  components: {
    User,
    Monitor,
    Bell,
    OfficeBuilding,
    Brush,
    Back,
    Right,
  },
  setup() {
    const store = useStore();
    const isCollapse = ref(false);
    const elmenu = ref(null);
    const handleOpen = () => {
      console.log();
    };
    const handleClose = () => {
      console.log();
    };

    const menuFold = () => {
      if (isCollapse.value == false) {
        const activeItem = document.querySelector(".is-opened");
        if (activeItem) {
          activeItem.firstElementChild.click();
          setTimeout(() => {
            isCollapse.value = true;
          }, 500);
        } else {
          isCollapse.value = true;
        }
      } else {
        isCollapse.value = false;
      }
    };

    const menutype = ref(1);
    onMounted(() => {
      document.querySelector(".el-menu-item").click();
      menutype.value = store.state.dsuser.dsuserInfo.type;
    });

    return {
      isCollapse,
      handleOpen,
      handleClose,
      elmenu,
      menuFold,
      menutype,
    };
  },
};
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}
.menuTitleLeft {
  margin-left: 15px;
}
.menuItemLeft {
  padding-left: 30px;
}
.fold {
  display: flex;
  align-items: center;
  height: var(--el-menu-item-height);
  line-height: var(--el-menu-item-height);
  font-size: var(--el-menu-item-font-size);
  color: var(--el-menu-text-color);
  padding: 0 var(--el-menu-base-level-padding);
  list-style: none;
  cursor: pointer;
  position: relative;
  transition: border-color var(--el-transition-duration),
    background-color var(--el-transition-duration),
    color var(--el-transition-duration);
  box-sizing: border-box;
  white-space: nowrap;
}
.fold:hover {
  background-color: var(--primary-deep-gray);
}

.el-sub-menu.is-active .el-sub-menu__title {
  color: var(--text-green);
}

.fold-enter-from {
  opacity: 0;
}
.fold-enter-active {
  transition: all 1s;
}
.fold-enter-to {
  opacity: 1;
}
.fold-leave-from {
  opacity: 1;
}
.fold-leave-active {
  transition: all 1s;
}
.fold-leave-to {
  opacity: 0;
}
.el-menu-item {
  user-select: none;
}
</style>