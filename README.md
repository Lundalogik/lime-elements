# <img src="https://raw.githubusercontent.com/Lundalogik/lime-elements/main/icon.png" alt="Lime Elements Logo" style="width: 2.5rem; vertical-align: middle;"> Lime Elements

**Modern Web Components for Enterprise Applications**

_A comprehensive design system and component library built with Stencil_

---

## Why Lime Elements?

- 🚀 **Enterprise-Ready** - Battle-tested components used in production applications
- 🎨 **Design System** - Consistent UX/UI design with comprehensive usage guidelines
- ⚡ **Web Standards** - Built with Stencil, works with any framework
- 👾 **TypeScript** - Full type safety and excellent developer experience
- ♿ **Accessible** - Built with accessibility in mind
- ⚙️ **Customizable** - Extensive styling options

---

Sponsored by <img src="https://www.lime-technologies.com/wp-content/uploads/2024/04/cropped-favicon-lime-192x192.png" alt="Lime Technologies Logo" style="width: 1rem; vertical-align: middle;"> [Lime Technologies](https://www.lime-technologies.com/), Lime Elements is a production-ready component library and design system built with Stencil. Our enterprise-grade components help you create consistent, scalable, and accessible web applications faster.

Whether you're building from scratch or enhancing existing applications, Lime Elements provides the building blocks for exceptional user experiences that work across all modern frameworks.

Visit our [📚 **Documentation**](https://lundalogik.github.io/lime-elements/) for comprehensive guides and examples, or install directly from [📦 **NPM**](https://www.npmjs.com/package/@limetech/lime-elements).

### Project Status

[![Version](https://img.shields.io/npm/v/@limetech/lime-elements.svg)](https://www.npmjs.com/package/@limetech/lime-elements) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![npm downloads](https://img.shields.io/npm/dt/@limetech/lime-elements.svg)](https://www.npmjs.com/package/@limetech/lime-elements)

### Quality & Reliability

[![Build Status](https://github.com/Lundalogik/lime-elements/workflows/Release/badge.svg)](https://github.com/Lundalogik/lime-elements/actions) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Lundalogik_lime-elements&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Lundalogik_lime-elements) [![Bundle Size](https://packagephobia.com/badge?p=@limetech/lime-elements)](https://packagephobia.com/result?p=@limetech/lime-elements) [![Known Vulnerabilities](https://snyk.io/test/github/Lundalogik/lime-elements/badge.svg)](https://snyk.io/test/github/Lundalogik/lime-elements) [![Dependencies](https://img.shields.io/librariesio/github/Lundalogik/lime-elements)](https://libraries.io/github/Lundalogik/lime-elements)

### Technology & Standards

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/) [![Stencil](https://img.shields.io/badge/Built%20with-Stencil-16161d.svg?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuNzkgMC45NGMtLjQ2LS4zLTEuMDgtLjMtMS41NSAwTDEuNDIgNC4xOUMuOSA0LjUyLjkgNS4yOCAxLjQyIDUuNkw3IDEwIDguNjMgOC43OSAxMy42MyA1LjZjLjUyLS4zMy41Mi0xLjA5IDAtMS40MUw3LjggMC45NHoiIGZpbGw9IiNmZmYiLz4KPC9zdmc+)](https://stenciljs.com/) [![Web Components](https://img.shields.io/badge/Web%20Components-Ready-29ABE2.svg)](https://www.webcomponents.org/) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

### Community & Activity

[![GitHub stars](https://img.shields.io/github/stars/Lundalogik/lime-elements?style=social)](https://github.com/Lundalogik/lime-elements) [![GitHub issues](https://img.shields.io/github/issues/Lundalogik/lime-elements)](https://github.com/Lundalogik/lime-elements/issues) [![GitHub pull requests](https://img.shields.io/github/issues-pr/Lundalogik/lime-elements)](https://github.com/Lundalogik/lime-elements/pulls) [![Commits](https://img.shields.io/github/commit-activity/m/Lundalogik/lime-elements)](https://github.com/Lundalogik/lime-elements/graphs/commit-activity)

---

## Quick Start

```html
<!-- Load the package -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@limetech/lime-elements@latest/dist/lime-elements/lime-elements.esm.js"></script>

<!-- Use components in your HTML -->
<limel-input-field
    label="Name"
    placeholder="Enter your full name"
></limel-input-field>
<limel-button primary label="Submit"></limel-button>
```

**[Try it live in our playground](https://lundalogik.github.io/lime-elements/versions/latest/#/)**

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

At Lime, we utilize the [_Windows 11 Outline_ icon set from **Icons8**](https://icons8.com/icons/fluency-systems-regular). You may notice these icons in our components, such as the magnifying glass icon displayed as a leading icon on an input field.

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

## Using @beta Components

Components marked as `@beta` are not yet stable. Here's what you need to know:

1. **Breaking changes:** We may change `@beta` components in ways that break your code. We won't increase the major version number when we do this.
1. **Unstable:** `@beta` components may have more bugs than other components. Use them at your own risk.
1. **Feedback wanted:** We offer `@beta` components to get your input. Your feedback helps us improve them.

Remember: All components can change, but `@beta` components change more often and without warning.

---

## Community & Support

- 💬 **Questions?** [create an issue](https://github.com/Lundalogik/lime-elements/issues/new?template=03_question.md)
- 🐛 **Found a bug?** [Report it here](https://github.com/Lundalogik/lime-elements/issues/new?template=01_bug_report.md)
- 💡 **Feature request?** [Share your ideas](https://github.com/Lundalogik/lime-elements/issues/new?template=02_feature_request.md)
- 🆕 **What's new?** Check our [changelog](https://github.com/Lundalogik/lime-elements/blob/main/CHANGELOG.md) for the latest updates

---

## Contributing

We welcome contributions from the community! Here's how you can help:

- 🔍 **Found an issue?** Feel free to fix it and submit a PR
- 📝 **Improve docs?** Documentation improvements are always appreciated
- 🎨 **Design feedback?** Share your UX insights
- 🧪 **Testing?** Help us test new features and report bugs

**Quick Set Up**

```bash
git clone https://github.com/Lundalogik/lime-elements.git
cd lime-elements
npm install
npm start  # Starts local development server
```

📋 **[Read our full contributing guidelines](https://github.com/Lundalogik/lime-elements/blob/main/CONTRIBUTING.md)**

---

## 📄 License

Lime Elements is open source software licensed under the [Apache 2.0 License](https://opensource.org/licenses/Apache-2.0).

---

<div align="center">

**Built with ❤️ by your friends at [Lime Technologies](https://www.lime-technologies.com/)**

_Empowering developers to create amazing user experiences_

[⭐ Star us on GitHub](https://github.com/Lundalogik/lime-elements) • [📚 Documentation](https://lundalogik.github.io/lime-elements/) • [📦 NPM](https://www.npmjs.com/package/@limetech/lime-elements)

</div>
