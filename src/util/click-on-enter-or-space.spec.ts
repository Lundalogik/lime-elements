import { clickOnEnterOrSpace } from './click-on-enter-or-space';

describe('clickOnEnterOrSpace', () => {
    const setup = () => {
        const element = document.createElement('div');
        const child = document.createElement('input');
        element.append(child);
        element.addEventListener('keydown', (event) =>
            clickOnEnterOrSpace(event, element)
        );
        let clicks = 0;
        element.addEventListener('click', () => clicks++);

        return { element, child, clicks: () => clicks };
    };

    const press = (target: HTMLElement, key: string) => {
        const event = new KeyboardEvent('keydown', {
            key: key,
            bubbles: true,
            cancelable: true,
        });
        target.dispatchEvent(event);

        return event;
    };

    it.each([['Enter'], [' ']])('clicks the element on %j', (key) => {
        const { element, clicks } = setup();

        press(element, key);

        expect(clicks()).toBe(1);
    });

    it('prevents the default action, so that Space does not scroll', () => {
        const { element } = setup();

        const event = press(element, ' ');

        expect(event.defaultPrevented).toBe(true);
    });

    it.each([['a'], ['Tab'], ['Escape']])('ignores %j', (key) => {
        const { element, clicks } = setup();

        const event = press(element, key);

        expect(clicks()).toBe(0);
        expect(event.defaultPrevented).toBe(false);
    });

    it('ignores a key pressed in something inside the element', () => {
        const { child, clicks } = setup();

        press(child, 'Enter');

        expect(clicks()).toBe(0);
    });
});
