# Lime Elements

In the ever-evolving landscape of web-applications, streamlining the creation of user interfaces (UIs) has become paramount. This is where web-component libraries and design systems come into play, offering a powerful combination to accelerate development, enhance consistency, and foster collaboration among developers.

Web-component libraries and design systems are crucial in the rapidly evolving web-applications landscape, accelerating development, enhancing consistency, and promoting collaboration.

Sponsored by [Lime Technologies](https://www.lime-technologies.com/), Lime Elements is an open-source component library and a design system. It provides a high-quality set of well-designed, well-documented UI components, crafted in Stencil for enterprise-level products.

Our top developers and designers continuously improve Lime Elements, fixing bugs and adding new features. It serves as Lime Technologies' central repository for UI guidelines, standards, and components, ensuring a consistent brand experience across all our applications. Lime Elements standardizes colors, typography, layouts, and interactions for a cohesive, accessible user experience.

We invite you to leverage our web-component library and design system. It can streamline development, enhance consistency, ease collaboration, and deliver exceptional user experiences. Lime Elements can be instrumental in creating modern, scalable, and accessible web applications that resonate with users worldwide.

For a full list of components, along with live examples, please visit the [documentation](https://lundalogik.github.io/lime-elements/).

[![Version](https://img.shields.io/npm/v/@limetech/lime-elements.svg)](https://www.npmjs.com/package/@limetech/lime-elements) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Getting started

-   To install, run `npm install @limetech/lime-elements`.

## Requirements

### 1. Font

The "Roboto" font is included for development purposes, but is not included in the published package. This font should be supplied by the consuming application. If not supplied, texts will fall back to suitable alternatives.

### 2. Icons

At Lime, we utilize the [_Windows 10_ icon set from **Icons8**](https://icons8.com/icons/windows). You may notice these icons in our components, such as the magnifying glass icon displayed as a leading icon on an input field.

If you're using Lime Elements in a non-Lime product, you'll need to provide your own icons. We're unable to redistribute Icons8's assets with our package due to licensing restrictions.

Providing your own icons is crucial as many of our components use an `Icon` interface. This interface allows you to specify an icon name, which corresponds to the filename of an SVG icon. For example, you can use this to display an icon on a button.

#### How to Setup your icons folder:

-   **For _Lime_ products:**

    To use `@lundalogik/lime-icons8`, the `/assets` folder from `@lundalogik/lime-icons8` must be made available on the web-server.

-   **For _non-Lime_ products:**

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

## Get help

-   If you have a general question, or are in need of support, please open a [Question issue](https://github.com/Lundalogik/lime-elements/issues/new?template=03_question.md) on GitHub.

# Contributing

-   To build and run the documentation locally on your machine, run `npm start`.
-   To see what other scripts are available, run `npm run`.
-   Please read our [guidelines for contributers](https://github.com/Lundalogik/lime-elements/CONTRIBUTING.md)
