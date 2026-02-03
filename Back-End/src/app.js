const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const docentesRoutes = require('./routes/docentesRoutes');
const alunosRoutes = require('./routes/alunosRoutes');
const propostasRoutes = require('./routes/propostasRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/docentes', docentesRoutes);
app.use('/api/alunos', alunosRoutes);
app.use('/api/propostas', propostasRoutes);

app.use((req, res) => res.status(404).json({ message: 'Rota não encontrada.' }));

module.exports = app;
