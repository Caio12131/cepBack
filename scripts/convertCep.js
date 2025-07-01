const fs = require('fs');
const iconv = require('iconv-lite');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('brazil_zip_codes.csv') // Substitua pelo nome real do arquivo
  .pipe(iconv.decodeStream('utf8')) // força leitura correta mesmo com BOM
  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    results.push({
      cep: row['CEP']?.trim() || '',
      uf: row['UF']?.trim() || '',
      cidade: row['CIDADE']?.trim() || '',
      bairro: row['BAIRRO']?.trim() || '',
      logradouro: row['LOGRADOURO']?.trim() || '',
      complemento: row['COMPLEMENTO']?.trim() || '',
    });
  })
  .on('end', () => {
    fs.writeFileSync('ceps.json', JSON.stringify(results, null, 2), 'utf8');
    console.log('✅ Arquivo ceps.json gerado com', results.length, 'registros!');
  });
