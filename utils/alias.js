//palabras para armar los alias anonimos, cada usuario recibe uno distinto en cada subasta
const ADJECTIVES = ["Silent", "Hollow", "Pale", "Wailing", "Crooked", "Restless", "Grim", "Faded", "Lonely", "Hungry"];
const NOUNS = ["Wraith", "Specter", "Banshee", "Shade", "Phantom", "Ghoul", "Revenant", "Wisp", "Lantern", "Raven"];

//arma el alias sumando los codigos de las letras de los dos ids
//como la cuenta siempre da lo mismo, el mismo usuario en la misma subasta siempre tiene el mismo alias
//pero en otra subasta le sale otro, asi nadie lo puede seguir de una subasta a la otra
function getAlias(auctionId, userId) {
  const texto = auctionId.toString() + userId.toString();
  let suma = 0;
  for (let i = 0; i < texto.length; i++) {
    suma = suma + texto.charCodeAt(i) * (i + 1);
  }
  const adjetivo = ADJECTIVES[suma % ADJECTIVES.length];
  const sustantivo = NOUNS[Math.floor(suma / ADJECTIVES.length) % NOUNS.length];
  return adjetivo + " " + sustantivo;
}

module.exports = { getAlias };
