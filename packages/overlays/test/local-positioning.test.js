import { expect, fixture, html } from '@open-wc/testing';
import Popper from 'popper.js/dist/esm/popper.min.js';
import { OverlayController } from '../src/OverlayController.js';

import { renderToNode } from '../test-helpers/global-positioning-helpers.js';
import { normalizeTransformStyle } from '../test-helpers/local-positioning-helpers.js';

const withDefaultLocalConfig = () => ({
  placementMode: 'global',
  contentNode: renderToNode(html`
    <div>my content</div>
  `),
});

describe('LocalOverlayController', () => {

  describe('Nodes', () => {

    // TODO: check if wanted/needed
    it.skip('sets display to inline-block for contentNode by default', async () => {
      const invokerNode = await fixture(html`
        <div role="button" id="invoker">Invoker</div>
      `);

      const node = document.createElement('div');
      node.innerHTML = '<div id="content">Content</div>';

      const ctrl = new OverlayController({
        ...withDefaultLocalConfig(),
        contentNode: node,
        invokerNode,
      });
      const el = await fixture(html`
        <div>
          ${ctrl.invoker} ${ctrl.content}
        </div>
      `);

      await ctrl.show();
      const contentWrapper = el.querySelector('#content').parentElement;
      expect(contentWrapper.style.display).to.equal('inline-block');
    });
  });

  // Please use absolute positions in the tests below to prevent the HTML generated by
  // the test runner from interfering.
  describe('Positioning', () => {
    it('creates a Popper instance on the controller when shown, keeps it when hidden', async () => {
      const invokerNode = await fixture(
        html`
          <div role="button" style="width: 100px; height: 20px;"></div>
        `,
      );
      const ctrl = new OverlayController({
        ...withDefaultLocalConfig(),
        contentNode: () => renderToNode(html`
          <div style="width: 80px; height: 20px;"></div>
        `),
        invokerNode,
      });
      await ctrl.show();
      expect(ctrl._popper)
        .to.be.an.instanceof(Popper)
        .and.have.property('modifiers');
      await ctrl.hide();
      expect(ctrl._popper)
        .to.be.an.instanceof(Popper)
        .and.have.property('modifiers');
    });

    it('positions correctly', async () => {
      // smoke test for integration of popper
      const invokerNode = await fixture(html`
        <div role="button" style="width: 100px; height: 20px;">Invoker</div>
      `);
      const ctrl = new OverlayController({
        ...withDefaultLocalConfig(),
        contentNode: () => renderToNode(html`
          <div style="width: 80px; height: 20px; margin: 0;">my content</div>
        `),
        invokerNode,
      });
      await fixture(html`
        ${invokerNode}${ctrl.content}
      `);

      await ctrl.show();

      expect(normalizeTransformStyle(ctrl.contentNode.style.transform)).to.equal(
        // TODO: check if 'translate3d(16px, 16px, 0px)' would be more appropriate
        'translate3d(16px, 28px, 0px)',
        '16px displacement is expected due to both horizontal and vertical viewport margin',
      );
    });

    it('uses top as the default placement', async () => {
      let ctrl;
      const invokerNode = await fixture(html`
        <div role="button" style="width: 100px; height: 20px;" @click=${() => ctrl.show()}></div>
      `);
      ctrl = new OverlayController({
        ...withDefaultLocalConfig(),
        contentNode: () => renderToNode(html`
          <div style="width: 80px; height: 20px;"></div>
        `),
        invokerNode,
      });
      await fixture(html`
        <div style="position: absolute; left: 100px; top: 100px;">
          ${ctrl.invoker} ${ctrl.content}
        </div>
      `);
      await ctrl.show();
      const contentChild = ctrl.content.firstElementChild;
      expect(contentChild.getAttribute('x-placement')).to.equal('top');
    });

    it('positions to preferred place if placement is set and space is available', async () => {
      let controller;
      const invokerNode = await fixture(html`
        <div
          role="button"
          style="width: 100px; height: 20px;"
          @click=${() => controller.show()}
        ></div>
      `);

      controller = new OverlayController({
        ...withDefaultLocalConfig(),
        contentNode: () => renderToNode(html`
          <div style="width: 80px; height: 20px;"></div>
        `),
        invokerNode,
        popperConfig: {
          placement: 'left-start',
        },
      });
      await fixture(html`
        <div style="position: absolute; left: 100px; top: 50px;">
          ${controller.invoker} ${controller.content}
        </div>
      `);

      await controller.show();
      const contentChild = controller.content.firstElementChild;
      expect(contentChild.getAttribute('x-placement')).to.equal('left-start');
    });

    it('positions to different place if placement is set and no space is available', async () => {
      let ctrl;
      const invokerNode = await fixture(html`
        <div role="button" style="width: 100px; height: 20px;" @click=${() => ctrl.show()}></div>
      `);
      ctrl = new OverlayController({
        ...withDefaultLocalConfig(),
        contentNode: () => renderToNode(html`
          <div style="width: 80px; height: 20px;"></div>
        `),
        invokerNode,
        popperConfig: {
          placement: 'top-start',
        },
      });
      await fixture(`
        <div style="position: absolute; top: 0;">
          ${ctrl.invoker} ${ctrl.content}
        </div>
      `);

      await ctrl.show();
      const contentChild = ctrl.content.firstElementChild;
      expect(contentChild.getAttribute('x-placement')).to.equal('bottom-start');
    });

    it('allows the user to override default Popper modifiers', async () => {
      let controller;
      const invokerNode = await fixture(html`
        <div
          role="button"
          style="width: 100px; height: 20px;"
          @click=${() => controller.show()}
        ></div>
      `);
      controller = new OverlayController({
        ...withDefaultLocalConfig(),
        contentNode: renderToNode(html`
          <div style="width: 80px; height: 20px;"></div>
        `),
        invokerNode,
        popperConfig: {
          modifiers: {
            keepTogether: {
              enabled: false,
            },
            offset: {
              enabled: true,
              offset: `0, 16px`,
            },
          },
        },
      });
      await fixture(html`
        <div style="position: absolute; left: 100px; top: 50px;">
          ${controller.invoker} ${controller.content}
        </div>
      `);

      await controller.show();
      const keepTogether = controller._popper.modifiers.find(item => item.name === 'keepTogether');
      const offset = controller._popper.modifiers.find(item => item.name === 'offset');
      expect(keepTogether.enabled).to.be.false;
      expect(offset.enabled).to.be.true;
      expect(offset.offset).to.equal('0, 16px');
    });

    it('positions the Popper element correctly on show', async () => {
      let controller;
      const invokerNode = await fixture(html`
        <div
          role="button"
          style="width: 100px; height: 20px;"
          @click=${() => controller.show()}
        ></div>
      `);
      controller = new OverlayController({
        ...withDefaultLocalConfig(),
        contentNode: renderToNode(html`
          <div style="width: 80px; height: 20px;"></div>
        `),
        invokerNode,
        popperConfig: {
          placement: 'top',
        },
      });
      await fixture(html`
        <div style="position: absolute; top: 300px; left: 100px;">
          ${controller.invoker} ${controller.content}
        </div>
      `);

      await controller.show();

      let contentChild = controller.content.firstElementChild;
      expect(normalizeTransformStyle(contentChild.style.transform)).to.equal(
        'translate3d(10px, -28px, 0px)',
        'Popper positioning values',
      );

      await controller.hide();
      await controller.show();
      contentChild = controller.content.firstElementChild;
      expect(normalizeTransformStyle(contentChild.style.transform)).to.equal(
        'translate3d(10px, -28px, 0px)',
        'Popper positioning values should be identical after hiding and showing',
      );
    });

    // TODO: dom get's removed when hidden so no dom node to update placement
    it('updates placement properly even during hidden state', async () => {
      let controller;
      const invokerNode = await fixture(html`
        <div
          role="button"
          style="width: 100px; height: 20px;"
          @click=${() => controller.show()}
        ></div>
      `);
      controller = new OverlayController({
        ...withDefaultLocalConfig(),
        contentNode: renderToNode(html`
          <div style="width: 80px; height: 20px;"></div>
        `),
        invokerNode,
        popperConfig: {
          placement: 'top',
          modifiers: {
            offset: {
              enabled: true,
              offset: '0, 10px',
            },
          },
        },
      });
      await fixture(html`
        <div style="position: absolute; top: 300px; left: 100px;">
          ${controller.invoker} ${controller.content}
        </div>
      `);

      await controller.show();
      let contentChild = controller.content.firstElementChild;
      expect(normalizeTransformStyle(contentChild.style.transform)).to.equal(
        'translate3d(10px, -30px, 0px)',
        'Popper positioning values',
      );

      await controller.hide();
      await controller.updatePopperConfig({
        modifiers: {
          offset: {
            enabled: true,
            offset: '0, 20px',
          },
        },
      });
      await controller.show();
      contentChild = controller.content.firstElementChild;
      expect(controller._popper.options.modifiers.offset.offset).to.equal('0, 20px');
      expect(normalizeTransformStyle(contentChild.style.transform)).to.equal(
        'translate3d(10px, -40px, 0px)',
        'Popper positioning Y value should be 10 less than previous, due to the added extra 10px offset',
      );
    });

    it('updates positioning correctly during shown state when config gets updated', async () => {
      let controller;
      const invokerNode = await fixture(html`
        <div role="button" style="width: 100px; height: 20px;" @click=${() => controller.show()}>
          Invoker
        </div>
      `);
      controller = new OverlayController({
        ...withDefaultLocalConfig(),
        contentNode: renderToNode(html`
          <div style="width: 80px; height: 20px;"></div>
        `),
        invokerNode,
        popperConfig: {
          placement: 'top',
          modifiers: {
            offset: {
              enabled: true,
              offset: '0, 10px',
            },
          },
        },
      });
      await fixture(html`
        <div style="position: absolute; top: 300px; left: 100px;">
          ${controller.invoker} ${controller.content}
        </div>
      `);

      await controller.show();
      const contentChild = controller.content.firstElementChild;
      expect(normalizeTransformStyle(contentChild.style.transform)).to.equal(
        'translate3d(10px, -30px, 0px)',
        'Popper positioning values',
      );

      await controller.updatePopperConfig({
        modifiers: {
          offset: {
            enabled: true,
            offset: '0, 20px',
          },
        },
      });
      expect(normalizeTransformStyle(contentChild.style.transform)).to.equal(
        'translate3d(10px, -40px, 0px)',
        'Popper positioning Y value should be 10 less than previous, due to the added extra 10px offset',
      );
    });

    it('can set the contentNode minWidth as the invokerNode width', async () => {
      const invokerNode = await fixture(
        '<div role="button" style="width: 60px; border: none;">invoker</div>',
      );
      const ctrl = new OverlayController({
        ...withDefaultLocalConfig(),
        inheritsInvokerWidth: 'min',
        invokerNode,
      });
      await ctrl.show();
      expect(ctrl.contentNode.style.minWidth).to.equal('60px');
    });

    it('can set the contentNode maxWidth as the invokerNode width', async () => {
      const invokerNode = await fixture(
        '<div role="button" style="width: 60px; border: none;">invoker</div>',
      );
      const ctrl = new OverlayController({
        ...withDefaultLocalConfig(),
        inheritsInvokerWidth: 'max',
        invokerNode,
      });
      await ctrl.show();
      expect(ctrl.contentNode.style.maxWidth).to.equal('60px');
    });

    it('can set the contentNode width as the invokerNode width', async () => {
      const invokerNode = await fixture(
        '<div role="button" style="width: 60px; border: none;">invoker</div>',
      );
      const ctrl = new OverlayController({
        ...withDefaultLocalConfig(),
        inheritsInvokerWidth: 'full',
        invokerNode,
      });
      await ctrl.show();
      expect(ctrl.contentNode.style.width).to.equal('60px');
    });
  });
});
