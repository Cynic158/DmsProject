const db = require("../db/db");

function getnoticelist(req, res) {
  let page = (req.query.page - 1) * 12;
  db.query(
    `select id,title,time,noticeman from notice where status=0 order by id DESC limit ${page},12`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        db.query(
          "select count(*) from notice where status=0",
          function (err, result1) {
            if (err) {
              console.log(err.message);
            } else {
              res.send({
                status: 0,
                message: "获取公告列表成功",
                noticelist: result,
                noticecount: result1,
              });
            }
          }
        );
      }
    }
  );
}

function getnoticeinfo(req, res) {
  if (req.query.id == 0) {
    db.query(
      "select max(id) from notice where status=0",
      function (err, result) {
        if (err) {
          console.log(err.message);
        } else {
          let maxid = Object.values(result[0])[0];
          db.query(
            `select id,title,content,time,noticeman from notice where id=${maxid}`,
            function (err, result) {
              if (err) {
                console.log(err.message);
              } else {
                res.send({
                  status: 0,
                  message: "获取公告成功",
                  noticeinfo: result,
                });
              }
            }
          );
        }
      }
    );
  } else {
    db.query(
      `select id,title,content,time,noticeman from notice where id=${req.query.id}`,
      function (err, result) {
        if (err) {
          console.log(err.message);
        } else {
          res.send({
            status: 0,
            message: "获取公告成功",
            noticeinfo: result,
          });
        }
      }
    );
  }
}

function updatenoticeinfo(req, res) {
  console.log(req.body.editnoticeobj);
  let noticeobj = req.body.editnoticeobj;
  db.query(
    "update notice set title=?,content=?,noticeman=? where id=?",
    [noticeobj.title, noticeobj.content, noticeobj.noticeman, noticeobj.id],
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

function addnotice(req, res) {
  console.log(req.body.editnoticeobj);
  console.log(req.body.noticetime);
  let time = new Date(req.body.noticetime);
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
  console.log(timestr);
  let noticeobj = req.body.editnoticeobj;
  db.query(
    "insert into notice (title,content,noticeman,time) values (?,?,?,?)",
    [noticeobj.title, noticeobj.content, noticeobj.noticeman, timestr],
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows == 1) {
        res.send({
          status: 0,
          message: "发布公告成功",
        });
      }
    }
  );
}

function deletenoticeinfo(req, res) {
  console.log(req.query.delid);
  db.query(
    `update notice set status=1 where id=${req.query.delid}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows == 1) {
        res.send({
          status: 0,
          message: "删除成功",
        });
      }
    }
  );
}

module.exports = {
  getnoticelist,
  getnoticeinfo,
  updatenoticeinfo,
  addnotice,
  deletenoticeinfo,
};
