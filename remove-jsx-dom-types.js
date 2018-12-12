const fs = require('fs');
fs.unlink('node_modules/jsx-dom/jsx-dom.d.ts', () => {
    console.log('jsx-dom.d.ts removed!');
});
