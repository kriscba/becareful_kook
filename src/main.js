import "./style.css";
import { Game } from "./game/Game.js";
import { ensureFreshBuild } from "./version.js";

ensureFreshBuild();

const game = new Game(document.getElementById("game"));
game.init();
window.game = game;
