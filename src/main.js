// main.js
import { Config } from './Config.js';
import { GameEngine } from './GameEngine.js';
import { InputHandler } from './InputHandler.js';
import { UIController } from './UIController.js';

const container = document.getElementById('game-container');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = Config.width;
canvas.height = Config.height;
container.appendChild(canvas);

let engine;
let inputHandler;
let ui;

function init() {
  // 1. Setup Game Engine
  engine = new GameEngine(canvas, context, {
    // Empty object, UIController handles the event now
  });

  // 2. Setup Controls
  inputHandler = new InputHandler(canvas, engine.playerPaddle);
  engine.inputHandler = inputHandler; // Link back to engine so it can run update()

  // 3. Render initial empty board so background isn't black behind menus
  engine.render();

  // 4. Setup UI Overlay System
  ui = new UIController(engine);
  // Engine needs to trigger UI Game Over specifically
  engine.ui.onGameOver = ui.engine.ui.onGameOver; // Point reference back to UI handler
}

// Start setup
init();
