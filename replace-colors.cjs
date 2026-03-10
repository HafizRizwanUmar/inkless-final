const fs = require('fs');
const path = require('path');

const mapColor = (colorName, intensityStr) => {
    const i = parseInt(intensityStr, 10);
    if (i <= 100) return 'brand-cream';
    if (i <= 300) return 'brand-light';
    if (i <= 500) return 'brand-accent';
    if (i <= 700) return 'brand-muted';
    return 'brand-dark';
};

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    const regex = /\b(text|bg|border|ring|from|via|to|shadow|fill|stroke)-(purple|indigo|blue)-(\d{2,3})\b/g;

    let newContent = content.replace(regex, (match, prefix, colorName, intensity) => {
        const brandColor = mapColor(colorName, intensity);
        return `${prefix}-${brandColor}`;
    });

    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        changedFiles++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Updated ${changedFiles} files.`);
