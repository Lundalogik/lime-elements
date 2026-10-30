import { setControlledElement } from './controlled-element';

describe('setControlledElement', () => {
    it('writes the id where the browser has no element references', () => {
        const owner = document.createElement('div');

        setControlledElement(owner, 'the-list');

        expect(owner.getAttribute('aria-controls')).toBe('the-list');
    });

    it('removes the id when nothing is controlled', () => {
        const owner = document.createElement('div');
        owner.setAttribute('aria-controls', 'the-list');

        setControlledElement(owner, null);

        expect(owner.hasAttribute('aria-controls')).toBe(false);
    });

    describe('where the browser has element references', () => {
        const createOwner = () =>
            Object.assign(document.createElement('div'), {
                ariaControlsElements: null as Element[] | null,
            });

        it('references the element with the id', () => {
            const owner = createOwner();
            const list = document.createElement('div');
            list.id = 'the-list';
            document.body.append(list);

            setControlledElement(owner, 'the-list');

            expect(owner.ariaControlsElements).toEqual([list]);
            list.remove();
        });

        it('references nothing when no element has the id', () => {
            const owner = createOwner();

            setControlledElement(owner, 'no-such-list');

            expect(owner.ariaControlsElements).toBeNull();
        });

        it('does not throw for an id that is not a valid selector', () => {
            const owner = createOwner();

            expect(() => setControlledElement(owner, '1 list')).not.toThrow();
            expect(owner.ariaControlsElements).toBeNull();
        });
    });
});
