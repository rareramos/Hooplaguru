Params.coverPhotoCategory = (val, state, done) => {
  let swiper = $('.event-form-swiper')[0].swiper;

  if (state.added) {
    Session.set('secondSlide', 'CoverPhotoCategory');
    Hoopla.transforms.slideAndFade(swiper, 2, '.header-stacked.cover-photo-category', () => {
      new Blazy({container: '.swiper-slide'})
      done();
    });

  } else if (state.removed) {
    Hoopla.transforms.slideAndFade(swiper, 1, '.header-stacked.cover-photo', () => {
      PM.set('category-id', null, true);
      done();
    });

  } else { done() }
};
