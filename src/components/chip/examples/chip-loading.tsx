import { Component, State, h } from '@stencil/core';

/**
 * Loading state
 * Setting the `loading` to `true` puts the component in the `loading` state,
 * and renders an indeterminate progress indicator inside the chip.
 *
 * :::note
 * Note that this does _not_ disable the interactivity of the chip,
 * and most probably you do not need it to be disabled either.
 * If the chip should be disabled while loading, the
 * `disabled` property should separately be set to `true` as well.
 * :::
 * :::tip
 * Consider using [aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live)
 * where appropriate, or to inform the user about what is being loaded
 * use a [tooltip](#/component/limel-tooltip) on the component.
 * This is mainly to improve the accessibility for users of assistive technologies.
 * :::
 */
@Component({
    tag: 'limel-example-chip-loading',
    shadow: true,
    styleUrl: 'chip-loading.scss',
})
export class ChipLoadingExample {
    @State()
    private disabled: boolean = false;

    @State()
    private readonly: boolean = false;

    @State()
    public loading = false;

    public render() {
        return [
            <limel-chip
                text="FunnyCats"
                icon="hashtag"
                onClick={this.onClick}
                disabled={this.disabled}
                readonly={this.readonly}
                loading={this.loading}
                badge={this.loading ? null : '123'}
            />,
            <limel-chip
                text={this.loading ? 'Loading...' : 'FunnyCats'}
                onClick={this.onClick}
                disabled={this.disabled}
                removable={true}
                readonly={this.readonly}
                loading={this.loading}
                aria-live="polite"
            />,
            <limel-example-controls>
                <limel-checkbox
                    label="Loading"
                    checked={this.loading}
                    onChange={this.setLoading}
                />
                <limel-checkbox
                    checked={this.disabled}
                    label="Disabled"
                    onChange={this.setDisabled}
                />
                <limel-checkbox
                    checked={this.readonly}
                    label="Readonly"
                    onChange={this.setReadonly}
                />
            </limel-example-controls>,
        ];
    }

    private onClick() {
        console.log('Chip is clicked.');
    }

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };

    private setLoading = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.loading = event.detail;
    };
}
