import { Searcher } from 'src/components/picker/searcher.types';
import { EditorPlugin } from '../editor-plugin';

export class LimeObjectSelectorPlugin extends EditorPlugin<LimeObjectSelectorPluginProps> {
    constructor(props: LimeObjectSelectorPluginProps) {
        super(props, 'limeobjectSelector');
    }
}

export interface LimeObjectSelectorPluginProps {
    trigger: LimeObjectSelectorPluginTrigger;
    onChange: (value: string) => void;
    searcher: (trigger: LimeObjectSelectorPluginTrigger) => Searcher;
}

export interface LimeObjectSelectorPluginState {
    query: string;
}

export type LimeObjectSelectorPluginTrigger = '!' | '@';
