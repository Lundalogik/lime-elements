import { Component, h } from '@stencil/core';
import { ListItem } from '@limetech/lime-elements';

/**
 * Adding custom actions
 */
@Component({
    tag: 'limel-example-file-viewer-custom-actions',
    shadow: true,
})
export class FileViewerCustomActionsExample {
    public render() {
        return (
            <limel-file-viewer
                url="https://filesamples.com/samples/document/docx/sample1.docx"
                actions={this.actions}
                onAction={this.handleAction}
            />
        );
    }

    private actions: ListItem[] = [
        {
            text: 'Show Alert',
            icon: 'google_alerts_copyrighted',
            value: 'action',
        },
        { text: 'Edit', icon: 'edit' },
        { text: 'Download as PDF', icon: 'PDF_2' },
        { text: 'Send for signing', icon: 'sign_up' },
    ];

    private handleAction = (event: CustomEvent<ListItem>) => {
        if (event.detail.value === 'action') {
            return this.showAlert();
        }
    };

    private showAlert() {
        alert('Hello! I am an alert box 😊');
    }
}
