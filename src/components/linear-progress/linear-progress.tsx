import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';
const PERCENT = 100;

/**
 * @exampleComponent limel-example-linear-progress
 * @exampleComponent limel-example-linear-progress-color
 * @exampleComponent limel-example-linear-progress-indeterminate
 */
@Component({
    tag: 'limel-linear-progress',
    shadow: true,
    styleUrl: 'linear-progress.scss',
})
export class LinearProgress {
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

    @Element()
    private host: HTMLLimelLinearProgressElement;

    public render() {
        if (!this.isFinite(this.value)) {
            return;
        }

        return (
            <Host
                role="progressbar"
                aria-label="Progress Bar"
                aria-valuemin="0"
                aria-valuemax="1"
                aria-valuenow={this.value}
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
