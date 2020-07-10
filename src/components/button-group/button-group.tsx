import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { Button } from '../button/button.types';
import { createRandomString } from '../../util/random-string';

@Component({
    tag: 'limel-button-group',
    shadow: true,
    styleUrl: 'button-group.scss',
})
export class ButtonGroup {
    /**
     * List of buttons for the group
     */
    @Prop()
    public value: Button[] = [];

    /**
     * True if the button-group should be disabled
     */
    @Prop({ reflectToAttr: true })
    public disabled: boolean = false;

    /**
     * Dispatched when a button is selected/deselected
     */
    @Event()
    private change: EventEmitter<Button>;

    @State()
    private selectedButtonId: string;

    private radioGroupName = createRandomString();

    constructor() {
        this.renderButton = this.renderButton.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderContent = this.renderContent.bind(this);
    }

    public componentWillLoad() {
        this.selectedButtonId = this.value.find((button) => {
            return button.selected;
        })?.id;
    }

    public render() {
        const classes = {
            'mdc-chip-set': true,
            disabled: this.disabled,
            'mdc-chip-set--choice': true,
        };

        return (
            <div class={classes} role="grid">
                {this.value.map(this.renderButton)}
            </div>
        );
    }

    private renderButton(button: Button) {
        const classes = {
            'mdc-chip': true,
            'mdc-chip--selected': this.isButtonChecked(button),
        };

        return (
            <div class={classes} role="row">
                <span role="gridcell">
                    <input
                        type="radio"
                        name={this.radioGroupName}
                        checked={this.isButtonChecked(button)}
                        id={button.id}
                        onChange={this.onChange}
                    />
                    <label htmlFor={button.id}>
                        {this.renderContent(button)}
                    </label>
                </span>
            </div>
        );
    }

    private renderContent(button: Button) {
        if (button.icon) {
            return this.renderIcon(button);
        }

        return this.renderLabel(button);
    }

    private isButtonChecked(button: Button) {
        return button.id === this.selectedButtonId;
    }

    private renderLabel(button: Button) {
        return <span class="mdc-chip__text">{button.title}</span>;
    }

    private renderIcon(button: Button) {
        return (
            <limel-icon
                class="mdc-chip__icon"
                aria-label={button.title}
                title={button.title}
                name={button.icon}
                size="small"
                badge={true}
            />
        );
    }

    private onChange(event: Event) {
        event.stopPropagation();
        const target = event.target as HTMLInputElement;
        this.selectedButtonId = target.id;
        const button = this.value.find((item) => {
            return `${item.id}` === target.id;
        });
        this.change.emit(button);
    }
}
