let gridSize;
        let circleRadius;
        let points = [];
        let lastUpdate = 0;
        let colorPalette = [];
        let baseHue;
        let point_or_line = 0;

        function setup() {
            createCanvas(windowWidth, windowHeight);
            colorMode(HSB, 360, 100, 100, 100);
            
            gridSize = random(120, 180);
            if (windowWidth > windowHeight)
                circleRadius = random(min(320.0, windowHeight/4), max(windowHeight/3, 450.0));
            else
                circleRadius = random(min(320.0, windowWidth/4), max(windowWidth/3, 450.0));
            point_or_line = random();
            
            // Generate a subtle color palette
            baseHue = random(360);
            colorPalette = [
                color(baseHue, 20, 80, 60),
                color((baseHue + 30) % 360, 25, 85, 65),
                color((baseHue + 60) % 360, 30, 90, 70),
                color((baseHue + 120) % 360, 15, 95, 55),
                color((baseHue + 180) % 360, 35, 75, 75)
            ];
            
            // Initialize points within the circle
            let cellSize = width / gridSize;
            
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    let x = (i - gridSize / 2.0) * cellSize;
                    let y = (j - gridSize / 2.0) * cellSize;
                    
                    // Only add points within the circular boundary
                    if (x * x + y * y <= circleRadius * circleRadius) {
                        points.push({ x: x, y: y });
                    }
                }
            }
            
            console.log(`Initialized ${points.length} points`);
        }

        function draw() {
            background(0, 0, 5); // Very dark background with slight warmth
            
            let currentTime = millis() / 1000.0; // Convert to seconds
            
            // Update the flow field every 2 seconds
            if (currentTime - lastUpdate >= random(2.0,3.0)) {
                lastUpdate = currentTime;
                // Change noise seed to update flow field
                let newSeed = currentTime * random(-1000, 1000);
                noiseSeed(newSeed);
            }
            
            // Move each point in the direction of the flow field
            for (let point of points) {
                // Get noise value at this point's position
                /*let noiseValue = noise(point.x * 0.01, point.y * 0.01);
                let angle = map(noiseValue, 0, 1, 0, TWO_PI);*/
                let noiseValue = noise(point.x * 0.01, point.y * 0.01, currentTime * 0.1);
                let angle = noiseValue * TWO_PI * 2; // Allow multiple rotations
                
                // Move the point in the direction of the flow
                point.x += cos(angle) * 2.0;
                point.y += sin(angle) * 2.0;
                
                // Wrap points around if they go outside the circle
                if (point.x * point.x + point.y * point.y > circleRadius * circleRadius) {
                    // Reset the point to a random position within the circle
                    let randomAngle = random(0, TWO_PI);
                    let randomRadius = random(0, circleRadius);
                    point.x = randomRadius * cos(randomAngle);
                    point.y = randomRadius * sin(randomAngle);
                }
            }
            
            // Translate to center of canvas
            translate(width / 2, height / 2);
            
            // Draw lines for each point with color gradients
            strokeWeight(1.0);
            
            for (let point of points) {
                let noiseValue = noise(point.x * 0.01, point.y * 0.01);
                let angle = map(noiseValue, 0, 1, 0, TWO_PI);
                let lineLength = random(5, 15);
                
                let endX = point.x + cos(angle) * lineLength;
                let endY = point.y + sin(angle) * lineLength;
                
                // Calculate color based on position and noise
                let distanceFromCenter = sqrt(point.x * point.x + point.y * point.y);
                let normalizedDistance = distanceFromCenter / circleRadius;
                
                // Color based on angle and distance
                let colorIndex = floor(map(angle, 0, TWO_PI, 0, colorPalette.length));
                let baseColor = colorPalette[colorIndex % colorPalette.length];
                
                // Modify color based on distance from center and noise
                let h = (hue(baseColor) + noiseValue * 20) % 360;
                let s = saturation(baseColor) + map(normalizedDistance, 0, 1, -10, 15);
                let b = brightness(baseColor) + map(noiseValue, 0, 1, -15, 25);
                let a = map(normalizedDistance, 0, 1, 80, 40); // Fade towards edges
                
                if (point_or_line > 0.5) {
                    stroke(h, s, b, a);
                    line(point.x, point.y, endX, endY);
                } else {
                
                    fill(h, s, b, a);
                    noStroke();
                    
                    // Vary point size based on noise and distance
                    let pointSize = map(noiseValue, 0, 1, 1, 3) + map(normalizedDistance, 0, 1, 2, 0.1);
                    circle(point.x, point.y, pointSize);
                }
            }
        }

        function setupSaveButton() {
            const saveBtn = document.getElementById("saveBtn");
            if (saveBtn) {
                saveBtn.onclick = () => {
                    saveCanvas("imnotprovable-cinque", "png");
                };
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupSaveButton);
        } else {
            setupSaveButton();
        }