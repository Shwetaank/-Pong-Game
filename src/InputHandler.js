// InputHandler.js
import { Config } from './Config.js';

export class InputHandler {
  constructor(canvas, paddle) {
    this.canvas = canvas;
    this.paddle = paddle;
    this.playerMoved = false;
    
    // Keyboard State
    this.keys = {
      ArrowLeft: false,
      ArrowRight: false,
      a: false,
      d: false,
      A: false,
      D: false
    };

    // Keyboard speed
    this.keyboardSpeed = 8;
    
    this.initMouse();
    this.initKeyboard();
  }

  initMouse() {
    this.canvas.addEventListener('mousemove', (e) => {
      // Only process mouse if keyboard isn't actively moving it
      if (this.isKeyboardMoving()) return;

      this.playerMoved = true;
      
      const rect = this.canvas.getBoundingClientRect();
      let mouseX = e.clientX - rect.left;
      
      let newX = mouseX - (Config.paddleWidth / 2);
      this.paddle.x = Math.max(0, Math.min(Config.width - Config.paddleWidth, newX));
    });
    
    // Hide cursor when entering canvas
    this.canvas.addEventListener('mouseenter', () => {
        this.canvas.style.cursor = 'none';
    });
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (this.keys.hasOwnProperty(e.key)) {
        this.keys[e.key] = true;
        this.playerMoved = true; // AI should trigger
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.keys.hasOwnProperty(e.key)) {
        this.keys[e.key] = false;
      }
    });
  }

  isKeyboardMoving() {
    return this.keys.ArrowLeft || this.keys.ArrowRight || this.keys.a || this.keys.d || this.keys.A || this.keys.D;
  }

  update() {
    // Check if moving left
    if (this.keys.ArrowLeft || this.keys.a || this.keys.A) {
      let newX = this.paddle.x - this.keyboardSpeed;
      this.paddle.x = Math.max(0, newX);
    }
    
    // Check if moving right
    if (this.keys.ArrowRight || this.keys.d || this.keys.D) {
      let newX = this.paddle.x + this.keyboardSpeed;
      this.paddle.x = Math.min(Config.width - Config.paddleWidth, newX);
    }
  }
}
