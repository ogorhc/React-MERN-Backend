const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req = request, res = response) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ ok: false, msg: 'Un usuario existe con ese correo' });
    }

    const user = new User(req.body);

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();
    const token = await generateJWT(user.id, user.name);
    res.status(201).json({ ok: true, name, id: user._id, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Por favor hable con el administrador' });
  }
};

const loginUser = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ ok: false, msg: 'Un usuario no existe con ese correo' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto',
      });
    }
    const token = await generateJWT(user.id, user.name);

    res.status(200).json({ ok: true, name: user.name, id: user._id, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Por favor hable con el administrador' });
  }
};

const renewToken = async (req = request, res = response) => {
  const { uid, name } = req;
  const token = await generateJWT(uid, name);

  res.status(200).json({ ok: true, msg: 'renew', id: uid, name, token });
};

module.exports = { createUser, loginUser, renewToken };
