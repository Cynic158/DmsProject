const express = require("express");
const parseJWT = require("express-jwt");
const koa = require("koa");
const serve = require("koa-static");
const { historyApiFallback } = require("koa2-connect-history-api-fallback");
const proxy = require("koa2-proxy-middleware");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./router/user");
const noticeRouter = require("./router/notice");
const appealRouter = require("./router/appeal");
const maintainRouter = require("./router/maintain");
const personnelRouter = require("./router/personnel");
const majorRouter = require("./router/major");
const dormRouter = require("./router/dorm");
const app = express();
const serveapp = new koa();
serveapp.use(
  proxy({
    targets: {
      "/prod-api/(.*)": {
        target: "http://127.0.0.1",
        changeOrigin: true,
        pathRewrite: {
          "/prod-api": "",
        },
      },
    },
  })
);
serveapp.use(
  historyApiFallback({
    whiteList: ["/prod-api"],
  })
);
serveapp.use(serve("./dist"));
serveapp.listen(3333, () => {
  console.log("宿舍项目启动于http://127.0.0.1:3333");
});
const secretKey = "wyudmsdemo";
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.get("/", function (_, res) {
//   res.sendFile("./dist/index.html");
// });
app.use("/dmssrc", express.static("./src"));
app.use(
  parseJWT.expressjwt({ secret: secretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/api\/login/, /^\/api\/reqemailcode/, /^\/api\/forget/],
  })
);
app.use("/api", userRouter);
app.use("/api", noticeRouter);
app.use("/api", appealRouter);
app.use("/api", maintainRouter);
app.use("/api", personnelRouter);
app.use("/api", dormRouter);
app.use("/api", majorRouter);
app.use((err, req, res, next) => {
  if (err.name == "UnauthorizedError") {
    return res.send({
      status: 1,
      message: "voidtoken",
    });
  } else {
    res.send({
      status: 1,
      message: "unknownError",
    });
  }
});
app.listen(80, () => {
  console.log("http://127.0.0.1");
});
