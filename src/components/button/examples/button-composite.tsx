import { Component, h, State } from '@stencil/core';

/**
 * Composite
 *
 * A place to try different combinations of states.
 */
@Component({
    tag: 'limel-example-button-composite',
    shadow: true,
})
export class ButtonCompositeExample {
    @State()
    private props = {
        primary: true,
        outlined: false,
        disabled: false,
        loading: false,
    };

    @State()
    private formValue: any = {
        label: 'My button',
        icon: 'dog',
    };

    private eventPrinter: HTMLLimelExampleEventPrinterElement;

    public render() {
        return [
            <limel-button
                {...this.formValue}
                {...this.props}
                onClick={this.handleEvent}
            />,
            this.renderForm(),
            <limel-example-event-printer
                ref={(el) => (this.eventPrinter = el)}
            />,
        ];
    }

    private handleEvent = (event: Event) => {
        this.eventPrinter.writeEvent(event);
    };

    private renderForm() {
        return (
            <limel-example-controls
                style={{ '--example-controls-column-layout': 'auto-fit' }}
            >
                <limel-input-field
                    label="Label"
                    value={this.formValue.label}
                    onChange={(event: CustomEvent<string>) => {
                        this.formValue = {
                            ...this.formValue,
                            label: event.detail,
                        };
                    }}
                />
                <limel-input-field
                    label="Icon"
                    value={this.formValue.icon}
                    onChange={(event: CustomEvent<string>) => {
                        this.formValue = {
                            ...this.formValue,
                            icon: event.detail,
                        };
                    }}
                />
                <limel-switch
                    label="Primary"
                    value={this.props.primary}
                    onChange={this.setPrimary}
                />
                <limel-switch
                    label="Disabled"
                    value={this.props.disabled}
                    onChange={this.setDisabled}
                />
                <limel-switch
                    label="Loading"
                    value={this.props.loading}
                    onChange={this.setLoading}
                />
                <limel-switch
                    label="Outlined"
                    value={this.props.outlined}
                    onChange={this.setOutlined}
                />
            </limel-example-controls>
        );
    }

    private setDisabled = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.props = {
            ...this.props,
            disabled: event.detail,
        };
    };

    private setPrimary = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.props = {
            ...this.props,
            primary: event.detail,
        };
    };

    private setOutlined = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.props = {
            ...this.props,
            outlined: event.detail,
        };
    };

    private setLoading = (event: CustomEvent<boolean>) => {
        event.stopPropagation();
        this.props = {
            ...this.props,
            loading: event.detail,
        };
    };
}
