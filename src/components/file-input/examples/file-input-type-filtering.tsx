import { FileInfo } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Example of a file input component with type filtering
 */
@Component({
    tag: 'limel-example-file-input-type-filtering',
    shadow: true,
})
export class FileInputTypeFilteringExample {
    @State()
    private disabled = false;

    @State()
    private readonly = false;

    @State()
    private multiple = false;

    @State()
    private files: FileInfo[] = [];

    public render() {
        return [
            <limel-file-input
                onFilesSelected={this.handleFilesSelected}
                accept="image/*"
                disabled={this.disabled || this.readonly}
                multiple={this.multiple}
            >
                <limel-button label="Select an image" />
            </limel-file-input>,
            this.files.map((file) => (
                <limel-chip
                    identifier={file.id}
                    text={file.filename}
                    icon={file.icon}
                    disabled={this.disabled}
                    readonly={this.readonly}
                    removable={true}
                    onRemove={this.handleRemove}
                />
            )),
            <limel-example-controls>
                <limel-checkbox
                    checked={this.disabled}
                    label="Disabled"
                    onChange={this.setDisabled}
                />
                <limel-checkbox
                    checked={this.readonly}
                    label="Readonly"
                    onChange={this.setReadonly}
                />
                <limel-checkbox
                    checked={this.multiple}
                    label="Multiple"
                    onChange={this.setMultiple}
                />
            </limel-example-controls>,
            <limel-example-value value={this.files} />,
        ];
    }

    private handleFilesSelected = (event: CustomEvent<FileInfo[]>) => {
        this.files = [...this.files.concat(event.detail)];
    };

    private handleRemove = (event: CustomEvent<string | number>) => {
        this.files = this.files.filter((file) => file.id !== event.detail);
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };

    private setMultiple = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.multiple = event.detail;
    };
}
