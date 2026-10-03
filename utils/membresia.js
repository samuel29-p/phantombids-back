const HauntHouse = require("../models/HauntHouse");

//busca la casa y revisa si el usuario es miembro de ella
//la usan los servicios de objetos y subastas, por eso vive en utils y no se repite en cada uno
async function buscarCasaYMiembro(hauntHouseId, userId) {
  const casa = await HauntHouse.findById(hauntHouseId);
  if (!casa) {
    throw { status: 404, message: "Casa no encontrada" };
  }
  //los ids de mongo son objetos, por eso se comparan como texto con toString
  const miembro = casa.members.find((m) => m.userId.toString() === userId.toString());
  return { casa, miembro };
}

module.exports = { buscarCasaYMiembro };
