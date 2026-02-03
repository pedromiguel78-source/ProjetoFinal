require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const Docente = require('../models/Docente');
const Aluno = require('../models/Aluno');
const Proposta = require('../models/Proposta');

async function run() {
  await connectDB(process.env.MONGODB_URI);

  await Proposta.deleteMany({});
  await Docente.deleteMany({});
  await Aluno.deleteMany({});

  const pass = await bcrypt.hash('PWA2026!', 10);

  // DOCENTES
  const docentes = await Docente.insertMany([
    {
      nome: 'Pedro Pereira',
      email: 'pedro.pereira@uab.pt',
      passwordHash: pass,
      departamento: 'Informática'
    },
    {
      nome: 'Sandra Pereira',
      email: 'sandra.pereira@uab.pt',
      passwordHash: pass,
      departamento: 'Informática'
    },
    {
      nome: 'Olga Kolesnyk',
      email: 'olga.kolesnyk@uab.pt',
      passwordHash: pass,
      departamento: 'Matemática'
    },
    {
      nome: 'António Santos',
      email: 'antonio.santos@uab.pt',
      passwordHash: pass,
      departamento: 'Informática'
    }
  ]);

  // ALUNOS
  const alunos = await Aluno.insertMany([
    {
      nome: 'Tiago Pereira',
      numero: '220001',
      email: 'tiago.pereira@alunos.uab.pt',
      curso: 'Informática'
    },
    {
      nome: 'Mariana Pereira',
      numero: '220002',
      email: 'mariana.pereira@alunos.uab.pt',
      curso: 'Informática'
    },
    {
      nome: 'Simão Pereira',
      numero: '220003',
      email: 'simao.pereira@alunos.uab.pt',
      curso: 'Informática'
    }
  ]);

  // PROPOSTAS
  await Proposta.insertMany([
    {
      titulo: 'Plataforma de monitorização de qualidade do ar em salas de aula',
      orientador: docentes[0]._id, // Pedro Pereira
      coorientadores: [docentes[1]._id], // Sandra Pereira
      palavrasChave: ['IoT', 'sensores', 'dashboard'],
      alunos: [alunos[0]._id, alunos[1]._id],
      descricaoObjetivos:
        'Construir um protótipo web que recolhe dados de sensores e apresenta indicadores, alertas e relatórios.',
      estado: 'publicada'
    },
    {
      titulo: 'Sistema de recomendação de leituras científicas para estudantes',
      orientador: docentes[0]._id, // Pedro Pereira
      coorientadores: [],
      palavrasChave: ['NLP', 'recomendação', 'pesquisa'],
      alunos: [],
      descricaoObjetivos:
        'Explorar um motor de recomendação baseado em palavras-chave e histórico de escolhas.',
      estado: 'rascunho'
    },
    {
      titulo: 'Gestão de propostas de projeto final de curso',
      orientador: docentes[1]._id, // Sandra Pereira
      coorientadores: [docentes[2]._id], // Olga Kolesnyk
      palavrasChave: ['full-stack', 'gestão', 'autenticação'],
      alunos: [alunos[2]._id],
      descricaoObjetivos:
        'Implementar uma aplicação onde docentes registam propostas e alunos são associados opcionalmente.',
      estado: 'publicada'
    }
  ]);

  console.log(
    'Seed concluído. Login de teste: pedro.pereira@uab.pt / PWA2026!'
  );
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
