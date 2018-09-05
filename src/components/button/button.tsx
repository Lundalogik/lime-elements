import { Component, Prop } from '@stencil/core';

@Component({
    tag: 'limel-button',
    shadow: true,
    styleUrl: 'button.scss',
})
export class Button {
    @Prop({ reflectToAttr: true })
    public label: string;

    @Prop({ reflectToAttr: true })
    public primary = false;

    @Prop({ reflectToAttr: true })
    public disabled = false;

    @Prop({ reflectToAttr: true })
    public loading = false;

    public render() {
        return (
            <limel-button-inner
                label={this.label}
                primary={this.primary}
                disabled={this.disabled}
                loading={this.loading}
            />
        );
    }
}
