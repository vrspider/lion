import { LionRadioGroup } from '@lion/radio-group';
import { html, css, render } from '@lion/core';
import { LocalOverlayController, overlays } from '@lion/overlays';
// import { managePosition } from '@lion/overlays/src/utils/manage-position.js';

import '../lion-listbox-invoker.js';

/**
 * LionSelectRich: wraps the <lion-listbox> element
 *
 * @customElement
 * @extends LionField
 */
export class LionSelectRich extends LionRadioGroup {
  static get styles() {
    return [
      css`
        .input-group__input {
          display: block;
        }
      `,
    ];
  }

  get slots() {
    return {
      ...super.slots,
      invoker: () => {
        return document.createElement('lion-listbox-invoker');
      },
    };
  }

  constructor() {
    super();
    // this.__syncSelectedStateWithInvoker = this.__syncSelectedStateWithInvoker.bind(this);
    // this.__toggleListboxOverlay = this.__toggleListboxOverlay.bind(this);
    // this.__checkShowListbox = this.__checkShowListbox.bind(this);
    // this.__checkHideListbox = this.__checkHideListbox.bind(this);
    // this._hideListbox = this._hideListbox.bind(this);
  }

  get _listboxElement() {
    return this.querySelector('[slot=input]');
  }

  get _invokerElement() {
    return this.querySelector('[slot=invoker]');
  }

  connectedCallback() {
    super.connectedCallback(); // eslint-disable-line
    // this.__handleA11ySelect();
    this.__createDropdownSelect();
    // this.$$slot('input').addEventListener(
    //   'user-input-changed',
    //   this.__syncSelectedStateWithInvoker,
    // );
  }

  __onFormElementRegister(event) {
    const child = event.detail.element;
    if (child === this) return; // as we fire and listen - don't add ourselves

    child.name = `${this.name}-option[]`;

    super.__onFormElementRegister(event);
  }

  __createDropdownSelect() {
    this._popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: false,
        trapsKeyboardFocus: true,
        hidesOnOutsideClick: false,
        contentNode: this._listboxElement,
        invokerNode: this._invokerElement,
      }),
    );
    this._show = () => this._popup.show();
    this._hide = () => {
      this._popup.hide();
    };

    this._toggle = () => {
      this._popup.toggle();
    };

    this._invokerElement.addEventListener('click', this._toggle);
    this.addEventListener('checked-value-changed', ev => {
      this.invokerNode.innerText = ev.target.checkedValue;
    });

    // // TODO: get rid of fuzzyiness created by fuzzyiness
    // requestAnimationFrame(() =>
    //   requestAnimationFrame(() => {
    //     this._invokerElement.addEventListener('click', this.__toggleListboxOverlay);
    //     this._invokerElement.addEventListener('keyup', this.__checkShowListbox);
    //     this.__listboxBehavior.listboxNode.addEventListener('blur', this._hideListbox);
    //     this.__listboxBehavior.listboxNode.addEventListener('keydown', this.__checkHideListbox);
    //     this.__listboxBehavior.setHandleFocusChange(this.__syncSelectedStateWithInvoker);
    //   }),
    // );
  }

  // __syncSelectedStateWithInvoker() {
  //   const selected = this._listboxElement.querySelector(
  //     `#${this.__listboxBehavior.activeDescendant}`,
  //   );
  //   this._invokerElement.selectedElement = selected;
  // }

  // __toggleListboxOverlay() {
  //   if (this._overlayCtrl.isShown) {
  //     this._overlayCtrl.hide();
  //   } else {
  //     this._showListbox();
  //   }
  // }

  // __handleA11ySelect() {
  //   this.$$slot('invoker').setAttribute('aria-haspopup', 'listbox');
  // }

  /**
   * @override
   */
  // eslint-disable-next-line
  inputGroupInputTemplate() {
    return html`
      <div class="input-group__input">
        <slot name="invoker"></slot>
        <slot name="input"></slot>
      </div>
    `;
  }

  inputGroupTemplate() {
    return html`
      <div class="input-group">
        ${this.inputGroupBeforeTemplate()}
        <div class="input-group__container">
          ${this.inputGroupPrefixTemplate()} ${this.inputGroupInputTemplate()}
          ${this.inputGroupSuffixTemplate()}
        </div>
        ${this.inputGroupAfterTemplate()}
      </div>
    `;
  }

  // __checkShowListbox(evt) {
  //   switch (evt.key) {
  //     case 'ArrowUp':
  //     case 'ArrowDown':
  //       evt.preventDefault();
  //       this._showListbox();
  //       this.__listboxBehavior.checkKeyPress(evt);
  //       break;
  //     default:
  //   }
  // }

  // __checkHideListbox(evt) {
  //   switch (evt.key) {
  //     case 'Enter':
  //     case 'Escape':
  //       evt.preventDefault();
  //       this._hideListbox();
  //       this._invokerElement.focus();
  //       break;
  //     default:
  //   }
  // }

  // async _showListbox() {
  //   // measure invoker height and apply as min-width:
  //   // TODO: decide if we need to apply in OverlayController
  //   this._listboxElement.style.minWidth = window.getComputedStyle(this._invokerElement).width;
  //   // TODO: get rid of this horrible hack
  //   this._listboxElement.style.marginLeft = '-8px';

  //   this._overlayCtrl.show();
  //   await this._listboxElement.updateComplete;
  //   this._invokerElement.setAttribute('aria-expanded', 'true');
  //   this.__listboxBehavior.listboxNode.focus();
  // }

  // _hideListbox() {
  //   this._overlayCtrl.hide();
  //   this._invokerElement.setAttribute('aria-expanded', 'false');
  // }
}
