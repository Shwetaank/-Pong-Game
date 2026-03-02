// Paddle.js
import { Config } from './Config.js';

export class Paddle {
  constructor(isPlayer = false) {
    this.width = Config.paddleWidth;
    this.height = Config.paddleHeight;
    this.x = Config.width / 2 - this.width / 2; // Start centered
    
    // Y position depends on if it's player (bottom) or computer (top)
    this.y = isPlayer ? Config.height - 20 : 10;
    this.isPlayer = isPlayer;
  }

  draw(context) {
    context.fillStyle = Config.colors.paddle;
    context.shadowColor = Config.colors.paddle;
    context.shadowBlur = 20;

    context.fillRect(this.x, this.y, this.width, this.height);
    
    // Reset shadow
    context.shadowBlur = 0;
  }

  updateAI(ballX, computerSpeed, playerMoved) {
    if (this.isPlayer || !playerMoved) return;

    // Follow the ball horizontally, considering the center of the paddle
    if (this.x + this.width / 2 < ballX) {
      this.x += computerSpeed;
    } else {
      this.x -= computerSpeed;
    }

    // Keep computer paddle within bounds
     this.x = Math.max(0, Math.min(Config.width - this.width, this.x));
  }
}
