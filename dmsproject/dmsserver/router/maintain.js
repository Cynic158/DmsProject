const express = require("express");
const maintainhandler = require("../routerhandler/maintainhandler");
const router = express.Router();
router.post("/getmaintainlist", maintainhandler.getmaintainlist);
router.post("/getstumaintainlist", maintainhandler.getstumaintainlist);
router.get("/getmaintainbyid", maintainhandler.getmaintainbyid);
router.post("/acceptmaintain", maintainhandler.acceptmaintain);
router.get("/donemaintain", maintainhandler.donemaintain);
router.get("/studonemaintain", maintainhandler.studonemaintain);
router.get("/cancelmaintain", maintainhandler.cancelmaintain);
router.get("/stucancelmaintain", maintainhandler.stucancelmaintain);
router.post("/deletemaintain", maintainhandler.deletemaintain);
router.post("/getmaintainhistory", maintainhandler.getmaintainhistory);
router.post("/addmaintain", maintainhandler.addmaintain);

module.exports = router;
