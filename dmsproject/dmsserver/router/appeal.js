const express = require("express");
const appealhandler = require("../routerhandler/appealhandler");
const router = express.Router();
router.get("/getappeallist", appealhandler.getappeallist);
router.get("/getappeallistbyid", appealhandler.getappeallistbyid);
router.get("/getappealinfo", appealhandler.getappealinfo);
router.get("/getappealinfobyid", appealhandler.getappealinfobyid);
router.get("/clearappeal", appealhandler.clearappeal);
router.get("/deleteappeal", appealhandler.deleteappeal);
router.post("/updateappeal", appealhandler.updateappeal);
router.post("/addappeal", appealhandler.addappeal);

module.exports = router;
