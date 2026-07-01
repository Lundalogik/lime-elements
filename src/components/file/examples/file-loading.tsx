import { FileInfo } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Loading
 *
 * Set the `loading` prop to `true` to put the whole component in an
 * indeterminate busy state, rendering a spinner and setting `aria-busy` on the
 * component. This is the component's own loading state, controlled entirely by
 * the consumer: it is shown whether or not a file is selected, and stays until
 * you set `loading` back to `false`. Use it for work that has no measurable
 * percentage, such as reading a selected file's metadata.
 *
 * :::note
 * Setting `loading` does _not_ disable the interactivity of the component. If
 * it should be disabled meanwhile, set `disabled` separately.
 * :::
 *
 * To reflect a busy state on an individual file instead, set `loading` on that
 * file — see the per-file loading example.
 */
@Component({
    tag: 'limel-example-file-loading',
    shadow: true,
})
export class FileLoadingExample {
    @State()
    private value: FileInfo = {
        filename: 'annual-report.pdf',
        id: 1,
    };

    @State()
    private loading = false;

    public render() {
        return (
            <Host>
                <limel-file
                    label="Attach a file"
                    value={this.value}
                    loading={this.loading}
                    onChange={this.handleChange}
                />
                <limel-example-controls>
                    <limel-switch
                        label="Loading"
                        value={this.loading}
                        onChange={this.setLoading}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.value = event.detail;
    };

    private setLoading = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.loading = event.detail;
    };
}
