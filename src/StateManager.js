// StateManager.js
export class StateManager {
  constructor() {
    this.playerScore = 0;
    this.computerScore = 0;
    this.isGameOver = true;
    this.isNewGame = true;
    this.winner = null;
  }

  resetGame() {
    this.isGameOver = false;
    this.isNewGame = false;
    this.playerScore = 0;
    this.computerScore = 0;
    this.winner = null;
  }

  playerScored() {
    this.playerScore++;
  }

  computerScored() {
    this.computerScore++;
  }

  setGameOver(winner) {
    this.isGameOver = true;
    this.winner = winner;
  }
}
