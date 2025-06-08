let colors = [
  /*"#8eb1c7", // soft blue
  "#b02e0c", // dark red
  "#eb4511", // bright orange-red
  "#c1bfb5", // light gray
  "#fefdff", // near white
  "#595f72", // dark blue-gray
  "#575d90", // purple-blue
  "#84a07c", // sage green
  "#c3d350", // lime green
  "#e6f14a", // bright yellow-green
  "#541388", // deep purple
  "#d90368", // magenta
  "#f1e9da", // cream
  "#2e294e", // dark purple
  "#ffd400"  // golden yellow*/
  '#ffc500',
  '#5dffea',
  '#ff4e52',
  '#c589fc',
  '#83c6f7',
  '#ff6a00',
  '#fefdff' // near white
];

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    noLoop(); // Only draw once
    generateArt();
}
  
function generateArt() {
    background(255);
    stroke('#333333');
  
    let size = 32.0;
    let n = int(width / size)-1;
    let m = int(height / size)-1;
    
    let start_x = 0.0;
    let start_y = 0.0;
  
    let ramt_offset = 3.55 + random() * 62.25;
    let damt_offset = 0.01 + random() * 2.02;
    
    for (let i = 0; i < m; i++) {
      if (random() > 0.96)
        continue;
        
      for (let j = 0; j < n; j++) {
        if (random() > 0.92)
          continue;
        
        let pm_rot = random() < 0.5 ? -1 : 1;
        let pm_dis = random() < 0.5 ? -1 : 1;
        
        let ramt = (m - i) / size * PI / 180.0 * pm_rot * random() * ramt_offset;
        let damt = i / size * pm_dis * random() * damt_offset;

        let px = size + (size * j) + damt;
        let py = size + (size * i);
        
        //rect(px, py, size, size);
        
        push(); // Save current transformation state
        translate(px, py); // Move to position
        rotate(ramt); // Apply rotation

        // Draw rectangle centered at origin (since we translated)
        rectMode(CENTER);
        
        // shadow
        if (random() <= 0.45) {
          noStroke();
          fill(color(0.0, 0.0, 0.0, random(0.05, 0.15) * 255));
          rect(random() * 5, random() * 5, size, size);
        }
        
        // Set fill color with conditional logic
        if (random() <= 0.35) {
          fill(colors[floor(random(colors.length))]);
        } else {
          noFill(); // equivalent to transparent
        }
        
        // Set stroke properties
        stroke('#333333');
        strokeWeight(random(0.34, 1.76));
        rect(0, 0, size, size);
        
        /*// add a little one in case
        if (random() >= 0.97) {
          stroke(color(0, 0, 0, random(0.1, 0.8) * 255));
          noFill();
          rect(8+random() * 25, 8+random() * 25, 8, 8);
        }*/

        pop();
      }
    }
}
 
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateArt(); // regenerate on resize
}

/*document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("saveBtn").addEventListener("click", () => {
    saveCanvas("limen-imnotprovable-uno", "png");
  });
});*/

function setupSaveButton() {
    const saveBtn = document.getElementById("saveBtn");
    if (saveBtn) {
        saveBtn.onclick = () => {
            saveCanvas("imnotprovable-uno", "png");
        };
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSaveButton);
} else {
    setupSaveButton();
}