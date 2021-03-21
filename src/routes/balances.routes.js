const router = require('express').Router();
const { getBalance } = require('../controllers/balances.ctrl');

router.get('/:id', getBalance);

module.exports = router;