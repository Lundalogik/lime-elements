import { MDCCheckbox } from '@lime-material-16px/checkbox';
import { MDCFormField } from '@lime-material-16px/form-field';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    State,
} from '@stencil/core';
import { Option } from '../../interface';
import { createRandomString } from '../../util/random-string';

@Component({
    tag: 'limel-multi-select',
    shadow: true,
    styleUrl: 'multi-select.scss',
})
export class MultiSelect {
    @Prop({ reflectToAttr: true })
    public disabled = false;

    @Prop({ reflectToAttr: true })
    public label: string;

    @Prop()
    public value: Option[] = [];

    @Prop()
    public options: Option[] = [];

    @Event()
    private change: EventEmitter<Option[]>;

    @Element()
    private limelMultiSelect: HTMLElement;

    @State()
    private fieldId = createRandomString();

    @State()
    private mdcCheckboxes = [];

    public componentDidLoad() {
        const elements = Array.from(
            this.limelMultiSelect.shadowRoot.querySelectorAll(
                '.multi-select .mdc-form-field'
            )
        );

        elements.forEach(element => {
            const formField = new MDCFormField(element);
            const checkbox = new MDCCheckbox(element.firstChild);
            formField.input = checkbox;
            this.mdcCheckboxes.push(checkbox);
        });

        this.onChange();
    }

    public render() {
        return (
            <div class="multi-select">
                <label
                    htmlFor={this.fieldId}
                    class="multi-select-label mdc-floating-label mdc-floating-label--float-above"
                >
                    {this.label}
                </label>
                <div id={this.fieldId}>
                    {this.options.map((option: Option, index: number) => {
                        return this.renderCheckbox(index, option);
                    })}
                </div>
            </div>
        );
    }

    private renderCheckbox(index: number, option: Option) {
        return (
            <div class="mdc-form-field ">
                <div
                    class={`
                        mdc-checkbox
                        ${this.disabled ? 'mdc-checkbox--disabled' : ''}
                    `}
                >
                    <input
                        type="checkbox"
                        class="mdc-checkbox__native-control"
                        id={this.fieldId + '_' + index.toString()}
                        value={option.value}
                        checked={!!this.isOptionChecked(option)}
                        disabled={this.disabled}
                        onChange={this.onChange}
                    />
                    <div class="mdc-checkbox__background">
                        <svg
                            class="mdc-checkbox__checkmark"
                            viewBox="0 0 24 24"
                        >
                            <path
                                class="mdc-checkbox__checkmark-path"
                                fill="none"
                                d="M1.73,12.91 8.1,19.28 22.79,4.59"
                            />
                        </svg>
                        <div class="mdc-checkbox__mixedmark" />
                    </div>
                </div>
                <label htmlFor={this.fieldId + '_' + index.toString()}>
                    {option.text}
                </label>
            </div>
        );
    }

    private isOptionChecked(option: Option) {
        return this.value.find(checkedOption => {
            return checkedOption.value === option.value;
        });
    }

    private onChange = (event?) => {
        if (event) {
            event.stopPropagation();
        }

        const checked = this.options.filter(option => {
            const optionChecked = this.mdcCheckboxes.some(mdcCheckbox => {
                return (
                    mdcCheckbox.checked && mdcCheckbox.value === option.value
                );
            });
            if (optionChecked) {
                return option;
            }
        });
        this.change.emit(checked);
    };
}
