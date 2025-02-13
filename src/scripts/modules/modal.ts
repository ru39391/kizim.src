import Twig, { Template } from 'twig';
import {
  TPL_URL,
  SITE_API_URL
} from '../utils/constants';
import type {
  TModalOptions,
  TProjectData,
  TEmbedData,
  TTemplateData
} from '../utils/types';

class Modal {
  btnSel: string = '.js-modal-btn';
  classMod: string = 'is-visible';
  modalClass: string = 'modal';
  overlayClass: string = 'modal-overlay';
  modalOverlayClass: string = 'js-modal-overlay';
  modalOverlay: HTMLElement | null = null;
  modalBtns: HTMLElement[] = [];
  isModalPlain: boolean = false;

  constructor(options: TModalOptions) {
    this.init(options);
  }

  init(options: TModalOptions) {
    const { btnSel, overlayClass } = options;

    this.btnSel = btnSel;
    this.overlayClass = overlayClass;
    this.modalBtns = Array.from(document.querySelectorAll(this.btnSel));

    if (!this.modalBtns.length) {
      return;
    }

    this.handleBtnEventListener();
  }

  setTplPath(value: string = this.modalClass) {
    return `${TPL_URL}/${value}.twig`;
  }

  hideModal(currentTarget: HTMLElement | null) {
    if(!currentTarget) {
      return;
    }

    [currentTarget, this.modalOverlay].forEach(
      (item) => {
        item?.classList.remove(this.classMod);
        item?.removeEventListener('click', (this.closeModal as EventListener).bind(this));

        if(!this.isModalPlain) {
          item?.remove();
          item = null;
        }
      }
    );

    document.body.style.overflow = '';
  }

  closeModal(event: MouseEvent) {
    const { target, currentTarget } = {
      target: event.target as HTMLElement,
      currentTarget: event.currentTarget as HTMLElement,
    };

    if(target.parentElement === currentTarget) {
      this.hideModal(currentTarget);
    }
  }

  changeModal(event: MouseEvent) {
    event.preventDefault();

    const { btn } = { btn: event.target as HTMLElement };
    const { res: id } = btn.dataset;

    if(!id) {
      return;
    }

    this.fetchItems(id, btn.closest(`.${this.overlayClass}`) as HTMLElement);
  }

  renderData(item: HTMLElement | null) {
    if(!item) {
      return;
    }

    const btn = item.querySelector(this.btnSel);

    this.modalOverlay = document.createElement('div');

    [
      this.overlayClass,
      this.modalOverlayClass,
      this.classMod
    ].forEach(className => this.modalOverlay?.classList.add(className as string));

    btn?.addEventListener('click', (this.changeModal as EventListener).bind(this));
    this.modalOverlay.addEventListener('click', (this.closeModal as EventListener).bind(this));
    this.modalOverlay.append(item);
    document.body.append(this.modalOverlay);
    document.body.style.overflow = 'hidden';
  }

  parseData(data: TProjectData | TEmbedData, tpl: Template, itemClass = this.modalClass): HTMLElement | null {
    const parser = new DOMParser();
    const { body } = parser.parseFromString(tpl.render(data), 'text/html');

    return body.querySelector(`.${itemClass}`);
  }

  async fetchTemplate(tplPath: string): Promise<TTemplateData> {
    let tplData: TTemplateData = { tpl: undefined, isSucceed: false };

    try {
      const res = await fetch(tplPath);
      const data = await res.text();

      tplData = { tpl: Twig.twig({ data }), isSucceed: true };
    } catch(err) {
      console.error(err);
    }

    return tplData;
  }

  async fetchItems(id: string, modalOverlay: HTMLElement | null = null) {
    this.hideModal(modalOverlay);
    const tplPath = this.setTplPath();

    try {
      const response = await fetch(`${SITE_API_URL}/projects/${id}`);

      if(!response.ok) {
        return;
      }

      const [
        { data: resData, success },
        { tpl, isSucceed }
      ] = await Promise.all([
        response.json(),
        this.fetchTemplate(tplPath)
      ]);

      if(success && isSucceed) {
        const item = this.parseData(resData as TProjectData, tpl as Template);

        this.renderData(item);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchVideo({ type, video }: Record<string, string>) {
    const modalTplPath = this.setTplPath();
    const videoTplPath = this.setTplPath(type);

    try {
      const [
        { tpl: modalTpl, isSucceed: isModalSucceed },
        { tpl: videoTpl, isSucceed: isVideoSucceed }
      ] = await Promise.all([
        this.fetchTemplate(modalTplPath),
        this.fetchTemplate(videoTplPath)
      ]);

      if(isModalSucceed && isVideoSucceed) {
        const embed = this.parseData({ video }, videoTpl as Template, 'embed') as HTMLElement;
        const modal = this.parseData(
          {
            content: embed.outerHTML,
            isHeaderHidden: 1,
            isFooterHidden: 1,
            modalClass: 'video'
          },
          modalTpl as Template
        );

        this.renderData(modal);
      }
    } catch (error) {
      console.log(error);
    }
  }

  openModal(id: string) {
    if(!id) {
      return;
    }

    this.isModalPlain = true;
    this.modalOverlay = document.querySelector(`#${id}`);
    this.modalOverlay?.classList.add(this.classMod);
    this.modalOverlay?.addEventListener('click', (this.closeModal as EventListener).bind(this));
    document.body.style.overflow = 'hidden';
  }

  showModal(event: MouseEvent) {
    event.preventDefault();

    const { dataset } = event.target as HTMLElement;
    const { target, res, type, video } = dataset;

    this.isModalPlain = false;

    if(!res && video) {
      this.fetchVideo({ type: type as string, video });
    }

    if(res && !video) {
      this.fetchItems(res);
    }

    if(target) {
      this.openModal(target);
    }
  }

  handleBtnEventListener() {
    this.modalBtns.forEach(btn => btn.addEventListener('click', (this.showModal as EventListener).bind(this)));
  }
}

export default Modal;
