import { MDCSlider } from '@lime-material-16px/slider';
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Prop,
    Watch,
} from '@stencil/core';

@Component({
    tag: 'limel-slider',
    shadow: true,
    styleUrl: 'slider.scss',
})
export class Slider {
    @Prop({ reflectToAttr: true })
    public disabled = false;
    /**
     * Default value: 1.
     * The factor that the properties `value`, `valuemax` and `valuemin` are multiplied by.
     * On `change` divides the value by the factor, so the original format stays the same
     */
    @Prop({ reflectToAttr: true })
    public factor: number = 1;
    @Prop({ reflectToAttr: true })
    public label: string;
    @Prop({ reflectToAttr: true })
    public unit: string = '';
    @Prop({ reflectToAttr: true })
    public value: number;
    @Prop({ reflectToAttr: true })
    public valuemax: number = 100;
    @Prop({ reflectToAttr: true })
    public valuemin: number = 0;

    @Event()
    private change: EventEmitter<number>;

    @Element()
    private rootElement: HTMLElement;

    private mdcSlider: MDCSlider;

    public componentDidLoad() {
        this.mdcSlider = new MDCSlider(
            this.rootElement.shadowRoot.querySelector('.mdc-slider')
        );
        this.mdcSlider.listen('MDCSlider:change', this.changeHandler);
    }

    public componentWillUpdate() {
        this.mdcSlider.disabled = this.disabled;
    }

    public componentDidUnload() {
        this.mdcSlider.unlisten('MDCSlider:change', this.changeHandler);
        this.mdcSlider.destroy();
    }

    public render() {
        return (
            <div class="slider">
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
                        aria-valuenow={this.multiplyByFactor(this.value)}
                        aria-label={this.label}
                        aria-disabled={this.disabled}
                    >
                        <div class="mdc-slider__track-container">
                            <div class="mdc-slider__track" />
                        </div>
                        <div class="mdc-slider__thumb-container">
                            <div class="mdc-slider__pin">
                                <span class="mdc-slider__pin-value-marker">
                                    {this.multiplyByFactor(this.value)}
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
            </div>
        );
    }

    @Watch('value')
    protected watchValue() {
        this.mdcSlider.value = this.multiplyByFactor(this.value);
    }

    private changeHandler = event => {
        this.change.emit(event.detail.value / this.factor);
    };

    private multiplyByFactor(value) {
        return Math.round(value * this.factor);
    }
}
