import {
    Component,
    Event,
    EventEmitter,
    h,
    Host,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import { getPercentageClass } from './get-percentage-class';
import { createRandomString } from '../../util/random-string';

const DEFAULT_FACTOR = 1;
const DEFAULT_MAX_VALUE = 100;
const DEFAULT_MIN_VALUE = 0;

/**
 * @exampleComponent limel-example-slider-basic
 * @exampleComponent limel-example-slider-multiplier
 * @exampleComponent limel-example-slider-multiplier-percentage-colors
 * @exampleComponent limel-example-slider-composite
 */
@Component({
    tag: 'limel-slider',
    shadow: true,
    styleUrl: 'slider.scss',
})
export class Slider {
    /**
     * Disables the slider when `true`,
     * and visually shows that the field is editable but disabled.
     * This tells the users that if certain requirements are met,
     * the slider may become interactable.
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Disables the slider when `true`. This visualizes the slider slightly differently.
     * But shows no visual sign indicating that the slider field
     * is disabled or can ever become interactable.
     */
    @Prop({ reflect: true })
    public readonly = false;

    /**
     * Default value: 1.
     * The factor that the properties `value`, `valuemax`, `valuemin`, and
     * `step` are multiplied by. On `change` divides the value by the factor,
     * so the original format stays the same.
     */
    @Prop({ reflect: true })
    public factor: number = DEFAULT_FACTOR;

    /**
     * Label to display next to the input
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * Optional helper text to display below the slider
     */
    @Prop({ reflect: true })
    public helperText: string;

    /**
     * Set to `true` to indicate that the slider is required.
     */
    @Prop({ reflect: true })
    public required = false;

    /**
     * Set to `true` to indicate that the current value of the slider is invalid.
     */
    @Prop({ reflect: true })
    public invalid = false;

    /**
     * Set to `true` to display percentage-based colors on the slider.
     * The colors change in intervals of 10% as the value changes,
     * creating a color spectrum from red (low) → orange → yellow → green → teal (high).
     */
    @Prop({ reflect: true })
    public displaysPercentageColors = false;

    /**
     * Unit to display next to the value
     */
    @Prop({ reflect: true })
    public unit: string = '';

    /**
     * The value of the input
     */
    @Prop({ reflect: true })
    public value: number;

    /**
     * The maximum value allowed
     */
    @Prop({ reflect: true })
    public valuemax: number = DEFAULT_MAX_VALUE;

    /**
     * The minimum value allowed
     */
    @Prop({ reflect: true })
    public valuemin: number = DEFAULT_MIN_VALUE;

    /**
     * The stepping interval to use when adjusting the value
     */
    @Prop({ reflect: true })
    public step: number;

    /**
     * Emitted when the value has been changed
     */
    @Event()
    private change: EventEmitter<number>;

    @State()
    private percentageClass: string;

    @State()
    private displayValue: number;

    private labelId: string;
    private helperTextId: string;

    public constructor() {
        this.labelId = createRandomString();
        this.helperTextId = createRandomString();
    }

    public componentWillLoad() {
        this.displayValue = this.multiplyByFactor(this.getValue());
        this.setPercentageClass(this.getValue());
    }

    public render() {
        const min = this.multiplyByFactor(this.valuemin);
        const max = this.multiplyByFactor(this.valuemax);
        const fraction = this.getFraction();

        const inputProps: any = {};
        if (this.step) {
            inputProps.step = this.multiplyByFactor(this.step);
        }

        if (this.disabled || this.readonly) {
            inputProps.disabled = true;
        }

        return (
            <Host class={this.getContainerClassList()}>
                <limel-notched-outline
                    labelId={this.labelId}
                    label={this.label}
                    required={this.required}
                    invalid={this.invalid}
                    disabled={this.disabled}
                    readonly={this.readonly}
                    hasValue={!!this.value}
                    hasFloatingLabel={true}
                >
                    <div slot="content">
                        <div
                            class="slider"
                            style={{ '--slider-fraction': `${fraction}` }}
                        >
                            <input
                                type="range"
                                min={min}
                                max={max}
                                value={this.displayValue}
                                aria-labelledby={this.labelId}
                                aria-describedby={
                                    this.helperText
                                        ? this.helperTextId
                                        : undefined
                                }
                                onInput={this.handleInput}
                                onChange={this.handleChange}
                                {...inputProps}
                            />
                            <div class="track">
                                <div class="active" />
                            </div>
                            <div class="thumb">
                                <div class="knob" />
                                <div class="indicator" aria-hidden="true">
                                    {this.displayValue}
                                </div>
                            </div>
                        </div>
                        <div class="range-labels">
                            <span class="min">
                                {this.multiplyByFactor(this.valuemin)}
                                {this.unit}
                            </span>
                            <span class="max">
                                {this.multiplyByFactor(this.valuemax)}
                                {this.unit}
                            </span>
                        </div>
                    </div>
                </limel-notched-outline>
                {this.renderHelperLine()}
            </Host>
        );
    }

    @Watch('value')
    protected watchValue() {
        this.displayValue = this.multiplyByFactor(this.getValue());
        this.setPercentageClass(this.getValue());
    }

    private renderHelperLine = () => {
        if (!this.helperText) {
            return;
        }

        return (
            <limel-helper-line
                helperText={this.helperText}
                helperTextId={this.helperTextId}
                invalid={this.invalid}
            />
        );
    };

    private handleInput = (event: Event) => {
        event.stopPropagation();
        const input = event.target as HTMLInputElement;
        const value = Number(input.value);
        this.displayValue = value;
        this.setPercentageClass(value / this.factor);
    };

    private handleChange = (event: Event) => {
        event.stopPropagation();
        const input = event.target as HTMLInputElement;
        let value = Number(input.value);
        const step = this.multiplyByFactor(this.step);

        if (!this.isMultipleOfStep(value, step)) {
            value = this.roundToStep(value, step);
        }

        this.change.emit(value / this.factor);
    };

    private getContainerClassList = () => {
        if (!this.percentageClass) {
            return {};
        }

        return {
            [this.percentageClass]: true,
        };
    };

    private multiplyByFactor = (value: number) => {
        return Math.round(value * this.factor);
    };

    private getValue = () => {
        let value = this.value;
        if (!Number.isFinite(value)) {
            value = this.valuemin;
        }

        return value;
    };

    private getFraction = (): number => {
        const min = this.multiplyByFactor(this.valuemin);
        const max = this.multiplyByFactor(this.valuemax);

        if (max === min) {
            return 0;
        }

        return Math.max(
            0,
            Math.min(1, (this.displayValue - min) / (max - min))
        );
    };

    private setPercentageClass = (value: number) => {
        this.percentageClass = getPercentageClass(
            (value - this.valuemin) / (this.valuemax - this.valuemin)
        );
    };

    private isMultipleOfStep = (value: number, step: number): boolean => {
        if (!step) {
            return true;
        }

        return value % step === 0;
    };

    private roundToStep = (value: number, step: number): number => {
        return Math.round(value / step) * step;
    };
}
