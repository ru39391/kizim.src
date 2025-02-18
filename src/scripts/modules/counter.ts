import { STATE_MOD } from '../utils/constants';
import type { TCounterOptions, TCounterData } from '../utils/types';

class Counter {
  counterList: TCounterData[] = [];
  sectionList: HTMLElement[] = [];
  classMod: string = STATE_MOD.visible;

  constructor(options: TCounterOptions) {
    this.init(options);
  }

  init(options: TCounterOptions) {
    const { counterSel, sectionSel } = options;

    this.sectionList = Array.from(document.querySelectorAll(sectionSel));

    if (!this.sectionList.length) {
      return;
    }

    this.counterList = this.sectionList.map((section) => {
      const items = Array.from(section.querySelectorAll(counterSel)) as HTMLElement[];

      return {
        items,
        values: items.map(item => {
            const { value } = item.dataset;

            return Number(value);
          })
      };
    });

    this.bindEvents();
  }

  handleCounter(item: HTMLElement, value: number) {
    let counter = 0;

    const interval = setInterval(() => {
      counter += 1;

      if (counter >= value) {
        counter = value;
        clearInterval(interval);
        window.removeEventListener('scroll', (this.scrollPage as EventListener).bind(this));
      }
      item.textContent = counter.toString();
    }, 4000 / value);
  }

  handleCounterList(data: TCounterData) {
    const { items, values } = data;

    items.forEach((item, index) => this.handleCounter(item, values[index]));
  }

  handleSectionScroll(section: HTMLElement, index: number) {
    const { classList } = section;
    const { top, bottom } = section.getBoundingClientRect() as DOMRect;

    if (top <= window.innerHeight && bottom >= 0 && !classList.contains(this.classMod)) {
      classList.add(this.classMod);
      this.handleCounterList(this.counterList[index]);
    }
  }

  scrollPage() {
    this.sectionList.forEach((section, index) => this.handleSectionScroll(section, index));
  }

  bindEvents() {
    window.addEventListener('scroll', (this.scrollPage as EventListener).bind(this));
  }
}

export default Counter;
