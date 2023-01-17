const express = require('express');

const { emailValidation, passwordValidation } = require('../middlewares/');
const { postTalkerLogin } = require('../controllers/talkerController');

const router = express.Router();

router.post('/', emailValidation, passwordValidation, postTalkerLogin);

module.exports = router;