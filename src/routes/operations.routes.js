const router = require("express").Router();
const {
  showLastOperations,
  addOperation,
  deleteOperation,
  updateOperation,
  showEntriesOperations,
  showOutputsOperations

} = require("../controllers/operations.ctrl");

/* Se definen los endpoints para las operacines y 
a cada uno se le asigna un contralador que 
manejara la peticion */
router.get("/", showLastOperations);
router.post("/", addOperation);
router.delete("/:id", deleteOperation);
router.put("/:id", updateOperation);
router.get("/entries", showEntriesOperations);
router.get("/outputs", showOutputsOperations);

module.exports = router;
