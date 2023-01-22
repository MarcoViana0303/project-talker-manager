const express = require('express');
const path = require('path');
// const crypto = require('crypto');
const { fsReadFile, fsWriteFile } = require('./utils/fsUtils');
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');
const { generateToken } = require('./utils/generateToken');
const { postAge, postAuth, postName,
 postRate, postRate2, postTalk, postWatchedAt } = require('./middlewares/talkers');
// const { talkerId } = require('./middlewares/routerTalker')
// const talker = require('./talker.json');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const pathResolve = path.resolve(__dirname, './talker.json');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// Requisito 1
app.get('/talker', async (_req, res) => { 
  const talkerPerson = await fsReadFile(path.resolve(pathResolve));
  if (!talkerPerson) {
  return res.status(200).json([]);
} 
 return res.status(HTTP_OK_STATUS).json(talkerPerson);
});

// Requisito 2
app.get('/talker/:id', async (req, res) => {
const { id } = req.params;
const talker = await fsReadFile(pathResolve);
const findTalker = talker.find((idTalker) => idTalker.id === +id);

if (!findTalker) {
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
}
res.status(200).send(findTalker);
});

// Requisito 3 e requisito 4
app.post('/login', validateEmail, validatePassword, (_req, res) => {
  // let token = Math.random().toString(16).substring(2);
 
 const callCrypto = generateToken();

 try {
   return res.status(200).json({ token: callCrypto });
 } catch (err) {
   res.status(500).send({ message: err.message });
 }
});

// Requisito 4
/* app.post('/login', validateEmail, validatePassword, (req, res) => {
  const { email, password } = req.body;
  const token = generateToken();

  if (email && password) {
    return res.status(200).json({ token: `${token}` });
  }
}); */

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
  const talkerFile = await fsReadFile(pathResolve);
  const id = talkerFile.reduce((a, c) => Math.max(a, +c.id), 0) + 1;
  const talkerCreate = { id, ...body };
  const newData = [...talkerFile, talkerCreate];
  await fsWriteFile(pathResolve, newData);
  res.status(201).json(talkerCreate);
});

// Requisito 6
app.put('/talker/:id',
    postAge,
    postAuth,
    postName,
    postTalk,
    postWatchedAt,
    postRate,
    postRate2,
    async (req, res) => {
      const { body } = req;
      const talkers = await fsReadFile(pathResolve);
      let { id } = req.params;
      id = +id;
      const findTalker = talkers.find((e) => +e.id === +id);

        if (!findTalker) {
          return res.status(404).json({ message: 'Id not found' });
        }

        const index = talkers.findIndex((e) => +e.id === +id);
        const talkerEdit = { id, ...body };
        talkers[index] = talkerEdit;
        await fsWriteFile(pathResolve, talkers);
        res.status(200).json(talkerEdit);
        });

// Requisito 7
app.delete('/talker/:id', postAuth, async (req, res) => {
  const talker = await fsReadFile(pathResolve);
  const { id } = req.params;
  const editedTalker = talker.filter((element) => Number(element.id) !== Number(id));

  await fsWriteFile(pathResolve, editedTalker);
  res.status(204).json();
});

// Requisito 8
app.get('/talker/search', postAuth, async (req, res) => {
  try {
    const { q } = req.query;
    const oldTalker = await fsReadFile(pathResolve);
    const filterTalk = oldTalker.filter((elem) => elem.name.includes(q));
    res.status(200).json(filterTalk);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log('Online');
});