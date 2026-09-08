import { Node } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { NodeView } from 'prosemirror-view';
import { EditorRegion } from '../../../text-editor.types';

/**
 * Frames each declared region so a writer can tell it apart from the body
 * they are typing. The label is chrome drawn by this view, never part of
 * the document, so it is not serialized and never leaves the editor.
 *
 * @param regions - the regions the consumer has declared
 */
export const createRegionViewPlugin = (regions: EditorRegion[]) => {
    const labels = new Map(
        regions
            .filter((region) => region.label)
            .map((region) => [region.name, region.label])
    );

    return new Plugin({
        props: {
            nodeViews: {
                region: (node) => new RegionView(node, labels),
            },
        },
    });
};

class RegionView implements NodeView {
    public dom: HTMLElement;
    public contentDOM: HTMLElement;

    public constructor(node: Node, labels: Map<string, string>) {
        this.dom = document.createElement('div');
        this.dom.className = 'region';
        // A styling hook, so a consumer can tell one region from another
        // without the serialized marker leaking into the view layer.
        this.dom.dataset.region = node.attrs.name;

        const label = labels.get(node.attrs.name);
        if (label) {
            const element = document.createElement('span');
            element.className = 'region__label';
            element.contentEditable = 'false';
            element.textContent = label;
            this.dom.append(element);
        }

        this.contentDOM = document.createElement('div');
        this.contentDOM.className = 'region__content';
        this.dom.append(this.contentDOM);
    }

    /**
     * Mutations outside the content element are this view's own chrome,
     * not document changes, so they must not trigger a re-parse.
     *
     * @param mutation
     */
    public ignoreMutation(mutation: MutationRecord): boolean {
        return !this.contentDOM.contains(mutation.target);
    }
}
