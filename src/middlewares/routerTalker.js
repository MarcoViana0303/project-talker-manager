/* const talkerId = async (req, res) => {
    let { id } = req.params;
    id = +id;
    const { body } = req;
    const talkers = await fsReadFile(path.resolve(__dirname, './talker.json'));
    const findEl = talkers.find((e) => +e.id === +id);

    if (!findEl) {
      return res.status(404).json({ message: 'Id not found' });
    }

    const index = talkers.findIndex((e) => +e.id === +id);
    const editedTalker = { id, ...body };
    talkers[index] = editedTalker;
    await fsWriteFile(path.resolve(__dirname, './talker.json'), talkers);
    res.status(200).json(editedTalker);
};

const deleteTalker = async (req, res) => {
    const { id } = req.params;
  const talkers = await fsReadFile(path.resolve(__dirname, './talker.json'));
  const filteredTalkers = talkers.filter((element) => Number(element.id) !== Number(id));

  await fsWriteFile(path.resolve(__dirname, './talker.json'), filteredTalkers);
  res.status(204).json();
};

module.exports = {
    talkerId,
    deleteTalker,
}; */