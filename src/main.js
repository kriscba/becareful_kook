import "./style.css";
import { Game } from "./game/Game.js";

const game = new Game(document.getElementById("game"));
game.init();
window.game = game;
