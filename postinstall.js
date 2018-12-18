const fs = require('fs');

// Copy pre-built version of flatpickr
// TODO: remove this when a new version of flatpickr has been released
fs.exists('src/dev-assets/hack/flatpickr.js', () => {
    fs.copyFile(
        'src/dev-assets/hack/flatpickr.js',
        'node_modules/flatpickr/dist/flatpickr.js',
        () => {
            console.log(
                'copied src/dev-assets/hack/flatpickr.js to node_modules'
            );
        }
    );
});

// Remove type definitions for jsx-dom
fs.exists('node_modules/jsx-dom/jsx-dom.d.ts', () => {
    fs.unlink('node_modules/jsx-dom/jsx-dom.d.ts', () => {
        console.log('jsx-dom.d.ts removed!');
    });
});
