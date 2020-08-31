import { Component, h, Prop } from '@stencil/core';
import { isDate, isObject, isArray, isUndefined } from 'lodash-es';

@Component({
    tag: 'limel-example-value',
    styleUrl: 'example-value.scss',
})
export class ExampleValue {
    /**
     *
     */
    @Prop({ reflectToAttr: true })
    public label: string = 'Value';

    /**
     *
     */
    @Prop()
    public value: any;

    public render() {
        return (
            <p>
                {this.label}: {this.format(this.value)}
            </p>
        );
    }

    private format(val: any) {
        if (isUndefined(val)) {
            return <code>undefined</code>;
        }

        if (isDate(val)) {
            return <code>{val.toString()}</code>;
        }

        if (isObject(val) || isArray(val)) {
            return (
                <pre>
                    <code>{JSON.stringify(val, null, 2)}</code>
                </pre>
            );
        }

        return <code>{JSON.stringify(val, null, 2)}</code>;
    }
}
