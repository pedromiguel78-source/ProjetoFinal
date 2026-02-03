 const mongoose = require('mongoose');

const PropostaSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    orientador: { type: mongoose.Schema.Types.ObjectId, ref: 'Docente', required: true },
    coorientadores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Docente' }],
    palavrasChave: [{ type: String, required: true, trim: true }],
    alunos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Aluno' }],
    descricaoObjetivos: { type: String, required: true },
    estado: {
      type: String,
      enum: ['rascunho', 'publicada', 'arquivada'],
      default: 'rascunho'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Proposta', PropostaSchema);

