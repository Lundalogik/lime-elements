import { Component, Prop, State } from '@stencil/core';

@Component({
    tag: 'limel-props',
    styleUrl: 'props.scss',
})
export class Props {
    @Prop() public name: string;

    @State() private props = [];

    @State() private events = [];

    public componentDidLoad() {
        const type = this.name.replace('limel-', '');
        const url = `/stencil/components/${type}/readme.md`;

        this.fetchData(url).then(data => {
            const lines = data.split('\n').filter(row => !!row.trim());
            const { props, events } = this.parseLines(lines);

            this.props = props;
            this.events = events;
        });
    }

    public render() {
        return [this.renderPropsTable(), this.renderEventsTable()];
    }

    private renderPropsTable() {
        if (!this.props.length) {
            return;
        }

        return [
            <h2>Properties</h2>,
            <table>
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Type</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.map(prop => {
                        return (
                            <tr>
                                <td>{prop.name}</td>
                                <td>{prop.type}</td>
                                <td>{prop.description}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>,
        ];
    }

    private renderEventsTable() {
        if (!this.events.length) {
            return;
        }

        return [
            <h2>Events</h2>,
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {this.events.map(event => {
                        return (
                            <tr>
                                <td>{event.name}</td>
                                <td>{event.description}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>,
        ];
    }

    private fetchData(url) {
        return fetch(url).then(data => {
            return data.body
                .getReader()
                .read()
                .then(({ value }) => {
                    return new TextDecoder('utf-8').decode(value);
                });
        });
    }

    private parseLines(lines) {
        const props = [];
        const events = [];
        let i = 0;
        let line;
        let mode = null;
        let currentObject;

        do {
            line = lines[i++];

            if (!line || line.includes('---------')) {
                break;
            }

            if (line.includes('## Properties')) {
                mode = 'props';
                continue;
            }

            if (line.includes('## Attributes')) {
                mode = 'attr';
                continue;
            }

            if (line.includes('## Events')) {
                mode = 'events';
                continue;
            }

            currentObject = this.editObject(
                line,
                currentObject,
                props,
                events,
                mode
            );
        } while (true); // tslint:disable-line

        return { props: props, events: events };
    }

    private editObject(line, currentObject, props, events, mode) {
        if (line.includes('##')) {
            currentObject = {
                name: line.replace('####', '').trim(),
            };

            if (mode === 'props') {
                props.push(currentObject);
            } else if (mode === 'events') {
                events.push(currentObject);
            }
            return currentObject;
        }

        if (mode === 'props') {
            if (!('type' in currentObject)) {
                currentObject.type = line;
                return currentObject;
            }

            currentObject.description = line;
            return currentObject;
        }

        if (mode === 'events') {
            currentObject.description = line;
            return currentObject;
        }
    }
}
