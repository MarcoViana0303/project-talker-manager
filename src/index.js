const express = require('express');
const path = require('path');
const { fsReadFile } = require('./utils/fsUtils');
// const talker = require('./talker.json');

const example = [
  {
    "name": "Henrique Albuquerque",
    "age": 62,
    "id": 1,
    "talk": {
      "watchedAt": "23/10/2020",
      "rate": 5
    }
  },
  {
    "name": "Heloísa Albuquerque",
    "age": 67,
    "id": 2,
    "talk": {
      "watchedAt": "23/10/2020",
      "rate": 5
    }
  },
  {
    "name": "Ricardo Xavier Filho",
    "age": 33,
    "id": 3,
    "talk": {
      "watchedAt": "23/10/2020",
      "rate": 5
    }
  },
  {
    "name": "Marcos Costa",
    "age": 24,
    "id": 4,
    "talk": {
      "watchedAt": "23/10/2020",
      "rate": 5
    }
  }
]

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
const otherExample = talker.find((idTalker) => idTalker.id === +id)
console.log(otherExample);

if (!otherExample) {
  return res.status(404).json({ message: "Pessoa palestrante não encontrada"})
}

});

app.listen(PORT, () => {
  console.log('Online');
});
