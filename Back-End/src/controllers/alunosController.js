const Aluno = require('../models/Aluno');

async function list(req, res) {
  const alunos = await Aluno.find({}).select('_id nome numero email curso').sort({ nome: 1 });
  res.json(alunos);
}

async function getById(req, res) {
  const aluno = await Aluno.findById(req.params.id).select('_id nome numero email curso');
  if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado.' });
  res.json(aluno);
}

module.exports = { list, getById };
 
