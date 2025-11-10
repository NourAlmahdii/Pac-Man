class MovementController {
  constructor(game) {
    this.game = game;
    this.pac = game.pac;
    this.pendingDir = { x: 0, y: 0 }; // store a pending direction
    this.setupControls();
  }

  setupControls() {
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp":    this.setPending(0, 1); break;
        case "ArrowDown":  this.setPending(0, -1); break;
        case "ArrowLeft":  this.setPending(-1, 0); break;
        case "ArrowRight": this.setPending(1, 0); break;
      }
    });
  }

  setPending(dx, dy) {
    this.pendingDir = { x: dx, y: dy };
  }

  // Call this every frame from MazeGame.render()
  tryTurn() {
    const pac = this.pac;
    const pend = this.pendingDir;

    if (pend.x === 0 && pend.y === 0) return; // no pending turn

    const tryX = pac.x + pend.x * pac.r * 1.5;
    const tryY = pac.y + pend.y * pac.r * 1.5;

    // Only turn if space is free
    if (!this.game.collidesAt(tryX, tryY, pac.r)) {
      pac.dirX = pend.x;
      pac.dirY = pend.y;
      this.pendingDir = { x: 0, y: 0 }; // clear pending
    }
  }
}
