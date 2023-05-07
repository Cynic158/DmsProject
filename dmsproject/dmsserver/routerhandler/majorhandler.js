const db = require("../db/db");

function getmajorlist(req, res) {
  db.query("select majorname from major", function (err, result) {
    if (err) {
      console.log(err.message);
    } else {
      res.send({
        status: 0,
        message: "获取专业列表成功",
        majorlist: result,
      });
    }
  });
}

module.exports = {
  getmajorlist,
};
