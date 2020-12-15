import { FileInfo } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Custom icon and color
 */
@Component({
    tag: 'limel-example-file-custom-icon',
    shadow: true,
})
export class FileCustomIconExample {
    @State()
    private value: FileInfo = { filename: 'custom.crab', id: 123 };

    @State()
    private required = false;

    constructor() {
        this.handleChange = this.handleChange.bind(this);
        this.toggleRequired = this.toggleRequired.bind(this);
    }

    public componentWillLoad() {
        this.updateIcon();
    }

    public render() {
        return [
            <limel-file
                label="Attach a file"
                onChange={this.handleChange}
                required={this.required}
                value={this.value}
            />,
            <limel-flex-container justify="end">
                <limel-switch
                    label="Toggle required"
                    value={this.required}
                    onChange={this.toggleRequired}
                />
            </limel-flex-container>,
        ];
    }

    private handleChange(event) {
        this.value = event.detail;
        this.updateIcon();
        console.log('onChange', this.value);
    }

    private updateIcon() {
        if (this.value?.filename?.substr(-5) === '.crab') {
            this.value.icon = 'crab';
            this.value.iconColor = 'white';
            this.value.iconBackgroundColor = 'pink';
        }
    }

    private toggleRequired() {
        this.required = !this.required;
    }
}
