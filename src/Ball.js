// Ball.js
import { Config } from './Config.js';

export class Ball {
  constructor() {
    this.radius = Config.ballRadius;
    this.reset();
  }

  reset() {
    this.x = Config.width / 2;
    this.y = Config.height / 2;
    this.speedY = Config.initialBallSpeedY;
    this.speedX = Config.initialBallSpeedY; 
    
    // Initial trajectory should be straight or slightly angled, but speedX starts matches speedY logic in original
    // The original script sets speedX = speedY initially.
    this.trajectoryX = 0;
    this.paddleContact = false;
  }

  move(playerMoved) {
    this.y += -this.speedY; // Negative Y goes UP
    
    if (playerMoved && this.paddleContact) {
      this.x += this.speedX;
    }
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = Config.colors.ball;
    context.shadowColor = Config.colors.ball;
    context.shadowBlur = 25;
    context.fill();
    // Reset shadow to avoid bleeding into other renders if not careful
    context.shadowBlur = 0; 
  }
}
