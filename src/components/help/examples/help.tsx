import { Component, h } from '@stencil/core';
const markdown = `
#### Why providing contextual help is important

1. **It promotes user engagement.**
    When users encounter assistance at strategic points within the interface,
    frustration diminishes, and satisfaction grows.
    This positive experience contributes to increased user retention,
    as individuals are more likely to continue using
    an app that aligns with their needs and supports them on their journey.
2. **It help serves as a means of communication between the app and its users.**
    It enables developers to provide users with information about
    the app’s functionality, or about the actions that the user is expected to do,
    to complete a task or move to the next step in a process.
`;

/**
 * Basic example
 * This component accepts a string as a value and displays it in a popover.
 * This string can be in markdown format, enabling you to add links, lists, etc;
 * providing a richer experience for the user.
 */
@Component({
    tag: 'limel-example-help',
    shadow: true,
})
export class HelpExample {
    public render() {
        return <limel-help value={markdown} />;
    }
}
