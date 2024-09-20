import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';
import { Languages } from '../date-picker/date.types';
import translate from '../../global/translations';

const PERCENT = 100;

/**
 * The linear progress component can be used to visualize the current state of a progress in a scale;
 * for example percentage of completion of a task.
 *
 * @exampleComponent limel-example-linear-progress
 * @exampleComponent limel-example-linear-progress-indeterminate
 * @exampleComponent limel-example-linear-progress-accessible-label
 * @exampleComponent limel-example-linear-progress-color
 */
@Component({
    tag: 'limel-linear-progress',
    shadow: true,
    styleUrl: 'linear-progress.scss',
})
export class LinearProgress {
    /**
     * Defines the language for translations.
     * Will translate the translatable strings on the components.
     */
    @Prop({ reflect: true })
    public language: Languages = 'en';

    /**
     * The value of the progress bar. Should be between `0` and `1`.
     */
    @Prop({ reflect: true })
    public value: number = 0;

    /**
     * Puts the progress bar in an indeterminate state
     */
    @Prop({ reflect: true })
    public indeterminate: boolean = false;

    /**
     * A label used to describe the purpose of the element to users
     * of assistive technologies, like screen readers.
     * If not provided, the generic word of "Progress bar" will be used.
     */
    @Prop({ reflect: true })
    public accessibleLabel?: string;

    @Element()
    private host: HTMLLimelLinearProgressElement;

    public render() {
        if (!this.isFinite(this.value)) {
            return;
        }

        const loadingText = translate.get('loading', this.language);
        const ariaLabel = translate.get('progress-bar', this.language);
        const ariaValueNow = this.indeterminate ? undefined : this.value;
        const ariaValueText = this.indeterminate ? loadingText : undefined;

        return (
            <Host
                role="progressbar"
                aria-label={this.accessibleLabel || ariaLabel}
                aria-live="polite"
                aria-valuemin="0"
                aria-valuemax="1"
                aria-valuenow={ariaValueNow}
                aria-valuetext={ariaValueText}
                style={{ '--percentage': `${this.value * PERCENT}%` }}
            >
                <div class="progress" />
            </Host>
        );
    }

    @Watch('value')
    protected watchValue(newValue: number) {
        if (!this.isFinite(newValue)) {
            return;
        }

        this.updateProgress(newValue);
    }

    private updateProgress(value: number): void {
        if (this.host) {
            this.host.style.setProperty('--percentage', `${value * PERCENT}%`);
        }
    }

    private isFinite(value: unknown) {
        return Number.isFinite(value);
    }
}
