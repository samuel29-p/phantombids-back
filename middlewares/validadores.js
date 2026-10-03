const { body, param } = require("express-validator");

//Auth 
const validarRegistro = [
  body("username").trim().isLength({ min: 3 }).withMessage("El username debe tener al menos 3 caracteres"),
  body("email").isEmail().withMessage("El email no es valido"),
  body("password").isLength({ min: 6 }).withMessage("La contrasena debe tener al menos 6 caracteres"),
];

const validarLogin = [
  body("email").isEmail().withMessage("El email no es valido"),
  body("password").notEmpty().withMessage("La contrasena es obligatoria"),
];

//Users 
const validarActualizarUsuario = [
  body("username").optional().trim().isLength({ min: 3 }).withMessage("El username debe tener al menos 3 caracteres"),
  body("email").optional().isEmail().withMessage("El email no es valido"),
  body("password").optional().isLength({ min: 6 }).withMessage("La contrasena debe tener al menos 6 caracteres"),
];

//Houses 
const validarCasa = [
  body("name").trim().isLength({ min: 3 }).withMessage("El nombre de la casa debe tener al menos 3 caracteres"),
  body("theme")
    .isIn(["Darkness", "Comedy", "Terror", "Corporate"])
    .withMessage("El tema debe ser Darkness, Comedy, Terror o Corporate"),
  body("isPrivate").optional().isBoolean().withMessage("isPrivate debe ser true o false"),
];

const validarCasaActualizar = [
  body("name").optional().trim().isLength({ min: 3 }).withMessage("El nombre de la casa debe tener al menos 3 caracteres"),
  body("theme")
    .optional()
    .isIn(["Darkness", "Comedy", "Terror", "Corporate"])
    .withMessage("El tema debe ser Darkness, Comedy, Terror o Corporate"),
];

const validarUnirseCasa = [
  body("inviteCode").optional().isString().withMessage("El codigo de invitacion debe ser texto"),
];

//cualquier ruta con /:id 
const validarIdParam = [param("id").isMongoId().withMessage("El id no es valido")];

module.exports = {
  validarRegistro,
  validarLogin,
  validarActualizarUsuario,
  validarCasa,
  validarCasaActualizar,
  validarUnirseCasa,
  validarIdParam,
};
