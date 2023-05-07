const db = require("../db/db");

function getappeallist(req, res) {
  let page = (req.query.page - 1) * 12;
  db.query(
    `select id,type,time,content,appealstu,stunumber,phone,building,room from appeal where status=0 order by id DESC limit ${page},12`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        db.query(
          "select count(*) from appeal where status=0",
          function (err, result1) {
            if (err) {
              console.log(err.message);
            } else {
              res.send({
                status: 0,
                message: "获取诉求列表成功",
                appeallist: result,
                appealcount: result1,
              });
            }
          }
        );
      }
    }
  );
}

function getappeallistbyid(req, res) {
  let page = (req.query.page - 1) * 12;
  db.query(
    `select id,type,time,content,appealstu,stunumber,phone,building,room from appeal where status!=2 and stuid=${req.query.stuid} order by id DESC limit ${page},12`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        db.query(
          `select count(*) from appeal where status!=2 and stuid=${req.query.stuid}`,
          function (err, result1) {
            if (err) {
              console.log(err.message);
            } else {
              res.send({
                status: 0,
                message: "获取诉求列表成功",
                appeallist: result,
                appealcount: result1,
              });
            }
          }
        );
      }
    }
  );
}

function getappealinfo(req, res) {
  if (req.query.id == 0) {
    db.query(
      "select max(id) from appeal where status=0",
      function (err, result) {
        if (err) {
          console.log(err.message);
        } else {
          let maxid = Object.values(result[0])[0];
          console.log(maxid);
          db.query(
            `select id,type,content,time,appealstu from appeal where id=${maxid}`,
            function (err, result) {
              if (err) {
                console.log(err.message);
              } else {
                console.log(result);
                res.send({
                  status: 0,
                  message: "获取诉求成功",
                  appealinfo: result,
                });
              }
            }
          );
        }
      }
    );
  } else {
    db.query(
      `select id,type,content,time,appealstu from appeal where id=${req.query.id}`,
      function (err, result) {
        if (err) {
          console.log(err.message);
        } else {
          res.send({
            status: 0,
            message: "获取诉求成功",
            appealinfo: result,
          });
        }
      }
    );
  }
}

function getappealinfobyid(req, res) {
  if (req.query.id == 0) {
    db.query(
      `select max(id) from appeal where status!=2 and stuid=${req.query.stuid}`,
      function (err, result) {
        if (err) {
          console.log(err.message);
        } else {
          let maxid = Object.values(result[0])[0];
          console.log(maxid);
          db.query(
            `select id,type,content,time,appealstu from appeal where id=${maxid}`,
            function (err, result) {
              if (err) {
                console.log(err.message);
              } else {
                console.log(result);
                res.send({
                  status: 0,
                  message: "获取诉求成功",
                  appealinfo: result,
                });
              }
            }
          );
        }
      }
    );
  } else {
    db.query(
      `select id,type,content,time,appealstu from appeal where id=${req.query.id}`,
      function (err, result) {
        if (err) {
          console.log(err.message);
        } else {
          res.send({
            status: 0,
            message: "获取诉求成功",
            appealinfo: result,
          });
        }
      }
    );
  }
}

function clearappeal(req, res) {
  db.query(
    `update appeal set status=1 where status=0 and id>0`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows >= 1) {
        console.log("send");
        res.send({
          status: 0,
          message: "删除成功",
        });
      } else if (result.affectedRows == 0) {
        console.log("nosend");
        res.send({
          status: 1,
          message: "无诉求可清空",
        });
      }
    }
  );
}

function deleteappeal(req, res) {
  console.log(req.query.delid);
  let str = "";
  if (req.query.type == 0) {
    str = `update appeal set status=1 where id=${req.query.delid}`;
  } else if (req.query.type == 1) {
    str = `update appeal set status=2 where id=${req.query.delid}`;
  }
  db.query(str, function (err, result) {
    if (err) {
      console.log(err.message);
    }
    if (result.affectedRows == 1) {
      res.send({
        status: 0,
        message: "删除成功",
      });
    }
  });
}

function updateappeal(req, res) {
  if (req.body.type == "" || req.body.content == "") {
    res.send({
      status: 1,
      message: "正文不能为空",
    });
  } else {
    db.query(
      `update appeal set type='${req.body.type}',content='${req.body.content}' where id=${req.body.id}`,
      function (err, result) {
        if (err) {
          console.log(err.message);
        }
        if (result.affectedRows == 1) {
          res.send({
            status: 0,
            message: "更改成功",
          });
        }
      }
    );
  }
}

function getNowTime() {
  const time = new Date();
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
  // console.log(timestr);
  return timestr;
}
function addappeal(req, res) {
  if (req.body.type == "" || req.body.content == "") {
    res.send({
      status: 1,
      message: "正文不能为空",
    });
  } else {
    // 查询学生信息获取stuname,stunumber,phone,building,room,id
    db.query(
      `select stuname,stunumber,phone,building,room,id from student where id=${req.body.stuid}`,
      function (err, result) {
        if (err) {
          console.log(err.message);
        } else {
          // 获取当前时间
          let addtime = getNowTime();
          let stuarr = [];
          stuarr.push(req.body.type, addtime, req.body.content);
          for (let v in result[0]) {
            stuarr.push(result[0][v]);
          }
          db.query(
            "insert into appeal (type,time,content,appealstu,stunumber,phone,building,room,stuid) values (?,?,?,?,?,?,?,?,?)",
            stuarr,
            function (err1, result1) {
              if (err1) {
                console.log(err1.message);
              }
              if (result1.affectedRows == 1) {
                res.send({
                  status: 0,
                  message: "发布成功",
                });
              }
            }
          );
        }
      }
    );
  }
}

module.exports = {
  getappeallist,
  getappeallistbyid,
  getappealinfo,
  getappealinfobyid,
  clearappeal,
  deleteappeal,
  updateappeal,
  addappeal,
};
