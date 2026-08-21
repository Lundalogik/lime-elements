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
import translate from '../../global/translations';
import { Languages } from '../date-picker/date.types';

const DEFAULT_FACTOR = 1;
const DEFAULT_MAX_VALUE = 100;
const DEFAULT_MIN_VALUE = 0;
const MAX_VISIBLE_STEP_DOTS = 20;

/**
 * Whether the slider holds a value at all. `Number.isFinite` is typed
 * `(number: unknown) => boolean`, so it tests the right thing but narrows
 * nothing; this does, which lets the unset check double as proof that what
 * remains is a number the arithmetic can use. `null`, `undefined` and `NaN`
 * all mean unset.
 * @param value - the slider's `value` prop, which may not be a number.
 */
const isSetValue = (value: unknown): value is number => {
    return Number.isFinite(value);
};

/**
 * @exampleComponent limel-example-slider-basic
 * @exampleComponent limel-example-slider-unset
 * @exampleComponent limel-example-slider-multiplier
 * @exampleComponent limel-example-slider-multiplier-percentage-colors
 * @exampleComponent limel-example-slider-unit
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
     * A required slider does not offer the clear button, since a required
     * value cannot be unset. It can still be initialized unset (with a
     * non-finite `value`) to prompt the user to make a choice.
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
     * Defines the language for translations of the accessible labels.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * The value of the input. Set it to `null` to leave the slider unset,
     * which is also what the `change` event emits once the value is cleared.
     * Any other value that is not a finite number — `undefined`, or `NaN` —
     * unsets the slider too.
     */
    @Prop({ reflect: true })
    public value: number | null;

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
     * Emitted when the value has been changed.
     * Emits `null` when the value has been cleared and the slider becomes
     * unset, so handlers must account for a value that is not a number.
     */
    @Event()
    private change: EventEmitter<number | null>;

    @State()
    private percentageClass: string | undefined;

    @State()
    private displayValue: number;

    /**
     * `true` while the slider has no value set. Kept separate from the `value`
     * prop so that the unset state survives the brief window during dragging
     * where the value has not yet been emitted back to the consumer.
     */
    @State()
    private isUnset: boolean;

    private labelId: string;
    private helperTextId: string;
    private readonly clearButtonId: string;
    private inputElement?: HTMLInputElement;

    /**
     * `true` while the value on display is one the consumer has been told
     * about — either it came from the `value` prop, or it has been emitted on
     * `change`. It is `false` from the moment the slider becomes unset until a
     * value is committed again.
     *
     * The native input always holds a value, so while unset it rests at the
     * midpoint. A press that lands on that midpoint, or a drag that returns to
     * it before releasing, leaves the input's value untouched and fires neither
     * `input` nor `change`. Without this flag such an interaction is swallowed:
     * the slider either stays unset, or shows a number the consumer never
     * received.
     */
    private valueIsCommitted = false;

    public constructor() {
        this.labelId = createRandomString();
        this.helperTextId = createRandomString();
        this.clearButtonId = createRandomString();
    }

    public componentWillLoad() {
        this.syncStateFromValue();
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
                    hasValue={!this.isUnset}
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
                                aria-valuetext={
                                    this.isUnset
                                        ? translate.get(
                                              'value-not-set',
                                              this.language
                                          )
                                        : undefined
                                }
                                ref={(el?: HTMLInputElement) => {
                                    this.inputElement = el;
                                }}
                                onInput={this.handleInput}
                                onChange={this.handleChange}
                                onClick={this.handleClick}
                                {...inputProps}
                            />
                            <div class="track">
                                <div class="active" />
                                {this.renderStepDots(min, max)}
                            </div>
                            <div class="thumb">
                                <div class="knob" />
                                <div class="indicator" aria-hidden="true">
                                    {this.isUnset
                                        ? '\u2194\uFE0E'
                                        : this.displayValue}
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
                {this.renderClearButton()}
                {this.renderHelperLine()}
            </Host>
        );
    }

    @Watch('value')
    protected watchValue() {
        this.syncStateFromValue();
    }

    private readonly syncStateFromValue = () => {
        const value = this.value;

        if (!isSetValue(value)) {
            this.enterUnsetState();

            return;
        }

        this.isUnset = false;
        this.valueIsCommitted = true;
        this.displayValue = this.multiplyByFactor(value);
        this.setPercentageClass(value);
    };

    private readonly enterUnsetState = () => {
        this.isUnset = true;
        this.valueIsCommitted = false;
        this.displayValue = this.getRestingDisplayValue();
        this.percentageClass = undefined;
    };

    private renderStepDots = (min: number, max: number) => {
        if (!this.step) {
            return;
        }

        const step = this.multiplyByFactor(this.step);
        const count = Math.floor((max - min) / step) + 1;
        if (count > MAX_VISIBLE_STEP_DOTS) {
            return;
        }

        return Array.from({ length: count }, () => <span class="step-dot" />);
    };

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

    private readonly renderClearButton = () => {
        // A required slider must hold a value, so it offers no way to clear it.
        if (this.readonly || this.required) {
            return;
        }

        const label = this.label
            ? translate.get('clear-value-of', this.language, {
                  label: this.label,
              })
            : translate.get('clear-value', this.language);

        return (
            <button
                type="button"
                id={this.clearButtonId}
                class="clear-button"
                aria-label={label}
                onClick={this.handleClear}
                disabled={this.isUnset || this.disabled}
            >
                <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                    <path d="M7.219 5.781L5.78 7.22 14.563 16 5.78 24.781 7.22 26.22 16 17.437l8.781 8.782 1.438-1.438L17.437 16l8.782-8.781L24.78 5.78 16 14.563z" />
                </svg>
                <limel-tooltip elementId={this.clearButtonId} label={label} />
            </button>
        );
    };

    private handleInput = (event: Event) => {
        event.stopPropagation();
        const input = event.target as HTMLInputElement;
        const value = Number(input.value);
        this.isUnset = false;
        this.displayValue = value;
        this.setPercentageClass(value / this.factor);
    };

    private handleChange = (event: Event) => {
        event.stopPropagation();
        const input = event.target as HTMLInputElement;
        this.commitValue(Number(input.value));
    };

    private readonly handleClick = (event: MouseEvent) => {
        if (this.valueIsCommitted) {
            return;
        }

        // The interaction is over and the value on display still hasn't
        // reached the consumer, so the native input never fired a `change`.
        // Commit what it holds. The click is left to bubble, so consumers
        // listening for clicks still see it.
        const input = event.target as HTMLInputElement;
        this.commitValue(Number(input.value));
    };

    /**
     * Leaves the unset state and emits the value, keeping the rendered state
     * and the emitted value in step so the two cannot diverge.
     * @param displayValue - the value held by the native input, already
     * multiplied by `factor`.
     */
    private readonly commitValue = (displayValue: number) => {
        const step = this.multiplyByFactor(this.step);
        const min = this.multiplyByFactor(this.valuemin);
        let value = displayValue;

        // Steps are counted from `valuemin`, not from zero — a range of 1–5 in
        // steps of 2 stops at 1, 3 and 5. Rounding against zero would push
        // every one of those to the next even number, past `valuemax`.
        if (!this.isMultipleOfStep(value - min, step)) {
            value = min + this.roundToStep(value - min, step);
        }

        this.valueIsCommitted = true;
        this.isUnset = false;
        this.displayValue = value;
        this.setPercentageClass(value / this.factor);
        this.change.emit(value / this.factor);
    };

    private readonly handleClear = (event: MouseEvent) => {
        event.stopPropagation();
        this.enterUnsetState();
        this.change.emit(null);

        // Move focus to the slider itself so keyboard users can immediately
        // set a new value, and so assistive tech announces the now-unset state
        // instead of focus falling to the body when the button self-disables.
        this.inputElement?.focus();
    };

    private getContainerClassList = () => {
        return {
            'is-unset': this.isUnset,
            ...this.getPercentageClassList(),
        };
    };

    private readonly getPercentageClassList = () => {
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

    /**
     * The display value the thumb rests at while unset: the midpoint of the
     * range, so both arrow-key directions are live (unlike anchoring at the
     * minimum). Aligned to the step — native range inputs default to a step of
     * 1 — so it matches a real input value and the first key press doesn't jump.
     */
    private readonly getRestingDisplayValue = (): number => {
        const min = this.multiplyByFactor(this.valuemin);
        const max = this.multiplyByFactor(this.valuemax);
        const midpoint = (min + max) / 2;
        const step = this.step ? this.multiplyByFactor(this.step) : 1;

        return min + Math.round((midpoint - min) / step) * step;
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
