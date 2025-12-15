const fs = require('fs');

/**
 * Decode a value from a given base to decimal
 * @param {string} base - The base of the number system
 * @param {string} value - The encoded value
 * @returns {number} - The decoded decimal value
 */
function decodeValue(base, value) {
    return parseInt(value, parseInt(base));
}

/**
 * Parse the JSON input and extract points (x, y)
 * @param {object} jsonData - The parsed JSON object
 * @returns {object} - Object containing points array and k value
 */
function parseInput(jsonData) {
    const n = jsonData.keys.n;
    const k = jsonData.keys.k;
    const points = [];

    // Extract all points except the 'keys' object
    for (let key in jsonData) {
        if (key !== 'keys') {
            const x = parseInt(key);
            const base = jsonData[key].base;
            const encodedValue = jsonData[key].value;
            const y = decodeValue(base, encodedValue);
            
            points.push({ x: x, y: y });
        }
    }

    return { points, k };
}

/**
 * @param {Array} points - Array of {x, y} points
 * @param {number} k - Minimum number of points to use
 * @returns {number} - The constant term C
 */
function lagrangeInterpolation(points, k) {

    const selectedPoints = points.slice(0, k);
    let constantTerm = 0;
    for (let i = 0; i < selectedPoints.length; i++) {
        const xi = selectedPoints[i].x;
        const yi = selectedPoints[i].y;
        let Li = 1;
        for (let j = 0; j < selectedPoints.length; j++) {
            if (i !== j) {
                const xj = selectedPoints[j].x;
                Li *= (0 - xj) / (xi - xj);
            }
        }
        constantTerm += yi * Li;
    }

    return Math.round(constantTerm);
}
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node solver.js <testcase.json>');
        console.log('Example: node solver.js testcase1.json');
        process.exit(1);
    }

    const filename = args[0];

    try {
        const fileContent = fs.readFileSync(filename, 'utf8');
        const jsonData = JSON.parse(fileContent);
        const { points, k } = parseInput(jsonData);

        console.log('\n=== HIVEL Polynomial Constant Finder ===\n');
        console.log(`Input File: ${filename}`);
        console.log(`Total roots provided (n): ${jsonData.keys.n}`);
        console.log(`Minimum roots required (k): ${k}`);
        console.log(`\nDecoded Points (x, y):`);
        
        points.forEach(point => {
            console.log(`  (${point.x}, ${point.y})`);
        });
        const constantC = lagrangeInterpolation(points, k);

        console.log(`\n=== RESULT ===`);
        console.log(`Constant Term C: ${constantC}`);
        console.log('================\n');

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}
main();
