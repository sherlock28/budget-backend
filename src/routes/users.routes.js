const router = require("express").Router();
const ValidateFieldUser  = require("../middlewares/users/verify.userdata");
const { signup, signin, signout } = require("../controllers/users.ctrl");

/* Se definen los endpoints para el manejo de usuarios y 
a cada uno se le asigna un contralador que 
manejara la peticion */
router.post("/register", ValidateFieldUser, signup);
router.post("/signin", signin);
router.post("/signout", signout);

module.exports = router;
