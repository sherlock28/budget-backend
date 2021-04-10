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
router.get("/:userId", TokenValidation, showLastOperations);
router.post("/:userId", TokenValidation, addOperation);
router.delete("/:idOperation", TokenValidation, deleteOperation);
router.put("/:idOperation", TokenValidation, updateOperation);
router.get("/:userId/entries", TokenValidation, showEntriesOperations);
router.get("/:userId/outputs", TokenValidation, showOutputsOperations);

module.exports = router;
