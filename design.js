"use strict";

class CharacterDesigner {
  constructor() {
    this.canvas = document.getElementById("design-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.colorPicker = document.getElementById("colorPicker");
    this.eyeSize = document.getElementById("eyeSize");
    this.mouthSize = document.getElementById("mouthSize");
    this.startButton = document.getElementById("startGame");
    
    this.pacmanDesign = {
      color: "#ffff00",
      eyeSize: 12,
      mouthSize: 35
    };
    
    this.init();
  }
  
  init() {
    this.colorPicker.addEventListener("input", () => {
      this.pacmanDesign.color = this.colorPicker.value;
      this.drawPacman();
    });
    
    this.eyeSize.addEventListener("input", () => {
      this.pacmanDesign.eyeSize = parseInt(this.eyeSize.value);
      this.drawPacman();
    });
    
    this.mouthSize.addEventListener("input", () => {
      this.pacmanDesign.mouthSize = parseInt(this.mouthSize.value);
      this.drawPacman();
    });
    
    this.startButton.addEventListener("click", () => {
      localStorage.setItem('pacmanDesign', JSON.stringify(this.pacmanDesign));
      window.location.href = "maze.html";
    });
    
    this.drawPacman();
  }
  
  drawPacman() {
  const ctx = this.ctx;
  const centerX = this.canvas.width / 2;
  const centerY = this.canvas.height / 2;

  const radius = 120; // bigger Pac-Man

  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  // Body
  ctx.fillStyle = this.pacmanDesign.color;
  ctx.beginPath();
  const mouthAngle = (this.pacmanDesign.mouthSize / 180) * Math.PI;
  ctx.arc(centerX, centerY, radius, mouthAngle, 2 * Math.PI - mouthAngle);
  ctx.lineTo(centerX, centerY);
  ctx.fill();

  // Eye
  const eyeOffsetX = radius * 0.15;
  const eyeOffsetY = radius * 0.25;
  const eyeRadius = this.pacmanDesign.eyeSize * (radius / 80);

  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(centerX + eyeOffsetX, centerY - eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
  ctx.fill();

  // Label
  ctx.fillStyle = "#000";
  ctx.font = "14px Arial";
  ctx.fillText("Your Pac-Man Design", centerX - 50, centerY + radius + 30);
}


}

window.addEventListener('load', () => new CharacterDesigner());
