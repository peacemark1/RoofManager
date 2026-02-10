/**
 * calculate_materials.js
 * Tool for the Roofing Expert skill.
 * Receives roofArea and pitch as command line arguments.
 */

const args = process.argv.slice(2);
if (args.length < 1) {
    console.log("Usage: node calculate_materials.js <roofAreaSqFt> [pitch]");
    process.exit(1);
}

const area = parseFloat(args[0]);
const pitch = args[1] || "6/12"; // Default pitch

// Calculation logic
const squares = Math.ceil(area / 100);
const wasteFactor = 1.10; // 10% waste
const bundlesPerSquare = 3;
const totalBundles = Math.ceil(squares * wasteFactor * bundlesPerSquare);
const nailsPerSquareBoundle = 320; // Simplified

console.log(`--- Roofing Material Estimate ---`);
console.log(`Roof Area: ${area} sq ft`);
console.log(`Pitch: ${pitch}`);
console.log(`Squares: ${squares}`);
console.log(`---------------------------------`);
console.log(`Expected Bundles: ${totalBundles}`);
console.log(`Nails (est): ${totalBundles * 100} approx.`);
console.log(`Underlayment: ${Math.ceil(area / 400)} rolls (400 sq ft pods)`);
console.log(`---------------------------------`);
