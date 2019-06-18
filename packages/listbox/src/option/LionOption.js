import { html, css } from '@lion/core';
import { LionRadio } from '@lion/radio';

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option
 * Can be a child of datalist/select, or role="listbox"
 *
 * Element gets state supplied externally, reflects this to attributes,
 * enabling Subclassers to style based on those states
 */
export class LionOption extends LionRadio {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          padding: 4px;
        }

        :host([selected]) {
          background: lightblue;
        }

        :host([disabled]) {
          color: lightgray;
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'option');
  }
}
