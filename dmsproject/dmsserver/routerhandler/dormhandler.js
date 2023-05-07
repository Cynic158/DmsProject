const db = require("../db/db");

function getroomlist(req, res) {
  console.log(req.query.building);
  db.query(
    `select floor,room,stucount from dorm where building='${req.query.building}'`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        res.send({
          status: 0,
          message: "获取宿舍信息成功",
          roomlist: result,
        });
      }
    }
  );
}

function getbuildinglist(req, res) {
  db.query("select * from dormbuilding", function (err, result) {
    if (err) {
      console.log(err.message);
    } else {
      res.send({
        status: 0,
        message: "获取宿舍列表成功",
        buildinglist: result,
      });
    }
  });
}

function getroomstuinfo(req, res) {
  db.query(
    `select id,bed,sex,major,stuclass,stunumber,stuname,phone,counsellor,job,email from student where status=0 and building='${req.query.building}' and room='${req.query.room}' order by bed`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        res.send({
          status: 0,
          message: "获取宿舍人员信息成功",
          roomstuinfo: result,
        });
      }
    }
  );
}

function getremainlist(req, res) {
  // console.log(req.query.building);
  if (req.query.building == "") {
    db.query("select * from dorm where stucount<4", function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        res.send({
          status: 0,
          message: "获取未满宿舍列表成功",
          remainlist: result,
        });
      }
    });
  } else {
    db.query(
      `select * from dorm where stucount<4 and building='${req.query.building}'`,
      function (err, result) {
        if (err) {
          console.log(err.message);
        } else {
          res.send({
            status: 0,
            message: "获取未满宿舍列表成功",
            remainlist: result,
          });
        }
      }
    );
  }
}

function getadjustlist(req, res) {
  db.query(
    "select id,stuid,stuname,building,room,status from dormadjust where isdelete=0 order by status",
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        res.send({
          status: 0,
          message: "获取申请调宿列表成功",
          adjustlist: result,
        });
      }
    }
  );
}

function getadjustdetail(req, res) {
  db.query(
    `select id,building,room,bed,stuname,job,sex,stuclass,stunumber,phone,major,counsellor from student where id=${req.query.stuid}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        db.query(
          `select id,reason,adjustbuilding,adjustroom,adjustbed,adjustmessage,status from dormadjust where id=${req.query.adjustid}`,
          function (err1, result1) {
            if (err1) {
              console.log(err1.message);
            } else {
              res.send({
                status: 0,
                message: "获取调宿申请详情成功",
                studetail: result,
                adjustdetail: result1,
              });
            }
          }
        );
      }
    }
  );
}

function getadjuststatus(req, res) {
  db.query(
    `select id,reason,adjustbuilding,adjustroom,adjustbed,adjustmessage,status from dormadjust where stuid=${req.query.stuid} and isconfirm=0 order by id DESC`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        res.send({
          status: 0,
          message: "获取调宿状态详情成功",
          adjustdetail: result,
        });
      }
    }
  );
}

function confirmstep(req, res) {
  db.query(
    `update dormadjust set isconfirm=1 where stuid=${req.query.stuid}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows >= 1) {
        res.send({
          status: 0,
          message: "确认成功",
        });
      }
    }
  );
}

function addadjust(req, res) {
  db.query(
    `select id,stuname,building,room from student where id=${req.query.stuid}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        db.query(
          `insert into dormadjust (stuid,stuname,building,room,reason) values (?,?,?,?,?)`,
          [
            result[0].id,
            result[0].stuname,
            result[0].building,
            result[0].room,
            req.query.reason,
          ],
          function (err1, result1) {
            if (err1) {
              console.log(err1.message);
            }
            if (result1.affectedRows == 1) {
              res.send({
                status: 0,
                message: "申请成功",
              });
            }
          }
        );
      }
    }
  );
}

function nopassadjust(req, res) {
  db.query(
    `update dormadjust set status=3,adjustmessage='${req.query.adjustmessage}' where id=${req.query.id}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows == 1) {
        res.send({
          status: 0,
          message: "驳回成功",
        });
      }
    }
  );
}

function passadjust(req, res) {
  db.query(
    `update dormadjust set status=0,adjustmessage='${req.query.adjustmessage}' where id=${req.query.id}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows == 1) {
        res.send({
          status: 0,
          message: "通过成功",
        });
      }
    }
  );
}

function deleteadjust(req, res) {
  db.query(
    `update dormadjust set isdelete=1 where id=${req.query.id}`,
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

function startadjust(req, res) {
  db.query(
    `update dormadjust set status=2,adjustbuilding='${req.query.adjustbuilding}',adjustroom='${req.query.adjustroom}',adjustbed='${req.query.adjustbed}' where id=${req.query.id}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows == 1) {
        res.send({
          status: 0,
          message: "调宿成功",
        });
      }
    }
  );
}

function canceladjust(req, res) {
  db.query(
    `update dormadjust set status=4,adjustmessage='${req.query.adjustmessage}' where id=${req.query.id}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows == 1) {
        res.send({
          status: 0,
          message: "中断成功",
        });
      }
    }
  );
}

function stucanceladjust(req, res) {
  db.query(
    `update dormadjust set status=4,reason='${req.query.reason}' where id=${req.query.id}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows == 1) {
        res.send({
          status: 0,
          message: "中断成功",
        });
      }
    }
  );
}

function finishadjust(req, res) {
  db.query(
    `update dormadjust set status=5,adjustmessage='${req.query.adjustmessage}' where id=${req.query.id}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows == 1) {
        db.query(
          `select stuid,building,room,adjustbuilding,adjustroom,adjustbed from dormadjust where id=${req.query.id}`,
          function (err1, result1) {
            if (err1) {
              console.log(err1.message);
            } else {
              db.query(
                `select stucount from dorm where building='${result1[0].building}' and room='${result1[0].room}'`,
                function (err2, result2) {
                  if (err2) {
                    console.log(err2.message);
                  } else {
                    db.query(
                      `update dorm set stucount='${
                        parseInt(result2[0].stucount) - 1
                      }' where building='${result1[0].building}' and room='${
                        result1[0].room
                      }'`,
                      function (err3, result3) {
                        if (err3) {
                          console.log(err3.message);
                        }
                        if (result3.affectedRows == 1) {
                          db.query(
                            `select stucount from dorm where building='${result1[0].adjustbuilding}' and room='${result1[0].adjustroom}'`,
                            function (err4, result4) {
                              if (err4) {
                                console.log(err4.message);
                              } else {
                                db.query(
                                  `update dorm set stucount='${
                                    parseInt(result4[0].stucount) + 1
                                  }' where building='${
                                    result1[0].adjustbuilding
                                  }' and room='${result1[0].adjustroom}'`,
                                  function (err5, result5) {
                                    if (err5) {
                                      console.log(err5.message);
                                    }
                                    if (result5.affectedRows == 1) {
                                      db.query(
                                        `update student set building='${
                                          result1[0].adjustbuilding
                                        }',floor='${result1[0].adjustroom.substring(
                                          0,
                                          result1[0].adjustroom.length - 2
                                        )}',room='${
                                          result1[0].adjustroom
                                        }',bed='${
                                          result1[0].adjustbed
                                        }',job=0 where id=${result1[0].stuid}`,
                                        function (err6, result6) {
                                          if (err6) {
                                            console.log(err6.message);
                                          }
                                          if (result6.affectedRows == 1) {
                                            res.send({
                                              status: 0,
                                              message: "调宿完成",
                                            });
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
}

function roomexist(req, res) {
  db.query(
    `select stucount from dorm where building=${req.query.building} and room=${req.query.room}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        res.send({
          status: 0,
          message: "查询成功",
          existinfo: result,
        });
      }
    }
  );
}

function getadjustbyroom(req, res) {
  db.query(
    `select adjustbed,stuname from dormadjust where adjustbuilding=${req.query.adjustbuilding} and adjustroom=${req.query.adjustroom} and status=2`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        res.send({
          status: 0,
          message: "查询成功",
          adjuststu: result,
        });
      }
    }
  );
}

function changedormjob(req, res) {
  // 需要先判断fromid是舍长还是舍长兼层长
  // 如果是舍长，则将fromid降至舍员
  // 如果是舍长兼层长，则将fromid降至层长
  // 如果toid是舍员，则升至舍长
  // 如果toid是层长，则升至舍长兼层长
  if (req.query.fromjob == 1) {
    // 舍长降至舍员
    db.query(
      `update student set job=0 where id=${req.query.fromid}`,
      function (err, result) {
        if (err) {
          console.log(err.message);
        }
        if (result.affectedRows == 1) {
          if (req.query.tojob == 0) {
            db.query(
              `update student set job=1 where id=${req.query.toid}`,
              function (err1, result1) {
                if (err1) {
                  console.log(err1.message);
                }
                if (result1.affectedRows == 1) {
                  res.send({
                    status: 0,
                    message: "变更职务成功",
                  });
                }
              }
            );
          } else if (req.query.tojob == 2) {
            db.query(
              `update student set job=3 where id=${req.query.toid}`,
              function (err1, result1) {
                if (err1) {
                  console.log(err1.message);
                }
                if (result1.affectedRows == 1) {
                  res.send({
                    status: 0,
                    message: "变更职务成功",
                  });
                }
              }
            );
          } else {
            res.send({
              status: 1,
              message: "变更职务出错",
            });
          }
        }
      }
    );
  } else if (req.query.fromjob == 3) {
    db.query(
      `update student set job=2 where id=${req.query.fromid}`,
      function (err, result) {
        if (err) {
          console.log(err.message);
        }
        if (result.affectedRows == 1) {
          if (req.query.tojob == 0) {
            db.query(
              `update student set job=1 where id=${req.query.toid}`,
              function (err1, result1) {
                if (err1) {
                  console.log(err1.message);
                }
                if (result1.affectedRows == 1) {
                  res.send({
                    status: 0,
                    message: "变更职务成功",
                  });
                }
              }
            );
          } else if (req.query.tojob == 2) {
            db.query(
              `update student set job=3 where id=${req.query.toid}`,
              function (err1, result1) {
                if (err1) {
                  console.log(err1.message);
                }
                if (result1.affectedRows == 1) {
                  res.send({
                    status: 0,
                    message: "变更职务成功",
                  });
                }
              }
            );
          } else {
            res.send({
              status: 1,
              message: "变更职务出错",
            });
          }
        }
      }
    );
  } else {
    res.send({
      status: 1,
      message: "变更职务出错",
    });
  }
}

module.exports = {
  getroomlist,
  getbuildinglist,
  getroomstuinfo,
  getremainlist,
  getadjustlist,
  getadjustdetail,
  nopassadjust,
  passadjust,
  deleteadjust,
  roomexist,
  startadjust,
  getadjustbyroom,
  canceladjust,
  finishadjust,
  changedormjob,
  getadjuststatus,
  confirmstep,
  addadjust,
  stucanceladjust,
};
