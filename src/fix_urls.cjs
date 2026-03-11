const fs = require('fs');
const path = require('path');

const PAGES_DIR = 'c:/Users/abc/Desktop/React/inkless/client/src/pages';
const TARGET_URL = 'https://inkless-backend.vercel.app';
const REPLACEMENT = '${API_BASE_URL}';
const IMPORT_STMT = "import API_BASE_URL from '../config';";

const files = fs.readdirSync(PAGES_DIR);

files.forEach(file => {
    if (file.endsWith('.jsx')) {
        const filePath = path.join(PAGES_DIR, file);
        let content = fs.readFileSync(filePath, 'utf8');

        if (content.includes(TARGET_URL)) {
            console.log(`Updating ${file}...`);

            // 1. Replace quoted URLs
            // Target: 'https://inkless-backend.vercel.app/api/...' -> `${API_BASE_URL}/api/...`
            // Target: "https://inkless-backend.vercel.app/api/..." -> `${API_BASE_URL}/api/...`
            const quotedRegex = new RegExp(`['"]${TARGET_URL}([^'"]*)['"]`, 'g');
            content = content.replace(quotedRegex, (match, path) => {
                return `\`\${API_BASE_URL}${path}\``;
            });

            // 2. Replace template literal URLs
            // Target: `https://inkless-backend.vercel.app/api/${id}` -> `${API_BASE_URL}/api/${id}`
            const templateRegex = new RegExp(`${TARGET_URL}`, 'g');
            content = content.replace(templateRegex, REPLACEMENT);

            // 3. Add Import if missing
            if (!content.includes(IMPORT_STMT) && !content.includes("from '../config'")) {
                // Find first import line or start of file
                const lines = content.split('\n');
                let importIdx = lines.findIndex(line => line.startsWith('import '));
                if (importIdx === -1) importIdx = 0;
                lines.splice(importIdx, 0, IMPORT_STMT);
                content = lines.join('\n');
            }

            fs.writeFileSync(filePath, content);
        }
    }
});
console.log('Done!');
