const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { fieldsValidators } = require('../middlewares/fields-validator');
const { jwtValidator } = require('../middlewares/jwt-validator');

/* /api/auth */
router.post(
  '/new',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
    fieldsValidators,
  ],
  createUser,
);

router.post(
  '/',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
    fieldsValidators,
  ],
  loginUser,
);

router.get('/renew', [jwtValidator], renewToken);

module.exports = router;
