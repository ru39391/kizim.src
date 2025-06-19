import Twig, { Template } from 'twig';
import { initNavHandler } from './modules/nav';
import { initSlides } from './modules/slides';
import { submitForm } from './modules/forms';
import Accordion from './modules/accordion';
import Caption from './modules/caption';
import Counter from './modules/counter';
import Modal from './modules/modal';
import Panel from './modules/panel';
import Section from './modules/section';
import Toggler from './modules/toggler';
import { FORM_SELECTORS } from './utils/constants';

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

const init = () => {
  submitForm();
  initNavHandler('.js-nav-link');
  initSlides('.js-slides');
  new Accordion();
  new Caption({ sel: '.js-title' });
  new Counter({ counterSel: '.js-value',  sectionSel: '.js-value-holder' });
  new Modal({
    btnSel: '.js-modal-btn',
    overlayClass: 'modal-overlay',
    titleSel: FORM_SELECTORS.formTitle,
    inputSel: FORM_SELECTORS.inputTitle
  });
  new Panel({ sel: '.js-nav' });
  new Section({ sel: '.js-section' });
  new Toggler({
    itemSel: '.js-nav',
    btnSel: '.js-nav-toggler'
  });
};

const initApp = async () => {
  const wrapper = document.querySelector<HTMLDivElement>('#app');

  try {
    const tpl = await fetchTemplate();
    const arr = renderData(tpl as Template);

    arr.forEach(item => wrapper?.append(item));
    init();
  } catch(err) {
    console.error(err);
  }
};

export {
  init,
  initApp
}
