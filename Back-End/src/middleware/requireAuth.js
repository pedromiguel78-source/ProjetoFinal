 const jwt = require('jsonwebtoken');
const Docente = require('../models/Docente');

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Token em falta.' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const docente = await Docente.findById(payload.id).select('_id nome email');
    if (!docente) return res.status(401).json({ message: 'Token inválido.' });

    req.user = docente;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

module.exports = { requireAuth };

