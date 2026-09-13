import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--window-size=1400,900", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 1 });
await page.goto("http://localhost:5173/", { waitUntil: "networkidle0", timeout: 20000 });
await page.waitForFunction(() => window.game, { timeout: 10000 });
await page.evaluate(() => {
  const game = window.game;
  game.start();
  game.timeScale = 0;
  game.player.mesh.visible = false;
  document.querySelectorAll(".overlay").forEach((el) => el.classList.add("hidden"));
  game.spawner.reset();
  game.spawner.spawnNow("shark", 0);
  const item = game.spawner.items.find((i) => i.type === "shark");
  item.x = 0;
  item.z = -14;
  item.mesh.position.set(0, item.mesh.position.y, -14);
});
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: "shark-preview-play.png" });

await page.evaluate(() => {
  const game = window.game;
  const item = game.spawner.items.find((i) => i.type === "shark");
  item.z = -6;
  item.mesh.position.z = -6;
  game.camera.position.set(0.4, 2.4, 2.2);
  game.camera.lookAt(0, 0.7, -6);
});
await new Promise((r) => setTimeout(r, 200));
await page.screenshot({ path: "shark-preview-close.png" });
await browser.close();
console.log("ok");
