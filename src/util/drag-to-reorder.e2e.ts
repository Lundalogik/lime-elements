import Sortable from 'sortablejs';
import { DragToReorder, DragToReorderOptions } from './drag-to-reorder';

const created: DragToReorder[] = [];

afterEach(() => {
    for (const dragToReorder of created.splice(0)) {
        dragToReorder.teardown();
    }

    vi.restoreAllMocks();
    document.body.replaceChildren();
});

const dragWithItsOwnGhost = () => {
    const create = Sortable.create.bind(Sortable);
    vi.spyOn(Sortable, 'create').mockImplementation((element, options) =>
        create(element, { ...options, forceFallback: true })
    );
};

const renderList = (...ids: string[]) => {
    const list = document.createElement('div');
    for (const id of ids) {
        const item = document.createElement('div');
        item.dataset.reorderId = id;
        item.style.height = '3rem';
        const handle = document.createElement('button');
        handle.dataset.dragHandle = '';
        handle.textContent = id;
        item.append(handle);
        list.append(item);
    }

    document.body.append(list);

    return list;
};

const setUp = (list: HTMLElement, options?: Partial<DragToReorderOptions>) => {
    const onReorder = vi.fn();
    const dragToReorder = new DragToReorder({
        draggable: '[data-reorder-id]',
        onReorder: onReorder,
        ...options,
    });
    created.push(dragToReorder);
    dragToReorder.setup(list);

    return onReorder;
};

const itemOf = (list: HTMLElement, id: string) =>
    list.querySelector<HTMLElement>(`:scope > [data-reorder-id="${id}"]`);

const handleOf = (list: HTMLElement, id: string) =>
    itemOf(list, id).querySelector<HTMLElement>(':scope [data-drag-handle]');

const centerOf = (element: Element) => {
    const box = element.getBoundingClientRect();

    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
};

const firePointer = (
    target: EventTarget,
    type: string,
    point: { x: number; y: number }
) =>
    target.dispatchEvent(
        new PointerEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: point.x,
            clientY: point.y,
            pointerId: 1,
            pointerType: 'mouse',
            isPrimary: true,
            button: 0,
            buttons: 1,
        })
    );

const nextFrame = () =>
    new Promise((resolve) => requestAnimationFrame(resolve));

const dragWithPointer = async (handle: HTMLElement, target: HTMLElement) => {
    const from = centerOf(handle);
    const to = centerOf(target);
    const steps = 8;
    const list = target.parentElement;
    const item = handle.closest('[data-reorder-id]');
    const indexOf = (element: Element) => [...list.children].indexOf(element);
    const targetIndex = indexOf(target);

    firePointer(handle, 'pointerdown', from);
    for (let step = 1; step <= steps; step++) {
        firePointer(document, 'pointermove', {
            x: from.x + ((to.x - from.x) * step) / steps,
            y: from.y + ((to.y - from.y) * step) / steps,
        });
        await nextFrame();
    }

    // With its own ghost, SortableJS only checks where the pointer is every
    // 50 ms, so hold still until it has moved the item there.
    await vi.waitFor(() => expect(indexOf(item)).toBe(targetIndex));

    firePointer(document, 'pointerup', to);
    await nextFrame();
};

const waitForTheAnimationToEnd = () =>
    new Promise((resolve) => setTimeout(resolve, 200));

const idsOf = (list: HTMLElement) =>
    [...list.children].map((item) => (item as HTMLElement).dataset.reorderId);

describe('when SortableJS drags with a ghost of its own, as it does on touch screens', () => {
    beforeEach(dragWithItsOwnGhost);

    it('puts the last item back where it was, and reports the new order', async () => {
        const list = renderList('a', 'b', 'c');
        const onReorder = setUp(list, { revertDrop: true });

        await dragWithPointer(handleOf(list, 'c'), itemOf(list, 'a'));

        await vi.waitFor(() => expect(onReorder).toHaveBeenCalledOnce());
        expect(onReorder.mock.calls[0][0]).toEqual({
            order: ['c', 'a', 'b'],
            fromIndex: 2,
            toIndex: 0,
        });
        expect(idsOf(list)).toEqual(['a', 'b', 'c']);
    });

    it('lets the user drag again after the last item has been dropped', async () => {
        const list = renderList('a', 'b', 'c');
        const onReorder = setUp(list, { revertDrop: true });
        await dragWithPointer(handleOf(list, 'c'), itemOf(list, 'a'));
        await vi.waitFor(() => expect(onReorder).toHaveBeenCalledOnce());
        await waitForTheAnimationToEnd();

        await dragWithPointer(handleOf(list, 'a'), itemOf(list, 'b'));

        await vi.waitFor(() => expect(onReorder).toHaveBeenCalledTimes(2));
    });

    it('leaves the last item where it was dropped, unless asked to put it back', async () => {
        const list = renderList('a', 'b', 'c');
        const onReorder = setUp(list);

        await dragWithPointer(handleOf(list, 'c'), itemOf(list, 'a'));

        await vi.waitFor(() => expect(onReorder).toHaveBeenCalledOnce());
        expect(idsOf(list)).toEqual(['c', 'a', 'b']);
    });
});
