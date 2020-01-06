Params.media = (val, state, done) => {
  let swiper = $('.event-form-swiper')[0].swiper;

  if (state.added) {
    Session.set('secondSlide', 'Media');
    Hoopla.transforms.slideAndFade(swiper, 2, '.header-stacked.media', done);

  } else if (state.removed) {
    if (PM.get('edit-activity')) {
      Hoopla.transforms.slideAndFade(swiper, 1, '.header-stacked.edit-activity', done);

    } else {
      Hoopla.transforms.slideAndFade(swiper, 1, '.header-stacked.add-activity', done);
    }

  } else { done() }
};
