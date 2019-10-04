import { render } from 'lit-html';

/**
 * @param {TemplateResult} templateResult
 * @returns {Node}
 */
export function renderToNode(templateResult) {
  const renderParent = document.createElement('div');
  render(templateResult, renderParent);
  return renderParent.firstElementChild;
}
