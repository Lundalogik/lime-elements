import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-scss.js';
import 'prismjs/components/prism-less.js';
import 'prismjs/components/prism-tsx.js';
import 'prismjs/components/prism-typescript.js';
/**
 * @exampleComponent kompendium-example-code
 */
export declare class Code {
    /**
     * The language of the code
     */
    language: string;
    /**
     * @ignore
     */
    random: number;
    /**
     * Source code
     */
    code: string;
    private host;
    protected componentDidLoad(): void;
    protected componentDidUpdate(): void;
    render(): HTMLElement;
    private renderCode;
    private findCode;
}
