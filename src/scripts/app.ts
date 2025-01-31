import Twig, { Template } from 'twig';

const renderData = (tpl: Template): Node[] => {
  const parser = new DOMParser();

  const { body } = parser.parseFromString(
    tpl.render(),
    'text/html'
  );

  return Array.from(body.children);
}

const fetchTemplate = async (): Template => {
  try {
    const res = await fetch('src/assets/tpl.twig');
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
    const arr = renderData(tpl);

    arr.forEach(item => wrapper?.append(item));
  } catch(err) {
    console.error(err);
  }
};

export default init;
