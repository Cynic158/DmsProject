<template>
  <Transition name="t">
    <div id="toast" v-show="toastShow">{{ tmessage }}</div>
  </Transition>
</template>

<script>
import { onMounted, ref, watch } from "vue";
export default {
  name: "toast",
  props: {
    tmessage: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const toastShow = ref(false);

    onMounted(() => {
      watch(
        () => props.tmessage,
        (newVal) => {
          if (newVal != "") {
            toastShow.value = true;
            setTimeout(() => {
              toastShow.value = false;
              setTimeout(() => {
                emit("update:tmessage", "");
              }, 1000);
            }, 2000);
          }
        }
      );
    });

    return { toastShow };
  },
};
</script>

<style scoped>
#toast {
  padding: 20px 40px;
  border: 2px solid var(--primary-green);
  background-color: var(--transparent);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  color: var(--text-green);
  border-radius: 5px;
}
</style>