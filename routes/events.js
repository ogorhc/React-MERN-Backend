const { Router } = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { check } = require('express-validator');
const { fieldsValidators } = require('../middlewares/fields-validator');
const { isDate } = require('../helpers/isDate');

const router = Router();

/* /api/events */
router.get('/', [], getEvents);
router.post(
  '/',
  [
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('start', 'La fecha de inicio es obligatoria').custom(isDate),
    check('end', 'La fecha de final es obligatoria').custom(isDate),
    fieldsValidators,
  ],
  createEvent,
);
router.put(
  '/:id',
  [
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('start', 'La fecha de inicio es obligatoria').custom(isDate),
    check('end', 'La fecha de final es obligatoria').custom(isDate),
    fieldsValidators,
  ],
  updateEvent,
);
router.delete('/:id', [], deleteEvent);

module.exports = router;
