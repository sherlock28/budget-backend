const router = require('express').Router();
const { getBalance } = require('../controllers/balances.ctrl');
const TokenValidation = require('../middlewares/verify.auth');

/* Se define un endpoint para obtener el balance y 
se le asigna el contralador que manejara la peticion */
router.get('/:userId', TokenValidation, getBalance);

module.exports = router;