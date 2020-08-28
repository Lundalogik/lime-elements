import { MDCLinearProgress } from '@limetech/mdc-linear-progress';
import { Component, Element, h, Prop, Watch } from '@stencil/core';

@Component({
    tag: 'limel-linear-progress',
    shadow: true,
    styleUrl: 'linear-progress.scss',
})
export class LinearProgress {
    /**
     * The value of the progress bar. Should be between `0` and `1`.
     */
    @Prop()
    public value: number = 0;

    /**
     * Puts the progress bar in an indeterminate state
     */
    @Prop()
    public indeterminate: boolean = false;

    @Element()
    private host: HTMLLimelLinearProgressElement;

    private mdcLinearProgress: MDCLinearProgress;

    public componentDidLoad() {
        this.mdcLinearProgress = new MDCLinearProgress(
            this.host.shadowRoot.querySelector('.mdc-linear-progress')
        );
        this.mdcLinearProgress.progress = this.value;
    }

    // eslint-disable-next-line @stencil/own-methods-must-be-private
    public componentDidUnload() {
        if (this.mdcLinearProgress) {
            this.mdcLinearProgress.destroy();
        }
    }

    public render() {
        return (
            <div
                role="progressbar"
                class={`mdc-linear-progress ${
                    this.indeterminate
                        ? 'mdc-linear-progress--indeterminate'
                        : ''
                }`}
            >
                <div class="mdc-linear-progress__buffer" />
                <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
                    <span class="mdc-linear-progress__bar-inner" />
                </div>
                <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
                    <span class="mdc-linear-progress__bar-inner" />
                </div>
            </div>
        );
    }

    @Watch('value')
    protected watchValue(newValue) {
        this.mdcLinearProgress.progress = newValue;
    }
}
