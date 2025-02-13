type TTogglerOptions = {
  itemSel: string;
  btnSel: string;
};

class Toggler {
  btnSel: string | null = null;
  btn: Element | null = null;
  item: Element | null = null;
  classMod: string = 'is-visible';

  constructor(options: TTogglerOptions) {
    this.init(options);
  }

  init(options: TTogglerOptions) {
    const { itemSel, btnSel } = options;
    this.item = document.querySelector(itemSel);

    if (!this.item) {
      return;
    }

    this.btnSel = btnSel;
    this.btn = document.querySelector(btnSel);

    this.bindEvents();
  }

  handleDocBody(item: Element | null) {
    const { body } = document;
    const { classList } = body;

    body.removeEventListener('click', this.hideNav.bind(this));
     item?.classList.contains(this.classMod) ? classList.add('nav-overlay') : classList.remove('nav-overlay');
  }

  hideNav(event: MouseEvent) {
    const item = event.target as Element;

    if(this.btnSel && item.closest(this.btnSel)) {
      return;
    } else {
      this.item?.classList.remove(this.classMod);
      this.handleDocBody(this.item);
    }
  }

  toggleNav(event: MouseEvent) {
    event.preventDefault();
    document.body.addEventListener('click', this.hideNav.bind(this));

    if(this.item) {
      this.item.classList.toggle(this.classMod);
      this.handleDocBody(this.item);
    }
  }

  bindEvents() {
    this.btn?.addEventListener('click', (this.toggleNav as EventListener).bind(this));
  }
}

export default Toggler;
