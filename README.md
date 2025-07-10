# Lime Elements

In the ever-evolving landscape of web-applications, streamlining the creation of user interfaces (UIs) has become paramount. This is where web-component libraries and design systems come into play, offering a powerful combination to accelerate development, enhance consistency, and foster collaboration among developers.

Web-component libraries and design systems are crucial in the rapidly evolving web-applications landscape, accelerating development, enhancing consistency, and promoting collaboration.

Sponsored by [Lime Technologies](https://www.lime-technologies.com/), Lime Elements is an open-source component library and a design system. It provides a high-quality set of well-designed, well-documented UI components, crafted in Stencil for enterprise-level products.

Our top developers and designers continuously improve Lime Elements, fixing bugs and adding new features. It serves as Lime Technologies' central repository for UI guidelines, standards, and components, ensuring a consistent brand experience across all our applications. Lime Elements standardizes colors, typography, layouts, and interactions for a cohesive, accessible user experience.

We invite you to leverage our web-component library and design system. It can streamline development, enhance consistency, ease collaboration, and deliver exceptional user experiences. Lime Elements can be instrumental in creating modern, scalable, and accessible web applications that resonate with users worldwide.

For a full list of components, along with live examples, please visit the [documentation](https://lundalogik.github.io/lime-elements/).

### Project Status

[![Version](https://img.shields.io/npm/v/@limetech/lime-elements.svg)](https://www.npmjs.com/package/@limetech/lime-elements) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![npm downloads](https://img.shields.io/npm/dt/@limetech/lime-elements.svg)](https://www.npmjs.com/package/@limetech/lime-elements)

### Quality & Reliability

[![Build Status](https://github.com/Lundalogik/lime-elements/workflows/Release/badge.svg)](https://github.com/Lundalogik/lime-elements/actions) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Lundalogik_lime-elements&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Lundalogik_lime-elements) [![Bundle Size](https://packagephobia.com/badge?p=@limetech/lime-elements)](https://packagephobia.com/result?p=@limetech/lime-elements) [![Known Vulnerabilities](https://snyk.io/test/github/Lundalogik/lime-elements/badge.svg)](https://snyk.io/test/github/Lundalogik/lime-elements) [![Dependencies](https://img.shields.io/librariesio/github/Lundalogik/lime-elements)](https://libraries.io/github/Lundalogik/lime-elements)

### Technology & Standards

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/) [![Stencil](https://img.shields.io/badge/Built%20with-Stencil-16161d.svg?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuNzkgMC45NGMtLjQ2LS4zLTEuMDgtLjMtMS41NSAwTDEuNDIgNC4xOUMuOSA0LjUyLjkgNS4yOCAxLjQyIDUuNkw3IDEwIDguNjMgOC43OSAxMy42MyA1LjZjLjUyLS4zMy41Mi0xLjA5IDAtMS40MUw3LjggMC45NHoiIGZpbGw9IiNmZmYiLz4KPC9zdmc+)](https://stenciljs.com/) [![Web Components](https://img.shields.io/badge/Web%20Components-Ready-29ABE2.svg)](https://www.webcomponents.org/) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

### Community & Activity

[![GitHub stars](https://img.shields.io/github/stars/Lundalogik/lime-elements?style=social)](https://github.com/Lundalogik/lime-elements) [![GitHub issues](https://img.shields.io/github/issues/Lundalogik/lime-elements)](https://github.com/Lundalogik/lime-elements/issues) [![GitHub pull requests](https://img.shields.io/github/issues-pr/Lundalogik/lime-elements)](https://github.com/Lundalogik/lime-elements/pulls) [![Commits](https://img.shields.io/github/commit-activity/m/Lundalogik/lime-elements)](https://github.com/Lundalogik/lime-elements/graphs/commit-activity)

---

## Getting Started

- To install, run `npm install @limetech/lime-elements`.

### Requirements

#### 1. Font

To achieve a blazing fast rendering, our components' user interface utilizes a default cross-browser sans-serif font stack. As web components typically inherit font-related styles such as `font-family`, `font-size`, and `color`, we recommend defining these styles at a higher level, such as the `<body>` element. This is because we do not specify these defaults on each individual component.

To maintain consistency with the look & feel demonstrated in this documentation, we suggest incorporating the following styles into your project:

```css
font-family: ui-sans-serif, system-ui, sans-serif;
font-size: 0.875rem;
font-style: normal;
font-weight: 400;
color: rgb(var(--contrast-1500));
```

💡 About the `color` specified above, read more on [our color system](/#/DesignGuidelines/color-system.md/).

Feel free to customize the font-family and related styles to suit your project's needs. For example, you might prefer a different typeface like below:

```css
font-family: 'Roboto', Arial, Verdana, sans-serif;
```

#### 2. Icons

At Lime, we utilize the [_Windows 10_ icon set from **Icons8**](https://icons8.com/icons/windows). You may notice these icons in our components, such as the magnifying glass icon displayed as a leading icon on an input field.

If you're using Lime Elements in a non-Lime product, you'll need to provide your own icons. We're unable to redistribute Icons8's assets with our package due to licensing restrictions.

Providing your own icons is crucial as many of our components use an `Icon` interface. This interface allows you to specify an icon name, which corresponds to the filename of an SVG icon. For example, you can use this to display an icon on a button.

##### How to Set Up Your Icons Folder

- **For _Lime_ products:**

    To use `@lundalogik/lime-icons8`, the `/assets` folder from `@lundalogik/lime-icons8` must be made available on the web-server.

- **For _non-Lime_ products:**

    To use a different icon set, the icons must be placed in a folder structure that looks like this: `assets/icons/<name-of-icon>.svg`

    If `assets` is placed in the root, no other setup is needed. The icons will be fetched with a relative URL from `/assets/icons/<name-of-icon>.svg`.

    If `assets` is placed in a sub-folder somewhere, the easiest way to make the icons available is to use the HTML `base` element:

    ```html
    <base href="/my/parent/path/" />
    ```

    If this is not enough, or if the `base` element is already in use for something else, a global icon path can be configured with the `limel-config` element:

    ```ts
    <limel-config config={{iconPath: '/my/parent/path/'}} />
    ```

---

## Using @beta components

Components marked as `@beta` are not yet stable. Here's what you need to know:

1. **Breaking changes:** We may change `@beta` components in ways that break your code. We won't increase the major version number when we do this.
1. **Unstable:** `@beta` components may have more bugs than other components. Use them at your own risk.
1. **Feedback wanted:** We offer `@beta` components to get your input. Your feedback helps us improve them.

Remember: All components can change, but `@beta` components change more often and without warning.

---

## Getting help

- If you have a general question, or are in need of support, please open a [Question issue](https://github.com/Lundalogik/lime-elements/issues/new?template=03_question.md) on GitHub.

---

## Contributing

- To build and run the documentation locally on your machine, run `npm start`.
- To see what other scripts are available, run `npm run`.
- Please read our [guidelines for contributers](https://github.com/Lundalogik/lime-elements/CONTRIBUTING.md)
