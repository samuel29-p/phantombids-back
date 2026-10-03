const CursedObject = require("../models/CursedObject");
const Auction = require("../models/Auction");
const { buscarCasaYMiembro } = require("../utils/membresia");

//la regla del requisito 8 que el schema no puede revisar solo, porque compara dos campos
function revisarRango(minBid, maxBid) {
  if (maxBid < minBid + 10) {
    throw { status: 400, message: "La puja maxima debe ser al menos la minima mas 10" };
  }
}

//solo el creador del objeto o un admin lo pueden editar o borrar
function revisarDueno(objeto, usuario) {
  const esCreador = objeto.createdBy.toString() === usuario._id.toString();
  const esAdmin = usuario.role === "admin";
  if (!esCreador && !esAdmin) {
    throw { status: 403, message: "Solo el creador del objeto o un admin puede hacer esto" };
  }
}

//si llega ?hauntHouseId en la url, solo devuelve los objetos de esa casa
async function listar(filtros) {
  const consulta = {};
  if (filtros.hauntHouseId) consulta.hauntHouseId = filtros.hauntHouseId;
  return CursedObject.find(consulta).sort({ createdAt: -1 });
}

async function obtenerPorId(id) {
  const objeto = await CursedObject.findById(id);
  if (!objeto) {
    throw { status: 404, message: "Objeto no encontrado" };
  }
  return objeto;
}

async function crear(datos, usuario) {
  //solo los miembros de la casa pueden crear objetos en ella, el admin puede en cualquiera
  const { miembro } = await buscarCasaYMiembro(datos.hauntHouseId, usuario._id);
  if (!miembro && usuario.role !== "admin") {
    throw { status: 403, message: "Debes ser miembro de la casa para crear objetos" };
  }

  revisarRango(datos.minBid, datos.maxBid);

  //el creador sale del token y no del body, asi nadie puede crear objetos a nombre de otro
  return CursedObject.create({
    hauntHouseId: datos.hauntHouseId,
    createdBy: usuario._id,
    name: datos.name,
    description: datos.description,
    imageUrl: datos.imageUrl,
    baseCurse: datos.baseCurse,
    minBid: datos.minBid,
    maxBid: datos.maxBid,
    durationDays: datos.durationDays,
  });
}

async function actualizar(id, datos, usuario) {
  const objeto = await obtenerPorId(id);
  revisarDueno(objeto, usuario);

  //solo se copian los campos que llegaron, los que no vienen se quedan como estaban
  const camposEditables = ["name", "description", "imageUrl", "baseCurse", "minBid", "maxBid", "durationDays"];
  camposEditables.forEach((campo) => {
    if (datos[campo] !== undefined) objeto[campo] = datos[campo];
  });

  //se revisa con los valores ya mezclados, por si solo cambiaron uno de los dos
  revisarRango(objeto.minBid, objeto.maxBid);

  //save en vez de findByIdAndUpdate para que corran las validaciones del schema
  await objeto.save();
  return objeto;
}

async function eliminar(id, usuario) {
  const objeto = await obtenerPorId(id);
  revisarDueno(objeto, usuario);

  //no se puede borrar un objeto que se esta subastando, la subasta quedaria apuntando a la nada
  const subastaAbierta = await Auction.findOne({ cursedObjectId: id, status: "open" });
  if (subastaAbierta) {
    throw { status: 409, message: "No se puede borrar un objeto que esta en una subasta abierta" };
  }

  await objeto.deleteOne();
  return objeto;
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
