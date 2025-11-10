"use strict";

class WebGLSetup {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.gl = this.canvas.getContext("webgl");
    
    if (!this.gl) {
      alert("WebGL not supported");
      return;
    }
    
    this.initShaders();
    this.setupBuffers();
    
    // Start the game once WebGL is ready
    new MazeGame(this);

  MazeGame.setInstance(mazeGame);
  }
  
  compileShader(id, type) {
    const src = document.getElementById(id).text;
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, src);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error("Shader compile:", this.gl.getShaderInfoLog(shader));
    }
    return shader;
  }
  
  initShaders() {
    const vsh = this.compileShader("vertex-shader", this.gl.VERTEX_SHADER);
    const fsh = this.compileShader("fragment-shader", this.gl.FRAGMENT_SHADER);
    
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vsh);
    this.gl.attachShader(this.program, fsh);
    this.gl.linkProgram(this.program);
    this.gl.useProgram(this.program);
    
    this.posLoc = this.gl.getAttribLocation(this.program, "aPosition");
    this.uColor = this.gl.getUniformLocation(this.program, "uColor");
  }
  
  setupBuffers() {
    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.vertexAttribPointer(this.posLoc, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.posLoc);
    
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(1, 1, 1, 1);
  }
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
  new WebGLSetup();
});