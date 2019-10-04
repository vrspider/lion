import { render, dedupeMixin } from '@lion/core';
// import { render as renderShady } from 'lit-html/lib/shady-render.js';
import { OverlayController } from '@lion/overlays';


/**
 * @type {Function()}
 * @polymerMixin
 * @mixinFunction
 */
export const OverlayInterfaceMixin = dedupeMixin(
// eslint-disable-next-line no-shadow
superclass => class OverlayInterfaceMixin extends superclass {
  get opened() {
    return this._overlayCtrl.isShown;
  }

  set opened(show) {
    if (show) {
      this._overlayCtrl.show();
    } else {
      this._overlayCtrl.hide();
    }
  }

  updated(c) {
    super.updated(c);
    this._renderOverlayContent();
  }

  _renderOverlayContent() {
    render(this._overlayTemplate(), this.__contentParent, {
      scopeName: this.localName, eventContext: this
    });
  }

  __createOverlay() {
    this.__contentParent = document.createElement('div');
    this._renderOverlayContent();
    const contentNode = this.__contentParent.firstElementChild;
    const invokerNode = this._invokerElement;
    this._overlayCtrl = this._defineOverlay({ contentNode, invokerNode });
  }

  /**
   * @overridable
   * Be aware that the overlay will be placed in a different shadow root.
   * Therefore, style encapsulation should be provided by the contents of
   * _overlayTemplate
   * @return {TemplateResult}
   */
  // eslint-disable-next-line class-methods-use-this
  _overlayTemplate() {}

  /**
   * @desc returns an instance of a (dynamic) overlay controller
   * @returns {OverlayController}
   */
  // eslint-disable-next-line
  _defineOverlay({ contentNode, invokerNode }) {}

});