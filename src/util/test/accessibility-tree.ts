import { cdp } from 'vitest/browser';

export interface AccessibleNode {
    name: string;
    description: string;
}

export interface AccessibleProperties {
    required: boolean;
    disabled: boolean;
    invalid: boolean;
    hasPopup: boolean;
}

async function getNodesWithRole(role: string) {
    const session = cdp();
    await session.send('Accessibility.enable');
    const { frameTree } = await session.send('Page.getFrameTree');
    const childFrame = frameTree.childFrames?.[0];
    if (!childFrame) {
        throw new Error(
            'No child frame found. Render the component before reading the accessibility tree.'
        );
    }

    const frameId = childFrame.frame.id;
    const { nodes } = await session.send('Accessibility.getFullAXTree', {
        frameId,
    });

    return nodes.filter((node) => !node.ignored && node.role?.value === role);
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
    const nodes = await getNodesWithRole(role);

    return nodes.map((node) => ({
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

/**
 * Get the properties of the nodes with a given role that a screen reader
 * announces, in the same way as `getAccessibleNodes`. A property that a node
 * does not have is `false`.
 *
 * @param role - the role of the nodes to get, for example `textbox`
 */
export async function getAccessibleProperties(
    role: string
): Promise<AccessibleProperties[]> {
    const nodes = await getNodesWithRole(role);

    return nodes.map((node) => {
        const values = new Map(
            (node.properties ?? []).map((property) => [
                property.name,
                property.value?.value,
            ])
        );

        return {
            required: values.get('required') === true,
            disabled: values.get('disabled') === true,
            invalid: values.has('invalid') && values.get('invalid') !== 'false',
            hasPopup: values.has('hasPopup'),
        };
    });
}

/**
 * Get whether the nodes with a given role are announced as invalid, in the
 * same way as `getAccessibleNodes`.
 *
 * @param role - the role of the nodes to get, for example `textbox`
 */
export async function getInvalidStates(role: string): Promise<boolean[]> {
    const properties = await getAccessibleProperties(role);

    return properties.map((node) => node.invalid);
}
