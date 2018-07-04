import { Component, Event, EventEmitter, Prop } from '@stencil/core'; // tslint:disable-line:no-implicit-dependencies

@Component({
    shadow: true,
    styleUrl: 'switch.scss',
    tag: 'limel-switch',
})
export class Switch {
    @Prop() public label: string;
    @Prop() public disabled = false;
    @Prop() public value = false;

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
