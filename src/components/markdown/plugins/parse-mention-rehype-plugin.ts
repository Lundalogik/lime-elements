import { visit } from 'unist-util-visit';
import he from 'he';

export const remarkEncodeMention = () => {
    return (tree) => {
        visit(tree, 'text', (node, index, parent) => {
            if (typeof node.value === 'string') {
                const mentionRegex = /@([^:]+):(\w+):(\w+)/g;
                const newNodes = [];
                let lastIndex = 0;

                node.value.replace(
                    mentionRegex,
                    (match, name, type, id, offset) => {
                        // Push text before the mention
                        newNodes.push({
                            type: 'text',
                            value: node.value.slice(lastIndex, offset),
                        });

                        const encodedName = he.encode(name, {
                            useNamedReferences: true,
                        });
                        const encodedType = he.encode(type, {
                            useNamedReferences: true,
                        });
                        const encodedId = he.encode(id, {
                            useNamedReferences: true,
                        });

                        const mention = {
                            type: 'html',
                            value: `<span class="mention" style="color: red; border: solid 1px black; border-radius: 0.4rem;" data-mention-name="${encodedName}" data-mention-type="${encodedType}" data-mention-id="${encodedId}">@${name}</span>`,
                        };

                        newNodes.push(mention);

                        lastIndex = offset + match.length;
                    },
                );

                // Push remaining text
                if (lastIndex < node.value.length) {
                    newNodes.push({
                        type: 'text',
                        value: node.value.slice(lastIndex),
                    });
                }

                if (newNodes.length > 1) {
                    parent.children.splice(index, 1, ...newNodes);
                }
            }
        });
    };
};
