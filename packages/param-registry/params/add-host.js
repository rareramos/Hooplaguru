Params.addHost = (val, state, done) => {
  let swiper = $('.event-form-swiper')[0].swiper;

  if (state.added) {
    Session.set('firstSlide', 'AddHost');
    Hoopla.transforms.slideAndFade(swiper, 1, '.header-stacked.add-host', done);

  } else if (state.removed) {
    Hoopla.transforms.slideAndFade(swiper, 0, '.header-stacked.main', done);

  } else { done() }
};
