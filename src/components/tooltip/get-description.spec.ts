import { getDescription } from './get-description';

describe('getDescription()', () => {
    function createOwner(
        props: {
            ariaLabel?: string;
            text?: string;
            childAriaLabel?: string;
            parts?: string[];
        } = {}
    ): HTMLElement {
        const owner = document.createElement('button');
        if (props.ariaLabel) {
            owner.setAttribute('aria-label', props.ariaLabel);
        }
        owner.textContent = props.text ?? '';
        if (props.childAriaLabel) {
            const child = document.createElement('span');
            child.setAttribute('aria-label', props.childAriaLabel);
            owner.append(child);
        }
        const parts = props.parts ?? [];
        for (const text of parts) {
            const part = document.createElement('span');
            part.textContent = text;
            owner.append(part);
        }

        return owner;
    }

    it('returns the label', () => {
        const owner = createOwner({ text: 'Save' });

        expect(getDescription(owner, 'Persist the draft')).toBe(
            'Persist the draft'
        );
    });

    it('returns the label followed by the helper label', () => {
        const owner = createOwner({ text: 'Save' });

        expect(getDescription(owner, 'Persist', 'Saves to the server')).toBe(
            'Persist. Saves to the server'
        );
    });

    describe('when the label repeats the name of the owner', () => {
        it.each([
            ['the aria-label', { ariaLabel: 'Search' }],
            ['the text', { text: 'Search' }],
            ['the text with other letter case', { text: 'SEARCH' }],
            ['the text with other whitespace', { text: '\n  Search  ' }],
            [
                'the aria-label of an element inside',
                { childAriaLabel: 'Search' },
            ],
        ])('returns an empty text for %s', (_, props) => {
            const owner = createOwner(props);

            expect(getDescription(owner, 'Search')).toBe('');
        });

        it('returns only the helper label', () => {
            const owner = createOwner({ ariaLabel: 'Search' });

            expect(getDescription(owner, 'Search', 'Find on this page')).toBe(
                'Find on this page'
            );
        });
    });

    describe('when the owner has an aria-label and other text', () => {
        it('keeps a label that repeats the text, which is not the name', () => {
            const owner = createOwner({ ariaLabel: 'Delete', text: 'Remove' });

            expect(getDescription(owner, 'Remove')).toBe('Remove');
        });

        it('leaves out a label that repeats the aria-label, which is the name', () => {
            const owner = createOwner({ ariaLabel: 'Delete', text: 'Remove' });

            expect(getDescription(owner, 'Delete')).toBe('');
        });

        it('uses the text when the aria-label is blank', () => {
            const owner = createOwner({ ariaLabel: '  ', text: 'Remove' });

            expect(getDescription(owner, 'Remove')).toBe('');
        });
    });

    describe('when the owner is made of parts', () => {
        it('leaves out a label and a helper label that repeat the parts', () => {
            const owner = createOwner({ parts: ['Jan', '42'] });

            expect(getDescription(owner, 'Jan', '42')).toBe('');
        });

        it('keeps a label that says more than the parts', () => {
            const owner = createOwner({ parts: ['Jan', '42'] });

            expect(getDescription(owner, 'Jan (25.00%)', '42')).toBe(
                'Jan (25.00%)'
            );
        });
    });

    it('leaves out a helper label that repeats the name of the owner', () => {
        const owner = createOwner({ ariaLabel: 'Search' });

        expect(getDescription(owner, 'Find', 'Search')).toBe('Find');
    });

    it('keeps a label that only starts like the name of the owner', () => {
        const owner = createOwner({ text: 'Save' });

        expect(getDescription(owner, 'Save as a draft')).toBe(
            'Save as a draft'
        );
    });

    describe('with a hotkey', () => {
        it('ends with the hotkey written out in words', () => {
            const owner = createOwner({ text: 'Save' });

            expect(
                getDescription(
                    owner,
                    'Persist',
                    'Saves to the server',
                    'shift+k'
                )
            ).toBe('Persist. Saves to the server. Shift k');
        });

        it('keeps the hotkey when the label repeats the name', () => {
            const owner = createOwner({ text: 'Save' });

            expect(getDescription(owner, 'Save', undefined, 'shift+k')).toBe(
                'Shift k'
            );
        });

        it('leaves out a hotkey that is not valid', () => {
            const owner = createOwner({ text: 'Save' });

            expect(getDescription(owner, 'Persist', undefined, 'ctrl+')).toBe(
                'Persist'
            );
        });
    });
});
