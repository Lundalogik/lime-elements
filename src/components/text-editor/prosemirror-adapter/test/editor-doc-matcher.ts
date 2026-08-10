import { expect } from 'vitest';
import { Node } from 'prosemirror-model';
import { eq } from 'prosemirror-test-builder';

declare module 'vitest' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging requires the same type parameter name as vitest's Matchers<T>
    interface Matchers<T = any> {
        toEqualDoc(expected: Node): void;
    }
}

expect.extend({
    toEqualDoc(received: Node, expected: Node) {
        const pass = eq(received, expected);
        const actualTree = received.toString();
        const expectedTree = expected.toString();

        return {
            pass: pass,
            message: () =>
                pass
                    ? `Expected document not to equal:\n${expectedTree}\nActual:\n${actualTree}`
                    : `Expected document to equal:\n${expectedTree}\nActual:\n${actualTree}`,
        };
    },
});
