const router = require('express').Router();
const { getBalance } = require('../controllers/balances.ctrl');

/* Se define un endpoint para obtener el balance y 
se le asigna el contralador que manejara la peticion */
router.get('/:id', getBalance);

module.exports = router;