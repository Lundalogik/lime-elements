import { Component, State } from '@stencil/core';
import { DialogHeading } from '../../components/dialog/dialog.types';
import { Option } from '../../components/select/option.types';

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

    @State()
    private badge: boolean = true;

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
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleSubtitleChange = this.handleSubtitleChange.bind(this);
        this.handleSupportingTextChange = this.handleSupportingTextChange.bind(
            this
        );
        this.handleIconChange = this.handleIconChange.bind(this);
        this.handleBadgeChange = this.handleBadgeChange.bind(this);

        this.icon = this.icons[0];
    }

    public render() {
        const heading: DialogHeading = {
            title: this.title,
            subtitle: this.subtitle,
            supportingText: this.supportingText,
            icon: this.icon.value,
            badgeIcon: this.badge,
        };
        const classNames = {
            [this.icon.text.toLowerCase()]: true,
            badge: this.badge,
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
                <limel-checkbox
                    label="Badge"
                    checked={this.badge}
                    onChange={this.handleBadgeChange}
                />

                <limel-flex-container justify="end" slot="button">
                    <limel-button
                        label="Ok"
                        primary={true}
                        onClick={this.closeDialog}
                    />
                </limel-flex-container>
            </limel-dialog>,
        ];
    }

    private openDialog() {
        this.isOpen = true;
    }

    private closeDialog() {
        this.isOpen = false;
    }

    private handleTitleChange(event: CustomEvent<string>) {
        this.title = event.detail;
    }

    private handleSubtitleChange(event: CustomEvent<string>) {
        this.subtitle = event.detail;
    }

    private handleSupportingTextChange(event: CustomEvent<string>) {
        this.supportingText = event.detail;
    }

    private handleIconChange(event: CustomEvent<Option>) {
        this.icon = event.detail;
    }

    private handleBadgeChange(event: CustomEvent<boolean>) {
        this.badge = event.detail;
    }
}
