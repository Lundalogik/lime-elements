import { getMouseEventHandlers } from './3d-tilt-hover-effect';

const TILT = '--limel-3d-hover-effect-rotate3d';
const GLOW = '--limel-3d-hover-effect-glow-position';

const moveMouse = () => {
    document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 20, clientY: 30 })
    );
};

describe('getMouseEventHandlers', () => {
    let element: HTMLElement;

    beforeEach(() => {
        element = document.createElement('div');
        document.body.append(element);
    });

    afterEach(() => {
        element.remove();
    });

    it('tilts the element while it is hovered', () => {
        const { handleMouseEnter } = getMouseEventHandlers(element);

        handleMouseEnter();
        moveMouse();

        expect(element.style.getPropertyValue(TILT)).not.toBe('');
        expect(element.style.getPropertyValue(GLOW)).not.toBe('');
    });

    it('stops tilting once the pointer leaves', () => {
        const { handleMouseEnter, handleMouseLeave } =
            getMouseEventHandlers(element);

        handleMouseEnter();
        handleMouseLeave();
        moveMouse();

        expect(element.style.getPropertyValue(TILT)).toBe('');
    });

    describe('when the element is removed while still hovered', () => {
        // `mouseleave` never fires in this case, so without `cleanup` the
        // listener stays on `document` for the rest of the page's life.
        it('stops tilting once cleaned up', () => {
            const { handleMouseEnter, cleanup } =
                getMouseEventHandlers(element);

            handleMouseEnter();
            element.remove();
            cleanup();
            moveMouse();

            expect(element.style.getPropertyValue(TILT)).toBe('');
        });
    });

    describe('when `mouseenter` fires twice without a `mouseleave`', () => {
        it('leaves no callback behind that `cleanup` cannot reach', () => {
            const { handleMouseEnter, cleanup } =
                getMouseEventHandlers(element);

            handleMouseEnter();
            handleMouseEnter();
            cleanup();
            moveMouse();

            expect(element.style.getPropertyValue(TILT)).toBe('');
        });
    });

    it('does not throw when cleaned up before ever being hovered', () => {
        const { cleanup } = getMouseEventHandlers(element);

        expect(() => cleanup()).not.toThrow();
    });
});
