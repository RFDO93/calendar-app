const {Router} = require('express')
const { check } = require('express-validator')
const { validarJWT } = require('../middlewares/validar-jwt')
const { getEventos, crearEvento, editarEvento, eliminarEvento } = require('../controllers/events')
const {validarCampos} = require('../middlewares/validar-campos')
const { funIsDate } = require('../helpers/isDate')
const route = Router()

/* /api/events + ruta */

route.use(validarJWT)

route.get('/', getEventos)

route.post(
  '/', 
  [
    check("title",'El titulo es obligatorio').not().isEmpty(),
    check("start",'Fecha de inicio es obligatoria').custom(funIsDate),
    check("end",'Fecha de finalización es obligatoria').custom(funIsDate),
    validarCampos
  ],
  crearEvento
)

route.put(
  '/:id',
  [
    check("title",'El titulo es obligatorio').not().isEmpty(),
    check("start",'Fecha de inicio es obligatoria').custom(funIsDate),
    check("end",'Fecha de finalización es obligatoria').custom(funIsDate),
    validarCampos
  ]
  , editarEvento
)

route.delete('/:id', eliminarEvento)

module.exports = route

