import { MDCSlider } from '@material/slider';
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
        this.getContainerClassList = this.getContainerClassList.bind(this);
    }

    public connectedCallback() {
        this.initialize();
    }

    public componentDidLoad() {
        this.initialize();
    }

    private initialize() {
        const inputElement = this.getInputElement();
        if (!inputElement) {
            return;
        }

        const value = this.getValue();

        /*
        For some reason the input element's `value` attribute is removed
        (probably by Stencil) when the element is first rendered. But if the
        attribute is missing when MDCSlider is initialized (MDC v11.0.0),
        MDCSlider crashes.
        So we add the attribute right before initializing MDCSlider. /Ads
        */
        inputElement.setAttribute('value', `${this.multiplyByFactor(value)}`);

        /*
        When creating the `mdcSlider` component, its important that the value set in
        the input field obeys the range and the step size.

        The MDCSlider will throw an exception unless the value in the input element
        is dividible by the step value and is in the provided range.
        If an exception occurs, this component will crash and it will be impossible to change
        its value.
        The logic below ensures that the component will render even though the
        provided value is wrong.
        This could be considered wrong, but it at least fixes so that it's possible
        to change the value from the UI.
        */
        const greaterThanOrEqualMin = value >= this.valuemin;
        const lessThanOrEqualMax = value <= this.valuemax;

        if (!greaterThanOrEqualMin) {
            const newMin = this.multiplyByFactor(value);
            inputElement.setAttribute('min', `${newMin}`);
        }

        if (!lessThanOrEqualMax) {
            const newMax = this.multiplyByFactor(value);
            inputElement.setAttribute('max', `${newMax}`);
        }

        if (!this.isMultipleOfStep(value, this.step)) {
            inputElement.removeAttribute('step');
        }

        this.createMDCSlider();
    }

    public componentWillLoad() {
        this.setPercentageClass(this.value);
    }

    public disconnectedCallback() {
        this.destroyMDCSlider();
    }

    private getContainerClassList() {
        return {
            slider: true,
            'lime-slider--readonly': this.readonly,
            [this.percentageClass]: true,
        };
    }

    public render() {
        const inputProps: any = {};
        if (this.step) {
            inputProps.step = this.multiplyByFactor(this.step);
        }

        if (this.disabled || this.readonly) {
            inputProps.disabled = true;
        }

        return (
            <div class={this.getContainerClassList()}>
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
                        class={{
                            'mdc-slider': true,
                            'mdc-slider--discrete': true,
                            'mdc-slider--disabled':
                                this.disabled || this.readonly,
                        }}
                    >
                        <input
                            class="mdc-slider__input"
                            type="range"
                            min={this.multiplyByFactor(this.valuemin)}
                            max={this.multiplyByFactor(this.valuemax)}
                            value={this.multiplyByFactor(this.value)}
                            name="volume"
                            aria-label="Discrete slider demo"
                            {...inputProps}
                        />
                        <div class="mdc-slider__track">
                            <div class="mdc-slider__track--inactive"></div>
                            <div class="mdc-slider__track--active">
                                <div class="mdc-slider__track--active_fill"></div>
                            </div>
                        </div>
                        <div class="mdc-slider__thumb">
                            <div
                                class="mdc-slider__value-indicator-container"
                                aria-hidden="true"
                            >
                                <div class="mdc-slider__value-indicator">
                                    <span class="mdc-slider__value-indicator-text">
                                        {this.multiplyByFactor(this.value)}
                                    </span>
                                </div>
                            </div>
                            <div class="mdc-slider__thumb-knob"></div>
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

    @Watch('disabled')
    protected watchDisabled() {
        this.updateDisabledState();
    }

    @Watch('readonly')
    protected watchReadonly() {
        this.updateDisabledState();
    }

    @Watch('value')
    protected watchValue() {
        if (!this.mdcSlider) {
            return;
        }

        const value = this.multiplyByFactor(this.getValue());
        this.mdcSlider.setValue(value);

        if (this.isStepConfigured()) {
            return;
        }

        const step = this.multiplyByFactor(this.step);
        if (!this.isMultipleOfStep(value, step)) {
            return;
        }

        this.reCreateSliderWithStep();
    }

    private updateDisabledState() {
        if (!this.mdcSlider) {
            return;
        }

        this.mdcSlider.setDisabled(this.disabled || this.readonly);
    }

    private changeHandler = (event) => {
        let value = event.detail.value;
        const step = this.multiplyByFactor(this.step);

        if (!this.isMultipleOfStep(value, step)) {
            value = this.roundToStep(value, step);
        }

        this.change.emit(value / this.factor);
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

    private isMultipleOfStep(value: number, step: number): boolean {
        if (!step) {
            return true;
        }

        return value % step === 0;
    }

    private roundToStep(value: number, step: number): number {
        return Math.round(value / step) * step;
    }

    private getRootElement(): HTMLElement | undefined {
        return this.rootElement.shadowRoot.querySelector('.mdc-slider');
    }

    private getInputElement(): HTMLInputElement | undefined {
        const element = this.getRootElement();
        if (!element) {
            return;
        }

        return element.querySelector('input');
    }

    private isStepConfigured(): boolean {
        if (!this.step) {
            return true;
        }

        const input = this.getInputElement();
        if (!input) {
            return true;
        }

        return input.hasAttribute('step');
    }

    private reCreateSliderWithStep() {
        const inputElement = this.getInputElement();
        const step = `${this.multiplyByFactor(this.step)}`;

        inputElement.setAttribute('step', step);

        this.destroyMDCSlider();
        this.createMDCSlider();
    }

    private createMDCSlider() {
        const element = this.getRootElement();

        this.mdcSlider = new MDCSlider(element);
        this.mdcSlider.listen('MDCSlider:change', this.changeHandler);
        this.mdcSlider.listen('MDCSlider:input', this.inputHandler);
    }

    private destroyMDCSlider() {
        this.mdcSlider.unlisten('MDCSlider:change', this.changeHandler);
        this.mdcSlider.unlisten('MDCSlider:input', this.inputHandler);
        this.mdcSlider.destroy();
        this.mdcSlider = undefined;
    }
}
