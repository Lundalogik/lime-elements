import { Component, h } from '@stencil/core';

@Component({
    tag: 'limel-example-dark-light-mode',
    shadow: true,
    styleUrl: 'dark-light-mode.scss',
})
export class DarkLightModeExample {
    public render() {
        return (
            <div class="app-layout">
                <nav class="nav">
                    <a class="nav__logo">
                        <svg
                            viewBox="0 0 227 220"
                            xmlns="http://www.w3.org/2000/svg"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            stroke-linejoin="round"
                            stroke-miterlimit="2"
                        >
                            <path
                                d="M222.7 75.7c-15.2-52.5-58.3-71.1-82.2-74.6C120.4-2 68.2-2.3 34.7 53.3c-26.4 43.8-7.3 79.5-7.1 108.9-.2 13.4-2.2 29.5-20.8 42-18.5 12.4 6 13.4 8.5 13.5 15.1 1 39 3.2 66.4 1.9 23.7-1.1 65-.7 102-31.1 18.5-15.2 54.1-54.2 39-112.8z"
                                fill="rgb(var(--lime-brand-color-flexible-turquoise))"
                            />
                            <path
                                d="M67 118.9c1.9 1.9 4.4 2.9 7.5 2.9 4.8 0 7.9-2.4 9.5-7.2l.1-.4 10.4 2.7-.1.5c-1.1 4.5-3.5 8.2-7.2 10.9-3.7 2.7-8 4.1-12.7 4.1-5.9 0-11-2-15.1-5.9-4.1-3.9-6.2-9-6.2-15.2 0-6.1 2.1-11.3 6.2-15.2 4.1-3.9 9.2-5.9 15.1-5.9 4.7 0 8.9 1.4 12.5 4 3.6 2.7 6.1 6.3 7.5 10.7l.1.5-10.9 3.1-.1-.5c-1.2-4.9-4.2-7.3-9.1-7.3-3.1 0-5.6 1-7.5 3-1.9 2-2.9 4.6-2.9 7.8.1 2.8 1 5.4 2.9 7.4zm41.6 12.1H97.3V91.1h11.3v6.1c3.5-4.4 8-6.6 13.4-6.6 1.3 0 2.2.1 2.9.3l.4.1-.6 10.8H122c-9 0-13.4 5.3-13.4 16.2v13zm30.6 0h-11.3V91.1h11.3v2.6c2.9-2.5 6.6-3.7 11.1-3.7 5.5 0 9.8 2 12.8 6.1 3.5-4 8.2-6.1 14.1-6.1 4.3 0 8 1.5 11 4.5s4.6 7 4.6 11.7V131h-11.2v-22.7c0-2.4-.7-4.3-2-5.8-1.4-1.4-3-2.1-5.1-2.1-2.7 0-4.7.9-6.2 2.8s-2.3 4.8-2.3 8.6V131h-11.3v-22.7c0-2.4-.7-4.3-2-5.8-1.4-1.4-3-2.1-5.1-2.1-2.7 0-4.7.9-6.2 2.8s-2.2 4.8-2.2 8.6V131z"
                                fill="rgb(var(--color-white))"
                            />
                        </svg>
                    </a>
                    <a class="nav_item">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M20.56 18.44l-4.67-4.67a7 7 0 10-2.12 2.12l4.67 4.67a1.5 1.5 0 002.12 0 1.49 1.49 0 000-2.12zM5 10a5 5 0 115 5 5 5 0 01-5-5z"
                                fill="rgb(var(--contrast-1000))"
                            />
                        </svg>
                    </a>
                    <a class="nav_item">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M16.855 20.966c-.224 0-.443-.05-.646-.146a.831.831 0 01-.104-.051l-4.107-2.343-4.107 2.344a1.524 1.524 0 01-1.627-.09 1.505 1.505 0 01-.586-1.509l.957-4.642-1.602-1.457-1.895-1.725a.756.756 0 01-.078-.082 1.503 1.503 0 01-.34-1.492c.173-.524.62-.912 1.16-1.009a.87.87 0 01.102-.018l4.701-.521 1.946-4.31a.692.692 0 01.06-.11 1.5 1.5 0 011.309-.771c.543 0 1.044.298 1.309.77.021.036.041.073.06.112l1.948 4.312 4.701.521a1.508 1.508 0 011.262 1.029 1.504 1.504 0 01-.418 1.572l-3.498 3.184.957 4.632a1.514 1.514 0 01-.59 1.519 1.488 1.488 0 01-.874.281zm-8.149-6.564c-.039.182-.466 2.246-.845 4.082l3.643-2.077a1 1 0 01.99 0l3.643 2.075-.849-4.104a.998.998 0 01.308-.942l3.1-2.822-4.168-.461a1 1 0 01-.801-.584l-1.728-3.821-1.726 3.821c-.146.322-.45.543-.801.584l-4.168.461 3.1 2.822a.995.995 0 01.302.966z"
                                fill="rgb(var(--contrast-1000))"
                            />
                        </svg>
                    </a>
                </nav>
                <div class="workspace">
                    <header class="header">Header</header>
                    <div class="content">
                        <div class="card shadow-card">
                            <div class="card__header">Card</div>
                            <div class="card__body">
                                <p>
                                    Switch between dark mode and light mode on
                                    your{' '}
                                    <a href="https://support.apple.com/en-us/HT208976">
                                        Mac
                                    </a>{' '}
                                    or{' '}
                                    <a href="https://blogs.windows.com/windowsexperience/2016/08/08/windows-10-tip-personalize-your-pc-by-enabling-the-dark-theme/">
                                        Windows
                                    </a>{' '}
                                    to see how colors change in this example.
                                </p>
                                <hr />
                                <button
                                    type="button"
                                    name="success"
                                    class="button success"
                                >
                                    Success
                                </button>
                                <button
                                    type="button"
                                    name="danger"
                                    class="button danger"
                                >
                                    Danger
                                </button>
                                <button
                                    type="button"
                                    name="warning"
                                    class="button warning"
                                >
                                    Warning
                                </button>
                                <button
                                    type="button"
                                    name="continue"
                                    class="button accented"
                                >
                                    Accented
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
