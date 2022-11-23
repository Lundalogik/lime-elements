import {
    Component,
    EventEmitter,
    h,
    Prop,
    State,
    Event,
    Element,
} from '@stencil/core';
import { Watch } from '@stencil/core/internal';
import { MDCTextField } from '@material/textfield';
import { debounce } from 'lodash-es';
import { passwordParams } from './password-params';

/**
 * @exampleComponent limel-example-password-field-default
 * @exampleComponent limel-example-password-field-with-button
 * @exampleComponent limel-example-password-field-password-params
 * @exampleComponent limel-example-password-field-password-params-not-show
 */

@Component({
    tag: 'limel-password-field',
    styleUrl: 'password-field.scss',
    shadow: true,
})
export class PasswordField {
    /**
     * Set to `true` to disable the field.
     * Use `disabled` to indicate that the field can normally be interacted
     * with, but is currently disabled. This tells the user that if certain
     * requirements are met, the field may become enabled again.
     */
    @Prop()
    public disabled?: boolean = false;

    /**
     * Set to `true` to indicate that the current value of the input field is
     * invalid.
     */
    @Prop()
    public invalid?: boolean = false;

    /**
     * The placeholder text shown inside the input field, when the field is focused and empty.
     */
    @Prop()
    public placeholder?: string;

    /**
     * Set to `true` to indicate that the field is required.
     */
    @Prop()
    public required?: boolean = false;

    /**
     * The password label (default "Password").
     */
    @Prop()
    public label?: string = 'Password';

    /**
     * Set password parameters
     * interface for password parameters:
     * - `mustConsistCapitalLetters` => if true, the password must contain at least one uppercase character
     * - `mustConsistLowerCaseLetters` => if true, the password must contain at least one lowercase character
     * - `mustConsistNumericCharacter` => if true, the password must contain at least one number character
     * - `mustConsistSpecialChracters` => if true, the password must contain at least one special character. Like:( ! # $ % & ? " )
     * - `maxLength` => set maximum password length
     * - `minLength?` => set minimum password length
     * The password will be considered incorrect unless all specified parameters are met
     */
    @Prop()
    passwordParameters?: passwordParams;

    /**
     * If is `true` then show password parameters when password is typing
     */
    @Prop()
    showPasswordParameters?: boolean = false;

    /**
     * If is `true` then show button for hide/visible password
     */
    @Prop()
    showHiddenButton?: boolean = false;

    /**
     * Emitted when the password is changed.
     */
    @Event()
    private change: EventEmitter<string>;

    @Element()
    private limelPasswordField: HTMLLimelPasswordFieldElement;

    @State()
    public showPassword: boolean;

    @State()
    private isFocused: boolean = false;

    @State()
    private isModified: boolean = false;

    @State()
    private hasLowerCase: boolean = false;

    @State()
    private hasCapitalCase: boolean = false;

    @State()
    private hasNumeric: boolean = false;

    @State()
    private hasSpecial: boolean = false;

    @State()
    private minlengthCheck: boolean = false;

    @State()
    private maxlengthCheck: boolean = false;

    @State()
    private value: string;

    @Watch('value')
    protected valueWatcher(newValue: string) {
        if (!this.mdcTextField) {
            return;
        }

        if (newValue !== this.mdcTextField.value) {
            this.mdcTextField.value = newValue || '';
        }
    }

    private icon: string = 'hide';
    private mdcTextField: MDCTextField;

    constructor() {
        const debounceTimeout = 300;
        this.changeEmitter = debounce(this.changeEmitter, debounceTimeout);
    }

    public connectedCallback() {
        this.initialize();
    }

    public componentDidLoad() {
        this.initialize();
    }

    public disconnectedCallback() {
        if (this.mdcTextField) {
            this.mdcTextField.destroy();
        }

        window.removeEventListener('resize', this.layout);
        this.limelPasswordField.removeEventListener('focus', this.setFocus);
    }

    public componentDidUpdate() {
        if (this.invalid) {
            this.mdcTextField.valid = false;
        }

        this.mdcTextField.valid = !this.isInvalid();
    }

    private toogleShowPassword = () => {
        this.showPassword = !this.showPassword;
    };

    private initialize = () => {
        const element =
            this.limelPasswordField.shadowRoot.querySelector('.mdc-text-field');
        if (!element) {
            return;
        }

        this.mdcTextField = new MDCTextField(element);

        window.addEventListener('resize', this.layout, { passive: true });
        this.limelPasswordField.addEventListener('focus', this.setFocus);
    };

    private setFocus = () => {
        this.mdcTextField.focus();
    };

    private getContainerClassList = () => {
        return {
            'mdc-text-field': true,
            'mdc-text-field--outlined': true,
            'mdc-text-field--disabled': this.disabled,
            'mdc-text-field--required': this.required,
            'mdc-text-field--invalid': this.isInvalid(),
        };
    };

    private layout = () => {
        this.mdcTextField?.layout();
    };

    private getAdditionalProps = () => {
        const props: any = {};

        if (this.passwordParameters) {
            if (this.passwordParameters.minLength) {
                props.minlength = this.passwordParameters.minLength;
            }

            if (this.passwordParameters.maxLength) {
                props.maxlength = this.passwordParameters.maxLength;
            }
        }

        return props;
    };

    private onFocus = () => {
        this.isFocused = true;
    };

    private onBlur = () => {
        this.isFocused = false;
        this.isModified = true;
    };

    private checkPasswordParams(value: string) {
        if (this.passwordParameters) {
            this.hasLowerCase = /[a-z]/.test(value);
            this.hasCapitalCase = /[A-Z]/.test(value);
            this.hasNumeric = /[0-9]/.test(value);
            this.hasSpecial = /[!#$%&? "]/.test(value);

            if (this.passwordParameters.minLength) {
                this.minlengthCheck =
                    value.length >= this.passwordParameters.minLength;
            }

            if (this.passwordParameters.maxLength) {
                this.maxlengthCheck =
                    value.length <= this.passwordParameters.maxLength;
            }
        }
    }

    private isInvalid = () => {
        if (this.invalid) {
            return true;
        }

        if (!this.isModified) {
            return false;
        }

        if (this.passwordParameters && this.checkPasswordParamsControls()) {
            return true;
        }

        if (
            (this.value === undefined || this.value.length <= 0) &&
            this.required
        ) {
            return true;
        }
    };

    private checkPasswordParamsControls(): boolean {
        if (
            this.passwordParameters.mustConsistLowerCaseLetters &&
            this.hasLowerCase === false
        ) {
            return true;
        }

        if (
            this.passwordParameters.mustConsistCapitalLetters &&
            this.hasCapitalCase === false
        ) {
            return true;
        }

        if (
            this.passwordParameters.mustConsistNumericCharacter &&
            this.hasNumeric === false
        ) {
            return true;
        }

        if (
            this.passwordParameters.mustConsistSpecialChracters &&
            this.hasSpecial === false
        ) {
            return true;
        }

        if (
            this.passwordParameters.maxLength &&
            this.maxlengthCheck === false
        ) {
            return true;
        }

        if (
            this.passwordParameters.minLength &&
            this.minlengthCheck === false
        ) {
            return true;
        }
    }

    private handleChange = (event) => {
        event.stopPropagation();
        const value = event.target.value;
        this.value = event.target.value;

        this.changeEmitter(value);
        this.checkPasswordParams(value);
    };

    private changeEmitter = (value: string) => {
        this.change.emit(value);
    };

    public render() {
        const labelId = 'tf-input-label';
        const properties = this.getAdditionalProps();
        properties['aria-labelledby'] = labelId;
        properties.class = 'mdc-text-field__input';
        properties.onInput = this.handleChange;
        properties.onFocus = this.onFocus;
        properties.onBlur = this.onBlur;
        properties.required = this.required;
        properties.disabled = this.disabled;

        let type: string = 'password';

        if (this.showPassword) {
            type = 'text';
        }

        return [
            <div class="mcd-password-field-container">
                <label class={this.getContainerClassList()}>
                    <span class="mdc-notched-outline" tabindex="-1">
                        <span class="mdc-notched-outline__leading"></span>
                        {this.renderLabel(labelId)}
                        <span class="mdc-notched-outline__trailing"></span>
                    </span>
                    <input
                        {...properties}
                        type={type}
                        value={this.value}
                        placeholder={this.placeholder}
                    />
                    {this.renderHiddenButton()}
                </label>
                {this.renderPasswordParameters()}
            </div>,
        ];
    }

    private renderHiddenButton = () => {
        if (!this.showHiddenButton) {
            return;
        }

        return (
            <limel-icon-button
                icon={this.icon}
                onClick={this.toogleShowPassword}
            ></limel-icon-button>
        );
    };

    private renderPasswordParameters = () => {
        if (!this.passwordParameters || !this.showPasswordParameters) {
            return;
        }

        const classList = {
            'flex-row': true,
            hidden: !this.isFocused,
        };

        return (
            <div>
                <div class={classList}>
                    {this.renderLoverCaseCheckbox()}
                    {this.renderCapitalCheckbox()}
                    {this.renderNumberCheckbox()}
                    {this.renderSpecialCheckbox()}
                    {this.renderMinLengthCheckbox()}
                    {this.renderMaxLengthCheckbox()}
                </div>
            </div>
        );
    };

    private renderLoverCaseCheckbox = () => {
        if (this.passwordParameters.mustConsistLowerCaseLetters) {
            return (
                <limel-checkbox
                    label="Lowercase letters"
                    id="terms"
                    readonly={true}
                    checked={this.hasLowerCase}
                />
            );
        }
    };

    private renderCapitalCheckbox = () => {
        if (this.passwordParameters.mustConsistCapitalLetters) {
            return (
                <limel-checkbox
                    label="Capital letters"
                    id="terms"
                    readonly={true}
                    checked={this.hasCapitalCase}
                />
            );
        }
    };

    private renderNumberCheckbox = () => {
        if (this.passwordParameters.mustConsistNumericCharacter) {
            return (
                <limel-checkbox
                    label="Numeric characters"
                    id="terms"
                    readonly={true}
                    checked={this.hasNumeric}
                />
            );
        }
    };

    private renderSpecialCheckbox = () => {
        if (this.passwordParameters.mustConsistSpecialChracters) {
            return (
                <limel-checkbox
                    label="Special characters"
                    id="terms"
                    readonly={true}
                    checked={this.hasSpecial}
                />
            );
        }
    };

    private renderMinLengthCheckbox = () => {
        if (this.passwordParameters.minLength) {
            return (
                <limel-checkbox
                    label={`Minimum length ${this.passwordParameters.minLength}`}
                    id="terms"
                    readonly={true}
                    checked={this.minlengthCheck}
                />
            );
        }
    };

    private renderMaxLengthCheckbox = () => {
        if (this.passwordParameters.maxLength) {
            return (
                <limel-checkbox
                    label={`Maximum length of ${this.passwordParameters.maxLength}`}
                    id="terms"
                    readonly={true}
                    checked={this.maxlengthCheck}
                />
            );
        }
    };

    private renderLabel = (labelId: string) => {
        const labelClassList = {
            'mdc-floating-label': true,
            'mdc-floating-label--float-above':
                this.value !== undefined || this.isFocused,
        };

        if (!this.label) {
            return;
        }

        return (
            <span class="mdc-notched-outline__notch">
                <span class={labelClassList} id={labelId}>
                    {this.label}
                </span>
            </span>
        );
    };
}
