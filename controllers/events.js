const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async (req, res = response) => {
  try {
    const events = await Event.find().populate('user', 'name');
    res.status(200).json({ ok: true, events });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Por favor hable con el administrador' });
  }
};

const createEvent = async (req, res = response) => {
  const { body, uid } = req;

  try {
    const event = new Event({ ...body, user: uid });
    await event.save();
    res.status(201).json({ ok: true, event });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Por favor hable con el administrador' });
  }
};

const updateEvent = async (req, res = response) => {
  const { uid } = req;
  const { id } = req.params;
  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ ok: false, msg: 'El evento no existe por ese ID' });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({ ok: false, msg: 'No tiene permisos de editar este evento' });
    }

    const newEvent = {
      ...req.body,
      user: uid,
    };

    const updatedEvent = await Event.findByIdAndUpdate(id, newEvent, { new: true });

    res.status(201).json({ ok: true, msg: 'updateEvent', event: updatedEvent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Por favor hable con el administrador' });
  }
};

const deleteEvent = async (req, res = response) => {
  const { id } = req.params;
  const { uid } = req;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ ok: false, msg: 'El evento no existe por ese ID' });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({ ok: false, msg: 'No tiene permisos de eliminar este evento' });
    }

    await Event.findByIdAndDelete(id);

    res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Por favor hable con el administrador' });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
