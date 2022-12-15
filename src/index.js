const express = require('express');
const path = require('path');
const { fsReadFile } = require('./utils/fsUtils');
// const talker = require('./talker.json');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// Requisito 1
app.get('/talker', async (_req, res) => { 
  const talker = await fsReadFile(path.resolve(__dirname, './talker.json'));
  if (!talker) {
  return res.status(200).json([]);
} 
 return res.status(HTTP_OK_STATUS).json(talker);
});

app.listen(PORT, () => {
  console.log('Online');
});
