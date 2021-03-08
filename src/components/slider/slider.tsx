import { MDCSlider } from '@limetech/mdc-slider';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    h,
    Prop,
    State,
    Watch,
} from '@stencil/core';
import { getPercentageClass } from './getPercentageClass';
/**
 * @exampleComponent limel-example-slider
 * @exampleComponent limel-example-slider-multiplier
 * @exampleComponent limel-example-slider-multiplier-percentage-colors
 */
@Component({
    tag: 'limel-slider',
    shadow: true,
    styleUrl: 'slider.scss',
})
export class Slider {
    /**
     * Set to `true` to disable the input
     */
    @Prop({ reflect: true })
    public disabled = false;

    /**
     * Default value: 1.
     * The factor that the properties `value`, `valuemax` and `valuemin` are multiplied by.
     * On `change` divides the value by the factor, so the original format stays the same
     */
    @Prop({ reflect: true })
    public factor: number = 1;

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
    public valuemax: number = 100; // eslint-disable-line no-magic-numbers

    /**
     * The minimum value allowed
     */
    @Prop({ reflect: true })
    public valuemin: number = 0;

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

    @Element()
    private rootElement: HTMLLimelSliderElement;

    private mdcSlider: MDCSlider;

    @State()
    private percentageClass: string;

    public constructor() {
        this.inputHandler = this.inputHandler.bind(this);
    }

    public connectedCallback() {
        this.initialize();
    }

    public componentDidLoad() {
        this.initialize();
    }

    private initialize() {
        const element = this.rootElement.shadowRoot.querySelector(
            '.mdc-slider'
        );
        if (!element) {
            return;
        }

        this.mdcSlider = new MDCSlider(element);
        this.mdcSlider.listen('MDCSlider:change', this.changeHandler);
        this.mdcSlider.listen('MDCSlider:input', this.inputHandler);
    }

    public componentWillLoad() {
        this.setPercentageClass(this.value);
    }

    public componentWillUpdate() {
        this.mdcSlider.disabled = this.disabled;
    }

    public disconnectedCallback() {
        this.mdcSlider.unlisten('MDCSlider:change', this.changeHandler);
        this.mdcSlider.unlisten('MDCSlider:input', this.inputHandler);
        this.mdcSlider.destroy();
    }

    public render() {
        return (
            <div class={`slider ${this.percentageClass}`}>
                <label class="slider__label mdc-floating-label mdc-floating-label--float-above">
                    {this.label}
                </label>
                <div class="slider__content">
                    <div class="slider__content-range-container">
                        <span class="slider__content-min-label">
                            {this.multiplyByFactor(this.valuemin)}
                            {this.unit}
                        </span>
                        <span class="slider__content-max-label">
                            {this.multiplyByFactor(this.valuemax)}
                            {this.unit}
                        </span>
                    </div>
                    <div
                        class="mdc-slider mdc-slider--discrete"
                        role="slider"
                        aria-valuemin={this.multiplyByFactor(this.valuemin)}
                        aria-valuemax={this.multiplyByFactor(this.valuemax)}
                        aria-valuenow={this.multiplyByFactor(this.getValue())}
                        aria-label={this.label}
                        aria-disabled={this.disabled}
                        data-step={this.step}
                    >
                        <div class="mdc-slider__track-container">
                            <div class="mdc-slider__track" />
                        </div>
                        <div class="mdc-slider__thumb-container">
                            <div class="mdc-slider__pin">
                                <span class="mdc-slider__pin-value-marker">
                                    {this.multiplyByFactor(this.getValue())}
                                </span>
                            </div>
                            <svg
                                class="mdc-slider__thumb"
                                width="21"
                                height="21"
                            >
                                <circle cx="10.5" cy="10.5" r="7.875" />
                            </svg>
                            <div class="mdc-slider__focus-ring" />
                        </div>
                    </div>
                </div>
                {this.renderHelperLine()}
            </div>
        );
    }

    private renderHelperLine() {
        if (!this.helperText) {
            return;
        }

        return (
            <div class="mdc-slider-helper-line">
                <p class="mdc-slider-helper-text">{this.helperText}</p>
            </div>
        );
    }

    @Watch('value')
    protected watchValue() {
        if (!this.mdcSlider) {
            return;
        }

        this.mdcSlider.value = this.multiplyByFactor(this.getValue());
    }

    private changeHandler = (event) => {
        this.change.emit(event.detail.value / this.factor);
    };

    private multiplyByFactor(value) {
        return Math.round(value * this.factor);
    }

    private getValue() {
        let value = this.value;
        if (!isFinite(value)) {
            value = this.valuemin;
        }

        return value;
    }

    private inputHandler(event) {
        this.setPercentageClass(event.detail.value / this.factor);
    }

    private setPercentageClass(value) {
        this.percentageClass = getPercentageClass(
            (value - this.valuemin) / (this.valuemax - this.valuemin)
        );
    }
}
