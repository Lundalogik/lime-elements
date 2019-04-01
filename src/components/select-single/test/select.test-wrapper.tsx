import { Component, Prop } from '@stencil/core';
import { Option } from '../../../interface';

@Component({ tag: 'select-test-wrapper' })
export class SelectTestWrapper {
    @Prop({ mutable: true })
    public value?: Option;

    @Prop({ mutable: true })
    public onChangeCalledTimes = 0;

    @Prop({ mutable: true })
    public onChangeLastEventDetails: string;

    constructor() {
        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return (
            <limel-select-single
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
