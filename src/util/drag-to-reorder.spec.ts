import Sortable, { SortableEvent } from 'sortablejs';
import {
    DragToReorder,
    DragToReorderOptions,
    ReorderEvent,
} from './drag-to-reorder';

vi.mock('sortablejs', () => ({
    default: { create: vi.fn() },
}));

const DRAGGABLE = '.item[data-reorderable="true"]';
const DRAGGING_CLASS = 'has-an-item-which-is-being-dragged';
const ELEVATED_CLASS = 'is-elevated';

// A test that does not tear down its drag would leave a timer running for the
// next test.
const created: DragToReorder[] = [];

beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(Sortable.create).mockReset();
});

afterEach(() => {
    for (const dragToReorder of created.splice(0)) {
        dragToReorder.teardown();
    }

    vi.useRealTimers();
});

function createDragToReorder(options?: Partial<DragToReorderOptions>) {
    const sortable = { destroy: vi.fn(), option: vi.fn() };
    vi.mocked(Sortable.create).mockReturnValue(sortable as unknown as Sortable);
    const onReorder = vi.fn<(event: ReorderEvent) => void>();
    const dragToReorder = new DragToReorder({
        draggable: DRAGGABLE,
        onReorder: onReorder,
        ...options,
    });
    created.push(dragToReorder);

    return { dragToReorder, onReorder, sortable };
}

function createItem(id: string, reorderable = true) {
    const item = document.createElement('div');
    item.className = 'item';
    item.dataset.reorderId = id;
    item.dataset.reorderable = String(reorderable);

    return item;
}

function createList(...ids: string[]): [HTMLElement, ...HTMLElement[]] {
    const items = ids.map((id) => createItem(id));
    const list = document.createElement('div');
    list.append(...items);

    return [list, ...items];
}

function sortableOptions() {
    return vi.mocked(Sortable.create).mock.calls.at(-1)[1];
}

function startDrag(item: HTMLElement) {
    sortableOptions().onStart({ item } as SortableEvent);
}

function drop(item: HTMLElement) {
    sortableOptions().onEnd({ item } as SortableEvent);
}

function drag(list: HTMLElement, item: HTMLElement, newOrder: HTMLElement[]) {
    startDrag(item);
    list.append(...newOrder);
    drop(item);
}

describe('DragToReorder', () => {
    describe('setup()', () => {
        it('lets the user drag the items from their drag handle', () => {
            const { dragToReorder } = createDragToReorder();
            const [list] = createList('a', 'b');

            dragToReorder.setup(list);

            expect(sortableOptions()).toMatchObject({
                handle: '[data-drag-handle]',
                draggable: DRAGGABLE,
            });
        });

        it('starts a drag on touch only after a long press, so that scrolling still works', () => {
            const { dragToReorder } = createDragToReorder();
            const [list] = createList('a', 'b');

            dragToReorder.setup(list);

            expect(sortableOptions()).toMatchObject({
                delay: 200,
                delayOnTouchOnly: true,
            });
        });

        it('has nothing to reorder when fewer than two items can be dragged', () => {
            const { dragToReorder } = createDragToReorder();
            const [list] = createList('a');
            list.append(createItem('b', false));

            dragToReorder.setup(list);

            expect(Sortable.create).not.toHaveBeenCalled();
        });

        it('stops the drag when the list no longer has two items to reorder', () => {
            const { dragToReorder, sortable } = createDragToReorder();
            const [list, , b] = createList('a', 'b');
            dragToReorder.setup(list);

            b.remove();
            dragToReorder.setup(list);

            expect(sortable.destroy).toHaveBeenCalledOnce();
        });

        it('keeps the drag when set up again for the same list', () => {
            const { dragToReorder, sortable } = createDragToReorder();
            const [list] = createList('a', 'b');

            dragToReorder.setup(list);
            dragToReorder.setup(list);

            expect(Sortable.create).toHaveBeenCalledOnce();
            expect(sortable.destroy).not.toHaveBeenCalled();
        });

        it('tells SortableJS which way the items are laid out', () => {
            const { dragToReorder } = createDragToReorder();
            const [list] = createList('a', 'b');

            dragToReorder.setup(list, 'horizontal');

            expect(sortableOptions()).toMatchObject({
                direction: 'horizontal',
            });
        });

        it('lets SortableJS find out the direction when it is not given', () => {
            const { dragToReorder } = createDragToReorder();
            const [list] = createList('a', 'b');

            dragToReorder.setup(list);

            expect(sortableOptions()).not.toHaveProperty('direction');
        });

        it('follows a change of direction without starting over', () => {
            const { dragToReorder, sortable } = createDragToReorder();
            const [list] = createList('a', 'b');
            dragToReorder.setup(list, 'horizontal');

            dragToReorder.setup(list, 'horizontal');
            expect(sortable.option).not.toHaveBeenCalled();

            dragToReorder.setup(list, 'vertical');
            expect(sortable.option).toHaveBeenCalledExactlyOnceWith(
                'direction',
                'vertical'
            );
            expect(Sortable.create).toHaveBeenCalledOnce();
        });

        it('keeps the direction when set up again without one', () => {
            const { dragToReorder, sortable } = createDragToReorder();
            const [list] = createList('a', 'b');
            dragToReorder.setup(list, 'horizontal');

            dragToReorder.setup(list);

            expect(sortable.option).not.toHaveBeenCalled();
        });

        it('moves the drag to another list', () => {
            const { dragToReorder, sortable } = createDragToReorder();
            const [list] = createList('a', 'b');
            const [other] = createList('c', 'd');
            dragToReorder.setup(list);

            dragToReorder.setup(other);

            expect(sortable.destroy).toHaveBeenCalledOnce();
            expect(vi.mocked(Sortable.create).mock.calls.at(-1)[0]).toBe(other);
        });
    });

    describe('when the user drops an item in a new place', () => {
        it('reports the new order and where the item moved from and to', () => {
            const { dragToReorder, onReorder } = createDragToReorder();
            const [list, a, b, c] = createList('a', 'b', 'c');
            dragToReorder.setup(list);

            drag(list, a, [b, c, a]);

            expect(onReorder).toHaveBeenCalledExactlyOnceWith({
                order: ['b', 'c', 'a'],
                fromIndex: 0,
                toIndex: 2,
            });
        });

        it('puts the item back when asked to, and still reports the new order', () => {
            const { dragToReorder, onReorder } = createDragToReorder({
                revertDrop: true,
            });
            const [list, a, b, c] = createList('a', 'b', 'c');
            dragToReorder.setup(list);

            drag(list, a, [b, c, a]);

            expect([...list.children]).toEqual([a, b, c]);
            expect(onReorder).toHaveBeenCalledExactlyOnceWith({
                order: ['b', 'c', 'a'],
                fromIndex: 0,
                toIndex: 2,
            });
        });

        it('leaves the item where it was dropped otherwise', () => {
            const { dragToReorder } = createDragToReorder();
            const [list, a, b, c] = createList('a', 'b', 'c');
            dragToReorder.setup(list);

            drag(list, a, [b, c, a]);

            expect([...list.children]).toEqual([b, c, a]);
        });

        it('counts the items that cannot be dragged', () => {
            const { dragToReorder, onReorder } = createDragToReorder();
            const [list, a, b] = createList('a', 'b');
            const fixed = createItem('fixed', false);
            list.prepend(fixed);
            dragToReorder.setup(list);

            drag(list, b, [fixed, b, a]);

            expect(onReorder).toHaveBeenCalledExactlyOnceWith({
                order: ['fixed', 'b', 'a'],
                fromIndex: 2,
                toIndex: 1,
            });
        });

        it('ignores items nested inside the items', () => {
            const { dragToReorder, onReorder } = createDragToReorder();
            const [list, a, b] = createList('a', 'b');
            a.append(createItem('nested'));
            dragToReorder.setup(list);

            drag(list, a, [b, a]);

            expect(onReorder).toHaveBeenCalledExactlyOnceWith({
                order: ['b', 'a'],
                fromIndex: 0,
                toIndex: 1,
            });
        });

        it('reports nothing when the item is dropped where it was', () => {
            const { dragToReorder, onReorder } = createDragToReorder();
            const [list, a, b] = createList('a', 'b');
            dragToReorder.setup(list);

            drag(list, a, [a, b]);

            expect(onReorder).not.toHaveBeenCalled();
        });
    });

    describe('while the user drags an item', () => {
        it('marks the list until the item is dropped', () => {
            const { dragToReorder } = createDragToReorder();
            const [list, a] = createList('a', 'b');
            dragToReorder.setup(list);

            startDrag(a);
            expect(list.classList.contains(DRAGGING_CLASS)).toBe(true);

            drop(a);
            expect(list.classList.contains(DRAGGING_CLASS)).toBe(false);
        });

        it('elevates the item, and keeps it elevated for a second after the drop', () => {
            const { dragToReorder } = createDragToReorder();
            const [list, a] = createList('a', 'b');
            dragToReorder.setup(list);

            startDrag(a);
            expect(a.classList.contains(ELEVATED_CLASS)).toBe(true);

            drop(a);
            vi.advanceTimersByTime(999);
            expect(a.classList.contains(ELEVATED_CLASS)).toBe(true);

            vi.advanceTimersByTime(1);
            expect(a.classList.contains(ELEVATED_CLASS)).toBe(false);
        });

        it('lowers the previous item when another one is dragged straight away', () => {
            const { dragToReorder } = createDragToReorder();
            const [list, a, b] = createList('a', 'b');
            dragToReorder.setup(list);
            startDrag(a);
            drop(a);

            startDrag(b);
            vi.advanceTimersByTime(1000);

            expect(a.classList.contains(ELEVATED_CLASS)).toBe(false);
            expect(b.classList.contains(ELEVATED_CLASS)).toBe(true);
        });
    });

    describe('teardown()', () => {
        it('stops the drag and clears what the drag added', () => {
            const { dragToReorder, sortable } = createDragToReorder();
            const [list, a] = createList('a', 'b');
            dragToReorder.setup(list);
            startDrag(a);

            dragToReorder.teardown();

            expect(sortable.destroy).toHaveBeenCalledOnce();
            expect(a.classList.contains(ELEVATED_CLASS)).toBe(false);
            expect(list.classList.contains(DRAGGING_CLASS)).toBe(false);
        });

        it('leaves no timer running', () => {
            const { dragToReorder } = createDragToReorder();
            const [list, a] = createList('a', 'b');
            dragToReorder.setup(list);
            drop(a);

            dragToReorder.teardown();

            expect(vi.getTimerCount()).toBe(0);
        });
    });
});
