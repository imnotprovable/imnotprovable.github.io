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
  '#fefdff', // near white
  '#3f3f3f'
];

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight, P2D);
    noSmooth();
    noLoop(); // Only draw once
    generateArt();
}
  
function generateArt() {
    background(255);

    let size = 33;
    let offset = 8;
    let ssize = size - offset;
    let n = int(width / size) - 1;
    let m = int(height / size) - 1;
    
    let bound_fill = random() < 0.075 ? 77 : random(2, 35);
    let bound_stroke = random() < 0.075 ? 65 : random(3, 35);

    let rnd_bound_fill = random(1, bound_fill);
    let rnd_bound_stroke = random(1, bound_stroke);

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            let px = size + (size * j);
            let py = size + (size * i);

            // fill
            fill(random(colors));
            noStroke();
            beginShape(QUADS);
                vertex(px + random(-rnd_bound_fill,rnd_bound_fill), py + random(-rnd_bound_fill,rnd_bound_fill));
                vertex(px + ssize + random(-rnd_bound_fill,rnd_bound_fill), py + random(-rnd_bound_fill,rnd_bound_fill));
                vertex(px + ssize + random(-rnd_bound_fill,rnd_bound_fill), py + ssize + random(-rnd_bound_fill,rnd_bound_fill));
                vertex(px + random(-rnd_bound_fill,rnd_bound_fill), py + ssize + random(-rnd_bound_fill,rnd_bound_fill));
            endShape();
            
            // stroke
            noFill();
            stroke(random([...colors]));
            strokeWeight(0.88 + random() * 1.2);
            beginShape(QUADS);
                vertex(px + random(-rnd_bound_stroke,rnd_bound_stroke), py + random(-rnd_bound_stroke,rnd_bound_stroke));
                vertex(px + ssize + random(-rnd_bound_stroke,rnd_bound_stroke), py + random(-rnd_bound_stroke,rnd_bound_stroke));
                vertex(px + ssize + random(-rnd_bound_stroke,rnd_bound_stroke), py + ssize + random(-rnd_bound_stroke,rnd_bound_stroke));
                vertex(px + random(-rnd_bound_stroke,rnd_bound_stroke), py + ssize + random(-rnd_bound_stroke,rnd_bound_stroke));
            endShape();
        }
    }
}
 
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateArt(); // regenerate on resize
}

/*document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("saveBtn").addEventListener("click", () => {
    saveCanvas("limen-imnotprovable-due", "png");
  });
});*/

function setupSaveButton() {
    const saveBtn = document.getElementById("saveBtn");
    if (saveBtn) {
        saveBtn.onclick = () => {
            saveCanvas("imnotprovable-due", "png");
        };
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSaveButton);
} else {
    setupSaveButton();
}