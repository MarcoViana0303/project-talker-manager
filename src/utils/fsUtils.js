const fs = require('fs').promises;

async function fsReadFile (path) {
  try {
    const data = await fs.readFile(path);
    return JSON.parse(data);
  } catch (e) {
    console.log(`Erro encontrado: ${e.message}`);
  }
};

module.exports = {
  fsReadFile,
};