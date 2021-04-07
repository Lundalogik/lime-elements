import { Component, h } from '@stencil/core';
/**
 * Readonly, with line numbers and dark theme
 * Here you see a `readonly` instance of the Code Editor component. This means
 * you cannot edit the code. We also display line numbers here.
 * Additionally, this instance has a `dark` `colorScheme`, which means it does not
 * respect the operating system's settings for preferred appearance (dark or light).
 */
@Component({
    tag: 'limel-example-code-editor-readonly-with-line-numbers',
    shadow: true,
})
export class CodeExample {
    private code: string = `class Animal {
    move(distanceInMeters: number = 0) {
        console.log(\`Animal moved \${distanceInMeters}m.\`);
    }
}

class Dog extends Animal {
    bark() {
        console.log("Woof! Woof!");
    }
}
// Just a comment…
const dog = new Dog();
dog.bark();
dog.move(10);`;

    public render() {
        return (
            <limel-code-editor
                value={this.code}
                language="typescript"
                readonly
                line-numbers
                colorScheme="dark"
            />
        );
    }
}
