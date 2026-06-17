import { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';
import { keymap } from 'prosemirror-keymap';
import { MenuCommandFactory } from './menu/menu-commands';
import { editorMenuTypesArray } from './menu/types';
import { strikethrough } from './menu/menu-schema-extender';
import { linkMarkSpec } from './plugins/link/link-mark';
import { createLinkPlugin } from './plugins/link/link-plugin';
import { createImageInserterPlugin } from './plugins/image/inserter';
import { createImageViewPlugin } from './plugins/image/view';
import { createMenuStateTrackingPlugin } from './plugins/menu-state-tracking-plugin';
import { createActionBarInteractionPlugin } from './plugins/menu-action-interaction-plugin';
import { createTriggerPlugin } from './plugins/trigger/factory';
import { getTableNodes, getTableEditingPlugins } from './plugins/table-plugin';
import { getImageNode } from './plugins/image/node';
import { createNodeSpec } from '../utils/plugin-factory';
import { ContentTypeConverter } from '../utils/content-type-converter';
import { CustomElementDefinition } from '../../../global/shared-types/custom-element.types';
import { Languages } from '../../date-picker/date.types';
import { TriggerCharacter } from '../text-editor.types';

type ContentType = 'markdown' | 'html';

export interface EditorSchemaOptions {
    customElements: CustomElementDefinition[];
    contentType: ContentType;
    language: Languages;
}

/**
 * Builds the ProseMirror schema used by the text editor.
 *
 * This is the single source of truth for the editor's schema: the
 * `limel-prosemirror-adapter` component and any test that needs the real
 * schema both call this, so the two can never drift apart.
 *
 * @param options - schema configuration derived from the editor's props
 * @returns the configured ProseMirror schema
 */
export function buildEditorSchema(options: EditorSchemaOptions): Schema {
    const { customElements, contentType, language } = options;

    let nodes = basicSchema.spec.nodes;

    for (const customElement of customElements) {
        const newNodeSpec = createNodeSpec(customElement);
        const nodeName = customElement.tagName;

        nodes = nodes.append({ [nodeName]: newNodeSpec });
    }
    nodes = addListNodes(nodes, 'paragraph block*', 'block');

    if (contentType === 'html') {
        nodes = nodes.append(getTableNodes());
    }

    nodes = nodes.append(getImageNode(language));

    return new Schema({
        nodes: nodes,
        marks: basicSchema.spec.marks.append({
            strikethrough: strikethrough,
            link: linkMarkSpec,
        }),
    });
}

export interface EditorPluginsOptions {
    schema: Schema;
    menuCommandFactory: MenuCommandFactory;
    contentConverter: ContentTypeConverter;
    language: Languages;
    contentType: ContentType;
    triggerCharacters: TriggerCharacter[];
    onNewLinkSelection: Parameters<typeof createLinkPlugin>[0];
    onImagePasted: Parameters<typeof createImageInserterPlugin>[0];
    onActiveItemsChange: Parameters<typeof createMenuStateTrackingPlugin>[2];
}

/**
 * Builds the ordered list of ProseMirror plugins used by the text editor.
 *
 * Plugin order is significant: ProseMirror resolves event props
 * (`handlePaste`, `handleDOMEvents`, `handleKeyDown`) by calling plugins in
 * this order and stopping at the first that returns a truthy value, and it
 * chains `appendTransaction` in this order. Changing the order changes
 * behavior. Callbacks the plugins need are injected so this can be built
 * outside the component (e.g. in tests).
 *
 * @param options - the schema, command factory, converter and plugin callbacks
 * @returns the ordered plugin list
 */
export function buildEditorPlugins(options: EditorPluginsOptions): Plugin[] {
    const {
        schema,
        menuCommandFactory,
        contentConverter,
        language,
        contentType,
        triggerCharacters,
        onNewLinkSelection,
        onImagePasted,
        onActiveItemsChange,
    } = options;

    return [
        ...exampleSetup({ schema: schema, menuBar: false }),
        keymap(menuCommandFactory.buildKeymap()),
        createTriggerPlugin(triggerCharacters, contentConverter),
        createLinkPlugin(onNewLinkSelection),
        createImageInserterPlugin(onImagePasted),
        createImageViewPlugin(language),
        createMenuStateTrackingPlugin(
            editorMenuTypesArray,
            menuCommandFactory,
            onActiveItemsChange
        ),
        createActionBarInteractionPlugin(menuCommandFactory),
        ...getTableEditingPlugins(contentType === 'html'),
    ];
}
