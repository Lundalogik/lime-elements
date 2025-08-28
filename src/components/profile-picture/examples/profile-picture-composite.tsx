import { FileInfo } from '@limetech/lime-elements';
import { Component, h, Host, State } from '@stencil/core';

/**
 * Composite
 */
@Component({
    tag: 'limel-example-profile-picture-composite',
    shadow: true,
    styleUrl: 'profile-picture-basic.scss',
})
export class ProfilePictureCompositeExample {
    @State()
    private value: FileInfo = {
        filename: 'me.png',
        id: 1,
        href: 'https://avatars.githubusercontent.com/u/9919?v=4',
    };

    @State()
    private disabled: boolean = false;

    @State()
    private readonly: boolean = false;

    @State()
    private invalid: boolean = false;

    @State()
    private loading = false;
    public render() {
        return (
            <Host>
                <limel-profile-picture
                    value={this.value}
                    disabled={this.disabled}
                    readonly={this.readonly}
                    invalid={this.invalid}
                    loading={this.loading}
                    onChange={this.handleChange}
                />
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
                        checked={this.invalid}
                        label="Invalid"
                        onChange={this.setInvalid}
                    />
                    <limel-checkbox
                        label="Loading"
                        checked={this.loading}
                        onChange={this.setLoading}
                    />
                </limel-example-controls>
            </Host>
        );
    }

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };

    private setInvalid = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.invalid = event.detail;
    };

    private setLoading = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.loading = event.detail;
    };

    private handleChange = (event: CustomEvent<FileInfo | undefined>) => {
        this.value = event.detail;
        console.log('onChange', this.value);
    };
}
