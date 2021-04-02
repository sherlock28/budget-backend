const router = require("express").Router();
const TokenValidation = require('../middlewares/verify.auth');
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
router.get("/", TokenValidation, showLastOperations);
router.post("/", TokenValidation, addOperation);
router.delete("/:id", TokenValidation, deleteOperation);
router.put("/:id", TokenValidation, updateOperation);
router.get("/entries", TokenValidation, showEntriesOperations);
router.get("/outputs", TokenValidation, showOutputsOperations);

module.exports = router;
