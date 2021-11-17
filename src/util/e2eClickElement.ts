import { E2EElement, E2EPage } from '@stencil/core/testing';

/* eslint-disable no-underscore-dangle */
export async function clickElement(page: E2EPage, elements: E2EElement[]) {
    const outerElement = elements.pop();
    const selectors: string[] = elements.map((element) => {
        return (element as any)._elmHandle._remoteObject.description;
    });

    const boundingRect = await page.$eval(
        (outerElement as any)._elmHandle._remoteObject.description,
        (inPageElement: HTMLElement, inPageSelectors: string[]) => {
            let childElement = inPageElement;
            while (inPageSelectors.length) {
                const nextSelector = inPageSelectors.pop();
                childElement =
                    inPageElement.querySelector(nextSelector) ||
                    inPageElement.shadowRoot?.querySelector(nextSelector);
            }

            const { x, y } = childElement.getBoundingClientRect();

            return { x: x, y: y };
        },
        selectors
    );

    const offsetFromElementEdge = 5;
    await page.mouse.click(
        boundingRect.x + offsetFromElementEdge,
        boundingRect.y + offsetFromElementEdge
    );
}
