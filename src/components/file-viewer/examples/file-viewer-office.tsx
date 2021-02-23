import { Component, State, h } from '@stencil/core';
import { Option, LimelSelectCustomEvent } from '@limetech/lime-elements';
import { OfficeViewer } from '../file-viewer.types';

/**
 * Office files
 *
 * There are many different software programs that can be used to create
 * office files such as word processing documents, spreadsheets, and presentations.
 * Web browsers do not natively support these formats for direct display.
 *
 * However, using the file-viewer component, you can easily display the content
 * of office file types. The viewer relies on a few third-party technologies
 * to render the file.
 *
 * By default, the component uses Microsoft Office Viewer, since it supports
 * a wider range of file office formats. However, you can
 * choose other viewers which are supported by this component.
 *
 * :::important
 * 1. The file should be stored somewhere with a publicly accessible URL,
 * otherwise the viewer cannot render them.
 * 1. Once the file is viewed, it might get cached for a short while on the
 * 3rd party servers –therefor remain publicly visible–,
 * even if the original file deleted.
 * 1. Files that are too large may not be rendered at all.
 * :::
 */
@Component({
    tag: 'limel-example-file-viewer-office',
    shadow: true,
    styleUrl: 'file-viewer.scss',
})
export class FileViewerOfficeExample {
    @State()
    private selectedOfficeViewer: Option<OfficeViewer>;

    private availableOfficeViewers: Array<Option<OfficeViewer>>;

    private microsoftDocuments = [
        {
            title: 'Microsoft Word',
            extension: '.docx',
            url: 'https://filesamples.com/samples/document/docx/sample1.docx',
        },
        {
            title: 'Microsoft PowerPoint',
            extension: '.ppt',
            url: 'https://filesamples.com/samples/document/ppt/sample1.ppt',
        },
        {
            title: 'Microsoft Excel',
            extension: '.xlsx',
            url: 'https://filesamples.com/samples/document/xlsx/sample1.xlsx',
        },
    ];

    private openDocuments = [
        {
            title: 'Text',
            extension: '.odt',
            url: 'https://filesamples.com/samples/document/odt/sample1.odt',
        },
        {
            title: 'Spreadsheet',
            extension: '.ods',
            url: 'https://filesamples.com/samples/document/ods/sample1.ods',
        },
        {
            title: 'Presentation',
            extension: '.odp',
            url: 'https://filesamples.com/samples/document/odp/sample1.odp',
        },
    ];

    constructor() {
        const officeViewers: OfficeViewer[] = [
            'microsoft-office',
            'google-drive',
        ];
        this.availableOfficeViewers = officeViewers.map((value) => {
            return {
                text: value as string,
                value: value,
            } as Option<OfficeViewer>;
        });
        this.selectedOfficeViewer = this.availableOfficeViewers.find(
            (v) => v.value === 'microsoft-office'
        );
    }

    public render() {
        return [
            <section>
                <h1>Office files</h1>
                <limel-select
                    class="is-narrow"
                    label="officeViewer"
                    options={this.availableOfficeViewers}
                    value={this.selectedOfficeViewer}
                    onChange={this.handleNewSelection}
                />
            </section>,

            <h2>Microsoft Office formats</h2>,
            this.microsoftDocuments.map(this.renderMicrosoftDocuments),
            <h2>OpenDocument formats</h2>,
            this.openDocuments.map(this.renderOpenDocuments),
        ];
    }

    private renderMicrosoftDocuments = (document: any) => {
        return [
            <h3>
                {document.title}
                <code>{document.extension}</code>
            </h3>,
            <limel-file-viewer
                url={document.url}
                officeViewer={this.selectedOfficeViewer?.value}
            />,
        ];
    };

    private renderOpenDocuments = (document: any) => {
        return [
            <h3>
                {document.title}
                <code>{document.extension}</code>
            </h3>,
            <limel-file-viewer
                url={document.url}
                officeViewer={this.selectedOfficeViewer?.value}
            />,
        ];
    };

    private handleNewSelection = (
        event: LimelSelectCustomEvent<Option<OfficeViewer>>
    ) => {
        this.selectedOfficeViewer = event.detail;
    };
}
