function setup() {
    createCanvas(windowWidth, windowHeight);
    noLoop(); // Only draw once
    generateArt();
  }
  
  function generateArt() {
    background(255);
    let centerX = width / 2;
    let centerY = height / 2;
    let maxRadius = min(width, height) * 0.4;
  
    for (let r = maxRadius; r > 0; r -= 20) {
      fill(random(255), random(255), random(255), 180);
      noStroke();
      ellipse(centerX, centerY, r * 2);
    }
  }
  
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    generateArt(); // regenerate on resize
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("saveBtn").addEventListener("click", () => {
      saveCanvas("myGenerativeArt", "png");
    });
  });
  