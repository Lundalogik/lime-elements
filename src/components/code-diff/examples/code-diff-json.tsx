import { Component, h } from '@stencil/core';

const OLD_CONFIG = {
    appName: 'My Application',
    version: '2.1.0',
    database: {
        host: 'db.example.com',
        port: 5432,
        maxConnections: 10,
        timeout: 30,
    },
    features: {
        darkMode: false,
        notifications: true,
        analytics: true,
    },
    logging: {
        level: 'info',
        format: 'json',
    },
};

const NEW_CONFIG = {
    appName: 'My Application',
    version: '2.2.0',
    database: {
        host: 'db-prod.example.com',
        port: 5432,
        maxConnections: 25,
        timeout: 60,
        ssl: true,
    },
    features: {
        darkMode: true,
        notifications: true,
        analytics: false,
    },
    logging: {
        level: 'warn',
        format: 'json',
        destination: '/var/log/app.log',
    },
};

/**
 * JSON object diff with syntax highlighting
 *
 * When comparing objects, the component serializes them to
 * pretty-printed JSON with sorted keys before diffing.
 * Set `reformatJson` to normalize formatting and key order,
 * eliminating noise from trivial differences.
 *
 * Set `language` to `"json"` to enable syntax highlighting,
 * which colorizes keys, strings, numbers, booleans, and null
 * values alongside the diff highlighting.
 */
@Component({
    tag: 'limel-example-code-diff-json',
    shadow: true,
})
export class CodeDiffJsonExample {
    public render() {
        return (
            <limel-code-diff
                oldValue={OLD_CONFIG}
                newValue={NEW_CONFIG}
                oldHeading="Config v2.1.0"
                newHeading="Config v2.2.0"
                reformatJson={true}
                language="json"
            />
        );
    }
}
