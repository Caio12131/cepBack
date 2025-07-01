const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.options('*', cors()); // pré-resposta para requisições OPTIONS

// Carrega base de dados de CEP via URL externa
let cepData = [];

const carregarCeps = async () => {
  try {
    const response = await axios.get(
      'https://drive.google.com/uc?export=download&id=1FKp9ncq6iJz3iwBP3JD7IGSwlTOa6s9S'
    );
    cepData = response.data;
    console.log(`✅ Base de CEP carregada com ${cepData.length} registros`);
  } catch (error) {
    console.error('❌ Erro ao carregar CEPs da URL:', error.message);
  }
};

carregarCeps();

app.get('/cep/:cep', (req, res) => {
  // Apenas para garantir que o cabeçalho estará em toda resposta
  res.setHeader('Access-Control-Allow-Origin', '*');

  const cep = req.params.cep.replace(/\D/g, '');

  if (cep.length !== 8) {
    return res.status(400).json({ error: 'CEP inválido' });
  }

  const result = cepData.find((r) => r.cep && r.cep.replace(/\D/g, '') === cep);

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'CEP não encontrado' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
