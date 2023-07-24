import { CacheStorageIconCache } from './cache-storage-icon-cache';
import { InMemoryIconCache } from './in-memory-icon-cache';

const CACHE_NAME = '@limetech/lime-elements/icons';

function createIconCache() {
    try {
        const cache = caches.open(CACHE_NAME);

        return new CacheStorageIconCache(cache);
    } catch {
        return new InMemoryIconCache();
    }
}

export default (() => {
    return createIconCache();
})();
