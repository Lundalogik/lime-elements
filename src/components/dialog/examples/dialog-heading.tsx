import { DialogHeading, Option } from '@limetech/lime-elements';
import { Component, h, State } from '@stencil/core';

/**
 * Dialog with heading
 *
 * In this example you can also see how available style properties can be used.
 */
@Component({
    tag: 'limel-example-dialog-heading',
    styleUrl: 'dialog-heading.scss',
    shadow: true,
})
export class DialogHeadingExample {
    @State()
    private isOpen = false;

    @State()
    private title: string = 'Title';

    @State()
    private subtitle: string = 'Subtitle';

    @State()
    private supportingText: string;

    @State()
    private icon: Option;

    private icons: Option[] = [
        {
            text: 'Company',
            value: 'organization',
        },
        {
            text: 'Person',
            value: 'user_group_man_man',
        },
        {
            text: 'Deal',
            value: 'money',
        },
        {
            text: 'Todo',
            value: 'todo_list',
        },
    ];

    constructor() {
        this.icon = this.icons[0];
    }

    public render() {
        const heading: DialogHeading = {
            title: this.title,
            subtitle: this.subtitle,
            supportingText: this.supportingText,
            icon: this.icon.value,
        };
        const classNames = {
            [this.icon.text.toLowerCase()]: true,
        };

        return [
            <limel-button
                primary={true}
                label="Open"
                onClick={this.openDialog}
            />,
            <limel-dialog
                open={this.isOpen}
                onClose={this.closeDialog}
                heading={heading}
                class={classNames}
            >
                <limel-input-field
                    required={true}
                    label="Title"
                    value={this.title}
                    onChange={this.handleTitleChange}
                />
                <limel-input-field
                    label="Subtitle"
                    value={this.subtitle}
                    onChange={this.handleSubtitleChange}
                />
                <limel-input-field
                    label="Supporting text"
                    value={this.supportingText}
                    onChange={this.handleSupportingTextChange}
                />

                <limel-select
                    required={true}
                    options={this.icons}
                    label="Icon"
                    value={this.icon}
                    onChange={this.handleIconChange}
                />

                <limel-button
                    label="Ok"
                    primary={true}
                    onClick={this.closeDialog}
                    slot="button"
                />
            </limel-dialog>,
        ];
    }

    private openDialog = () => {
        this.isOpen = true;
    };

    private closeDialog = () => {
        this.isOpen = false;
    };

    private handleTitleChange = (event: CustomEvent<string>) => {
        this.title = event.detail;
    };

    private handleSubtitleChange = (event: CustomEvent<string>) => {
        this.subtitle = event.detail;
    };

    private handleSupportingTextChange = (event: CustomEvent<string>) => {
        this.supportingText = event.detail;
    };

    private handleIconChange = (event: CustomEvent<Option>) => {
        this.icon = event.detail;
    };
}
