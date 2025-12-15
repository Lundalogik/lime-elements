import { Component, h, Host, State } from '@stencil/core';
import Sortable, { SortableEvent } from 'sortablejs';

interface KittenCard {
    id: string;
    image: {
        src: string;
        alt: string;
    };
    subheading: string;
}

const DRAG_HANDLE_SELECTOR = '[data-drag-handle]';
const DRAGGABLE_ITEM_SELECTOR = 'limel-card.kitten-card';
const DEFAULT_DRAGGING_CLASS = 'is-being-dragged';
const DEFAULT_CONTAINER_CLASS = 'has-an-item-which-is-being-dragged';
const DEFAULT_DROP_ELEVATION_CLASS = 'is-elevated';
const DROP_ELEVATION_DURATION = 1000;
/**
 * Horizontal drag handle
 * This example shows how to use the drag handle component
 * together with SortableJS to enable horizontal drag-and-drop ordering.
 */
@Component({
    shadow: true,
    tag: 'limel-example-drag-handle-horizontal',
    styleUrl: 'drag-handle-horizontal.scss',
})
export class DragHandleHorizontalExample {
    @State()
    private kittens: KittenCard[] = [
        {
            id: 'kitten-1',
            image: {
                src: 'https://images.unsplash.com/photo-1621238224334-20222c044b84?q=80&w=600&h=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                alt: 'Photo by https://unsplash.com/@paracetamol',
            },
            subheading: "@paracetamol's kitten",
        },
        {
            id: 'kitten-2',
            image: {
                src: 'https://images.unsplash.com/photo-1558674378-e4334d4fecc2?q=80&w=600&h=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                alt: 'Photo by https://unsplash.com/@bliss1002',
            },
            subheading: "@bliss1002's kitten",
        },
        {
            id: 'kitten-3',
            image: {
                src: 'https://images.unsplash.com/photo-1692962063951-0b5c81887f3d?q=80&w=600&h=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                alt: 'Photo by https://unsplash.com/@kmly',
            },
            subheading: "@kmly's kitten",
        },
    ];

    private container?: HTMLDivElement;
    private sortable?: Sortable;
    private dropElevationTimeout?: ReturnType<typeof setTimeout>;
    private dropElevationTarget?: HTMLElement;

    public render() {
        return (
            <Host>
                <h4>Drag & sort these kittens</h4>
                <p>More cute → Less cute</p>
                <div class="kitten-list" ref={this.setContainer}>
                    {this.kittens.map((kitten) => (
                        <limel-card
                            class="kitten-card"
                            key={kitten.id}
                            clickable={true}
                            image={kitten.image}
                            subheading={kitten.subheading}
                            onClick={this.handleClick}
                            data-reorder-id={kitten.id}
                        >
                            <limel-drag-handle
                                dragDirection="horizontal"
                                slot="component"
                            />
                        </limel-card>
                    ))}
                </div>
            </Host>
        );
    }

    private readonly handleClick = (event: MouseEvent) => {
        console.log('Card clicked', event.currentTarget);
    };

    private readonly setContainer = (element?: HTMLDivElement) => {
        if (this.container === element) {
            return;
        }

        this.teardownSortable();
        this.container = element ?? undefined;
        this.setupSortable();
    };

    private setupSortable() {
        if (!this.container) {
            return;
        }

        if (this.sortable) {
            this.sortable.option('handle', DRAG_HANDLE_SELECTOR);
            this.sortable.option('draggable', DRAGGABLE_ITEM_SELECTOR);
            this.sortable.option('disabled', false);
            return;
        }

        this.sortable = Sortable.create(this.container, {
            animation: 150,
            direction: 'horizontal',
            handle: DRAG_HANDLE_SELECTOR,
            draggable: DRAGGABLE_ITEM_SELECTOR,
            chosenClass: DEFAULT_DRAGGING_CLASS,
            onStart: this.handleSortStart,
            onEnd: this.handleSortEnd,
        });
    }

    private teardownSortable() {
        if (this.sortable) {
            this.sortable.destroy();
            this.sortable = undefined;
        }

        this.clearDropElevationTimer();

        if (this.dropElevationTarget) {
            this.dropElevationTarget.classList.remove(
                DEFAULT_DROP_ELEVATION_CLASS
            );
            this.dropElevationTarget = undefined;
        }

        if (this.container) {
            this.container.classList.remove(DEFAULT_CONTAINER_CLASS);
        }
    }

    private readonly handleSortStart = (event: SortableEvent) => {
        if (this.container) {
            this.container.classList.add(DEFAULT_CONTAINER_CLASS);
        }

        if (event.item instanceof HTMLElement) {
            this.applyDropElevation(event.item);
        }
    };

    private readonly handleSortEnd = (event: SortableEvent) => {
        if (this.container) {
            this.container.classList.remove(DEFAULT_CONTAINER_CLASS);
        }

        const { oldIndex, newIndex } = event;

        if (event.item instanceof HTMLElement) {
            this.dropElevationTarget = event.item;
        }

        if (
            typeof oldIndex !== 'number' ||
            typeof newIndex !== 'number' ||
            oldIndex === newIndex
        ) {
            this.scheduleDropElevationRemoval();
            return;
        }

        this.kittens = this.moveKitten(this.kittens, oldIndex, newIndex);
        this.scheduleDropElevationRemoval();
    };

    private applyDropElevation(item: HTMLElement) {
        if (this.dropElevationTarget && this.dropElevationTarget !== item) {
            this.dropElevationTarget.classList.remove(
                DEFAULT_DROP_ELEVATION_CLASS
            );
        }

        this.clearDropElevationTimer();
        item.classList.add(DEFAULT_DROP_ELEVATION_CLASS);
        this.dropElevationTarget = item;
    }

    private scheduleDropElevationRemoval() {
        if (!this.dropElevationTarget) {
            return;
        }

        const target = this.dropElevationTarget;
        this.clearDropElevationTimer();
        this.dropElevationTimeout = globalThis.setTimeout(() => {
            target.classList.remove(DEFAULT_DROP_ELEVATION_CLASS);
            if (this.dropElevationTarget === target) {
                this.dropElevationTarget = undefined;
            }
            this.dropElevationTimeout = undefined;
        }, DROP_ELEVATION_DURATION);
    }

    private clearDropElevationTimer() {
        if (this.dropElevationTimeout !== undefined) {
            clearTimeout(this.dropElevationTimeout);
            this.dropElevationTimeout = undefined;
        }
    }

    private moveKitten(
        list: KittenCard[],
        fromIndex: number,
        toIndex: number
    ): KittenCard[] {
        if (fromIndex === toIndex) {
            return list;
        }

        const updated = [...list];
        const [moved] = updated.splice(fromIndex, 1);

        if (!moved) {
            return list;
        }

        updated.splice(toIndex, 0, moved);
        return updated;
    }

    public disconnectedCallback() {
        this.teardownSortable();
    }
}
