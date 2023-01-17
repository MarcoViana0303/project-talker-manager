const fs = require('fs').promises;

async function fsReadFile(path) {
  try {
    const data = await fs.readFile(path);
    return JSON.parse(data);
  } catch (e) {
    console.log(`Erro encontrado: ${e.message}`);
  };
};

const fsWriteFile = async (path, data) => {
  try {
    await fs.writeFile(path, JSON.stringify(data, null, 2));
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = {
  fsReadFile,
  fsWriteFile,
};