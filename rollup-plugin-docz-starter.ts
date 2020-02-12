import { spawn } from 'child_process';
import { argv } from 'process';

// tslint:disable:only-arrow-functions no-console
function doczStarter() {
    return {
        name: 'docz-starter',
        generateBundle: function() {
            if (!argv.includes('--watch')) {
                return;
            }

            console.log('📔 - Starting Docz...');
            const docz = spawn('npx', ['docz', 'dev']);

            docz.on('close', code => {
                console.log('📔 - Closing Docz...', code);
            });
        },
    };
}

export default doczStarter;
