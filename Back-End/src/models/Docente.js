 const mongoose = require('mongoose');

const DocenteSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    departamento: { type: String, default: '' },
    ativo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Docente', DocenteSchema);

