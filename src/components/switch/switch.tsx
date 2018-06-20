import { Component, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
    tag: 'limel-switch',
    styleUrl: 'switch.scss',
    shadow: true
})
export class Switch {

    @Prop() label: string;
    @Prop() disabled = false;
    @Prop() value = false;

    @Event() change: EventEmitter;

    onChange = event => {
        this.change.emit(event.target.checked);
    };

    render() {
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
                    ></input>
                    <div class="mdc-switch__background">
                        <div class="mdc-switch__knob"></div>
                    </div>
                </div>
                <span class="label">{this.label}</span>
            </label>
        );
    }
}
