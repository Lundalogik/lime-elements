import { FileInfo } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Custom icon and color
 * This component automatically visualizes the file type, based on the extension
 * of the selected file. The visualization is done by displaying a colorful icon
 * along with the filename, for the most common file types.
 *
 * However, you can also customize the icon and its fill color & background color.
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

    private toggleRequired = () => {
        this.required = !this.required;
    };
}
