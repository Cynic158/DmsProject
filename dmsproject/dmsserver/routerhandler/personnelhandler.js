const db = require("../db/db");

function getpersonnellist(req, res) {
  db.query(
    `select id,pname,phone from personnel where status=0 and type=${req.query.type}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        res.send({
          status: 0,
          message: "获取人员列表成功",
          personnellist: result,
        });
      }
    }
  );
}

function getpersonnelphone(req, res) {
  db.query(
    `select phone from personnel where pname="${req.query.pname}"`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        res.send({
          status: 0,
          message: "获取人员号码成功",
          personnelphone: result,
        });
      }
    }
  );
}

function getpersonnelname(req, res) {
  db.query(
    `select pname,phone from personnel where status=0 and pbuilding='${req.query.pbuilding}'`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        res.send({
          status: 0,
          message: "获取人员名字成功",
          personnelname: result,
        });
      }
    }
  );
}

module.exports = {
  getpersonnellist,
  getpersonnelphone,
  getpersonnelname,
};
