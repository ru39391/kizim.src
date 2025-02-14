const handleBtn = (target: HTMLElement) => {
  const { href } = target.dataset;

  if(!href) {
    return;
  }

  const section = document.querySelector(href);

  section?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

const initNavHandler = (sel: string) => {
  const navBtns = Array.from(document.querySelectorAll(sel)) as HTMLElement[];

  if(!navBtns.length) {
    return;
  }

  navBtns.forEach(
    (btn) => {
      btn.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        event.preventDefault();
        handleBtn(target);
      })
    }
  );
}

export {
  initNavHandler
}
