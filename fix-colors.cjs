const fs = require('fs');
const path = require('path');

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
    let newContent = content.split('\n').map(line => {
        // If the line has 'bg-background' or 'bg-surface' or 'input' and 'text-white'
        if ((line.includes('bg-background') || line.includes('bg-surface') || line.includes('<input') || line.includes('<textarea') || line.includes('<select')) && line.includes('text-white')) {
            // But don't replace if it's a primary button
            if (!line.includes('bg-primary text-white')) {
                return line.replace(/\btext-white\b/g, 'text-foreground');
            }
        }
        return line;
    }).join('\n');

    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        changedFiles++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Updated ${changedFiles} files.`);
