import { Icon } from '../../interface';
import { getIconName } from '../icon/get-icon-props';
import { Component, Prop, h } from '@stencil/core';

/**
 * This component enhances the visualization of a `boolean` field
 * in a `readonly` state.
 * The reason we offer this component is that the default styling
 * of the Checkbox or Toggle switch in the `readonly` state may not always
 * provide the best way of _visualizing information_, potentially leading to
 * confusion and negatively affecting the end-users' experience.
 *
 * @private
 * @exampleComponent limel-example-readonly-boolean
 */

@Component({
    tag: 'limel-readonly-boolean',
    shadow: true,
    styleUrl: 'readonly-boolean.scss',
})
export class ReadonlyBoolean {
    /**
     * The value of the component.
     * - `true` means for instance a checkbox is "checked" or toggle switch in "ON".
     * - `false` means "unchecked", or "OFF".
     */
    @Prop({ reflect: true })
    public value: boolean;

    /**
     * The checkbox label.
     * Will be replaced by `trueLabel` and `falseLabel` if they are set.
     */
    @Prop({ reflect: true })
    public label: string;

    /**
     * The text to show, when the `value` is `true`.
     */
    @Prop({ reflect: true })
    public trueLabel?: string;

    /**
     * The text to show, when the `value` is `false`.
     */
    @Prop({ reflect: true })
    public falseLabel?: string;

    /**
     * The icon to show, when the `value` is `true`.
     */
    @Prop({ reflect: true })
    public trueIcon?: string | Icon = 'ok';

    /**
     * The icon to show, when the `value` is `false`.
     */
    @Prop({ reflect: true })
    public falseIcon?: string | Icon = 'minus';

    public render() {
        return [this.renderIcon(), this.renderLabel()];
    }

    private renderIcon() {
        let icon;
        if (this.value) {
            icon = this.trueIcon;
        } else {
            icon = this.falseIcon;
        }

        const iconName = getIconName(icon);

        if (!iconName) {
            return;
        }

        let iconColor;
        let iconBackgroundColor;

        if (typeof icon === 'object' && 'name' in icon) {
            iconColor = icon.color;
            iconBackgroundColor = icon.backgroundColor;
        }

        const iconProps = {
            role: 'presentation',
            name: iconName,
            style: {
                color: iconColor,
                'background-color': iconBackgroundColor,
            },
        };

        return <limel-icon {...iconProps} />;
    }

    private renderLabel() {
        let label;

        if (this.trueLabel && this.falseLabel) {
            label = this.value ? this.trueLabel : this.falseLabel;
        } else {
            label = this.label;
        }

        return <span>{label}</span>;
    }
}
