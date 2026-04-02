/**
 * Defers a destroy callback so that portal-driven DOM moves
 * (disconnect + reconnect in the same microtask) can cancel the
 * destroy before it fires.
 */
export class DeferredDestroy {
    private pendingDestroyTimer: ReturnType<typeof setTimeout> | null = null;

    /**
     * Schedule a deferred destroy callback. Any previously pending
     * callback is cancelled first.
     * @param callback
     */
    public schedule(callback: () => void): void {
        this.cancel();
        this.pendingDestroyTimer = setTimeout(() => {
            this.pendingDestroyTimer = null;
            callback();
        }, 0);
    }

    /**
     * Cancel the pending destroy callback, if any.
     */
    public cancel(): void {
        if (this.pendingDestroyTimer !== null) {
            clearTimeout(this.pendingDestroyTimer);
            this.pendingDestroyTimer = null;
        }
    }
}
