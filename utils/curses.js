//catalogo de las 8 maldiciones predefinidas, requisito 9
//la llave de cada una es el codigo que se guarda en cursedObject.baseCurse y en curseLog.curse
//effect reputation es permanente y resta puntos, permission y cosmetic son temporales y duran durationHours
const CURSES = {
  LOSE_10_REPUTATION: {
    code: "LOSE_10_REPUTATION",
    name: "Soul Leak",
    description: "You permanently lose 10 reputation points.",
    effect: "reputation",
    reputationChange: -10,
    durationHours: null,
  },
  LOSE_20_REPUTATION: {
    code: "LOSE_20_REPUTATION",
    name: "Miser's Sentence",
    description: "You permanently lose 20 reputation points.",
    effect: "reputation",
    reputationChange: -20,
    durationHours: null,
  },
  CANNOT_BID_2_AUCTIONS: {
    code: "CANNOT_BID_2_AUCTIONS",
    name: "Spectral Gag",
    description: "You cannot bid in the next 2 auctions.",
    effect: "permission",
    reputationChange: 0,
    durationHours: 168,
  },
  CANNOT_BET_48_HOURS: {
    code: "CANNOT_BET_48_HOURS",
    name: "Blind Eye",
    description: "You cannot place bets for 48 hours.",
    effect: "permission",
    reputationChange: 0,
    durationHours: 48,
  },
  CURSE_MARK_7_DAYS: {
    code: "CURSE_MARK_7_DAYS",
    name: "Mark of the Damned",
    description: "Your profile shows a curse mark for 7 days.",
    effect: "cosmetic",
    reputationChange: 0,
    durationHours: 168,
  },
  ALIAS_REVEALED: {
    code: "ALIAS_REVEALED",
    name: "Torn Veil",
    description: "Your alias is revealed in the next auction of the house.",
    effect: "permission",
    reputationChange: 0,
    durationHours: 72,
  },
  HALVE_NEXT_PAYOUT: {
    code: "HALVE_NEXT_PAYOUT",
    name: "Plaster Hand",
    description: "Your next betting payout is cut in half.",
    effect: "permission",
    reputationChange: 0,
    durationHours: 120,
  },
  POLTERGEIST_24_HOURS: {
    code: "POLTERGEIST_24_HOURS",
    name: "Brief Exile",
    description: "You become a Poltergeist in your house for 24 hours.",
    effect: "permission",
    reputationChange: 0,
    durationHours: 24,
  },
};

//en el front era export const, pero el backend usa require, asi que se exporta con module.exports
//la lista completa sirve para GET /api/curses, y los codigos sirven como enum en los schemas
const CURSE_LIST = Object.values(CURSES);
const CURSE_CODES = Object.keys(CURSES);

module.exports = { CURSES, CURSE_LIST, CURSE_CODES };
