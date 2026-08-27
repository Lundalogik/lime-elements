import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-scss.js';
import 'prismjs/components/prism-less.js';
import 'prismjs/components/prism-tsx.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/plugins/toolbar/prism-toolbar.js';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js';
/**
 * @exampleComponent kompendium-example-code
 */
export declare class Code {
    /**
     * The language of the code
     */
    language: string;
    /**
     * Source code
     */
    code: string;
    private host;
    componentDidLoad(): void;
    componentWillRender(): void;
    componentDidRender(): void;
    render(): HTMLElement;
    private findCode;
}
