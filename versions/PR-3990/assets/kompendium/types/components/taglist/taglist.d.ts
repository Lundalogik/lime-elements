import { JsonDocsTag } from '../../stencil-public-runtime';
/**
 * asd
 */
export declare class Taglist {
    /**
     * List of tags to render
     */
    tags: JsonDocsTag[];
    /**
     * Set to `true` if the list should be rendered in compact mode
     */
    compact: boolean;
    render(): HTMLElement[];
    private renderTag;
}
