 const mongoose = require('mongoose');
const Proposta = require('../models/Proposta');
const Docente = require('../models/Docente');
const Aluno = require('../models/Aluno');

async function assertDocentesExist(ids) {
  if (!ids || ids.length === 0) return;
  const count = await Docente.countDocuments({ _id: { $in: ids }, ativo: true });
  if (count !== ids.length) throw new Error('Um ou mais docentes referenciados não existem.');
}

async function assertAlunosExist(ids) {
  if (!ids || ids.length === 0) return;
  const count = await Aluno.countDocuments({ _id: { $in: ids } });
  if (count !== ids.length) throw new Error('Um ou mais alunos referenciados não existem.');
}

function dedupeObjectIds(arr) {
  const seen = new Set();
  const out = [];
  for (const id of arr || []) {
    const s = String(id);
    if (!seen.has(s)) {
      seen.add(s);
      out.push(id);
    }
  }
  return out;
}

async function listMinhas(req, res) {
  const orientadorId = req.user._id;
  const propostas = await Proposta.find({ orientador: orientadorId })
    .populate('orientador', 'nome email')
    .populate('coorientadores', 'nome email')
    .populate('alunos', 'nome numero')
    .sort({ updatedAt: -1 });
  res.json(propostas);
}

async function create(req, res) {
  try {
    const orientadorId = req.user._id;
    const {
      titulo,
      coorientadores = [],
      palavrasChave = [],
      alunos = [],
      descricaoObjetivos,
      estado = 'rascunho'
    } = req.body;

    if (!titulo || !descricaoObjetivos) {
      return res.status(400).json({ message: 'Título e descrição/objetivos são obrigatórios.' });
    }
    if (!Array.isArray(palavrasChave) || palavrasChave.length < 1) {
      return res.status(400).json({ message: 'Indique pelo menos uma palavra-chave.' });
    }

    const coIds = dedupeObjectIds(coorientadores).filter((x) => mongoose.isValidObjectId(x));
    const alunoIds = dedupeObjectIds(alunos).filter((x) => mongoose.isValidObjectId(x));

    // impedir orientador duplicado como coorientador
    const coFiltered = coIds.filter((id) => String(id) !== String(orientadorId));

    await assertDocentesExist([orientadorId, ...coFiltered]);
    await assertAlunosExist(alunoIds);

    const proposta = await Proposta.create({
      titulo: String(titulo).trim(),
      orientador: orientadorId,
      coorientadores: coFiltered,
      palavrasChave: palavrasChave.map((p) => String(p).trim()).filter(Boolean),
      alunos: alunoIds,
      descricaoObjetivos: String(descricaoObjetivos),
      estado
    });

    const populated = await Proposta.findById(proposta._id)
      .populate('orientador', 'nome email')
      .populate('coorientadores', 'nome email')
      .populate('alunos', 'nome numero');

    return res.status(201).json(populated);
  } catch (err) {
    return res.status(400).json({ message: err.message || 'Erro ao criar proposta.' });
  }
}

async function getMineById(req, res) {
  const proposta = await Proposta.findOne({ _id: req.params.id, orientador: req.user._id })
    .populate('orientador', 'nome email')
    .populate('coorientadores', 'nome email')
    .populate('alunos', 'nome numero');

  if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada.' });
  res.json(proposta);
}

async function update(req, res) {
  try {
    const proposta = await Proposta.findOne({ _id: req.params.id, orientador: req.user._id });
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada.' });

    const {
      titulo,
      coorientadores,
      palavrasChave,
      alunos,
      descricaoObjetivos,
      estado
    } = req.body;

    if (titulo !== undefined) proposta.titulo = String(titulo).trim();
    if (descricaoObjetivos !== undefined) proposta.descricaoObjetivos = String(descricaoObjetivos);
    if (estado !== undefined) proposta.estado = estado;

    if (palavrasChave !== undefined) {
      if (!Array.isArray(palavrasChave) || palavrasChave.length < 1) {
        return res.status(400).json({ message: 'Indique pelo menos uma palavra-chave.' });
      }
      proposta.palavrasChave = palavrasChave.map((p) => String(p).trim()).filter(Boolean);
    }

    if (coorientadores !== undefined) {
      const coIds = dedupeObjectIds(coorientadores).filter((x) => mongoose.isValidObjectId(x));
      const coFiltered = coIds.filter((id) => String(id) !== String(req.user._id));
      await assertDocentesExist([req.user._id, ...coFiltered]);
      proposta.coorientadores = coFiltered;
    }

    if (alunos !== undefined) {
      const alunoIds = dedupeObjectIds(alunos).filter((x) => mongoose.isValidObjectId(x));
      await assertAlunosExist(alunoIds);
      proposta.alunos = alunoIds;
    }

    await proposta.save();

    const populated = await Proposta.findById(proposta._id)
      .populate('orientador', 'nome email')
      .populate('coorientadores', 'nome email')
      .populate('alunos', 'nome numero');

    res.json(populated);
  } catch (err) {
    return res.status(400).json({ message: err.message || 'Erro ao atualizar proposta.' });
  }
}

async function remove(req, res) {
  const proposta = await Proposta.findOneAndDelete({ _id: req.params.id, orientador: req.user._id });
  if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada.' });
  res.json({ message: 'Proposta apagada com sucesso.' });
}

module.exports = { listMinhas, create, getMineById, update, remove };

