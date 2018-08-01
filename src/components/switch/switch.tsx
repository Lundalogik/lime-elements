import { Component, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
    tag: 'limel-switch',
    styleUrl: 'switch.scss',
    shadow: true,
})
export class Switch {
    @Prop({ reflectToAttr: true })
    public label: string;
    @Prop({ reflectToAttr: true })
    public disabled = false;
    @Prop({ reflectToAttr: true })
    public value = false;

    @Event() private change: EventEmitter;

    public render() {
        return (
            <label class={`${this.disabled ? 'disabled' : ''}`}>
                <div class="mdc-switch">
                    <input
                        type="checkbox"
                        class="mdc-switch__native-control"
                        role="switch"
                        onChange={this.onChange}
                        disabled={this.disabled}
                        checked={this.value}
                    />
                    <div class="mdc-switch__background">
                        <div class="mdc-switch__knob" />
                    </div>
                </div>
                <span class="label">{this.label}</span>
            </label>
        );
    }

    private onChange = event => {
        this.change.emit(event.target.checked);
    };
}
