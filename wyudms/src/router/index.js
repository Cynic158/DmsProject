import { createRouter, createWebHistory } from "vue-router";
import { routes, Roleroutes } from "@/router/routes";
import store from "@/store";

function hasPermission(role, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role);
  } else {
    return true;
  }
}
function filterAsyncRoutes(routes, roles) {
  let res = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      res.push(tmp);
    }
  });

  return res;
}
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
});

let oldrole = null; // 定义标识，记录路由是否添加，防止刷新以及更换权限
router.beforeEach((to, from, next) => {
  // 判断有没有登录
  const { dsuserInfo } = store.state.dsuser;
  if (!dsuserInfo.token && to.path.startsWith("/dms")) {
    store.commit("dsuser/setUser", {});
    // return next("/login?redirectUrl=" + encodeURIComponent(to.fullPath));
    return next("/login");
  } else if (to.name == "login") {
    next();
  } else {
    //如果登录了
    //首次登录跳转动态添加路由状态是true
    if (oldrole != dsuserInfo.type.toString()) {
      console.log("updaterouter");
      const role = dsuserInfo.type.toString();
      oldrole = role;

      if (role == "0") {
        console.log("addrouter");
        const addRouter = filterAsyncRoutes(Roleroutes, role);
        const delRouter = filterAsyncRoutes(Roleroutes, "1");
        delRouter.forEach((v) => {
          if (router.hasRoute(v.name)) {
            router.removeRoute(v.name);
          }
        });
        addRouter.forEach((v) => {
          router.addRoute("home", v);
        });
      } else if (role == "1") {
        console.log("addrouter");
        const addRouter = filterAsyncRoutes(Roleroutes, role);
        const delRouter = filterAsyncRoutes(Roleroutes, "0");
        delRouter.forEach((v) => {
          if (router.hasRoute(v.name)) {
            router.removeRoute(v.name);
          }
        });
        addRouter.forEach((v) => {
          router.addRoute("home", v);
        });
      }
      next({ ...to, replace: true });
    } else {
      next();
    }
  }
});
export default router;
