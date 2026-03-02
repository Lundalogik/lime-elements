/**
 * Types with @private and @internal tags that should be EXCLUDED
 */
/**
 * Internal implementation detail
 * @private
 */
export interface InternalCache {
    data: Map<string, any>;
}
/**
 * Internal API - do not use
 * @internal
 */
export interface InternalAPI {
    _unsafeMethod(): void;
}
/**
 * This is a public interface that SHOULD be included
 */
export interface PublicAPI {
    safeMethod(): void;
}
