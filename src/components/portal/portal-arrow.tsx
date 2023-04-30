import { Component, h, Host } from '@stencil/core';

/**
 * @private
 */
@Component({
    tag: 'limel-portal-arrow',
    shadow: false,
    styleUrl: 'portal-arrow.scss',
})
export class PortalArrow {
    public render() {
        return <Host id="arrow" data-popper-arrow />;
    }
}
