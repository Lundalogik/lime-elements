import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-tooltip-declutter',
    shadow: true,
    styleUrl: 'tooltip-declutter.scss',
})
export class TooltipUsageExample {
    public render() {
        return [
            <div class="do-dont-container action-buttons-examples">
                <div class="do-not">
                    <limel-header
                        icon="brake_warning"
                        heading="Don't"
                    ></limel-header>
                    <div class="fake-dialog-container shows-full-dialog">
                        <div class="fake-dialog">
                            <p>Schedule this task?</p>
                            <p>
                                Scheduled tasks will be run at night between
                                01:00 to 02:00.
                            </p>
                            <div class="action-bar">
                                <limel-button label="Cancel" />
                                <limel-button label="Schedule" primary={true} />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="do">
                    <limel-header icon="ok" heading="Do"></limel-header>
                    <div class="fake-dialog-container shows-full-dialog">
                        <div class="fake-dialog">
                            <p>
                                <span
                                    class="tooltip-trigger"
                                    id="tooltip-example"
                                >
                                    ?
                                </span>
                                Schedule this task?
                                <limel-tooltip
                                    label="Scheduled tasks will be run at night"
                                    helperLabel="between 01:00 to 02:00"
                                    elementId="tooltip-example"
                                />
                            </p>
                            <div class="action-bar">
                                <limel-button label="Cancel" />
                                <limel-button label="Schedule" primary={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
            <limel-example-do-do-not
                doDescription="aa"
                doNotDescription="aa"
            />,
        ];
    }
}
