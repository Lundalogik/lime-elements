import { getIconName } from '../icon/get-icon-props';
import { Component, Prop, h } from '@stencil/core';
import { Label, LabelValue } from './label.types';
import { Icon, IconName } from '../../global/shared-types/icon.types';

/**
 * This components displays a different label depending on the current given
 * value. A label can consist of a text and an optional icon. If no matching
 * label is found among the given `labels`, the `defaultLabel` will be displayed.
 *
 * One use case of the component is to enhance the visualization of a `boolean`
 * field like a checkbox or switch in a `readonly` state.
 *
 * The reason we offer this component is that the default styling
 * of the Checkbox or Toggle switch in the `readonly` state may not always
 * provide the best way of _visualizing information_, potentially leading to
 * confusion and negatively affecting the end-users' experience.
 *
 * @exampleComponent limel-example-dynamic-label
 * @exampleComponent limel-example-dynamic-label-readonly-boolean
 */
@Component({
    tag: 'limel-dynamic-label',
    shadow: true,
    styleUrl: 'dynamic-label.scss',
})
export class DynamicLabel {
    /**
     * The current value of the component which is used to match with the given
     * `labels` to determine what label to display.
     *
     * If not matching label is found, the `defaultLabel` is displayed.
     */
    @Prop()
    public value: LabelValue;

    /**
     * The label to display when no matching value is found in the `labels`
     * array. This is a fallback label that ensures there's always a label
     * displayed for the component.
     */
    @Prop({ reflect: true })
    public defaultLabel: Omit<Label, 'value'> = {};

    /**
     * A list of available labels. Each label has a corresponding value that
     * will be matched with the current `value` of the component to determine
     * what label to display.
     */
    @Prop()
    public labels: Label[] = [];

    public render() {
        const label = this.labels.find((l) => l.value === this.value);

        return [
            this.renderIcon(label?.icon ?? this.defaultLabel.icon),
            this.renderLabel(label?.text ?? this.defaultLabel.text),
        ];
    }

    private renderIcon(icon?: IconName | Icon) {
        const iconName = getIconName(icon);
        if (!iconName) {
            return;
        }

        let iconColor: string | undefined;
        let iconBackgroundColor: string | undefined;

        if (typeof icon === 'object') {
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

    private renderLabel(label: string = '') {
        return <label>{label}</label>;
    }
}
