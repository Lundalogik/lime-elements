import { Component, h, Host } from '@stencil/core';
/**
 * This component enhances the visual effects, when the `tiltFollowingTheCursor`
 * utility function from `3d-tilt-hover-effect.ts` is implemented in a component.
 *
 * This component should be added to the HTML structure of the consumer component.
 *
 * Styles of this component are needed to create a glow effect on the
 * 3D element within the when the parent element is hovered.
 * when the `tiltFollowingTheCursor` utility function from `3d-tilt-hover-effect.ts`
 *
 * Parts of these styles are controlled by the `titleFollowingTheCursor` function itself.
 * @private
 */
@Component({
    tag: 'limel-3d-hover-effect-glow',
    shadow: true,
    styleUrl: '3d-hover-effect-glow.scss',
})
export class HoverEffectGlowComponent {
    public render() {
        return <Host />;
    }
}
