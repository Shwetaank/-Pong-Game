import { StateManager } from './StateManager.js';
import { Ball } from './Ball.js';
import { Paddle } from './Paddle.js';
import { ParticleEngine } from './ParticleEngine.js';
import { AudioController } from './AudioController.js';
import { Config } from './Config.js';

export class GameEngine {
  constructor(canvas, context, uiCallbacks) {
    this.canvas = canvas;
    this.context = context;
    this.ui = uiCallbacks; // Callbacks to update UI elements like Game Over
    
    this.state = new StateManager();
    this.ball = new Ball();
    this.playerPaddle = new Paddle(true);
    this.computerPaddle = new Paddle(false);
    
    // Phase 3: Enhancements
    this.particles = new ParticleEngine();
    this.audio = new AudioController();
    this.screenShakeTime = 0;
    
    this.speedY = Config.speeds.speedY;
    this.speedX = this.speedY;
    // Overriding ball's initial speeds for the start of game
    this.ball.speedY = this.speedY;
    this.ball.speedX = this.speedX;
    this.computerSpeed = Config.speeds.computerSpeed;
    
    this.playerMoved = false;
    this.isPaused = false;
    this.animationFrameId = null;
    
    // Will be injected by Main
    this.inputHandler = null;
  }

  start() {
    this.state.resetGame();
    this.ball.reset();
    
    // Sync initial speeds again in case of restart
    this.ball.speedY = -3; // Classic starting speed
    this.ball.paddleContact = false;
    
    this.isPaused = false;
    this.loop();
  }
  
  pause() {
      this.isPaused = true;
  }
  
  resume() {
      if (this.isPaused) {
          this.isPaused = false;
          this.loop();
      }
  }
  
  stop() {
      this.isPaused = true;
      if(this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
      }
  }

  loop() {
    if (this.isPaused) return;

    this.render();
    this.update();
    this.checkGameOver();
    
    if (!this.state.isGameOver) {
      this.animationFrameId = requestAnimationFrame(() => this.loop());
    }
  }

  update() {
    if (this.inputHandler) {
       this.inputHandler.update();
       this.playerMoved = this.inputHandler.playerMoved;
    }
    
    // Decay screen shake
    if (this.screenShakeTime > 0) this.screenShakeTime--;

    this.ball.move(this.playerMoved);
    this.checkBoundaries();
    this.computerPaddle.updateAI(this.ball.x, this.computerSpeed, this.playerMoved);
  }

  checkBoundaries() {
    // Left/Right Walls
    if ((this.ball.x < 0 && this.ball.speedX < 0) || (this.ball.x > Config.width && this.ball.speedX > 0)) {
        this.ball.speedX = -this.ball.speedX;
        this.audio.playWallHit();
        this.particles.createExplosion(this.ball.x, this.ball.y, Config.colors.text, 8); // White sparks against wall
    }

    // Bottom Area (Player side)
    if (this.ball.y > Config.height - Config.paddleDiff) {
        // Paddle collision
        if (this.ball.x > this.playerPaddle.x && this.ball.x < this.playerPaddle.x + Config.paddleWidth) {
            this.ball.paddleContact = true;
            this.ball.speedY = -this.ball.speedY;
            
            // Adjust trajectory based on where it hit the paddle
            this.ball.trajectoryX = this.ball.x - (this.playerPaddle.x + (Config.paddleWidth/2));
            this.ball.speedX = this.ball.trajectoryX * 0.3; // Magic number for feel
            
            this.audio.playPaddleHit();
            this.particles.createExplosion(this.ball.x, this.ball.y, Config.colors.paddle, 15);
            
        } else if (this.ball.y > Config.height) { // Scored
            this.ball.reset();
            this.state.computerScored();
            this.audio.playScore();
            this.screenShakeTime = 15;
            this.particles.createExplosion(Config.width / 2, Config.height, Config.colors.ball, 30); // Big explosion on score
        }
    }
    
    // Top Area (Computer side)
    if (this.ball.y < Config.paddleDiff) {
        // Paddle Collision
        if (this.ball.x > this.computerPaddle.x && this.ball.x < this.computerPaddle.x + Config.paddleWidth) {
            this.ball.speedY = -this.ball.speedY;
            this.audio.playPaddleHit();
            this.particles.createExplosion(this.ball.x, this.ball.y, Config.colors.paddle, 15);
            
        } else if (this.ball.y < 0) { // Scored
            this.ball.reset();
            this.state.playerScored();
            this.audio.playScore();
            this.screenShakeTime = 15;
            this.particles.createExplosion(Config.width / 2, 0, Config.colors.ball, 30); // Big explosion on score
        }
    }
  }

  checkGameOver() {
    if (this.state.playerScore === Config.winningScore || this.state.computerScore === Config.winningScore) {
      const winner = this.state.playerScore === Config.winningScore ? 'Player' : 'Computer';
      this.state.setGameOver(winner);
      if (this.ui.onGameOver) this.ui.onGameOver(winner);
    }
  }

  render() {
    this.context.save(); // Save pre-shake state

    // Screen shake logic
    if (this.screenShakeTime > 0) {
      const shakeMagnitude = 5;
      const dx = (Math.random() - 0.5) * shakeMagnitude;
      const dy = (Math.random() - 0.5) * shakeMagnitude;
      this.context.translate(dx, dy);
    }

    // Premium Background Gradient
    const gradient = this.context.createLinearGradient(0, 0, 0, Config.height);
    gradient.addColorStop(0, '#0a0f1e');
    gradient.addColorStop(0.5, '#141d38');
    gradient.addColorStop(1, '#0a0f1e');
    this.context.fillStyle = gradient;
    this.context.fillRect(0, 0, Config.width, Config.height);

    // Grid effect overlaid on background (Subtle SaaS touch)
    this.context.beginPath();
    for (let i = 0; i < Config.width; i += 50) {
      this.context.moveTo(i, 0);
      this.context.lineTo(i, Config.height);
    }
    for (let j = 0; j < Config.height; j += 50) {
      this.context.moveTo(0, j);
      this.context.lineTo(Config.width, j);
    }
    this.context.strokeStyle = 'rgba(255,255,255,0.02)';
    this.context.lineWidth = 1;
    this.context.stroke();

    // Center Line - glowing dashed
    this.context.beginPath();
    this.context.setLineDash([15, 15]);
    this.context.moveTo(0, Config.height / 2);
    this.context.lineTo(Config.width, Config.height / 2);
    this.context.strokeStyle = 'rgba(0, 242, 254, 0.3)';
    this.context.lineWidth = 3;
    this.context.stroke();
    this.context.setLineDash([]); // Reset dash for other drawing

    // Premium Score Display
    this.context.font = '900 64px Inter';
    this.context.textAlign = 'center';
    
    // Player Score (Bottom)
    this.context.fillStyle = 'rgba(0, 242, 254, 0.15)';
    this.context.fillText(this.state.playerScore, Config.width / 2, (Config.height / 2) + 90);
    
    // Computer Score (Top)
    this.context.fillStyle = 'rgba(240, 147, 251, 0.15)';
    this.context.fillText(this.state.computerScore, Config.width / 2, (Config.height / 2) - 40);

    // Entities
    this.playerPaddle.draw(this.context);
    this.computerPaddle.draw(this.context);
    this.ball.draw(this.context);
    
    // Particles
    this.particles.updateAndDraw(this.context);

    this.context.restore(); // Restore pre-shake state to stop GUI elements from jiggling permanently
  }
}
