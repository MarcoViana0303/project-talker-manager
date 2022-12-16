const express = require('express');
const path = require('path');
const crypto = require('crypto');
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

// Requisito 2
app.get('/talker/:id', async (req, res) => {
const { id } = req.params;
const talker = await fsReadFile(path.resolve(__dirname, './talker.json'));
const findTalker = talker.find((idTalker) => idTalker.id === +id);

if (!findTalker) {
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
}
res.status(200).send(findTalker);
});

// Requisito 3
app.post('/login', (req, res) => {
   // let token = Math.random().toString(16).substring(2);
   const randomCrypto = () => crypto.randomBytes(8).toString('hex');
  const callCrypto = randomCrypto();
  return res.status(200).json({ token: callCrypto });
});

app.listen(PORT, () => {
  console.log('Online');
});
