// Helper function to convert hex color to RGB
function hex2rgb(hex) {
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return [r, g, b];
}

// Global variables
let colors = [];
let hasDrawn = false;
let frameCounter = 0;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight, P2D);
    
    // Initialize color palette
    const colorHexes = [
        "6c9a8b", "e8998d", "eed2cc", "fbf7f4", "a1683a",
        "f18f01", "048ba8", "2e4057", "99c24d"
    ];
    
    colors = colorHexes.map(hex => hex2rgb(hex));
    
    // Set up drawing properties
    noSmooth();
    noLoop(); // We only want to draw once like the original
    generateArt();
}

function generateArt() {
    background(33);

    const winX = windowWidth;
    const winY = windowHeight;
    const size = 33.0;
    const offset = 0.0;
    /*const startX = -(winX / 2.0) - (size / 2.0) + 2.5 + (2.0 * size);
    const startY = winY / 2.0 + (size / 2.0) - 2.5 - (2.5 * size);*/
    const startX = -(winX / 2.0) + (size * 1.5);
    const startY = winY / 2.0 - (size * 1.5);

    let ssize = size - offset;
    let m = int(winX / size) - 1;
    let n = int(winY / size) - 2;

    console.log(n);
    console.log(m);
    
    // Create grid positions
    let positions = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            positions.push([i, j]);
        }
    }
    
    // Create array of active indices
    let stillActive = [];
    for (let k = 0; k < positions.length; k++) {
        stillActive.push(k);
    }
    
    let nextElement = Math.floor(random(stillActive.length));
    
    // Main drawing loop
    while (stillActive.length > 0) {
        const [i, j] = positions[stillActive[nextElement]];
        stillActive.splice(nextElement, 1);
        
        const px = startX + (size * j) + (offset * j);
        const py = startY - (size * i) - (offset * i);
        
        // Convert coordinates from Nannou's center-origin to p5.js's top-left origin
        const canvasPx = px + winX / 2.0;
        const canvasPy = -py + winY / 2.0;
        
        const strokeC = colors[Math.floor(random(colors.length))];
        let strokeW = random(0.1, 18.35);
        
        if (random() > 0.05) {
            if (random() < 0.001)
                strokeW = 24.21;

            let currSize = size;
            if (random() < 0.25) {
                currSize = size - (size * random(0.15, 0.65));
            }
            
            let currPx = canvasPx;
            let currPy = canvasPy;
            
            if (random() < 0.15) {
                currPx += random(-5, 5);
                currPy += random(-5, 5);
            }
            
            if (random() >= 0.05) {
                // Draw transparent circle with colored stroke
                fill(255, 255, 255, 0); // transparent fill
                stroke(strokeC[0], strokeC[1], strokeC[2]);
                strokeWeight(strokeW);
                ellipse(currPx, currPy, currSize, currSize);
            } else {
                // Draw filled circle with dark stroke
                fill(strokeC[0], strokeC[1], strokeC[2]);
                stroke(51, 51, 51); // #333333 converted to RGB
                strokeWeight(strokeW);
                ellipse(currPx, currPy, currSize, currSize);
            }
        }
        
        if (stillActive.length > 0) {
            nextElement = Math.floor(random(stillActive.length));
        } else {
            break;
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