import {
    Component,
    Element,
    Event,
    EventEmitter,
    Listen,
    Prop,
    State,
} from '@stencil/core';

@Component({
    shadow: true,
    styleUrl: 'autocomplete.scss',
    tag: 'limel-autocomplete',
})
export class Autocomplete {
    @Prop()
    public disabled: boolean = false;
    @Prop()
    public completions: string[] = [];
    @Prop()
    public label: string;
    @Prop()
    public required: boolean = false;
    @Prop()
    public value: string;

    @State()
    private internalValue: string;
    @State()
    private listIsOpen: boolean = false;

    @Element()
    private element: HTMLElement;

    @Event()
    private autoCompleteChange: EventEmitter;

    @Listen('change')
    public handleInputChange(event) {
        this.internalValue = event.detail;
        this.autoCompleteChange.emit(this.internalValue);
    }

    public componentDidLoad() {
        this.internalValue = this.value;
        this.element.addEventListener('focus', () => {
            this.listIsOpen = true;
        });
        this.element.addEventListener('blur', () => {
            window.setTimeout(() => {
                this.listIsOpen = false;
            }, 0);
        });
    }

    public componentWillUpdate() {
        if (this.internalValue !== this.value) {
            this.internalValue = this.value;
        }
    }

    public render() {
        return (
            <div>
                <limel-text-field
                    label={this.label}
                    value={this.internalValue}
                    disabled={this.disabled}
                    required={this.required}
                />
                <div class="autocomplete-list-container">
                    {this.renderDropdown()}
                </div>
            </div>
        );
    }

    private renderDropdown() {
        const filteredCompletions = this.filterCompletions(this.internalValue);

        if (!filteredCompletions || filteredCompletions.length === 0) {
            return null;
        }
        return (
            this.listIsOpen && (
                <div class="autocomplete-list mdc-elevation--z4">
                    <ul class="mdc-list">
                        {filteredCompletions.map(completion => {
                            return (
                                <li
                                    class="mdc-list-item"
                                    onMouseDown={event => {
                                        this.completionClickHandler(
                                            event,
                                            completion
                                        );
                                    }}
                                >
                                    {completion}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )
        );
    }

    private completionClickHandler(_, autocompletion: string) {
        this.internalValue = autocompletion;
        this.autoCompleteChange.emit(this.internalValue);
    }

    private filterCompletions = (filter: string) => {
        if (!filter) {
            return this.completions;
        }
        return this.completions.filter(
            completion =>
                completion.toLowerCase().indexOf(filter.toLowerCase()) > -1
        );
    };
}
