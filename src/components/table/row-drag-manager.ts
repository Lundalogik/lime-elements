import { EventEmitter } from '@stencil/core';
import { RowComponent as TabulatorRowComponent } from 'tabulator-tables';
import { setElementProperties } from './columns';
import { ElementPool } from './element-pool';
import { RowReorderEvent } from './table.types';
import { Languages } from '../date-picker/date.types';

const LIMEL_DRAG_HANDLE = 'limel-drag-handle';

/**
 * Provides row drag-and-drop reordering configuration for Tabulator
 * using native movableRows with a custom drag handle
 */
export class RowDragManager {
    private mutationObserver: MutationObserver | null = null;

    constructor(
        private readonly pool: ElementPool,
        private readonly reorderEvent: EventEmitter<RowReorderEvent<any>>,
        private readonly getLanguage: () => Languages
    ) {
        this.handleRowMoved = this.handleRowMoved.bind(this);
    }

    /**
     * Start releasing drag-handle elements back to the pool when Tabulator
     * virtualizes rows out of view. Safe to call multiple times — a previous
     * observer is disconnected first.
     *
     * @param container - The element that hosts the Tabulator table.
     */
    public observe(container: HTMLElement): void {
        this.destroy();
        this.mutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.removedNodes) {
                    this.releaseDetachedHandles(node);
                }
            }
        });
        this.mutationObserver.observe(container, {
            childList: true,
            subtree: true,
        });
    }

    /**
     * Disconnects the mutation observer. Call when the manager is no longer
     * needed (e.g. on `disconnectedCallback` or when `movableRows` is toggled).
     */
    public destroy(): void {
        this.mutationObserver?.disconnect();
        this.mutationObserver = null;
    }

    /**
     * Returns the Tabulator rowHeader config that renders
     * a limel-drag-handle and restricts dragging to that cell
     */
    public getRowHeaderDefinition(): object {
        return {
            headerSort: false,
            resizable: false,
            frozen: true,
            rowHandle: true,
            formatter: this.getDragHandleFormatter(),
            cssClass: 'limel-table-drag-handle',
            cellClick: this.handleCellClick,
        };
    }

    /**
     * Tabulator rowMoved event handler.
     * Attach this to the tabulator instance via `tabulator.on('rowMoved', ...)`
     * @param row
     */
    public handleRowMoved(row: TabulatorRowComponent): void {
        const prevRow = row.getPrevRow();
        const nextRow = row.getNextRow();

        if (prevRow) {
            this.reorderEvent.emit({
                fromRow: row.getData(),
                toRow: prevRow.getData(),
                above: false,
            });
        } else if (nextRow) {
            this.reorderEvent.emit({
                fromRow: row.getData(),
                toRow: nextRow.getData(),
                above: true,
            });
        }
    }

    /**
     * Tabulator fires `rowMoved` / `rowMoveCancelled` from its `mouseup`
     * handler. The browser may then dispatch a synthetic `click` on the drop
     * target which would bubble to Tabulator's row-click handling and trigger
     * a spurious row activation. Call this from both events: it installs a
     * one-shot capture-phase click listener that swallows that single click
     * before Tabulator can see it. If no click arrives (rare, but possible),
     * the listener is removed on the next macrotask so it can never swallow a
     * later, intentional click.
     *
     * @param target - Element that should swallow the post-drop click
     * (typically the table host).
     */
    public readonly armPostDropClickGuard = (target: EventTarget): void => {
        const swallow = (event: Event): void => {
            event.stopImmediatePropagation();
            event.preventDefault();
        };
        target.addEventListener('click', swallow, {
            once: true,
            capture: true,
        });
        setTimeout(() => {
            target.removeEventListener('click', swallow, true);
        }, 0);
    };

    private readonly handleCellClick = (ev: Event): void => {
        ev.stopPropagation();
        ev.preventDefault();
    };

    private readonly releaseDetachedHandles = (node: Node): void => {
        if (!(node instanceof HTMLElement)) {
            return;
        }

        const handles = node.matches(LIMEL_DRAG_HANDLE)
            ? [node]
            : [...node.querySelectorAll<HTMLElement>(LIMEL_DRAG_HANDLE)];

        for (const handle of handles) {
            if (!handle.isConnected) {
                this.pool.release(handle);
            }
        }
    };

    private getDragHandleFormatter() {
        return () => {
            const element = this.pool.get(LIMEL_DRAG_HANDLE);
            setElementProperties(element, {
                dragDirection: 'vertical',
                language: this.getLanguage(),
            });

            return element;
        };
    }
}
