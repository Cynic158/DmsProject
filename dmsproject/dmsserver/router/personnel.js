const express = require("express");
const personnelhandler = require("../routerhandler/personnelhandler");
const router = express.Router();
router.get("/getpersonnellist", personnelhandler.getpersonnellist);
router.get("/getpersonnelphone", personnelhandler.getpersonnelphone);
router.get("/getpersonnelphone", personnelhandler.getpersonnelphone);
router.get("/getpersonnelname", personnelhandler.getpersonnelname);

module.exports = router;
