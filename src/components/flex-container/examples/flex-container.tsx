import {
    FlexContainerAlign,
    FlexContainerDirection,
    FlexContainerJustify,
    LimelSelectCustomEvent,
    Option,
} from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

@Component({
    tag: 'limel-example-flex-container',
    shadow: true,
    styleUrl: 'flex-container.scss',
})
export class FlexContainerExample {
    private directionOptions: Array<Option<FlexContainerDirection>> = [
        {
            text: 'Horizontal',
            value: 'horizontal',
        },
        {
            text: 'Vertical',
            value: 'vertical',
        },
    ];

    private alignOptions: Array<Option<FlexContainerAlign>> = [
        {
            value: 'start',
            text: 'Start',
        },
        {
            value: 'center',
            text: 'Center',
        },
        {
            value: 'end',
            text: 'End',
        },
        {
            value: 'stretch',
            text: 'Stretch',
        },
    ];

    private justifyOptions: Array<Option<FlexContainerJustify>> = [
        {
            value: 'start',
            text: 'Start',
        },
        {
            value: 'center',
            text: 'Center',
        },
        {
            value: 'end',
            text: 'End',
        },
        {
            value: 'space-around',
            text: 'Space around',
        },
        {
            value: 'space-between',
            text: 'Space between',
        },
        {
            value: 'space-evenly',
            text: 'Space evenly',
        },
    ];

    @State()
    private direction: Option<FlexContainerDirection>;

    @State()
    private align: Option<FlexContainerAlign>;

    @State()
    private justify: Option<FlexContainerJustify>;

    @State()
    private reverse = false;

    public componentWillLoad() {
        this.direction = this.directionOptions[0];
        this.align = this.alignOptions[0];
        this.justify = this.justifyOptions[0];
    }

    public render() {
        return [
            <limel-flex-container justify="space-between">
                <limel-select
                    label="Direction"
                    options={this.directionOptions}
                    value={this.direction}
                    onChange={this.directionOnChange}
                />
                <limel-select
                    label="Align"
                    options={this.alignOptions}
                    value={this.align}
                    onChange={this.alignOnChange}
                />
                <limel-select
                    label="Justify"
                    options={this.justifyOptions}
                    value={this.justify}
                    onChange={this.justifyOnChange}
                />
                <limel-checkbox
                    label="Reverse"
                    checked={this.reverse}
                    onChange={this.reverseOnChange}
                />
            </limel-flex-container>,
            <limel-flex-container
                class="container"
                direction={this.direction.value}
                align={this.align.value}
                justify={this.justify.value}
                reverse={this.reverse}
            >
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
            </limel-flex-container>,
        ];
    }

    private directionOnChange = (
        event: LimelSelectCustomEvent<Option<FlexContainerDirection>>
    ) => {
        this.direction = event.detail;
    };

    private alignOnChange = (
        event: LimelSelectCustomEvent<Option<FlexContainerAlign>>
    ) => {
        this.align = event.detail;
    };

    private justifyOnChange = (
        event: LimelSelectCustomEvent<Option<FlexContainerJustify>>
    ) => {
        this.justify = event.detail;
    };

    private reverseOnChange = (event: CustomEvent<boolean>) => {
        this.reverse = event.detail;
    };
}
