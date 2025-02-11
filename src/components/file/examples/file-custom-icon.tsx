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
        if (this.value?.filename?.endsWith('.crab')) {
            this.value.icon = {
                name: 'crab',
                color: 'rgb(var(--color-white))',
                backgroundColor: 'rgb(var(--color-coral-default))',
            };
        }
    }
}
