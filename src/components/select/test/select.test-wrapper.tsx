import { Option } from '../option.types';
import { Component, h, Prop } from '@stencil/core';

/**
 * @private
 */
@Component({ tag: 'select-test-wrapper' })
export class SelectTestWrapper {
    @Prop({ mutable: true })
    public value?: Option;

    @Prop()
    public native?: boolean;

    @Prop({ mutable: true })
    public onChangeCalledTimes = 0;

    @Prop({ mutable: true })
    public onChangeLastEventDetails: string;

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        const props: any = {};
        if (this.native) {
            props.native = true;
        }

        return (
            <limel-select
                {...props}
                label="Favourite Doctor"
                value={this.value}
                onChange={this.onChange}
            />
        );
    }

    private onChange(event) {
        this.onChangeCalledTimes += 1;
        this.onChangeLastEventDetails = event.detail;
        this.value = event.detail;
    }
}
