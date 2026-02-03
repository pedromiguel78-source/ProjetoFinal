 const Docente = require('../models/Docente');

async function list(req, res) {
  const docentes = await Docente.find({ ativo: true }).select('_id nome email departamento').sort({ nome: 1 });
  res.json(docentes);
}

async function getById(req, res) {
  const docente = await Docente.findById(req.params.id).select('_id nome email departamento');
  if (!docente) return res.status(404).json({ message: 'Docente não encontrado.' });
  res.json(docente);
}

module.exports = { list, getById };

