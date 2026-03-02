// UIController.js
import { Config } from './Config.js';

export class UIController {
  constructor(gameEngine) {
    this.engine = gameEngine;
    
    // Screens
    this.screens = {
      start: document.getElementById('start-menu'),
      settings: document.getElementById('settings-menu'),
      pause: document.getElementById('pause-menu'),
      gameOver: document.getElementById('game-over-menu')
    };

    // Buttons
    this.btns = {
      play: document.getElementById('btn-play'),
      settings: document.getElementById('btn-settings'),
      saveSettings: document.getElementById('btn-save-settings'),
      resume: document.getElementById('btn-resume'),
      quit: document.getElementById('btn-quit'),
      playAgain: document.getElementById('btn-play-again'),
      menuReturn: document.getElementById('btn-menu-return')
    };

    // Inputs
    this.inputs = {
      difficulty: document.getElementById('difficulty'),
      winScore: document.getElementById('win-score')
    };

    this.initEventListeners();
  }

  hideAllScreens() {
    Object.values(this.screens).forEach(screen => {
      screen.classList.remove('active');
      screen.classList.add('hidden');
    });
  }

  showScreen(screenName) {
    this.hideAllScreens();
    if (this.screens[screenName]) {
      this.screens[screenName].classList.remove('hidden');
      this.screens[screenName].classList.add('active');
    }
  }

  initEventListeners() {
    // Start Menu
    this.btns.play.addEventListener('click', () => {
      this.hideAllScreens();
      this.engine.start();
    });

    this.btns.settings.addEventListener('click', () => {
      this.showScreen('settings');
    });

    // Settings Menu
    this.btns.saveSettings.addEventListener('click', () => {
      this.applySettings();
      this.showScreen('start');
    });

    // Pause Menu
    this.btns.resume.addEventListener('click', () => {
      this.hideAllScreens();
      this.engine.resume();
    });

    this.btns.quit.addEventListener('click', () => {
      this.engine.stop();
      this.showScreen('start');
    });

    // Game Over Menu
    this.btns.playAgain.addEventListener('click', () => {
      this.hideAllScreens();
      this.engine.start();
    });

    this.btns.menuReturn.addEventListener('click', () => {
      this.showScreen('start');
    });

    // Escape listener for Pause
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.screens.start.classList.contains('active') || 
            this.screens.settings.classList.contains('active') ||
            this.screens.gameOver.classList.contains('active')) {
          return; // Don't pause on menus
        }
        
        if (this.engine.isPaused) {
          this.hideAllScreens();
          this.engine.resume();
        } else {
          this.engine.pause();
          this.showScreen('pause');
        }
      }
    });

    // Game Over callback from Engine
    this.engine.ui.onGameOver = (winner) => {
      document.getElementById('winner-text').innerText = `${winner} Wins!`;
      this.showScreen('gameOver');
    };
  }

  applySettings() {
    const scoreText = this.inputs.winScore.value;
    Config.winningScore = parseInt(scoreText) || 7;

    const diff = this.inputs.difficulty.value;
    switch(diff) {
      case 'easy':
        this.engine.computerSpeed = 1.5;
        break;
      case 'normal':
        this.engine.computerSpeed = 3;
        break;
      case 'hard':
        this.engine.computerSpeed = 4.5;
        break;
      case 'impossible':
        this.engine.computerSpeed = 7;
        break;
    }
  }
}
