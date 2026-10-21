import Sortable, { SortableEvent } from 'sortablejs';

const DRAG_HANDLE_SELECTOR = '[data-drag-handle]';
const DRAGGING_CONTAINER_CLASS = 'has-an-item-which-is-being-dragged';
const ELEVATED_ITEM_CLASS = 'is-elevated';
const ELEVATION_DURATION_MS = 1000;
const TOUCH_DRAG_DELAY_MS = 200;
const ANIMATION_DURATION_MS = 150;

export type ReorderDirection = 'vertical' | 'horizontal';

export interface DragToReorderOptions {
    /**
     * Selector for the children of the list that the user can drag.
     */
    draggable: string;

    /**
     * Put the dragged child back where it was when it is dropped, for a list
     * whose owner renders the new order itself.
     */
    revertDrop?: boolean;

    /**
     * Called when a drop has changed the order of the list.
     */
    onReorder: (event: ReorderEvent) => void;
}

export interface ReorderEvent {
    /**
     * The `data-reorder-id` of every child of the list, in the new order.
     */
    order: string[];

    /**
     * Where the dragged child was before the drop.
     */
    fromIndex: number;

    /**
     * Where the dragged child is after the drop.
     */
    toIndex: number;
}

/**
 * Lets the user reorder the children of a list with a drag handle.
 *
 * Every child of the list has a `data-reorder-id`, and the drag starts from
 * an element with the `data-drag-handle` attribute inside a child.
 */
export class DragToReorder {
    private container?: HTMLElement;
    private direction?: ReorderDirection;
    private sortable?: Sortable;
    private orderBeforeDrag: string[] = [];
    private nextSiblingBeforeDrag?: Element;
    private elevatedItem?: HTMLElement;
    private elevationTimeout?: ReturnType<typeof setTimeout>;

    constructor(private readonly options: DragToReorderOptions) {}

    /**
     * @param container - the list
     * @param direction - the way the children are laid out. Leave it out to
     * let SortableJS find out. Setting up the same list again without it keeps
     * the direction that the list has.
     */
    public setup(container: HTMLElement, direction?: ReorderDirection) {
        if (this.getDraggableItems(container).length < 2) {
            this.teardown();

            return;
        }

        if (this.sortable && this.container === container) {
            this.changeDirection(direction);

            return;
        }

        this.teardown();
        this.container = container;
        this.direction = direction;
        this.sortable = Sortable.create(container, {
            animation: ANIMATION_DURATION_MS,
            handle: DRAG_HANDLE_SELECTOR,
            draggable: this.options.draggable,
            delay: TOUCH_DRAG_DELAY_MS,
            delayOnTouchOnly: true,
            ...(direction && { direction: direction }),
            onStart: this.handleStart,
            onEnd: this.handleEnd,
        });
    }

    public teardown() {
        this.sortable?.destroy();
        this.sortable = undefined;
        this.removeElevation();
        this.container?.classList.remove(DRAGGING_CONTAINER_CLASS);
        this.container = undefined;
        this.direction = undefined;
        this.orderBeforeDrag = [];
        this.nextSiblingBeforeDrag = undefined;
    }

    private readonly handleStart = (event: SortableEvent) => {
        this.orderBeforeDrag = this.readOrder();
        this.nextSiblingBeforeDrag = event.item.nextElementSibling ?? undefined;
        this.container?.classList.add(DRAGGING_CONTAINER_CLASS);
        this.elevate(event.item);
    };

    private readonly handleEnd = (event: SortableEvent) => {
        this.container?.classList.remove(DRAGGING_CONTAINER_CLASS);
        this.keepElevatedBriefly(event.item);

        const order = this.readOrder();
        const id = event.item.dataset.reorderId;
        const fromIndex = this.orderBeforeDrag.indexOf(id);
        const toIndex = order.indexOf(id);
        const nextSibling = this.nextSiblingBeforeDrag;
        this.orderBeforeDrag = [];
        this.nextSiblingBeforeDrag = undefined;

        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
            return;
        }

        if (this.options.revertDrop) {
            this.putBack(event.item, nextSibling);
        }

        this.options.onReorder({ order, fromIndex, toIndex });
    };

    private putBack(item: HTMLElement, nextSibling?: Element) {
        const isStillInList = nextSibling?.parentNode === this.container;
        this.container.insertBefore(item, isStillInList ? nextSibling : null);
    }

    private changeDirection(direction?: ReorderDirection) {
        if (!direction || direction === this.direction) {
            return;
        }

        this.direction = direction;
        this.sortable.option('direction', direction);
    }

    private getDraggableItems(container: HTMLElement): Element[] {
        return [...container.children].filter((child) =>
            child.matches(this.options.draggable)
        );
    }

    private readOrder(): string[] {
        const children = [...(this.container?.children ?? [])];

        return children
            .filter((child): child is HTMLElement => {
                return (
                    child instanceof HTMLElement &&
                    child.dataset.reorderId !== undefined
                );
            })
            .map((child) => child.dataset.reorderId);
    }

    private elevate(item: HTMLElement) {
        this.removeElevation();
        item.classList.add(ELEVATED_ITEM_CLASS);
        this.elevatedItem = item;
    }

    private keepElevatedBriefly(item: HTMLElement) {
        this.elevate(item);
        this.elevationTimeout = setTimeout(
            () => this.removeElevation(),
            ELEVATION_DURATION_MS
        );
    }

    private removeElevation() {
        clearTimeout(this.elevationTimeout);
        this.elevationTimeout = undefined;
        this.elevatedItem?.classList.remove(ELEVATED_ITEM_CLASS);
        this.elevatedItem = undefined;
    }
}
