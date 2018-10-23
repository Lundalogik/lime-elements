import { Component, Prop } from '@stencil/core';

@Component({
    tag: 'limel-badge',
    shadow: true,
    styleUrl: 'badge.scss',
})
export class Badge {
    /**
     * Size of the icon. Possible values: `x-small`, `small`, `medium`, `large`
     */
    @Prop({ reflectToAttr: true })
    public size: string;

    /**
     * Name of the icon to use in the badge
     */
    @Prop({ reflectToAttr: true })
    public icon: string;

    public render() {
        return <limel-icon size={this.size} name={this.icon} />;
    }
}
