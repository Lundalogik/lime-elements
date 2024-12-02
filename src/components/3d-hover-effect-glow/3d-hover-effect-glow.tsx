import { Component, h } from '@stencil/core';
/**
 * This component enhances the visual effects, when the `tiltFollowingTheCursor`
 * utility function from `3d-tilt-hover-effect.ts` is implemented in a component.
 *
 * This component should be added to the HTML structure of the consumer component.
 *
 * This component carries its own styles which are needed to create a glow effect on the
 * 3D element within the parent element, when the parent is hovered.
 *
 * The parent element must be using the `tiltFollowingTheCursor` utility function
 * imported from `3d-tilt-hover-effect.ts`. This function will dynamically
 * affect parts of the styles of this 3D glow effect.
 *
 * @private
 */
@Component({
    tag: 'limel-3d-hover-effect-glow',
    shadow: true,
    styleUrl: '3d-hover-effect-glow.scss',
})
export class HoverEffectGlowComponent {
    public render() {
        return <div />;
    }
}
