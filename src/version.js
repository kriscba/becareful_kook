const RELOAD_KEY = "kook-reload-v";

export function ensureFreshBuild() {
  const baked = typeof __APP_VERSION__ === "string" ? __APP_VERSION__ : "";
  if (!baked) return Promise.resolve();

  return fetch(`./version.json?t=${Date.now()}`, { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const remote = data?.v != null ? String(data.v) : "";
      if (!remote || remote === baked) {
        sessionStorage.removeItem(RELOAD_KEY);
        return;
      }
      if (sessionStorage.getItem(RELOAD_KEY) === remote) return;
      sessionStorage.setItem(RELOAD_KEY, remote);
      const url = new URL(location.href);
      url.searchParams.set("_v", remote);
      location.replace(url.toString());
    })
    .catch(() => {});
}
