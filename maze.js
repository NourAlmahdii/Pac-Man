"use strict";

class MazeGame {
  constructor(webglSetup) {
    this.webgl = webglSetup;
    this.gl = webglSetup.gl;
    this.program = webglSetup.program;
    this.posLoc = webglSetup.posLoc;
    this.uColor = webglSetup.uColor;
    this.buffer = webglSetup.buffer;
    this.canvas = webglSetup.canvas;
    
    // HTML elements
    this.scoreEl = document.getElementById("score");
    this.dotsLeftEl = document.getElementById("dotsLeft");
    this.backButton = document.getElementById("backToDesign");
    this.winMessage = document.getElementById("winMessage");
    this.finalScoreEl = document.getElementById("finalScore");
    this.playAgainButton = document.getElementById("playAgain");
    
    
    // Game state
    this.gameActive = true;
    
    // Load Pac-Man design from storage
    this.pacmanDesign = JSON.parse(localStorage.getItem('pacmanDesign')) || {
      color: "#ffff00",
      eyeSize: 12,
      mouthSize: 35
    };
    
    // Convert hex color to RGB
    this.pacmanColor = this.hexToRgb(this.pacmanDesign.color);
    
    this.init();
  }
  
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 1, g: 0.9, b: 0 };
  }
  
  init() {
    // Grid size
    this.cols = 40;
    this.rows = 20;
    this.cellW = 2 / this.cols;
    this.cellH = 2 / this.rows;

    // Maze grid: 1 = wall, 0 = path
    this.grid = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

    this.wallVertices = this.buildWalls();
    this.wallVertexCount = this.wallVertices.length / 2;

    // Pac-Man initial state
    this.pac = {
      x: -0.8, y: 0.05,
      r: Math.min(this.cellW, this.cellH) * 0.48,
      speed: 0.0050,
      dirX: 0, dirY: 0,
      mouth: 0.35, mouthDir: 1
    };

    this.movement = new MovementController(this);

    this.dots = this.generateDots();
    this.score = 0;
    this.scoreEl.textContent = this.score;
    this.updateDotsLeft();

    //this.setupControls();
    this.backButton.addEventListener("click", () => {
      window.location.href = "design.html";
    });

    this.playAgainButton.addEventListener("click", () => {
      this.resetGame();
    });

    this.render();
  }

  // Count remaining dots
  getRemainingDots() {
    return this.dots.filter(dot => dot.alive).length;
  }

  // Update dots left display
  updateDotsLeft() {
    const remaining = this.getRemainingDots();
    // Add null check to prevent errors
    if (this.dotsLeftEl) {
      this.dotsLeftEl.textContent = remaining;
    }
  }

  // Check win condition
  checkWinCondition() {
    const remainingDots = this.getRemainingDots();
    if (remainingDots === 0 && this.gameActive) {
      this.gameActive = false;
      this.showWinMessage();
    }
  }

  // Show winning message
  showWinMessage() {
    if (this.finalScoreEl) {
      this.finalScoreEl.textContent = this.score;
    }
    if (this.winMessage) {
      this.winMessage.style.display = 'block';
    }
    
    // Add simple celebration - just show the message
    console.log("🎉 Congratulations! You collected all dots! 🎉");
  }

  // Reset game to play again
  resetGame() {
    if (this.winMessage) {
      this.winMessage.style.display = 'none';
    }
    this.gameActive = true;
    this.score = 0;
    if (this.scoreEl) {
      this.scoreEl.textContent = this.score;
    }
    
    // Reset Pac-Man position
    this.pac.x = -0.8;
    this.pac.y = 0.0;
    this.pac.dirX = 0;
    this.pac.dirY = 0;
    
    // Regenerate dots
    this.dots = this.generateDots();
    this.updateDotsLeft();
  }

  buildWalls() {
    const wallPaddingX = this.cellW * 0.0001;
    const wallPaddingY = this.cellH * 0.0001;
    let wallVertices = [];
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === 1) {
          const left = -1 + c * this.cellW + wallPaddingX;
          const right = -1 + (c+1) * this.cellW - wallPaddingX;
          const top = 1 - r * this.cellH - wallPaddingY;
          const bottom = 1 - (r+1) * this.cellH + wallPaddingY;
          wallVertices.push(...this.rectVerts(left, bottom, right, top));
        }
      }
    }
    return new Float32Array(wallVertices);
  }

  rectVerts(x1, y1, x2, y2) {
    return [ x1,y1,  x2,y1,  x1,y2,  x1,y2,  x2,y1,  x2,y2 ];
  }

  generateDots() {
    const dots = [];
    const dotRadius = 0.02;
    const dotSpawnChance = 0.15;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === 0 && Math.random() < dotSpawnChance) {
          const x = (c / this.cols) * 2 - 1 + (1 / this.cols);
          const y = 1 - (r / this.rows) * 2 - (1 / this.rows);
          dots.push({ x, y, alive: true });
        }
      }
    }
    return dots;
  }

  

  cellRect(c, r) {
    const left = -1 + c * this.cellW;
    const right = -1 + (c+1) * this.cellW;
    const top = 1 - r * this.cellH;
    const bottom = 1 - (r+1) * this.cellH;
    return { left, right, top, bottom };
  }

  circleRectIntersect(cx, cy, radius, rect) {
    const closestX = Math.max(rect.left, Math.min(cx, rect.right));
    const closestY = Math.max(rect.bottom, Math.min(cy, rect.top));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return (dx*dx + dy*dy) < (radius*radius - 1e-9);
  }

  collidesAt(x, y, radius) {
    const minC = Math.max(0, Math.floor((x + 1) / this.cellW) - 2);
    const maxC = Math.min(this.cols-1, Math.floor((x + 1) / this.cellW) + 2);
    const minR = Math.max(0, Math.floor((1 - y) / this.cellH) - 2);
    const maxR = Math.min(this.rows-1, Math.floor((1 - y) / this.cellH) + 2);
    
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        if (this.grid[r][c] === 1) {
          let rect = this.cellRect(c, r);
          const padX = this.cellW * 0.02, padY = this.cellH * 0.02;
          const rectP = { 
            left: rect.left + padX, 
            right: rect.right - padX, 
            top: rect.top - padY, 
            bottom: rect.bottom + padY 
          };
          if (this.circleRectIntersect(x, y, radius, rectP)) return true;
        }
      }
    }
    return false;
  }

  createCircleFan(cx, cy, r, segments, start = 0, end = 2 * Math.PI) {
    const verts = [cx, cy];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const a = start + t * (end - start);
      verts.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    return new Float32Array(verts);
  }

  drawWalls() {
    const gl = this.gl;
    gl.bufferData(gl.ARRAY_BUFFER, this.wallVertices, gl.STATIC_DRAW);
    gl.uniform4f(this.uColor, 0.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, this.wallVertexCount);
  }

  drawDot(dot) {
    const gl = this.gl;
    const fan = this.createCircleFan(dot.x, dot.y, 0.01, 20);
    gl.bufferData(gl.ARRAY_BUFFER, fan, gl.STATIC_DRAW);
    gl.uniform4f(this.uColor, 1.0, 0.0, 0.0, 1.0); // Red dots
    gl.drawArrays(gl.TRIANGLE_FAN, 0, fan.length/2);
  }

  drawPac() {
    const gl = this.gl;
    const pac = this.pac;

    let face = 0; 
    if (pac.dirX !== 0 || pac.dirY !== 0) {
      face = Math.atan2(pac.dirY, pac.dirX);
    }

    // Mouth / body
    const start = face + pac.mouth / 2;
    const end = face - pac.mouth / 2 + 2 * Math.PI;
    const fan = this.createCircleFan(pac.x, pac.y, pac.r, 36, start, end);

    gl.bufferData(gl.ARRAY_BUFFER, fan, gl.STATIC_DRAW);
    gl.uniform4f(this.uColor, this.pacmanColor.r, this.pacmanColor.g, this.pacmanColor.b, 1.0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, fan.length / 2);

    // Eye
    const eyeOffset = { 
      x: Math.cos(face) * pac.r * 0.25 - Math.sin(face) * pac.r * 0.15,
      y: Math.sin(face) * pac.r * 0.25 + Math.cos(face) * pac.r * 0.15
    };
    const eyeSize = (this.pacmanDesign.eyeSize / 12) * (pac.r * 0.1);
    const eye = this.createCircleFan(pac.x + eyeOffset.x, pac.y + eyeOffset.y, eyeSize, 14);

    gl.bufferData(gl.ARRAY_BUFFER, eye, gl.STATIC_DRAW);
    gl.uniform4f(this.uColor, 0.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, eye.length / 2);
  }


  render() {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.drawWalls();

    if (this.movement) this.movement.tryTurn(); 

    // Only update game if it's active
    if (this.gameActive) {
      // Update mouth animation
      this.pac.mouth += 0.035 * this.pac.mouthDir;
      if (this.pac.mouth > 0.9) this.pac.mouthDir = -1;
      if (this.pac.mouth < 0.18) this.pac.mouthDir = 1;

      // Movement (aspect-corrected)
      let vx = this.pac.dirX;
      let vy = this.pac.dirY;
      if (vx !== 0 || vy !== 0) {
        const len = Math.hypot(vx, vy);
        vx = (vx / len) * this.pac.speed;
        vy = (vy / len) * this.pac.speed * (this.canvas.width / this.canvas.height);

        vy *= this.cols / this.rows *0.75; // Adjust for grid aspect ratio
      }


      // Axis-separated movement for sliding
      const tryX = this.pac.x + vx;
      if (!this.collidesAt(tryX, this.pac.y, this.pac.r)) this.pac.x = tryX;
      const tryY = this.pac.y + vy;
      if (!this.collidesAt(this.pac.x, tryY, this.pac.r)) this.pac.y = tryY;

      // Draw and check dots
      for (let i = 0; i < this.dots.length; i++) {
        const d = this.dots[i];
        if (!d.alive) continue;
        
        const dx = this.pac.x - d.x;
        const dy = this.pac.y - d.y;
        const dist2 = dx*dx + dy*dy;
        const eatDist = (this.pac.r * 0.9 + 0.02);
        
        if (dist2 < eatDist * eatDist) {
          d.alive = false;
          this.score += 5;
          if (this.scoreEl) {
            this.scoreEl.textContent = this.score;
          }
          this.updateDotsLeft();
          this.checkWinCondition(); // Check if all dots are collected
          continue;
        }
        this.drawDot(d);
      }
    }

    this.drawPac();
    requestAnimationFrame(() => this.render());
  }
}