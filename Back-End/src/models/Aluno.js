 const mongoose = require('mongoose');

const AlunoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    numero: { type: String, required: true, unique: true, trim: true },
    email: { type: String, default: '', lowercase: true, trim: true },
    curso: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Aluno', AlunoSchema);

