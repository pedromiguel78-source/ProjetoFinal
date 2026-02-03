const express = require('express');
const { requireAuth } = require('../middleware/requireAuth');
const { listMinhas, create, getMineById, update, remove } = require('../controllers/propostasController');

const router = express.Router();

router.get('/minhas', requireAuth, listMinhas);
router.post('/', requireAuth, create);
router.get('/:id', requireAuth, getMineById);
router.put('/:id', requireAuth, update);
router.delete('/:id', requireAuth, remove);

module.exports = router;
 
