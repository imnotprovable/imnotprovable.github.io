// Color palettes
const colorPalettes = {
    cosmicNebula: [
        [229, 77, 204, 179],  // Pink
        [153, 51, 204, 179],  // Purple
        [102, 102, 229, 179], // Blue
        [204, 77, 128, 179],  // Hot pink
        [128, 77, 179, 179]   // Lavender
    ],
    northernLights: [
        [0, 204, 102, 179],   // Teal
        [26, 153, 153, 179],  // Turquoise
        [0, 128, 77, 179],    // Deep green
        [77, 179, 229, 179],  // Sky blue
        [26, 229, 179, 179]   // Bright teal
    ],
    desertSunset: [
        [229, 102, 26, 179],  // Orange
        [229, 153, 26, 179],  // Golden
        [204, 77, 26, 179],   // Burnt orange
        [179, 51, 26, 179],   // Deep red
        [255, 204, 51, 179]   // Yellow
    ]
};

const paletteTypes = {
    COSMIC_NEBULA: 0,
    NORTHERN_LIGHTS: 1,
    DESERT_SUNSET: 2
};

// Configuration
let config = {};

let constellations = [];
let isGenerated = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    let constellationSize = 80.0;
    config = {
        constellationSize: constellationSize,
        gridRows: (windowHeight / constellationSize) - 2,
        gridCols: (windowWidth / constellationSize) - 2,
        gridSpacing: 12.0,
        minStars: 4,
        maxStars: 45,
        minConnections: random(1,3),
        maxConnections: random() < 0.01 ? random(4,12) : random(2,6),
        starMinRadius: 0.5,
        starMaxRadius: 2.5,
        edgeMinWeight: 0.5,
        edgeMaxWeight: 3.5
    };

    background(0);
    generateConstellations();
}

function draw() {
    if (!isGenerated) {
        background(0);
        drawConstellations();
        isGenerated = true;
    }
}

function generateConstellations() {
    constellations = [];
    
    // Calculate grid positioning
    const totalWidth = config.gridCols * (config.constellationSize + config.gridSpacing) - config.gridSpacing;
    const totalHeight = config.gridRows * (config.constellationSize + config.gridSpacing) - config.gridSpacing;
    
    const startX = (width - totalWidth - config.constellationSize - config.gridSpacing) / 2;
    const startY = (height - totalHeight - config.constellationSize + config.gridSpacing*3) / 2;
    
    // Create grid of constellations
    for (let row = 0; row < config.gridRows; row++) {
        for (let col = 0; col < config.gridCols; col++) {
            const x = startX + col * (config.constellationSize + config.gridSpacing) + config.constellationSize / 2;
            const y = startY + row * (config.constellationSize + config.gridSpacing) + config.constellationSize / 2;
            
            const maxRadius = config.constellationSize / 2;
            const palette = floor(random(3));
            
            const constellation = createConstellation(x, y, maxRadius, palette);
            constellations.push(constellation);
        }
    }
    
    isGenerated = false;
}

function createConstellation(x, y, maxRadius, palette) {
    const numStars = floor(random(config.minStars, config.maxStars + 1));
    const stars = [];
    
    // Generate stars using golden ratio spiral (like in the original)
    const goldenAngle = PI * (3 - sqrt(5));
    
    for (let i = 0; i < numStars; i++) {
        const dist = maxRadius * sqrt(i / numStars);
        const angle = i * goldenAngle;
        const starX = dist * cos(angle);
        const starY = dist * sin(angle);
        
        stars.push({
            dist: dist,
            angle: angle,
            x: starX,
            y: starY,
            connections: []
        });
    }
    
    // Create connections based on proximity
    connectNearestStars(stars);
    ensureAllStarsConnected(stars);
    
    return {
        x: x,
        y: y,
        maxRadius: maxRadius,
        stars: stars,
        palette: palette
    };
}

function connectNearestStars(stars) {
    // Create distance matrix
    const distanceMatrix = [];
    
    for (let i = 0; i < stars.length; i++) {
        const distances = [];
        
        for (let j = 0; j < stars.length; j++) {
            if (i !== j) {
                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;
                const distance = sqrt(dx * dx + dy * dy);
                distances.push({ index: j, distance: distance });
            }
        }
        
        // Sort by distance
        distances.sort((a, b) => a.distance - b.distance);
        distanceMatrix.push(distances);
    }
    
    // Connect stars
    for (let i = 0; i < stars.length; i++) {
        const connectionsPerStar = floor(random(config.minConnections, config.maxConnections + 1));
        const numToConnect = min(connectionsPerStar, distanceMatrix[i].length);
        
        for (let k = 0; k < numToConnect; k++) {
            const j = distanceMatrix[i][k].index;
            
            // Check if connection already exists
            if (!stars[i].connections.some(conn => conn.index === j)) {
                const colorIdx = floor(random(5));
                
                // Add bidirectional connection
                stars[i].connections.push({ index: j, colorIdx: colorIdx });
                stars[j].connections.push({ index: i, colorIdx: colorIdx });
            }
        }
    }
}

function ensureAllStarsConnected(stars) {
    for (let i = 0; i < stars.length; i++) {
        if (stars[i].connections.length === 0) {
            // Find nearest star
            let nearestIdx = 0;
            let minDistance = Infinity;
            
            for (let j = 0; j < stars.length; j++) {
                if (i !== j) {
                    const dx = stars[i].x - stars[j].x;
                    const dy = stars[i].y - stars[j].y;
                    const distance = sqrt(dx * dx + dy * dy);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestIdx = j;
                    }
                }
            }
            
            const colorIdx = floor(random(5));
            stars[i].connections.push({ index: nearestIdx, colorIdx: colorIdx });
            stars[nearestIdx].connections.push({ index: i, colorIdx: colorIdx });
        }
    }
}

function drawConstellations() {
    // Draw each constellation
    for (const constellation of constellations) {
        push();
        translate(constellation.x, constellation.y);
        
        // Draw connections first (so they appear behind stars)
        for (let i = 0; i < constellation.stars.length; i++) {
            const star = constellation.stars[i];
            
            for (const connection of star.connections) {
                // Only draw each connection once
                if (i < connection.index) {
                    const connectedStar = constellation.stars[connection.index];
                    
                    // Get color from appropriate palette
                    let connectionColor;
                    switch (constellation.palette) {
                        case paletteTypes.COSMIC_NEBULA:
                            connectionColor = colorPalettes.cosmicNebula[connection.colorIdx];
                            break;
                        case paletteTypes.NORTHERN_LIGHTS:
                            connectionColor = colorPalettes.northernLights[connection.colorIdx];
                            break;
                        case paletteTypes.DESERT_SUNSET:
                            connectionColor = colorPalettes.desertSunset[connection.colorIdx];
                            break;
                    }
                    
                    // Draw connection line
                    stroke(connectionColor[0], connectionColor[1], connectionColor[2], connectionColor[3]);
                    strokeWeight(random(config.edgeMinWeight, config.edgeMaxWeight));
                    line(star.x, star.y, connectedStar.x, connectedStar.y);
                }
            }
        }
        
        // Draw stars
        for (const star of constellation.stars) {
            fill(255);
            noStroke();
            const radius = random(config.starMinRadius, config.starMaxRadius);
            ellipse(star.x, star.y, radius * 2, radius * 2);
        }
        
        pop();
    }
}

function regenerateConstellations() {
    generateConstellations();
    background(0);
    drawConstellations();
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
            saveCanvas("imnotprovable-quattro", "png");
        };
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSaveButton);
} else {
    setupSaveButton();
}