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

    public render() {
        return (
            <Host>
                <limel-profile-picture
                    value={this.value}
                    disabled={this.disabled}
                    readonly={this.readonly}
                    invalid={this.invalid}
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
}
