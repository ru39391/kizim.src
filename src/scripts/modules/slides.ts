import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

const initSlides = (sel: string) => {
  const item = document.querySelector(sel);

  if(!item) {
    return;
  }

  const slides = new Swiper(sel, {
    slidesPerView: 'auto',
    loop: true,
    centeredSlides: true,
    modules: [Navigation],
    navigation: {
      nextEl: `.swiper-button-next`,
      prevEl: `.swiper-button-prev`,
    },
  });

  return slides;
}

export {
  initSlides
}
