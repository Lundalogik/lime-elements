import { vi } from 'vitest';

vi.mock('./columns', () => ({
    setElementProperties: vi.fn(),
}));

import { RowDragManager } from './row-drag-manager';
import { setElementProperties } from './columns';

function createMockRow(data: any, prevRow: any = false, nextRow: any = false) {
    return {
        getData: vi.fn(() => data),
        getPrevRow: vi.fn(() => prevRow),
        getNextRow: vi.fn(() => nextRow),
    };
}

function createMockPool() {
    return {
        get: vi.fn(() => document.createElement('div')),
        release: vi.fn(),
        releaseAll: vi.fn(),
    };
}

function createMockEventEmitter() {
    return {
        emit: vi.fn(),
    };
}

describe('RowDragManager', () => {
    let manager: RowDragManager;
    let mockPool: ReturnType<typeof createMockPool>;
    let mockEmitter: ReturnType<typeof createMockEventEmitter>;
    let language: 'en' | 'sv';

    beforeEach(() => {
        vi.clearAllMocks();
        mockPool = createMockPool();
        mockEmitter = createMockEventEmitter();
        language = 'en';

        manager = new RowDragManager(
            mockPool as any,
            mockEmitter as any,
            () => language
        );
    });

    describe('getRowHeaderDefinition', () => {
        it('returns a column definition with correct properties', () => {
            const definition = manager.getRowHeaderDefinition(32) as any;

            expect(definition.headerSort).toBe(false);
            expect(definition.resizable).toBe(false);
            expect(definition.frozen).toBe(true);
            expect(definition.rowHandle).toBe(true);
            expect(definition.cssClass).toEqual('limel-table-drag-handle');
        });

        it('reserves the given width so layouts do not stretch the column', () => {
            const definition = manager.getRowHeaderDefinition(32) as any;

            expect(definition.width).toBe(32);
            expect(definition.minWidth).toBe(32);
        });

        it('provides a formatter that uses the element pool', () => {
            const definition = manager.getRowHeaderDefinition(32) as any;
            const formatter = definition.formatter as () => HTMLElement;

            const element = formatter();
            expect(mockPool.get).toHaveBeenCalledWith('limel-drag-handle');
            expect(element).toBeTruthy();
        });

        it('sets drag handle properties via setElementProperties', () => {
            const definition = manager.getRowHeaderDefinition(32) as any;
            const formatter = definition.formatter as () => HTMLElement;

            formatter();
            expect(setElementProperties).toHaveBeenCalledWith(
                expect.any(HTMLElement),
                { dragDirection: 'vertical', language: 'en' }
            );
        });

        it('reads language lazily so host prop changes propagate', () => {
            const definition = manager.getRowHeaderDefinition(32) as any;
            const formatter = definition.formatter as () => HTMLElement;

            language = 'sv';
            formatter();

            expect(setElementProperties).toHaveBeenLastCalledWith(
                expect.any(HTMLElement),
                { dragDirection: 'vertical', language: 'sv' }
            );
        });

        it('provides a cellClick handler that stops propagation', () => {
            const definition = manager.getRowHeaderDefinition(32) as any;
            const event = {
                stopPropagation: vi.fn(),
                preventDefault: vi.fn(),
            };

            definition.cellClick(event);

            expect(event.stopPropagation).toHaveBeenCalled();
            expect(event.preventDefault).toHaveBeenCalled();
        });
    });

    describe('handleRowMoved', () => {
        it('emits reorder event with above=false when row has a previous row', () => {
            const prevRow = createMockRow({ id: 1, name: 'Alice' });
            const movedRow = createMockRow(
                { id: 2, name: 'Bob' },
                prevRow,
                false
            );

            manager.handleRowMoved(movedRow as any);

            expect(mockEmitter.emit).toHaveBeenCalledWith({
                fromRow: { id: 2, name: 'Bob' },
                toRow: { id: 1, name: 'Alice' },
                above: false,
            });
        });

        it('emits reorder event with above=true when row is first (no previous row)', () => {
            const nextRow = createMockRow({ id: 2, name: 'Bob' });
            const movedRow = createMockRow(
                { id: 1, name: 'Alice' },
                false,
                nextRow
            );

            manager.handleRowMoved(movedRow as any);

            expect(mockEmitter.emit).toHaveBeenCalledWith({
                fromRow: { id: 1, name: 'Alice' },
                toRow: { id: 2, name: 'Bob' },
                above: true,
            });
        });

        it('does not emit when row has no neighbors', () => {
            const movedRow = createMockRow(
                { id: 1, name: 'Alice' },
                false,
                false
            );

            manager.handleRowMoved(movedRow as any);

            expect(mockEmitter.emit).not.toHaveBeenCalled();
        });

        it('prefers previous row over next row for positioning', () => {
            const prevRow = createMockRow({ id: 1, name: 'Alice' });
            const nextRow = createMockRow({ id: 3, name: 'Charlie' });
            const movedRow = createMockRow(
                { id: 2, name: 'Bob' },
                prevRow,
                nextRow
            );

            manager.handleRowMoved(movedRow as any);

            expect(mockEmitter.emit).toHaveBeenCalledWith({
                fromRow: { id: 2, name: 'Bob' },
                toRow: { id: 1, name: 'Alice' },
                above: false,
            });
        });
    });

    describe('observe', () => {
        let observerCallback: MutationCallback | null;
        let observerInstance: { observe: any; disconnect: any } | null;
        let originalMutationObserver: typeof MutationObserver | undefined;

        beforeEach(() => {
            observerCallback = null;
            observerInstance = null;
            originalMutationObserver = (globalThis as any).MutationObserver;
            (globalThis as any).MutationObserver = function (
                cb: MutationCallback
            ) {
                observerCallback = cb;
                observerInstance = {
                    observe: vi.fn(),
                    disconnect: vi.fn(),
                    takeRecords: vi.fn(),
                };

                return observerInstance;
            };
        });

        afterEach(() => {
            (globalThis as any).MutationObserver = originalMutationObserver;
        });

        function fireRemoval(...nodes: Node[]) {
            const record = {
                removedNodes: nodes as any,
            } as MutationRecord;
            observerCallback!([record], observerInstance as any);
        }

        it('releases drag-handle elements detached from the observed container', () => {
            const container = document.createElement('div');
            const row = document.createElement('div');
            const handle = document.createElement('limel-drag-handle');
            row.append(handle);
            // row is never re-attached, so handle.isConnected is false

            manager.observe(container);
            expect(observerInstance!.observe).toHaveBeenCalledTimes(1);
            expect(observerInstance!.observe.mock.calls[0][0]).toBe(container);
            expect(observerInstance!.observe.mock.calls[0][1]).toEqual({
                childList: true,
                subtree: true,
            });

            fireRemoval(row);

            expect(mockPool.release).toHaveBeenCalledTimes(1);
            expect(mockPool.release.mock.calls[0][0]).toBe(handle);
        });

        it('releases a drag-handle that is itself the removed node', () => {
            const handle = document.createElement('limel-drag-handle');

            manager.observe(document.createElement('div'));
            fireRemoval(handle);

            expect(mockPool.release).toHaveBeenCalledTimes(1);
            expect(mockPool.release.mock.calls[0][0]).toBe(handle);
        });

        it('skips handles still connected to the DOM (re-attached)', () => {
            const container = document.createElement('div');
            document.body.append(container);
            const handle = document.createElement('limel-drag-handle');
            container.append(handle);

            manager.observe(container);
            fireRemoval(handle);

            expect(mockPool.release).not.toHaveBeenCalled();
            container.remove();
        });

        it('ignores non-element removed nodes', () => {
            const text = document.createTextNode('hello');

            manager.observe(document.createElement('div'));
            fireRemoval(text);

            expect(mockPool.release).not.toHaveBeenCalled();
        });

        it('disconnects a previous observer before attaching a new one', () => {
            const first = document.createElement('div');
            const second = document.createElement('div');

            manager.observe(first);
            const firstObserver = observerInstance!;
            manager.observe(second);

            expect(firstObserver.disconnect).toHaveBeenCalled();
        });
    });

    describe('destroy', () => {
        it('disconnects the observer', () => {
            const disconnect = vi.fn();
            const originalMutationObserver = (globalThis as any)
                .MutationObserver;
            (globalThis as any).MutationObserver = class {
                public observe = vi.fn();
                public disconnect = disconnect;
                public takeRecords = vi.fn();
            };

            manager.observe(document.createElement('div'));
            manager.destroy();

            expect(disconnect).toHaveBeenCalled();
            (globalThis as any).MutationObserver = originalMutationObserver;
        });

        it('is a no-op when no observer is attached', () => {
            expect(() => manager.destroy()).not.toThrow();
        });
    });

    describe('armPostDropClickGuard', () => {
        let target: {
            addEventListener: ReturnType<typeof vi.fn>;
            removeEventListener: ReturnType<typeof vi.fn>;
        };

        beforeEach(() => {
            vi.useFakeTimers();
            target = {
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
            };
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        function getInstalledListener(): (event: Event) => void {
            return target.addEventListener.mock.calls[0][1];
        }

        it('registers a one-shot capture-phase click listener', () => {
            manager.armPostDropClickGuard(target as unknown as EventTarget);

            expect(target.addEventListener).toHaveBeenCalledWith(
                'click',
                expect.any(Function),
                { once: true, capture: true }
            );
        });

        it('swallows the click via stopImmediatePropagation + preventDefault', () => {
            manager.armPostDropClickGuard(target as unknown as EventTarget);
            const listener = getInstalledListener();
            const event = {
                stopImmediatePropagation: vi.fn(),
                preventDefault: vi.fn(),
            };

            listener(event as unknown as Event);

            expect(event.stopImmediatePropagation).toHaveBeenCalled();
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('removes the listener on the next macrotask if no click fires', () => {
            manager.armPostDropClickGuard(target as unknown as EventTarget);
            const listener = getInstalledListener();

            vi.advanceTimersByTime(0);

            expect(target.removeEventListener).toHaveBeenCalledWith(
                'click',
                listener,
                true
            );
        });
    });
});
