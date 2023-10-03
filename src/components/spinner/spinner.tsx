import { SpinnerSize } from '../../interface';
import { Component, Prop, h } from '@stencil/core';

/**
 * @exampleComponent limel-example-spinner
 * @exampleComponent limel-example-spinner-color
 * @exampleComponent limel-example-spinner-size
 */
@Component({
    tag: 'limel-spinner',
    shadow: true,
    styleUrl: 'spinner.scss',
})
export class Spinner {
    /**
     * Determines the size of the spinner.
     */
    @Prop({ reflect: true })
    public size: SpinnerSize = 'mini';

    /**
     * Gives the spinner the shape of Lime Technologies' logo
     */
    @Prop()
    public limeBranded: boolean = true;

    public render() {
        return [
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {this.renderSpinner()}
            </svg>,
        ];
    }

    private renderSpinner() {
        if (!this.limeBranded) {
            return (
                <g>
                    <circle class="outline" cx="12" cy="12" r="10" />
                    <g class="spinner">
                        <circle class="color" cx="12" cy="12" r="10" />
                        <circle class="color" cx="12" cy="12" r="10" />
                        <circle class="color" cx="12" cy="12" r="10" />
                        <circle class="color" cx="12" cy="12" r="10" />
                        <circle class="color" cx="12" cy="12" r="10" />
                        <circle class="color" cx="12" cy="12" r="10" />
                        <circle class="color" cx="12" cy="12" r="10" />
                        <circle class="color" cx="12" cy="12" r="10" />
                        <circle class="color" cx="12" cy="12" r="10" />
                        <circle class="color" cx="12" cy="12" r="10" />
                        <circle class="color" cx="12" cy="12" r="10" />
                    </g>
                </g>
            );
        }

        return (
            <g>
                <g clip-path="url(#mask)">
                    <circle class="outline thick" cx="12" cy="12" r="12" />
                    <g class="spinner">
                        <circle class="color thick" cx="12" cy="12" r="12" />
                        <circle class="color thick" cx="12" cy="12" r="12" />
                        <circle class="color thick" cx="12" cy="12" r="12" />
                        <circle class="color thick" cx="12" cy="12" r="12" />
                        <circle class="color thick" cx="12" cy="12" r="12" />
                        <circle class="color thick" cx="12" cy="12" r="12" />
                        <circle class="color thick" cx="12" cy="12" r="12" />
                        <circle class="color thick" cx="12" cy="12" r="12" />
                        <circle class="color thick" cx="12" cy="12" r="12" />
                        <circle class="color thick" cx="12" cy="12" r="12" />
                        <circle class="color thick" cx="12" cy="12" r="12" />
                    </g>
                </g>
                <clipPath id="mask">
                    <path d="M2.166 11.248C2.166 5.04 7.058 0 13.083 0 19.108 0 24 5.04 24 11.248c0 3.229-1.307 6.548-4.533 9.306-3.908 3.343-9.15 3.8-17.254 3.249-2.405-.164-2.753-.588-1.51-1.533C4.61 19.3 2.165 17.025 2.165 11.248zm3.124 9.834c5.563.227 9.416-.246 12.397-2.76 2.432-2.05 3.482-4.56 3.51-7.074.05-4.613-3.636-8.36-8.114-8.36-4.478 0-8.114 3.746-8.114 8.36 0 2.793.607 4.737.726 6.345.092 1.252.03 2.388-.405 3.49z" />
                </clipPath>
            </g>
        );
    }
}
