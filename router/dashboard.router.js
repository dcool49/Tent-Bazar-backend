const Dashboard  = require("../controller/dashboard.controller");

var router = require("express").Router();
const common = require("../common/common");

router.get("/fetch",common.verifyToken,Dashboard.dashboard)

module.exports = router;