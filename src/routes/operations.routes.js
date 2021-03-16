const router = require("express").Router();
const control = require("../controllers/operations.ctrl");

router.get("/", control.showLast);
router.post("/", control.add);
router.delete("/:id", control.delete);
router.put("/", control.update);
router.get("/entries", control.showEntries);
router.get("/outputs", control.showOutputs);
router.get("/:id", control.showGetById);

module.exports = router;