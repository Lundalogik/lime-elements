import { Component, h, State } from '@stencil/core';
/**
 * Customizing the visualization of the `readonly` state
 * It is possible and recommended that you enhance the visualization of a `boolean` field
 * in a `readonly` state.
 *
 * Because depending on the context, the default UI of the `readonly` state may not always
 * provide the best way of _visualizing information_, potentially leading to
 * confusion and negatively affecting the end-users' experience.
 *
 * :::important
 * Before reading the documentations below, make sure read
 * 1. our guides about the difference between
 * [Disabled vs. Readonly](/#/DesignGuidelines/disabled-vs-readonly.md/) in our components.
 * 2. our guidelines about [Labeling boolean fields](/#/DesignGuidelines/labeling-boolean-fields.md/).
 * :::
 *
 * Using the readonly-related optional props of `readonlyTrueLabel`, and `readonlyFalseLabel`,
 * you can override the `label` and customize it accordingly.
 * Additionally, by using the `readonlyTrueIcon` and `readonlyFalseIcon` props,
 * you can override the default icons and their colors.
 */
@Component({
    tag: 'limel-example-checkbox-readonly',
    shadow: true,
})
export class CheckboxReadonlyExample {
    @State()
    private readonly = true;

    @State()
    private value = true;

    @State()
    private disabled = false;

    @State()
    private invalid = false;

    @State()
    private required = false;

    public render() {
        return [
            <limel-checkbox
                disabled={this.disabled}
                label="Subscribe to email newsletters"
                readonlyTrueIcon="news"
                readonlyFalseIcon={{
                    name: 'cancel_subscription',
                    color: 'rgb(var(--color-orange-default))',
                }}
                readonlyTrueLabel="Is subscribed to receive newsletters"
                readonlyFalseLabel="Is unsubscribed from newsletters"
                helperText={this.invalid ? 'Something is wrong' : ''}
                id="1"
                checked={this.value}
                required={this.required}
                invalid={this.invalid}
                readonly={this.readonly}
            />,
            <limel-example-controls>
                <limel-checkbox
                    checked={this.readonly}
                    label="Readonly"
                    onChange={this.setReadonly}
                />
                <limel-checkbox
                    checked={this.disabled}
                    label="Disabled"
                    onChange={this.setDisabled}
                />
                <limel-checkbox
                    checked={this.invalid}
                    label="Invalid"
                    onChange={this.setInvalid}
                />
                <limel-checkbox
                    checked={this.value}
                    label="Checked"
                    onChange={this.setChecked}
                />
                <limel-checkbox
                    checked={this.required}
                    label="Required"
                    onChange={this.setRequired}
                />
            </limel-example-controls>,
            <limel-example-value label="Checked" value={this.value} />,
        ];
    }

    private setReadonly = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.readonly = event.detail;
    };

    private setChecked = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.value = event.detail;
    };

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.disabled = event.detail;
    };

    private setInvalid = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.invalid = event.detail;
    };

    private setRequired = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.required = event.detail;
    };
}
