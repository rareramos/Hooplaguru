Params.coverPhoto = (val, state, done) => {
  let swiper = $('.event-form-swiper')[0].swiper;

  let eventId = PM.get('event-form-id');
  let event = Events.findOne({_id: eventId});

  if (state.added) {
    Session.set('firstSlide', 'SelectCoverPhoto');

    Hoopla.transforms.slideAndFade(swiper, 1, '.header-stacked.cover-photo', () => {
      new Blazy({container: '.swiper-slide'})
      done();
    });
    formhackhide('select-cover-photo-form');

  } else if (state.removed) {
    Hoopla.transforms.slideAndFade(swiper, 0, '.header-stacked.main', done);
    event.setTheme();

    formhackshow();
    formhackhide('event-base-form');

  } else { done() }
};
