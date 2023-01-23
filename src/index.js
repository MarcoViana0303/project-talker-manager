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

// Requisito 8
app.get('/talker/search', postAuth, async (req, res) => {
  const { q } = req.query;
  const talkerPath = await fsReadFile(pathResolve);
  if (!q) {
    return res.status(200).json(talkerPath);
  }
  const filterTalk = talkerPath.filter(( { 
    name
  }) => name.toLowerCase().includes(q.toLowerCase()));

    return res.status(200).json(filterTalk);

});

// Requisito 1
app.get('/talker', async (_req, res) => { 
  const talkerPath = await fsReadFile(path.resolve(pathResolve));
  if (!talkerPath) {
  return res.status(200).json([]);
} 
 return res.status(HTTP_OK_STATUS).json(talkerPath);
});


// Requisito 2
app.get('/talker/:id', async (req, res) => {
const { id } = req.params;
const talkerPath = await fsReadFile(pathResolve);
const findTalker = talkerPath.find((idTalker) => idTalker.id === +id);

if (!findTalker) {
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
}
res.status(200).send(findTalker);
});

// Requisito 3 e requisito 4
app.post('/login', validateEmail, validatePassword, (_req, res) => {
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
  const talkerPath = await fsReadFile(pathResolve);
  const id = talkerPath.reduce((a, c) => Math.max(a, +c.id), 0) + 1;
  const talkerCreate = { id, ...body };
  const newData = [...talkerPath, talkerCreate];
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
      const talkerPath = await fsReadFile(pathResolve);
      let { id } = req.params;
      id = +id;
      const findTalker = talkerPath.find((e) => +e.id === +id);

        if (!findTalker) {
          return res.status(404).json({ message: 'Id not found' });
        }

        const index = talkerPath.findIndex((e) => +e.id === +id);
        const talkerEdit = { id, ...body };
        talkerPath[index] = talkerEdit;
        await fsWriteFile(pathResolve, talkerPath);
        res.status(200).json(talkerEdit);
        });

// Requisito 7
app.delete('/talker/:id', postAuth, async (req, res) => {
  const talkerPath = await fsReadFile(pathResolve);
  const { id } = req.params;
  const editedTalker = talkerPath.filter((element) => Number(element.id) !== Number(id));

  await fsWriteFile(pathResolve, editedTalker);
  res.status(204).json();
});

app.listen(PORT, () => {
  console.log('Online');
});