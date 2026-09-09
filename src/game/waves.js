function loc(en, es = en, pt = en) {
  return { en, es, pt };
}

export const TIERS = {
  beginner: loc("Beginner", "Principiante", "Iniciante"),
  intermediate: loc("Intermediate", "Intermedio", "Intermediário"),
  advanced: loc("Advanced", "Avanzado", "Avançado"),
  pro: loc("Pro", "Pro", "Pro"),
};

export const WAVES = [
  {
    id: 1,
    tier: "beginner",
    name: loc("Waikiki Beach"),
    country: loc("USA", "EE.UU.", "EUA"),
    flag: "🇺🇸",
    place: loc("Hawaii, USA", "Hawái, EE.UU.", "Havaí, EUA"),
    description: loc(
      "Soft, slow wave that breaks over a shallow sand and coral bottom. Ideal for learning to stand up, with long rides.",
      "Ola suave y lenta que rompe sobre fondo de arena y coral poco profundo. Ideal para aprender a pararse, con largos recorridos.",
      "Onda suave e lenta que quebra sobre fundo de areia e coral raso. Ideal para aprender a ficar de pé, com longas descidas."
    ),
  },
  {
    id: 2,
    tier: "beginner",
    name: loc("San Onofre"),
    country: loc("USA", "EE.UU.", "EUA"),
    flag: "🇺🇸",
    place: loc("California, USA", "California, EE.UU.", "Califórnia, EUA"),
    description: loc(
      "Sand bottom, small and very predictable waves. Relaxed vibe, a classic longboard spot.",
      "Fondo de arena, olas pequeñas y muy predecibles. Ambiente relajado, clásico spot de longboard.",
      "Fundo de areia, ondas pequenas e muito previsíveis. Clima relaxado, spot clássico de longboard."
    ),
  },
  {
    id: 3,
    tier: "beginner",
    name: loc("Malibu"),
    country: loc("USA", "EE.UU.", "EUA"),
    flag: "🇺🇸",
    place: loc("First Point, California, USA", "First Point, California, EE.UU.", "First Point, Califórnia, EUA"),
    description: loc(
      "Right-hand point break, long and orderly. Breaks with little power, perfect for practicing basic turns.",
      "Point break de derecha, larga y ordenada. Rompe con poca fuerza, perfecta para practicar giros básicos.",
      "Point break de direita, longa e organizada. Quebra com pouca força, perfeita para praticar manobras básicas."
    ),
  },
  {
    id: 4,
    tier: "beginner",
    name: loc("Canggu"),
    country: loc("Indonesia", "Indonesia", "Indonésia"),
    flag: "🇮🇩",
    place: loc("Batu Bolong, Bali, Indonesia", "Batu Bolong, Bali, Indonesia", "Batu Bolong, Bali, Indonésia"),
    description: loc(
      "Beach break with mellow waves most of the year, good for beginners with an instructor.",
      "Beach break con olas suaves la mayor parte del año, buena para principiantes con instructor.",
      "Beach break com ondas suaves na maior parte do ano, boa para iniciantes com instrutor."
    ),
  },
  {
    id: 5,
    tier: "beginner",
    name: loc("Kuta Beach"),
    country: loc("Indonesia", "Indonesia", "Indonésia"),
    flag: "🇮🇩",
    place: loc("Bali, Indonesia", "Bali, Indonesia", "Bali, Indonésia"),
    description: loc(
      "Sand-bottom beach break, small and foamy waves, ideal for first surf lessons.",
      "Beach break de fondo de arena, olas chicas y espumosas, ideal para las primeras clases de surf.",
      "Beach break de fundo de areia, ondas pequenas e espumosas, ideal para as primeiras aulas de surf."
    ),
  },
  {
    id: 6,
    tier: "intermediate",
    name: loc("Chicama"),
    country: loc("Peru", "Perú", "Peru"),
    flag: "🇵🇪",
    place: loc("Peru", "Perú", "Peru"),
    description: loc(
      "The longest left-hand wave in the world (up to 2 km). A mellow, progressively building point break, ideal for logging distance and endurance.",
      "La ola izquierda más larga del mundo (hasta 2 km). Point break mellow y de crecimiento progresivo, ideal para sumar recorrido y resistencia.",
      "A onda esquerda mais longa do mundo (até 2 km). Point break mellow e de crescimento progressivo, ideal para somar descida e resistência."
    ),
  },
  {
    id: 7,
    tier: "intermediate",
    name: loc("El Sunzal"),
    country: loc("El Salvador"),
    flag: "🇸🇻",
    place: loc("El Salvador"),
    description: loc(
      "Consistent right-hand point break, with sections to practice intermediate maneuvers.",
      "Point break de derecha, consistente, con secciones para practicar maniobras de nivel medio.",
      "Point break de direita, consistente, com seções para praticar manobras de nível médio."
    ),
  },
  {
    id: 8,
    tier: "intermediate",
    name: loc("Saquarema"),
    country: loc("Brazil", "Brasil", "Brasil"),
    flag: "🇧🇷",
    place: loc("Rio de Janeiro, Brazil", "Río de Janeiro, Brasil", "Rio de Janeiro, Brasil"),
    description: loc(
      "Powerful, hollow beach break, a regular stop on the world tour (WSL). Sand bottom that forms consistent barrels, demands good timing and paddling.",
      "Beach break potente y hueco, sede fija del circuito mundial (WSL). Fondo de arena que forma tubos consistentes, exige buen timing y remada.",
      "Beach break potente e oco, sede fixa do circuito mundial (WSL). Fundo de areia que forma tubos consistentes, exige bom timing e paddling."
    ),
  },
  {
    id: 9,
    tier: "intermediate",
    name: loc("Playa Hermosa"),
    country: loc("Costa Rica"),
    flag: "🇨🇷",
    place: loc("Guanacaste, Costa Rica"),
    description: loc(
      "Powerful beach break with good shape, demands more paddling and timing than a basic spot.",
      "Beach break potente con buena forma, exige más remada y timing que un spot básico.",
      "Beach break potente com boa forma, exige mais paddling e timing do que um spot básico."
    ),
  },
  {
    id: 10,
    tier: "intermediate",
    name: loc("Popoyo"),
    country: loc("Nicaragua", "Nicaragua", "Nicarágua"),
    flag: "🇳🇮",
    place: loc("Nicaragua", "Nicaragua", "Nicarágua"),
    description: loc(
      "Reef break with powerful rights and lefts, a bit more demanding because of the force of the water.",
      "Reef break con derechas e izquierdas potentes, algo más exigente por la fuerza del agua.",
      "Reef break com direitas e esquerdas potentes, um pouco mais exigente pela força da água."
    ),
  },
  {
    id: 11,
    tier: "advanced",
    name: loc("Uluwatu"),
    country: loc("Indonesia", "Indonesia", "Indonésia"),
    flag: "🇮🇩",
    place: loc("Bali, Indonesia", "Bali, Indonesia", "Bali, Indonésia"),
    description: loc(
      "Point break over reef, long and powerful waves, requires solid board skills and reading the reef.",
      "Point break sobre arrecife, olas largas y potentes, requiere buen manejo de tabla y lectura del reef.",
      "Point break sobre recife, ondas longas e potentes, exige bom controle da prancha e leitura do reef."
    ),
  },
  {
    id: 12,
    tier: "advanced",
    name: loc("Supertubos"),
    country: loc("Portugal"),
    flag: "🇵🇹",
    place: loc("Peniche, Portugal"),
    description: loc(
      "Very hollow, powerful beach break, considered one of the best barrels in Europe.",
      "Beach break muy hueco y potente, considerado uno de los mejores tubos de Europa.",
      "Beach break muito oco e potente, considerado um dos melhores tubos da Europa."
    ),
  },
  {
    id: 13,
    tier: "advanced",
    name: loc("Snapper Rocks"),
    country: loc("Australia", "Australia", "Austrália"),
    flag: "🇦🇺",
    place: loc("Gold Coast, Australia", "Gold Coast, Australia", "Gold Coast, Austrália"),
    description: loc(
      "Super-long, fast point break that demands good positioning and paddling.",
      "Point break superlargo y rápido, exige buen posicionamiento y remada.",
      "Point break superlongo e rápido, exige bom posicionamento e paddling."
    ),
  },
  {
    id: 14,
    tier: "advanced",
    name: loc("Jeffreys Bay"),
    country: loc("South Africa", "Sudáfrica", "África do Sul"),
    flag: "🇿🇦",
    place: loc("South Africa", "Sudáfrica", "África do Sul"),
    description: loc(
      "Right-hand point break, a perfect and very fast wave, a classic on the professional tour.",
      "Point break de derecha, ola perfecta y muy rápida, clásica del circuito profesional.",
      "Point break de direita, onda perfeita e muito rápida, clássica do circuito profissional."
    ),
  },
  {
    id: 15,
    tier: "advanced",
    name: loc("Zicatela"),
    country: loc("Mexico", "México", "México"),
    flag: "🇲🇽",
    place: loc("Puerto Escondido, Mexico", "Puerto Escondido, México", "Puerto Escondido, México"),
    description: loc(
      'Very powerful beach break known as the "Mexican Pipeline," with shutting barrels and a lot of force.',
      'Beach break muy potente conocido como el "Pipeline mexicano", con tubos cerrados y mucha fuerza.',
      'Beach break muito potente conhecido como o "Pipeline mexicano", com tubos fechados e muita força.'
    ),
  },
  {
    id: 16,
    tier: "pro",
    name: loc("Nazaré"),
    country: loc("Portugal"),
    flag: "🇵🇹",
    place: loc("Portugal"),
    description: loc(
      "Giant wave (records of +20m) thanks to an underwater canyon, territory of big-wave surfers.",
      "Ola gigante (récords de +20m) gracias a un cañón submarino, territorio de big wave surfers.",
      "Onda gigante (recordes de +20m) graças a um cânion submarino, território de big wave surfers."
    ),
  },
  {
    id: 17,
    tier: "pro",
    name: loc("Mavericks"),
    country: loc("USA", "EE.UU.", "EUA"),
    flag: "🇺🇸",
    place: loc("California, USA", "California, EE.UU.", "Califórnia, EUA"),
    description: loc(
      "Cold, giant, and highly technical wave, with strong currents and nearby rocks.",
      "Ola fría, gigante y muy técnica, con corrientes fuertes y rocas cercanas.",
      "Onda fria, gigante e muito técnica, com correntes fortes e pedras próximas."
    ),
  },
  {
    id: 18,
    tier: "pro",
    name: loc("Cloudbreak"),
    country: loc("Fiji"),
    flag: "🇫🇯",
    place: loc("Fiji"),
    description: loc(
      "World-class reef break, long and perfect barrels, but with a lot of exposure to the reef.",
      "Reef break de clase mundial, tubos largos y perfectos, pero con mucha exposición al arrecife.",
      "Reef break de classe mundial, tubos longos e perfeitos, mas com muita exposição ao recife."
    ),
  },
  {
    id: 19,
    tier: "pro",
    name: loc("Teahupo'o"),
    country: loc("Tahiti", "Tahití", "Taiti"),
    flag: "🇵🇫",
    place: loc("Tahiti", "Tahití", "Taiti"),
    description: loc(
      "One of the heaviest waves in the world, breaks over a sharp reef with thick, short barrels.",
      "Una de las olas más pesadas del mundo, rompe sobre arrecife filoso con tubos gruesos y cortos.",
      "Uma das ondas mais pesadas do mundo, quebra sobre recife afiado com tubos grossos e curtos."
    ),
  },
  {
    id: 20,
    tier: "pro",
    name: loc("Pipeline"),
    country: loc("Hawaii", "Hawái", "Havaí"),
    flag: "🇺🇸",
    place: loc("Oahu, Hawaii", "Oahu, Hawái", "Oahu, Havaí"),
    description: loc(
      "Extremely hollow and dangerous reef break, shallow coral bottom, the birthplace of tube surfing.",
      "Reef break extremadamente hueco y peligroso, fondo de coral poco profundo, cuna del surf de tubo.",
      "Reef break extremamente oco e perigoso, fundo de coral raso, berço do surf de tubo."
    ),
  },
];

function pick(field, lang) {
  return field?.[lang] ?? field?.en ?? "";
}

export function getWave(id) {
  return WAVES[id - 1] ?? WAVES[0];
}

export function waveName(wave, lang = "en") {
  return pick(wave?.name, lang);
}

export function waveDescription(wave, lang = "en") {
  return pick(wave?.description, lang);
}

export function wavePlace(wave, lang = "en") {
  return pick(wave?.place, lang);
}

export function waveCountry(wave, lang = "en") {
  return pick(wave?.country, lang);
}

export function waveFlag(wave) {
  return wave?.flag ?? "";
}

export function waveTierName(wave, lang = "en") {
  return pick(TIERS[wave?.tier], lang);
}
