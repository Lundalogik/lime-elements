import chokidar from 'chokidar';
import nodeCleanup from 'node-cleanup';
export function createWatcher(path, type, callback) {
    const watcher = chokidar.watch(path).on(type, callback);
    nodeCleanup(async () => {
        await watcher.close();
    });
}
