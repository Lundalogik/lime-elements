import { cdp } from 'vitest/browser';

export interface AccessibleNode {
    name: string;
    description: string;
}

/**
 * Get the nodes with a given role from the accessibility tree of the page that
 * an end-to-end test renders into. This is what assistive technology is
 * given by the browser, so it shows the name and description of a control as
 * a screen reader gets them. Nodes that are hidden from assistive technology
 * are left out.
 *
 * @param role - the role of the nodes to get, for example `textbox`
 */
export async function getAccessibleNodes(
    role: string
): Promise<AccessibleNode[]> {
    const session = cdp();
    await session.send('Accessibility.enable');
    const { frameTree } = await session.send('Page.getFrameTree');
    const childFrame = frameTree.childFrames?.[0];
    if (!childFrame) {
        throw new Error(
            'getAccessibleNodes: no child frame found. Render the component before calling this helper.'
        );
    }

    const frameId = childFrame.frame.id;
    const { nodes } = await session.send('Accessibility.getFullAXTree', {
        frameId,
    });

    return nodes
        .filter((node) => !node.ignored && node.role?.value === role)
        .map((node) => ({
            name: String(node.name?.value ?? ''),
            description: String(node.description?.value ?? ''),
        }));
}

/**
 * Get the names of the nodes with a given role, in the same way as
 * `getAccessibleNodes`. A node without a name gives an empty string.
 *
 * @param role - the role of the nodes to get, for example `textbox`
 */
export async function getAccessibleNames(role: string): Promise<string[]> {
    const nodes = await getAccessibleNodes(role);

    return nodes.map((node) => node.name);
}
