import type { TPanelOptions } from '../utils/types';

class Panel {
  isScrolled: boolean = false;
  item: HTMLElement | null = null;
  scrollHeight: number = 0;
  classMod: string = 'is-active';

  constructor(options: TPanelOptions) {
    this.init(options);
  }

  init(options: TPanelOptions) {
    const { sel } = options;

    this.item = document.querySelector(sel);

    if (!this.item) {
      return;
    }

    this.scrollHeight = this.item.scrollHeight;

    this.handleEventListener();
  }

  scrollWindow() {
    if (window.pageYOffset >= this.scrollHeight) {
      this.item?.classList.add(this.classMod);
    } else {
      this.item?.classList.remove(this.classMod);
    }

    this.isScrolled = false;
  }

  handleEventListener() {
    window.addEventListener('scroll', () => {
      if(!this.isScrolled) {
        this.isScrolled = true;
        setTimeout(() => this.scrollWindow(), 250);
      }
    }, false);
  }
}

export default Panel;
