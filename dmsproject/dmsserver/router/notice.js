const express = require("express");
const noticehandler = require("../routerhandler/noticehandler");
const router = express.Router();
router.get("/getnoticelist", noticehandler.getnoticelist);
router.get("/getnoticeinfo", noticehandler.getnoticeinfo);
router.post("/updatenoticeinfo", noticehandler.updatenoticeinfo);
router.post("/addnotice", noticehandler.addnotice);
router.get("/deletenoticeinfo", noticehandler.deletenoticeinfo);

module.exports = router;
