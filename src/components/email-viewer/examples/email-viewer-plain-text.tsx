import { Component, h } from '@stencil/core';
import { Email } from '../email-viewer.types';

/**
 * Plain text email
 *
 * Example showing a plain text email body with all header fields set,
 * including multiple recipients.
 *
 * :::note
 * If multiple recipients are provided as `to` or `cc`,
 * they should be separated by commas.
 * When rendering, this component splits the list on commas that are
 * outside quoted strings (that indicate the name) and outside
 * angle-bracketed address parts.
 *
 * If a display name contains a comma, it should be quoted, e.g.
 * `"Doe, Jane" <jane.doe@example.com>`.
 * :::
 */
@Component({
    tag: 'limel-example-email-viewer-plain-text',
    shadow: true,
})
export class EmailViewerPlainTextExample {
    public render() {
        const email: Email = {
            subject: 'Planning: Q1 kickoff',
            from: 'Jane Doe <jane.doe@example.com>',
            to: '"Team A" <team-a@example.com>, Team B <team-b@example.com>',
            cc: '"Lastname, Firstname" <comma.name@example.com>, Design <design@example.com>',
            date: 'Tue, 20 Jan 2026 09:12:34 +0100',
            bodyText:
                'Hi everyone,\n\n' +
                'Here are the goals for the Q1 kickoff:\n' +
                '- Align on priorities\n' +
                '- Confirm owners\n' +
                '- Agree on timelines\n\n' +
                'Please reply with any blockers.\n\n' +
                'Best,\n' +
                'Lucy\n',
        };

        return <limel-email-viewer email={email} />;
    }
}
