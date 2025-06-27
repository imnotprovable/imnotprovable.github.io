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

let config = {};

let constellations = [];
let time = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    let constellationSize = 80.0;
    let gridSpacing = 12.0;
    config = {
        constellationSize: constellationSize,
        gridRows: (windowHeight / (constellationSize + gridSpacing)),
        gridCols: (windowWidth / (constellationSize + gridSpacing)),
        gridSpacing: gridSpacing,
        minStars: 7,
        maxStars: 25,
        minConnections: random(1,2),
        maxConnections: random() < 0.01 ? random(4,12) : random(2,4),
        starMinRadius: 0.5,
        starMaxRadius: 2.5,
        edgeMinWeight: 0.5,
        edgeMaxWeight: 2.5,
        // Animation parameters
        baseSpeed: 0.01,
        maxSpeed: 0.03,
        pulseSpeed: 0.05,
        trailAlpha: 20
    };

    background(0);
    generateConstellations();
}

function draw() {
    // Create trailing effect
    fill(0, config.trailAlpha);
    rect(0, 0, width, height);
    
    time += 0.016; // Approximate 60fps time step
    
    updateConstellations();
    drawConstellations();
}

function generateConstellations() {
    constellations = [];
    
    // Calculate grid positioning
    /*const totalWidth = config.gridCols * (config.constellationSize + config.gridSpacing) - config.gridSpacing;
    const totalHeight = config.gridRows * (config.constellationSize + config.gridSpacing) - config.gridSpacing;
    
    const startX = (width - totalWidth - config.constellationSize - config.gridSpacing) + config.constellationSize - config.gridSpacing - (config.gridSpacing/2);
    const startY = (height - totalHeight - config.constellationSize + (config.gridSpacing * 1.5));*/

    /*const totalWidth = config.gridCols * (config.constellationSize + (config.gridSpacing - 1));
    const totalHeight = config.gridRows * (config.constellationSize + (config.gridSpacing - 1));
    
    const startX = (width - totalWidth) - (config.constellationSize / 2) - config.gridSpacing;
    const startY = (height - totalHeight) - (config.constellationSize / 2) - config.gridSpacing;*/

    const totalWidth = config.gridCols * (config.constellationSize + config.gridSpacing) - config.gridSpacing;
    const totalHeight = config.gridRows * (config.constellationSize + config.gridSpacing) - config.gridSpacing;
    
    const startX = (width - totalWidth) + (config.gridSpacing / 2);
    const startY = (height - totalHeight) - (config.gridSpacing / 2);
    
    // Create grid of constellations
    for (let row = 0; row < config.gridRows-1; row++) {
        for (let col = 0; col < config.gridCols-1; col++) {
            const x = startX + col * (config.constellationSize + config.gridSpacing) + config.constellationSize / 2;
            const y = startY + row * (config.constellationSize + config.gridSpacing) + config.constellationSize / 2;
            
            const maxRadius = config.constellationSize / 2;
            const palette = floor(random(3));
            
            const constellation = createConstellation(x, y, maxRadius, palette);
            constellations.push(constellation);
        }
    }
}

function updateConstellations() {
    for (let constellation of constellations) {
        constellation.rotationAngle += constellation.rotationSpeed;
        
        for (let star of constellation.stars) {
            // Different motion types for variety
            switch (constellation.motionType) {
                case 0: // Orbital motion
                    star.originalAngle += constellation.motionSpeed;
                    star.x = star.originalDist * cos(star.originalAngle);
                    star.y = star.originalDist * sin(star.originalAngle);
                    break;
                    
                case 1: // Pulsing/breathing
                    const pulseScale = 1 + sin(time * star.frequency + star.phaseOffset) * 0.3;
                    star.x = star.originalX * pulseScale;
                    star.y = star.originalY * pulseScale;
                    break;
                    
                case 2: // Wave motion
                    star.x = star.originalX + sin(time * star.frequency + star.phaseOffset) * star.amplitude;
                    star.y = star.originalY + cos(time * star.frequency * 0.7 + star.phaseOffset) * star.amplitude * 0.5;
                    break;
                    
                case 3: // Spiral motion
                    const spiralRadius = star.originalDist + sin(time * star.frequency + star.phaseOffset) * 10;
                    const spiralAngle = star.originalAngle + time * constellation.motionSpeed * 2;
                    star.x = spiralRadius * cos(spiralAngle);
                    star.y = spiralRadius * sin(spiralAngle);
                    break;
                    
                case 4: // Figure-8 motion
                    const t = time * star.frequency + star.phaseOffset;
                    star.x = star.originalX + sin(t) * star.amplitude;
                    star.y = star.originalY + sin(t * 2) * star.amplitude * 0.5;
                    break;
                    
                case 5: // Jittery/nervous motion
                    star.x = star.originalX + (noise(time * 2 + star.phaseOffset) - 0.5) * star.amplitude;
                    star.y = star.originalY + (noise(time * 2 + star.phaseOffset + 100) - 0.5) * star.amplitude;
                    break;
            }
            
            // Apply constellation rotation
            if (abs(constellation.rotationSpeed) > 0.001) {
                const rotatedX = star.x * cos(constellation.rotationAngle) - star.y * sin(constellation.rotationAngle);
                const rotatedY = star.x * sin(constellation.rotationAngle) + star.y * cos(constellation.rotationAngle);
                star.x = rotatedX;
                star.y = rotatedY;
            }
        }
    }
}

function createConstellation(x, y, maxRadius, palette) {
    const numStars = floor(random(config.minStars, config.maxStars + 1));
    const stars = [];
    
    // Choose a random motion type for this constellation
    const motionType = floor(random(6));
    const motionSpeed = random(config.baseSpeed, config.maxSpeed);
    const rotationSpeed = random(-0.02, 0.02);
    
    // Generate stars using golden ratio spiral (like in the original)
    const goldenAngle = PI * (3 - sqrt(5));
    
    for (let i = 0; i < numStars; i++) {
        const dist = maxRadius * sqrt(i / numStars) * 0.8; // Keep within bounds
        const angle = i * goldenAngle;
        const starX = dist * cos(angle);
        const starY = dist * sin(angle);
        
        stars.push({
            // Original position
            originalX: starX,
            originalY: starY,
            originalDist: dist,
            originalAngle: angle,
            
            // Current position
            x: starX,
            y: starY,
            
            // Animation properties
            phaseOffset: random(TWO_PI),
            frequency: random(0.5, 2.0),
            amplitude: random(5, 15),
            
            // Star properties
            baseRadius: random(config.starMinRadius, config.starMaxRadius),
            pulseOffset: random(TWO_PI),
            
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
        palette: palette,
        motionType: motionType,
        motionSpeed: motionSpeed,
        rotationSpeed: rotationSpeed,
        rotationAngle: 0
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
                    
                    // Animate connection opacity based on distance
                    const dx = star.x - connectedStar.x;
                    const dy = star.y - connectedStar.y;
                    const distance = sqrt(dx * dx + dy * dy);
                    const maxDistance = constellation.maxRadius;
                    const opacity = map(distance, 0, maxDistance, 255, 50);
                    
                    // Draw connection line with animated opacity
                    stroke(connectionColor[0], connectionColor[1], connectionColor[2], opacity);
                    strokeWeight(random(config.edgeMinWeight, config.edgeMaxWeight));
                    line(star.x, star.y, connectedStar.x, connectedStar.y);
                }
            }
        }
        
        // Draw stars with pulsing effect
        for (const star of constellation.stars) {
            // Pulsing radius
            const pulseScale = 1 + sin(time * config.pulseSpeed + star.pulseOffset) * 0.5;
            const radius = star.baseRadius * pulseScale;
            
            // Brightness variation
            const brightness = 200 + sin(time * config.pulseSpeed * 0.7 + star.pulseOffset) * 55;
            
            fill(brightness);
            noStroke();
            ellipse(star.x, star.y, radius * 2, radius * 2);
            
            // Add a subtle glow effect
            fill(brightness, brightness * 0.8);
            ellipse(star.x, star.y, radius * 1.5, radius * 1.5);
        }
        
        pop();
    }
}

function regenerateConstellations() {
    generateConstellations();
    background(0);
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
            saveCanvas("imnotprovable-quattrobis", "png");
        };
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSaveButton);
} else {
    setupSaveButton();
}