import { createLiveMessage } from './live-message';

describe('createLiveMessage', () => {
    let element: HTMLElement;
    let message: string;

    const setUp = () => {
        const liveMessage = createLiveMessage(() => message);
        liveMessage.setElement(element);

        return liveMessage;
    };

    beforeEach(() => {
        vi.useFakeTimers();
        element = document.createElement('span');
        message = '';
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('writes the message a short while after the update', () => {
        const { update } = setUp();
        message = 'Three suggestions';

        update();
        expect(element.textContent).toBe('');

        vi.advanceTimersByTime(500);
        expect(element.textContent).toBe('Three suggestions');
    });

    it('writes only the last message when it is updated again within the pause', () => {
        const getMessage = vi.fn(() => message);
        const liveMessage = createLiveMessage(getMessage);
        liveMessage.setElement(element);

        message = 'Two suggestions';
        liveMessage.update();
        vi.advanceTimersByTime(300);
        message = 'Three suggestions';
        liveMessage.update();
        vi.advanceTimersByTime(500);

        expect(getMessage).toHaveBeenCalledTimes(1);
        expect(element.textContent).toBe('Three suggestions');
    });

    it('clears the element when the message is empty', () => {
        const { update } = setUp();
        message = 'Three suggestions';
        update();
        vi.advanceTimersByTime(500);

        message = '';
        update();
        vi.advanceTimersByTime(500);

        expect(element.textContent).toBe('');
    });

    it('does not write a message that is already there', () => {
        const { update } = setUp();
        message = 'Three suggestions';
        update();
        vi.advanceTimersByTime(500);
        const observer = vi.fn();
        new MutationObserver(observer).observe(element, {
            childList: true,
            characterData: true,
            subtree: true,
        });

        update();
        vi.advanceTimersByTime(500);

        expect(observer).not.toHaveBeenCalled();
    });

    it('does nothing when there is no element', () => {
        const getMessage = vi.fn(() => message);
        const { update } = createLiveMessage(getMessage);

        update();
        vi.advanceTimersByTime(500);

        expect(getMessage).not.toHaveBeenCalled();
    });

    it('does not write after it is cancelled', () => {
        const { update } = setUp();
        message = 'Three suggestions';

        update();
        update.cancel();
        vi.advanceTimersByTime(500);

        expect(element.textContent).toBe('');
    });
});
