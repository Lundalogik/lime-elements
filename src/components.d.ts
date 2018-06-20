/**
 * This is an autogenerated file created by the Stencil build process.
 * It contains typing information for all components that exist in this project
 * and imports for stencil collections that might be configured in your stencil.config.js file
 */

import '@stencil/core';

declare global {
  namespace JSX {
    interface Element {}
    export interface IntrinsicElements {}
  }
  namespace JSXElements {}

  interface HTMLElement {
    componentOnReady?: () => Promise<this | null>;
  }

  interface HTMLStencilElement extends HTMLElement {
    componentOnReady(): Promise<this>;

    forceUpdate(): void;
  }

  interface HTMLAttributes {}
}

import {
  Option,
} from './components/select/option';

declare global {

  namespace StencilComponents {
    interface LimelButtonGroup {

    }
  }

  interface HTMLLimelButtonGroupElement extends StencilComponents.LimelButtonGroup, HTMLStencilElement {}

  var HTMLLimelButtonGroupElement: {
    prototype: HTMLLimelButtonGroupElement;
    new (): HTMLLimelButtonGroupElement;
  };
  interface HTMLElementTagNameMap {
    'limel-button-group': HTMLLimelButtonGroupElement;
  }
  interface ElementTagNameMap {
    'limel-button-group': HTMLLimelButtonGroupElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'limel-button-group': JSXElements.LimelButtonGroupAttributes;
    }
  }
  namespace JSXElements {
    export interface LimelButtonGroupAttributes extends HTMLAttributes {

    }
  }
}


declare global {

  namespace StencilComponents {
    interface LimelButton {
      'disabled': boolean;
      'label': string;
      'loading': boolean;
      'primary': boolean;
    }
  }

  interface HTMLLimelButtonElement extends StencilComponents.LimelButton, HTMLStencilElement {}

  var HTMLLimelButtonElement: {
    prototype: HTMLLimelButtonElement;
    new (): HTMLLimelButtonElement;
  };
  interface HTMLElementTagNameMap {
    'limel-button': HTMLLimelButtonElement;
  }
  interface ElementTagNameMap {
    'limel-button': HTMLLimelButtonElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'limel-button': JSXElements.LimelButtonAttributes;
    }
  }
  namespace JSXElements {
    export interface LimelButtonAttributes extends HTMLAttributes {
      'disabled'?: boolean;
      'label'?: string;
      'loading'?: boolean;
      'onLimelButtonClicked'?: (event: CustomEvent) => void;
      'primary'?: boolean;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface LimelSelect {
      'disabled': boolean;
      'label': string;
      'options': Array<Option>;
      'value': string;
    }
  }

  interface HTMLLimelSelectElement extends StencilComponents.LimelSelect, HTMLStencilElement {}

  var HTMLLimelSelectElement: {
    prototype: HTMLLimelSelectElement;
    new (): HTMLLimelSelectElement;
  };
  interface HTMLElementTagNameMap {
    'limel-select': HTMLLimelSelectElement;
  }
  interface ElementTagNameMap {
    'limel-select': HTMLLimelSelectElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'limel-select': JSXElements.LimelSelectAttributes;
    }
  }
  namespace JSXElements {
    export interface LimelSelectAttributes extends HTMLAttributes {
      'disabled'?: boolean;
      'label'?: string;
      'onChange'?: (event: CustomEvent) => void;
      'options'?: Array<Option>;
      'value'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface LimelSpinner {

    }
  }

  interface HTMLLimelSpinnerElement extends StencilComponents.LimelSpinner, HTMLStencilElement {}

  var HTMLLimelSpinnerElement: {
    prototype: HTMLLimelSpinnerElement;
    new (): HTMLLimelSpinnerElement;
  };
  interface HTMLElementTagNameMap {
    'limel-spinner': HTMLLimelSpinnerElement;
  }
  interface ElementTagNameMap {
    'limel-spinner': HTMLLimelSpinnerElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'limel-spinner': JSXElements.LimelSpinnerAttributes;
    }
  }
  namespace JSXElements {
    export interface LimelSpinnerAttributes extends HTMLAttributes {

    }
  }
}


declare global {

  namespace StencilComponents {
    interface LimelSwitch {
      'disabled': boolean;
      'label': string;
      'value': boolean;
    }
  }

  interface HTMLLimelSwitchElement extends StencilComponents.LimelSwitch, HTMLStencilElement {}

  var HTMLLimelSwitchElement: {
    prototype: HTMLLimelSwitchElement;
    new (): HTMLLimelSwitchElement;
  };
  interface HTMLElementTagNameMap {
    'limel-switch': HTMLLimelSwitchElement;
  }
  interface ElementTagNameMap {
    'limel-switch': HTMLLimelSwitchElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'limel-switch': JSXElements.LimelSwitchAttributes;
    }
  }
  namespace JSXElements {
    export interface LimelSwitchAttributes extends HTMLAttributes {
      'disabled'?: boolean;
      'label'?: string;
      'onChange'?: (event: CustomEvent) => void;
      'value'?: boolean;
    }
  }
}

declare global { namespace JSX { interface StencilJSX {} } }

export declare function defineCustomElements(window: any): void;