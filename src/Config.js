// Config.js
export const Config = {
  // Canvas Dimensions
  width: 500,
  height: 700,
  
  // Ball
  ballRadius: 10,
  initialBallSpeedY: -3,

  // Paddle
  paddleHeight: 12,
  paddleWidth: 100,
  paddleDiff: 50, // Distance from edge

  // Game Settings
  winningScore: 7,

  // Mobile Detection
  isMobile: window.matchMedia('(max-width: 600px)').matches,

  // Speeds based on device
  get speeds() {
    return this.isMobile
      ? { speedY: -2, computerSpeed: 4 }
      : { speedY: -1, computerSpeed: 3 };
  },

  // Colors
  colors: {
    backgroundTop: '#000428',
    backgroundMid: '#004e92',
    backgroundBottom: '#000428',
    paddle: '#0ff',
    ball: '#ff00ff',
    centerLine: '#ffffff88',
    text: '#fff'
  }
};
