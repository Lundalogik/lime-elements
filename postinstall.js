const fs = require('fs');

// Remove type definitions for jsx-dom
fs.exists('node_modules/jsx-dom/jsx-dom.d.ts', () => {
    fs.unlink('node_modules/jsx-dom/jsx-dom.d.ts', () => {
        console.log('jsx-dom.d.ts removed!');
    });
});

fs.exists('node_modules/jsx-dom/index.d.ts', () => {
    fs.unlink('node_modules/jsx-dom/index.d.ts', () => {
        console.log('jsx-dom/index.d.ts removed!');
    });
});
