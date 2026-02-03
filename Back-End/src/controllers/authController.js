const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Docente = require('../models/Docente');

function signToken(docente) {
  return jwt.sign(
    { id: docente._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '6h' }
  );
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e password são obrigatórios.' });
    }
    if (!validator.isEmail(String(email))) {
      return res.status(400).json({ message: 'Email inválido.' });
    }

    const docente = await Docente.findOne({ email: String(email).toLowerCase().trim(), ativo: true });
    if (!docente) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const ok = await bcrypt.compare(password, docente.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const token = signToken(docente);
    return res.json({
      token,
      docente: {
        id: docente._id,
        nome: docente.nome,
        email: docente.email,
        departamento: docente.departamento || ''
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Erro no login.' });
  }
}

async function register(req, res) {
  try {
    const nome = String(req.body.nome || '').trim();
    const email = String(req.body.email || '').toLowerCase().trim();
    const password = String(req.body.password || '');
    const departamento = String(req.body.departamento || '').trim(); 

    if (!nome || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e password são obrigatórios.' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Email inválido.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password deve ter pelo menos 6 caracteres.' });
    }

    const exists = await Docente.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Já existe um docente com esse email.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const docente = await Docente.create({
      nome,
      email,
      passwordHash,
      departamento,
      ativo: true
    });

    const token = signToken(docente);
    return res.status(201).json({
      token,
      docente: {
        id: docente._id,
        nome: docente.nome,
        email: docente.email,
        departamento: docente.departamento || ''
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Erro no registo.' });
  }
}

async function me(req, res) {
  // requireAuth já validou e colocou o docente em req.user
  return res.json({
    docente: {
      id: req.user._id,
      nome: req.user.nome,
      email: req.user.email,
      departamento: req.user.departamento || ''
    }
  });
}

module.exports = { login, register, me };
