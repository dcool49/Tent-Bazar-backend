const Dashboard  = require("../controller/dashboard.controller");

var router = require("express").Router();

router.get("/fetch",Dashboard.dashboard)

module.exports = router;