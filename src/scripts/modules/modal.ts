import Twig, { Template } from 'twig';
import { TPL_URL } from '../utils/constants';
import { fetchProjectsData } from '../utils/data';

type TModalOptions = {
  btnSel: string;
  modalSel: string;
};

type TResData = {
  id: number;
  name: string;
  introtext: string;
  content: string;
  bg: string;
  logo: string;
  picture: string;
  fill: string;
  list: string[];
}

type TTemplateData = {
  tpl: Template | undefined;
  isSucceed: boolean;
}

class Modal {
  tplPath: string | null = null;
  modalSel: string | null = null;
  modalOverlay: Element | null = null;
  modalOverlayClass: string = 'js-modal-overlay';
  modalClass: string = 'modal';
  classMod: string = 'is-visible';
  modalBtns: Element[] = [];

  constructor(options: TModalOptions) {
    this.init(options);
  }

  init(options: TModalOptions) {
    const { btnSel, modalSel } = options;

    this.modalSel = modalSel;
    this.modalBtns = Array.from(document.querySelectorAll(btnSel));

    if (!this.modalBtns.length) {
      return;
    }

    this.tplPath = `${TPL_URL}/${this.modalClass}.twig`

    this.handleBtnEventListener();
  }

  hideModal(event: MouseEvent) {HTMLElement
    const { target, currentTarget } = {
      target: event.target as HTMLElement,
      currentTarget: event.currentTarget as HTMLElement,
    };

    if(target.parentElement === currentTarget) {
      currentTarget.classList.remove(this.classMod);
      currentTarget.remove();
      this.modalOverlay = null;
    }
  }

  renderData(item: Element | null) {
    if(!item) {
      return;
    }

    this.modalOverlay = document.createElement('div');

    [
      this.modalSel,
      this.modalOverlayClass,
      this.classMod
    ].forEach(className => this.modalOverlay?.classList.add(className as string));

    this.modalOverlay.addEventListener('click', (this.hideModal as EventListener).bind(this));
    this.modalOverlay.append(item);
    document.body.append(this.modalOverlay);
  }

  parseData(data: TResData, tpl: Template) {
    const parser = new DOMParser();
    const { body } = parser.parseFromString(
      tpl.render(data),
      'text/html'
    );

    this.renderData(body.querySelector(`.${this.modalClass}`));
  }

  async fetchTemplate(): Promise<TTemplateData> {
    let tplData: TTemplateData = { tpl: undefined, isSucceed: false };

    try {
      const res = await fetch(this.tplPath as string);
      const data = await res.text();

      tplData = { tpl: Twig.twig({ data }), isSucceed: true };
    } catch(err) {
      console.error(err);
    }

    return tplData;
  }

  async fetchItems(id: string) {
    try {
      const [
        { data: resData, success },
        { tpl, isSucceed }
      ] = await Promise.all([fetchProjectsData(id), this.fetchTemplate()]);

      if(success && isSucceed) {
        this.parseData(resData, tpl as Template);
      }
    } catch (error) {
      console.log(error);
    }
  }

  showModal(event: MouseEvent) {
    event.preventDefault();

    const { dataset } = event.target as HTMLElement;
    const { target, res } = dataset;

    if(!target && !res) {
      return;
    }

    if(res) {
      this.fetchItems(res);
    }
  }

  handleBtnEventListener() {
    this.modalBtns.forEach(btn => btn.addEventListener('click', (this.showModal as EventListener).bind(this)));
  }
}

export default Modal;
