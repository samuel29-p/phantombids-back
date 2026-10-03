//Se corre UNA vez o para resetear con: node seed/seed.js
//ojo, borra todo lo que haya en la base y deja solo estos datos

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const HauntHouse = require("../models/HauntHouse");
const CursedObject = require("../models/CursedObject");
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const Bet = require("../models/Bet");
const CurseLog = require("../models/CurseLog");
const { CURSES } = require("../utils/curses");
const { getAlias } = require("../utils/alias");

//Los mismos datos del front 
const SEED_USERS = [
  { id: 1, username: "vinland", email: "vinland@phantom.com", password: "123456", reputation: 120, joinDate: "2026-01-14", avatarUrl: "/images/AV1.png" },
  { id: 2, username: "newfoundland", email: "newfoundland@phantom.com", password: "123456", reputation: 100, joinDate: "2026-01-20", avatarUrl: "/images/AV2.png" },
  { id: 3, username: "illWin", email: "illWin@phantom.com", password: "123456", reputation: 95, joinDate: "2026-02-02", avatarUrl: "/images/AV3.png" },
  { id: 4, username: "cheeseburger", email: "cheeseburger@phantom.com", password: "123456", reputation: 85, joinDate: "2026-02-11", avatarUrl: "/images/AV4.png" },
  { id: 5, username: "blackberries", email: "blackberries@phantom.com", password: "123456", reputation: 80, joinDate: "2026-02-27", avatarUrl: "/images/AV5.png" },
  { id: 6, username: "strawberries", email: "strawberries@phantom.com", password: "123456", reputation: 75, joinDate: "2026-03-05", avatarUrl: "/images/AV6.png" },
  { id: 7, username: "deutschland", email: "deutschland@phantom.com", password: "123456", reputation: 70, joinDate: "2026-03-19", avatarUrl: "/images/AV7.png" },
  { id: 8, username: "photographer", email: "photographer@phantom.com", password: "123456", reputation: 65, joinDate: "2026-04-01", avatarUrl: "/images/AV8.png" },
  { id: 9, username: "thing", email: "thing@phantom.com", password: "123456", reputation: 60, joinDate: "2026-04-17", avatarUrl: "/images/AV9.png" },
  { id: 10, username: "persona", email: "persona@phantom.com", password: "123456", reputation: 55, joinDate: "2026-05-08", avatarUrl: "/images/AV10.jpg" },
  { id: 11, username: "animal", email: "animal@phantom.com", password: "123456", reputation: 50, joinDate: "2026-05-23", avatarUrl: "/images/AV11.jpg" },
  { id: 12, username: "place", email: "place@phantom.com", password: "123456", reputation: 45, joinDate: "2026-06-06", avatarUrl: "/images/AV12.jpg" },
];

const SEED_HOUSES = [
  {
    id: 1,
    name: "The Silent Crypt",
    theme: "Darkness",
    description: "Objects that only whisper when nobody is watching.",
    coverImageUrl: "/images/house-crypt.jpeg",
    isPrivate: false,
    inviteCode: null,
    createdAt: "2026-02-01T10:00:00",
    members: [
      { userId: 1, role: "HeadHaunter", joinedAt: "2026-02-01T10:00:00" },
      { userId: 3, role: "SeniorSpook", joinedAt: "2026-02-03T12:00:00" },
      { userId: 5, role: "SeniorSpook", joinedAt: "2026-02-04T09:30:00" },
      { userId: 7, role: "Spirit", joinedAt: "2026-02-10T16:00:00" },
      { userId: 9, role: "Spirit", joinedAt: "2026-02-15T18:20:00" },
      { userId: 11, role: "Poltergeist", joinedAt: "2026-03-01T21:00:00" },
    ],
  },
  {
    id: 2,
    name: "The Laughing Basement",
    theme: "Comedy",
    description: "Curses that bring more shame than fear.",
    coverImageUrl: "/images/house-basement.jpeg",
    isPrivate: false,
    inviteCode: null,
    createdAt: "2026-02-20T11:00:00",
    members: [
      { userId: 2, role: "HeadHaunter", joinedAt: "2026-02-20T11:00:00" },
      { userId: 6, role: "SeniorSpook", joinedAt: "2026-02-22T14:00:00" },
      { userId: 8, role: "Spirit", joinedAt: "2026-03-02T10:15:00" },
      { userId: 10, role: "Spirit", joinedAt: "2026-03-08T19:45:00" },
      { userId: 12, role: "Spirit", joinedAt: "2026-03-14T08:00:00" },
    ],
  },
  {
    id: 3,
    name: "Room 13",
    theme: "Terror",
    description: "Private house. Nobody gets in without a code.",
    coverImageUrl: "/images/house-room13.jpeg",
    isPrivate: true,
    inviteCode: "SALA13",
    createdAt: "2026-03-10T22:00:00",
    members: [
      { userId: 4, role: "HeadHaunter", joinedAt: "2026-03-10T22:00:00" },
      { userId: 1, role: "SeniorSpook", joinedAt: "2026-03-11T23:10:00" },
      { userId: 7, role: "Spirit", joinedAt: "2026-03-18T20:00:00" },
      { userId: 9, role: "Spirit", joinedAt: "2026-03-25T17:30:00" },
    ],
  },
];

const SEED_OBJECTS = [
  { id: 1, hauntHouseId: 1, createdBy: 1, name: "Porcelain Doll", description: "It blinks when nobody is looking.", imageUrl: "/images/doll.jpeg", baseCurse: "LOSE_10_REPUTATION", minBid: 5, maxBid: 60, durationDays: 3 },
  { id: 2, hauntHouseId: 1, createdBy: 3, name: "Cursed Mirror", description: "It reflects whoever stood there before you.", imageUrl: "/images/mirror.jpeg", baseCurse: "CURSE_MARK_7_DAYS", minBid: 1, maxBid: 40, durationDays: 5 },
  { id: 3, hauntHouseId: 1, createdBy: 5, name: "Clock Without Hands", description: "It marks the hour of your last mistake.", imageUrl: "/images/clock.jpeg", baseCurse: "CANNOT_BID_2_AUCTIONS", minBid: 10, maxBid: 80, durationDays: 7 },
  { id: 4, hauntHouseId: 2, createdBy: 2, name: "Terrifying Clown Nose", description: "It honks by itself at 3 in the morning.", imageUrl: "/images/nose.jpeg", baseCurse: "ALIAS_REVEALED", minBid: 3, maxBid: 30, durationDays: 2 },
  { id: 5, hauntHouseId: 2, createdBy: 6, name: "The Laughing Chair", description: "It creaks with a cackle if you sit down.", imageUrl: "/images/chair.jpeg", baseCurse: "HALVE_NEXT_PAYOUT", minBid: 2, maxBid: 25, durationDays: 4 },
  { id: 6, hauntHouseId: 2, createdBy: 8, name: "Dead Manager's Tie", description: "It tightens by itself during meetings.", imageUrl: "/images/tie.jpeg", baseCurse: "CANNOT_BET_48_HOURS", minBid: 8, maxBid: 50, durationDays: 3 },
  { id: 7, hauntHouseId: 3, createdBy: 4, name: "Key to Door 13", description: "It opens a room that does not exist.", imageUrl: "/images/key.jpeg", baseCurse: "LOSE_20_REPUTATION", minBid: 5, maxBid: 100, durationDays: 6 },
  { id: 8, hauntHouseId: 3, createdBy: 1, name: "The Blank Diary", description: "It wakes up written in your handwriting.", imageUrl: "/images/diary.jpeg", baseCurse: "POLTERGEIST_24_HOURS", minBid: 1, maxBid: 35, durationDays: 2 },
];

//cada subasta apunta al id viejo del objeto, open sigue abierta y closed ya se cerro
const SEED_AUCTIONS = [
  { id: 1, cursedObjectId: 1, status: "open" },
  { id: 2, cursedObjectId: 4, status: "open" },
  { id: 3, cursedObjectId: 7, status: "open" },
  { id: 4, cursedObjectId: 2, status: "closed" },
];

//en la subasta 4 el 5 esta repetido, asi que gana el 9 que es el mas bajo sin repetir
const SEED_BIDS = [
  { auctionId: 1, userId: 3, amount: 12 },
  { auctionId: 1, userId: 5, amount: 8 },
  { auctionId: 1, userId: 7, amount: 20 },
  { auctionId: 2, userId: 6, amount: 7 },
  { auctionId: 2, userId: 8, amount: 15 },
  { auctionId: 3, userId: 1, amount: 30 },
  { auctionId: 4, userId: 1, amount: 5 },
  { auctionId: 4, userId: 5, amount: 5 },
  { auctionId: 4, userId: 7, amount: 9 },
  { auctionId: 4, userId: 9, amount: 14 },
];

//predictedUserId es a quien se le apuesta, su alias real se busca cuando ya existen las pujas
const SEED_BETS = [
  { auctionId: 1, bettorId: 9, predictedUserId: 5, amount: 10, status: "pending", payout: 0 },
  { auctionId: 4, bettorId: 3, predictedUserId: 7, amount: 10, status: "won", payout: 20 },
  { auctionId: 4, bettorId: 11, predictedUserId: 9, amount: 5, status: "lost", payout: 0 },
];

async function sembrar() {
  await connectDB();

  console.log("Borrando datos anteriores...");
  await User.deleteMany({});
  await HauntHouse.deleteMany({});
  await CursedObject.deleteMany({});
  await Auction.deleteMany({});
  await Bid.deleteMany({});
  await Bet.deleteMany({});
  await CurseLog.deleteMany({});

  console.log("Creando usuarios...");
  //usersMap conecta el id viejo del front (1, 2, 3...) con el _id real que le asigna Mongo
  const usersMap = {};
  for (const datosUsuario of SEED_USERS) {
    //User.create()  dispara el hook pre("save") que hashea la contrasena
    const usuarioCreado = await User.create({
      username: datosUsuario.username,
      email: datosUsuario.email,
      password: datosUsuario.password,
      reputation: datosUsuario.reputation,
      joinDate: datosUsuario.joinDate,
      avatarUrl: datosUsuario.avatarUrl,
    });
    usersMap[datosUsuario.id] = usuarioCreado._id;
  }

  console.log("Creando casas...");
  const housesMap = {};
  for (const datosCasa of SEED_HOUSES) {
    const casaCreada = await HauntHouse.create({
      name: datosCasa.name,
      theme: datosCasa.theme,
      description: datosCasa.description,
      coverImageUrl: datosCasa.coverImageUrl,
      isPrivate: datosCasa.isPrivate,
      inviteCode: datosCasa.inviteCode,
      createdAt: datosCasa.createdAt,
      members: datosCasa.members.map((m) => ({
        userId: usersMap[m.userId],
        role: m.role,
        joinedAt: m.joinedAt,
      })),
    });
    housesMap[datosCasa.id] = casaCreada._id;
  }

  console.log("Creando objetos...");
  const objectsMap = {};
  for (const datosObjeto of SEED_OBJECTS) {
    const objetoCreado = await CursedObject.create({
      hauntHouseId: housesMap[datosObjeto.hauntHouseId],
      createdBy: usersMap[datosObjeto.createdBy],
      name: datosObjeto.name,
      description: datosObjeto.description,
      imageUrl: datosObjeto.imageUrl,
      baseCurse: datosObjeto.baseCurse,
      minBid: datosObjeto.minBid,
      maxBid: datosObjeto.maxBid,
      durationDays: datosObjeto.durationDays,
    });
    objectsMap[datosObjeto.id] = objetoCreado._id;
  }

  console.log("Creando subastas...");
  const DIA = 24 * 60 * 60 * 1000;
  const auctionsMap = {};
  for (const datosSubasta of SEED_AUCTIONS) {
    const objeto = SEED_OBJECTS.find((o) => o.id === datosSubasta.cursedObjectId);
    //las abiertas cierran en el futuro, la cerrada ya vencio hace un dia
    const ahora = Date.now();
    const inicio = datosSubasta.status === "open" ? ahora : ahora - (objeto.durationDays + 1) * DIA;
    const subastaCreada = await Auction.create({
      hauntHouseId: housesMap[objeto.hauntHouseId],
      cursedObjectId: objectsMap[objeto.id],
      createdBy: usersMap[objeto.createdBy],
      startsAt: new Date(inicio),
      endsAt: new Date(inicio + objeto.durationDays * DIA),
      status: datosSubasta.status,
    });
    auctionsMap[datosSubasta.id] = subastaCreada._id;
  }

  console.log("Creando pujas...");
  //aliasMap guarda el alias de cada usuario en cada subasta, las apuestas lo necesitan despues
  const aliasMap = {};
  for (const datosPuja of SEED_BIDS) {
    let alias = getAlias(auctionsMap[datosPuja.auctionId], usersMap[datosPuja.userId]);
    //igual que en el servicio, si el alias ya lo tiene otro en esa subasta se le agrega un numero
    const usados = Object.keys(aliasMap)
      .filter((llave) => llave.startsWith(datosPuja.auctionId + "-"))
      .map((llave) => aliasMap[llave]);
    if (usados.includes(alias)) {
      alias = alias + " " + (usados.length + 1);
    }
    aliasMap[datosPuja.auctionId + "-" + datosPuja.userId] = alias;

    await Bid.create({
      auctionId: auctionsMap[datosPuja.auctionId],
      userId: usersMap[datosPuja.userId],
      amount: datosPuja.amount,
      alias: alias,
    });
  }

  console.log("Creando apuestas...");
  for (const datosApuesta of SEED_BETS) {
    await Bet.create({
      auctionId: auctionsMap[datosApuesta.auctionId],
      bettorId: usersMap[datosApuesta.bettorId],
      predictedAlias: aliasMap[datosApuesta.auctionId + "-" + datosApuesta.predictedUserId],
      amount: datosApuesta.amount,
      status: datosApuesta.status,
      payout: datosApuesta.payout,
    });
  }

  //la subasta 4 ya esta cerrada, asi que se le pone su ganador y su maldicion como si se hubiera cerrado de verdad
  console.log("Cerrando la subasta de ejemplo...");
  const subastaCerrada = await Auction.findById(auctionsMap[4]);
  subastaCerrada.winnerId = usersMap[7];
  subastaCerrada.winningBid = 9;
  await subastaCerrada.save();

  const maldicion = CURSES.CURSE_MARK_7_DAYS;
  await CurseLog.create({
    userId: usersMap[7],
    auctionId: auctionsMap[4],
    curse: maldicion.code,
    expiresAt: new Date(Date.now() + maldicion.durationHours * 60 * 60 * 1000),
  });

  console.log(
    "Listo: " + SEED_USERS.length + " usuarios, " + SEED_HOUSES.length + " casas, " +
      SEED_OBJECTS.length + " objetos, " + SEED_AUCTIONS.length + " subastas, " +
      SEED_BIDS.length + " pujas y " + SEED_BETS.length + " apuestas creadas."
  );

  await mongoose.connection.close();
  console.log("Conexion cerrada.");
}

sembrar().catch((error) => {
  console.error("Error sembrando datos:", error);
  process.exit(1);
});
