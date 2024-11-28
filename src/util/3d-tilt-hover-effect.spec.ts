import { apply3DTiltHoverEffect } from './3d-tilt-hover-effect';

describe('apply3DTiltHoverEffect', () => {
    it('creates and appends a glow element if missing', () => {
        const element = document.createElement('div');
        apply3DTiltHoverEffect(element);

        expect(element.querySelector('limel-3d-hover-effect-glow')).toBeDefined();
    });

    it('does not duplicate the glow element if it already exists', () => {
        const element = document.createElement('div');
        const existingGlowElement = document.createElement('limel-3d-hover-effect-glow');
        element.appendChild(existingGlowElement);
        apply3DTiltHoverEffect(element);

        expect(element.querySelectorAll('limel-3d-hover-effect-glow').length).toBe(1);
    });
});
