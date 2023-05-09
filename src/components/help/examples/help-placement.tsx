import { Component, h } from '@stencil/core';

const helpAutoUpdates =
    'Automatically download and install updates, when the phone is connected to a Wi-Fi, is charging and is locked.';
const helpBetaUpdates =
    'Receive updates on this phone to test-drive pre-release versions of the operating system and provide feedback to help us become even better.';

/**
 * Placement of the trigger element and the layout
 *
 * The trigger element of the help component can be placed
 * before or after the element it is describing.
 *
 * However, to provide a consistent layout, we recommend placing the
 * trigger element on the left side of all elements.
 *
 * Just make sure the elements are aligned correctly,
 * even when there is no help component beside them.
 */
@Component({
    tag: 'limel-example-placement',
    shadow: true,
    styleUrl: 'help-placement.scss',
})
export class HelpPlacementExample {
    public render() {
        return [
            <h4>Better layout</h4>,
            <ul>
                <li>
                    <limel-help value={helpAutoUpdates} class="pull-left" />
                    <limel-checkbox label="Automatic updates" />
                </li>
                <li>
                    <limel-help value={helpBetaUpdates} class="pull-left" />
                    <limel-checkbox label="Beta updates" />
                </li>
                <li>
                    <limel-checkbox label="Notify after update" />
                </li>
            </ul>,
            <hr />,
            <h4>Worse layout</h4>,
            <ul>
                <li>
                    <limel-checkbox label="Automatic updates" />
                    <limel-help value={helpAutoUpdates} />
                </li>
                <li>
                    <limel-checkbox label="Beta updates" />
                    <limel-help value={helpBetaUpdates} />
                </li>
                <li>
                    <limel-checkbox label="Notify after update" />
                </li>
            </ul>,
        ];
    }
}
