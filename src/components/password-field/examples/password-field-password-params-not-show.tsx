import { Component, h, State } from '@stencil/core';

/**
 * Password set parameters
 */
@Component({
    tag: 'limel-example-password-field-password-params-not-show',
    shadow: true,
})
export class PasswordFieldPasswordParamsNotShowExample {

    @State()
    private minLength: number;

    @State()
    private maxLength: number;

    @State()
    private mustConsistCapitalLetters: boolean = true;

    @State()
    private mustConsistLowerCaseLetters: boolean = true;

    @State()
    private mustConsistNumericCharacter: boolean = false;

    @State()
    private mustConsistSpecialChracters: boolean = false;

    @State()
    private value: string;

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    };

    private setCapital = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.mustConsistCapitalLetters = event.detail;
    };

    private setLowerCase = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.mustConsistLowerCaseLetters = event.detail;
    };

    private setNumbers = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.mustConsistNumericCharacter = event.detail;
    };

    private setSpecial = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.mustConsistSpecialChracters = event.detail;
    };

    private setMinLength = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.minLength = Number(event.detail);
    };

    private setMaxLength = (event: CustomEvent<string>) => {
        event.stopPropagation();
        this.maxLength = Number(event.detail);
    };

    public render() {
        return [
            <limel-password-field
                label='Password'
                required={true}
                showPasswordParameters={false}
                passwordParameters={{
                    minLength: this.minLength,
                    maxLength: this.maxLength,
                    mustConsistCapitalLetters: this.mustConsistCapitalLetters,
                    mustConsistLowerCaseLetters: this.mustConsistLowerCaseLetters,
                    mustConsistNumericCharacter: this.mustConsistNumericCharacter,
                    mustConsistSpecialChracters: this.mustConsistSpecialChracters,
                }}
                onChange={this.handleChange}
            />,
            <div>
                <limel-flex-container direction="horizontal" justify='space-between'>
                    <div>
                        <limel-input-field
                            label='Min password length'
                            type="number"
                            onChange={this.setMinLength}
                        />
                        <limel-input-field
                            label='Max password length'
                            type="number"
                            onChange={this.setMaxLength}
                        />
                    </div>
                    <div>
                        <limel-checkbox
                            checked={this.mustConsistCapitalLetters}
                            label="Must consist capital letters"
                            onChange={this.setCapital}
                        />
                        <limel-checkbox
                            checked={this.mustConsistLowerCaseLetters}
                            label="Must consist lowercase letters"
                            onChange={this.setLowerCase}
                        />
                        <limel-checkbox
                            checked={this.mustConsistNumericCharacter}
                            label="Must consist numeric character"
                            onChange={this.setNumbers}
                        />
                        <limel-checkbox
                            checked={this.mustConsistSpecialChracters}
                            label="Must consist special chracters"
                            onChange={this.setSpecial}
                        />
                    </div>
                </limel-flex-container>
            </div>,
            <limel-example-value value={this.value} label={'Password'} />,
        ];
    }
}
