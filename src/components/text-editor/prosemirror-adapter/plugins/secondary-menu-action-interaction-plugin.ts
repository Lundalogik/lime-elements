import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorPluginTypes, editorPluginTypesArray } from '../menu/types';

export const secondaryActionBarInteractionPluginKey = new PluginKey(
    'secondaryActionBarInteractionPlugin',
);

export const createSecondaryActionBarInteractionPlugin = () => {
    return new Plugin({
        key: secondaryActionBarInteractionPluginKey,
        props: {
            handleDOMEvents: {
                secondaryActionBarItemClick: (_, event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const { value } = event.detail;

                    if (
                        !editorPluginTypesArray.includes(
                            value as EditorPluginTypes,
                        )
                    ) {
                        console.log(
                            'should emit an event to consumer: ',
                            value,
                        );

                        return false;
                    }

                    console.log('we have a plugin: ', value);

                    return true;
                },
            },
        },
    });
};
