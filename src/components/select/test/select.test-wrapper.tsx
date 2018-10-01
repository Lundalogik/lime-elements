import { Component, Prop } from '@stencil/core';

@Component({ tag: 'select-test-wrapper' })
export class SelectTestWrapper {
    @Prop({mutable: true})
    public value?: string;

    @Prop({mutable: true})
    public onChangeCalledTimes = 0;

    @Prop({mutable: true})
    public onChangeLastEventDetails: string;

    public render() {
        return (
            <limel-select
                label="Favourite Doctor"
                value={this.value}
                onChange={event => {
                    this.onChange(event);
                }}
            ></limel-select>
        );
    }

    private onChange(event) {
        this.onChangeCalledTimes += 1;
        this.onChangeLastEventDetails = event.detail;
        this.value = event.detail;
    }
}
