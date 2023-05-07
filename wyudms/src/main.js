import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import "../mock";
import "@/styles/toast.css";
import "@/styles/normalize.css";
import "@/styles/color.css";
import "@/icons/iconfont.css";
import "element-plus/theme-chalk/display.css";
import "@/styles/show.css";

createApp(App).use(store).use(router).mount("#app");
