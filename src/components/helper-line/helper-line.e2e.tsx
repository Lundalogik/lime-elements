import { render, h } from '@stencil/vitest';

describe('limel-helper-line', () => {
    describe('renders when given valid props', () => {
        let root: HTMLElement;
        let waitForChanges: () => Promise<void>;
        let setProps: (props: Record<string, any>) => void;

        beforeEach(async () => {
            const result = await render(
                <limel-helper-line
                    helperText="Help"
                    length={10}
                    maxLength={20}
                    helperTextId="Identify"
                    invalid={true}
                ></limel-helper-line>
            );
            root = result.root;
            waitForChanges = result.waitForChanges;
            setProps = result.setProps;
            await waitForChanges();
        });

        it('displays the correct helper text', () => {
            const helperText = root.shadowRoot.querySelector('.helper-text');
            expect(helperText.textContent).toEqual('Help');
        });

        it('displays correct counter', () => {
            const counter = root.shadowRoot.querySelector('.counter');
            expect(counter.textContent).toEqual('10 / 20');
        });

        it('the component gets the correct id', () => {
            const helperText = root.shadowRoot.querySelector('.helper-text');
            expect(helperText.getAttribute('id')).toEqual('Identify');
        });

        it('the component gets the `invalid` class', () => {
            expect(root.classList.contains('invalid')).toBe(true);
        });

        describe('when changing the `length`, the counter is updated', () => {
            beforeEach(async () => {
                setProps({ length: 12 });
                await waitForChanges();
            });

            it('displays the new counter', () => {
                const counter = root.shadowRoot.querySelector('.counter');
                expect(counter.textContent).toEqual('12 / 20');
            });
        });
    });
});
