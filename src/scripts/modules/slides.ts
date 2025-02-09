import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

const initSlides = (sel: string) => {
  const items = Array.from(document.querySelectorAll(sel));

  if(!items.length) {
    return;
  }

  const slides = items.map(() => new Swiper(sel, {
    slidesPerView: 'auto',
    loop: true,
    centeredSlides: true,
    modules: [Navigation],
    navigation: {
      nextEl: `${sel} .swiper-button-next`,
      prevEl: `${sel} .swiper-button-prev`,
    },
  }));

  return slides;
}

export {
  initSlides
}
