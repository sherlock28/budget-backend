const router = require("express").Router();
const control = require("../controllers/budget.ctrl");

router.get("/", control.index);

module.exports = router;