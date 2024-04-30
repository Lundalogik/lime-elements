import { toggleMark, setBlockType, wrapIn } from 'prosemirror-commands';
import { Schema, MarkType } from 'prosemirror-model';
import { wrapInList } from 'prosemirror-schema-list';

export class MenuCommandFactory {
    private schema: Schema;

    constructor(schema: Schema) {
        this.schema = schema;
    }

    private markNames = {
        bold: 'strong',
        italic: 'em',
        underline: 'underline',
        blockquote: 'blockquote',
        headerlevel1: 'headerlevel1',
        headerlevel2: 'headerlevel2',
        headerlevel3: 'headerlevel3',
        addorremovelink: 'link',
        numberedlist: 'ordered_list',
        list: 'bullet_list',
    };

    createCommand(mark: string) {
        if (this.markNames[mark]) {
            mark = this.markNames[mark];
        }

        switch (mark) {
            case 'strong':
            case 'em':
            case 'underline':
                return this.createToggleMarkCommand(mark);
            case 'paragraph':
                return this.createSetNodeTypeCommand(mark);
            case 'headerlevel1':
            case 'headerlevel2':
            case 'headerlevel3':
                return this.createSetNodeTypeCommand(
                    'heading',
                    parseInt(mark[mark.length - 1], 10),
                );
            case 'blockquote':
                return this.createWrapInCommand(mark);
            case 'ordered_list':
            case 'bullet_list':
                return this.createListCommand(mark);
            default:
                throw new Error(`The Mark "${mark}" is not supported`);
        }
    }

    private createToggleMarkCommand(markName: string) {
        const markType: MarkType | undefined = this.schema.marks[markName];
        if (!markType) {
            throw new Error(`Mark "${markName}" not found in schema`);
        }

        return toggleMark(markType);
    }

    private createSetNodeTypeCommand(nodeType: string, level?: number) {
        const type = this.schema.nodes[nodeType];
        if (!type) {
            throw new Error(`Node type "${nodeType}" not found in schema`);
        }

        if (nodeType === 'heading' && level) {
            return setBlockType(type, { level: level });
        } else {
            return setBlockType(type);
        }
    }

    private createWrapInCommand(nodeType: string) {
        const type = this.schema.nodes[nodeType];
        if (!type) {
            throw new Error(`Node type "${nodeType}" not found in schema`);
        }

        return wrapIn(type);
    }

    private createListCommand(listType: string) {
        const type = this.schema.nodes[listType];
        if (!type) {
            throw new Error(`List type "${listType}" not found in schema`);
        }

        return wrapInList(type);
    }
}
