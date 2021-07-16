import { Component, Element, h} from '@stencil/core';
import { MDCTextField } from '@material/textfield';
import { MDCFloatingLabel } from '@material/floating-label';

/**
 * Input Field of Type Textarea
 */
@Component({
    tag: 'limel-example-input-field-textarea',
    shadow: true,
    styleUrl: 'input-field-textarea.scss',
})
export class InputFieldTextareaExample {
    @Element()
    private host: HTMLLimelExampleInputFieldTextareaElement;

    public componentDidLoad() {
        new MDCTextField(this.host.shadowRoot.querySelector('.mdc-text-field'));
        new MDCFloatingLabel(this.host.shadowRoot.querySelector('.mdc-floating-label'));
    }

    public render() {
        return [
            <label class="mdc-text-field mdc-text-field--textarea">
              <span class="mdc-notched-outline">
                <span class="mdc-notched-outline__leading"></span>
                <span class="mdc-notched-outline__notch">
                  <span class="mdc-floating-label" id="my-label-id">Textarea Label</span>
                </span>
                <span class="mdc-notched-outline__trailing"></span>
              </span>
              <span class="mdc-text-field__resizer">
                <textarea
                    class="mdc-text-field__input"
                    aria-labelledby="my-label-id"
                    rows={8}
                    cols={40}
                    maxlength="140"
                ></textarea>
              </span>
            </label>,
            <div class="mdc-text-field-helper-line">
              <div class="mdc-text-field-character-counter">0 / 140</div>
            </div>
        ];
    }
}
