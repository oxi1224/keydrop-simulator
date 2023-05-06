const options: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px',
  threshold: 0
};

export const lazyLoad = (image: HTMLImageElement, src: string) => {
  const loaded = () => {
    image.classList.add('loaded');
  };
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      image.src = src;
      if (image.complete) loaded();
      else image.addEventListener('load', loaded);
    }
  }, options);
  observer.observe(image);

  return {
    destroy() {
      image.removeEventListener('load', loaded);
    }
  };
};
