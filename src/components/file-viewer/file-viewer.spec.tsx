import { newSpecPage } from '@stencil/core/testing';
import { FileViewer } from './file-viewer';

describe('limel-file-viewer', () => {
    const testCases = [
        { url: 'example.jpg', type: 'image' },
        { url: 'example.mp4', type: 'video' },
        { url: 'example.mp3', type: 'audio' },
        { url: 'example.txt', type: 'text' },
        { url: 'example.xyz', type: 'unknown' },
    ];

    testCases.forEach((testCase) => {
        it(`renders a ${testCase.type} viewer`, async () => {
            const page = await newSpecPage({
                components: [FileViewer],
                html: `<limel-file-viewer url="${testCase.url}"></limel-file-viewer>`,
            });

            expect(page.root).toBeDefined();
        });
    });
});

describe('limel-file-viewer officeViewer', () => {
    const testCases = [
        { url: 'example.docx', officeViewer: 'microsoft-office' },
        { url: 'example.docx', officeViewer: 'google-drive' },
        { url: 'example.odp', officeViewer: 'microsoft-office' },
    ];

    testCases.forEach((testCase) => {
        it(`renders using ${testCase.officeViewer} officeViewer`, async () => {
            const page = await newSpecPage({
                components: [FileViewer],
                html: `<limel-file-viewer url="${testCase.url}" officeViewer="${testCase.officeViewer}"></limel-file-viewer>`,
            });

            expect(page.root).toBeDefined();
        });
    });
});
