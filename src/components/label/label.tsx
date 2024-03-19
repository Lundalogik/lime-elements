import { getIconName } from '../icon/get-icon-props';
import { Component, Prop, h } from '@stencil/core';
import { Label, LabelValue } from './label.types';
import { Icon } from '../../interface';

/**
 * This components diplays a different label depending on the current given
 * value. A label can consist of a text and an icon. If no matching label is
 * found, the default label will be displayed.
 *
 * One use case of the component is to enhance the visualization of a `boolean`
 * field like a checkbox or switch in a `readonly` state.
 *
 * The reason we offer this component is that the default styling
 * of the Checkbox or Toggle switch in the `readonly` state may not always
 * provide the best way of _visualizing information_, potentially leading to
 * confusion and negatively affecting the end-users' experience.
 *
 * @exampleComponent limel-example-label
 * @beta
 */
@Component({
    tag: 'limel-label',
    shadow: true,
    styleUrl: 'label.scss',
})
export class DynamicLabel {
    /**
     * The value of the component.
     *
     * The value will be matched with the given labels to determine what label
     * to display
     */
    @Prop({ reflect: true })
    public value: LabelValue;

    /**
     * Default label to display if no label with corresponding value is found
     */
    @Prop({ reflect: true })
    public defaultLabel: Omit<Label, 'value'> = {};

    /**
     * Available labels
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

    private renderIcon(icon?: string | Icon) {
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
        return <span>{label}</span>;
    }
}
