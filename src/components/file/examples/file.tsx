import { FileInfo } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Basic example
 */
@Component({
    tag: 'limel-example-file',
    shadow: true,
})
export class FileExample {
    @State()
    private value: FileInfo = {
        filename: 'cute-cat.jpg',
        id: 123,
        href: 'https://www.boredpanda.com/blog/wp-content/uploads/2014/02/funny-wet-cats-36.jpg',
    };

    @State()
    private required = false;

    @State()
    private disabled = false;

    @State()
    private readonly = false;

    @State()
    private invalid = false;

    public render() {
        return [
            <limel-file
                label="Attach a file"
                onChange={this.handleChange}
                required={this.required}
                value={this.value}
                disabled={this.disabled}
                readonly={this.readonly}
                invalid={this.invalid}
            />,
            <limel-example-controls>
                <limel-switch
                    value={this.disabled}
                    label="Disabled"
                    onChange={this.setDisabled}
                />
                <limel-switch
                    value={this.readonly}
                    label="Readonly"
                    onChange={this.setReadonly}
                />
                <limel-switch
                    value={this.required}
                    label="Required"
                    onChange={this.setRequired}
                />
                <limel-switch
                    value={this.invalid}
                    label="Invalid"
                    onChange={this.setInvalid}
                />
            </limel-example-controls>,
            <limel-example-value value={this.value} />,
        ];
    }

    private handleChange = (event: CustomEvent<FileInfo>) => {
        this.value = event.detail;
        console.log('onChange', this.value);
    };

    private setRequired = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.required = !!event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = !!event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = !!event.detail;
    };

    private setInvalid = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.invalid = event.detail;
    };
}
