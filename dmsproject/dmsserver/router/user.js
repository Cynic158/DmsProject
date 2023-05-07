const express = require("express");
const userhandler = require("../routerhandler/userhandler");
const router = express.Router();
router.post("/impexcel", userhandler.impexcel);
router.post("/login", userhandler.login);
router.post("/forget", userhandler.forget);
router.get("/reqemailcode", userhandler.reqemailcode);
router.post("/getstuinfo", userhandler.getstuinfo);
router.post("/getstubyid", userhandler.getstubyid);
router.post("/updatestuinfo", userhandler.updatestuinfo);
router.post("/deletestuinfo", userhandler.deletestuinfo);
router.post("/addstu", userhandler.addstu);
router.post("/expstu", userhandler.expstu);
router.get("/searchstu", userhandler.searchstu);
router.get("/gethomedata", userhandler.gethomedata);
router.post("/updatephone", userhandler.updatephone);
router.post("/updateemail", userhandler.updateemail);

module.exports = router;
