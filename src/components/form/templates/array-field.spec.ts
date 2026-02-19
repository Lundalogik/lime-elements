import { ArrayFieldTemplate } from './array-field';

function createTemplate() {
    return new ArrayFieldTemplate({
        items: [],
        schema: { type: 'array', items: { type: 'string' } },
        formData: [],
        formContext: { schema: {} },
        title: 'Test',
        canAdd: false,
        onAddClick: vi.fn(),
        disabled: false,
        readonly: false,
    } as any);
}

describe('ArrayFieldTemplate', () => {
    describe('readOrderFromDom()', () => {
        it('ignores nested array items when reading order', () => {
            const template = createTemplate();

            const container = document.createElement('div');

            const item0 = document.createElement('div');
            item0.className = 'array-item';
            item0.dataset.reorderId = '0';

            // Simulate a nested array field rendering its own `.array-item`s
            // inside a parent item (e.g. when a collapsible section is expanded).
            const nested0 = document.createElement('div');
            nested0.className = 'array-item';
            nested0.dataset.reorderId = '0';
            item0.append(nested0);

            const item1 = document.createElement('div');
            item1.className = 'array-item';
            item1.dataset.reorderId = '1';

            container.append(item0, item1);

            (template as any).container = container;

            expect((template as any).readOrderFromDom()).toEqual([0, 1]);
        });
    });
});
