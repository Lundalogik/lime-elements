import { vi } from 'vitest';
import { ArrayField } from './array-field';
import { ARRAY_REORDER_EVENT } from '../templates/array-field';

function createField(overrides: Record<string, unknown> = {}) {
    const props = {
        formData: ['a', 'b', 'c'],
        schema: { type: 'array', items: { type: 'string' } },
        registry: { rootSchema: {} },
        onChange: vi.fn(),
        fieldPathId: { $id: 'root_tags', path: ['tags'] },
        ...overrides,
    };

    return { field: new ArrayField(props as any), props };
}

it('handleReorder reorders formData and calls onChange', () => {
    const { field, props } = createField();

    const wrapper = document.createElement('div');
    (field as any).setWrapper(wrapper);

    wrapper.dispatchEvent(
        new CustomEvent(ARRAY_REORDER_EVENT, {
            bubbles: true,
            detail: { fromIndex: 0, toIndex: 2 },
        })
    );

    expect(props.onChange).toHaveBeenCalledWith(['b', 'c', 'a'], ['tags']);
});

it('handleReorder does nothing when formData is not an array', () => {
    const { field, props } = createField({ formData: null });

    const wrapper = document.createElement('div');
    (field as any).setWrapper(wrapper);

    wrapper.dispatchEvent(
        new CustomEvent(ARRAY_REORDER_EVENT, {
            bubbles: true,
            detail: { fromIndex: 0, toIndex: 1 },
        })
    );

    expect(props.onChange).not.toHaveBeenCalled();
});

it('handleReorder cleans up listener on unmount', () => {
    const { field, props } = createField();

    const wrapper = document.createElement('div');
    (field as any).setWrapper(wrapper);
    field.componentWillUnmount();

    wrapper.dispatchEvent(
        new CustomEvent(ARRAY_REORDER_EVENT, {
            bubbles: true,
            detail: { fromIndex: 0, toIndex: 1 },
        })
    );

    expect(props.onChange).not.toHaveBeenCalled();
});
