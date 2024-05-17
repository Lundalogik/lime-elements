import chokidar from 'chokidar';
import nodeCleanup from 'node-cleanup';

export function createWatcher(
    path: string,
    type: string,
    callback: (...args: any[]) => void
): void {
    const watcher = chokidar.watch(path).on(type, callback);

    nodeCleanup(async () => {
        await watcher.close();
    });
}
