// @ts-ignore
import Swiper, { Autoplay, Navigation } from 'swiper';

const initSlides = (sel: string) => {
  const items = Array.from(document.querySelectorAll(sel));

  if(!items.length) {
    return;
  }

  const slides: Swiper[] = items.map(() => new Swiper(sel, {
    slidesPerView: 'auto',
    loop: true,
    grabCursor: true,
    centeredSlides: false,
    modules: [Autoplay, Navigation],
    navigation: {
      nextEl: `${sel} .swiper-button-next`,
      prevEl: `${sel} .swiper-button-prev`,
    },
    mousewheel: {
      forceToAxis: true
    },
    autoplay: {
      delay: 2500,
      pauseOnMouseEnter: true,
      disableOnInteraction: false
    },
    speed: 700,
  }));

  return slides;
}

export {
  initSlides
}
