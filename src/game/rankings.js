export const RANKING_TOP = 5;

const GLOBAL_KEYS = new Set(["global", "world", "worldwide", "global_rank", "ranking_global"]);

const TYPE_LABEL_KEYS = {
  weekly: "goRankingWeekly",
  week: "goRankingWeekly",
  friends: "goRankingFriends",
  friend: "goRankingFriends",
  monthly: "goRankingMonthly",
  month: "goRankingMonthly",
  country: "goRankingCountry",
  national: "goRankingCountry",
  local: "goRankingLocal",
};

function finiteInt(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function text(value) {
  if (value == null) return "";
  return String(value).trim();
}

function localizedText(value, lang) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return text(value[lang] || value.en || value.es || value.pt || value.name || value.title);
  }
  return text(value);
}

function rankingKey(ranking) {
  return text(ranking?.type ?? ranking?.scope ?? ranking?.kind ?? ranking?.slug ?? ranking?.id).toLowerCase();
}

export function isGlobalRanking(ranking) {
  return GLOBAL_KEYS.has(rankingKey(ranking));
}

function listRawRankings(payload) {
  const raw = payload?.rankings ?? payload?.leaderboards ?? payload?.boards;
  if (Array.isArray(raw)) return raw.filter((item) => item && typeof item === "object");
  if (raw && typeof raw === "object") {
    return Object.entries(raw).map(([key, value]) => {
      if (value && typeof value === "object") return { type: key, id: key, ...value };
      return { type: key, id: key, player_rank: value };
    });
  }
  return [];
}

function listEntries(ranking) {
  const raw = ranking?.entries ?? ranking?.top ?? ranking?.players ?? ranking?.rows ?? ranking?.leaderboard;
  return Array.isArray(raw) ? raw.filter((item) => item && typeof item === "object") : [];
}

function parseEntry(raw, index, playerName) {
  const rank = finiteInt(raw.rank ?? raw.position ?? raw.place ?? index + 1);
  const name = text(raw.name ?? raw.username ?? raw.display_name ?? raw.nickname ?? raw.player);
  const score = finiteInt(raw.score ?? raw.points ?? raw.value ?? raw.best_score) ?? 0;
  const flagged = Boolean(raw.is_player ?? raw.is_me ?? raw.me ?? raw.you ?? raw.current ?? raw.self);
  const named = playerName && name && name.toLowerCase() === playerName.toLowerCase();
  return {
    rank: rank != null && rank >= 1 ? rank : index + 1,
    name,
    score,
    isPlayer: flagged || named,
  };
}

function playerFromRanking(ranking, fallbackName, fallbackScore) {
  const raw = ranking.player ?? ranking.me ?? ranking.current_player;
  const fromRaw = raw && typeof raw === "object" ? parseEntry(raw, 0, fallbackName) : null;
  const rank = finiteInt(ranking.player_rank ?? ranking.rank ?? ranking.position ?? fromRaw?.rank);
  if (rank == null || rank < 1) {
    if (fromRaw?.isPlayer || fromRaw?.name) return { ...fromRaw, isPlayer: true };
    return null;
  }
  return {
    rank,
    name: fromRaw?.name || fallbackName,
    score: fromRaw?.score ?? fallbackScore ?? 0,
    isPlayer: true,
  };
}

function mergePlayer(player, entries) {
  const fromEntries = entries.find(
    (entry) => entry.isPlayer || (player != null && entry.rank === player.rank)
  );
  if (!player) return fromEntries || null;
  if (!fromEntries) return player;
  return {
    rank: player.rank || fromEntries.rank,
    name: fromEntries.name || player.name,
    score: fromEntries.score ?? player.score,
    isPlayer: true,
  };
}

function parseRanking(raw, playerName, fallbackScore) {
  const entries = listEntries(raw)
    .map((entry, index) => parseEntry(entry, index, playerName))
    .sort((a, b) => a.rank - b.rank);
  const player = mergePlayer(playerFromRanking(raw, playerName, fallbackScore), entries);
  const top = entries.slice(0, RANKING_TOP).map((entry) => ({
    ...entry,
    isPlayer: entry.isPlayer || (player != null && entry.rank === player.rank),
  }));
  const includedFlag = raw.included ?? raw.player_included ?? raw.has_player;
  const inTop = top.some((entry) => entry.isPlayer);
  const inEntries = entries.some((entry) => entry.isPlayer || (player != null && entry.rank === player.rank));
  const included =
    includedFlag === false ? false : includedFlag === true || player != null || inTop || inEntries;

  return {
    id: raw.id ?? raw.slug ?? rankingKey(raw) ?? "",
    type: rankingKey(raw),
    name: raw.name ?? raw.title ?? raw.label ?? "",
    included,
    top,
    player: player || top.find((entry) => entry.isPlayer) || null,
  };
}

export function rankingTitle(ranking, lang, translate) {
  const named = localizedText(ranking.name, lang);
  if (named) return named;
  const key = TYPE_LABEL_KEYS[ranking.type];
  if (key) return translate(lang, key);
  return translate(lang, "goRanking");
}

export function rankingRows(ranking, youLabel) {
  const top = ranking.top.map((entry) => ({
    ...entry,
    name: entry.name || (entry.isPlayer ? youLabel : ""),
  }));
  const player = ranking.player
    ? { ...ranking.player, name: ranking.player.name || youLabel, isPlayer: true }
    : null;
  const inTop = player ? top.some((entry) => entry.rank === player.rank || entry.isPlayer) : top.some((entry) => entry.isPlayer);
  return {
    top,
    showGap: Boolean(player && !inTop),
    player: player && !inTop ? player : null,
  };
}

export function parseHubRanking(payload, session = null) {
  const score = finiteInt(payload?.score);
  const bestScore = finiteInt(payload?.best_score);
  const playerName = text(
    payload?.player_name ??
      payload?.username ??
      payload?.nickname ??
      session?.name ??
      session?.username ??
      session?.nickname ??
      session?.player_name
  );
  const fallbackScore = score ?? bestScore ?? 0;
  const rankings = listRawRankings(payload).map((raw) => parseRanking(raw, playerName, fallbackScore));

  let globalRank = finiteInt(payload?.global_rank);
  if (globalRank == null || globalRank < 1) {
    const global = rankings.find((ranking) => isGlobalRanking(ranking) && ranking.player?.rank >= 1);
    globalRank = global?.player?.rank ?? null;
  }
  if (globalRank != null && globalRank < 1) globalRank = null;

  const tables = rankings.filter(
    (ranking) =>
      ranking.included && !isGlobalRanking(ranking) && (ranking.top.length > 0 || ranking.player)
  );

  if (globalRank == null && tables.length === 0) return null;

  return {
    globalRank,
    tables,
  };
}
