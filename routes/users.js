var express = require('express');
var router = express.Router();
var [createUser, login] = require('../controllers/user');

router.post('/', async function(req, res, next) {
  const newUser = await createUser(req.body);
  res.send(newUser);
});

router.post('/login', async function(req, res, next) {
  try {
    const authUser = await login(req.body);
    res.status(200).send(authUser);
  } catch (error) {
    res.status(403).send(error.message);
  }
});

module.exports = router;
