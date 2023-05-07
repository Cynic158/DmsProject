const db = require("../db/db");
const bcryptjs = require("bcryptjs");
const md5 = require("js-md5");
const generateJWT = require("jsonwebtoken");
const secretKey = "wyudmsdemo";
const nodemailer = require("nodemailer");
// 临时
// const md5 = require("js-md5");

function impexcel(req, res) {
  // 暂时搁置，excel批量导入
  // console.log(req.body);
  // for (let i = 0; i < req.body.result.length; i++) {
  //   // 再加临时md5
  //   req.body.result[i][11] = md5(
  //     req.body.result[i][11].substring(req.body.result[i][11].length - 6)
  //   );
  //   req.body.result[i][11] = bcryptjs.hashSync(req.body.result[i][11], 1);
  //   db.query(
  //     "insert into stutable (building, floor, room, bed, sex, major, stuclass, stunumber, stuname, phone, counsellor, idpwd, job) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  //     req.body.result[i],
  //     function (err, res) {
  //       if (err) {
  //         console.log(err.message);
  //       }
  //       if (res.affectedRows == 1) {
  //         console.log("insert success");
  //       }
  //     }
  //   );
  // }
  res.send("impexcelsuccess");
}

function login(req, res) {
  // console.log(req.body);
  let comparestr = bcryptjs.hashSync(md5("123456"), 1);
  if (!req.body.dsname || !req.body.dspassword) {
    res.send({ status: 1, message: "用户名和密码不能为空" });
  } else if (
    req.body.dsname == "admin" &&
    bcryptjs.compareSync(req.body.dspassword, comparestr)
  ) {
    let sendtoken = generateJWT.sign(
      { dsname: req.body.dsname, id: 0 },
      secretKey,
      { expiresIn: "12h" }
    );
    res.send({
      message: "登录成功",
      status: 0,
      token: sendtoken,
      id: 0,
      dsuserName: "Cynic",
      job: "admin",
      type: 0,
    });
  } else {
    db.query(
      `select id,stuname,idpwd,job from student where stunumber='${req.body.dsname}'`,
      function (err, result) {
        if (err) {
          console.log(err.message);
        } else {
          if (result.length == 0) {
            res.send({
              message: "用户名或者密码错误",
              status: 1,
            });
          } else if (
            !bcryptjs.compareSync(req.body.dspassword, result[0].idpwd)
          ) {
            res.send({
              message: "用户名或者密码错误",
              status: 1,
            });
          } else {
            let sendtoken = generateJWT.sign(
              { dsname: result[0].stuname, id: result[0].id },
              secretKey,
              { expiresIn: "12h" }
            );
            res.send({
              message: "登录成功",
              status: 0,
              token: sendtoken,
              id: result[0].id,
              dsuserName: result[0].stuname,
              job: result[0].job,
              type: 1,
            });
          }
        }
      }
    );
  }
}

function forget(req, res) {
  console.log(req.body.dsemail);
  db.query(
    `select id,email,emailcode,emailcodetime from student where email='${req.body.dsemail}'`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else if (result.length == 0) {
        res.send({
          status: 1,
          message: "该邮箱未绑定账号",
        });
      } else {
        let time = new Date();
        let nowtime = parseInt(time.getTime() / 1000);
        let gaptime = nowtime - parseInt(result[0].emailcodetime);
        if (gaptime > 600) {
          res.send({
            status: 1,
            message: "该验证码有误",
          });
        } else if (req.body.dsemailcode != result[0].emailcode) {
          res.send({
            status: 1,
            message: "该验证码有误",
          });
        } else {
          let sqlpwd = bcryptjs.hashSync(req.body.dspassword, 1);
          db.query(
            `update student set idpwd='${sqlpwd}' where id=${result[0].id}`,
            function (err1, result1) {
              if (err1) {
                console.log(err1.message);
              }
              if (result1.affectedRows == 1) {
                res.send({
                  status: 0,
                  message: "密码修改成功",
                });
              }
            }
          );
        }
      }
    }
  );
}

function reqemailcode(req, res) {
  console.log(req.query.dsemail);
  db.query(
    `select id,email from student where email='${req.query.dsemail}'`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        if (result.length == 0) {
          res.send({
            status: 1,
            message: "该邮箱没有绑定账号",
          });
        } else {
          let code_fill_str = ["000000", "00000", "0000", "000", "00", "0", ""];
          let code = "" + parseInt(Math.random() * 1000000);
          code = code_fill_str[code.length] + code;
          let transporter = nodemailer.createTransport({
            service: "qq",
            port: 465,
            secureConnection: true,
            auth: {
              user: "1582062784@qq.com",
              pass: "hzpwhfploswohaif",
            },
          });

          let mailOptions = {
            from: "1582062784@qq.com",
            to: result[0].email,
            subject: "邑大宿舍管理系统邮箱验证码",
            text: code,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              res.send({
                status: 1,
                message: "邮箱发送验证码出错",
              });
            } else {
              console.log("Email sent: " + info.response);
              let time = new Date();
              let now = parseInt(time.getTime() / 1000);
              db.query(
                `update student set emailcode='${code}',emailcodetime='${now}' where id=${result[0].id}`,
                function (err1, result1) {
                  if (err1) {
                    console.log(err1.message);
                  }
                  if (result1.affectedRows == 1) {
                    res.send({
                      status: 0,
                      message: "验证码发送成功",
                    });
                  }
                }
              );
            }
          });
        }
      }
    }
  );
}

function getstuinfo(req, res) {
  // 初始化sql语句以及页码
  let page = (req.body.page - 1) * 10;
  let sqlstr = `select id,building,floor,room,bed,sex,job,major,stuclass,stunumber,stuname,phone,counsellor from student where status=0 order by stunumber limit ${page},10`;
  let sqlstr2 = "select count(*) from student where status=0";

  let selectflag = JSON.stringify(req.body.select) == "{}";
  // 判断是否存在筛选条件
  // 不存在筛选条件则直接根据页码进行数据库数据获取
  if (!selectflag) {
    // 存在筛选条件则更改sql语句
    sqlstr2 = `select count(*) from student where status=0 and`;
    sqlstr = `select id,building,floor,room,bed,sex,job,major,stuclass,stunumber,stuname,phone,counsellor from student where status=0 and`;
    for (let v in req.body.select) {
      // 如果是性别或者职务则直接拼接数值
      if (
        (v == "sex" && req.body.select[v] != "") ||
        (v == "job" && req.body.select[v] != "")
      ) {
        sqlstr = sqlstr + ` ${v}=${req.body.select[v]} and`;
        sqlstr2 = sqlstr2 + ` ${v}=${req.body.select[v]} and`;
      } else if (req.body.select[v] != "") {
        // 否则拼接字符串
        sqlstr = sqlstr + ` ${v}="${req.body.select[v]}" and`;
        sqlstr2 = sqlstr2 + ` ${v}="${req.body.select[v]}" and`;
      }
    }
    if (req.body.select.job == 1 || req.body.select.job == 2) {
      req.body.select.job = 3;
      sqlstr = sqlstr.substring(0, sqlstr.length - 4);
      sqlstr2 = sqlstr2.substring(0, sqlstr2.length - 4);
      sqlstr = sqlstr + ` or status=0 and`;
      sqlstr2 = sqlstr2 + ` or status=0 and`;
      // 再走一遍循环
      for (let v in req.body.select) {
        // 如果是性别或者职务则直接拼接数值
        if (
          (v == "sex" && req.body.select[v] != "") ||
          (v == "job" && req.body.select[v] != "")
        ) {
          sqlstr = sqlstr + ` ${v}=${req.body.select[v]} and`;
          sqlstr2 = sqlstr2 + ` ${v}=${req.body.select[v]} and`;
        } else if (req.body.select[v] != "") {
          // 否则拼接字符串
          sqlstr = sqlstr + ` ${v}="${req.body.select[v]}" and`;
          sqlstr2 = sqlstr2 + ` ${v}="${req.body.select[v]}" and`;
        }
      }
    }
    sqlstr =
      sqlstr.substring(0, sqlstr.length - 4) +
      ` order by stunumber limit ${page},10`;
    sqlstr2 = sqlstr2.substring(0, sqlstr2.length - 4);
    console.log(sqlstr, sqlstr2);
  }
  // 查询数据库
  // 需要筛选排除掉密码以及状态非0的
  db.query(sqlstr, function (err, result1) {
    if (err) {
      console.log(err.message);
    } else {
      db.query(sqlstr2, function (err, result2) {
        if (err) {
          console.log(err.message);
        } else {
          // console.log(result);
          res.send({
            status: 0,
            message: "学生数据获取成功",
            list: result1,
            totalcount: result2,
          });
        }
      });
    }
  });
}

function getstubyid(req, res) {
  db.query(
    `select id,building,floor,room,bed,sex,job,major,stuclass,stunumber,stuname,phone,counsellor,email from student where id=${req.body.stuid}`,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        res.send({
          status: 0,
          message: "数据获取成功",
          stuobj: result,
        });
      }
    }
  );
}

function updatestuinfo(req, res) {
  req.body.editobj.sex = parseInt(req.body.editobj.sex);
  req.body.editobj.job = parseInt(req.body.editobj.job);
  let updateobj = req.body.editobj;
  // 查询有无该房间，有房间就将学生数加一，如果房间人数已满就返回1
  // 楼层不能大于13、房间不能大于24、床号不能大于4
  if (parseInt(updateobj.building) > 45 || parseInt(updateobj.building) < 40) {
    res.send({
      status: 1,
      message: "不存在该楼栋",
    });
  }
  if (parseInt(updateobj.floor) > 13 || parseInt(updateobj.floor) <= 0) {
    res.send({
      status: 1,
      message: "楼层数要大于0小于14",
    });
  }
  if (
    parseInt(
      updateobj.room.substring(updateobj.room.length - 2, updateobj.room.length)
    ) > 24 ||
    parseInt(
      updateobj.room.substring(updateobj.room.length - 2, updateobj.room.length)
    ) <= 0
  ) {
    res.send({
      status: 1,
      message: "房间号要大于0小于25",
    });
  }
  if (parseInt(updateobj.bed) > 4 || parseInt(updateobj.bed) <= 0) {
    res.send({
      status: 1,
      message: "床号要大于0小于5",
    });
  }
  db.query(
    `select stucount from dorm where building='${updateobj.building}' and room='${updateobj.room}'`,
    function (err1, result1) {
      if (err1) {
        console.log(err1.message);
      } else {
        if (result1.length == 0) {
          res.send({
            status: 1,
            message: "没有这个房间",
          });
        } else if (parseInt(result1[0].stucount) >= 4) {
          res.send({
            status: 1,
            message: "该房间已经满人",
          });
        } else {
          // 满足条件
          // 先获取原先的楼栋房间
          db.query(
            `select building,room from student where id=${updateobj.id}`,
            function (err2, result2) {
              if (err2) {
                console.log(err2.message);
              } else {
                console.log(result2[0].building, result2[0].room);
                db.query(
                  `select stucount from dorm where building='${result2[0].building}' and room='${result2[0].room}'`,
                  function (err3, result3) {
                    if (err3) {
                      console.log(err3.message);
                    } else {
                      console.log(result3[0].stucount);
                      db.query(
                        `update dorm set stucount='${
                          parseInt(result3[0].stucount) - 1
                        }' where building='${result2[0].building}' and room='${
                          result2[0].room
                        }'`,
                        function (err4, result4) {
                          if (err4) {
                            console.log(err4.message);
                          }
                          if (result4.affectedRows == 1) {
                            db.query(
                              "update student set building=?,floor=?,room=?,bed=?,sex=?,job=?,major=?,stuclass=?,stunumber=?,stuname=?,phone=?,counsellor=? where id=?",
                              [
                                updateobj.building,
                                updateobj.floor,
                                updateobj.room,
                                updateobj.bed,
                                updateobj.sex,
                                updateobj.job,
                                updateobj.major,
                                updateobj.stuclass,
                                updateobj.stunumber,
                                updateobj.stuname,
                                updateobj.phone,
                                updateobj.counsellor,
                                updateobj.id,
                              ],
                              function (err5, result5) {
                                if (err5) {
                                  console.log(err5.message);
                                }
                                if (result5.affectedRows == 1) {
                                  db.query(
                                    `select stucount from dorm where building='${updateobj.building}' and room='${updateobj.room}'`,
                                    function (err6, result6) {
                                      if (err6) {
                                        console.log(err6.message);
                                      } else {
                                        console.log(result6[0].stucount);
                                        db.query(
                                          `update dorm set stucount='${
                                            parseInt(result6[0].stucount) + 1
                                          }' where building='${
                                            updateobj.building
                                          }' and room='${updateobj.room}'`,
                                          function (err7, result7) {
                                            if (err7) {
                                              console.log(err7.message);
                                            }
                                            if (result7.affectedRows == 1) {
                                              res.send({
                                                status: 0,
                                                message: "更改成功",
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
    }
  );
}

function deletestuinfo(req, res) {
  // console.log(req.body.delid);
  db.query(
    "update student set status=1 where id=?",
    [req.body.delid],
    function (err, result) {
      if (err) {
        console.log(err.message);
      }
      if (result.affectedRows == 1) {
        db.query(
          `select building,room from student where id=${req.body.delid}`,
          function (err1, result1) {
            if (err1) {
              console.log(err1.message);
            } else {
              console.log(result1[0].building, result1[0].room);
              db.query(
                `select stucount from dorm where building='${result1[0].building}' and room='${result1[0].room}'`,
                function (err2, result2) {
                  if (err2) {
                    console.log(err2.message);
                  } else {
                    console.log(result2[0].stucount);
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
                          res.send({
                            status: 0,
                            message: "删除成功",
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

function addstu(req, res) {
  db.query(
    "select * from student where stunumber=?",
    [req.body.editobj.stunumber],
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else if (result.length != 0) {
        res.send({
          status: 1,
          message: "添加学生信息失败，已存在相同学号的学生",
        });
      } else {
        req.body.editobj.sex = parseInt(req.body.editobj.sex);
        req.body.editobj.job = parseInt(req.body.editobj.job);
        req.body.md5str = bcryptjs.hashSync(req.body.md5str, 1);
        console.log(req.body.editobj, req.body.md5str);
        let addobj = req.body.editobj;
        // 查询有无该房间，有房间就将学生数加一，如果房间人数已满就返回1
        // 楼层不能大于13、房间不能大于24、床号不能大于4
        if (parseInt(addobj.building) > 45 || parseInt(addobj.building) < 40) {
          res.send({
            status: 1,
            message: "不存在该楼栋",
          });
        }
        if (parseInt(addobj.floor) > 13 || parseInt(addobj.floor) <= 0) {
          res.send({
            status: 1,
            message: "楼层数要大于0小于14",
          });
        }
        if (
          parseInt(
            addobj.room.substring(addobj.room.length - 2, addobj.room.length)
          ) > 24 ||
          parseInt(
            addobj.room.substring(addobj.room.length - 2, addobj.room.length)
          ) <= 0
        ) {
          res.send({
            status: 1,
            message: "房间号要大于0小于25",
          });
        }
        if (parseInt(addobj.bed) > 4 || parseInt(addobj.bed) <= 0) {
          res.send({
            status: 1,
            message: "床号要大于0小于5",
          });
        }
        db.query(
          `select stucount from dorm where building='${addobj.building}' and room='${addobj.room}'`,
          function (err1, result1) {
            if (err1) {
              console.log(err1.message);
            } else {
              if (result1.length == 0) {
                res.send({
                  status: 1,
                  message: "没有这个房间",
                });
              } else if (parseInt(result1[0].stucount) >= 4) {
                res.send({
                  status: 1,
                  message: "该房间已经满人",
                });
              } else {
                // 满足条件，插入数据然后房间人数加一
                addobj.idpwd = req.body.md5str;
                let addarr = [];
                for (let v in addobj) {
                  addarr.push(addobj[v]);
                }
                db.query(
                  "insert into student (building,floor,room,bed,sex,job,major,stuclass,stunumber,stuname,phone,counsellor,idpwd) values (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                  addarr,
                  function (err2, result2) {
                    if (err2) {
                      console.log(err2.message);
                    }
                    if (result2.affectedRows == 1) {
                      db.query(
                        `update dorm set stucount='${
                          parseInt(result1[0].stucount) + 1
                        }' where building='${addobj.building}' and room='${
                          addobj.room
                        }'`,
                        function (err3, result3) {
                          if (err3) {
                            console.log(err3.message);
                          }
                          if (result3.affectedRows == 1) {
                            res.send({
                              status: 0,
                              message: "添加学生信息成功",
                            });
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          }
        );
      }
    }
  );
}

function expstu(req, res) {
  // console.log(req.body.type);
  // type为0时导出所有学生，1时导出当前筛选条件的所有学生
  if (req.body.type == 0) {
    db.query(
      "select building,floor,room,bed,sex,job,major,stuclass,stunumber,stuname,phone,counsellor,email from student where status=0 order by stunumber",
      function (err, result) {
        if (err) {
          console.log(err.message);
        } else {
          res.send({
            status: 0,
            message: "数据导出成功",
            expobj: result,
          });
        }
      }
    );
  } else if (req.body.type == 1) {
    let sqlstr =
      "select building,floor,room,bed,sex,job,major,stuclass,stunumber,stuname,phone,counsellor,email from student where status=0 and";
    for (let v in req.body.select) {
      // 如果是性别或者职务则直接拼接数值
      if (
        (v == "sex" && req.body.select[v] != "") ||
        (v == "job" && req.body.select[v] != "")
      ) {
        sqlstr = sqlstr + ` ${v}=${req.body.select[v]} and`;
      } else if (req.body.select[v] != "") {
        // 否则拼接字符串
        sqlstr = sqlstr + ` ${v}="${req.body.select[v]}" and`;
      }
    }
    sqlstr = sqlstr.substring(0, sqlstr.length - 4) + " order by stunumber";
    db.query(sqlstr, function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        console.log(result[0]);
        res.send({
          status: 0,
          message: "数据导出成功",
          expobj: result,
        });
      }
    });
  }
}

function searchstu(req, res) {
  let typestr = "stunumber=0";
  if (req.query.type == "0") {
    console.log("学号");
    typestr = `stunumber="${req.query.content}"`;
  } else if (req.query.type == "1") {
    console.log("姓名");
    typestr = `stuname="${req.query.content}"`;
  } else {
    console.log("手机");
    typestr = `phone="${req.query.content}"`;
  }
  db.query(
    "select id,building,floor,room,bed,sex,job,major,stuclass,stunumber,stuname,phone,counsellor from student where status=0 and " +
      typestr,
    function (err, result) {
      if (err) {
        console.log(err.message);
      } else {
        db.query(
          "select count(*) from student where status=0 and " + typestr,
          function (err, result1) {
            if (err) {
              console.log(err.message);
            } else {
              res.send({
                status: 0,
                message: "查询成功",
                sturesult: result,
                totalcount: result1,
              });
            }
          }
        );
      }
    }
  );
}

function gethomedata(req, res) {
  let str =
    "select count(*) from student where status=0 union all select count(*) from student where status=0 and sex=0 union all select count(*) from student where status=0 and sex=1 union all select count(*) from student where status=0 and building='40' union all select count(*) from student where status=0 and building='41' union all select count(*) from student where status=0 and building='42' union all select count(*) from student where status=0 and building='43' union all select count(*) from student where status=0 and building='44' union all select count(*) from student where status=0 and building='45' union all select count(*) from student where status=0 and stuclass>180000 and stuclass<190000 union all select count(*) from student where status=0 and stuclass>190000 and stuclass<200000 union all select count(*) from student where status=0 and stuclass>210000 and stuclass<220000 union all select count(*) from student where status=0 and stuclass>220000 and stuclass<230000 union all select count(*) from student where status=0 and stuclass>230000 and stuclass<240000";
  db.query(str, function (err, result) {
    if (err) {
      console.log(err.message);
    } else {
      res.send({
        status: 0,
        message: "获取统计数据成功",
        homedata: result,
      });
    }
  });
}

function updatephone(req, res) {
  let exp =
    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (req.body.phone.trim() == "") {
    res.send({
      status: 1,
      message: "手机号不能为空",
    });
  } else if (!exp.test(req.body.phone.trim())) {
    res.send({
      status: 1,
      message: "手机号格式有误",
    });
  } else {
    db.query(
      `update student set phone='${req.body.phone.trim()}' where id=${
        req.body.stuid
      }`,
      function (err, result) {
        if (err) {
          console.log(err.message);
        }
        if (result.affectedRows == 1) {
          res.send({
            status: 0,
            message: "手机号修改成功",
          });
        }
      }
    );
  }
}

function updateemail(req, res) {
  let exp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (req.body.email.trim() == "") {
    res.send({
      status: 1,
      message: "邮箱不能为空",
    });
  } else if (!exp.test(req.body.email.trim())) {
    res.send({
      status: 1,
      message: "邮箱格式有误",
    });
  } else {
    db.query(
      `update student set email='${req.body.email.trim()}' where id=${
        req.body.stuid
      }`,
      function (err, result) {
        if (err) {
          console.log(err.message);
        }
        if (result.affectedRows == 1) {
          res.send({
            status: 0,
            message: "邮箱修改成功",
          });
        }
      }
    );
  }
}

module.exports = {
  impexcel,
  login,
  forget,
  reqemailcode,
  getstuinfo,
  getstubyid,
  updatestuinfo,
  deletestuinfo,
  addstu,
  expstu,
  searchstu,
  gethomedata,
  updatephone,
  updateemail,
};
