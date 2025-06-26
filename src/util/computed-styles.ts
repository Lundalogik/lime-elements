export async function getComputedStyles<T extends readonly string[] = string[]>(
    element: HTMLElement,
    styles: T,
): Promise<Record<T[number], string>> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            const computedStyles: Record<T[number], string> = {} as any;
            const style = getComputedStyle(element);
            styles.forEach((name) => {
                computedStyles[name] = style.getPropertyValue(name).trim();
            });

            resolve(computedStyles);
        });
    });
}
