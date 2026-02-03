 const express = require('express');
const { list, getById } = require('../controllers/alunosController');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

router.get('/', requireAuth, list);
router.get('/:id', requireAuth, getById);

module.exports = router;

