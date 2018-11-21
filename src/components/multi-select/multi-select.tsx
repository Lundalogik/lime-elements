import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';
import { ListItem, Option } from '../../interface';
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

    @State()
    private fieldId = createRandomString();

    @State()
    private open = this.alwaysShowOptions;

    private items: ListItem[] = [];

    public componentWillLoad() {
        this.options.forEach(option => {
            const item: ListItem = {
                id: option.value,
                text: option.text,
                disabled: option.disabled,
                checked: !!this.isOptionChecked(option),
            };
            this.items.push(item);
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
                        <limel-list
                            onChange={this.onChange}
                            includeCheckboxes={true}
                            items={this.items}
                        />
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
                    </limel-icon-button>
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

    private isOptionChecked(option: Option) {
        return this.value.find(checkedOption => {
            return checkedOption.value === option.value;
        });
    }

    private onChange = event => {
        event.stopPropagation();
        const selectedOptions = this.options.filter(option => {
            return event.detail.find(item => {
                return item.id === option.value;
            });
        });
        this.change.emit(selectedOptions);
    };

    private onTriggerClick = () => {
        this.open = !this.open;
    };
}
