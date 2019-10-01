/* eslint-disable */

import { css } from '@lion/core';
import {
  overlays,
  DynamicOverlayController,
  ModalDialogController,
  BottomSheetController,
  LocalOverlayController,
} from '@lion/overlays';
import {
  ProxyController,
} from './ProxyController.js';
// import {
//   OverlayController,
// } from '@lion/overlays/src/OverlayController.js';

import { LionSelectRich } from '@lion/select-rich/index.js';
// import { IngFieldMixin } from '../field-mixin/IngFieldMixin.js';
import './ing-select-account-invoker.js';

// class ProxyCtrl extends EventTarget {
//   constructor(controllers) {
//     super();
//     this.delegate(controllers);
//     this.active = controllers[0];
//   }

//   delegate(controllers) {
//     // Methods
//     ['show', 'hide', 'toggle', 'sync', 'syncInvoker'].forEach(method => {
//       this[method] = (...args) => this.active[method](...args);
//     });

//     // Props
//     ['isShown', 'contentNode', 'content'].forEach(prop => {
//       Object.defineProperty(this, prop, {
//         get() {
//           return this.active[prop];
//         },
//       });
//     });

//     // Events
//     controllers.forEach(ctrl => {
//       if (ctrl && !ctrl.__listenersDelegated) {
//         ['show', 'hide', 'before-show', 'before-hide'].forEach(event => {
//           ctrl.addEventListener(event, this.__delegateEvent.bind(this));
//         });
//         ctrl.__listenersDelegated = true; // eslint-disable-line no-param-reassign
//       }
//     });
//   }

//   __delegateEvent(ev) {
//     ev.stopPropagation();
//     this.dispatchEvent(new Event(ev.type));
//   }
// }


const withBottomSheetConfig = () => ({
  hasBackdrop: true,
  preventsScroll: true,
  trapsKeyboardFocus: true,
  hidesOnEsc: true,
  viewportConfig: {
    placement: 'bottom',
  },
});

const withModalDialogConfig = () => ({
  isGlobal: true,
  isModal: true,
  hasBackdrop: true,
  preventsScroll: true,
  trapsKeyboardFocus: true,
  hidesOnEsc: true,
  viewportConfig: {
    placement: 'center',
  },
});

/**
 * # <ing-select-account> web component
 *
 * @customElement ing-select-account
 * @extends LionSelectRich
 */
export class IngSelectAccount extends LionSelectRich {
  static get styles() {
    return [
      super.styles,
      css`
        ::slotted([slot="invoker"]) {
          width: 100%;
        }

        .input-group__container > .input-group__input ::slotted(.form-control) {
          height: auto;
          padding: 0;
        }
      `,
    ];
  }

  /**
   * @desc returns an instance of a (dynamic) overlay controller
   * @returns {OverlayController}
   */
  // eslint-disable-next-line class-methods-use-this
  _defineOverlay({ contentNode, invokerNode }) {
    const ctrl = new ProxyController({
      invokerNode,
      contentNode,
      elementToFocusAfterHide: invokerNode,
    });

    ctrl.addEventListener('before-show', () => {
      console.log('before show');
      if (window.innerWidth >= 600) {
        console.log('zet modal');
        ctrl.setConfig(withModalDialogConfig());
      } else {
        console.log('zet bottom sheet');
        ctrl.setConfig(withBottomSheetConfig());
      }
    });

    return ctrl;
  }



  // This gets called from the connectedCallback of the Rich Select
  // eslint-disable-next-line class-methods-use-this
  // _defineOverlay({ invokerNode, contentNode } = {}) {
  //   const modalCtrl = overlays.add(
  //     new ModalDialogController({
  //       contentNode,
  //       invokerNode,
  //     }),
  //   );

  //   const bottomCtrl = overlays.add(
  //     new BottomSheetController({
  //       contentNode,
  //       invokerNode,
  //     }),
  //   );

  //   // Manually connect content to DOM (global overlays root node)
  //   // this._dynamicCtrl.active._connectContent();
  //   // this.registrationTarget = document.querySelector('lion-account-options');

  //   function setActiveCtrl() {
  //     proxyCtrl.active = window.innerWidth >= 600 ? bottomCtrl : modalCtrl;
  //   }

  //   const proxyCtrl = new ProxyController([bottomCtrl, modalCtrl]);
  //   proxyCtrl.addEventListener('before-open', setActiveCtrl);
  //   setActiveCtrl();

  //   return proxyCtrl;
  //   // return bottomCtrl;
  // }

  // _defineOverlay({ invokerNode, contentNode }) { // eslint-disable-line
  //   const bottomSheetConfig = {
  //     hasBackdrop: true,
  //     preventsScroll: true,
  //     trapsKeyboardFocus: true,
  //     hidesOnEsc: true,
  //     viewportConfig: {
  //       placement: 'bottom',
  //     },
  //   }

  //   const ctrl = new OverlayController({
  //     ...bottomSheetConfig,
  //     hidesOnOutsideClick: true,
  //     invokerNode,
  //     contentNode,
  //   });

  //   return ctrl;
  // }

  get slots() {
    return {
      ...super.slots,
      invoker: () => document.createElement('ing-select-account-invoker'),
    };
  }

  get _listboxNode() {
    // TODO: do in lion
    if (!this.__cachedListboxNode) {
      this.__cachedListboxNode = this.__overlay && this.__overlay.contentNode || this.querySelector('[slot=input]');
    }
    return this.__cachedListboxNode;
  }

  connectedCallback() {
    // this._listboxNode.registrationTarget = this;

    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this._listboxNode._initRegistrarPortal({ registrationTarget: this });

    setTimeout(() => {
      console.log('this.formElements', this.formElements);
    });

    // console.log(this._invokerNode);
    this._invokerNode.selectedElement = this.formElements[this.checkedIndex];

  }
}
