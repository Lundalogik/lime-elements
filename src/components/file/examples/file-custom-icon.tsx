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

    public componentWillLoad() {
        this.updateIcon();
    }

    public render() {
        return [
            <limel-file
                label="Attach a file"
                onChange={this.handleChange}
                value={this.value}
            />,
            <limel-example-value value={this.value} />,
        ];
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.value = event.detail;
        this.updateIcon();
        console.log('onChange', this.value);
    };

    private updateIcon() {
        if (this.value?.filename?.substr(-5) === '.crab') {
            this.value.icon = 'crab';
            this.value.iconColor = 'rgb(var(--color-white))';
            this.value.iconBackgroundColor = 'rgb(var(--color-coral-default))';
        }
    }
}
