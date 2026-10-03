const mongoose = require("mongoose");

//el schema es el molde de una subasta, dice que campos tiene, de que tipo y que reglas cumple
//es el equivalente a los objetos de SEED_AUCTIONS en el front, pero con validaciones
const auctionSchema = new mongoose.Schema(
  {
    //en el front era un numero, aqui guarda el _id de la casa
    //ref le dice a mongoose a que modelo apunta ese id
    hauntHouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HauntHouse",
      required: [true, "La subasta debe pertenecer a una casa"],
    },
    cursedObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CursedObject",
      required: [true, "La subasta debe tener un objeto maldito"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "La subasta debe tener un creador"],
    },
    //si no se manda, empieza en el momento en que se crea
    startsAt: {
      type: Date,
      default: Date.now,
    },
    endsAt: {
      type: Date,
      required: [true, "La fecha de cierre es obligatoria"],
    },
    //enum limita los valores posibles, igual que el comentario open | closed | cancelled del front
    status: {
      type: String,
      enum: {
        values: ["open", "closed", "cancelled"],
        message: "El estado debe ser open, closed o cancelled",
      },
      default: "open",
    },
    //mientras la subasta este abierta no hay ganador, por eso arrancan en null
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    winningBid: {
      type: Number,
      default: null,
    },
  },
  //timestamps agrega solo createdAt y updatedAt
  { timestamps: true },
);

//el primer texto es el nombre del modelo, el mismo que va en los ref de otros schemas
module.exports = mongoose.model("Auction", auctionSchema);
