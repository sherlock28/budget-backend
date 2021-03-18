const router = require('express').Router();
const { getBalance, updateBalance } = require('../controllers/balances.ctrl');

router.get('/:id', getBalance);
router.put('/:id', updateBalance);

module.exports = router;