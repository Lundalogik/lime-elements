import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { FormComponent } from '@limetech/lime-elements';

interface Widget {
    name: string;
}

@Component({
    tag: 'limel-example-custom-card-list',
    shadow: true,
    styleUrl: 'custom-component-card-list.scss',
})
export class CustomCardListExample implements FormComponent<Widget[]> {
    /**
     * {@inheritdoc FormComponent.value}
     */
    @Prop()
    public value: Widget[] = [];

    /**
     * {@inheritdoc FormComponent.readonly}
     */
    @Prop()
    public readonly?: boolean;

    /**
     * {@inheritdoc FormComponent.disabled}
     */
    @Prop()
    public disabled?: boolean;

    /**
     * {@inheritdoc FormComponent.invalid}
     */
    @Prop()
    public invalid?: boolean;

    /**
     * {@inheritdoc FormComponent.helperText}
     */
    @Prop()
    public helperText?: string;

    /**
     * Emitted when the value is changed
     */
    @Event()
    public change: EventEmitter<Widget[]>;

    public render() {
        return (
            <Host>
                {this.renderItems()}
                {this.renderError()}
            </Host>
        );
    }

    private renderItems() {
        const items = this.value ?? [];
        if (items.length === 0) {
            return <p>Nothing here yet.</p>;
        }

        return (
            <ul>{items.map((item, index) => this.renderItem(item, index))}</ul>
        );
    }

    private renderError() {
        if (!this.invalid || !this.helperText) {
            return;
        }

        return (
            <limel-helper-line helperText={this.helperText} invalid={true} />
        );
    }

    private readonly renderItem = (item: Widget, index: number) => {
        return (
            <li>
                <span>{item.name}</span>
                <limel-icon-button
                    icon="trash"
                    label={`Remove ${item.name}`}
                    disabled={this.disabled || this.readonly}
                    onClick={() => this.remove(index)}
                />
            </li>
        );
    };

    private remove(index: number) {
        this.change.emit(this.value.filter((_, i) => i !== index));
    }
}
