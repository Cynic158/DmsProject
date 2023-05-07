export const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/DmsLayout.vue"),
    meta: {
      roles: ["0", "1"],
    },
    redirect: "/dms",
    children: [
      {
        path: "/dms",
        name: "dms",
        component: () => import("@/views/dmspage/DmsHome"),
        meta: {
          roles: ["0", "1"],
        },
      },
      {
        path: "/dms/notice",
        name: "notice",
        component: () => import("@/views/dmspage/DmsNotice"),
        meta: {
          roles: ["0", "1"],
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login"),
    meta: {
      roles: ["0", "1"],
    },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404.vue"),
    meta: {
      roles: ["0", "1"],
    },
  },
  { path: "/:pathMatch(.*)*", redirect: "/404" },
];
export const Roleroutes = [
  {
    path: "/dms/stuinfo",
    name: "stuinfo",
    component: () => import("@/views/dmspage/DmsStuInfo"),
    meta: {
      roles: ["0"],
    },
  },
  {
    path: "/dms/appeal",
    name: "appeal",
    component: () => import("@/views/dmspage/DmsAppeal"),
    meta: {
      roles: ["0"],
    },
  },
  {
    path: "/dms/dorminfo",
    name: "dorminfo",
    component: () => import("@/views/dmspage/DmsDormInfo"),
    meta: {
      roles: ["0"],
    },
  },
  {
    path: "/dms/dormadjust",
    name: "dormadjust",
    component: () => import("@/views/dmspage/DmsDormAdjust"),
    meta: {
      roles: ["0"],
    },
  },
  {
    path: "/dms/maintaininfo",
    name: "maintaininfo",
    component: () => import("@/views/dmspage/DmsMaintainInfo"),
    meta: {
      roles: ["0"],
    },
  },
  {
    path: "/dms/maintainhistory",
    name: "maintainhistory",
    component: () => import("@/views/dmspage/DmsMaintainHistory"),
    meta: {
      roles: ["0"],
    },
  },
  {
    path: "/dms/stuselfinfo",
    name: "stuselfinfo",
    component: () => import("@/views/stupage/Stuselfinfo"),
    meta: {
      roles: ["1"],
    },
  },
  {
    path: "/dms/stuappeal",
    name: "stuappeal",
    component: () => import("@/views/stupage/Stuappeal"),
    meta: {
      roles: ["1"],
    },
  },
  {
    path: "/dms/stumaintain",
    name: "stumaintain",
    component: () => import("@/views/stupage/Stumaintain"),
    meta: {
      roles: ["1"],
    },
  },
  {
    path: "/dms/studorminfo",
    name: "studorminfo",
    component: () => import("@/views/stupage/Studorminfo"),
    meta: {
      roles: ["1"],
    },
  },
];
