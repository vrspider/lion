/* eslint-disable no-new */
import { expect, html, fixture, aTimeout } from '@open-wc/testing';
import '@lion/core/test-helpers/keyboardEventShimIE.js';
import sinon from 'sinon';
import { keyCodes } from '../src/utils/key-codes.js';
import { simulateTab } from '../src/utils/simulate-tab.js';

import { OverlayController } from '../src/OverlayController.js';

describe('shown', () => {
  it('has .isShown which defaults to false', async () => {
    const contentNode = await fixture(html`
      <p>my content</p>
    `);
    const ctrl = new OverlayController({
      placementMode: 'global',
      contentNode,
    });
    expect(ctrl.isShown).to.be.false;
  });

  it('has async show() which shows the overlay', async () => {
    const contentNode = await fixture(html`
      <p>my content</p>
    `);
    const ctrl = new OverlayController({
      placementMode: 'global',
      contentNode,
    });
    await ctrl.show();
    expect(ctrl.isShown).to.be.true;
    expect(ctrl.show()).to.be.instanceOf(Promise);
  });

  it('has async hide() which hides the overlay', async () => {
    const contentNode = await fixture(html`
      <p>my content</p>
    `);
    const ctrl = new OverlayController({
      placementMode: 'global',
      contentNode,
    });

    await ctrl.hide();
    expect(ctrl.isShown).to.be.false;
    expect(ctrl.hide()).to.be.instanceOf(Promise);
  });

  it('fires "show" event once overlay becomes shown', async () => {
    const showSpy = sinon.spy();
    const contentNode = await fixture(html`
      <p>my content</p>
    `);
    const ctrl = new OverlayController({
      placementMode: 'global',
      contentNode,
    });

    ctrl.addEventListener('show', showSpy);
    await ctrl.show();
    expect(showSpy.callCount).to.equal(1);
    await ctrl.show();
    expect(showSpy.callCount).to.equal(1);
  });

  it('fires "before-show" event right before overlay becomes shown', async () => {
    const contentNode = await fixture(html`
      <p>my content</p>
    `);
    const ctrl = new OverlayController({
      placementMode: 'global',
      contentNode,
    });

    const eventSpy = sinon.spy();

    ctrl.addEventListener('before-show', eventSpy);
    ctrl.addEventListener('show', eventSpy);

    await ctrl.show();
    expect(eventSpy.getCall(0).args[0].type).to.equal('before-show');
    expect(eventSpy.getCall(1).args[0].type).to.equal('show');

    expect(eventSpy.callCount).to.equal(2);
    await ctrl.show();
    expect(eventSpy.callCount).to.equal(2);
  });

  it('fires "hide" event once overlay becomes hidden', async () => {
    const hideSpy = sinon.spy();
    const contentNode = await fixture(html`
      <p>my content</p>
    `);
    const ctrl = new OverlayController({
      placementMode: 'global',
      contentNode,
    });

    ctrl.addEventListener('hide', hideSpy);
    await ctrl.show();
    await ctrl.hide();
    expect(hideSpy.callCount).to.equal(1);
    await ctrl.hide();
    expect(hideSpy.callCount).to.equal(1);
  });
});

it('fires "before-hide" event right before overlay becomes hidden', async () => {
  const contentNode = await fixture(html`
    <p>my content</p>
  `);
  const ctrl = new OverlayController({
    placementMode: 'global',
    contentNode,
  });

  const eventSpy = sinon.spy();

  ctrl.addEventListener('before-hide', eventSpy);
  ctrl.addEventListener('hide', eventSpy);

  await ctrl.show();
  await ctrl.hide();
  expect(eventSpy.getCall(0).args[0].type).to.equal('before-hide');
  expect(eventSpy.getCall(1).args[0].type).to.equal('hide');

  expect(eventSpy.callCount).to.equal(2);
  await ctrl.hide();
  expect(eventSpy.callCount).to.equal(2);
});

describe('.contentNode', () => {
  it('accepts an .contentNode<Node> to directly set content', async () => {
    const ctrl = new OverlayController({
      placementMode: 'global',
      contentNode: await fixture('<p>direct node</p>'),
    });
    expect(ctrl.contentNode).to.have.trimmed.text('direct node');
  });
});

describe('setup', () => {
  it.only('throws if no .placementMode gets passed on', async () => {
    expect(() => {
      new OverlayController({
        contentNode: {},
      });
    }).to.throw('You need to provide a .placementMode ("global"|"local")');
  });

  it.only('throws if invalid .placementMode gets passed on', async () => {
    expect(() => {
      new OverlayController({
        placementMode: 'invalid',
      });
    }).to.throw('"invalid" is not a valid .placementMode use ("global"|"local")');
  });

  it.only('throws if no .contentNode gets passed on', async () => {
    expect(() => {
      new OverlayController({
        placementMode: 'global',
      });
    }).to.throw('You need to provide a .contentNode');
  });
});

describe('invoker', () => {
  // same as content just with invoker
});

describe('trapsKeyboardFocus (for a11y)', () => {
  it('focuses the overlay on show', async () => {
    const contentNode = await fixture(html`
      <p>my content</p>
    `);
    const ctrl = new OverlayController({
      contentNode,
      trapsKeyboardFocus: true,
      viewportConfig: {},
    });
    await ctrl.show();
    expect(ctrl.contentNode).to.equal(document.activeElement);
  });

  it('keeps focus within the overlay e.g. you can not tab out by accident', async () => {
    const contentNode = await fixture(html`
      <div><input /><input /></div>
    `);
    const ctrl = new OverlayController({
      contentNode,
    });
    await ctrl.show();

    const elOutside = await fixture(html`
      <button>click me</button>
    `);
    const input1 = ctrl.contentNode.querySelectorAll('input')[0];
    const input2 = ctrl.contentNode.querySelectorAll('input')[1];

    input2.focus();
    // this mimics a tab within the contain-focus system used
    const event = new CustomEvent('keydown', { detail: 0, bubbles: true });
    event.keyCode = keyCodes.tab;
    window.dispatchEvent(event);

    expect(elOutside).to.not.equal(document.activeElement);
    expect(input1).to.equal(document.activeElement);
  });

  it('allows to move the focus outside of the overlay if trapsKeyboardFocus is disabled', async () => {
    const contentNode = await fixture(html`
      <div><input /></div>
    `);

    const ctrl = new OverlayController({
      contentNode,
    });
    // add element to dom to allow focus
    await fixture(html`
      ${ctrl.content}
    `);
    await ctrl.show();
    ctrl.enableTrapsKeyboardFocus();

    const elOutside = await fixture(html`
      <input />
    `);
    const input = ctrl.contentNode.querySelector('input');

    input.focus();
    simulateTab();

    expect(elOutside).to.equal(document.activeElement);
  });
});

describe('hidesOnEsc', () => {
  it('hides when [escape] is pressed', async () => {
    const contentNode = await fixture(html`
      <p>Content</p>
    `);
    const ctrl = new OverlayController({
      contentNode,
    });
    await ctrl.show();
    ctrl.enableHidesOnEsc();

    ctrl.contentNode.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    expect(ctrl.isShown).to.be.false;
  });

  it('stays shown when [escape] is pressed on outside element', async () => {
    const contentNode = await fixture(html`
      <p>Content</p>
    `);

    const ctrl = new OverlayController({
      contentNode,
    });
    await ctrl.show();
    ctrl.enableHidesOnEsc();

    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    expect(ctrl.isShown).to.be.true;
  });
});
