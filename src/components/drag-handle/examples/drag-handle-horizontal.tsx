import { Component, h, Host, State } from '@stencil/core';
import {
    dragToReorder,
    DragToReorderController,
    DragToReorderFinalizeDetail,
    DragToReorderPreviewDetail,
} from '../../../util/drag-to-reorder';

interface KittenCard {
    id: string;
    image: {
        src: string;
        alt: string;
    };
    subheading: string;
}
/**
 * Horizontal drag handle
 * This example shows how to use the drag handle component
 * along with the drag-to-reorder utility function,
 * in a horizontal drag-and-drop setup.
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
    private dragController?: DragToReorderController;
    private snapshot?: KittenCard[];

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

    private handleClick = () => {
        console.log('Card clicked');
    };

    private setContainer = (element?: HTMLDivElement) => {
        if (this.container === element) {
            return;
        }

        this.teardownDragController();
        this.container = element ?? undefined;
        this.setupDragController();
    };

    private setupDragController() {
        if (!this.container || this.dragController) {
            return;
        }

        this.dragController = dragToReorder({
            container: this.container,
            itemSelector: 'limel-card.kitten-card',
            dragHandleSelector: '[data-drag-handle]',
            orientation: 'horizontal',
            onStart: this.handleDragStart,
            onPreview: this.handleDragPreview,
            onFinalize: this.handleDragFinalize,
        });
    }

    private teardownDragController() {
        this.dragController?.destroy();
        this.dragController = undefined;
    }

    private handleDragStart = () => {
        this.snapshot = [...this.kittens];
    };

    private handleDragPreview = ({
        fromIndex,
        toIndex,
    }: DragToReorderPreviewDetail) => {
        if (fromIndex === toIndex) {
            return;
        }

        this.kittens = this.moveKitten(this.kittens, fromIndex, toIndex);
    };

    private handleDragFinalize = ({
        cancelled,
    }: DragToReorderFinalizeDetail) => {
        if (cancelled && this.snapshot) {
            this.kittens = [...this.snapshot];
        }

        this.snapshot = undefined;
    };

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
        this.teardownDragController();
    }
}
