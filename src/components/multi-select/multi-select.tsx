import { MDCCheckbox } from '@lime-material/checkbox';
import { MDCFormField } from '@lime-material/form-field';

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

    /**
     * default: `false`.
     * If `true` it shows just the options without a summary and a trigger.
     */
    @Prop({ reflectToAttr: true })
    public alwaysShowOptions = false;

    @Event()
    private change: EventEmitter;

    @Element()
    private limelMultiSelect: HTMLElement;

    @State()
    private fieldId = createRandomString();

    @State()
    private mdcCheckboxes = [];

    @State()
    private open = this.alwaysShowOptions;

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

    public componentDidUnload() {
        this.mdcCheckboxes.forEach(checkbox => {
            checkbox.destroy();
        });
    }

    public render() {
        return (
            <div>
                <label htmlFor={this.fieldId} class="multi-select-label">
                    {this.label}
                </label>
                <div class="multi-select" id={this.fieldId}>
                    {this.renderTrigger()}
                    <div
                        class={` multi-select-options
                            ${
                                !this.alwaysShowOptions
                                    ? 'multi-select-surface'
                                    : ''
                            }
                            ${this.open ? 'multi-select-surface-open' : ''}
                           `}
                    >
                        {this.options.map((option: Option, index: number) => {
                            return this.renderCheckbox(index, option);
                        })}
                    </div>
                </div>
            </div>
        );
    }

    private renderTrigger() {
        if (!this.alwaysShowOptions) {
            return (
                <div class="multi-select-trigger">
                    <div
                        class="multi-select-trigger-values"
                        onClick={this.onTriggerClick}
                    >
                        {this.renderValues()}
                    </div>
                    <limel-icon-button
                        icon="arrows/chevron_down_round"
                        class={`
                        menu__trigger
                        ${this.disabled ? '' : 'menu__trigger-enabled'}
                    `}
                        disabled={this.disabled}
                        onClick={this.onTriggerClick}
                    >
                        <span>{this.label}</span>
                    </limel-icon-button>{' '}
                </div>
            );
        }
        return '';
    }

    private renderValues() {
        return this.value
            .map(option => {
                return option.text;
            })
            .join(', ');
    }

    private renderCheckbox(index: number, option: Option) {
        return (
            <div class="mdc-form-field">
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

    private onChange = () => {
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

    private onTriggerClick = () => {
        this.open = !this.open;
    };
}
