const router = require("express").Router();
const ValidateFieldUser  = require("../middlewares/users/verify.userdata");
const { signup, signin, signout } = require("../controllers/users.ctrl");
const TokenValidation = require('../middlewares/verify.auth');

/* Se definen los endpoints para el manejo de usuarios y 
a cada uno se le asigna un contralador que 
manejara la peticion */
router.post("/signup", ValidateFieldUser, signup);
router.post("/signin", signin);
router.post("/signout", TokenValidation, signout);

module.exports = router;
