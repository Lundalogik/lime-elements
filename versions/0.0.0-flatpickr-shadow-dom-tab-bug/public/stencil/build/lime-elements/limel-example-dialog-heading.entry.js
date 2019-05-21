const h = window.LimeElements.h;

class DialogHeadingExample {
    constructor() {
        this.isOpen = false;
        this.title = 'Title';
        this.subtitle = 'Subtitle';
        this.badge = true;
        this.icons = [
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
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleSubtitleChange = this.handleSubtitleChange.bind(this);
        this.handleSupportingTextChange = this.handleSupportingTextChange.bind(this);
        this.handleIconChange = this.handleIconChange.bind(this);
        this.handleBadgeChange = this.handleBadgeChange.bind(this);
        this.icon = this.icons[0];
    }
    render() {
        const heading = {
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
            h("limel-button", { primary: true, label: "Open", onClick: this.openDialog }),
            h("limel-dialog", { open: this.isOpen, onClose: this.closeDialog, heading: heading, class: classNames },
                h("limel-input-field", { required: true, label: "Title", value: this.title, onChange: this.handleTitleChange }),
                h("limel-input-field", { label: "Subtitle", value: this.subtitle, onChange: this.handleSubtitleChange }),
                h("limel-input-field", { label: "Supporting text", value: this.supportingText, onChange: this.handleSupportingTextChange }),
                h("limel-select", { required: true, options: this.icons, label: "Icon", value: this.icon, onChange: this.handleIconChange }),
                h("limel-checkbox", { label: "Badge", checked: this.badge, onChange: this.handleBadgeChange }),
                h("limel-flex-container", { justify: "end", slot: "button" },
                    h("limel-button", { label: "Ok", primary: true, onClick: this.closeDialog }))),
        ];
    }
    openDialog() {
        this.isOpen = true;
    }
    closeDialog() {
        this.isOpen = false;
    }
    handleTitleChange(event) {
        this.title = event.detail;
    }
    handleSubtitleChange(event) {
        this.subtitle = event.detail;
    }
    handleSupportingTextChange(event) {
        this.supportingText = event.detail;
    }
    handleIconChange(event) {
        this.icon = event.detail;
    }
    handleBadgeChange(event) {
        this.badge = event.detail;
    }
    static get is() { return "limel-example-dialog-heading"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "badge": {
            "state": true
        },
        "icon": {
            "state": true
        },
        "isOpen": {
            "state": true
        },
        "subtitle": {
            "state": true
        },
        "supportingText": {
            "state": true
        },
        "title": {
            "state": true
        }
    }; }
    static get style() { return ":host(limel-example-dialog-heading) {\n  --dialog-width: 700px;\n  --dialog-height: 650px;\n  --dialog-heading-supporting-text-color: #b00020;\n}\n:host(limel-example-dialog-heading) limel-dialog.company {\n  --dialog-heading-icon-color: var(--lime-blue);\n}\n:host(limel-example-dialog-heading) limel-dialog.company.badge {\n  --dialog-heading-icon-background-color: var(--lime-blue);\n}\n:host(limel-example-dialog-heading) limel-dialog.person {\n  --dialog-heading-icon-color: var(--lime-orange);\n}\n:host(limel-example-dialog-heading) limel-dialog.person.badge {\n  --dialog-heading-icon-background-color: var(--lime-orange);\n}\n:host(limel-example-dialog-heading) limel-dialog.deal {\n  --dialog-heading-icon-color: var(--lime-green);\n}\n:host(limel-example-dialog-heading) limel-dialog.deal.badge {\n  --dialog-heading-icon-background-color: var(--lime-green);\n}\n:host(limel-example-dialog-heading) limel-dialog.todo {\n  --dialog-heading-icon-color: var(--lime-turquoise);\n}\n:host(limel-example-dialog-heading) limel-dialog.todo.badge {\n  --dialog-heading-icon-background-color: var(--lime-turquoise);\n}\n:host(limel-example-dialog-heading) limel-dialog.badge {\n  --dialog-heading-icon-color: white;\n}"; }
}

export { DialogHeadingExample as LimelExampleDialogHeading };
