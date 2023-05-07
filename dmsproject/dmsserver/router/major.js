const express = require("express");
const majorhandler = require("../routerhandler/majorhandler");
const router = express.Router();
router.get("/getmajorlist", majorhandler.getmajorlist);

module.exports = router;
