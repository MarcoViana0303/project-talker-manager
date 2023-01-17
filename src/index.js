const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { fsReadFile, fsWriteFile } = require('./utils/fsUtils');
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');
const { generateToken } = require('./utils/generateToken')
const { postAge, postAuth, postName, postRate, postRate2, postTalk, postWatchedAt} = require('./middlewares/talkers');
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
app.post('/login', (_req, res) => {
   // let token = Math.random().toString(16).substring(2);
    const randomCrypto = () => crypto.randomBytes(8).toString('hex');
  const callCrypto = randomCrypto();
  return res.status(200).json({ token: callCrypto }); 
});


// Requisito 4
app.post('/login', validateEmail, validatePassword, (req, res) => {
  const { email, password } = req.body;
  const token = generateToken();

  if (email && password) {
    return res.status(200).json({ token: `${token}` });
  }
});

// Requisito 5
app.post('/talker',
  postAuth,
  postName,
  postAge,
  postTalk,
  postWatchedAt,
  postRate,
  postRate2,
  async (req, res) => {
  const { body } = req;
  const talkerFile = await fsReadFile(path.resolve(__dirname, './talker.json'));
  const id = talkerFile.reduce((a, c) => Math.max(a, +c.id), 0) + 1;
  const talkerCreate = { id, ...body };
  const newData = [...talkerFile, talkerCreate];
  await fsWriteFile(path.resolve(__dirname, './talker.json'), newData);
  res.status(201).json(talkerCreate);
});

app.listen(PORT, () => {
  console.log('Online');
});