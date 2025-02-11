import Twig, { Template } from 'twig';
import { initSlides } from './modules/slides';
import Modal from './modules/modal';
import Panel from './modules/panel';
import Toggler from './modules/toggler';

const renderData = (tpl: Template): Node[] => {
  const parser = new DOMParser();

  const { body } = parser.parseFromString(
    tpl.render(),
    'text/html'
  );

  return Array.from(body.children);
}

const fetchTemplate = async (): Promise<Template | undefined> => {
  try {
    const res = await fetch('src/assets/templates/tpl.twig');
    const data = await res.text();

    return Twig.twig({ data });
  } catch(err) {
    console.error(err);
  }
}

const init = async () => {
  const wrapper = document.querySelector<HTMLDivElement>('#app');

  try {
    const tpl = await fetchTemplate();
    const arr = renderData(tpl as Template);

    arr.forEach(item => wrapper?.append(item));
    initSlides('.js-slides');
    new Modal({ btnSel: '.js-modal-btn', overlayClass: 'modal-overlay' });
    new Panel({ sel: '.js-nav' });
    new Toggler({ itemSel: '.js-nav', btnSel: '.js-nav-toggler' });
  } catch(err) {
    console.error(err);
  }
};

/*
const init = () => {
  initSlides('.js-slides');
  new Panel({ sel: '.js-nav' });
  new Toggler({ itemSel: '.js-nav', btnSel: '.js-nav-toggler' });
};
*/

export default init;
