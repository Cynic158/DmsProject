const db = require("../db/db");
const multiparty = require("multiparty");
const path = require("path");
const fs = require("fs");

function getmaintainlist(req, res) {
  // 初始化sql语句以及页码
  let page = (req.body.page - 1) * 12;
  let sqlstr = `select id,time,type,building,room,appoint,content,phone,status from maintain where status=0 and isdelete=0 or status=1 and isdelete=0 order by status DESC limit ${page},12`;
  let sqlstr2 = "select count(*) from maintain";

  let siftflag = JSON.stringify(req.body.sift) == "{}";

  let addstr = function () {
    for (let v in req.body.sift) {
      // 如果是状态则直接拼接数值
      if (v == "status" && req.body.sift[v] != "") {
        sqlstr = sqlstr + ` ${v}=${req.body.sift[v]} and`;
        sqlstr2 = sqlstr2 + ` ${v}=${req.body.sift[v]} and`;
      } else if (req.body.sift[v] != "") {
        // 否则拼接字符串
        sqlstr = sqlstr + ` ${v}="${req.body.sift[v]}" and`;
        sqlstr2 = sqlstr2 + ` ${v}="${req.body.sift[v]}" and`;
      }
    }
  };
  // 判断是否存在筛选条件
  // 不存在筛选条件则直接根据页码进行数据库数据获取
  if (!siftflag) {
    // 存在筛选条件则更改sql语句
    sqlstr2 = `select count(*) from maintain where`;
    sqlstr = `select id,time,type,building,room,appoint,content,phone,status from maintain where`;
    addstr();
    if (req.body.sift.status == "") {
      sqlstr =
        sqlstr + ` status=0 and isdelete=0 or status=1 and isdelete=0 and`;
      sqlstr2 =
        sqlstr2 + ` status=0 and isdelete=0 or status=1 and isdelete=0 and`;
      // 再循环一遍
      addstr();
    }
    sqlstr =
      sqlstr.substring(0, sqlstr.length - 4) +
      ` order by status DESC limit ${page},12`;
    sqlstr2 = sqlstr2.substring(0, sqlstr2.length - 4);
  } else {
    sqlstr = `select id,time,type,building,room,appoint,content,phone,status from maintain where status=0 and isdelete=0 or status=1 and isdelete=0 order by status DESC limit ${page},12`;
    sqlstr2 =
      "select count(*) from maintain where status=0 and isdelete=0 or status=1 and isdelete=0";
  }
  // 查询数据库
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.log(err.message);
    } else {
      db.query(sqlstr2, function (err1, result1) {
        if (err1) {
          console.log(err1.message);
        } else {
          // console.log(result);
          res.send({
            status: 0,
            message: "获取维修列表成功",
            maintainlist: result,
            maintaincount: result1,
          });
        }
      });
    }
  });
}

function getstumaintainlist(req, res) {
  sqlstr = `select id,time,type,content,status from maintain where stuid=${req.body.stuid} and isdelete!=1 order by status`;
  // 查询数据库
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.log(err.message);
    } else {
      res.send({
        status: 0,
        message: "获取维修列表成功",
        maintainlist: result,
      });
    }
  });
}

function getmaintainbyid(req, res) {
  console.log(req.query.id);
  db.query(
    `select id,time,type,building,room,appoint,content,img,phone,status,mtman,mtphone,mtcontent from maintain where id=${req.query.id}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        res.send({
          status: 0,
          message: "获取维修信息成功",
          maintaininfo: result,
        });
      }
    }
  );
}

function acceptmaintain(req, res) {
  console.log(req.body.id, req.body.mtman, req.body.mtcontent);
  db.query(
    "update maintain set mtman=?,mtcontent=?,mtphone=?,status=1 where id=?",
    [req.body.mtman, req.body.mtcontent, req.body.mtphone, req.body.id],
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows == 1) {
        res.send({
          status: 0,
          message: "受理成功",
        });
      }
    }
  );
}

function donemaintain(req, res) {
  console.log(req.query.id);
  db.query(
    `update maintain set status=2,mtcontent='${req.query.mtcontent}' where id=${req.query.id}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows == 1) {
        res.send({
          status: 0,
          message: "处理完成",
        });
      }
    }
  );
}

function studonemaintain(req, res) {
  console.log(req.query.id);
  db.query(
    `update maintain set status=2,content='${req.query.content}' where id=${req.query.id}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows == 1) {
        res.send({
          status: 0,
          message: "处理完成",
        });
      }
    }
  );
}

function cancelmaintain(req, res) {
  db.query(
    `update maintain set status=3,mtcontent='${req.query.mtcontent}' where id=${req.query.id}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows == 1) {
        res.send({
          status: 0,
          message: "取消维修成功",
        });
      }
    }
  );
}

function stucancelmaintain(req, res) {
  db.query(
    `select content from maintain where id=${req.query.id}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        let newcontent = result[0].content + "(学生已取消该维修单)";
        db.query(
          `update maintain set status=3, content='${newcontent}' where id=${req.query.id}`,
          function (err1, result1) {
            if (err1) {
              console.log(err1.message);
            }
            if (result1.affectedRows == 1) {
              res.send({
                status: 0,
                message: "已取消维修",
              });
            }
          }
        );
      }
    }
  );
}

function deletemaintain(req, res) {
  console.log(req.body.id, req.body.type);
  let deletetype = 1;
  if (req.body.type == 0) {
    // 后台删除
    deletetype = 1;
  } else if (req.body.type == 1) {
    // 前台删除
    deletetype = 2;
  }
  db.query(
    "update maintain set isdelete=? where id=?",
    [deletetype, req.body.id],
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows == 1) {
        res.send({
          status: 0,
          message: "处理完成",
        });
      }
    }
  );
}

function getmaintainhistory(req, res) {
  // 初始化sql语句以及页码
  let page = (req.body.page - 1) * 12;
  let sqlstr = `select id,time,type,building,room,appoint,content,phone,status from maintain where status=2 and isdelete=0 or status=3 and isdelete=0 order by status DESC limit ${page},12`;
  let sqlstr2 = "select count(*) from maintain";

  let siftflag = JSON.stringify(req.body.sift) == "{}";

  let addstr = function () {
    for (let v in req.body.sift) {
      // 如果是状态则直接拼接数值
      if (v == "status" && req.body.sift[v] != "") {
        sqlstr = sqlstr + ` ${v}=${req.body.sift[v]} and`;
        sqlstr2 = sqlstr2 + ` ${v}=${req.body.sift[v]} and`;
      } else if (req.body.sift[v] != "") {
        // 否则拼接字符串
        sqlstr = sqlstr + ` ${v}="${req.body.sift[v]}" and`;
        sqlstr2 = sqlstr2 + ` ${v}="${req.body.sift[v]}" and`;
      }
    }
  };
  // 判断是否存在筛选条件
  // 不存在筛选条件则直接根据页码进行数据库数据获取
  if (!siftflag) {
    // 存在筛选条件则更改sql语句
    sqlstr2 = `select count(*) from maintain where`;
    sqlstr = `select id,time,type,building,room,appoint,content,phone,status from maintain where`;
    addstr();
    if (req.body.sift.status == "") {
      sqlstr =
        sqlstr + ` status=2 and isdelete=0 or status=3 and isdelete=0 and`;
      sqlstr2 =
        sqlstr2 + ` status=2 and isdelete=0 or status=3 and isdelete=0 and`;
      // 再循环一遍
      addstr();
    }
    sqlstr =
      sqlstr.substring(0, sqlstr.length - 4) +
      ` order by status DESC limit ${page},12`;
    sqlstr2 = sqlstr2.substring(0, sqlstr2.length - 4);
  } else {
    sqlstr = `select id,time,type,building,room,appoint,content,phone,status from maintain where status=2 and isdelete=0 or status=3 and isdelete=0 order by status DESC limit ${page},12`;
    sqlstr2 =
      "select count(*) from maintain where status=2 and isdelete=0 or status=3 and isdelete=0";
  }
  // 查询数据库
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.log(err.message);
    } else {
      db.query(sqlstr2, function (err1, result1) {
        if (err1) {
          console.log(err1.message);
        } else {
          // console.log(result);
          res.send({
            status: 0,
            message: "获取维修历史成功",
            maintainhistorylist: result,
            maintainhistorycount: result1,
          });
        }
      });
    }
  });
}
function generateFilename(oldFilename) {
  let d = new Date();
  let names = oldFilename.split(".");
  return `${names[0]}${d.getTime()}.${names[1]}`;
}
function sqladdmt(fields, type, res, sqlurl) {
  let time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  let day = time.getDate();
  day = day < 10 ? "0" + day : day;
  let hour = time.getHours();
  hour = hour < 10 ? "0" + hour : hour;
  let minute = time.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  let timestr = `${year}-${month}-${day} ${hour}:${minute}`;

  db.query(
    `select building,room,phone,id from student where id=${fields.stuid[0]}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        let insertstr =
          "insert into maintain (time,type,building,room,appoint,content,phone,stuid) values (?,?,?,?,?,?,?,?)";
        let sqlarr = [
          timestr,
          fields.type[0],
          result[0].building,
          result[0].room,
          fields.appoint[0],
          fields.content[0],
          result[0].phone,
          result[0].id,
        ];
        if (type != 0) {
          // 有图片
          insertstr =
            "insert into maintain (time,type,building,room,appoint,content,img,phone,stuid) values (?,?,?,?,?,?,?,?,?)";
          sqlarr = [
            timestr,
            fields.type[0],
            result[0].building,
            result[0].room,
            fields.appoint[0],
            fields.content[0],
            sqlurl,
            result[0].phone,
            result[0].id,
          ];
        }
        db.query(insertstr, sqlarr, function (err1, result1) {
          if (err1) {
            console.log(err1.message);
          }
          if (result1.affectedRows == 1) {
            res.send({
              status: 0,
              message: "申报维修成功",
            });
          }
        });
      }
    }
  );
}
function addmaintain(req, res) {
  let form = new multiparty.Form({
    uploadDir: "./src",
  });
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err.message);
    } else {
      let sqlurl = "";
      Object.values(files).forEach((file) => {
        let size = file[0].size;
        let oldpath = file[0].path;
        if (size > 0) {
          let oldname = file[0].originalFilename;
          // 此处拼接，首先用path.dirname取得oldpath的除去文件名的路径
          // 然后与新生产的文件名进行拼接
          let newpath = path.join(
            path.dirname(oldpath),
            generateFilename(oldname)
          );
          // 以同步的方式重命名文件
          fs.renameSync(oldpath, newpath);
          let fileurl = "http://127.0.0.1/dmssrc/" + newpath.substring(4);
          sqlurl = sqlurl + fileurl + " ";
        } else {
          // 以同步的方式移除大小有误的文件
          fs.rmSync(oldpath);
        }
      });
      sqlurl = sqlurl.substring(0, sqlurl.length - 1);
      console.log(fields.stuid[0], typeof fields.stuid[0]);
      if (sqlurl == "") {
        console.log("noimg");
        // 无图片时
        sqladdmt(fields, 0, res);
      } else {
        // 有图片时
        sqladdmt(fields, 1, res, sqlurl);
      }
    }
  });
}

module.exports = {
  getmaintainlist,
  getmaintainbyid,
  acceptmaintain,
  donemaintain,
  cancelmaintain,
  deletemaintain,
  getmaintainhistory,
  getstumaintainlist,
  addmaintain,
  stucancelmaintain,
  studonemaintain,
};
