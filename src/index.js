const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());

// Carrega base de dados de CEP local
let cepData = [];
try {
  const data = fs.readFileSync('ceps.json', 'utf8');
  cepData = JSON.parse(data);
  console.log(`✅ Base de CEP carregada com ${cepData.length} registros`);
} catch (error) {
  console.error('❌ Erro ao carregar o arquivo ceps.json:', error.message);
}

// Rota para buscar CEP localmente
app.get('/cep/:cep', (req, res) => {
  const cep = req.params.cep.replace(/\D/g, '');

  if (cep.length !== 8) {
    return res.status(400).json({ error: 'CEP inválido' });
  }

  const result = cepData.find(
    (r) => r.cep && r.cep.replace(/\D/g, '') === cep
  );

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'CEP não encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
