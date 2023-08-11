import { Component, h } from '@stencil/core';

/**
 * Using `maxlength` property
 * To present an easy to read content, the tooltip's maximum text
 * length is set to 50 characters, including spaces.
 * When this threshold is reached, content will be rendered with line breaks.
 * However, it is possible to override this value by specifying `maxlength`.
 *
 * :::note
 * Tooltips are intended to display very brief information.
 * Try not to place large amount of text in them.
 * :::
 */
@Component({
    tag: 'limel-example-tooltip-max-character',
    shadow: true,
    styleUrl: 'tooltip-max-character.scss',
})
export class TooltipExample {
    public render() {
        return [
            <limel-icon-button icon="info" id="tooltip1" />,
            <limel-icon-button icon="info" id="tooltip2" />,
            <limel-icon-button icon="info" id="tooltip3" />,
            <limel-tooltip
                label="Short text"
                helperLabel="less than 25ch"
                elementId="tooltip1"
                maxlength={25}
            />,
            <limel-tooltip
                label="Long text"
                helperLabel="The total amount of characters is more than 25"
                elementId="tooltip2"
                maxlength={25}
            />,
            <limel-tooltip
                label="Very long text"
                helperLabel="The total amount of characters is more than default max character length, which is 50ch. Note that there is no max character length specified here."
                elementId="tooltip3"
            />,
        ];
    }
}
