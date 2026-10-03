const HauntHouse = require("../models/HauntHouse");

//arma un codigo de 6 caracteres al azar para las casas privadas
function generarCodigoInvitacion() {
  const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let codigo = "";
  for (let i = 0; i < 6; i++) {
    codigo = codigo + caracteres[Math.floor(Math.random() * caracteres.length)];
  }
  return codigo;
}

async function crearCasa(datos, creadorId) {
  const nuevaCasa = {
    name: datos.name,
    theme: datos.theme,
    description: datos.description,
    coverImageUrl: datos.coverImageUrl,
    isPrivate: datos.isPrivate || false,
    //si es privada y no mandaron codigo, se genera uno automaticamente
    inviteCode: datos.isPrivate ? datos.inviteCode || generarCodigoInvitacion() : null,
    //quien crea la casa queda adentro como HeadHaunter de una vez
    members: [{ userId: creadorId, role: "HeadHaunter" }],
  };

  return HauntHouse.create(nuevaCasa);
}

async function obtenerCasas() {
  return HauntHouse.find();
}

async function obtenerCasaPorId(id) {
  const casa = await HauntHouse.findById(id);
  if (!casa) {
    throw { status: 404, message: "Casa no encontrada" };
  }
  return casa;
}

function obtenerMiembro(casa, usuarioId) {
  return casa.members.find((m) => m.userId.toString() === usuarioId.toString());
}

async function actualizarCasa(id, datos, usuarioActual) {
  const casa = await obtenerCasaPorId(id);

  const miembro = obtenerMiembro(casa, usuarioActual._id);
  const esHeadHaunter = miembro && miembro.role === "HeadHaunter";
  const esAdmin = usuarioActual.role === "admin";

  if (!esHeadHaunter && !esAdmin) {
    throw { status: 403, message: "Solo el HeadHaunter o un admin pueden editar la casa" };
  }

  //solo se cambian los datos de la casa, los miembros no se tocan aqui porque entran con join
  const camposEditables = ["name", "theme", "description", "coverImageUrl", "isPrivate", "inviteCode"];
  for (const campo of camposEditables) {
    if (datos[campo] !== undefined) {
      casa[campo] = datos[campo];
    }
  }
  await casa.save();
  return casa;
}

async function eliminarCasa(id) {
  const casa = await HauntHouse.findByIdAndDelete(id);
  if (!casa) {
    throw { status: 404, message: "Casa no encontrada" };
  }
  return casa;
}

async function unirseCasa(id, usuarioId, codigoIngresado) {
  const casa = await obtenerCasaPorId(id);

  const yaEsMiembro = obtenerMiembro(casa, usuarioId);
  if (yaEsMiembro) {
    throw { status: 409, message: "Ya eres miembro de esta casa" };
  }

  if (casa.isPrivate && casa.inviteCode !== codigoIngresado) {
    throw { status: 403, message: "Codigo de invitacion incorrecto" };
  }

  casa.members.push({ userId: usuarioId, role: "Spirit" });
  await casa.save();
  return casa;
}

async function obtenerMiembros(id, usuarioId) {
  const casa = await obtenerCasaPorId(id);

  const esMiembro = obtenerMiembro(casa, usuarioId);
  if (!esMiembro) {
    throw { status: 403, message: "Solo los miembros de esta casa pueden ver quien esta en ella" };
  }

  return casa.members;
}

module.exports = {
  crearCasa,
  obtenerCasas,
  obtenerCasaPorId,
  actualizarCasa,
  eliminarCasa,
  unirseCasa,
  obtenerMiembros,
};
