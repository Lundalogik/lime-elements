# Events and input handling

All components in Lime Elements that has a value, and can take some kind of user input to change that value, has a `value` property, by which the consumer can set or update that value.

When the value of the component is changed from within the component, e.g. from the user typing in a field or clicking a checkbox, a `change` event is dispatched from the component with the new value. This means that the `value` property is *not* updated automatically and it is the responsibility of the consumer to set the new value, like in the example below.

## Custom events

All events that are declared in this documentation are of the type [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent), which has a `detail` property that may contain more information regarding the event. The type of the `detail` property is defined in this documentation and can be used in the event handler to make the code more readable.

## DOM events

Besides the custom events that are defined in this documentation, it is also possible to listen for any standard DOM event, e.g. `click`. These events do not have the `detail` property and how to use them is not described within this documentation.

## Example

```tsx
class MyComponent {    
    @State()
    private value: string;

    public render() {
        return [
            <limel-input-field
                value={this.value}
                onChange={this.handleChange} />,
            <limel-button
                label="Submit"
                onClick={this.handleClick} />
        ];
    }

    private handleChange = (event: CustomEvent<string>) => {
        this.value = event.detail;
    }

    private handleClick = (event: MouseEvent) => {
        console.log(this.value);
    }
}
```
